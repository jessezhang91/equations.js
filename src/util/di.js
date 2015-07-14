import {$inject} from "./symbols";

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

	let matches = fn.toString().match(/^function(?: .*?| ?)\((.*?)\)\s?\{/);
	if(!matches.length) {
		matches = fn.toString().match(/^\((.*?)\)\s?=>\s?\{/);
	}
	fn[$inject] = matches[1].split(/\s*,\s*/).filter((a) => a);
	return fn;
}

function injectInternals(sync, fn, ...stores) {
	if(!fn[$inject]) {
		annotate(fn);
	}

	if(stores[0] instanceof Array) {
		stores = stores[0];
	}

	let items = fn[$inject].map((name) => {
		let foundStore = stores.find((store) => {
			return store[name] !== undefined;
		});
		if (foundStore === undefined) {
			throw new Error(`Cannot find dependency: ${name}`, fn);
		}
		return foundStore[name];
	});

	if(sync) {
		return fn.apply(this, items);
	}
	return Promise.all(items).then((args) => {
		return fn.apply(this, args);
	});
}

export function inject(fn, ...stores) {
	return injectInternals(false, fn, ...stores);
}

export function injectSync(fn, ...stores) {
	return injectInternals(true, fn, ...stores);
}

export function isAnnotatable(fn) {
	return (typeof fn == "function") || (Array.isArray(fn) && typeof fn[fn.length - 1] == "function");
}
