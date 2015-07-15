// import * as di from "../util/di";
import {$inject} from "../util/symbols";
import * as async from "../util/async";
import Equation from "./Equation";

export default class EquationSet {
	constructor({ options = {}, inputs = {}, calculations = {}, outputs = {} }) {
		this.options = parseOptions(options);

		// Initialize sets
		this.sets = parseSets(inputs, calculations, outputs);

		this.evaluationData = processSets(this.sets);
	}

	calculate(inputs, options = {}, nonblocking = false) {
		return calculateInternals.bind(this)(inputs, options, nonblocking);
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

function processSets(sets) {
	let {dependencies, hasInitials} = Object.keys(sets).reduce((memo, setKey) => {
		let set = sets[setKey];

		Object.keys(set).forEach((key) => {
			let equation = set[key];
			memo.dependencies[key] = equation.equation ? equation.equation[$inject] : [];
			memo.hasInitials[key] = equation.hasInitial;
			return memo;
		});

		return memo;
	}, {
		dependencies: {},
		hasInitials: {}
	});

	let order = [],
		circularInitials = {};

	let processOutput = (key, path = [], allowCircular = false) => {
		if (order.includes(key)) {
			return;
		}

		let deps = dependencies[key];
		if (!deps) {
			throw new Error(`'${key}' not defined in equations set`);
		}

		allowCircular = allowCircular || hasInitials[key];

		if (path.includes(key)) {
			if (!allowCircular) {
				let pathString = path.join(" -> ") + " -> " + key;
				throw new Error(`Output '${key}' has a circular dependency '${pathString}'`);
			}
			path.forEach((pathKey) => {
				if(hasInitials[pathKey]) {
					circularInitials[pathKey] = true;
				}
			});
			return;
		}

		path.push(key);
		deps.forEach((dep) => {
			if (dependencies[dep] == null) {
				throw new Error(`'${key}' has a missing dependency '${dep}'`);
			}
			processOutput(dep, path.slice(), allowCircular);
		});

		if (!order.includes(key)) {
			order.push(key);
		}
	};


	// Iterate through all dependencies
	Object.keys(dependencies).forEach((key) => processOutput(key));

	// Move circular initials to the front of order
	order = order.filter(function (key) {
		return !circularInitials[key];
	});
	order = Object.keys(circularInitials).concat(order);

	return {
		order,
		circularInitials
	};
}

function calculateInternals(inputs, optionOverrides = {}, nonblocking = false) {
	// Get locals
	let {
			sets,
			evaluationData: {
				order,
				circularInitials
			}
		} = this;

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
				memo[key] = equation.evaluate(circularInitials[key] ? store : memo);
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
