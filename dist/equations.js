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

		this.evaluationData = processSets(this.sets);
	}

	_createClass(EquationSet, [{
		key: "calculate",
		value: function calculate(inputs) {
			var options = arguments[1] === undefined ? {} : arguments[1];
			var nonblocking = arguments[2] === undefined ? false : arguments[2];

			return calculateInternals.bind(this)(inputs, options, nonblocking);
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

function processSets(sets) {
	var _Object$keys$reduce = Object.keys(sets).reduce(function (memo, setKey) {
		var set = sets[setKey];

		Object.keys(set).forEach(function (key) {
			var equation = set[key];
			memo.dependencies[key] = equation.equation ? equation.equation[_$inject.$inject] : [];
			memo.hasInitials[key] = equation.hasInitial;
			return memo;
		});

		return memo;
	}, {
		dependencies: {},
		hasInitials: {}
	});

	var dependencies = _Object$keys$reduce.dependencies;
	var hasInitials = _Object$keys$reduce.hasInitials;

	var order = [],
	    circularInitials = {};

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
		var allowCircular = arguments[2] === undefined ? false : arguments[2];

		if (order.includes(key)) {
			return;
		}

		var deps = dependencies[key];
		if (!deps) {
			throw new Error("'" + key + "' not defined in equations set");
		}

		allowCircular = allowCircular || hasInitials[key];

		if (path.includes(key)) {
			if (!allowCircular) {
				var pathString = path.join(" -> ") + " -> " + key;
				throw new Error("Output '" + key + "' has a circular dependency '" + pathString + "'");
			}
			path.forEach(function (pathKey) {
				if (hasInitials[pathKey]) {
					circularInitials[pathKey] = true;
				}
			});
			return;
		}

		path.push(key);
		deps.forEach(function (dep) {
			if (dependencies[dep] == null) {
				throw new Error("'" + key + "' has a missing dependency '" + dep + "'");
			}
			processOutput(dep, path.slice(), allowCircular);
		});

		if (!order.includes(key)) {
			order.push(key);
		}
	});

	// Iterate through all dependencies
	Object.keys(dependencies).forEach(function (key) {
		return processOutput(key);
	});

	// Move circular initials to the front of order
	order = order.filter(function (key) {
		return !circularInitials[key];
	});
	order = Object.keys(circularInitials).concat(order);

	return {
		order: order,
		circularInitials: circularInitials
	};
}

function calculateInternals(inputs) {
	var _this = this;

	var optionOverrides = arguments[1] === undefined ? {} : arguments[1];
	var nonblocking = arguments[2] === undefined ? false : arguments[2];

	// Get locals
	var sets = this.sets;
	var _evaluationData = this.evaluationData;
	var order = _evaluationData.order;
	var circularInitials = _evaluationData.circularInitials;

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
		return step.bind(_this)(0);
	});

	function step(n) {
		var _this2 = this;

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
				return !dirty ? formatResult(store) : step.bind(_this2)(n);
			};
			return nonblocking ? new Promise(function (resolve) {
				return setTimeout(function () {
					return resolve(next.bind(_this2)());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2FzeW5jLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2RpLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL3N5bWJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7cUJDR3dCLElBQUk7O3NCQUhSLFdBQVc7O0lBQW5CLEVBQUU7OzJCQUNVLG9CQUFvQjs7OztBQUU3QixTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDaEMsS0FBSSxJQUFJLFlBQUEsQ0FBQztBQUNULEtBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixNQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUMvQyxNQUFNO0FBQ04sTUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNWO0FBQ0QsUUFBTyw2QkFBZ0IsSUFBSSxDQUFDLENBQUM7Q0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ1htQixZQUFZOztJQUFwQixFQUFFOztJQUVPLFFBQVE7QUFDakIsVUFEUyxRQUFRLENBQ2hCLE1BQU0sRUFBRSxVQUFVLEVBQUU7d0JBRFosUUFBUTs7QUFFM0IsTUFBSSxFQUFFLENBQUMsYUFBYSxD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ImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi91dGlsL2RpXCI7XG5pbXBvcnQgRXF1YXRpb25TZXQgZnJvbSBcIi4vY29yZS9FcXVhdGlvblNldFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlcW5zKGZuKSB7XG5cdGxldCBkYXRhO1xuXHRpZihkaS5pc0Fubm90YXRhYmxlKGZuKSkge1xuXHRcdGRhdGEgPSBkaS5pbmplY3RTeW5jKGZuLCBlcW5zLmxpYnJhcmllcyB8fCB7fSk7XG5cdH0gZWxzZSB7XG5cdFx0ZGF0YSA9IGZuO1xuXHR9XG5cdHJldHVybiBuZXcgRXF1YXRpb25TZXQoZGF0YSk7XG59XG4iLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHN5bWJvbCwgZGVmaW5pdGlvbikge1xuXHRcdGlmIChkaS5pc0Fubm90YXRhYmxlKGRlZmluaXRpb24pKSB7XG5cdFx0XHQvLyBQcm92aWRlZCBkZWZpbml0aW9uIGlzIGFubm90YXRhYmxlID0+IGl0J3MgYW4gZXF1YXRpb25cblx0XHRcdHRoaXMuZXF1YXRpb24gPSBkaS5hbm5vdGF0ZShkZWZpbml0aW9uKTtcblx0XHR9IGVsc2UgaWYodHlwZW9mIGRlZmluaXRpb24gPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuXHRcdFx0Ly8gUHJvdmlkZWQgZGVmaW5pdGlvbiBpcyBhbiBvYmplY3QgPT4gY2FuIGNvbnRhaW4gaW5pdGlhbCBhbmQgZXF1YXRpb25cblx0XHRcdHRoaXMuaW5pdGlhbCA9IChkZWZpbml0aW9uLmluaXRpYWwgIT09IHVuZGVmaW5lZCA/IGRlZmluaXRpb24uaW5pdGlhbCA6IGRlZmluaXRpb24udmFsdWUpO1xuXG5cdFx0XHRpZiAoZGkuaXNBbm5vdGF0YWJsZShkZWZpbml0aW9uLmVxdWF0aW9uKSkge1xuXHRcdFx0XHR0aGlzLmVxdWF0aW9uID0gZGkuYW5ub3RhdGUoZGVmaW5pdGlvbi5lcXVhdGlvbik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFByb3ZpZGVkIGRlZmluaXRpb24gaXMgYSB2YWx1ZVxuXHRcdFx0dGhpcy5pbml0aWFsID0gZGVmaW5pdGlvbjtcblx0XHR9XG5cblx0XHR0aGlzLmhhc0luaXRpYWwgPSAodGhpcy5pbml0aWFsICE9PSB1bmRlZmluZWQpO1xuXHR9XG5cblx0ZXZhbHVhdGUoLi4uc3RvcmVzKSB7XG5cdFx0cmV0dXJuIGRpLmluamVjdCh0aGlzLmVxdWF0aW9uLCBzdG9yZXMpO1xuXHR9XG59XG4iLCIvLyBpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5pbXBvcnQgKiBhcyBhc3luYyBmcm9tIFwiLi4vdXRpbC9hc3luY1wiO1xuaW1wb3J0IEVxdWF0aW9uIGZyb20gXCIuL0VxdWF0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWF0aW9uU2V0IHtcblx0Y29uc3RydWN0b3IoeyBvcHRpb25zID0ge30sIGlucHV0cyA9IHt9LCBjYWxjdWxhdGlvbnMgPSB7fSwgb3V0cHV0cyA9IHt9IH0pIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBwYXJzZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHQvLyBJbml0aWFsaXplIHNldHNcblx0XHR0aGlzLnNldHMgPSBwYXJzZVNldHMoaW5wdXRzLCBjYWxjdWxhdGlvbnMsIG91dHB1dHMpO1xuXG5cdFx0dGhpcy5ldmFsdWF0aW9uRGF0YSA9IHByb2Nlc3NTZXRzKHRoaXMuc2V0cyk7XG5cdH1cblxuXHRjYWxjdWxhdGUoaW5wdXRzLCBvcHRpb25zID0ge30sIG5vbmJsb2NraW5nID0gZmFsc2UpIHtcblx0XHRyZXR1cm4gY2FsY3VsYXRlSW50ZXJuYWxzLmJpbmQodGhpcykoaW5wdXRzLCBvcHRpb25zLCBub25ibG9ja2luZyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VTZXRzKGlucHV0cywgY2FsY3VsYXRpb25zLCBvdXRwdXRzKSB7XG5cdHJldHVybiB7XG5cdFx0aW5wdXRzOiBwYXJzZVNldChpbnB1dHMpLFxuXHRcdGNhbGN1bGF0aW9uczogcGFyc2VTZXQoY2FsY3VsYXRpb25zKSxcblx0XHRvdXRwdXRzOiBwYXJzZVNldChvdXRwdXRzKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVNldChzZXQpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRtZW1vW2tleV0gPSBuZXcgRXF1YXRpb24oa2V5LCBzZXRba2V5XSk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1NldHMoc2V0cykge1xuXHRsZXQge2RlcGVuZGVuY2llcywgaGFzSW5pdGlhbHN9ID0gT2JqZWN0LmtleXMoc2V0cykucmVkdWNlKChtZW1vLCBzZXRLZXkpID0+IHtcblx0XHRsZXQgc2V0ID0gc2V0c1tzZXRLZXldO1xuXG5cdFx0T2JqZWN0LmtleXMoc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdGxldCBlcXVhdGlvbiA9IHNldFtrZXldO1xuXHRcdFx0bWVtby5kZXBlbmRlbmNpZXNba2V5XSA9IGVxdWF0aW9uLmVxdWF0aW9uID8gZXF1YXRpb24uZXF1YXRpb25bJGluamVjdF0gOiBbXTtcblx0XHRcdG1lbW8uaGFzSW5pdGlhbHNba2V5XSA9IGVxdWF0aW9uLmhhc0luaXRpYWw7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9KTtcblxuXHRcdHJldHVybiBtZW1vO1xuXHR9LCB7XG5cdFx0ZGVwZW5kZW5jaWVzOiB7fSxcblx0XHRoYXNJbml0aWFsczoge31cblx0fSk7XG5cblx0bGV0IG9yZGVyID0gW10sXG5cdFx0Y2lyY3VsYXJJbml0aWFscyA9IHt9O1xuXG5cdGxldCBwcm9jZXNzT3V0cHV0ID0gKGtleSwgcGF0aCA9IFtdLCBhbGxvd0NpcmN1bGFyID0gZmFsc2UpID0+IHtcblx0XHRpZiAob3JkZXIuaW5jbHVkZXMoa2V5KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBkZXBzID0gZGVwZW5kZW5jaWVzW2tleV07XG5cdFx0aWYgKCFkZXBzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2tleX0nIG5vdCBkZWZpbmVkIGluIGVxdWF0aW9ucyBzZXRgKTtcblx0XHR9XG5cblx0XHRhbGxvd0NpcmN1bGFyID0gYWxsb3dDaXJjdWxhciB8fCBoYXNJbml0aWFsc1trZXldO1xuXG5cdFx0aWYgKHBhdGguaW5jbHVkZXMoa2V5KSkge1xuXHRcdFx0aWYgKCFhbGxvd0NpcmN1bGFyKSB7XG5cdFx0XHRcdGxldCBwYXRoU3RyaW5nID0gcGF0aC5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5O1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE91dHB1dCAnJHtrZXl9JyBoYXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5ICcke3BhdGhTdHJpbmd9J2ApO1xuXHRcdFx0fVxuXHRcdFx0cGF0aC5mb3JFYWNoKChwYXRoS2V5KSA9PiB7XG5cdFx0XHRcdGlmKGhhc0luaXRpYWxzW3BhdGhLZXldKSB7XG5cdFx0XHRcdFx0Y2lyY3VsYXJJbml0aWFsc1twYXRoS2V5XSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHBhdGgucHVzaChrZXkpO1xuXHRcdGRlcHMuZm9yRWFjaCgoZGVwKSA9PiB7XG5cdFx0XHRpZiAoZGVwZW5kZW5jaWVzW2RlcF0gPT0gbnVsbCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2tleX0nIGhhcyBhIG1pc3NpbmcgZGVwZW5kZW5jeSAnJHtkZXB9J2ApO1xuXHRcdFx0fVxuXHRcdFx0cHJvY2Vzc091dHB1dChkZXAsIHBhdGguc2xpY2UoKSwgYWxsb3dDaXJjdWxhcik7XG5cdFx0fSk7XG5cblx0XHRpZiAoIW9yZGVyLmluY2x1ZGVzKGtleSkpIHtcblx0XHRcdG9yZGVyLnB1c2goa2V5KTtcblx0XHR9XG5cdH07XG5cblxuXHQvLyBJdGVyYXRlIHRocm91Z2ggYWxsIGRlcGVuZGVuY2llc1xuXHRPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXHQvLyBNb3ZlIGNpcmN1bGFyIGluaXRpYWxzIHRvIHRoZSBmcm9udCBvZiBvcmRlclxuXHRvcmRlciA9IG9yZGVyLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG5cdFx0cmV0dXJuICFjaXJjdWxhckluaXRpYWxzW2tleV07XG5cdH0pO1xuXHRvcmRlciA9IE9iamVjdC5rZXlzKGNpcmN1bGFySW5pdGlhbHMpLmNvbmNhdChvcmRlcik7XG5cblx0cmV0dXJuIHtcblx0XHRvcmRlcixcblx0XHRjaXJjdWxhckluaXRpYWxzXG5cdH07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUludGVybmFscyhpbnB1dHMsIG9wdGlvbk92ZXJyaWRlcyA9IHt9LCBub25ibG9ja2luZyA9IGZhbHNlKSB7XG5cdC8vIEdldCBsb2NhbHNcblx0bGV0IHtcblx0XHRcdHNldHMsXG5cdFx0XHRldmFsdWF0aW9uRGF0YToge1xuXHRcdFx0XHRvcmRlcixcblx0XHRcdFx0Y2lyY3VsYXJJbml0aWFsc1xuXHRcdFx0fVxuXHRcdH0gPSB0aGlzO1xuXG5cdC8vIERlc3RydWN0dXJlIG9wdGlvbnNcblx0bGV0IHtcblx0XHRpdGVyYXRpdmU6IHttYXhTdGVwcywgZGVsdGF9LFxuXHRcdGFsbG93TmFOXG5cdH0gPSBwYXJzZU9wdGlvbnMoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25PdmVycmlkZXMpKTtcblxuXHQvLyBHZXQgYWxsIGVxdWF0aW9uc1xuXHRsZXQgZXF1YXRpb25zID0gT2JqZWN0LmtleXMoc2V0cykucmVkdWNlKChtZW1vLCBzZXRLZXkpID0+IHtcblx0XHRsZXQgc2V0ID0gc2V0c1tzZXRLZXldO1xuXG5cdFx0T2JqZWN0LmtleXMoc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdG1lbW9ba2V5XSA9IHNldFtrZXldO1xuXHRcdH0pO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9LCB7fSk7XG5cblx0Ly8gR2V0IHN0YXJ0aW5nIHN0b3JlXG5cdGxldCBzdG9yZSwgc3RvcmVQcm9taXNlcztcblx0bGV0IGlucHV0S2V5cyA9IG5ldyBTZXQoT2JqZWN0LmtleXMoc2V0cy5pbnB1dHMpKTtcblxuXHQvLyBGaXJzdCBzdGVwXG5cdHN0b3JlUHJvbWlzZXMgPSBvcmRlci5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdC8vIElmIGlucHV0IGlzIGRlZmluZWQsIHVzZSB0aGUgaW5wdXQgdmFsdWUuIE90aGVyd2lzZSwgdXNlIHRoZSBlcXVhdGlvbiBpbml0aWFsIHZhbHVlXG5cdFx0aWYoaW5wdXRzW2tleV0gIT09IHVuZGVmaW5lZCAmJiBpbnB1dEtleXMuaGFzKGtleSkpIHtcblx0XHRcdG1lbW9ba2V5XSA9IGlucHV0c1trZXldO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fVxuXG5cdFx0bGV0IGVxdWF0aW9uID0gZXF1YXRpb25zW2tleV07XG5cdFx0aWYoZXF1YXRpb24uaGFzSW5pdGlhbCkge1xuXHRcdFx0bWVtb1trZXldID0gZXF1YXRpb24uaW5pdGlhbDtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH1cblxuXHRcdG1lbW9ba2V5XSA9IGVxdWF0aW9uLmV2YWx1YXRlKG1lbW8pO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9LCB7fSk7XG5cblx0cmV0dXJuIGFzeW5jLnByb3BzKHN0b3JlUHJvbWlzZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuXHRcdHN0b3JlID0gcmVzdWx0O1xuXHRcdHJldHVybiBzdGVwLmJpbmQodGhpcykoMCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHN0ZXAobikge1xuXHRcdGlmICgrK24gPiBtYXhTdGVwcykge1xuXHRcdFx0cmV0dXJuIGZvcm1hdFJlc3VsdChzdG9yZSk7XG5cdFx0fVxuXG5cdFx0c3RvcmVQcm9taXNlcyA9IG9yZGVyLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRsZXQgZXF1YXRpb24gPSBlcXVhdGlvbnNba2V5XTtcblx0XHRcdGlmIChlcXVhdGlvbi5lcXVhdGlvbikge1xuXHRcdFx0XHQvLyBVc2UgbGFzdCBpdGVyYXRpb24gaWYgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCwgb3RoZXJ3aXNlLCB1c2UgY3VycmVudCBzdG9yZVxuXHRcdFx0XHRtZW1vW2tleV0gPSBlcXVhdGlvbi5ldmFsdWF0ZShjaXJjdWxhckluaXRpYWxzW2tleV0gPyBzdG9yZSA6IG1lbW8pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVtb1trZXldID0gc3RvcmVba2V5XTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblxuXHRcdHJldHVybiBhc3luYy5wcm9wcyhzdG9yZVByb21pc2VzKS50aGVuKChuZXh0U3RvcmUpID0+IHtcblx0XHRcdC8vIENoZWNrIGRlbHRhXG5cdFx0XHRsZXQgZGlydHkgPSBPYmplY3Qua2V5cyhuZXh0U3RvcmUpLnNvbWUoKGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgcHJldiA9IHN0b3JlW2tleV0sXG5cdFx0XHRcdFx0Y3VyciA9IG5leHRTdG9yZVtrZXldO1xuXG5cdFx0XHRcdGlmICghYWxsb3dOYU4gJiYgTnVtYmVyLmlzTmFOKGN1cnIpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAke2tleX0gaXMgTmFOIG9uIHN0ZXAgJHtufWApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTWF0Y2hlc1xuXHRcdFx0XHRpZiAocHJldiA9PT0gY3Vycikge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEJvdGggYXJlIG51bGwgb3IgdW5kZWZpbmVkXG5cdFx0XHRcdGlmIChwcmV2ID09IG51bGwgJiYgY3VyciA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25lIGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdFx0XHRcdGlmIChwcmV2ID09IG51bGwgfHwgY3VyciA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBib3RoIE5hTlxuXHRcdFx0XHRpZiAoTnVtYmVyLmlzTmFOKHByZXYpICYmIE51bWJlci5pc05hTihjdXJyKSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE9uZSBpcyAwLCBjaGVjayB2ZXJzdXMgZGVsdGFcblx0XHRcdFx0aWYgKHByZXYgPT09IDAgfHwgY3VyciA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiBNYXRoLmFicygocHJldiAtIGN1cnIpIC8gTWF0aC5tYXgoTWF0aC5hYnMocHJldiksIE1hdGguYWJzKGN1cnIpKSkgPj0gZGVsdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDaGVjayB2ZXJzdXMgZGVsdGFcblx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKChwcmV2IC0gY3VycikgLyBjdXJyKSA+PSBkZWx0YTtcblx0XHRcdH0pO1xuXG5cdFx0XHRzdG9yZSA9IG5leHRTdG9yZTtcblxuXHRcdFx0bGV0IG5leHQgPSAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiAhZGlydHkgPyBmb3JtYXRSZXN1bHQoc3RvcmUpIDogc3RlcC5iaW5kKHRoaXMpKG4pO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBub25ibG9ja2luZyA/IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUobmV4dC5iaW5kKHRoaXMpKCkpKSkgOiBuZXh0KCk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRSZXN1bHQocmVzdWx0KSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHNldHMpLnJlZHVjZSgoc2V0TWVtbywgc2V0S2V5KSA9PiB7XG5cdFx0XHRsZXQgc2V0ID0gc2V0c1tzZXRLZXldO1xuXG5cdFx0XHRzZXRNZW1vW3NldEtleV0gPSBPYmplY3Qua2V5cyhzZXQpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRcdG1lbW9ba2V5XSA9IHJlc3VsdFtrZXldO1xuXHRcdFx0XHRyZXR1cm4gbWVtbztcblx0XHRcdH0sIHt9KTtcblx0XHRcdHJldHVybiBzZXRNZW1vO1xuXHRcdH0sIHt9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZU9wdGlvbnMob3B0aW9ucykge1xuXHRsZXQgb3V0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG5cblx0Ly8gQ2hlY2sgaXRlcmF0aXZlXG5cdGlmIChvdXQuaXRlcmF0aXZlID09IG51bGwgfHwgISh0eXBlb2Ygb3V0Lml0ZXJhdGl2ZSA9PSBcIm9iamVjdFwiKSkge1xuXHRcdGlmIChvdXQuaXRlcmF0aXZlID09PSB0cnVlKSB7XG5cdFx0XHRvdXQuaXRlcmF0aXZlID0ge1xuXHRcdFx0XHRtYXhTdGVwczogMTAwLFxuXHRcdFx0XHRkZWx0YTogMWUtNlxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3V0Lml0ZXJhdGl2ZSA9IHtcblx0XHRcdFx0bWF4U3RlcHM6IDAsXG5cdFx0XHRcdGRlbHRhOiAwXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIGFsbG93TmFOXG5cdG91dC5hbGxvd05hTiA9ICEhb3V0LmFsbG93TmFOO1xuXG5cdHJldHVybiBvdXQ7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmZXIoKSB7XG5cdGxldCBkZWZlcnJlZCA9IHt9O1xuXHRkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcblx0fSk7XG5cdHJldHVybiBkZWZlcnJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKG9iaikge1xuXHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cdGxldCBwcm9taXNlcyA9IGtleXMubWFwKChrZXkpID0+IHtcblx0XHRyZXR1cm4gb2JqW2tleV07XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigodmFsdWVzKSA9PiB7XG5cdFx0cmV0dXJuIGtleXMucmVkdWNlKChtZW1vLCBrZXksIGkpID0+IHtcblx0XHRcdG1lbW9ba2V5XSA9IHZhbHVlc1tpXTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RoZW5hYmxlKHApIHtcblx0cmV0dXJuICEhcC50aGVuO1xufVxuIiwiaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi9zeW1ib2xzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0ZShmbikge1xuXHRpZiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIiAmJiBmblskaW5qZWN0XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0cmV0dXJuIGZuO1xuXHR9XG5cblx0aWYgKGZuIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRsZXQgZmllbGRzID0gZm47XG5cdFx0Zm4gPSBmbi5wb3AoKTtcblx0XHRmblskaW5qZWN0XSA9IGZpZWxkcztcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRsZXQgbWF0Y2hlcyA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvbig/OiAuKj98ID8pXFwoKC4qPylcXClcXHM/XFx7Lyk7XG5cdGlmKCFtYXRjaGVzLmxlbmd0aCkge1xuXHRcdG1hdGNoZXMgPSBmbi50b1N0cmluZygpLm1hdGNoKC9eXFwoKC4qPylcXClcXHM/PT5cXHM/XFx7Lyk7XG5cdH1cblx0Zm5bJGluamVjdF0gPSBtYXRjaGVzWzFdLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoKGEpID0+IGEpO1xuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGluamVjdEludGVybmFscyhzeW5jLCBmbiwgLi4uc3RvcmVzKSB7XG5cdGlmKCFmblskaW5qZWN0XSkge1xuXHRcdGFubm90YXRlKGZuKTtcblx0fVxuXG5cdGlmKHN0b3Jlc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0c3RvcmVzID0gc3RvcmVzWzBdO1xuXHR9XG5cblx0bGV0IGl0ZW1zID0gZm5bJGluamVjdF0ubWFwKChuYW1lKSA9PiB7XG5cdFx0bGV0IGZvdW5kU3RvcmUgPSBzdG9yZXMuZmluZCgoc3RvcmUpID0+IHtcblx0XHRcdHJldHVybiBzdG9yZVtuYW1lXSAhPT0gdW5kZWZpbmVkO1xuXHRcdH0pO1xuXHRcdGlmIChmb3VuZFN0b3JlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogJHtuYW1lfWAsIGZuKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZvdW5kU3RvcmVbbmFtZV07XG5cdH0pO1xuXG5cdGlmKHN5bmMpIHtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgaXRlbXMpO1xuXHR9XG5cdHJldHVybiBQcm9taXNlLmFsbChpdGVtcykudGhlbigoYXJncykgPT4ge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoZm4sIC4uLnN0b3Jlcykge1xuXHRyZXR1cm4gaW5qZWN0SW50ZXJuYWxzKGZhbHNlLCBmbiwgLi4uc3RvcmVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFN5bmMoZm4sIC4uLnN0b3Jlcykge1xuXHRyZXR1cm4gaW5qZWN0SW50ZXJuYWxzKHRydWUsIGZuLCAuLi5zdG9yZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbm5vdGF0YWJsZShmbikge1xuXHRyZXR1cm4gKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIpIHx8IChBcnJheS5pc0FycmF5KGZuKSAmJiB0eXBlb2YgZm5bZm4ubGVuZ3RoIC0gMV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cbiIsImV4cG9ydCBjb25zdCAkaW5qZWN0ID0gU3ltYm9sKCk7XG4iXX0=
