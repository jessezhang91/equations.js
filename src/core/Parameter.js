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
	set meta(raw) {
		let meta = Object.keys(raw).reduce((memo, key) => {
			let item = raw[key];
			if(di.isAnnotatable(item)) {
				item = di.annotate(item);
			}
			memo[key] = item;
			return memo;
		}, {});

		this[$meta] = Object.freeze(meta);
	}

	evaluateMeta(...stores) {
		let meta = {};

		Object.keys(this.meta).forEach((key) => {
			let item = this.meta[key];
			if(typeof item == "function") {
				item = di.inject(item, stores);
			}
			meta[key] = item;
		});

		return async.props(meta);
	}
}
