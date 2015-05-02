"use strict";

describe("core pieces", function () {
	var symbols = require("../src/util/symbols");

	var Input = eqns.Input,
		Output = eqns.Output,
		EquationSet = eqns.EquationSet;

	it("should create inputs", function () {
		var input = new Input({
			symbol: "a"
		});

		expect(input).to.be.instanceof(Input);
		expect(input.symbol).to.equal("a");
		expect(input.meta).to.be.instanceof(Object);
		expect(input.meta).to.be.empty;
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
		expect(input.meta).to.be.instanceof(Object);
		expect(input.meta).to.have.keys(["a", "b", "c"]);
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

		expect(input.meta).to.have.keys(["a", "b", "c"]);
		expect(input.meta.c).to.be.a("function");
		expect(input.meta.c[symbols.$inject]).to.eql(["x", "y", "z"]);
	});

	it("should evaluate meta", function (done) {
		var fn = function (x, y, z) {
			return Math.pow(x, y) / z;
		};

		var input = new Input({
			symbol: "a",
			meta: {
				fn: fn,
				c: 1
			}
		});

		expect(input.evaluateMeta({
			x: 2,
			y: 3,
			z: 4
		})).to.eventually.eql({
			fn: 2,
			c: 1
		}).and.notify(done);
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

	it("should evaluate outputs", function (done) {
		var fn = function (a, b, c) {
			return (a + b) * c;
		};

		var output = new Output({
			symbol: "fn",
			formula: fn
		});

		expect(output).to.be.instanceof(Output);
		expect(output.formula).to.be.a("function");
		expect(output.formula[symbols.$inject]).to.eql(["a", "b", "c"]);

		expect(output.evaluate({
			a: 1,
			b: 2,
			c: 3
		})).to.eventually.equal(9).and.notify(done);
	});

	it("should create equation set", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var equation = new EquationSet();
		expect(equation).to.be.instanceof(EquationSet);
		expect(equation.injections).to.be.instanceof(Object);
		expect(equation.inputs).to.be.instanceof(Object);
		expect(equation.outputs).to.be.instanceof(Object);

		equation = new EquationSet({});
		expect(equation).to.be.instanceof(EquationSet);

		equation = new EquationSet({
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
		expect(equation.injections.a).to.equal(1);
		expect(equation.inputs.b.symbol).to.equal("b");
		expect(equation.outputs.c.formula).to.equal(fn);
	});

	it("should create equation set with injection", function () {
		var equation = new EquationSet({
			injections: {
				a: 1,
				b: 2
			}
		});
		expect(equation.injections).to.have.keys(["a", "b"]);
		expect(equation.injections).to.eql({
			a: 1,
			b: 2
		});

		expect(function () {
			equation.injections.c = 3;
		}).to.throw(TypeError);
		expect(equation.injections.c).to.be.undefined;
	});

	it("should create equation set with inputs", function () {
		var equation = new EquationSet({
			inputs: [
				"a", {
					symbol: "b"
				}, new Input({
					symbol: "c"
				})
			]
		});
		expect(equation.inputs).to.have.keys(["a", "b", "c"]);
		expect(equation.inputs).to.satisfy(function (inputs) {
			return inputs.a.symbol === "a" &&
				inputs.b.symbol === "b" &&
				inputs.c.symbol === "c";
		});

		equation = new EquationSet({
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
		expect(equation.inputs).to.have.keys(["a", "b", "c"]);
		expect(equation.inputs).to.satisfy(function (inputs) {
			return inputs.a.symbol === "a" &&
				inputs.b.symbol === "b" &&
				inputs.c.symbol === "c";
		});

		expect(function () {
			equation.injections.d = 3;
		}).to.throw(TypeError);
		expect(equation.injections.d).to.be.undefined;

		expect(function () {
			equation = new EquationSet({
				inputs: [null]
			});
		}).to.throw(Error);
	});

	it("should create equation set with outputs", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var equation = new EquationSet({
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
		expect(equation.outputs).to.have.keys(["a", "b", "c"]);
		expect(equation.outputs).to.satisfy(function (outputs) {
			return outputs.a.symbol === "a" &&
				outputs.b.symbol === "b" &&
				outputs.c.symbol === "c";
		});
	});

	it("should get the evaluation order", function () {
		/* eslint-disable no-unused-vars */
		var equation = new EquationSet({
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
		equation = new EquationSet({
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
		equation = new EquationSet({
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
		/* eslint-disable no-unused-vars */
		var equation = new EquationSet({
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


		/* eslint-disable no-unused-vars */
		equation.outputs = {
			e: function (a, b, i) {},
			f: function (e) {},
			g: function (h) {},
			h: function (f, e) {},
			i: function (a) {},
			j: function (i, g) {}
		};
		/* eslint-enable no-unused-vars */

		/*
		 * e => a, b, i
		 * f => e
		 * g => h
		 * h => f, e
		 * i => a
		 * j => i, g
		 *
		 * ===> i, e, f, h, g, j
		 */
		var evaluationOrder2 = equation.evaluationOrder;
		expect(evaluationOrder2).to.equal(equation.evaluationOrder);
		expect(evaluationOrder2).to.not.equal(evaluationOrder);
		expect(evaluationOrder2).to.eql(["i", "e", "f", "h", "g", "j"]);
	});

	it("should evaluate equation set", function (done) {
		var tests = [];

		var equation = new EquationSet({
			injections: {
				a: 1
			},
			inputs: [
				"b",
				"c",
				{
					symbol: "d",
					meta: {
						z: function (h, i, j) {
							return (h + i) * j;
						}
					}
				}],
			outputs: {
				e: function (a, b) {
					return a + b;
				},
				f: function (e) {
					return Math.pow(e, 2);
				},
				g: function (h) {
					return h / 2;
				},
				h: function (f, e) {
					return f - e;
				},
				i: function (a) {
					return a * 2;
				},
				j: {
					formula: function (i, g) {
						return Math.pow(i, g);
					},
					meta: {
						a: function (b, g, f) {
							return b * g * f;
						}
					}
				}
			}
		});

		tests[0] = expect(equation.evaluate({
			b: 2,
			c: 3,
			d: Promise.resolve(4)
		})).to.eventually.eql({
			inputs: {
				b: {
					value: 2,
					meta: {}
				},
				c: {
					value: 3,
					meta: {}
				},
				d: {
					value: 4,
					meta: {
						z: 64
					}
				}
			},
			outputs: {
				e: {
					value: 3,
					meta: {}
				},
				f: {
					value: 9,
					meta: {}
				},
				h: {
					value: 6,
					meta: {}
				},
				g: {
					value: 3,
					meta: {}
				},
				i: {
					value: 2,
					meta: {}
				},
				j: {
					value: 8,
					meta: {
						a: 54
					}
				}
			}
		});


		equation = new EquationSet({
			injections: {
				a: 1
			},
			inputs: [
				"b",
				"c",
				{
					symbol: "d",
					meta: {
						z: function (b, e) {
							return e / b;
						}
					}
				}],
			outputs: {
				e: function (a, b) {
					return a + b;
				},
				f: function (e) {
					return Math.pow(e, 2);
				},
				g: function (h) {
					return h / 2;
				},
				h: function (f, e) {
					return f - e;
				},
				i: function (a) {
					return a * 2;
				},
				j: {
					formula: function (i, g) {
						return Math.pow(i, g);
					},
					meta: {
						a: function (b, g, f) {
							return b * g * f;
						}
					}
				}
			}
		});

		tests[1] = expect(equation.evaluate({
			b: 2,
			c: 3,
			d: Promise.resolve(4)
		}, ["e"])).to.eventually.eql({
			inputs: {
				b: {
					value: 2,
					meta: {}
				},
				c: {
					value: 3,
					meta: {}
				},
				d: {
					value: 4,
					meta: {
						z: 1.5
					}
				}
			},
			outputs: {
				e: {
					value: 3,
					meta: {}
				}
			}
		});


		tests[2] = expect(equation.evaluate({
			b: 2,
			c: 3,
			d: Promise.resolve(4)
		}, "e")).to.eventually.eql({
			inputs: {
				b: {
					value: 2,
					meta: {}
				},
				c: {
					value: 3,
					meta: {}
				},
				d: {
					value: 4,
					meta: {
						z: 1.5
					}
				}
			},
			outputs: {
				e: {
					value: 3,
					meta: {}
				}
			}
		});


		expect(Promise.all(tests)).to.be.fulfilled.and.notify(done);
	});
});
