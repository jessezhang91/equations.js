module.exports = function () {
	return {
		inputs: {
			a: undefined
		},
		calculations: {
			b: function (c) {
				return c;
			}
		},
		outputs: {
			c: function (a, b) {
				return a + b;
			}
		}
	};
};