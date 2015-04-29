export function defer() {
	let deferred = {};
	deferred.promise = new Promise(function (resolve, reject) {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
}

export function props(obj) {
	let keys = Object.keys(obj),
		promises = keys.map(function (key) {
			return obj[key];
		});

	return Promise.all(promises).then(function (values) {
		return keys.reduce(function (memo, key, i) {
			memo[key] = values[i];
			return memo;
		}, {});
	});
}

export function isThenable(p) {
	return !!p.then;
}
