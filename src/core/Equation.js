import Input from "./Input";
import Output from "./Output";
import {$injections, $inputs, $outputs} from "../util/symbols";

export default class Equation {
	constructor({injections = {}, inputs = {}, outputs = {}}) {
		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	get injections() {
		return this[$injections];
	}
	set injections(injections) {
		if(injections instanceof Map) {
			this[$injections] = injections = new Map(injections);
		} else {
			this[$injections] = injections = Object.keys(injections).reduce((map, key) => {
				map.add(key, injections[key]);
			}, new Map());
		}

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
			if(typeof item == "object") {
				return new Input(item);
			}
			return new Input();
		};

		if(inputs instanceof Map) {
			let map = new Map();
			inputs.forEach((item, key) => {
				item = convert(item);
				item.symbol = key;
				map.add(key, item);
			});
			this[$inputs] = inputs = map;
		} else if(inputs instanceof Array) {
			this[$inputs] = inputs = inputs.reduce((map, item) => {
				map.add(item.symbol, convert(item));
			}, new Map());
		} else {
			this[$inputs] = inputs = Object.keys(inputs).reduce((map, key) => {
				let item = convert(inputs[key]);
				item.symbol = key;
				map.add(key, item);
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
			return new Output(item);
		};

		if(outputs instanceof Map) {
			let map = new Map();
			outputs.forEach((item, key) => {
				item = convert(item);
				item.symbol = key;
				map.add(key, item);
			});
			this[$outputs] = outputs = map;
		} else {
			this[$outputs] = Object.keys(outputs).reduce((map, key) => {
				let item = convert(outputs[key]);
				item.symbol = key;
				map.add(key, item);
			}, new Map());
		}

		outputs.forEach((item, key) => {
			if(item.symbol !== key || typeof key != "string") {
				throw new Error("Invalid output provided");
			}
		});
	}
}
