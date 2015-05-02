"use strict";

describe("async util", function () {
	var async = require("../src/util/async");

	it("should defer", function (done) {
		var tests = [];
		var deferred = async.defer();
		expect(deferred).to.contain.keys(["promise", "resolve", "reject"]);

		deferred.resolve(1);
		tests[0] = expect(deferred.promise).to.eventually.be.fulfilled.and.equal(1);

		deferred.resolve(2);
		tests[1] = expect(deferred.promise).to.eventually.be.fulfilled.and.equal(1);

		deferred = async.defer();
		deferred.reject(new Error());
		tests[2] = expect(deferred.promise).to.eventually.be.rejected;

		expect(Promise.all(tests)).to.eventually.notify(done);
	});

	it("should return a promise that resolves when all promises in the object have resolved", function (done) {
		var tests = [];

		var deferred = async.defer();
		deferred.resolve("a");

		var rejected = async.defer();
		rejected.reject(new Error());

		var a = {
			a: 1,
			b: 2,
			c: 3
		};
		tests[0] = expect(async.props(a)).to.eventually.be.fulfilled.and.eql(a);

		var b = {
			a: deferred.promise,
			b: deferred.promise,
			c: 1
		};
		tests[1] = expect(async.props(b)).to.eventually.be.fulfilled.and.eql({
			a: "a",
			b: "a",
			c: 1
		});

		var c = {
			a: deferred.promise,
			b: rejected.promise,
			c: 1
		};
		tests[2] = expect(async.props(c)).to.eventually.be.rejected;

		expect(Promise.all(tests)).to.eventually.notify(done);
	});

	it("should check if thenable", function () {
		var p = new Promise(function () {});
		expect(async.isThenable(p)).to.be.true;

		expect(async.isThenable({})).to.be.false;
	});
});
