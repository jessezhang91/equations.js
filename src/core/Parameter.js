import * as di from "../util/di";
import * as async from "../util/async";
import {$meta} from "../util/symbols";

export default class Parameter {
	constructor({symbol, meta = {}} = {}) {
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
			let item = meta[key];
			if(di.isAnnotatable(item)) {
				item = di.annotate(item);
			}
			map.set(key, item);
			return map;
		}, new Map());
	}

	evaluateMeta(...stores) {
		let meta = new Map();

		this.meta.forEach((item, key) => {
			if(typeof item == "function") {
				item = di.inject(item, stores);
			}
			meta.set(key, item);
		});

		return async.props(meta);
	}
}
