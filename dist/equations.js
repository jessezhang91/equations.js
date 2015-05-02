(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _import = require("./util/symbols");

var symbols = _interopRequireWildcard(_import);

var _Equation = require("./core/Equation");

var _Equation2 = _interopRequireDefault(_Equation);

var _Input = require("./core/Input");

var _Input2 = _interopRequireDefault(_Input);

var _Output = require("./core/Output");

var _Output2 = _interopRequireDefault(_Output);

exports["default"] = {
	Equation: _Equation2["default"],
	Input: _Input2["default"],
	Output: _Output2["default"],
	symbols: symbols
};
module.exports = exports["default"];

},{"./core/Equation":2,"./core/Input":3,"./core/Output":4,"./util/symbols":8}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Input = require("./Input");

var _Input2 = _interopRequireDefault(_Input);

var _Output = require("./Output");

var _Output2 = _interopRequireDefault(_Output);

var _import = require("../util/async");

var async = _interopRequireWildcard(_import);

var _$injections$$inputs$$outputs$$evaluationOrder = require("../util/symbols");

var Equation = (function () {
	function Equation() {
		var _ref = arguments[0] === undefined ? {} : arguments[0];

		var _ref$injections = _ref.injections;
		var injections = _ref$injections === undefined ? {} : _ref$injections;
		var _ref$inputs = _ref.inputs;
		var inputs = _ref$inputs === undefined ? {} : _ref$inputs;
		var _ref$outputs = _ref.outputs;
		var outputs = _ref$outputs === undefined ? {} : _ref$outputs;

		_classCallCheck(this, Equation);

		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	_createClass(Equation, [{
		key: "injections",
		get: function () {
			return this[_$injections$$inputs$$outputs$$evaluationOrder.$injections];
		},
		set: function (injections) {
			this[_$injections$$inputs$$outputs$$evaluationOrder.$injections] = Object.freeze(injections);
		}
	}, {
		key: "inputs",
		get: function () {
			return this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs];
		},
		set: function (inputs) {
			var convert = function convert(item) {
				if (item instanceof _Input2["default"]) {
					return item;
				}
				if (typeof item == "string") {
					return new _Input2["default"]({
						symbol: item
					});
				}
				if (typeof item == "object" && item != null) {
					return new _Input2["default"](item);
				}
				return new _Input2["default"]();
			};

			if (inputs instanceof Array) {
				inputs = inputs.reduce(function (memo, item) {
					item = convert(item);
					memo[item.symbol] = item;

					if (typeof item.symbol != "string") {
						throw new Error("Invalid input symbol `" + item.symbol + "`");
					}

					return memo;
				}, {});
			} else {
				inputs = Object.keys(inputs).reduce(function (memo, key) {
					var item = convert(inputs[key]);
					item.symbol = key;
					memo[key] = item;
					return memo;
				}, {});
			}

			this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs] = Object.freeze(inputs);
		}
	}, {
		key: "outputs",
		get: function () {
			return this[_$injections$$inputs$$outputs$$evaluationOrder.$outputs];
		},
		set: function (outputs) {
			var convert = function convert(item) {
				if (item instanceof _Output2["default"]) {
					return item;
				}
				if (typeof item == "function") {
					return new _Output2["default"]({
						formula: item
					});
				}
				return new _Output2["default"](item);
			};

			outputs = Object.keys(outputs).reduce(function (memo, key) {
				var item = convert(outputs[key]);
				item.symbol = key;
				memo[key] = item;
				return memo;
			}, {});

			this[_$injections$$inputs$$outputs$$evaluationOrder.$outputs] = Object.freeze(outputs);
			this[_$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] = null;
		}
	}, {
		key: "evaluationOrder",
		get: function () {
			return this.getEvaluationOrder();
		}
	}, {
		key: "getEvaluationOrder",
		value: function getEvaluationOrder() {
			for (var _len = arguments.length, evals = Array(_len), _key = 0; _key < _len; _key++) {
				evals[_key] = arguments[_key];
			}

			if (evals[0] instanceof Array) {
				evals = evals[0];
			}
			evals = new Set(evals);

			if (this[_$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] == null) {
				this[_$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] = new Map();
			}

			var cacheKey = Array.from(evals).join(),
			    cache = this[_$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder].get(cacheKey);
			if (cache) {
				return cache;
			}
			cache = resolveEvaluationOrder(this, evals);
			this[_$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder].set(cacheKey, cache);

			return cache;
		}
	}, {
		key: "evaluate",
		value: function evaluate(ins) {
			for (var _len2 = arguments.length, evals = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				evals[_key2 - 1] = arguments[_key2];
			}

			var injections = this.injections,
			    inputs = this.inputs,
			    outputs = this.outputs;

			var outs = {};
			this.getEvaluationOrder.apply(this, evals).forEach(function (key) {
				outs[key] = outputs[key].evaluate(injections, ins, outs);
			});

			var inMetas = {};
			Object.keys(ins).forEach(function (key) {
				inMetas[key] = inputs[key].evaluateMeta(injections, ins, outs);
			});

			var outMetas = {};
			Object.keys(outs).forEach(function (key) {
				outMetas[key] = outputs[key].evaluateMeta(injections, ins, outs);
			});

			return async.props({
				inputs: async.props(ins),
				outputs: async.props(outs),
				metas: async.props({
					inputs: async.props(inMetas),
					outputs: async.props(outMetas)
				})
			}).then(function (data) {
				return {
					inputs: packageResult(data.inputs, data.metas.inputs),
					outputs: packageResult(data.outputs, data.metas.outputs)
				};
			});
		}
	}]);

	return Equation;
})();

exports["default"] = Equation;

function packageResult(items, metas) {
	return Object.keys(items).reduce(function (memo, key) {
		memo[key] = {
			value: items[key],
			meta: metas[key]
		};
		return memo;
	}, {});
}

function resolveEvaluationOrder(equation, evals) {
	var injections = Object.keys(equation.injections),
	    inputs = Object.keys(equation.inputs),
	    outputs = Object.keys(equation.outputs);

	if (!evals.size) {
		evals = new Set(outputs);
	}

	var dependencies = new Map();
	outputs.forEach(function (key) {
		dependencies.set(key, equation.outputs[key].dependencies);
	});

	var order = [];

	var processedOutputs = new Set();
	var processOutput = (function (_processOutput) {
		function processOutput(_x) {
			return _processOutput.apply(this, arguments);
		}

		processOutput.toString = function () {
			return _processOutput.toString();
		};

		return processOutput;
	})(function (key) {
		var set = arguments[1] === undefined ? new Set() : arguments[1];

		if (processedOutputs.has(key)) {
			return;
		}

		var deps = dependencies.get(key);
		if (!deps) {
			throw new Error("Output `" + key + "` not defined in equations set");
		}
		if (set.has(key)) {
			throw new Error("Output `" + key + "` has a circular dependency `" + Array.from(set.values()).join(" -> ") + " -> " + key + "`");
		}
		set.add(key);

		deps.filter(function (dep) {
			return ! ~injections.indexOf(dep) && ! ~inputs.indexOf(dep);
		}).forEach(function (dep) {
			if (! ~outputs.indexOf(dep)) {
				throw new Error("Output `" + key + "` has a missing dependency `" + dep + "`");
			}

			processOutput(dep, new Set(set));
		});
		order.push(key);
		processedOutputs.add(key);
	});
	evals.forEach(function (key) {
		return processOutput(key);
	});

	return order;
}
module.exports = exports["default"];

},{"../util/async":6,"../util/symbols":8,"./Input":3,"./Output":4}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Parameter2 = require("./Parameter");

var _Parameter3 = _interopRequireDefault(_Parameter2);

var Input = (function (_Parameter) {
	function Input() {
		_classCallCheck(this, Input);

		_get(Object.getPrototypeOf(Input.prototype), "constructor", this).call(this, arguments[0]);
	}

	_inherits(Input, _Parameter);

	return Input;
})(_Parameter3["default"]);

exports["default"] = Input;
module.exports = exports["default"];

},{"./Parameter":5}],4:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Parameter2 = require("./Parameter");

var _Parameter3 = _interopRequireDefault(_Parameter2);

var _import = require("../util/di");

var di = _interopRequireWildcard(_import);

var _$inject = require("../util/symbols");

var Output = (function (_Parameter) {
	function Output(_ref) {
		var formula = _ref.formula;

		_classCallCheck(this, Output);

		_get(Object.getPrototypeOf(Output.prototype), "constructor", this).call(this, arguments[0]);

		this.formula = di.annotate(formula);
	}

	_inherits(Output, _Parameter);

	_createClass(Output, [{
		key: "evaluate",
		value: function evaluate() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			return di.inject(this.formula, stores);
		}
	}, {
		key: "dependencies",
		get: function () {
			return this.formula[_$inject.$inject];
		}
	}]);

	return Output;
})(_Parameter3["default"]);

exports["default"] = Output;
module.exports = exports["default"];

},{"../util/di":7,"../util/symbols":8,"./Parameter":5}],5:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _import = require("../util/di");

var di = _interopRequireWildcard(_import);

var _import2 = require("../util/async");

var async = _interopRequireWildcard(_import2);

var _$meta = require("../util/symbols");

var Parameter = (function () {
	function Parameter() {
		var _ref = arguments[0] === undefined ? {} : arguments[0];

		var symbol = _ref.symbol;
		var _ref$meta = _ref.meta;
		var meta = _ref$meta === undefined ? {} : _ref$meta;

		_classCallCheck(this, Parameter);

		this.symbol = symbol;
		this.meta = meta;
	}

	_createClass(Parameter, [{
		key: "meta",
		get: function () {
			return this[_$meta.$meta];
		},
		set: function (raw) {
			var meta = Object.keys(raw).reduce(function (memo, key) {
				var item = raw[key];
				if (di.isAnnotatable(item)) {
					item = di.annotate(item);
				}
				memo[key] = item;
				return memo;
			}, {});

			this[_$meta.$meta] = Object.freeze(meta);
		}
	}, {
		key: "evaluateMeta",
		value: function evaluateMeta() {
			var _this = this;

			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			var meta = {};

			Object.keys(this.meta).forEach(function (key) {
				var item = _this.meta[key];
				if (typeof item == "function") {
					item = di.inject(item, stores);
				}
				meta[key] = item;
			});

			return async.props(meta);
		}
	}]);

	return Parameter;
})();

exports["default"] = Parameter;
module.exports = exports["default"];

},{"../util/async":6,"../util/di":7,"../util/symbols":8}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defer = defer;
exports.props = props;
exports.isThenable = isThenable;

function defer() {
	var deferred = {};
	deferred.promise = new Promise(function (resolve, reject) {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
}

function props(obj) {
	var keys = Object.keys(obj);
	var promises = keys.map(function (key) {
		return obj[key];
	});

	return Promise.all(promises).then(function (values) {
		return keys.reduce(function (memo, key, i) {
			memo[key] = values[i];
			return memo;
		}, {});
	});
}

function isThenable(p) {
	return !!p.then;
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.annotate = annotate;
exports.inject = inject;
exports.isAnnotatable = isAnnotatable;

var _$inject = require("../util/symbols");

function annotate(fn) {
	if (typeof fn == "function" && fn[_$inject.$inject] instanceof Array) {
		return fn;
	}

	if (fn instanceof Array) {
		var fields = fn;
		fn = fn.pop();
		fn[_$inject.$inject] = fields;
		return fn;
	}

	fn[_$inject.$inject] = fn.toString().match(/^function .*?\((.*?)\)/)[1].split(/\s*,\s*/).filter(function (a) {
		return a;
	});
	return fn;
}

function inject(fn) {
	var _this = this;

	for (var _len = arguments.length, stores = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		stores[_key - 1] = arguments[_key];
	}

	if (!fn[_$inject.$inject]) {
		fn = annotate(fn);
	}

	// TODO: Support function argument destructure syntax with native, babel, and traceur

	if (stores[0] instanceof Array) {
		stores = stores[0];
	}

	var promises = fn[_$inject.$inject].map(function (name) {
		// Replace this with "find" when that is ready
		var injection = stores.reduceRight(function (item, store) {
			if (item !== undefined) {
				return item;
			}
			return store[name];
		}, undefined);

		if (injection === undefined) {
			throw new Error("Cannot find dependency: " + name, fn);
		}
		return injection;
	});

	return Promise.all(promises).then(function (args) {
		return fn.apply(_this, args);
	});
}

function isAnnotatable(fn) {
	return typeof fn == "function" || fn instanceof Array && typeof fn[fn.length - 1] == "function";
}

},{"../util/symbols":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $inject = Symbol("$inject");
exports.$inject = $inject;
var $meta = Symbol("$meta");

exports.$meta = $meta;
var $injections = Symbol("$injections");
exports.$injections = $injections;
var $inputs = Symbol("$inputs");
exports.$inputs = $inputs;
var $outputs = Symbol("$outputs");

exports.$outputs = $outputs;
var $evaluationOrder = Symbol("$evaluationOrder");
exports.$evaluationOrder = $evaluationOrder;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvYXN5bmMuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7d0JBQ0UsaUJBQWlCOzs7O3FCQUNwQixjQUFjOzs7O3NCQUNiLGVBQWU7Ozs7cUJBRW5CO0FBQ2QsU0FBUSx1QkFBQTtBQUNSLE1BQUssb0JBQUE7QUFDTCxPQUFNLHFCQUFBO0FBQ04sUUFBTyxFQUFQLE9BQU87Q0FDUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQ1ZpQixTQUFTOzs7O3NCQUNSLFVBQVU7Ozs7c0JBQ04sZUFBZTs7SUFBMUIsS0FBSzs7NkRBQzhDLGlCQUFpQjs7SUFFM0QsUUFBUTtBQUNqQixVQURTLFFBQVEsR0FDbUM7MENBQUosRUFBRTs7NkJBQWhELFVBQVU7TUFBVixVQUFVLG1DQUFHLEVBQUU7eUJBQUUsTUFBTTtNQUFOLE1BQU0sK0JB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bnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBzeW1ib2xzIGZyb20gXCIuL3V0aWwvc3ltYm9sc1wiO1xuaW1wb3J0IEVxdWF0aW9uIGZyb20gXCIuL2NvcmUvRXF1YXRpb25cIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9jb3JlL0lucHV0XCI7XG5pbXBvcnQgT3V0cHV0IGZyb20gXCIuL2NvcmUvT3V0cHV0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0RXF1YXRpb24sXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdHN5bWJvbHNcbn07XG4iLCJpbXBvcnQgSW5wdXQgZnJvbSBcIi4vSW5wdXRcIjtcbmltcG9ydCBPdXRwdXQgZnJvbSBcIi4vT3V0cHV0XCI7XG5pbXBvcnQgKiBhcyBhc3luYyBmcm9tIFwiLi4vdXRpbC9hc3luY1wiO1xuaW1wb3J0IHskaW5qZWN0aW9ucywgJGlucHV0cywgJG91dHB1dHMsICRldmFsdWF0aW9uT3JkZXJ9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXF1YXRpb24ge1xuXHRjb25zdHJ1Y3Rvcih7aW5qZWN0aW9ucyA9IHt9LCBpbnB1dHMgPSB7fSwgb3V0cHV0cyA9IHt9fSA9IHt9KSB7XG5cdFx0dGhpcy5pbmplY3Rpb25zID0gaW5qZWN0aW9ucztcblx0XHR0aGlzLmlucHV0cyA9IGlucHV0cztcblx0XHR0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuXHR9XG5cblx0Z2V0IGluamVjdGlvbnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJGluamVjdGlvbnNdO1xuXHR9XG5cdHNldCBpbmplY3Rpb25zKGluamVjdGlvbnMpIHtcblx0XHR0aGlzWyRpbmplY3Rpb25zXSA9IE9iamVjdC5mcmVlemUoaW5qZWN0aW9ucyk7XG5cdH1cblxuXHRnZXQgaW5wdXRzKCkge1xuXHRcdHJldHVybiB0aGlzWyRpbnB1dHNdO1xuXHR9XG5cdHNldCBpbnB1dHMoaW5wdXRzKSB7XG5cdFx0bGV0IGNvbnZlcnQgPSAoaXRlbSkgPT4ge1xuXHRcdFx0aWYoaXRlbSBpbnN0YW5jZW9mIElucHV0KSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IElucHV0KHtcblx0XHRcdFx0XHRzeW1ib2w6IGl0ZW1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcIm9iamVjdFwiICYmIGl0ZW0gIT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IElucHV0KGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBJbnB1dCgpO1xuXHRcdH07XG5cblx0XHRpZihpbnB1dHMgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0aW5wdXRzID0gaW5wdXRzLnJlZHVjZSgobWVtbywgaXRlbSkgPT4ge1xuXHRcdFx0XHRpdGVtID0gY29udmVydChpdGVtKTtcblx0XHRcdFx0bWVtb1tpdGVtLnN5bWJvbF0gPSBpdGVtO1xuXG5cdFx0XHRcdGlmKHR5cGVvZiBpdGVtLnN5bWJvbCAhPSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBpbnB1dCBzeW1ib2wgYFwiICsgaXRlbS5zeW1ib2wgKyBcImBcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWVtbztcblx0XHRcdH0sIHt9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aW5wdXRzID0gT2JqZWN0LmtleXMoaW5wdXRzKS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgaXRlbSA9IGNvbnZlcnQoaW5wdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWVtb1trZXldID0gaXRlbTtcblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9LCB7fSk7XG5cdFx0fVxuXG5cdFx0dGhpc1skaW5wdXRzXSA9IE9iamVjdC5mcmVlemUoaW5wdXRzKTtcblx0fVxuXG5cdGdldCBvdXRwdXRzKCkge1xuXHRcdHJldHVybiB0aGlzWyRvdXRwdXRzXTtcblx0fVxuXHRzZXQgb3V0cHV0cyhvdXRwdXRzKSB7XG5cdFx0bGV0IGNvbnZlcnQgPSAoaXRlbSkgPT4ge1xuXHRcdFx0aWYoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IE91dHB1dCh7XG5cdFx0XHRcdFx0Zm9ybXVsYTogaXRlbVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgT3V0cHV0KGl0ZW0pO1xuXHRcdH07XG5cblx0XHRvdXRwdXRzID0gT2JqZWN0LmtleXMob3V0cHV0cykucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdGxldCBpdGVtID0gY29udmVydChvdXRwdXRzW2tleV0pO1xuXHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRtZW1vW2tleV0gPSBpdGVtO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXG5cdFx0dGhpc1skb3V0cHV0c10gPSBPYmplY3QuZnJlZXplKG91dHB1dHMpO1xuXHRcdHRoaXNbJGV2YWx1YXRpb25PcmRlcl0gPSBudWxsO1xuXHR9XG5cblx0Z2V0IGV2YWx1YXRpb25PcmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFdmFsdWF0aW9uT3JkZXIoKTtcblx0fVxuXG5cdGdldEV2YWx1YXRpb25PcmRlciguLi5ldmFscykge1xuXHRcdGlmKGV2YWxzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdGV2YWxzID0gZXZhbHNbMF07XG5cdFx0fVxuXHRcdGV2YWxzID0gbmV3IFNldChldmFscyk7XG5cblx0XHRpZih0aGlzWyRldmFsdWF0aW9uT3JkZXJdID09IG51bGwpIHtcblx0XHRcdHRoaXNbJGV2YWx1YXRpb25PcmRlcl0gPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0bGV0IGNhY2hlS2V5ID0gQXJyYXkuZnJvbShldmFscykuam9pbigpLFxuXHRcdFx0Y2FjaGUgPSB0aGlzWyRldmFsdWF0aW9uT3JkZXJdLmdldChjYWNoZUtleSk7XG5cdFx0aWYoY2FjaGUpIHtcblx0XHRcdHJldHVybiBjYWNoZTtcblx0XHR9XG5cdFx0Y2FjaGUgPSByZXNvbHZlRXZhbHVhdGlvbk9yZGVyKHRoaXMsIGV2YWxzKTtcblx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdLnNldChjYWNoZUtleSwgY2FjaGUpO1xuXG5cdFx0cmV0dXJuIGNhY2hlO1xuXHR9XG5cblx0ZXZhbHVhdGUoaW5zLCAuLi5ldmFscykge1xuXHRcdGxldCBpbmplY3Rpb25zID0gdGhpcy5pbmplY3Rpb25zLFxuXHRcdFx0aW5wdXRzID0gdGhpcy5pbnB1dHMsXG5cdFx0XHRvdXRwdXRzID0gdGhpcy5vdXRwdXRzO1xuXG5cdFx0bGV0IG91dHMgPSB7fTtcblx0XHR0aGlzLmdldEV2YWx1YXRpb25PcmRlci5hcHBseSh0aGlzLCBldmFscykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRvdXRzW2tleV0gPSBvdXRwdXRzW2tleV0uZXZhbHVhdGUoaW5qZWN0aW9ucywgaW5zLCBvdXRzKTtcblx0XHR9KTtcblxuXHRcdGxldCBpbk1ldGFzID0ge307XG5cdFx0T2JqZWN0LmtleXMoaW5zKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdGluTWV0YXNba2V5XSA9IGlucHV0c1trZXldLmV2YWx1YXRlTWV0YShpbmplY3Rpb25zLCBpbnMsIG91dHMpO1xuXHRcdH0pO1xuXG5cdFx0bGV0IG91dE1ldGFzID0ge307XG5cdFx0T2JqZWN0LmtleXMob3V0cykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRvdXRNZXRhc1trZXldID0gb3V0cHV0c1trZXldLmV2YWx1YXRlTWV0YShpbmplY3Rpb25zLCBpbnMsIG91dHMpO1xuXHRcdH0pO1xuXG5cblx0XHRyZXR1cm4gYXN5bmMucHJvcHMoe1xuXHRcdFx0aW5wdXRzOiBhc3luYy5wcm9wcyhpbnMpLFxuXHRcdFx0b3V0cHV0czogYXN5bmMucHJvcHMob3V0cyksXG5cdFx0XHRtZXRhczogYXN5bmMucHJvcHMoe1xuXHRcdFx0XHRpbnB1dHM6IGFzeW5jLnByb3BzKGluTWV0YXMpLFxuXHRcdFx0XHRvdXRwdXRzOiBhc3luYy5wcm9wcyhvdXRNZXRhcylcblx0XHRcdH0pXG5cdFx0fSkudGhlbigoZGF0YSkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW5wdXRzOiBwYWNrYWdlUmVzdWx0KGRhdGEuaW5wdXRzLCBkYXRhLm1ldGFzLmlucHV0cyksXG5cdFx0XHRcdG91dHB1dHM6IHBhY2thZ2VSZXN1bHQoZGF0YS5vdXRwdXRzLCBkYXRhLm1ldGFzLm91dHB1dHMpXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhY2thZ2VSZXN1bHQoaXRlbXMsIG1ldGFzKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhpdGVtcykucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRtZW1vW2tleV0gPSB7XG5cdFx0XHR2YWx1ZTogaXRlbXNba2V5XSxcblx0XHRcdG1ldGE6IG1ldGFzW2tleV1cblx0XHR9O1xuXHRcdHJldHVybiBtZW1vO1xuXHR9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVFdmFsdWF0aW9uT3JkZXIoZXF1YXRpb24sIGV2YWxzKSB7XG5cdGxldCBpbmplY3Rpb25zID0gT2JqZWN0LmtleXMoZXF1YXRpb24uaW5qZWN0aW9ucyksXG5cdFx0aW5wdXRzID0gT2JqZWN0LmtleXMoZXF1YXRpb24uaW5wdXRzKSxcblx0XHRvdXRwdXRzID0gT2JqZWN0LmtleXMoZXF1YXRpb24ub3V0cHV0cyk7XG5cblx0aWYoIWV2YWxzLnNpemUpIHtcblx0XHRldmFscyA9IG5ldyBTZXQob3V0cHV0cyk7XG5cdH1cblxuXHRsZXQgZGVwZW5kZW5jaWVzID0gbmV3IE1hcCgpO1xuXHRvdXRwdXRzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdGRlcGVuZGVuY2llcy5zZXQoa2V5LCBlcXVhdGlvbi5vdXRwdXRzW2tleV0uZGVwZW5kZW5jaWVzKTtcblx0fSk7XG5cblx0bGV0IG9yZGVyID0gW107XG5cblx0bGV0IHByb2Nlc3NlZE91dHB1dHMgPSBuZXcgU2V0KCk7XG5cdGxldCBwcm9jZXNzT3V0cHV0ID0gKGtleSwgc2V0ID0gbmV3IFNldCgpKSA9PiB7XG5cdFx0aWYocHJvY2Vzc2VkT3V0cHV0cy5oYXMoa2V5KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBkZXBzID0gZGVwZW5kZW5jaWVzLmdldChrZXkpO1xuXHRcdGlmKCFkZXBzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJPdXRwdXQgYFwiICsga2V5ICsgXCJgIG5vdCBkZWZpbmVkIGluIGVxdWF0aW9ucyBzZXRcIik7XG5cdFx0fVxuXHRcdGlmKHNldC5oYXMoa2V5KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiT3V0cHV0IGBcIiArIGtleSArIFwiYCBoYXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5IGBcIiArIEFycmF5LmZyb20oc2V0LnZhbHVlcygpKS5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5ICsgXCJgXCIpO1xuXHRcdH1cblx0XHRzZXQuYWRkKGtleSk7XG5cblx0XHRkZXBzLmZpbHRlcigoZGVwKSA9PiB7XG5cdFx0XHRyZXR1cm4gIX5pbmplY3Rpb25zLmluZGV4T2YoZGVwKSAmJiAhfmlucHV0cy5pbmRleE9mKGRlcCk7XG5cdFx0fSkuZm9yRWFjaCgoZGVwKSA9PiB7XG5cdFx0XHRpZighfm91dHB1dHMuaW5kZXhPZihkZXApKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIk91dHB1dCBgXCIgKyBrZXkgKyBcImAgaGFzIGEgbWlzc2luZyBkZXBlbmRlbmN5IGBcIiArIGRlcCArIFwiYFwiKTtcblx0XHRcdH1cblxuXHRcdFx0cHJvY2Vzc091dHB1dChkZXAsIG5ldyBTZXQoc2V0KSk7XG5cdFx0fSk7XG5cdFx0b3JkZXIucHVzaChrZXkpO1xuXHRcdHByb2Nlc3NlZE91dHB1dHMuYWRkKGtleSk7XG5cdH07XG5cdGV2YWxzLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXHRyZXR1cm4gb3JkZXI7XG59XG4iLCJpbXBvcnQgUGFyYW1ldGVyIGZyb20gXCIuL1BhcmFtZXRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKGFyZ3VtZW50c1swXSk7XG5cdH1cbn1cbiIsImltcG9ydCBQYXJhbWV0ZXIgZnJvbSBcIi4vUGFyYW1ldGVyXCI7XG5pbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dHB1dCBleHRlbmRzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKHtmb3JtdWxhfSkge1xuXHRcdHN1cGVyKGFyZ3VtZW50c1swXSk7XG5cblx0XHR0aGlzLmZvcm11bGEgPSBkaS5hbm5vdGF0ZShmb3JtdWxhKTtcblx0fVxuXG5cdGV2YWx1YXRlKC4uLnN0b3Jlcykge1xuXHRcdHJldHVybiBkaS5pbmplY3QodGhpcy5mb3JtdWxhLCBzdG9yZXMpO1xuXHR9XG5cblx0Z2V0IGRlcGVuZGVuY2llcygpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtdWxhWyRpbmplY3RdO1xuXHR9XG59XG4iLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCB7JG1ldGF9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3Ioe3N5bWJvbCwgbWV0YSA9IHt9fSA9IHt9KSB7XG5cdFx0dGhpcy5zeW1ib2wgPSBzeW1ib2w7XG5cdFx0dGhpcy5tZXRhID0gbWV0YTtcblx0fVxuXG5cdGdldCBtZXRhKCkge1xuXHRcdHJldHVybiB0aGlzWyRtZXRhXTtcblx0fVxuXHRzZXQgbWV0YShyYXcpIHtcblx0XHRsZXQgbWV0YSA9IE9iamVjdC5rZXlzKHJhdykucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdGxldCBpdGVtID0gcmF3W2tleV07XG5cdFx0XHRpZihkaS5pc0Fubm90YXRhYmxlKGl0ZW0pKSB7XG5cdFx0XHRcdGl0ZW0gPSBkaS5hbm5vdGF0ZShpdGVtKTtcblx0XHRcdH1cblx0XHRcdG1lbW9ba2V5XSA9IGl0ZW07XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9LCB7fSk7XG5cblx0XHR0aGlzWyRtZXRhXSA9IE9iamVjdC5mcmVlemUobWV0YSk7XG5cdH1cblxuXHRldmFsdWF0ZU1ldGEoLi4uc3RvcmVzKSB7XG5cdFx0bGV0IG1ldGEgPSB7fTtcblxuXHRcdE9iamVjdC5rZXlzKHRoaXMubWV0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRsZXQgaXRlbSA9IHRoaXMubWV0YVtrZXldO1xuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGl0ZW0gPSBkaS5pbmplY3QoaXRlbSwgc3RvcmVzKTtcblx0XHRcdH1cblx0XHRcdG1ldGFba2V5XSA9IGl0ZW07XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYXN5bmMucHJvcHMobWV0YSk7XG5cdH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkZWZlcigpIHtcblx0bGV0IGRlZmVycmVkID0ge307XG5cdGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0ZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0ZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuXHR9KTtcblx0cmV0dXJuIGRlZmVycmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMob2JqKSB7XG5cdGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblx0bGV0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4ge1xuXHRcdHJldHVybiBvYmpba2V5XTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCh2YWx1ZXMpID0+IHtcblx0XHRyZXR1cm4ga2V5cy5yZWR1Y2UoKG1lbW8sIGtleSwgaSkgPT4ge1xuXHRcdFx0bWVtb1trZXldID0gdmFsdWVzW2ldO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUocCkge1xuXHRyZXR1cm4gISFwLnRoZW47XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGZuWyRpbmplY3RdID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uIC4qP1xcKCguKj8pXFwpLylbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcigoYSkgPT4gYSk7XG5cdHJldHVybiBmbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdChmbiwgLi4uc3RvcmVzKSB7XG5cdGlmICghZm5bJGluamVjdF0pIHtcblx0XHRmbiA9IGFubm90YXRlKGZuKTtcblx0fVxuXG5cdC8vIFRPRE86IFN1cHBvcnQgZnVuY3Rpb24gYXJndW1lbnQgZGVzdHJ1Y3R1cmUgc3ludGF4IHdpdGggbmF0aXZlLCBiYWJlbCwgYW5kIHRyYWNldXJcblxuXHRpZihzdG9yZXNbMF0gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdHN0b3JlcyA9IHN0b3Jlc1swXTtcblx0fVxuXG5cdGxldCBwcm9taXNlcyA9IGZuWyRpbmplY3RdLm1hcCgobmFtZSkgPT4ge1xuXHRcdC8vIFJlcGxhY2UgdGhpcyB3aXRoIFwiZmluZFwiIHdoZW4gdGhhdCBpcyByZWFkeVxuXHRcdGxldCBpbmplY3Rpb24gPSBzdG9yZXMucmVkdWNlUmlnaHQoKGl0ZW0sIHN0b3JlKSA9PiB7XG5cdFx0XHRpZihpdGVtICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RvcmVbbmFtZV07XG5cdFx0fSwgdW5kZWZpbmVkKTtcblxuXHRcdGlmIChpbmplY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogXCIgKyBuYW1lLCBmbik7XG5cdFx0fVxuXHRcdHJldHVybiBpbmplY3Rpb247XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoYXJncykgPT4ge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fubm90YXRhYmxlKGZuKSB7XG5cdHJldHVybiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIikgfHwgKGZuIGluc3RhbmNlb2YgQXJyYXkgJiYgdHlwZW9mIGZuW2ZuLmxlbmd0aCAtIDFdID09IFwiZnVuY3Rpb25cIik7XG59XG4iLCJleHBvcnQgY29uc3QgJGluamVjdCA9IFN5bWJvbChcIiRpbmplY3RcIik7XG5leHBvcnQgY29uc3QgJG1ldGEgPSBTeW1ib2woXCIkbWV0YVwiKTtcblxuZXhwb3J0IGNvbnN0ICRpbmplY3Rpb25zID0gU3ltYm9sKFwiJGluamVjdGlvbnNcIik7XG5leHBvcnQgY29uc3QgJGlucHV0cyA9IFN5bWJvbChcIiRpbnB1dHNcIik7XG5leHBvcnQgY29uc3QgJG91dHB1dHMgPSBTeW1ib2woXCIkb3V0cHV0c1wiKTtcblxuZXhwb3J0IGNvbnN0ICRldmFsdWF0aW9uT3JkZXIgPSBTeW1ib2woXCIkZXZhbHVhdGlvbk9yZGVyXCIpO1xuIl19
