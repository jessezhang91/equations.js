import Input from "./Input";
import Output from "./Output";
import {$injections, $inputs, $outputs, $evaluationOrder} from "../util/symbols";

export default class Equation {
	constructor({injections = {}, inputs = {}, outputs = {}} = {}) {
		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	get injections() {
		return this[$injections];
	}
	set injections(injections) {
		if(!(injections instanceof Map)) {
			this[$injections] = Object.keys(injections).reduce((map, key) => {
				map.set(key, injections[key]);
				return map;
			}, new Map());
			return;
		}

		this[$injections] = injections = new Map(injections);
		injections.forEach((item, key) => {
			if(typeof key != "string") {
				throw new Error("Invalid injection provided");
			}
		});
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

		if(inputs instanceof Map) {
			let map = new Map();
			inputs.forEach((item, key) => {
				item = convert(item);
				item.symbol = key;
				map.set(key, item);
			});
			this[$inputs] = inputs = map;
		} else if(inputs instanceof Array) {
			this[$inputs] = inputs = inputs.reduce((map, item) => {
				item = convert(item);
				map.set(item.symbol, item);
				return map;
			}, new Map());
		} else {
			this[$inputs] = inputs = Object.keys(inputs).reduce((map, key) => {
				let item = convert(inputs[key]);
				item.symbol = key;
				map.set(key, item);
				return map;
			}, new Map());
		}

		inputs.forEach((item, key) => {
			if(item.symbol !== key || typeof key != "string") {
				throw new Error("Invalid input provided");
			}
		});
	}

	get outputs() {
		return this[$outputs];
	}
	set outputs(outputs) {
		let convert = (item) => {
			if(item instanceof Output) {
				return item;
			}
			if(typeof item == "function") {
				return new Output({
					formula: item
				});
			}
			return new Output(item);
		};

		if(outputs instanceof Map) {
			let map = new Map();
			outputs.forEach((item, key) => {
				item = convert(item);
				item.symbol = key;
				map.set(key, item);
			});
			this[$outputs] = outputs = map;
		} else {
			this[$outputs] = outputs = Object.keys(outputs).reduce((map, key) => {
				let item = convert(outputs[key]);
				item.symbol = key;
				map.set(key, item);
				return map;
			}, new Map());
		}

		outputs.forEach((item, key) => {
			if(item.symbol !== key || typeof key != "string") {
				throw new Error("Invalid output provided");
			}
		});

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
}

function resolveEvaluationOrder(equation, evals) {
	let injections = Array.from(equation.injections.keys()),
		inputs = Array.from(equation.inputs.keys()),
		outputs = Array.from(equation.outputs.keys());

	if(!evals.size) {
		evals = new Set(outputs);
	}

	let dependencies = new Map();
	equation.outputs.forEach(function (output, key) {
		dependencies.set(key, output.dependencies);
	});

	let order = [];

	let processedOutputs = new Set();
	let processOutput = (key, set = new Set()) => {
		if(processedOutputs.has(key)) {
			return;
		}

		let deps = dependencies.get(key);
		if(!deps) {
			throw new Error("Output `" + key + "` not defined in equations set");
		}
		if(set.has(key)) {
			throw new Error("Output `" + key + "` has a circular dependency `" + Array.from(set.values()).join(" -> ") + " -> " + key + "`");
		}
		set.add(key);

		deps.filter((dep) => {
			return !~injections.indexOf(dep) && !~inputs.indexOf(dep);
		}).forEach((dep) => {
			if(!~outputs.indexOf(dep)) {
				throw new Error("Output `" + key + "` has a missing dependency `" + dep + "`");
			}

			processOutput(dep, new Set(set));
		});
		order.push(key);
		processedOutputs.add(key);
	};
	evals.forEach((key) => processOutput(key));

	return order;
}
