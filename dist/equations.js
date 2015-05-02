(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _import = require("./util/symbols");

var symbols = _interopRequireWildcard(_import);

var _EquationSet = require("./core/EquationSet");

var _EquationSet2 = _interopRequireDefault(_EquationSet);

var _Input = require("./core/Input");

var _Input2 = _interopRequireDefault(_Input);

var _Output = require("./core/Output");

var _Output2 = _interopRequireDefault(_Output);

exports["default"] = {
	EquationSet: _EquationSet2["default"],
	Input: _Input2["default"],
	Output: _Output2["default"],
	symbols: symbols
};
module.exports = exports["default"];

},{"./core/EquationSet":2,"./core/Input":3,"./core/Output":4,"./util/symbols":8}],2:[function(require,module,exports){
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

var EquationSet = (function () {
	function EquationSet() {
		var _ref = arguments[0] === undefined ? {} : arguments[0];

		var _ref$injections = _ref.injections;
		var injections = _ref$injections === undefined ? {} : _ref$injections;
		var _ref$inputs = _ref.inputs;
		var inputs = _ref$inputs === undefined ? {} : _ref$inputs;
		var _ref$outputs = _ref.outputs;
		var outputs = _ref$outputs === undefined ? {} : _ref$outputs;

		_classCallCheck(this, EquationSet);

		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	_createClass(EquationSet, [{
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

	return EquationSet;
})();

exports["default"] = EquationSet;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvYXN5bmMuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7MkJBQ0ssb0JBQW9COzs7O3FCQUMxQixjQUFjOzs7O3NCQUNiLGVBQWU7Ozs7cUJBRW5CO0FBQ2QsWUFBVywwQkFBQTtBQUNYLE1BQUssb0JBQUE7QUFDTCxPQUFNLHFCQUFBO0FBQ04sUUFBTyxFQUFQLE9BQU87Q0FDUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQ1ZpQixTQUFTOzs7O3NCQUNSLFVBQVU7Ozs7c0JBQ04sZUFBZTs7SUFBMUIsS0FBSzs7NkRBQzhDLGlCQUFpQjs7SUFFM0QsV0FBVztBQUNwQixVQURTLFdBQVcsR0FDZ0M7MENBQUosRUFBRTs7NkJBQWhELFVBQVU7TUFBVixVQUFVLG1DQUFHLEVBQUU7eUJBQUUsTUFBTTtNQUFOLE1BQU0s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ZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgc3ltYm9scyBmcm9tIFwiLi91dGlsL3N5bWJvbHNcIjtcbmltcG9ydCBFcXVhdGlvblNldCBmcm9tIFwiLi9jb3JlL0VxdWF0aW9uU2V0XCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vY29yZS9JbnB1dFwiO1xuaW1wb3J0IE91dHB1dCBmcm9tIFwiLi9jb3JlL091dHB1dFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdEVxdWF0aW9uU2V0LFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRzeW1ib2xzXG59O1xuIiwiaW1wb3J0IElucHV0IGZyb20gXCIuL0lucHV0XCI7XG5pbXBvcnQgT3V0cHV0IGZyb20gXCIuL091dHB1dFwiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCB7JGluamVjdGlvbnMsICRpbnB1dHMsICRvdXRwdXRzLCAkZXZhbHVhdGlvbk9yZGVyfSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWF0aW9uU2V0IHtcblx0Y29uc3RydWN0b3Ioe2luamVjdGlvbnMgPSB7fSwgaW5wdXRzID0ge30sIG91dHB1dHMgPSB7fX0gPSB7fSkge1xuXHRcdHRoaXMuaW5qZWN0aW9ucyA9IGluamVjdGlvbnM7XG5cdFx0dGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cdFx0dGhpcy5vdXRwdXRzID0gb3V0cHV0cztcblx0fVxuXG5cdGdldCBpbmplY3Rpb25zKCkge1xuXHRcdHJldHVybiB0aGlzWyRpbmplY3Rpb25zXTtcblx0fVxuXHRzZXQgaW5qZWN0aW9ucyhpbmplY3Rpb25zKSB7XG5cdFx0dGhpc1skaW5qZWN0aW9uc10gPSBPYmplY3QuZnJlZXplKGluamVjdGlvbnMpO1xuXHR9XG5cblx0Z2V0IGlucHV0cygpIHtcblx0XHRyZXR1cm4gdGhpc1skaW5wdXRzXTtcblx0fVxuXHRzZXQgaW5wdXRzKGlucHV0cykge1xuXHRcdGxldCBjb252ZXJ0ID0gKGl0ZW0pID0+IHtcblx0XHRcdGlmKGl0ZW0gaW5zdGFuY2VvZiBJbnB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBJbnB1dCh7XG5cdFx0XHRcdFx0c3ltYm9sOiBpdGVtXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJvYmplY3RcIiAmJiBpdGVtICE9IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBJbnB1dChpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgSW5wdXQoKTtcblx0XHR9O1xuXG5cdFx0aWYoaW5wdXRzIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdGlucHV0cyA9IGlucHV0cy5yZWR1Y2UoKG1lbW8sIGl0ZW0pID0+IHtcblx0XHRcdFx0aXRlbSA9IGNvbnZlcnQoaXRlbSk7XG5cdFx0XHRcdG1lbW9baXRlbS5zeW1ib2xdID0gaXRlbTtcblxuXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5zeW1ib2wgIT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgc3ltYm9sIGBcIiArIGl0ZW0uc3ltYm9sICsgXCJgXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9LCB7fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlucHV0cyA9IE9iamVjdC5rZXlzKGlucHV0cykucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdFx0bGV0IGl0ZW0gPSBjb252ZXJ0KGlucHV0c1trZXldKTtcblx0XHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRcdG1lbW9ba2V5XSA9IGl0ZW07XG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdH1cblxuXHRcdHRoaXNbJGlucHV0c10gPSBPYmplY3QuZnJlZXplKGlucHV0cyk7XG5cdH1cblxuXHRnZXQgb3V0cHV0cygpIHtcblx0XHRyZXR1cm4gdGhpc1skb3V0cHV0c107XG5cdH1cblx0c2V0IG91dHB1dHMob3V0cHV0cykge1xuXHRcdGxldCBjb252ZXJ0ID0gKGl0ZW0pID0+IHtcblx0XHRcdGlmKGl0ZW0gaW5zdGFuY2VvZiBPdXRwdXQpIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBPdXRwdXQoe1xuXHRcdFx0XHRcdGZvcm11bGE6IGl0ZW1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IE91dHB1dChpdGVtKTtcblx0XHR9O1xuXG5cdFx0b3V0cHV0cyA9IE9iamVjdC5rZXlzKG91dHB1dHMpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRsZXQgaXRlbSA9IGNvbnZlcnQob3V0cHV0c1trZXldKTtcblx0XHRcdGl0ZW0uc3ltYm9sID0ga2V5O1xuXHRcdFx0bWVtb1trZXldID0gaXRlbTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblxuXHRcdHRoaXNbJG91dHB1dHNdID0gT2JqZWN0LmZyZWV6ZShvdXRwdXRzKTtcblx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbnVsbDtcblx0fVxuXG5cdGdldCBldmFsdWF0aW9uT3JkZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RXZhbHVhdGlvbk9yZGVyKCk7XG5cdH1cblxuXHRnZXRFdmFsdWF0aW9uT3JkZXIoLi4uZXZhbHMpIHtcblx0XHRpZihldmFsc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRldmFscyA9IGV2YWxzWzBdO1xuXHRcdH1cblx0XHRldmFscyA9IG5ldyBTZXQoZXZhbHMpO1xuXG5cdFx0aWYodGhpc1skZXZhbHVhdGlvbk9yZGVyXSA9PSBudWxsKSB7XG5cdFx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGxldCBjYWNoZUtleSA9IEFycmF5LmZyb20oZXZhbHMpLmpvaW4oKSxcblx0XHRcdGNhY2hlID0gdGhpc1skZXZhbHVhdGlvbk9yZGVyXS5nZXQoY2FjaGVLZXkpO1xuXHRcdGlmKGNhY2hlKSB7XG5cdFx0XHRyZXR1cm4gY2FjaGU7XG5cdFx0fVxuXHRcdGNhY2hlID0gcmVzb2x2ZUV2YWx1YXRpb25PcmRlcih0aGlzLCBldmFscyk7XG5cdFx0dGhpc1skZXZhbHVhdGlvbk9yZGVyXS5zZXQoY2FjaGVLZXksIGNhY2hlKTtcblxuXHRcdHJldHVybiBjYWNoZTtcblx0fVxuXG5cdGV2YWx1YXRlKGlucywgLi4uZXZhbHMpIHtcblx0XHRsZXQgaW5qZWN0aW9ucyA9IHRoaXMuaW5qZWN0aW9ucyxcblx0XHRcdGlucHV0cyA9IHRoaXMuaW5wdXRzLFxuXHRcdFx0b3V0cHV0cyA9IHRoaXMub3V0cHV0cztcblxuXHRcdGxldCBvdXRzID0ge307XG5cdFx0dGhpcy5nZXRFdmFsdWF0aW9uT3JkZXIuYXBwbHkodGhpcywgZXZhbHMpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0b3V0c1trZXldID0gb3V0cHV0c1trZXldLmV2YWx1YXRlKGluamVjdGlvbnMsIGlucywgb3V0cyk7XG5cdFx0fSk7XG5cblx0XHRsZXQgaW5NZXRhcyA9IHt9O1xuXHRcdE9iamVjdC5rZXlzKGlucykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRpbk1ldGFzW2tleV0gPSBpbnB1dHNba2V5XS5ldmFsdWF0ZU1ldGEoaW5qZWN0aW9ucywgaW5zLCBvdXRzKTtcblx0XHR9KTtcblxuXHRcdGxldCBvdXRNZXRhcyA9IHt9O1xuXHRcdE9iamVjdC5rZXlzKG91dHMpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0b3V0TWV0YXNba2V5XSA9IG91dHB1dHNba2V5XS5ldmFsdWF0ZU1ldGEoaW5qZWN0aW9ucywgaW5zLCBvdXRzKTtcblx0XHR9KTtcblxuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKHtcblx0XHRcdGlucHV0czogYXN5bmMucHJvcHMoaW5zKSxcblx0XHRcdG91dHB1dHM6IGFzeW5jLnByb3BzKG91dHMpLFxuXHRcdFx0bWV0YXM6IGFzeW5jLnByb3BzKHtcblx0XHRcdFx0aW5wdXRzOiBhc3luYy5wcm9wcyhpbk1ldGFzKSxcblx0XHRcdFx0b3V0cHV0czogYXN5bmMucHJvcHMob3V0TWV0YXMpXG5cdFx0XHR9KVxuXHRcdH0pLnRoZW4oKGRhdGEpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlucHV0czogcGFja2FnZVJlc3VsdChkYXRhLmlucHV0cywgZGF0YS5tZXRhcy5pbnB1dHMpLFxuXHRcdFx0XHRvdXRwdXRzOiBwYWNrYWdlUmVzdWx0KGRhdGEub3V0cHV0cywgZGF0YS5tZXRhcy5vdXRwdXRzKVxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYWNrYWdlUmVzdWx0KGl0ZW1zLCBtZXRhcykge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMoaXRlbXMpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0bWVtb1trZXldID0ge1xuXHRcdFx0dmFsdWU6IGl0ZW1zW2tleV0sXG5cdFx0XHRtZXRhOiBtZXRhc1trZXldXG5cdFx0fTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRXZhbHVhdGlvbk9yZGVyKGVxdWF0aW9uLCBldmFscykge1xuXHRsZXQgaW5qZWN0aW9ucyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLmluamVjdGlvbnMpLFxuXHRcdGlucHV0cyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLmlucHV0cyksXG5cdFx0b3V0cHV0cyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLm91dHB1dHMpO1xuXG5cdGlmKCFldmFscy5zaXplKSB7XG5cdFx0ZXZhbHMgPSBuZXcgU2V0KG91dHB1dHMpO1xuXHR9XG5cblx0bGV0IGRlcGVuZGVuY2llcyA9IG5ldyBNYXAoKTtcblx0b3V0cHV0cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRkZXBlbmRlbmNpZXMuc2V0KGtleSwgZXF1YXRpb24ub3V0cHV0c1trZXldLmRlcGVuZGVuY2llcyk7XG5cdH0pO1xuXG5cdGxldCBvcmRlciA9IFtdO1xuXG5cdGxldCBwcm9jZXNzZWRPdXRwdXRzID0gbmV3IFNldCgpO1xuXHRsZXQgcHJvY2Vzc091dHB1dCA9IChrZXksIHNldCA9IG5ldyBTZXQoKSkgPT4ge1xuXHRcdGlmKHByb2Nlc3NlZE91dHB1dHMuaGFzKGtleSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llcy5nZXQoa2V5KTtcblx0XHRpZighZGVwcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiT3V0cHV0IGBcIiArIGtleSArIFwiYCBub3QgZGVmaW5lZCBpbiBlcXVhdGlvbnMgc2V0XCIpO1xuXHRcdH1cblx0XHRpZihzZXQuaGFzKGtleSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk91dHB1dCBgXCIgKyBrZXkgKyBcImAgaGFzIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSBgXCIgKyBBcnJheS5mcm9tKHNldC52YWx1ZXMoKSkuam9pbihcIiAtPiBcIikgKyBcIiAtPiBcIiArIGtleSArIFwiYFwiKTtcblx0XHR9XG5cdFx0c2V0LmFkZChrZXkpO1xuXG5cdFx0ZGVwcy5maWx0ZXIoKGRlcCkgPT4ge1xuXHRcdFx0cmV0dXJuICF+aW5qZWN0aW9ucy5pbmRleE9mKGRlcCkgJiYgIX5pbnB1dHMuaW5kZXhPZihkZXApO1xuXHRcdH0pLmZvckVhY2goKGRlcCkgPT4ge1xuXHRcdFx0aWYoIX5vdXRwdXRzLmluZGV4T2YoZGVwKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJPdXRwdXQgYFwiICsga2V5ICsgXCJgIGhhcyBhIG1pc3NpbmcgZGVwZW5kZW5jeSBgXCIgKyBkZXAgKyBcImBcIik7XG5cdFx0XHR9XG5cblx0XHRcdHByb2Nlc3NPdXRwdXQoZGVwLCBuZXcgU2V0KHNldCkpO1xuXHRcdH0pO1xuXHRcdG9yZGVyLnB1c2goa2V5KTtcblx0XHRwcm9jZXNzZWRPdXRwdXRzLmFkZChrZXkpO1xuXHR9O1xuXHRldmFscy5mb3JFYWNoKChrZXkpID0+IHByb2Nlc3NPdXRwdXQoa2V5KSk7XG5cblx0cmV0dXJuIG9yZGVyO1xufVxuIiwiaW1wb3J0IFBhcmFtZXRlciBmcm9tIFwiLi9QYXJhbWV0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihhcmd1bWVudHNbMF0pO1xuXHR9XG59XG4iLCJpbXBvcnQgUGFyYW1ldGVyIGZyb20gXCIuL1BhcmFtZXRlclwiO1xuaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCB7JGluamVjdH0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7Zm9ybXVsYX0pIHtcblx0XHRzdXBlcihhcmd1bWVudHNbMF0pO1xuXG5cdFx0dGhpcy5mb3JtdWxhID0gZGkuYW5ub3RhdGUoZm9ybXVsYSk7XG5cdH1cblxuXHRldmFsdWF0ZSguLi5zdG9yZXMpIHtcblx0XHRyZXR1cm4gZGkuaW5qZWN0KHRoaXMuZm9ybXVsYSwgc3RvcmVzKTtcblx0fVxuXG5cdGdldCBkZXBlbmRlbmNpZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZm9ybXVsYVskaW5qZWN0XTtcblx0fVxufVxuIiwiaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCAqIGFzIGFzeW5jIGZyb20gXCIuLi91dGlsL2FzeW5jXCI7XG5pbXBvcnQgeyRtZXRhfSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKHtzeW1ib2wsIG1ldGEgPSB7fX0gPSB7fSkge1xuXHRcdHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuXHRcdHRoaXMubWV0YSA9IG1ldGE7XG5cdH1cblxuXHRnZXQgbWV0YSgpIHtcblx0XHRyZXR1cm4gdGhpc1skbWV0YV07XG5cdH1cblx0c2V0IG1ldGEocmF3KSB7XG5cdFx0bGV0IG1ldGEgPSBPYmplY3Qua2V5cyhyYXcpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRsZXQgaXRlbSA9IHJhd1trZXldO1xuXHRcdFx0aWYoZGkuaXNBbm5vdGF0YWJsZShpdGVtKSkge1xuXHRcdFx0XHRpdGVtID0gZGkuYW5ub3RhdGUoaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRtZW1vW2tleV0gPSBpdGVtO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXG5cdFx0dGhpc1skbWV0YV0gPSBPYmplY3QuZnJlZXplKG1ldGEpO1xuXHR9XG5cblx0ZXZhbHVhdGVNZXRhKC4uLnN0b3Jlcykge1xuXHRcdGxldCBtZXRhID0ge307XG5cblx0XHRPYmplY3Qua2V5cyh0aGlzLm1ldGEpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLm1ldGFba2V5XTtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRpdGVtID0gZGkuaW5qZWN0KGl0ZW0sIHN0b3Jlcyk7XG5cdFx0XHR9XG5cdFx0XHRtZXRhW2tleV0gPSBpdGVtO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKG1ldGEpO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmZXIoKSB7XG5cdGxldCBkZWZlcnJlZCA9IHt9O1xuXHRkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcblx0fSk7XG5cdHJldHVybiBkZWZlcnJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKG9iaikge1xuXHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cdGxldCBwcm9taXNlcyA9IGtleXMubWFwKChrZXkpID0+IHtcblx0XHRyZXR1cm4gb2JqW2tleV07XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigodmFsdWVzKSA9PiB7XG5cdFx0cmV0dXJuIGtleXMucmVkdWNlKChtZW1vLCBrZXksIGkpID0+IHtcblx0XHRcdG1lbW9ba2V5XSA9IHZhbHVlc1tpXTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RoZW5hYmxlKHApIHtcblx0cmV0dXJuICEhcC50aGVuO1xufVxuIiwiaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0ZShmbikge1xuXHRpZiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIiAmJiBmblskaW5qZWN0XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0cmV0dXJuIGZuO1xuXHR9XG5cblx0aWYgKGZuIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRsZXQgZmllbGRzID0gZm47XG5cdFx0Zm4gPSBmbi5wb3AoKTtcblx0XHRmblskaW5qZWN0XSA9IGZpZWxkcztcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRmblskaW5qZWN0XSA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvbiAuKj9cXCgoLio/KVxcKS8pWzFdLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoKGEpID0+IGEpO1xuXHRyZXR1cm4gZm47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoZm4sIC4uLnN0b3Jlcykge1xuXHRpZiAoIWZuWyRpbmplY3RdKSB7XG5cdFx0Zm4gPSBhbm5vdGF0ZShmbik7XG5cdH1cblxuXHQvLyBUT0RPOiBTdXBwb3J0IGZ1bmN0aW9uIGFyZ3VtZW50IGRlc3RydWN0dXJlIHN5bnRheCB3aXRoIG5hdGl2ZSwgYmFiZWwsIGFuZCB0cmFjZXVyXG5cblx0aWYoc3RvcmVzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRzdG9yZXMgPSBzdG9yZXNbMF07XG5cdH1cblxuXHRsZXQgcHJvbWlzZXMgPSBmblskaW5qZWN0XS5tYXAoKG5hbWUpID0+IHtcblx0XHQvLyBSZXBsYWNlIHRoaXMgd2l0aCBcImZpbmRcIiB3aGVuIHRoYXQgaXMgcmVhZHlcblx0XHRsZXQgaW5qZWN0aW9uID0gc3RvcmVzLnJlZHVjZVJpZ2h0KChpdGVtLCBzdG9yZSkgPT4ge1xuXHRcdFx0aWYoaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0b3JlW25hbWVdO1xuXHRcdH0sIHVuZGVmaW5lZCk7XG5cblx0XHRpZiAoaW5qZWN0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIGRlcGVuZGVuY3k6IFwiICsgbmFtZSwgZm4pO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5qZWN0aW9uO1xuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKGFyZ3MpID0+IHtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbm5vdGF0YWJsZShmbikge1xuXHRyZXR1cm4gKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIpIHx8IChmbiBpbnN0YW5jZW9mIEFycmF5ICYmIHR5cGVvZiBmbltmbi5sZW5ndGggLSAxXSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuIiwiZXhwb3J0IGNvbnN0ICRpbmplY3QgPSBTeW1ib2woXCIkaW5qZWN0XCIpO1xuZXhwb3J0IGNvbnN0ICRtZXRhID0gU3ltYm9sKFwiJG1ldGFcIik7XG5cbmV4cG9ydCBjb25zdCAkaW5qZWN0aW9ucyA9IFN5bWJvbChcIiRpbmplY3Rpb25zXCIpO1xuZXhwb3J0IGNvbnN0ICRpbnB1dHMgPSBTeW1ib2woXCIkaW5wdXRzXCIpO1xuZXhwb3J0IGNvbnN0ICRvdXRwdXRzID0gU3ltYm9sKFwiJG91dHB1dHNcIik7XG5cbmV4cG9ydCBjb25zdCAkZXZhbHVhdGlvbk9yZGVyID0gU3ltYm9sKFwiJGV2YWx1YXRpb25PcmRlclwiKTtcbiJdfQ==
