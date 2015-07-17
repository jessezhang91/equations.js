(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.eqns = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = eqns;

var _import = require("./util/di");

var di = _interopRequireWildcard(_import);

var _EquationSet = require("./core/EquationSet");

var _EquationSet2 = _interopRequireDefault(_EquationSet);

function eqns(fn) {
	var data = undefined;
	if (di.isAnnotatable(fn)) {
		data = di.injectSync(fn, eqns.libraries || {});
	} else {
		data = fn;
	}
	return new _EquationSet2["default"](data);
}

module.exports = exports["default"];

},{"./core/EquationSet":3,"./util/di":5}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _import = require("../util/di");

var di = _interopRequireWildcard(_import);

var Equation = (function () {
	function Equation(symbol, definition) {
		_classCallCheck(this, Equation);

		if (di.isAnnotatable(definition)) {
			// Provided definition is annotatable => it's an equation
			this.equation = di.annotate(definition);
		} else if (typeof definition == "object" && !Array.isArray(definition)) {
			// Provided definition is an object => can contain initial and equation
			this.initial = definition.initial !== undefined ? definition.initial : definition.value;

			if (di.isAnnotatable(definition.equation)) {
				this.equation = di.annotate(definition.equation);
			}
		} else {
			// Provided definition is a value
			this.initial = definition;
		}

		this.hasInitial = this.initial !== undefined;
	}

	_createClass(Equation, [{
		key: "evaluate",
		value: function evaluate() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			return di.inject(this.equation, stores);
		}
	}]);

	return Equation;
})();

exports["default"] = Equation;
module.exports = exports["default"];

},{"../util/di":5}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
// import * as di from "../util/di";

var _$inject = require("../util/symbols");

var _import = require("../util/async");

var async = _interopRequireWildcard(_import);

var _Equation = require("./Equation");

var _Equation2 = _interopRequireDefault(_Equation);

var EquationSet = (function () {
	function EquationSet(_ref) {
		var _ref$options = _ref.options;
		var options = _ref$options === undefined ? {} : _ref$options;
		var _ref$inputs = _ref.inputs;
		var inputs = _ref$inputs === undefined ? {} : _ref$inputs;
		var _ref$calculations = _ref.calculations;
		var calculations = _ref$calculations === undefined ? {} : _ref$calculations;
		var _ref$outputs = _ref.outputs;
		var outputs = _ref$outputs === undefined ? {} : _ref$outputs;

		_classCallCheck(this, EquationSet);

		this.options = parseOptions(options);

		// Initialize sets
		this.sets = parseSets(inputs, calculations, outputs);

		this.evaluationOrder = getEvaluationOrder(this.sets);
	}

	_createClass(EquationSet, [{
		key: "calculate",
		value: function calculate() {
			var _this = this;

			var inputs = arguments[0] === undefined ? {} : arguments[0];
			var options = arguments[1] === undefined ? {} : arguments[1];
			var nonblocking = arguments[2] === undefined ? false : arguments[2];

			return this.evaluationOrder.then(function (order) {
				return calculateInternals.bind(_this)(order, inputs, options, nonblocking);
			});
		}
	}]);

	return EquationSet;
})();

exports["default"] = EquationSet;

function parseSets(inputs, calculations, outputs) {
	return {
		inputs: parseSet(inputs),
		calculations: parseSet(calculations),
		outputs: parseSet(outputs)
	};
}

function parseSet(set) {
	return Object.keys(set).reduce(function (memo, key) {
		memo[key] = new _Equation2["default"](key, set[key]);
		return memo;
	}, {});
}

function getEvaluationOrder(sets) {
	var _Object$keys$reduce = Object.keys(sets).reduce(function (memo, setKey) {
		var set = sets[setKey];

		Object.keys(set).forEach(function (key) {
			var equation = set[key];
			memo.dependencies[key] = equation.equation ? equation.equation[_$inject.$inject] : [];

			var deferred = memo.deferrals[key] = async.defer();
			if (equation.hasInitial) {
				memo.hasInitials[key] = true;
				deferred.resolve();
			}
			return memo;
		});

		return memo;
	}, {
		dependencies: {},
		hasInitials: {},
		deferrals: {}
	});

	var dependencies = _Object$keys$reduce.dependencies;
	var hasInitials = _Object$keys$reduce.hasInitials;
	var deferrals = _Object$keys$reduce.deferrals;

	// Find circular dependencies
	var processedOutputs = [];
	var processOutput = (function (_processOutput) {
		function processOutput(_x) {
			return _processOutput.apply(this, arguments);
		}

		processOutput.toString = function () {
			return _processOutput.toString();
		};

		return processOutput;
	})(function (key) {
		var path = arguments[1] === undefined ? [] : arguments[1];

		if (processedOutputs.includes(key) || hasInitials[key]) {
			return;
		}

		var deps = dependencies[key];
		if (!deps) {
			throw new Error("'" + key + "' not defined in equations set");
		}

		if (path.includes(key)) {
			var pathString = path.join(" -> ") + " -> " + key;
			throw new Error("Output '" + key + "' has a circular dependency '" + pathString + "'");
		}

		path.push(key);
		deps.forEach(function (dep) {
			if (dependencies[dep] == null) {
				throw new Error("'" + key + "' has a missing dependency '" + dep + "'");
			}
			processOutput(dep, path.slice());
		});

		processedOutputs.push(key);
	});

	// Iterate through all dependencies
	Object.keys(dependencies).forEach(function (key) {
		return processOutput(key);
	});

	// Find the order
	var order = [],
	    promises = [];

	Object.keys(dependencies).forEach(function (key) {
		var deps = dependencies[key].map(function (dep) {
			return deferrals[dep].promise;
		});

		Promise.all(deps).then(function () {
			deferrals[key].resolve();
		});
		deferrals[key].promise.then(function () {
			order.push(key);
		});
		promises.push(deferrals[key].promise);
	});

	return Promise.all(promises).then(function () {
		return order;
	});
}

function calculateInternals(order, inputs) {
	var _this2 = this;

	var optionOverrides = arguments[2] === undefined ? {} : arguments[2];
	var nonblocking = arguments[3] === undefined ? false : arguments[3];

	// Get locals
	var sets = this.sets;

	// Destructure options

	var _parseOptions = parseOptions(Object.assign({}, this.options, optionOverrides));

	var _parseOptions$iterative = _parseOptions.iterative;
	var maxSteps = _parseOptions$iterative.maxSteps;
	var delta = _parseOptions$iterative.delta;
	var allowNaN = _parseOptions.allowNaN;

	// Get all equations
	var equations = Object.keys(sets).reduce(function (memo, setKey) {
		var set = sets[setKey];

		Object.keys(set).forEach(function (key) {
			memo[key] = set[key];
		});
		return memo;
	}, {});

	// Get starting store
	var store = undefined,
	    storePromises = undefined;
	var inputKeys = new Set(Object.keys(sets.inputs));

	// First step
	storePromises = order.reduce(function (memo, key) {
		// If input is defined, use the input value. Otherwise, use the equation initial value
		if (inputs[key] !== undefined && inputKeys.has(key)) {
			memo[key] = inputs[key];
			return memo;
		}

		var equation = equations[key];
		if (equation.hasInitial) {
			memo[key] = equation.initial;
			return memo;
		}

		memo[key] = equation.evaluate(memo);
		return memo;
	}, {});

	return async.props(storePromises).then(function (result) {
		store = result;
		return step.bind(_this2)(0);
	});

	function step(n) {
		var _this3 = this;

		if (++n > maxSteps) {
			return formatResult(store);
		}

		storePromises = order.reduce(function (memo, key) {
			var equation = equations[key];
			if (equation.equation) {
				// Use last iteration if value is not undefined, otherwise, use current store
				memo[key] = equation.evaluate(equation.hasInitial ? store : memo);
			} else {
				memo[key] = store[key];
			}
			return memo;
		}, {});

		return async.props(storePromises).then(function (nextStore) {
			// Check delta
			var dirty = Object.keys(nextStore).some(function (key) {
				var prev = store[key],
				    curr = nextStore[key];

				if (!allowNaN && Number.isNaN(curr)) {
					throw new Error("" + key + " is NaN on step " + n);
				}

				// Matches
				if (prev === curr) {
					return false;
				}

				// Both are null or undefined
				if (prev == null && curr == null) {
					return false;
				}

				// One is null or undefined
				if (prev == null || curr == null) {
					return true;
				}

				// both NaN
				if (Number.isNaN(prev) && Number.isNaN(curr)) {
					return false;
				}

				// One is 0, check versus delta
				if (prev === 0 || curr === 0) {
					return Math.abs((prev - curr) / Math.max(Math.abs(prev), Math.abs(curr))) >= delta;
				}

				// Check versus delta
				return Math.abs((prev - curr) / curr) >= delta;
			});

			store = nextStore;

			var next = function next() {
				return !dirty ? formatResult(store) : step.bind(_this3)(n);
			};
			return nonblocking ? new Promise(function (resolve) {
				return setTimeout(function () {
					return resolve(next.bind(_this3)());
				});
			}) : next();
		});
	}

	function formatResult(result) {
		return Object.keys(sets).reduce(function (setMemo, setKey) {
			var set = sets[setKey];

			setMemo[setKey] = Object.keys(set).reduce(function (memo, key) {
				memo[key] = result[key];
				return memo;
			}, {});
			return setMemo;
		}, {});
	}
}

function parseOptions(options) {
	var out = Object.assign({}, options);

	// Check iterative
	if (out.iterative == null || !(typeof out.iterative == "object")) {
		if (out.iterative === true) {
			out.iterative = {
				maxSteps: 100,
				delta: 0.000001
			};
		} else {
			out.iterative = {
				maxSteps: 0,
				delta: 0
			};
		}
	}

	// Check allowNaN
	out.allowNaN = !!out.allowNaN;

	return out;
}
module.exports = exports["default"];

},{"../util/async":4,"../util/symbols":6,"./Equation":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.annotate = annotate;
exports.inject = inject;
exports.injectSync = injectSync;
exports.isAnnotatable = isAnnotatable;

var _$inject = require("./symbols");

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

	var matches = fn.toString().match(/^function(?: .*?| ?)\((.*?)\)\s?\{/);
	if (!matches.length) {
		matches = fn.toString().match(/^\((.*?)\)\s?=>\s?\{/);
	}
	fn[_$inject.$inject] = matches[1].split(/\s*,\s*/).filter(function (a) {
		return a;
	});
	return fn;
}

function injectInternals(sync, fn) {
	var _this = this;

	for (var _len = arguments.length, stores = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		stores[_key - 2] = arguments[_key];
	}

	if (!fn[_$inject.$inject]) {
		annotate(fn);
	}

	if (stores[0] instanceof Array) {
		stores = stores[0];
	}

	var items = fn[_$inject.$inject].map(function (name) {
		var foundStore = stores.find(function (store) {
			return store[name] !== undefined;
		});
		if (foundStore === undefined) {
			throw new Error("Cannot find dependency: " + name, fn);
		}
		return foundStore[name];
	});

	if (sync) {
		return fn.apply(this, items);
	}
	return Promise.all(items).then(function (args) {
		return fn.apply(_this, args);
	});
}

function inject(fn) {
	for (var _len2 = arguments.length, stores = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		stores[_key2 - 1] = arguments[_key2];
	}

	return injectInternals.apply(undefined, [false, fn].concat(stores));
}

function injectSync(fn) {
	for (var _len3 = arguments.length, stores = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
		stores[_key3 - 1] = arguments[_key3];
	}

	return injectInternals.apply(undefined, [true, fn].concat(stores));
}

function isAnnotatable(fn) {
	return typeof fn == "function" || Array.isArray(fn) && typeof fn[fn.length - 1] == "function";
}

},{"./symbols":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $inject = Symbol();
exports.$inject = $inject;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2FzeW5jLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2RpLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL3N5bWJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7cUJDR3dCLElBQUk7O3NCQUhSLFdBQVc7O0lBQW5CLEVBQUU7OzJCQUNVLG9CQUFvQjs7OztBQUU3QixTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDaEMsS0FBSSxJQUFJLFlBQUEsQ0FBQztBQUNULEtBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixNQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUMvQyxNQUFNO0FBQ04sTUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNWO0FBQ0QsUUFBTyw2QkFBZ0IsSUFBSSxDQUFDLENBQUM7Q0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ1htQixZQUFZOztJQUFwQixFQUFFOztJQUVPLFFBQVE7QUFDakIsVUFEUyxRQUFRLENBQ2hCLE1BQU0sRUFBRSxVQUFVLEVBQUU7d0JBRFosUUFBUTs7QUFFM0IsTUFBSSxFQUFFLENBQUMsYUFBYSxD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O0FBQ3ZDLFFBQU8sZUFBZSxtQkFBQyxJQUFJLEVBQUUsRUFBRSxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzVDOztBQUVNLFNBQVMsYUFBYSxDQUFDLEVBQUUsRUFBRTtBQUNqQyxRQUFPLEFBQUMsT0FBTyxFQUFFLElBQUksVUFBVSxJQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLEFBQUMsQ0FBQztDQUNsRzs7Ozs7Ozs7QUMzRE0sSUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFBbkIsT0FBTyxHQUFQLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4vdXRpbC9kaVwiO1xuaW1wb3J0IEVxdWF0aW9uU2V0IGZyb20gXCIuL2NvcmUvRXF1YXRpb25TZXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXFucyhmbikge1xuXHRsZXQgZGF0YTtcblx0aWYoZGkuaXNBbm5vdGF0YWJsZShmbikpIHtcblx0XHRkYXRhID0gZGkuaW5qZWN0U3luYyhmbiwgZXFucy5saWJyYXJpZXMgfHwge30pO1xuXHR9IGVsc2Uge1xuXHRcdGRhdGEgPSBmbjtcblx0fVxuXHRyZXR1cm4gbmV3IEVxdWF0aW9uU2V0KGRhdGEpO1xufVxuIiwiaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXF1YXRpb24ge1xuXHRjb25zdHJ1Y3RvcihzeW1ib2wsIGRlZmluaXRpb24pIHtcblx0XHRpZiAoZGkuaXNBbm5vdGF0YWJsZShkZWZpbml0aW9uKSkge1xuXHRcdFx0Ly8gUHJvdmlkZWQgZGVmaW5pdGlvbiBpcyBhbm5vdGF0YWJsZSA9PiBpdCdzIGFuIGVxdWF0aW9uXG5cdFx0XHR0aGlzLmVxdWF0aW9uID0gZGkuYW5ub3RhdGUoZGVmaW5pdGlvbik7XG5cdFx0fSBlbHNlIGlmKHR5cGVvZiBkZWZpbml0aW9uID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoZGVmaW5pdGlvbikpIHtcblx0XHRcdC8vIFByb3ZpZGVkIGRlZmluaXRpb24gaXMgYW4gb2JqZWN0ID0+IGNhbiBjb250YWluIGluaXRpYWwgYW5kIGVxdWF0aW9uXG5cdFx0XHR0aGlzLmluaXRpYWwgPSAoZGVmaW5pdGlvbi5pbml0aWFsICE9PSB1bmRlZmluZWQgPyBkZWZpbml0aW9uLmluaXRpYWwgOiBkZWZpbml0aW9uLnZhbHVlKTtcblxuXHRcdFx0aWYgKGRpLmlzQW5ub3RhdGFibGUoZGVmaW5pdGlvbi5lcXVhdGlvbikpIHtcblx0XHRcdFx0dGhpcy5lcXVhdGlvbiA9IGRpLmFubm90YXRlKGRlZmluaXRpb24uZXF1YXRpb24pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBQcm92aWRlZCBkZWZpbml0aW9uIGlzIGEgdmFsdWVcblx0XHRcdHRoaXMuaW5pdGlhbCA9IGRlZmluaXRpb247XG5cdFx0fVxuXG5cdFx0dGhpcy5oYXNJbml0aWFsID0gKHRoaXMuaW5pdGlhbCAhPT0gdW5kZWZpbmVkKTtcblx0fVxuXG5cdGV2YWx1YXRlKC4uLnN0b3Jlcykge1xuXHRcdHJldHVybiBkaS5pbmplY3QodGhpcy5lcXVhdGlvbiwgc3RvcmVzKTtcblx0fVxufVxuIiwiLy8gaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCB7JGluamVjdH0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCBFcXVhdGlvbiBmcm9tIFwiLi9FcXVhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvblNldCB7XG5cdGNvbnN0cnVjdG9yKHsgb3B0aW9ucyA9IHt9LCBpbnB1dHMgPSB7fSwgY2FsY3VsYXRpb25zID0ge30sIG91dHB1dHMgPSB7fSB9KSB7XG5cdFx0dGhpcy5vcHRpb25zID0gcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBzZXRzXG5cdFx0dGhpcy5zZXRzID0gcGFyc2VTZXRzKGlucHV0cywgY2FsY3VsYXRpb25zLCBvdXRwdXRzKTtcblxuXHRcdHRoaXMuZXZhbHVhdGlvbk9yZGVyID0gZ2V0RXZhbHVhdGlvbk9yZGVyKHRoaXMuc2V0cyk7XG5cdH1cblxuXHRjYWxjdWxhdGUoaW5wdXRzID0ge30sIG9wdGlvbnMgPSB7fSwgbm9uYmxvY2tpbmcgPSBmYWxzZSkge1xuXHRcdHJldHVybiB0aGlzLmV2YWx1YXRpb25PcmRlci50aGVuKChvcmRlcikgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGN1bGF0ZUludGVybmFscy5iaW5kKHRoaXMpKG9yZGVyLCBpbnB1dHMsIG9wdGlvbnMsIG5vbmJsb2NraW5nKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZVNldHMoaW5wdXRzLCBjYWxjdWxhdGlvbnMsIG91dHB1dHMpIHtcblx0cmV0dXJuIHtcblx0XHRpbnB1dHM6IHBhcnNlU2V0KGlucHV0cyksXG5cdFx0Y2FsY3VsYXRpb25zOiBwYXJzZVNldChjYWxjdWxhdGlvbnMpLFxuXHRcdG91dHB1dHM6IHBhcnNlU2V0KG91dHB1dHMpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2V0KHNldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMoc2V0KS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdG1lbW9ba2V5XSA9IG5ldyBFcXVhdGlvbihrZXksIHNldFtrZXldKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xufVxuXG5mdW5jdGlvbiBnZXRFdmFsdWF0aW9uT3JkZXIoc2V0cykge1xuXHRsZXQge2RlcGVuZGVuY2llcywgaGFzSW5pdGlhbHMsIGRlZmVycmFsc30gPSBPYmplY3Qua2V5cyhzZXRzKS5yZWR1Y2UoKG1lbW8sIHNldEtleSkgPT4ge1xuXHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRPYmplY3Qua2V5cyhzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bGV0IGVxdWF0aW9uID0gc2V0W2tleV07XG5cdFx0XHRtZW1vLmRlcGVuZGVuY2llc1trZXldID0gZXF1YXRpb24uZXF1YXRpb24gPyBlcXVhdGlvbi5lcXVhdGlvblskaW5qZWN0XSA6IFtdO1xuXG5cdFx0XHRsZXQgZGVmZXJyZWQgPSBtZW1vLmRlZmVycmFsc1trZXldID0gYXN5bmMuZGVmZXIoKTtcblx0XHRcdGlmKGVxdWF0aW9uLmhhc0luaXRpYWwpIHtcblx0XHRcdFx0bWVtby5oYXNJbml0aWFsc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gbWVtbztcblx0fSwge1xuXHRcdGRlcGVuZGVuY2llczoge30sXG5cdFx0aGFzSW5pdGlhbHM6IHt9LFxuXHRcdGRlZmVycmFsczoge31cblx0fSk7XG5cblx0Ly8gRmluZCBjaXJjdWxhciBkZXBlbmRlbmNpZXNcblx0bGV0IHByb2Nlc3NlZE91dHB1dHMgPSBbXTtcblx0bGV0IHByb2Nlc3NPdXRwdXQgPSAoa2V5LCBwYXRoID0gW10pID0+IHtcblx0XHRpZiAocHJvY2Vzc2VkT3V0cHV0cy5pbmNsdWRlcyhrZXkpIHx8IGhhc0luaXRpYWxzW2tleV0pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llc1trZXldO1xuXHRcdGlmICghZGVwcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtrZXl9JyBub3QgZGVmaW5lZCBpbiBlcXVhdGlvbnMgc2V0YCk7XG5cdFx0fVxuXG5cdFx0aWYgKHBhdGguaW5jbHVkZXMoa2V5KSkge1xuXHRcdFx0bGV0IHBhdGhTdHJpbmcgPSBwYXRoLmpvaW4oXCIgLT4gXCIpICsgXCIgLT4gXCIgKyBrZXk7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE91dHB1dCAnJHtrZXl9JyBoYXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5ICcke3BhdGhTdHJpbmd9J2ApO1xuXHRcdH1cblxuXHRcdHBhdGgucHVzaChrZXkpO1xuXHRcdGRlcHMuZm9yRWFjaCgoZGVwKSA9PiB7XG5cdFx0XHRpZiAoZGVwZW5kZW5jaWVzW2RlcF0gPT0gbnVsbCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2tleX0nIGhhcyBhIG1pc3NpbmcgZGVwZW5kZW5jeSAnJHtkZXB9J2ApO1xuXHRcdFx0fVxuXHRcdFx0cHJvY2Vzc091dHB1dChkZXAsIHBhdGguc2xpY2UoKSk7XG5cdFx0fSk7XG5cblx0XHRwcm9jZXNzZWRPdXRwdXRzLnB1c2goa2V5KTtcblx0fTtcblxuXHQvLyBJdGVyYXRlIHRocm91Z2ggYWxsIGRlcGVuZGVuY2llc1xuXHRPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXG5cdC8vIEZpbmQgdGhlIG9yZGVyXG5cdGxldCBvcmRlciA9IFtdLFxuXHRcdHByb21pc2VzID0gW107XG5cblx0T2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llc1trZXldLm1hcCgoZGVwKSA9PiB7XG5cdFx0XHRyZXR1cm4gZGVmZXJyYWxzW2RlcF0ucHJvbWlzZTtcblx0XHR9KTtcblxuXHRcdFByb21pc2UuYWxsKGRlcHMpLnRoZW4oKCkgPT4ge1xuXHRcdFx0ZGVmZXJyYWxzW2tleV0ucmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHRcdGRlZmVycmFsc1trZXldLnByb21pc2UudGhlbigoKSA9PiB7XG5cdFx0XHRvcmRlci5wdXNoKGtleSk7XG5cdFx0fSk7XG5cdFx0cHJvbWlzZXMucHVzaChkZWZlcnJhbHNba2V5XS5wcm9taXNlKTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcblx0XHRyZXR1cm4gb3JkZXI7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVJbnRlcm5hbHMob3JkZXIsIGlucHV0cywgb3B0aW9uT3ZlcnJpZGVzID0ge30sIG5vbmJsb2NraW5nID0gZmFsc2UpIHtcblx0Ly8gR2V0IGxvY2Fsc1xuXHRsZXQgc2V0cyA9IHRoaXMuc2V0cztcblxuXHQvLyBEZXN0cnVjdHVyZSBvcHRpb25zXG5cdGxldCB7XG5cdFx0aXRlcmF0aXZlOiB7bWF4U3RlcHMsIGRlbHRhfSxcblx0XHRhbGxvd05hTlxuXHR9ID0gcGFyc2VPcHRpb25zKE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucywgb3B0aW9uT3ZlcnJpZGVzKSk7XG5cblx0Ly8gR2V0IGFsbCBlcXVhdGlvbnNcblx0bGV0IGVxdWF0aW9ucyA9IE9iamVjdC5rZXlzKHNldHMpLnJlZHVjZSgobWVtbywgc2V0S2V5KSA9PiB7XG5cdFx0bGV0IHNldCA9IHNldHNbc2V0S2V5XTtcblxuXHRcdE9iamVjdC5rZXlzKHNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRtZW1vW2tleV0gPSBzZXRba2V5XTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xuXG5cdC8vIEdldCBzdGFydGluZyBzdG9yZVxuXHRsZXQgc3RvcmUsIHN0b3JlUHJvbWlzZXM7XG5cdGxldCBpbnB1dEtleXMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHNldHMuaW5wdXRzKSk7XG5cblx0Ly8gRmlyc3Qgc3RlcFxuXHRzdG9yZVByb21pc2VzID0gb3JkZXIucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHQvLyBJZiBpbnB1dCBpcyBkZWZpbmVkLCB1c2UgdGhlIGlucHV0IHZhbHVlLiBPdGhlcndpc2UsIHVzZSB0aGUgZXF1YXRpb24gaW5pdGlhbCB2YWx1ZVxuXHRcdGlmKGlucHV0c1trZXldICE9PSB1bmRlZmluZWQgJiYgaW5wdXRLZXlzLmhhcyhrZXkpKSB7XG5cdFx0XHRtZW1vW2tleV0gPSBpbnB1dHNba2V5XTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH1cblxuXHRcdGxldCBlcXVhdGlvbiA9IGVxdWF0aW9uc1trZXldO1xuXHRcdGlmKGVxdWF0aW9uLmhhc0luaXRpYWwpIHtcblx0XHRcdG1lbW9ba2V5XSA9IGVxdWF0aW9uLmluaXRpYWw7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9XG5cblx0XHRtZW1vW2tleV0gPSBlcXVhdGlvbi5ldmFsdWF0ZShtZW1vKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xuXG5cdHJldHVybiBhc3luYy5wcm9wcyhzdG9yZVByb21pc2VzKS50aGVuKChyZXN1bHQpID0+IHtcblx0XHRzdG9yZSA9IHJlc3VsdDtcblx0XHRyZXR1cm4gc3RlcC5iaW5kKHRoaXMpKDApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBzdGVwKG4pIHtcblx0XHRpZiAoKytuID4gbWF4U3RlcHMpIHtcblx0XHRcdHJldHVybiBmb3JtYXRSZXN1bHQoc3RvcmUpO1xuXHRcdH1cblxuXHRcdHN0b3JlUHJvbWlzZXMgPSBvcmRlci5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdFx0bGV0IGVxdWF0aW9uID0gZXF1YXRpb25zW2tleV07XG5cdFx0XHRpZiAoZXF1YXRpb24uZXF1YXRpb24pIHtcblx0XHRcdFx0Ly8gVXNlIGxhc3QgaXRlcmF0aW9uIGlmIHZhbHVlIGlzIG5vdCB1bmRlZmluZWQsIG90aGVyd2lzZSwgdXNlIGN1cnJlbnQgc3RvcmVcblx0XHRcdFx0bWVtb1trZXldID0gZXF1YXRpb24uZXZhbHVhdGUoZXF1YXRpb24uaGFzSW5pdGlhbCA/IHN0b3JlIDogbWVtbyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZW1vW2tleV0gPSBzdG9yZVtrZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKHN0b3JlUHJvbWlzZXMpLnRoZW4oKG5leHRTdG9yZSkgPT4ge1xuXHRcdFx0Ly8gQ2hlY2sgZGVsdGFcblx0XHRcdGxldCBkaXJ0eSA9IE9iamVjdC5rZXlzKG5leHRTdG9yZSkuc29tZSgoa2V5KSA9PiB7XG5cdFx0XHRcdGxldCBwcmV2ID0gc3RvcmVba2V5XSxcblx0XHRcdFx0XHRjdXJyID0gbmV4dFN0b3JlW2tleV07XG5cblx0XHRcdFx0aWYgKCFhbGxvd05hTiAmJiBOdW1iZXIuaXNOYU4oY3VycikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7a2V5fSBpcyBOYU4gb24gc3RlcCAke259YCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYXRjaGVzXG5cdFx0XHRcdGlmIChwcmV2ID09PSBjdXJyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQm90aCBhcmUgbnVsbCBvciB1bmRlZmluZWRcblx0XHRcdFx0aWYgKHByZXYgPT0gbnVsbCAmJiBjdXJyID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBPbmUgaXMgbnVsbCBvciB1bmRlZmluZWRcblx0XHRcdFx0aWYgKHByZXYgPT0gbnVsbCB8fCBjdXJyID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGJvdGggTmFOXG5cdFx0XHRcdGlmIChOdW1iZXIuaXNOYU4ocHJldikgJiYgTnVtYmVyLmlzTmFOKGN1cnIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25lIGlzIDAsIGNoZWNrIHZlcnN1cyBkZWx0YVxuXHRcdFx0XHRpZiAocHJldiA9PT0gMCB8fCBjdXJyID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKChwcmV2IC0gY3VycikgLyBNYXRoLm1heChNYXRoLmFicyhwcmV2KSwgTWF0aC5hYnMoY3VycikpKSA+PSBkZWx0YTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHZlcnN1cyBkZWx0YVxuXHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMoKHByZXYgLSBjdXJyKSAvIGN1cnIpID49IGRlbHRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdHN0b3JlID0gbmV4dFN0b3JlO1xuXG5cdFx0XHRsZXQgbmV4dCA9ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuICFkaXJ0eSA/IGZvcm1hdFJlc3VsdChzdG9yZSkgOiBzdGVwLmJpbmQodGhpcykobik7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5vbmJsb2NraW5nID8gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZShuZXh0LmJpbmQodGhpcykoKSkpKSA6IG5leHQoKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFJlc3VsdChyZXN1bHQpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMoc2V0cykucmVkdWNlKChzZXRNZW1vLCBzZXRLZXkpID0+IHtcblx0XHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRcdHNldE1lbW9bc2V0S2V5XSA9IE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdFx0bWVtb1trZXldID0gcmVzdWx0W2tleV07XG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0cmV0dXJuIHNldE1lbW87XG5cdFx0fSwge30pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvcHRpb25zKSB7XG5cdGxldCBvdXQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcblxuXHQvLyBDaGVjayBpdGVyYXRpdmVcblx0aWYgKG91dC5pdGVyYXRpdmUgPT0gbnVsbCB8fCAhKHR5cGVvZiBvdXQuaXRlcmF0aXZlID09IFwib2JqZWN0XCIpKSB7XG5cdFx0aWYgKG91dC5pdGVyYXRpdmUgPT09IHRydWUpIHtcblx0XHRcdG91dC5pdGVyYXRpdmUgPSB7XG5cdFx0XHRcdG1heFN0ZXBzOiAxMDAsXG5cdFx0XHRcdGRlbHRhOiAxZS02XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXQuaXRlcmF0aXZlID0ge1xuXHRcdFx0XHRtYXhTdGVwczogMCxcblx0XHRcdFx0ZGVsdGE6IDBcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgYWxsb3dOYU5cblx0b3V0LmFsbG93TmFOID0gISFvdXQuYWxsb3dOYU47XG5cblx0cmV0dXJuIG91dDtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkZWZlcigpIHtcblx0bGV0IGRlZmVycmVkID0ge307XG5cdGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0ZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0ZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuXHR9KTtcblx0cmV0dXJuIGRlZmVycmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMob2JqKSB7XG5cdGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblx0bGV0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4ge1xuXHRcdHJldHVybiBvYmpba2V5XTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCh2YWx1ZXMpID0+IHtcblx0XHRyZXR1cm4ga2V5cy5yZWR1Y2UoKG1lbW8sIGtleSwgaSkgPT4ge1xuXHRcdFx0bWVtb1trZXldID0gdmFsdWVzW2ldO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUocCkge1xuXHRyZXR1cm4gISFwLnRoZW47XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGxldCBtYXRjaGVzID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uKD86IC4qP3wgPylcXCgoLio/KVxcKVxccz9cXHsvKTtcblx0aWYoIW1hdGNoZXMubGVuZ3RoKSB7XG5cdFx0bWF0Y2hlcyA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15cXCgoLio/KVxcKVxccz89Plxccz9cXHsvKTtcblx0fVxuXHRmblskaW5qZWN0XSA9IG1hdGNoZXNbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcigoYSkgPT4gYSk7XG5cdHJldHVybiBmbjtcbn1cblxuZnVuY3Rpb24gaW5qZWN0SW50ZXJuYWxzKHN5bmMsIGZuLCAuLi5zdG9yZXMpIHtcblx0aWYoIWZuWyRpbmplY3RdKSB7XG5cdFx0YW5ub3RhdGUoZm4pO1xuXHR9XG5cblx0aWYoc3RvcmVzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRzdG9yZXMgPSBzdG9yZXNbMF07XG5cdH1cblxuXHRsZXQgaXRlbXMgPSBmblskaW5qZWN0XS5tYXAoKG5hbWUpID0+IHtcblx0XHRsZXQgZm91bmRTdG9yZSA9IHN0b3Jlcy5maW5kKChzdG9yZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHN0b3JlW25hbWVdICE9PSB1bmRlZmluZWQ7XG5cdFx0fSk7XG5cdFx0aWYgKGZvdW5kU3RvcmUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBkZXBlbmRlbmN5OiAke25hbWV9YCwgZm4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZm91bmRTdG9yZVtuYW1lXTtcblx0fSk7XG5cblx0aWYoc3luYykge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBpdGVtcyk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UuYWxsKGl0ZW1zKS50aGVuKChhcmdzKSA9PiB7XG5cdFx0cmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdChmbiwgLi4uc3RvcmVzKSB7XG5cdHJldHVybiBpbmplY3RJbnRlcm5hbHMoZmFsc2UsIGZuLCAuLi5zdG9yZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U3luYyhmbiwgLi4uc3RvcmVzKSB7XG5cdHJldHVybiBpbmplY3RJbnRlcm5hbHModHJ1ZSwgZm4sIC4uLnN0b3Jlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fubm90YXRhYmxlKGZuKSB7XG5cdHJldHVybiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIikgfHwgKEFycmF5LmlzQXJyYXkoZm4pICYmIHR5cGVvZiBmbltmbi5sZW5ndGggLSAxXSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuIiwiZXhwb3J0IGNvbnN0ICRpbmplY3QgPSBTeW1ib2woKTtcbiJdfQ==
