export function defer() {
	let deferred = {};
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
}

export function props(obj) {
	let keys = Object.keys(obj);
	let promises = keys.map((key) => {
		return obj[key];
	});

	return Promise.all(promises).then((values) => {
		return keys.reduce((memo, key, i) => {
			memo[key] = values[i];
			return memo;
		}, {});
	});
}

export function isThenable(p) {
	return !!p.then;
}
