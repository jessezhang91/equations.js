import {$inject} from "../util/symbols";

export function annotate(fn) {
	if (typeof fn == "function" && fn[$inject] instanceof Array) {
		return fn;
	}

	if (fn instanceof Array) {
		let fields = fn;
		fn = fn.pop();
		fn[$inject] = fields;
		return fn;
	}

	fn[$inject] = fn.toString().match(/^function .*?\((.*?)\)/)[1].split(/\s*,\s*/).filter((a) => a);
	return fn;
}

export function inject(fn, ...stores) {
	if (!fn[$inject]) {
		fn = annotate(fn);
	}

	// TODO: Support function argument destructure syntax with native, babel, and traceur

	if(stores[0] instanceof Array) {
		stores = stores[0];
	}

	let promises = fn[$inject].map((name) => {
		// Replace this with "find" when that is ready
		let injection = stores.reduceRight((item, store) => {
			if(item !== undefined) {
				return item;
			}
			return store[name];
		}, undefined);

		if (injection === undefined) {
			throw new Error(`Cannot find dependency: ${name}`, fn);
		}
		return injection;
	});

	return Promise.all(promises).then((args) => {
		return fn.apply(this, args);
	});
}

export function isAnnotatable(fn) {
	return (typeof fn == "function") || (fn instanceof Array && typeof fn[fn.length - 1] == "function");
}
