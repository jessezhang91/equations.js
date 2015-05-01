"use strict";

describe("core pieces", function () {
	var di = require("../src/util/di"),
		symbols = require("../src/util/symbols");

	var Input = eqns.Input,
		Output = eqns.Output,
		Equation = eqns.Equation;

	it("should create inputs", function () {
		var input = new Input({
			symbol: "a"
		});

		expect(input).to.be.instanceof(Input);
		expect(input.symbol).to.equal("a");
		expect(input.meta).to.be.instanceof(Map);
		expect(input.meta.size).to.equal(0);
	});

	it("should create inputs with meta object", function () {
		var input = new Input({
			symbol: "a",
			meta: {
				a: 0,
				b: 1,
				c: 2
			}
		});

		expect(input).to.be.instanceof(Input);
		expect(input.symbol).to.equal("a");
		expect(input.meta).to.be.instanceof(Map);
		expect(input.meta.size).to.equal(3);
	});

	it("should create inputs with meta map", function () {
		var input = new Input({
			symbol: "a",
			meta: new Map([
				["a", 0],
				["b", 1],
				["c", 2]
			])
		});

		expect(input).to.be.instanceof(Input);
		expect(input.symbol).to.equal("a");
		expect(input.meta).to.be.instanceof(Map);
		expect(input.meta.size).to.equal(3);
	});

	it("should annotate meta if annotatable", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var input = new Input({
			symbol: "a",
			meta: {
				a: 0,
				b: 1,
				c: fn
			}
		});

		expect(input.meta.size).to.equal(3);
		expect(input.meta.get("c")).to.be.a("function");
		expect(input.meta.get("c")[symbols.$inject]).to.eql(["x", "y", "z"]);
	});

	it("should create outputs", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var output = new Output({
			symbol: "a",
			formula: fn
		});

		expect(output).to.be.instanceof(Output);
		expect(output.formula).to.be.a("function");
		expect(output.formula[symbols.$inject]).to.eql(["x", "y", "z"]);
	});

	it("should create equations", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var equation = new Equation();
		expect(equation).to.be.instanceof(Equation);
		expect(equation.injections).to.be.instanceof(Map);
		expect(equation.inputs).to.be.instanceof(Map);
		expect(equation.outputs).to.be.instanceof(Map);

		equation = new Equation({});
		expect(equation).to.be.instanceof(Equation);

		equation = new Equation({
			injections: {
				a: 1
			},
			inputs: {
				b: new Input("a")
			},
			outputs: {
				c: fn
			}
		});
		expect(equation.injections.get("a")).to.equal(1);
		expect(equation.inputs.get("b").symbol).to.equal("b");
		expect(equation.outputs.get("c").formula).to.equal(fn);
	});

	it("should create equations with injection", function () {
		var equation = new Equation({
			injections: {
				a: 1,
				b: 2
			}
		});
		expect(equation.injections.size).to.equal(2);
		expect(Array.from(equation.injections.entries())).to.eql([
			["a", 1],
			["b", 2]
		]);

		equation = new Equation({
			injections: new Map([
				["a", 1],
				["b", 2]
			])
		});
		expect(equation.injections.size).to.equal(2);
		expect(Array.from(equation.injections.entries())).to.eql([
			["a", 1],
			["b", 2]
		]);

		expect(function () {
			equation = new Equation({
				injections: new Map([
					[{}, 1]
				])
			});
		}).to.throw(Error);
	});

	it("should create equations with inputs", function () {
		var equation = new Equation({
			inputs: [
				"a", {
					symbol: "b"
				}, new Input({
					symbol: "c"
				})
			]
		});
		expect(equation.inputs.size).to.equal(3);
		expect(equation.inputs).to.satisfy(function (inputs) {
			return inputs.get("a").symbol === "a" &&
				inputs.get("b").symbol === "b" &&
				inputs.get("c").symbol === "c";
		});

		equation = new Equation({
			inputs: {
				a: true,
				b: {
					symbol: "c"
				},
				c: new Input({
					symbol: "a"
				})
			}
		});
		expect(equation.inputs.size).to.equal(3);
		expect(equation.inputs).to.satisfy(function (inputs) {
			return inputs.get("a").symbol === "a" &&
				inputs.get("b").symbol === "b" &&
				inputs.get("c").symbol === "c";
		});

		equation = new Equation({
			inputs: new Map([
				[
					"a", true
				],
				[
					"b", {
						symbol: "c"
					}
				],
				[
					"c", new Input({
						symbol: "a"
					})
				]
			])
		});
		expect(equation.inputs.size).to.equal(3);
		expect(equation.inputs).to.satisfy(function (inputs) {
			return inputs.get("a").symbol === "a" &&
				inputs.get("b").symbol === "b" &&
				inputs.get("c").symbol === "c";
		});

		expect(function () {
			equation = new Equation({
				inputs: [null]
			});
		}).to.throw(Error);
	});

	it("should create equations with outputs", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var equation = new Equation({
			outputs: {
				a: fn,
				b: {
					symbol: "c",
					formula: fn
				},
				c: new Output({
					symbol: "a",
					formula: fn
				})
			}
		});
		expect(equation.outputs.size).to.equal(3);
		expect(equation.outputs).to.satisfy(function (outputs) {
			return outputs.get("a").symbol === "a" &&
				outputs.get("b").symbol === "b" &&
				outputs.get("c").symbol === "c";
		});

		equation = new Equation({
			outputs: new Map([
				[
					"a", fn
				],
				[
					"b", {
						symbol: "c",
						formula: fn
					}
				],
				[
					"c", new Output({
						symbol: "a",
						formula: fn
					})
				]
			])
		});
		expect(equation.outputs.size).to.equal(3);
		expect(equation.outputs).to.satisfy(function (outputs) {
			return outputs.get("a").symbol === "a" &&
				outputs.get("b").symbol === "b" &&
				outputs.get("c").symbol === "c";
		});

		expect(function () {
			equation = new Equation({
				outputs: new Map([
					[
						{}, new Output({
							symbol: "a",
							formula: fn
						})
					]
				])
			});
		}).to.throw(Error);
	});

	it("should get the evaluation order", function () {
		/* eslint-disable no-unused-vars */
		var equation = new Equation({
			injections: {
				a: 1
			},
			inputs: {
				b: true,
				c: null,
				d: {
					symbol: "-"
				}
			},
			outputs: {
				e: function (a, b) {},
				f: function (e) {},
				g: function (h) {},
				h: function (f, e) {},
				i: function (a) {},
				j: function (i, g) {}
			}
		});
		/* eslint-enable no-unused-vars */

		/*
		 * e => a, b
		 * f => e
		 * g => h
		 * h => f, e
		 * i => a
		 * j => i, g
		 *
		 * ===> e, f, h, g, i, j
		 */

		var evaluationOrder = equation.evaluationOrder;
		expect(evaluationOrder).to.equal(equation.evaluationOrder);

		expect(evaluationOrder).to.eql(["e", "f", "h", "g", "i", "j"]);

		expect(equation.getEvaluationOrder("g")).to.eql(["e", "f", "h", "g"]);

		expect(equation.getEvaluationOrder("f", "i")).to.eql(["e", "f", "i"]);

		expect(equation.getEvaluationOrder(["f", "i"])).to.eql(["e", "f", "i"]);

		expect(function () {
			equation.getEvaluationOrder("n");
		}).to.throw(/not defined/);



		/* eslint-disable no-unused-vars */
		equation = new Equation({
			injections: {
				a: 1
			},
			inputs: {
				b: true,
				c: null,
				d: {
					symbol: "-"
				}
			},
			outputs: {
				e: function (a, b, g) {},
				f: function (e) {},
				g: function (h) {},
				h: function (f) {},
				i: function (a) {},
				j: function (i, g) {}
			}
		});
		/* eslint-enable no-unused-vars */

		/*
		 * e => a, b, g
		 * f => e
		 * g => h
		 * h => f
		 * i => a
		 * j => i, g
		 *
		 * =x=> e -> g -> h -> f -> e
		 */
		expect(function () {
			equation.evaluationOrder;
		}).to.throw(/e -> g -> h -> f -> e/);



		/* eslint-disable no-unused-vars */
		equation = new Equation({
			outputs: {
				e: function (a, b) {}
			}
		});
		/* eslint-enable no-unused-vars */

		expect(function () {
			equation.evaluationOrder;
		}).to.throw(/missing dependency/);
	});

	it("should reset evaluation cache when new outputs are added", function () {
		//
	});
});
