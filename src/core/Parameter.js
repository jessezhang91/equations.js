import {$meta} from "../util/symbols";

export default class Parameter {
	constructor({symbol, meta = {}}) {
		this.symbol = symbol;
		this.meta = meta;
	}

	get meta() {
		return this[$meta];
	}
	set meta(meta) {
		if(meta instanceof Map) {
			this[$meta] = meta;
			return;
		}

		this[$meta] = Object.keys(meta).reduce((map, key) => {
			map.set(key, meta[key]);
		}, new Map());
	}

	evaluateMeta(...stores) {
		//
	}
}
