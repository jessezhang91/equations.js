// import * as di from "../util/di";
import {$inject} from "../util/symbols";
import * as async from "../util/async";
import * as di from "../util/di";
import Equation from "./Equation";

export default class EquationSet {
	constructor({ options = {}, inputs = {}, calculations = {}, outputs = {} }) {
		this.options = options;

		// Initialize options
		if(typeof this.options.iterative == "object" || this.options.iterative === true) {
			let iterative = this.options.iterative = (this.options.iterative === true ? {} : this.options.iterative);
			iterative.maxSteps = (iterative.maxSteps == null || Number.isNaN(iterative.maxSteps) ? 1e-6 : Number(iterative.maxSteps));
			iterative.delta = (iterative.delta == null || Number.isNaN(iterative.delta) ? 1e-6 : Number(iterative.delta));
		} else {
			this.options.iterative = undefined;
		}

		// Initialize sets
		this.sets = {
			inputs: parseSet(inputs),
			calculations: parseSet(calculations),
			outputs: parseSet(outputs)
		};

		this.evaluationOrder = getEvaluationOrder(this.sets);
	}

	calculate(inputs, nonblocking = false) {
		return calculateInternals.bind(this)(inputs, nonblocking);
	}
}

function parseSet(set) {
	return Object.keys(set).reduce((memo, key) => {
		memo[key] = new Equation(key, set[key]);
		return memo;
	}, {});
}

function getEvaluationOrder(sets) {
	let dependencies = Object.keys(sets).reduce((memo, setKey) => {
		let set = sets[setKey];

		Object.keys(set).forEach((key) => {
			let equation = set[key];
			memo[key] = (equation.value === undefined ? (equation.equation ? equation.equation[$inject] : []) : []);
			return memo;
		});

		return memo;
	}, {});

	let order = [];
	let processedOutputs = new Set();
	let processOutput = (key, set = new Set()) => {
		if(processedOutputs.has(key)) {
			return;
		}

		let deps = dependencies[key];
		if(!deps) {
			throw new Error(`'${key}' not defined in equations set`);
		}
		if(set.has(key)) {
			let path = Array.from(set.values()).join(" -> ") + " -> " + key;
			throw new Error(`Output '${key}' has a circular dependency '${path}'`);
		}
		set.add(key);

		deps.forEach((dep) => {
			if(dependencies[dep] == null) {
				throw new Error(`'${key}' has a missing dependency '${dep}'`);
			}
			processOutput(dep, new Set(set));
		});
		processedOutputs.add(key);
		order.push(key);
	};
	Object.keys(dependencies).forEach((key) => processOutput(key));

	return order;
}

function calculateInternals(inputs, nonblocking) {
	let sets = this.sets,
		evaluationOrder = this.evaluationOrder;

	let inputKeys = new Set(Object.keys(sets.inputs));
	let equations = Object.keys(sets).reduce((memo, setKey) => {
		let set = sets[setKey];

		Object.keys(set).forEach((key) => {
			memo[key] = set[key];
		});
		return memo;
	}, {});

	// Get options
	let maxSteps = 0, delta = 0;
	if(this.options.iterative) {
		let iterative = this.options.iterative;
		maxSteps = iterative.maxSteps;
		delta = iterative.delta;
	}
	let allowNaN = !!this.options.allowNaN;

	// Get starting store
	let store, storePromises;
	storePromises = evaluationOrder.reduce((memo, key) => {
		memo[key] = (inputs[key] !== undefined && inputKeys.has(key) ? inputs[key] : equations[key].value);
		return memo;
	}, {});

	return async.props(storePromises).then((result) => {
		store = result;
		return step.bind(this)(0);
	});

	function step(n) {
		storePromises = evaluationOrder.reduce((memo, key) => {
			let equation = equations[key];
			if(equation.equation && (equation.value === undefined || n > 0)) {
				// Use last iteration if value is not undefined, otherwise, use current store
				memo[key] = di.inject(equation.equation, (equation.value === undefined ? memo : store));
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

				if(!allowNaN && Number.isNaN(curr)) {
					throw new Error(`${key} is NaN on step ${n}`);
				}

				// Matches
				if(prev === curr) {
					return false;
				}

				// Both are null or undefined
				if(prev == null && curr == null) {
					return false;
				}

				// One is null or undefined
				if(prev == null || curr == null) {
					return true;
				}

				// both NaN
				if(Number.isNaN(prev) && Number.isNaN(curr)) {
					return false;
				}

				// One is 0, check versus delta
				if(prev === 0 || curr === 0) {
					return Math.abs((prev - curr) / Math.max(Math.abs(prev), Math.abs(curr))) >= delta;
				}

				// Check versus delta
				return Math.abs((prev - curr) / curr) >= delta;
			});

			store = nextStore;

			let next = () => {
				return (++n > maxSteps || !dirty) ? formatResult(store) : step.bind(this)(n);
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
