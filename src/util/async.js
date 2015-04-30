export function defer() {
	let deferred = {};
	deferred.promise = new Promise(function (resolve, reject) {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
}

export function props(obj) {
	let isMap = (obj instanceof Map);
	let keys = isMap ? Array.from(obj.keys()) : Object.keys(obj);
	let promises = isMap ? Array.from(obj.values()) : keys.map(function (key) {
		return obj[key];
	});

	return Promise.all(promises).then(function (values) {
		return keys.reduce(function (memo, key, i) {
			if(isMap) {
				memo.set(key, values[i]);
			} else {
				memo[key] = values[i];
			}
			return memo;
		}, isMap ? new Map() : {});
	});
}

export function isThenable(p) {
	return !!p.then;
}
