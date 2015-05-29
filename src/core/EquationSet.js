import Input from "./Input";
import Output from "./Output";
import * as async from "../util/async";
import {$name, $injections, $inputs, $outputs, $evaluationOrder} from "../util/symbols";
import {store, plugins} from "../util/state";

export default class EquationSet {
	constructor({name = null, injections = {}, inputs = {}, outputs = {}} = {}) {
		this.name = name;
		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	get name() {
		return this[$name];
	}
	set name(name) {
		let prevName = this[$name];
		if(prevName === name) {
			return;
		}

		if(prevName != null && store.has(prevName)) {
			store.delete(prevName);
		}
		if(name != null) {
			if(store.has(name)) {
				throw new Error(`Equation Set '${name}' already exists.`);
			}
			store.set(name, this);
		}
		this[$name] = name;
	}

	get injections() {
		return this[$injections];
	}
	set injections(injections) {
		this[$injections] = Object.freeze(injections);
	}

	get inputs() {
		return this[$inputs];
	}
	set inputs(inputs) {
		let convert = (item) => {
			if(item instanceof Input) {
				return item;
			}
			if(typeof item == "string") {
				return new Input({
					symbol: item
				});
			}
			if(typeof item == "object" && item != null) {
				return new Input(item);
			}
			return new Input();
		};

		if(inputs instanceof Array) {
			inputs = inputs.reduce((memo, item) => {
				item = convert(item);
				memo[item.symbol] = item;

				if(typeof item.symbol != "string") {
					throw new Error(`Invalid input symbol '${item.symbol}'`);
				}

				return memo;
			}, {});
		} else {
			inputs = Object.keys(inputs).reduce((memo, key) => {
				let item = convert(inputs[key]);
				item.symbol = key;
				memo[key] = item;
				return memo;
			}, {});
		}

		this[$inputs] = Object.freeze(inputs);
	}

	get outputs() {
		return this[$outputs];
	}
	set outputs(outputs) {
		let convert = (item) => {
			if(item instanceof Output) {
				return item;
			}
			if(typeof item == "function" || item instanceof Array) {
				return new Output({
					formula: item
				});
			}
			return new Output(item);
		};


		if(outputs instanceof Array) {
			outputs = outputs.reduce((memo, item) => {
				item = convert(item);
				memo[item.symbol] = item;

				if(typeof item.symbol != "string") {
					throw new Error(`Invalid output symbol '${item.symbol}'`);
				}

				return memo;
			}, {});
		} else {
			outputs = Object.keys(outputs).reduce((memo, key) => {
				let item = convert(outputs[key]);
				item.symbol = key;
				memo[key] = item;
				return memo;
			}, {});
		}

		this[$outputs] = Object.freeze(outputs);
		this[$evaluationOrder] = null;
	}

	get evaluationOrder() {
		return this.getEvaluationOrder();
	}

	getEvaluationOrder(...evals) {
		if(evals[0] instanceof Array) {
			evals = evals[0];
		}
		evals = new Set(evals);

		if(this[$evaluationOrder] == null) {
			this[$evaluationOrder] = new Map();
		}

		let cacheKey = Array.from(evals).join(),
			cache = this[$evaluationOrder].get(cacheKey);
		if(cache) {
			return cache;
		}
		cache = resolveEvaluationOrder(this, evals);
		this[$evaluationOrder].set(cacheKey, cache);

		return cache;
	}

	evaluate(rawIns, ...evals) {
		let pickedIns = pickKeys(rawIns, Object.keys(this.inputs));

		let prePromise = async.props(pickedIns);
		plugins.pre.forEach((plugin) => {
			prePromise = prePromise.then((data) => {
				return plugin.call(this, data);
			});
		});

		let postPromise = prePromise.then((ins) => {
			return this.evaluateRaw.apply(this, [].concat([ins]).concat(evals));
		});
		plugins.post.forEach((plugin) => {
			postPromise = postPromise.then((data) => {
				return plugin.call(this, data);
			});
		});

		return postPromise;
	}

	evaluateRaw(rawIns, ...evals) {
		let ins = pickKeys(rawIns, Object.keys(this.inputs));

		let injections = this.injections,
			inputs = this.inputs,
			outputs = this.outputs;

		let outs = {};
		this.getEvaluationOrder.apply(this, evals).forEach((key) => {
			outs[key] = outputs[key].evaluate(injections, ins, outs);
		});

		let inMetas = {};
		Object.keys(ins).forEach((key) => {
			inMetas[key] = inputs[key].evaluateMeta(injections, ins, outs);
		});

		let outMetas = {};
		Object.keys(outs).forEach((key) => {
			outMetas[key] = outputs[key].evaluateMeta(injections, ins, outs);
		});


		return async.props({
			inputs: async.props(ins),
			outputs: async.props(outs),
			metas: async.props({
				inputs: async.props(inMetas),
				outputs: async.props(outMetas)
			})
		}).then((data) => {
			return {
				inputs: packageResult(data.inputs, data.metas.inputs),
				outputs: packageResult(data.outputs, data.metas.outputs)
			};
		});
	}
}

function packageResult(items, metas) {
	return Object.keys(items).reduce((memo, key) => {
		memo[key] = {
			value: items[key],
			meta: metas[key]
		};
		return memo;
	}, {});
}

function pickKeys(item, keys) {
	return keys.reduce((memo, key) => {
		memo[key] = item[key];
		return memo;
	}, {});
}

function resolveEvaluationOrder(equation, evals) {
	let injections = Object.keys(equation.injections),
		inputs = Object.keys(equation.inputs),
		outputs = Object.keys(equation.outputs);

	if(!evals.size) {
		evals = new Set(outputs);
	}

	let dependencies = new Map();
	outputs.forEach((key) => {
		dependencies.set(key, equation.outputs[key].dependencies);
	});

	let order = [];

	let processedOutputs = new Set();
	let processOutput = (key, set = new Set()) => {
		if(processedOutputs.has(key)) {
			return;
		}

		let deps = dependencies.get(key);
		if(!deps) {
			throw new Error(`Output '${key}' not defined in equations set`);
		}
		if(set.has(key)) {
			let path = Array.from(set.values()).join(" -> ") + " -> " + key;
			throw new Error(`Output '${key}' has a circular dependency '${path}'`);
		}
		set.add(key);

		deps.filter((dep) => {
			return !~injections.indexOf(dep) && !~inputs.indexOf(dep);
		}).forEach((dep) => {
			if(!~outputs.indexOf(dep)) {
				throw new Error(`Output '${key}' has a missing dependency '${dep}'`);
			}

			processOutput(dep, new Set(set));
		});
		order.push(key);
		processedOutputs.add(key);
	};
	evals.forEach((key) => processOutput(key));

	return order;
}

export function factory(opts) {
	return new EquationSet(opts);
}
