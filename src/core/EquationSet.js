// import * as di from "../util/di";
import {$inject} from "../util/symbols";
import * as async from "../util/async";
import Equation from "./Equation";

export default class EquationSet {
	constructor({ options = {}, inputs = {}, calculations = {}, outputs = {} }) {
		this.options = parseOptions(options);

		// Initialize sets
		this.sets = parseSets(inputs, calculations, outputs);

		this.evaluationOrder = getEvaluationOrder(this.sets);
	}

	calculate(inputs = {}, options = {}, nonblocking = false) {
		return this.evaluationOrder.then((order) => {
			return calculateInternals.bind(this)(order, inputs, options, nonblocking);
		});
	}
}

function parseSets(inputs, calculations, outputs) {
	return {
		inputs: parseSet(inputs),
		calculations: parseSet(calculations),
		outputs: parseSet(outputs)
	};
}

function parseSet(set) {
	return Object.keys(set).reduce((memo, key) => {
		memo[key] = new Equation(key, set[key]);
		return memo;
	}, {});
}

function getEvaluationOrder(sets) {
	let {dependencies, hasInitials, deferrals} = Object.keys(sets).reduce((memo, setKey) => {
		let set = sets[setKey];

		Object.keys(set).forEach((key) => {
			let equation = set[key];
			memo.dependencies[key] = equation.equation ? equation.equation[$inject] : [];

			let deferred = memo.deferrals[key] = async.defer();
			if(equation.hasInitial) {
				memo.hasInitials[key] = true;
				deferred.resolve();
			}
			return memo;
		});

		return memo;
	}, {
		dependencies: {},
		hasInitials: {},
		deferrals: {}
	});

	// Find circular dependencies
	let processedOutputs = [];
	let processOutput = (key, path = []) => {
		if (processedOutputs.includes(key) || hasInitials[key]) {
			return;
		}

		let deps = dependencies[key];
		if (!deps) {
			throw new Error(`'${key}' not defined in equations set`);
		}

		if (path.includes(key)) {
			let pathString = path.join(" -> ") + " -> " + key;
			throw new Error(`Output '${key}' has a circular dependency '${pathString}'`);
		}

		path.push(key);
		deps.forEach((dep) => {
			if (dependencies[dep] == null) {
				throw new Error(`'${key}' has a missing dependency '${dep}'`);
			}
			processOutput(dep, path.slice());
		});

		processedOutputs.push(key);
	};

	// Iterate through all dependencies
	Object.keys(dependencies).forEach((key) => processOutput(key));


	// Find the order
	let order = [],
		promises = [];

	Object.keys(dependencies).forEach((key) => {
		let deps = dependencies[key].map((dep) => {
			return deferrals[dep].promise;
		});

		Promise.all(deps).then(() => {
			deferrals[key].resolve();
		});
		deferrals[key].promise.then(() => {
			order.push(key);
		});
		promises.push(deferrals[key].promise);
	});

	return Promise.all(promises).then(() => {
		return order;
	});
}

function calculateInternals(order, inputs, optionOverrides = {}, nonblocking = false) {
	// Get locals
	let sets = this.sets;

	// Destructure options
	let {
		iterative: {maxSteps, delta},
		allowNaN
	} = parseOptions(Object.assign({}, this.options, optionOverrides));

	// Get all equations
	let equations = Object.keys(sets).reduce((memo, setKey) => {
		let set = sets[setKey];

		Object.keys(set).forEach((key) => {
			memo[key] = set[key];
		});
		return memo;
	}, {});

	// Get starting store
	let store, storePromises;
	let inputKeys = new Set(Object.keys(sets.inputs));

	// First step
	storePromises = order.reduce((memo, key) => {
		// If input is defined, use the input value. Otherwise, use the equation initial value
		if(inputs[key] !== undefined && inputKeys.has(key)) {
			memo[key] = inputs[key];
			return memo;
		}

		let equation = equations[key];
		if(equation.hasInitial) {
			memo[key] = equation.initial;
			return memo;
		}

		memo[key] = equation.evaluate(memo);
		return memo;
	}, {});

	return async.props(storePromises).then((result) => {
		store = result;
		return step.bind(this)(0);
	});

	function step(n) {
		if (++n > maxSteps) {
			return formatResult(store);
		}

		storePromises = order.reduce((memo, key) => {
			let equation = equations[key];
			if (equation.equation) {
				// Use last iteration if value is not undefined, otherwise, use current store
				memo[key] = equation.evaluate(equation.hasInitial ? store : memo);
			} else {
				memo[key] = store[key];
			}
			return memo;
		}, {});

		return async.props(storePromises).then((nextStore) => {
			// Check delta
			let dirty = Object.keys(nextStore).some((key) => {
				let prev = store[key],
					curr = nextStore[key];

				if (!allowNaN && Number.isNaN(curr)) {
					throw new Error(`${key} is NaN on step ${n}`);
				}

				// Matches
				if (prev === curr) {
					return false;
				}

				// Both are null or undefined
				if (prev == null && curr == null) {
					return false;
				}

				// One is null or undefined
				if (prev == null || curr == null) {
					return true;
				}

				// both NaN
				if (Number.isNaN(prev) && Number.isNaN(curr)) {
					return false;
				}

				// One is 0, check versus delta
				if (prev === 0 || curr === 0) {
					return Math.abs((prev - curr) / Math.max(Math.abs(prev), Math.abs(curr))) >= delta;
				}

				// Check versus delta
				return Math.abs((prev - curr) / curr) >= delta;
			});

			store = nextStore;

			let next = () => {
				return !dirty ? formatResult(store) : step.bind(this)(n);
			};
			return nonblocking ? new Promise((resolve) => setTimeout(() => resolve(next.bind(this)()))) : next();
		});
	}

	function formatResult(result) {
		return Object.keys(sets).reduce((setMemo, setKey) => {
			let set = sets[setKey];

			setMemo[setKey] = Object.keys(set).reduce((memo, key) => {
				memo[key] = result[key];
				return memo;
			}, {});
			return setMemo;
		}, {});
	}
}

function parseOptions(options) {
	let out = Object.assign({}, options);

	// Check iterative
	if (out.iterative == null || !(typeof out.iterative == "object")) {
		if (out.iterative === true) {
			out.iterative = {
				maxSteps: 100,
				delta: 1e-6
			};
		} else {
			out.iterative = {
				maxSteps: 0,
				delta: 0
			};
		}
	}

	// Check allowNaN
	out.allowNaN = !!out.allowNaN;

	return out;
}
