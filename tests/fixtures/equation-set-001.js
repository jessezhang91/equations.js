module.exports = function () {
	return {
		options: {
			iterative: {
				maxSteps: 100,
				delta: 1e-6
			}
		},
		inputs: {
			a: 5,
			b: 5,
			c: 5,
			d: function (a, b, c) {
				return a + b + c;
			},
			e: function (c, d) {
				return c * d;
			}
		},
		calculations: {
			f: function (a, b) {
				return a * b;
			},
			g: {
				initial: 1,
				equation: function (c, d, h) {
					return c + d + h;
				}
			},
			h: function (g) {
				return g;
			},
			i: function (j, l) {
				return j / l;
			}
		},
		outputs: {
			j: function (l, k) {
				return l + k + 1;
			},
			k: {
				initial: 1,
				equation: function (i, j, k) {
					return i + j / k;
				}
			},
			l: {
				initial: 1,
				equation: function (l) {
					return l + 1;
				}
			}
		}
	};
};