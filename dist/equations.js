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
			if (!(injections instanceof Map)) {
				this[_$injections$$inputs$$outputs$$evaluationOrder.$injections] = Object.keys(injections).reduce(function (map, key) {
					map.set(key, injections[key]);
					return map;
				}, new Map());
				return;
			}

			this[_$injections$$inputs$$outputs$$evaluationOrder.$injections] = injections = new Map(injections);
			injections.forEach(function (item, key) {
				if (typeof key != "string") {
					throw new Error("Invalid injection provided");
				}
			});
		}
	}, {
		key: "inputs",
		get: function () {
			return this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs];
		},
		set: function (inputs) {
			var _this = this;

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

			if (inputs instanceof Map) {
				(function () {
					var map = new Map();
					inputs.forEach(function (item, key) {
						item = convert(item);
						item.symbol = key;
						map.set(key, item);
					});
					_this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs] = inputs = map;
				})();
			} else if (inputs instanceof Array) {
				this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs] = inputs = inputs.reduce(function (map, item) {
					item = convert(item);
					map.set(item.symbol, item);
					return map;
				}, new Map());
			} else {
				this[_$injections$$inputs$$outputs$$evaluationOrder.$inputs] = inputs = Object.keys(inputs).reduce(function (map, key) {
					var item = convert(inputs[key]);
					item.symbol = key;
					map.set(key, item);
					return map;
				}, new Map());
			}

			inputs.forEach(function (item, key) {
				if (item.symbol !== key || typeof key != "string") {
					throw new Error("Invalid input provided");
				}
			});
		}
	}, {
		key: "outputs",
		get: function () {
			return this[_$injections$$inputs$$outputs$$evaluationOrder.$outputs];
		},
		set: function (outputs) {
			var _this2 = this;

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

			if (outputs instanceof Map) {
				(function () {
					var map = new Map();
					outputs.forEach(function (item, key) {
						item = convert(item);
						item.symbol = key;
						map.set(key, item);
					});
					_this2[_$injections$$inputs$$outputs$$evaluationOrder.$outputs] = outputs = map;
				})();
			} else {
				this[_$injections$$inputs$$outputs$$evaluationOrder.$outputs] = outputs = Object.keys(outputs).reduce(function (map, key) {
					var item = convert(outputs[key]);
					item.symbol = key;
					map.set(key, item);
					return map;
				}, new Map());
			}

			outputs.forEach(function (item, key) {
				if (item.symbol !== key || typeof key != "string") {
					throw new Error("Invalid output provided");
				}
			});

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
	}]);

	return Equation;
})();

exports["default"] = Equation;

function resolveEvaluationOrder(equation, evals) {
	var injections = Array.from(equation.injections.keys()),
	    inputs = Array.from(equation.inputs.keys()),
	    outputs = Array.from(equation.outputs.keys());

	if (!evals.size) {
		evals = new Set(outputs);
	}

	var dependencies = new Map();
	equation.outputs.forEach(function (output, key) {
		dependencies.set(key, output.dependencies);
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

},{"../util/symbols":8,"./Input":3,"./Output":4}],3:[function(require,module,exports){
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
		set: function (meta) {
			if (meta instanceof Map) {
				this[_$meta.$meta] = meta;
				return;
			}

			this[_$meta.$meta] = Object.keys(meta).reduce(function (map, key) {
				var item = meta[key];
				if (di.isAnnotatable(item)) {
					item = di.annotate(item);
				}
				map.set(key, item);
				return map;
			}, new Map());
		}
	}, {
		key: "evaluateMeta",
		value: function evaluateMeta() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			var meta = new Map();

			this.meta.forEach(function (item, key) {
				if (typeof item == "function") {
					item = di.inject(item, stores);
				}
				meta.set(key, item);
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
	var isMap = obj instanceof Map;
	var keys = isMap ? Array.from(obj.keys()) : Object.keys(obj);
	var promises = isMap ? Array.from(obj.values()) : keys.map(function (key) {
		return obj[key];
	});

	return Promise.all(promises).then(function (values) {
		return keys.reduce(function (memo, key, i) {
			if (isMap) {
				memo.set(key, values[i]);
			} else {
				memo[key] = values[i];
			}
			return memo;
		}, isMap ? new Map() : {});
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
			if (store instanceof Map) {
				return store.get(name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvYXN5bmMuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7d0JBQ0UsaUJBQWlCOzs7O3FCQUNwQixjQUFjOzs7O3NCQUNiLGVBQWU7Ozs7cUJBRW5CO0FBQ2QsU0FBUSx1QkFBQTtBQUNSLE1BQUssb0JBQUE7QUFDTCxPQUFNLHFCQUFBO0FBQ04sUUFBTyxFQUFQLE9BQU87Q0FDUDs7Ozs7Ozs7Ozs7Ozs7OztxQkNWaUIsU0FBUzs7OztzQkFDUixVQUFVOzs7OzZEQUNrQyxpQkFBaUI7O0lBRTNELFFBQVE7QUFDakIsVUFEUyxRQUFRLEdBQ21DOzBDQUFKLEVBQUU7OzZCQUFoRCxVQUFVO01BQVYsVUFBVSxtQ0FBRyxFQUFFO3lCQUFFLE1BQU07TUFBTixNQUFNLCtCQUFHLEVBQUU7MEJBQUUsT0FBTztNQUFQLE9B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QUFDLFVBQVUsQ0FBQyxDQUFDOztRQUE5QixRQUFRLEdBQVIsUUFBUTtBQUVkLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFBOUMsZ0JBQWdCLEdBQWhCLGdCQUFnQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBzeW1ib2xzIGZyb20gXCIuL3V0aWwvc3ltYm9sc1wiO1xuaW1wb3J0IEVxdWF0aW9uIGZyb20gXCIuL2NvcmUvRXF1YXRpb25cIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9jb3JlL0lucHV0XCI7XG5pbXBvcnQgT3V0cHV0IGZyb20gXCIuL2NvcmUvT3V0cHV0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0RXF1YXRpb24sXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdHN5bWJvbHNcbn07XG4iLCJpbXBvcnQgSW5wdXQgZnJvbSBcIi4vSW5wdXRcIjtcbmltcG9ydCBPdXRwdXQgZnJvbSBcIi4vT3V0cHV0XCI7XG5pbXBvcnQgeyRpbmplY3Rpb25zLCAkaW5wdXRzLCAkb3V0cHV0cywgJGV2YWx1YXRpb25PcmRlcn0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHtpbmplY3Rpb25zID0ge30sIGlucHV0cyA9IHt9LCBvdXRwdXRzID0ge319ID0ge30pIHtcblx0XHR0aGlzLmluamVjdGlvbnMgPSBpbmplY3Rpb25zO1xuXHRcdHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuXHRcdHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG5cdH1cblxuXHRnZXQgaW5qZWN0aW9ucygpIHtcblx0XHRyZXR1cm4gdGhpc1skaW5qZWN0aW9uc107XG5cdH1cblx0c2V0IGluamVjdGlvbnMoaW5qZWN0aW9ucykge1xuXHRcdGlmKCEoaW5qZWN0aW9ucyBpbnN0YW5jZW9mIE1hcCkpIHtcblx0XHRcdHRoaXNbJGluamVjdGlvbnNdID0gT2JqZWN0LmtleXMoaW5qZWN0aW9ucykucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0XHRtYXAuc2V0KGtleSwgaW5qZWN0aW9uc1trZXldKTtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH0sIG5ldyBNYXAoKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpc1skaW5qZWN0aW9uc10gPSBpbmplY3Rpb25zID0gbmV3IE1hcChpbmplY3Rpb25zKTtcblx0XHRpbmplY3Rpb25zLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0aWYodHlwZW9mIGtleSAhPSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5qZWN0aW9uIHByb3ZpZGVkXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0IGlucHV0cygpIHtcblx0XHRyZXR1cm4gdGhpc1skaW5wdXRzXTtcblx0fVxuXHRzZXQgaW5wdXRzKGlucHV0cykge1xuXHRcdGxldCBjb252ZXJ0ID0gKGl0ZW0pID0+IHtcblx0XHRcdGlmKGl0ZW0gaW5zdGFuY2VvZiBJbnB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBJbnB1dCh7XG5cdFx0XHRcdFx0c3ltYm9sOiBpdGVtXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJvYmplY3RcIiAmJiBpdGVtICE9IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBJbnB1dChpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgSW5wdXQoKTtcblx0XHR9O1xuXG5cdFx0aWYoaW5wdXRzIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0XHRsZXQgbWFwID0gbmV3IE1hcCgpO1xuXHRcdFx0aW5wdXRzLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0XHRpdGVtID0gY29udmVydChpdGVtKTtcblx0XHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRcdG1hcC5zZXQoa2V5LCBpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpc1skaW5wdXRzXSA9IGlucHV0cyA9IG1hcDtcblx0XHR9IGVsc2UgaWYoaW5wdXRzIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdHRoaXNbJGlucHV0c10gPSBpbnB1dHMgPSBpbnB1dHMucmVkdWNlKChtYXAsIGl0ZW0pID0+IHtcblx0XHRcdFx0aXRlbSA9IGNvbnZlcnQoaXRlbSk7XG5cdFx0XHRcdG1hcC5zZXQoaXRlbS5zeW1ib2wsIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwgbmV3IE1hcCgpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpc1skaW5wdXRzXSA9IGlucHV0cyA9IE9iamVjdC5rZXlzKGlucHV0cykucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgaXRlbSA9IGNvbnZlcnQoaW5wdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWFwLnNldChrZXksIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwgbmV3IE1hcCgpKTtcblx0XHR9XG5cblx0XHRpbnB1dHMuZm9yRWFjaCgoaXRlbSwga2V5KSA9PiB7XG5cdFx0XHRpZihpdGVtLnN5bWJvbCAhPT0ga2V5IHx8IHR5cGVvZiBrZXkgIT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGlucHV0IHByb3ZpZGVkXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0IG91dHB1dHMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJG91dHB1dHNdO1xuXHR9XG5cdHNldCBvdXRwdXRzKG91dHB1dHMpIHtcblx0XHRsZXQgY29udmVydCA9IChpdGVtKSA9PiB7XG5cdFx0XHRpZihpdGVtIGluc3RhbmNlb2YgT3V0cHV0KSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgT3V0cHV0KHtcblx0XHRcdFx0XHRmb3JtdWxhOiBpdGVtXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBPdXRwdXQoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGlmKG91dHB1dHMgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdGxldCBtYXAgPSBuZXcgTWFwKCk7XG5cdFx0XHRvdXRwdXRzLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0XHRpdGVtID0gY29udmVydChpdGVtKTtcblx0XHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRcdG1hcC5zZXQoa2V5LCBpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpc1skb3V0cHV0c10gPSBvdXRwdXRzID0gbWFwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzWyRvdXRwdXRzXSA9IG91dHB1dHMgPSBPYmplY3Qua2V5cyhvdXRwdXRzKS5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gY29udmVydChvdXRwdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWFwLnNldChrZXksIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwgbmV3IE1hcCgpKTtcblx0XHR9XG5cblx0XHRvdXRwdXRzLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0aWYoaXRlbS5zeW1ib2wgIT09IGtleSB8fCB0eXBlb2Yga2V5ICE9IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBvdXRwdXQgcHJvdmlkZWRcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbnVsbDtcblx0fVxuXG5cdGdldCBldmFsdWF0aW9uT3JkZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RXZhbHVhdGlvbk9yZGVyKCk7XG5cdH1cblxuXHRnZXRFdmFsdWF0aW9uT3JkZXIoLi4uZXZhbHMpIHtcblx0XHRpZihldmFsc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRldmFscyA9IGV2YWxzWzBdO1xuXHRcdH1cblx0XHRldmFscyA9IG5ldyBTZXQoZXZhbHMpO1xuXG5cdFx0aWYodGhpc1skZXZhbHVhdGlvbk9yZGVyXSA9PSBudWxsKSB7XG5cdFx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGxldCBjYWNoZUtleSA9IEFycmF5LmZyb20oZXZhbHMpLmpvaW4oKSxcblx0XHRcdGNhY2hlID0gdGhpc1skZXZhbHVhdGlvbk9yZGVyXS5nZXQoY2FjaGVLZXkpO1xuXHRcdGlmKGNhY2hlKSB7XG5cdFx0XHRyZXR1cm4gY2FjaGU7XG5cdFx0fVxuXHRcdGNhY2hlID0gcmVzb2x2ZUV2YWx1YXRpb25PcmRlcih0aGlzLCBldmFscyk7XG5cdFx0dGhpc1skZXZhbHVhdGlvbk9yZGVyXS5zZXQoY2FjaGVLZXksIGNhY2hlKTtcblxuXHRcdHJldHVybiBjYWNoZTtcblx0fVxufVxuXG5mdW5jdGlvbiByZXNvbHZlRXZhbHVhdGlvbk9yZGVyKGVxdWF0aW9uLCBldmFscykge1xuXHRsZXQgaW5qZWN0aW9ucyA9IEFycmF5LmZyb20oZXF1YXRpb24uaW5qZWN0aW9ucy5rZXlzKCkpLFxuXHRcdGlucHV0cyA9IEFycmF5LmZyb20oZXF1YXRpb24uaW5wdXRzLmtleXMoKSksXG5cdFx0b3V0cHV0cyA9IEFycmF5LmZyb20oZXF1YXRpb24ub3V0cHV0cy5rZXlzKCkpO1xuXG5cdGlmKCFldmFscy5zaXplKSB7XG5cdFx0ZXZhbHMgPSBuZXcgU2V0KG91dHB1dHMpO1xuXHR9XG5cblx0bGV0IGRlcGVuZGVuY2llcyA9IG5ldyBNYXAoKTtcblx0ZXF1YXRpb24ub3V0cHV0cy5mb3JFYWNoKGZ1bmN0aW9uIChvdXRwdXQsIGtleSkge1xuXHRcdGRlcGVuZGVuY2llcy5zZXQoa2V5LCBvdXRwdXQuZGVwZW5kZW5jaWVzKTtcblx0fSk7XG5cblx0bGV0IG9yZGVyID0gW107XG5cblx0bGV0IHByb2Nlc3NlZE91dHB1dHMgPSBuZXcgU2V0KCk7XG5cdGxldCBwcm9jZXNzT3V0cHV0ID0gKGtleSwgc2V0ID0gbmV3IFNldCgpKSA9PiB7XG5cdFx0aWYocHJvY2Vzc2VkT3V0cHV0cy5oYXMoa2V5KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBkZXBzID0gZGVwZW5kZW5jaWVzLmdldChrZXkpO1xuXHRcdGlmKCFkZXBzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJPdXRwdXQgYFwiICsga2V5ICsgXCJgIG5vdCBkZWZpbmVkIGluIGVxdWF0aW9ucyBzZXRcIik7XG5cdFx0fVxuXHRcdGlmKHNldC5oYXMoa2V5KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiT3V0cHV0IGBcIiArIGtleSArIFwiYCBoYXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5IGBcIiArIEFycmF5LmZyb20oc2V0LnZhbHVlcygpKS5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5ICsgXCJgXCIpO1xuXHRcdH1cblx0XHRzZXQuYWRkKGtleSk7XG5cblx0XHRkZXBzLmZpbHRlcigoZGVwKSA9PiB7XG5cdFx0XHRyZXR1cm4gIX5pbmplY3Rpb25zLmluZGV4T2YoZGVwKSAmJiAhfmlucHV0cy5pbmRleE9mKGRlcCk7XG5cdFx0fSkuZm9yRWFjaCgoZGVwKSA9PiB7XG5cdFx0XHRpZighfm91dHB1dHMuaW5kZXhPZihkZXApKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIk91dHB1dCBgXCIgKyBrZXkgKyBcImAgaGFzIGEgbWlzc2luZyBkZXBlbmRlbmN5IGBcIiArIGRlcCArIFwiYFwiKTtcblx0XHRcdH1cblxuXHRcdFx0cHJvY2Vzc091dHB1dChkZXAsIG5ldyBTZXQoc2V0KSk7XG5cdFx0fSk7XG5cdFx0b3JkZXIucHVzaChrZXkpO1xuXHRcdHByb2Nlc3NlZE91dHB1dHMuYWRkKGtleSk7XG5cdH07XG5cdGV2YWxzLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXHRyZXR1cm4gb3JkZXI7XG59XG4iLCJpbXBvcnQgUGFyYW1ldGVyIGZyb20gXCIuL1BhcmFtZXRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKGFyZ3VtZW50c1swXSk7XG5cdH1cbn1cbiIsImltcG9ydCBQYXJhbWV0ZXIgZnJvbSBcIi4vUGFyYW1ldGVyXCI7XG5pbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dHB1dCBleHRlbmRzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKHtmb3JtdWxhfSkge1xuXHRcdHN1cGVyKGFyZ3VtZW50c1swXSk7XG5cblx0XHR0aGlzLmZvcm11bGEgPSBkaS5hbm5vdGF0ZShmb3JtdWxhKTtcblx0fVxuXG5cdGV2YWx1YXRlKC4uLnN0b3Jlcykge1xuXHRcdHJldHVybiBkaS5pbmplY3QodGhpcy5mb3JtdWxhLCBzdG9yZXMpO1xuXHR9XG5cblx0Z2V0IGRlcGVuZGVuY2llcygpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtdWxhWyRpbmplY3RdO1xuXHR9XG59XG4iLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCB7JG1ldGF9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3Ioe3N5bWJvbCwgbWV0YSA9IHt9fSA9IHt9KSB7XG5cdFx0dGhpcy5zeW1ib2wgPSBzeW1ib2w7XG5cdFx0dGhpcy5tZXRhID0gbWV0YTtcblx0fVxuXG5cdGdldCBtZXRhKCkge1xuXHRcdHJldHVybiB0aGlzWyRtZXRhXTtcblx0fVxuXHRzZXQgbWV0YShtZXRhKSB7XG5cdFx0aWYobWV0YSBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdFx0dGhpc1skbWV0YV0gPSBtZXRhO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXNbJG1ldGFdID0gT2JqZWN0LmtleXMobWV0YSkucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0bGV0IGl0ZW0gPSBtZXRhW2tleV07XG5cdFx0XHRpZihkaS5pc0Fubm90YXRhYmxlKGl0ZW0pKSB7XG5cdFx0XHRcdGl0ZW0gPSBkaS5hbm5vdGF0ZShpdGVtKTtcblx0XHRcdH1cblx0XHRcdG1hcC5zZXQoa2V5LCBpdGVtKTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fSwgbmV3IE1hcCgpKTtcblx0fVxuXG5cdGV2YWx1YXRlTWV0YSguLi5zdG9yZXMpIHtcblx0XHRsZXQgbWV0YSA9IG5ldyBNYXAoKTtcblxuXHRcdHRoaXMubWV0YS5mb3JFYWNoKChpdGVtLCBrZXkpID0+IHtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRpdGVtID0gZGkuaW5qZWN0KGl0ZW0sIHN0b3Jlcyk7XG5cdFx0XHR9XG5cdFx0XHRtZXRhLnNldChrZXksIGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKG1ldGEpO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmZXIoKSB7XG5cdGxldCBkZWZlcnJlZCA9IHt9O1xuXHRkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcblx0fSk7XG5cdHJldHVybiBkZWZlcnJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKG9iaikge1xuXHRsZXQgaXNNYXAgPSAob2JqIGluc3RhbmNlb2YgTWFwKTtcblx0bGV0IGtleXMgPSBpc01hcCA/IEFycmF5LmZyb20ob2JqLmtleXMoKSkgOiBPYmplY3Qua2V5cyhvYmopO1xuXHRsZXQgcHJvbWlzZXMgPSBpc01hcCA/IEFycmF5LmZyb20ob2JqLnZhbHVlcygpKSA6IGtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRyZXR1cm4gb2JqW2tleV07XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAodmFsdWVzKSB7XG5cdFx0cmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXksIGkpIHtcblx0XHRcdGlmKGlzTWFwKSB7XG5cdFx0XHRcdG1lbW8uc2V0KGtleSwgdmFsdWVzW2ldKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lbW9ba2V5XSA9IHZhbHVlc1tpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIGlzTWFwID8gbmV3IE1hcCgpIDoge30pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUocCkge1xuXHRyZXR1cm4gISFwLnRoZW47XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGZuWyRpbmplY3RdID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uIC4qP1xcKCguKj8pXFwpLylbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuXHRcdHJldHVybiBhO1xuXHR9KTtcblx0cmV0dXJuIGZuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KGZuLCAuLi5zdG9yZXMpIHtcblx0aWYgKCFmblskaW5qZWN0XSkge1xuXHRcdGZuID0gYW5ub3RhdGUoZm4pO1xuXHR9XG5cblx0Ly8gVE9ETzogU3VwcG9ydCBmdW5jdGlvbiBhcmd1bWVudCBkZXN0cnVjdHVyZSBzeW50YXggd2l0aCBuYXRpdmUsIGJhYmVsLCBhbmQgdHJhY2V1clxuXG5cdGlmKHN0b3Jlc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0c3RvcmVzID0gc3RvcmVzWzBdO1xuXHR9XG5cblx0bGV0IHByb21pc2VzID0gZm5bJGluamVjdF0ubWFwKChuYW1lKSA9PiB7XG5cdFx0Ly8gUmVwbGFjZSB0aGlzIHdpdGggXCJmaW5kXCIgd2hlbiB0aGF0IGlzIHJlYWR5XG5cdFx0bGV0IGluamVjdGlvbiA9IHN0b3Jlcy5yZWR1Y2VSaWdodCgoaXRlbSwgc3RvcmUpID0+IHtcblx0XHRcdGlmKGl0ZW0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHN0b3JlIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0XHRcdHJldHVybiBzdG9yZS5nZXQobmFtZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RvcmVbbmFtZV07XG5cdFx0fSwgdW5kZWZpbmVkKTtcblxuXHRcdGlmIChpbmplY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogXCIgKyBuYW1lLCBmbik7XG5cdFx0fVxuXHRcdHJldHVybiBpbmplY3Rpb247XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoYXJncykgPT4ge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fubm90YXRhYmxlKGZuKSB7XG5cdHJldHVybiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIikgfHwgKGZuIGluc3RhbmNlb2YgQXJyYXkgJiYgdHlwZW9mIGZuW2ZuLmxlbmd0aCAtIDFdID09IFwiZnVuY3Rpb25cIik7XG59XG4iLCJleHBvcnQgY29uc3QgJGluamVjdCA9IFN5bWJvbChcIiRpbmplY3RcIik7XG5leHBvcnQgY29uc3QgJG1ldGEgPSBTeW1ib2woXCIkbWV0YVwiKTtcblxuZXhwb3J0IGNvbnN0ICRpbmplY3Rpb25zID0gU3ltYm9sKFwiJGluamVjdGlvbnNcIik7XG5leHBvcnQgY29uc3QgJGlucHV0cyA9IFN5bWJvbChcIiRpbnB1dHNcIik7XG5leHBvcnQgY29uc3QgJG91dHB1dHMgPSBTeW1ib2woXCIkb3V0cHV0c1wiKTtcblxuZXhwb3J0IGNvbnN0ICRldmFsdWF0aW9uT3JkZXIgPSBTeW1ib2woXCIkZXZhbHVhdGlvbk9yZGVyXCIpO1xuIl19
