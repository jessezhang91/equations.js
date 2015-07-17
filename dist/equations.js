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

		this.dependencies = solveDependencies(this.sets);
	}

	_createClass(EquationSet, [{
		key: "calculate",
		value: function calculate() {
			var _this = this;

			var inputs = arguments[0] === undefined ? {} : arguments[0];
			var options = arguments[1] === undefined ? {} : arguments[1];
			var nonblocking = arguments[2] === undefined ? false : arguments[2];

			return this.dependencies.then(function (dependencies) {
				var order = dependencies.order;
				var circularInitials = dependencies.circularInitials;

				return calculateInternals.bind(_this)(order, circularInitials, inputs, options, nonblocking);
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

function solveDependencies(sets) {
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
	var processedOutputs = [],
	    circularInitials = {};
	var findCircularDependencies = (function (_findCircularDependencies) {
		function findCircularDependencies(_x) {
			return _findCircularDependencies.apply(this, arguments);
		}

		findCircularDependencies.toString = function () {
			return _findCircularDependencies.toString();
		};

		return findCircularDependencies;
	})(function (key) {
		var path = arguments[1] === undefined ? [] : arguments[1];
		var allowCircular = arguments[2] === undefined ? false : arguments[2];

		if (processedOutputs.includes(key)) {
			return;
		}

		var deps = dependencies[key];
		if (!deps) {
			throw new Error("'" + key + "' not defined in equations set");
		}

		allowCircular = allowCircular || hasInitials[key];

		if (path.includes(key)) {
			if (allowCircular) {
				path.filter(function (pathKey) {
					return hasInitials[pathKey];
				}).forEach(function (pathKey) {
					circularInitials[pathKey] = true;
				});
				return;
			}
			var pathString = path.join(" -> ") + " -> " + key;
			throw new Error("Output '" + key + "' has a circular dependency '" + pathString + "'");
		}

		path.push(key);
		deps.forEach(function (dep) {
			if (dependencies[dep] == null) {
				throw new Error("'" + key + "' has a missing dependency '" + dep + "'");
			}
			findCircularDependencies(dep, path.slice(), allowCircular);
		});

		processedOutputs.push(key);
	});

	// Iterate through all dependencies, find the evaluation order
	var order = [],
	    promises = [];
	Object.keys(dependencies).forEach(function (key) {
		findCircularDependencies(key);

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
		return {
			order: order,
			circularInitials: circularInitials
		};
	});
}

function calculateInternals(order, circularInitials, inputs) {
	var _this2 = this;

	var optionOverrides = arguments[3] === undefined ? {} : arguments[3];
	var nonblocking = arguments[4] === undefined ? false : arguments[4];

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
		var equation = equations[key];

		// If input is defined, use the input value. Otherwise, use the equation initial value
		if (inputKeys.has(key)) {
			memo[key] = inputs[key] !== undefined ? inputs[key] : equations[key].initial;
			if (memo[key] !== undefined) {
				return memo;
			}
		}

		if (circularInitials[key]) {
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
				memo[key] = equation.evaluate(circularInitials[key] ? store : memo);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2FzeW5jLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2RpLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL3N5bWJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7cUJDR3dCLElBQUk7O3NCQUhSLFdBQVc7O0lBQW5CLEVBQUU7OzJCQUNVLG9CQUFvQjs7OztBQUU3QixTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDaEMsS0FBSSxJQUFJLFlBQUEsQ0FBQztBQUNULEtBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixNQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUMvQyxNQUFNO0FBQ04sTUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNWO0FBQ0QsUUFBTyw2QkFBZ0IsSUFBSSxDQUFDLENBQUM7Q0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ1htQixZQUFZOztJQUFwQixFQUFFOztJQUVPLFFBQVE7QUFDakIsVUFEUyxRQUFRLENBQ2hCLE1BQU0sRUFBRSxVQUFVLEVBQUU7d0JBRFosUUFBUTs7QUFFM0IsTUFBSSxFQUFFLENBQUMsYUFBYSxD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LEVBQUksRUFBRSxDQUFDLENBQUM7R0FDdkQ7QUFDRCxTQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN4QixDQUFDLENBQUM7O0FBRUgsS0FBRyxJQUFJLEVBQUU7QUFDUixTQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQzdCO0FBQ0QsUUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUN4QyxTQUFPLEVBQUUsQ0FBQyxLQUFLLFFBQU8sSUFBSSxDQUFDLENBQUM7RUFDNUIsQ0FBQyxDQUFDO0NBQ0g7O0FBRU0sU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFhO29DQUFSLE1BQU07QUFBTixRQUFNOzs7QUFDbkMsUUFBTyxlQUFlLG1CQUFDLEtBQUssRUFBRSxFQUFFLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0M7O0FBRU0sU0FBUyxVQUFVLENBQUMsRUFBRSxFQUFhO29DQUFSLE1BQU07QUFBTixRQUFNOzs7QUFDdkMsUUFBTyxlQUFlLG1CQUFDLElBQUksRUFBRSxFQUFFLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDNUM7O0FBRU0sU0FBUyxhQUFhLENBQUMsRUFBRSxFQUFFO0FBQ2pDLFFBQU8sQUFBQyxPQUFPLEVBQUUsSUFBSSxVQUFVLElBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLFVBQVUsQUFBQyxDQUFDO0NBQ2xHOzs7Ozs7OztBQzNETSxJQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUFuQixPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi91dGlsL2RpXCI7XG5pbXBvcnQgRXF1YXRpb25TZXQgZnJvbSBcIi4vY29yZS9FcXVhdGlvblNldFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlcW5zKGZuKSB7XG5cdGxldCBkYXRhO1xuXHRpZihkaS5pc0Fubm90YXRhYmxlKGZuKSkge1xuXHRcdGRhdGEgPSBkaS5pbmplY3RTeW5jKGZuLCBlcW5zLmxpYnJhcmllcyB8fCB7fSk7XG5cdH0gZWxzZSB7XG5cdFx0ZGF0YSA9IGZuO1xuXHR9XG5cdHJldHVybiBuZXcgRXF1YXRpb25TZXQoZGF0YSk7XG59XG4iLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHN5bWJvbCwgZGVmaW5pdGlvbikge1xuXHRcdGlmIChkaS5pc0Fubm90YXRhYmxlKGRlZmluaXRpb24pKSB7XG5cdFx0XHQvLyBQcm92aWRlZCBkZWZpbml0aW9uIGlzIGFubm90YXRhYmxlID0+IGl0J3MgYW4gZXF1YXRpb25cblx0XHRcdHRoaXMuZXF1YXRpb24gPSBkaS5hbm5vdGF0ZShkZWZpbml0aW9uKTtcblx0XHR9IGVsc2UgaWYodHlwZW9mIGRlZmluaXRpb24gPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuXHRcdFx0Ly8gUHJvdmlkZWQgZGVmaW5pdGlvbiBpcyBhbiBvYmplY3QgPT4gY2FuIGNvbnRhaW4gaW5pdGlhbCBhbmQgZXF1YXRpb25cblx0XHRcdHRoaXMuaW5pdGlhbCA9IChkZWZpbml0aW9uLmluaXRpYWwgIT09IHVuZGVmaW5lZCA/IGRlZmluaXRpb24uaW5pdGlhbCA6IGRlZmluaXRpb24udmFsdWUpO1xuXG5cdFx0XHRpZiAoZGkuaXNBbm5vdGF0YWJsZShkZWZpbml0aW9uLmVxdWF0aW9uKSkge1xuXHRcdFx0XHR0aGlzLmVxdWF0aW9uID0gZGkuYW5ub3RhdGUoZGVmaW5pdGlvbi5lcXVhdGlvbik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFByb3ZpZGVkIGRlZmluaXRpb24gaXMgYSB2YWx1ZVxuXHRcdFx0dGhpcy5pbml0aWFsID0gZGVmaW5pdGlvbjtcblx0XHR9XG5cblx0XHR0aGlzLmhhc0luaXRpYWwgPSAodGhpcy5pbml0aWFsICE9PSB1bmRlZmluZWQpO1xuXHR9XG5cblx0ZXZhbHVhdGUoLi4uc3RvcmVzKSB7XG5cdFx0cmV0dXJuIGRpLmluamVjdCh0aGlzLmVxdWF0aW9uLCBzdG9yZXMpO1xuXHR9XG59XG4iLCIvLyBpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5pbXBvcnQgKiBhcyBhc3luYyBmcm9tIFwiLi4vdXRpbC9hc3luY1wiO1xuaW1wb3J0IEVxdWF0aW9uIGZyb20gXCIuL0VxdWF0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWF0aW9uU2V0IHtcblx0Y29uc3RydWN0b3IoeyBvcHRpb25zID0ge30sIGlucHV0cyA9IHt9LCBjYWxjdWxhdGlvbnMgPSB7fSwgb3V0cHV0cyA9IHt9IH0pIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBwYXJzZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHQvLyBJbml0aWFsaXplIHNldHNcblx0XHR0aGlzLnNldHMgPSBwYXJzZVNldHMoaW5wdXRzLCBjYWxjdWxhdGlvbnMsIG91dHB1dHMpO1xuXG5cdFx0dGhpcy5kZXBlbmRlbmNpZXMgPSBzb2x2ZURlcGVuZGVuY2llcyh0aGlzLnNldHMpO1xuXHR9XG5cblx0Y2FsY3VsYXRlKGlucHV0cyA9IHt9LCBvcHRpb25zID0ge30sIG5vbmJsb2NraW5nID0gZmFsc2UpIHtcblx0XHRyZXR1cm4gdGhpcy5kZXBlbmRlbmNpZXMudGhlbigoZGVwZW5kZW5jaWVzKSA9PiB7XG5cdFx0XHRsZXQge29yZGVyLCBjaXJjdWxhckluaXRpYWxzfSA9IGRlcGVuZGVuY2llcztcblx0XHRcdHJldHVybiBjYWxjdWxhdGVJbnRlcm5hbHMuYmluZCh0aGlzKShvcmRlciwgY2lyY3VsYXJJbml0aWFscywgaW5wdXRzLCBvcHRpb25zLCBub25ibG9ja2luZyk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VTZXRzKGlucHV0cywgY2FsY3VsYXRpb25zLCBvdXRwdXRzKSB7XG5cdHJldHVybiB7XG5cdFx0aW5wdXRzOiBwYXJzZVNldChpbnB1dHMpLFxuXHRcdGNhbGN1bGF0aW9uczogcGFyc2VTZXQoY2FsY3VsYXRpb25zKSxcblx0XHRvdXRwdXRzOiBwYXJzZVNldChvdXRwdXRzKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVNldChzZXQpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRtZW1vW2tleV0gPSBuZXcgRXF1YXRpb24oa2V5LCBzZXRba2V5XSk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gc29sdmVEZXBlbmRlbmNpZXMoc2V0cykge1xuXHRsZXQge2RlcGVuZGVuY2llcywgaGFzSW5pdGlhbHMsIGRlZmVycmFsc30gPSBPYmplY3Qua2V5cyhzZXRzKS5yZWR1Y2UoKG1lbW8sIHNldEtleSkgPT4ge1xuXHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRPYmplY3Qua2V5cyhzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bGV0IGVxdWF0aW9uID0gc2V0W2tleV07XG5cdFx0XHRtZW1vLmRlcGVuZGVuY2llc1trZXldID0gZXF1YXRpb24uZXF1YXRpb24gPyBlcXVhdGlvbi5lcXVhdGlvblskaW5qZWN0XSA6IFtdO1xuXG5cdFx0XHRsZXQgZGVmZXJyZWQgPSBtZW1vLmRlZmVycmFsc1trZXldID0gYXN5bmMuZGVmZXIoKTtcblx0XHRcdGlmKGVxdWF0aW9uLmhhc0luaXRpYWwpIHtcblx0XHRcdFx0bWVtby5oYXNJbml0aWFsc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gbWVtbztcblx0fSwge1xuXHRcdGRlcGVuZGVuY2llczoge30sXG5cdFx0aGFzSW5pdGlhbHM6IHt9LFxuXHRcdGRlZmVycmFsczoge31cblx0fSk7XG5cblx0Ly8gRmluZCBjaXJjdWxhciBkZXBlbmRlbmNpZXNcblx0bGV0IHByb2Nlc3NlZE91dHB1dHMgPSBbXSxcblx0XHRjaXJjdWxhckluaXRpYWxzID0ge307XG5cdGxldCBmaW5kQ2lyY3VsYXJEZXBlbmRlbmNpZXMgPSAoa2V5LCBwYXRoID0gW10sIGFsbG93Q2lyY3VsYXIgPSBmYWxzZSkgPT4ge1xuXHRcdGlmIChwcm9jZXNzZWRPdXRwdXRzLmluY2x1ZGVzKGtleSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llc1trZXldO1xuXHRcdGlmICghZGVwcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtrZXl9JyBub3QgZGVmaW5lZCBpbiBlcXVhdGlvbnMgc2V0YCk7XG5cdFx0fVxuXG5cdFx0YWxsb3dDaXJjdWxhciA9IGFsbG93Q2lyY3VsYXIgfHwgaGFzSW5pdGlhbHNba2V5XTtcblxuXHRcdGlmIChwYXRoLmluY2x1ZGVzKGtleSkpIHtcblx0XHRcdGlmKGFsbG93Q2lyY3VsYXIpIHtcblx0XHRcdFx0cGF0aC5maWx0ZXIoKHBhdGhLZXkpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gaGFzSW5pdGlhbHNbcGF0aEtleV07XG5cdFx0XHRcdH0pLmZvckVhY2goKHBhdGhLZXkpID0+IHtcblx0XHRcdFx0XHRjaXJjdWxhckluaXRpYWxzW3BhdGhLZXldID0gdHJ1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGxldCBwYXRoU3RyaW5nID0gcGF0aC5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5O1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgJyR7a2V5fScgaGFzIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSAnJHtwYXRoU3RyaW5nfSdgKTtcblx0XHR9XG5cblx0XHRwYXRoLnB1c2goa2V5KTtcblx0XHRkZXBzLmZvckVhY2goKGRlcCkgPT4ge1xuXHRcdFx0aWYgKGRlcGVuZGVuY2llc1tkZXBdID09IG51bGwpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtrZXl9JyBoYXMgYSBtaXNzaW5nIGRlcGVuZGVuY3kgJyR7ZGVwfSdgKTtcblx0XHRcdH1cblx0XHRcdGZpbmRDaXJjdWxhckRlcGVuZGVuY2llcyhkZXAsIHBhdGguc2xpY2UoKSwgYWxsb3dDaXJjdWxhcik7XG5cdFx0fSk7XG5cblx0XHRwcm9jZXNzZWRPdXRwdXRzLnB1c2goa2V5KTtcblx0fTtcblxuXHQvLyBJdGVyYXRlIHRocm91Z2ggYWxsIGRlcGVuZGVuY2llcywgZmluZCB0aGUgZXZhbHVhdGlvbiBvcmRlclxuXHRsZXQgb3JkZXIgPSBbXSxcblx0XHRwcm9taXNlcyA9IFtdO1xuXHRPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdGZpbmRDaXJjdWxhckRlcGVuZGVuY2llcyhrZXkpO1xuXG5cdFx0bGV0IGRlcHMgPSBkZXBlbmRlbmNpZXNba2V5XS5tYXAoKGRlcCkgPT4ge1xuXHRcdFx0cmV0dXJuIGRlZmVycmFsc1tkZXBdLnByb21pc2U7XG5cdFx0fSk7XG5cblx0XHRQcm9taXNlLmFsbChkZXBzKS50aGVuKCgpID0+IHtcblx0XHRcdGRlZmVycmFsc1trZXldLnJlc29sdmUoKTtcblx0XHR9KTtcblx0XHRkZWZlcnJhbHNba2V5XS5wcm9taXNlLnRoZW4oKCkgPT4ge1xuXHRcdFx0b3JkZXIucHVzaChrZXkpO1xuXHRcdH0pO1xuXHRcdHByb21pc2VzLnB1c2goZGVmZXJyYWxzW2tleV0ucHJvbWlzZSk7XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9yZGVyLFxuXHRcdFx0Y2lyY3VsYXJJbml0aWFsc1xuXHRcdH07XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVJbnRlcm5hbHMob3JkZXIsIGNpcmN1bGFySW5pdGlhbHMsIGlucHV0cywgb3B0aW9uT3ZlcnJpZGVzID0ge30sIG5vbmJsb2NraW5nID0gZmFsc2UpIHtcblx0Ly8gR2V0IGxvY2Fsc1xuXHRsZXQgc2V0cyA9IHRoaXMuc2V0cztcblxuXHQvLyBEZXN0cnVjdHVyZSBvcHRpb25zXG5cdGxldCB7XG5cdFx0aXRlcmF0aXZlOiB7bWF4U3RlcHMsIGRlbHRhfSxcblx0XHRhbGxvd05hTlxuXHR9ID0gcGFyc2VPcHRpb25zKE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucywgb3B0aW9uT3ZlcnJpZGVzKSk7XG5cblx0Ly8gR2V0IGFsbCBlcXVhdGlvbnNcblx0bGV0IGVxdWF0aW9ucyA9IE9iamVjdC5rZXlzKHNldHMpLnJlZHVjZSgobWVtbywgc2V0S2V5KSA9PiB7XG5cdFx0bGV0IHNldCA9IHNldHNbc2V0S2V5XTtcblxuXHRcdE9iamVjdC5rZXlzKHNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRtZW1vW2tleV0gPSBzZXRba2V5XTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xuXG5cdC8vIEdldCBzdGFydGluZyBzdG9yZVxuXHRsZXQgc3RvcmUsIHN0b3JlUHJvbWlzZXM7XG5cdGxldCBpbnB1dEtleXMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHNldHMuaW5wdXRzKSk7XG5cblx0Ly8gRmlyc3Qgc3RlcFxuXHRzdG9yZVByb21pc2VzID0gb3JkZXIucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRsZXQgZXF1YXRpb24gPSBlcXVhdGlvbnNba2V5XTtcblxuXHRcdC8vIElmIGlucHV0IGlzIGRlZmluZWQsIHVzZSB0aGUgaW5wdXQgdmFsdWUuIE90aGVyd2lzZSwgdXNlIHRoZSBlcXVhdGlvbiBpbml0aWFsIHZhbHVlXG5cdFx0aWYoaW5wdXRLZXlzLmhhcyhrZXkpKSB7XG5cdFx0XHRtZW1vW2tleV0gPSBpbnB1dHNba2V5XSAhPT0gdW5kZWZpbmVkID8gaW5wdXRzW2tleV0gOiBlcXVhdGlvbnNba2V5XS5pbml0aWFsO1xuXHRcdFx0aWYobWVtb1trZXldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoY2lyY3VsYXJJbml0aWFsc1trZXldKSB7XG5cdFx0XHRtZW1vW2tleV0gPSBlcXVhdGlvbi5pbml0aWFsO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fVxuXG5cdFx0bWVtb1trZXldID0gZXF1YXRpb24uZXZhbHVhdGUobWVtbyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcblxuXHRyZXR1cm4gYXN5bmMucHJvcHMoc3RvcmVQcm9taXNlcykudGhlbigocmVzdWx0KSA9PiB7XG5cdFx0c3RvcmUgPSByZXN1bHQ7XG5cdFx0cmV0dXJuIHN0ZXAuYmluZCh0aGlzKSgwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc3RlcChuKSB7XG5cdFx0aWYgKCsrbiA+IG1heFN0ZXBzKSB7XG5cdFx0XHRyZXR1cm4gZm9ybWF0UmVzdWx0KHN0b3JlKTtcblx0XHR9XG5cblx0XHRzdG9yZVByb21pc2VzID0gb3JkZXIucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdGxldCBlcXVhdGlvbiA9IGVxdWF0aW9uc1trZXldO1xuXHRcdFx0aWYgKGVxdWF0aW9uLmVxdWF0aW9uKSB7XG5cdFx0XHRcdC8vIFVzZSBsYXN0IGl0ZXJhdGlvbiBpZiB2YWx1ZSBpcyBub3QgdW5kZWZpbmVkLCBvdGhlcndpc2UsIHVzZSBjdXJyZW50IHN0b3JlXG5cdFx0XHRcdG1lbW9ba2V5XSA9IGVxdWF0aW9uLmV2YWx1YXRlKGNpcmN1bGFySW5pdGlhbHNba2V5XSA/IHN0b3JlIDogbWVtbyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZW1vW2tleV0gPSBzdG9yZVtrZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKHN0b3JlUHJvbWlzZXMpLnRoZW4oKG5leHRTdG9yZSkgPT4ge1xuXHRcdFx0Ly8gQ2hlY2sgZGVsdGFcblx0XHRcdGxldCBkaXJ0eSA9IE9iamVjdC5rZXlzKG5leHRTdG9yZSkuc29tZSgoa2V5KSA9PiB7XG5cdFx0XHRcdGxldCBwcmV2ID0gc3RvcmVba2V5XSxcblx0XHRcdFx0XHRjdXJyID0gbmV4dFN0b3JlW2tleV07XG5cblx0XHRcdFx0aWYgKCFhbGxvd05hTiAmJiBOdW1iZXIuaXNOYU4oY3VycikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7a2V5fSBpcyBOYU4gb24gc3RlcCAke259YCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYXRjaGVzXG5cdFx0XHRcdGlmIChwcmV2ID09PSBjdXJyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQm90aCBhcmUgbnVsbCBvciB1bmRlZmluZWRcblx0XHRcdFx0aWYgKHByZXYgPT0gbnVsbCAmJiBjdXJyID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBPbmUgaXMgbnVsbCBvciB1bmRlZmluZWRcblx0XHRcdFx0aWYgKHByZXYgPT0gbnVsbCB8fCBjdXJyID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGJvdGggTmFOXG5cdFx0XHRcdGlmIChOdW1iZXIuaXNOYU4ocHJldikgJiYgTnVtYmVyLmlzTmFOKGN1cnIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25lIGlzIDAsIGNoZWNrIHZlcnN1cyBkZWx0YVxuXHRcdFx0XHRpZiAocHJldiA9PT0gMCB8fCBjdXJyID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKChwcmV2IC0gY3VycikgLyBNYXRoLm1heChNYXRoLmFicyhwcmV2KSwgTWF0aC5hYnMoY3VycikpKSA+PSBkZWx0YTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHZlcnN1cyBkZWx0YVxuXHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMoKHByZXYgLSBjdXJyKSAvIGN1cnIpID49IGRlbHRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdHN0b3JlID0gbmV4dFN0b3JlO1xuXG5cdFx0XHRsZXQgbmV4dCA9ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuICFkaXJ0eSA/IGZvcm1hdFJlc3VsdChzdG9yZSkgOiBzdGVwLmJpbmQodGhpcykobik7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5vbmJsb2NraW5nID8gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZShuZXh0LmJpbmQodGhpcykoKSkpKSA6IG5leHQoKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFJlc3VsdChyZXN1bHQpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMoc2V0cykucmVkdWNlKChzZXRNZW1vLCBzZXRLZXkpID0+IHtcblx0XHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRcdHNldE1lbW9bc2V0S2V5XSA9IE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdFx0bWVtb1trZXldID0gcmVzdWx0W2tleV07XG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0cmV0dXJuIHNldE1lbW87XG5cdFx0fSwge30pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvcHRpb25zKSB7XG5cdGxldCBvdXQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcblxuXHQvLyBDaGVjayBpdGVyYXRpdmVcblx0aWYgKG91dC5pdGVyYXRpdmUgPT0gbnVsbCB8fCAhKHR5cGVvZiBvdXQuaXRlcmF0aXZlID09IFwib2JqZWN0XCIpKSB7XG5cdFx0aWYgKG91dC5pdGVyYXRpdmUgPT09IHRydWUpIHtcblx0XHRcdG91dC5pdGVyYXRpdmUgPSB7XG5cdFx0XHRcdG1heFN0ZXBzOiAxMDAsXG5cdFx0XHRcdGRlbHRhOiAxZS02XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXQuaXRlcmF0aXZlID0ge1xuXHRcdFx0XHRtYXhTdGVwczogMCxcblx0XHRcdFx0ZGVsdGE6IDBcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgYWxsb3dOYU5cblx0b3V0LmFsbG93TmFOID0gISFvdXQuYWxsb3dOYU47XG5cblx0cmV0dXJuIG91dDtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkZWZlcigpIHtcblx0bGV0IGRlZmVycmVkID0ge307XG5cdGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0ZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0ZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuXHR9KTtcblx0cmV0dXJuIGRlZmVycmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMob2JqKSB7XG5cdGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblx0bGV0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4ge1xuXHRcdHJldHVybiBvYmpba2V5XTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCh2YWx1ZXMpID0+IHtcblx0XHRyZXR1cm4ga2V5cy5yZWR1Y2UoKG1lbW8sIGtleSwgaSkgPT4ge1xuXHRcdFx0bWVtb1trZXldID0gdmFsdWVzW2ldO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUocCkge1xuXHRyZXR1cm4gISFwLnRoZW47XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGxldCBtYXRjaGVzID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uKD86IC4qP3wgPylcXCgoLio/KVxcKVxccz9cXHsvKTtcblx0aWYoIW1hdGNoZXMubGVuZ3RoKSB7XG5cdFx0bWF0Y2hlcyA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15cXCgoLio/KVxcKVxccz89Plxccz9cXHsvKTtcblx0fVxuXHRmblskaW5qZWN0XSA9IG1hdGNoZXNbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcigoYSkgPT4gYSk7XG5cdHJldHVybiBmbjtcbn1cblxuZnVuY3Rpb24gaW5qZWN0SW50ZXJuYWxzKHN5bmMsIGZuLCAuLi5zdG9yZXMpIHtcblx0aWYoIWZuWyRpbmplY3RdKSB7XG5cdFx0YW5ub3RhdGUoZm4pO1xuXHR9XG5cblx0aWYoc3RvcmVzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRzdG9yZXMgPSBzdG9yZXNbMF07XG5cdH1cblxuXHRsZXQgaXRlbXMgPSBmblskaW5qZWN0XS5tYXAoKG5hbWUpID0+IHtcblx0XHRsZXQgZm91bmRTdG9yZSA9IHN0b3Jlcy5maW5kKChzdG9yZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHN0b3JlW25hbWVdICE9PSB1bmRlZmluZWQ7XG5cdFx0fSk7XG5cdFx0aWYgKGZvdW5kU3RvcmUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBkZXBlbmRlbmN5OiAke25hbWV9YCwgZm4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZm91bmRTdG9yZVtuYW1lXTtcblx0fSk7XG5cblx0aWYoc3luYykge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBpdGVtcyk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UuYWxsKGl0ZW1zKS50aGVuKChhcmdzKSA9PiB7XG5cdFx0cmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdChmbiwgLi4uc3RvcmVzKSB7XG5cdHJldHVybiBpbmplY3RJbnRlcm5hbHMoZmFsc2UsIGZuLCAuLi5zdG9yZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U3luYyhmbiwgLi4uc3RvcmVzKSB7XG5cdHJldHVybiBpbmplY3RJbnRlcm5hbHModHJ1ZSwgZm4sIC4uLnN0b3Jlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fubm90YXRhYmxlKGZuKSB7XG5cdHJldHVybiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIikgfHwgKEFycmF5LmlzQXJyYXkoZm4pICYmIHR5cGVvZiBmbltmbi5sZW5ndGggLSAxXSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuIiwiZXhwb3J0IGNvbnN0ICRpbmplY3QgPSBTeW1ib2woKTtcbiJdfQ==
