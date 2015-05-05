"use strict";

describe("core pieces", function () {
	var symbols = require("../src/util/symbols"),
		state = require("../src/util/state");
	var store = state.store,
		plugins = state.plugins;

	var Input = eqns.Input,
		Output = eqns.Output,
		EquationSet = eqns.EquationSet,
		inputFactory = eqns.input,
		outputFactory = eqns.output,
		equationSetFactory = eqns.equationSet;

	beforeEach(function () {
		store.clear();
		plugins.pre.splice(0, plugins.pre.length);
		plugins.post.splice(0, plugins.post.length);
		Object.keys(plugins.fn).forEach(function (key) {
			delete plugins.fn[key];
		});
	});

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

		var equationSet = new EquationSet();
		expect(equationSet).to.be.instanceof(EquationSet);
		expect(equationSet.injections).to.be.instanceof(Object);
		expect(equationSet.inputs).to.be.instanceof(Object);
		expect(equationSet.outputs).to.be.instanceof(Object);

		equationSet = new EquationSet({});
		expect(equationSet).to.be.instanceof(EquationSet);

		equationSet = new EquationSet({
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
		expect(equationSet.injections.a).to.equal(1);
		expect(equationSet.inputs.b.symbol).to.equal("b");
		expect(equationSet.outputs.c.formula).to.equal(fn);
	});

	it("should create equation set with injection", function () {
		var equationSet = new EquationSet({
			injections: {
				a: 1,
				b: 2
			}
		});
		expect(equationSet.injections).to.have.keys(["a", "b"]);
		expect(equationSet.injections).to.eql({
			a: 1,
			b: 2
		});

		expect(function () {
			equationSet.injections.c = 3;
		}).to.throw(TypeError);
		expect(equationSet.injections.c).to.be.undefined;
	});

	it("should create equation set with inputs", function () {
		var equationSet = new EquationSet({
			inputs: [
				"a", {
					symbol: "b"
				}, new Input({
					symbol: "c"
				})
			]
		});
		expect(equationSet.inputs).to.have.keys(["a", "b", "c"]);
		expect(equationSet.inputs).to.satisfy(function (inputs) {
			return inputs.a.symbol === "a" &&
				inputs.b.symbol === "b" &&
				inputs.c.symbol === "c";
		});

		equationSet = new EquationSet({
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
		expect(equationSet.inputs).to.have.keys(["a", "b", "c"]);
		expect(equationSet.inputs).to.satisfy(function (inputs) {
			return inputs.a.symbol === "a" &&
				inputs.b.symbol === "b" &&
				inputs.c.symbol === "c";
		});

		expect(function () {
			equationSet.inputs.d = 3;
		}).to.throw(TypeError);
		expect(equationSet.inputs.d).to.be.undefined;

		expect(function () {
			equationSet = new EquationSet({
				inputs: [null]
			});
		}).to.throw(Error);
	});

	it("should create equation set with outputs", function () {
		var fn = function (x, y, z) {}; // eslint-disable-line no-unused-vars

		var equationSet = new EquationSet({
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
		expect(equationSet.outputs).to.have.keys(["a", "b", "c"]);
		expect(equationSet.outputs).to.satisfy(function (outputs) {
			return outputs.a.symbol === "a" &&
				outputs.b.symbol === "b" &&
				outputs.c.symbol === "c";
		});


		equationSet = new EquationSet({
			outputs: [
				new Output({
					symbol: "a",
					formula: fn
				})
			]
		});
		expect(equationSet.outputs).to.have.keys(["a"]);
		expect(equationSet.outputs).to.satisfy(function (outputs) {
			return outputs.a.symbol === "a";
		});

		expect(function () {
			equationSet = new EquationSet({
				outputs: [
					new Output({
						symbol: 1,
						formula: fn
					})
				]
			});
		}).to.throw(Error);

		expect(function () {
			equationSet.outputs.d = 3;
		}).to.throw(TypeError);
		expect(equationSet.outputs.d).to.be.undefined;
	});

	it("should get the evaluation order", function () {
		/* eslint-disable no-unused-vars */
		var equationSet = new EquationSet({
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

		var evaluationOrder = equationSet.evaluationOrder;
		expect(evaluationOrder).to.equal(equationSet.evaluationOrder);

		expect(evaluationOrder).to.eql(["e", "f", "h", "g", "i", "j"]);

		expect(equationSet.getEvaluationOrder("g")).to.eql(["e", "f", "h", "g"]);

		expect(equationSet.getEvaluationOrder("f", "i")).to.eql(["e", "f", "i"]);

		expect(equationSet.getEvaluationOrder(["f", "i"])).to.eql(["e", "f", "i"]);

		expect(function () {
			equationSet.getEvaluationOrder("n");
		}).to.throw(/not defined/);



		/* eslint-disable no-unused-vars */
		equationSet = new EquationSet({
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
			equationSet.evaluationOrder;
		}).to.throw(/e -> g -> h -> f -> e/);



		/* eslint-disable no-unused-vars */
		equationSet = new EquationSet({
			outputs: {
				e: function (a, b) {}
			}
		});
		/* eslint-enable no-unused-vars */

		expect(function () {
			equationSet.evaluationOrder;
		}).to.throw(/missing dependency/);
	});

	it("should reset evaluation cache when new outputs are added", function () {
		/* eslint-disable no-unused-vars */
		var equationSet = new EquationSet({
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

		var evaluationOrder = equationSet.evaluationOrder;
		expect(evaluationOrder).to.equal(equationSet.evaluationOrder);
		expect(evaluationOrder).to.eql(["e", "f", "h", "g", "i", "j"]);


		/* eslint-disable no-unused-vars */
		equationSet.outputs = {
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
		var evaluationOrder2 = equationSet.evaluationOrder;
		expect(evaluationOrder2).to.equal(equationSet.evaluationOrder);
		expect(evaluationOrder2).to.not.equal(evaluationOrder);
		expect(evaluationOrder2).to.eql(["i", "e", "f", "h", "g", "j"]);
	});

	it("should evaluate equation set", function (done) {
		var tests = [];

		var equationSet = new EquationSet({
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

		tests[0] = expect(equationSet.evaluate({
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


		equationSet = new EquationSet({
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

		tests[1] = expect(equationSet.evaluate({
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


		tests[2] = expect(equationSet.evaluate({
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

	it("should have factories", function (done) {
		var input = inputFactory({
			symbol: "a"
		});

		var output = outputFactory({
			symbol: "b",
			formula: function (a) {
				return 2 * a;
			}
		});

		var equationSet = equationSetFactory({
			inputs: [input],
			outputs: [output]
		});

		expect(input).to.be.instanceof(Input);
		expect(input.symbol).to.equal("a");

		expect(output).to.be.instanceof(Output);
		expect(output.symbol).to.equal("b");

		expect(equationSet).to.be.instanceof(EquationSet);

		expect(equationSet.evaluate({
			a: 1
		})).to.eventually.eql({
			inputs: {
				a: {
					value: 1,
					meta: {}
				}
			},
			outputs: {
				b: {
					value: 2,
					meta: {}
				}
			}
		}).and.notify(done);
	});

	it("should name equation sets", function () {
		var equationSet = new EquationSet({
			name: "test"
		});

		expect(equationSet.name).to.equal("test");
		expect(eqns.has("test")).to.be.true;
		expect(eqns.get("test")).to.equal(equationSet);

		equationSet.name = "testing";
		expect(eqns.has("test")).to.be.false;
		expect(eqns.get("test")).to.undefined;
		expect(eqns.get("testing")).to.equal(equationSet);

		equationSet.name = "testing";
		expect(eqns.get("testing")).to.equal(equationSet);

		var equationSet2 = new EquationSet({
			name: "test"
		});
		expect(eqns.get("test")).to.equal(equationSet2);

		expect(function () {
			equationSet2.name = "testing";
		}).to.throw(Error);
	});

	it("should be pluggable", function (done) {
		var input = inputFactory({
			symbol: "a"
		});

		var output = outputFactory({
			symbol: "b",
			formula: function (a) {
				return 2 * a;
			}
		});

		var equationSet = equationSetFactory({
			inputs: [input],
			outputs: [output]
		});

		plugins.pre.push(function (ins) {
			Object.keys(ins).forEach(function (key) {
				ins[key] *= -2;
			});
			return ins;
		});

		plugins.post.push(function (data) {
			data.post = true;
			return data;
		});
		expect(equationSet.evaluate({
			a: 2
		})).to.eventually.eql({
			inputs: {
				a: {
					value: -4,
					meta: {}
				}
			},
			outputs: {
				b: {
					value: -8,
					meta: {}
				}
			},
			post: true
		}).and.notify(done);


		plugins.fn.run = function () {
			return 1;
		};
		expect(eqns.run()).to.equal(1);
	});
});
