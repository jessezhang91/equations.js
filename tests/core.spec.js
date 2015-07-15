"use strict";

describe("core pieces", function () {
	it("should run iteratively blocking", function (next) {
		var blocked = true;
		setTimeout(function () {
			blocked = false;
		});

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
				g: 901,
				h: 901,
				i: 1.120677188288663
			},
			outputs: {
				j: 113.18839601715496,
				k: 11.188396017154957,
				l: 101
			}
		}).and.satisfy(function () {
			return blocked;
		}).and.notify(next);
	});

	it("should run iteratively non-blocking", function (next) {
		var blocked = true;
		setTimeout(function () {
			blocked = false;
		});

		var equationSet = require("./fixtures/equation-set-001");
		var promise = eqns(equationSet).calculate({
			a: 1,
			b: 2,
			c: 3
		}, null, true);

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
				g: 901,
				h: 901,
				i: 1.120677188288663
			},
			outputs: {
				j: 113.18839601715496,
				k: 11.188396017154957,
				l: 101
			}
		}).and.satisfy(function () {
			return !blocked;
		}).and.notify(next);
	});

	it("should run once with options", function (next) {
		var equationSet = require("./fixtures/equation-set-001");
		var promise = eqns(equationSet).calculate({
			a: 1,
			b: 2,
			c: 3,
			d: 4,
			e: 5
		}, {
			iterative: false
		});

		expect(promise).to.eventually.be.eql({
			inputs: {
				a: 1,
				b: 2,
				c: 3,
				d: 4,
				e: 5
			},
			calculations: {
				f: 2,
				g: 1,
				h: 1,
				i: 3
			},
			outputs: {
				j: 3,
				k: 1,
				l: 1
			}
		}).and.notify(next);
	});

	it("should run iteratively with options", function (next) {
		var equationSet = require("./fixtures/equation-set-001");
		var promise = eqns(equationSet).calculate({
			a: 1,
			b: 2,
			c: 3
		}, {
			iterative: {
				maxSteps: 100,
				delta: 0.02
			}
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

	it("should find circular dependencies", function () {
		var equationSet = require("./fixtures/equation-set-002");
		expect(function () {
			eqns(equationSet);
		}).to.throw(/circular dependency/);
	});
});
