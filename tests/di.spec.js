"use strict";

describe("dependency injection", function () {
	var di = require("../src/util/di"),
		symbols = require("../src/util/symbols");

	var annotate = di.annotate,
		inject = di.inject,
		$inject = symbols.$inject;

	it("should annotate functions", function () {
		/*eslint-disable no-unused-vars */
		var a = function (a, b, c) {
				//
			}, b = function (e, f, g, h) {
				//
			}, c = function () {
				//
			};

		function d(a, b, c) {
			//
		}
		/*eslint-enable no-unused-vars */

		annotate(a);
		annotate(b);
		annotate(c);
		annotate(d);

		expect(a[$inject]).to.exist;
		expect(b[$inject]).to.exist;
		expect(c[$inject]).to.exist;
		expect(d[$inject]).to.exist;

		expect(a[$inject]).to.eql(["a", "b", "c"]);
		expect(b[$inject]).to.eql(["e", "f", "g", "h"]);
		expect(c[$inject]).to.eql([]);
		expect(d[$inject]).to.eql(["a", "b", "c"]);
	});

	it("should not re-annotate functions", function () {
		/*eslint-disable no-unused-vars */
		var a = function (a, b, c) {
			//
		};
		/*eslint-enable no-unused-vars */

		annotate(a);
		expect(a[$inject]).to.exist;
		expect(a[$inject]).to.eql(["a", "b", "c"]);

		var annotations = a[$inject];
		annotate(a);

		expect(a[$inject]).to.equal(annotations);
	});

	it("should handle array-annotation notation", function () {
		/*eslint-disable no-unused-vars */
		var fn = function (a, b, c) {
			//
		};
		/*eslint-enable no-unused-vars */

		var a = ["a", "b", "c", fn];
		var b = annotate(a);

		expect(b).to.be.a("function");
		expect(b).to.equal(fn);
		expect(b[$inject]).to.eql(["a", "b", "c"]);
	});

	it("should inject values from store", function (done) {
		/*eslint-disable no-unused-vars */
		var fn = function (a, b, c) {
			return Array.prototype.slice.apply(arguments);
		};
		/*eslint-enable no-unused-vars */

		var out = inject(fn, {
			a: 1,
			b: 2,
			c: 3
		});
		expect(out).to.eventually.eql([1, 2, 3]);

		out = inject(fn, {
			a: 3,
			b: 4,
			c: 5
		});
		expect(out).to.eventually.eql([3, 4, 5]).and.notify(done);
	});

	it("should inject values from multiple stores", function (done) {
		/*eslint-disable no-unused-vars */
		var fn = function (a, b, c) {
			return Array.prototype.slice.apply(arguments);
		};
		/*eslint-enable no-unused-vars */

		var out = inject(fn, {
			a: 1
		}, {
			b: 2
		}, {
			c: 3
		});
		expect(out).to.eventually.eql([1, 2, 3]);

		out = inject(fn, [{
			a: 3,
			b: 4
		}, {
			c: 5
		}]);
		expect(out).to.eventually.eql([3, 4, 5]);

		out = inject(fn, [{
			a: 3,
			b: 4,
			c: 5
		}, {
			c: 6
		}]);
		expect(out).to.eventually.eql([3, 4, 6]).and.notify(done);
	});

	it("should throw error if missing injection value", function () {
		/*eslint-disable no-unused-vars */
		var fn = function (a, b, c) {
			return Array.prototype.slice.apply(arguments);
		};
		/*eslint-enable no-unused-vars */

		expect(function () {
			inject(fn, {
				a: 1,
				b: 2
			});
		}).to.throw(Error);
	});
});
