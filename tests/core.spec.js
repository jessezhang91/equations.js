"use strict";

describe("core pieces", function () {
	it.only("should run", function (next) {
		var equationSet = require("./fixtures/equation-set-001");
		var promise = eqns(equationSet).calculate({
			a: 1,
			b: 2,
			c: 3
		});

		expect(promise).to.eventually.be.eql({
			inputs: {
				a: 1,
				b: 2,
				c: 3,
				d: 6,
				e: 18
			},
			calculations: {
				f: 2,
				g: 451,
				h: 451,
				i: 1.1832598645005545
			},
			outputs: {
				j: 60.34625308952828,
				k: 8.346253089528284,
				l: 51
			}
		}).and.notify(next);
	});
});
