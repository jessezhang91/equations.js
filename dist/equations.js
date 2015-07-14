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
	function Equation(symbol, equation) {
		_classCallCheck(this, Equation);

		if (di.isAnnotatable(equation)) {
			this.equation = di.annotate(equation);
		} else if (typeof equation == "object") {
			this.value = equation.initial !== undefined ? equation.initial : equation.value;

			if (di.isAnnotatable(equation.equation)) {
				this.equation = di.annotate(equation.equation);
			}
		} else {
			this.value = equation;
		}
	}

	_createClass(Equation, [{
		key: "evalulate",
		value: function evalulate() {
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

var _import2 = require("../util/di");

var di = _interopRequireWildcard(_import2);

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

		this.options = options;

		// Initialize options
		if (typeof this.options.iterative == "object" || this.options.iterative === true) {
			var iterative = this.options.iterative = this.options.iterative === true ? {} : this.options.iterative;
			iterative.maxSteps = iterative.maxSteps == null || Number.isNaN(iterative.maxSteps) ? 0.000001 : Number(iterative.maxSteps);
			iterative.delta = iterative.delta == null || Number.isNaN(iterative.delta) ? 0.000001 : Number(iterative.delta);
		} else {
			this.options.iterative = undefined;
		}

		// Initialize sets
		this.sets = {
			inputs: parseSet(inputs),
			calculations: parseSet(calculations),
			outputs: parseSet(outputs)
		};

		this.evaluationOrder = getEvaluationOrder(this.sets);
	}

	_createClass(EquationSet, [{
		key: "calculate",
		value: function calculate(inputs) {
			var nonblocking = arguments[1] === undefined ? false : arguments[1];

			return calculateInternals.bind(this)(inputs, nonblocking);
		}
	}]);

	return EquationSet;
})();

exports["default"] = EquationSet;

function parseSet(set) {
	return Object.keys(set).reduce(function (memo, key) {
		memo[key] = new _Equation2["default"](key, set[key]);
		return memo;
	}, {});
}

function getEvaluationOrder(sets) {
	var dependencies = Object.keys(sets).reduce(function (memo, setKey) {
		var set = sets[setKey];

		Object.keys(set).forEach(function (key) {
			var equation = set[key];
			memo[key] = equation.value === undefined ? equation.equation ? equation.equation[_$inject.$inject] : [] : [];
			return memo;
		});

		return memo;
	}, {});

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

		var deps = dependencies[key];
		if (!deps) {
			throw new Error("'" + key + "' not defined in equations set");
		}
		if (set.has(key)) {
			var path = Array.from(set.values()).join(" -> ") + " -> " + key;
			throw new Error("Output '" + key + "' has a circular dependency '" + path + "'");
		}
		set.add(key);

		deps.forEach(function (dep) {
			if (dependencies[dep] == null) {
				throw new Error("'" + key + "' has a missing dependency '" + dep + "'");
			}
			processOutput(dep, new Set(set));
		});
		processedOutputs.add(key);
		order.push(key);
	});
	Object.keys(dependencies).forEach(function (key) {
		return processOutput(key);
	});

	return order;
}

function calculateInternals(inputs, nonblocking) {
	var _this = this;

	var sets = this.sets,
	    evaluationOrder = this.evaluationOrder;

	var inputKeys = new Set(Object.keys(sets.inputs));
	var equations = Object.keys(sets).reduce(function (memo, setKey) {
		var set = sets[setKey];

		Object.keys(set).forEach(function (key) {
			memo[key] = set[key];
		});
		return memo;
	}, {});

	// Get options
	var maxSteps = 0,
	    delta = 0;
	if (this.options.iterative) {
		var iterative = this.options.iterative;
		maxSteps = iterative.maxSteps;
		delta = iterative.delta;
	}
	var allowNaN = !!this.options.allowNaN;

	// Get starting store
	var store = undefined,
	    storePromises = undefined;
	storePromises = evaluationOrder.reduce(function (memo, key) {
		memo[key] = inputs[key] !== undefined && inputKeys.has(key) ? inputs[key] : equations[key].value;
		return memo;
	}, {});

	return async.props(storePromises).then(function (result) {
		store = result;
		return step.bind(_this)(0);
	});

	function step(n) {
		var _this2 = this;

		storePromises = evaluationOrder.reduce(function (memo, key) {
			var equation = equations[key];
			if (equation.equation && (equation.value === undefined || n > 0)) {
				// Use last iteration if value is not undefined, otherwise, use current store
				memo[key] = di.inject(equation.equation, equation.value === undefined ? memo : store);
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
				return ++n > maxSteps || !dirty ? formatResult(store) : step.bind(_this2)(n);
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
module.exports = exports["default"];

},{"../util/async":4,"../util/di":5,"../util/symbols":6,"./Equation":2}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2FzeW5jLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL2RpLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy91dGlsL3N5bWJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7cUJDR3dCLElBQUk7O3NCQUhSLFdBQVc7O0lBQW5CLEVBQUU7OzJCQUNVLG9CQUFvQjs7OztBQUU3QixTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDaEMsS0FBSSxJQUFJLFlBQUEsQ0FBQztBQUNULEtBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixNQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUMvQyxNQUFNO0FBQ04sTUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNWO0FBQ0QsUUFBTyw2QkFBZ0IsSUFBSSxDQUFDLENBQUM7Q0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ1htQixZQUFZOztJQUFwQixFQUFFOztJQUVPLFFBQVE7QUFDakIsVUFEUyxRQUFRLENBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUU7d0JBRFYsUUFBUTs7QUFFM0IsTUFBSSxFQUFFLENBQUMsYUFBYSxD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QUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxBQUFDLENBQUM7Q0FDbEc7Ozs7Ozs7O0FDM0RNLElBQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQW5CLE9BQU8sR0FBUCxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIGRpIGZyb20gXCIuL3V0aWwvZGlcIjtcbmltcG9ydCBFcXVhdGlvblNldCBmcm9tIFwiLi9jb3JlL0VxdWF0aW9uU2V0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVxbnMoZm4pIHtcblx0bGV0IGRhdGE7XG5cdGlmKGRpLmlzQW5ub3RhdGFibGUoZm4pKSB7XG5cdFx0ZGF0YSA9IGRpLmluamVjdFN5bmMoZm4sIGVxbnMubGlicmFyaWVzIHx8IHt9KTtcblx0fSBlbHNlIHtcblx0XHRkYXRhID0gZm47XG5cdH1cblx0cmV0dXJuIG5ldyBFcXVhdGlvblNldChkYXRhKTtcbn1cbiIsImltcG9ydCAqIGFzIGRpIGZyb20gXCIuLi91dGlsL2RpXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWF0aW9uIHtcblx0Y29uc3RydWN0b3Ioc3ltYm9sLCBlcXVhdGlvbikge1xuXHRcdGlmIChkaS5pc0Fubm90YXRhYmxlKGVxdWF0aW9uKSkge1xuXHRcdFx0dGhpcy5lcXVhdGlvbiA9IGRpLmFubm90YXRlKGVxdWF0aW9uKTtcblx0XHR9IGVsc2UgaWYodHlwZW9mIGVxdWF0aW9uID09IFwib2JqZWN0XCIpIHtcblx0XHRcdHRoaXMudmFsdWUgPSAoZXF1YXRpb24uaW5pdGlhbCAhPT0gdW5kZWZpbmVkID8gZXF1YXRpb24uaW5pdGlhbCA6IGVxdWF0aW9uLnZhbHVlKTtcblxuXHRcdFx0aWYgKGRpLmlzQW5ub3RhdGFibGUoZXF1YXRpb24uZXF1YXRpb24pKSB7XG5cdFx0XHRcdHRoaXMuZXF1YXRpb24gPSBkaS5hbm5vdGF0ZShlcXVhdGlvbi5lcXVhdGlvbik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmFsdWUgPSBlcXVhdGlvbjtcblx0XHR9XG5cdH1cblxuXHRldmFsdWxhdGUoLi4uc3RvcmVzKSB7XG5cdFx0cmV0dXJuIGRpLmluamVjdCh0aGlzLmVxdWF0aW9uLCBzdG9yZXMpO1xuXHR9XG59XG4iLCIvLyBpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5pbXBvcnQgKiBhcyBhc3luYyBmcm9tIFwiLi4vdXRpbC9hc3luY1wiO1xuaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCBFcXVhdGlvbiBmcm9tIFwiLi9FcXVhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvblNldCB7XG5cdGNvbnN0cnVjdG9yKHsgb3B0aW9ucyA9IHt9LCBpbnB1dHMgPSB7fSwgY2FsY3VsYXRpb25zID0ge30sIG91dHB1dHMgPSB7fSB9KSB7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuXHRcdC8vIEluaXRpYWxpemUgb3B0aW9uc1xuXHRcdGlmKHR5cGVvZiB0aGlzLm9wdGlvbnMuaXRlcmF0aXZlID09IFwib2JqZWN0XCIgfHwgdGhpcy5vcHRpb25zLml0ZXJhdGl2ZSA9PT0gdHJ1ZSkge1xuXHRcdFx0bGV0IGl0ZXJhdGl2ZSA9IHRoaXMub3B0aW9ucy5pdGVyYXRpdmUgPSAodGhpcy5vcHRpb25zLml0ZXJhdGl2ZSA9PT0gdHJ1ZSA/IHt9IDogdGhpcy5vcHRpb25zLml0ZXJhdGl2ZSk7XG5cdFx0XHRpdGVyYXRpdmUubWF4U3RlcHMgPSAoaXRlcmF0aXZlLm1heFN0ZXBzID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKGl0ZXJhdGl2ZS5tYXhTdGVwcykgPyAxZS02IDogTnVtYmVyKGl0ZXJhdGl2ZS5tYXhTdGVwcykpO1xuXHRcdFx0aXRlcmF0aXZlLmRlbHRhID0gKGl0ZXJhdGl2ZS5kZWx0YSA9PSBudWxsIHx8IE51bWJlci5pc05hTihpdGVyYXRpdmUuZGVsdGEpID8gMWUtNiA6IE51bWJlcihpdGVyYXRpdmUuZGVsdGEpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vcHRpb25zLml0ZXJhdGl2ZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsaXplIHNldHNcblx0XHR0aGlzLnNldHMgPSB7XG5cdFx0XHRpbnB1dHM6IHBhcnNlU2V0KGlucHV0cyksXG5cdFx0XHRjYWxjdWxhdGlvbnM6IHBhcnNlU2V0KGNhbGN1bGF0aW9ucyksXG5cdFx0XHRvdXRwdXRzOiBwYXJzZVNldChvdXRwdXRzKVxuXHRcdH07XG5cblx0XHR0aGlzLmV2YWx1YXRpb25PcmRlciA9IGdldEV2YWx1YXRpb25PcmRlcih0aGlzLnNldHMpO1xuXHR9XG5cblx0Y2FsY3VsYXRlKGlucHV0cywgbm9uYmxvY2tpbmcgPSBmYWxzZSkge1xuXHRcdHJldHVybiBjYWxjdWxhdGVJbnRlcm5hbHMuYmluZCh0aGlzKShpbnB1dHMsIG5vbmJsb2NraW5nKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZVNldChzZXQpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRtZW1vW2tleV0gPSBuZXcgRXF1YXRpb24oa2V5LCBzZXRba2V5XSk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RXZhbHVhdGlvbk9yZGVyKHNldHMpIHtcblx0bGV0IGRlcGVuZGVuY2llcyA9IE9iamVjdC5rZXlzKHNldHMpLnJlZHVjZSgobWVtbywgc2V0S2V5KSA9PiB7XG5cdFx0bGV0IHNldCA9IHNldHNbc2V0S2V5XTtcblxuXHRcdE9iamVjdC5rZXlzKHNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRsZXQgZXF1YXRpb24gPSBzZXRba2V5XTtcblx0XHRcdG1lbW9ba2V5XSA9IChlcXVhdGlvbi52YWx1ZSA9PT0gdW5kZWZpbmVkID8gKGVxdWF0aW9uLmVxdWF0aW9uID8gZXF1YXRpb24uZXF1YXRpb25bJGluamVjdF0gOiBbXSkgOiBbXSk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9KTtcblxuXHRcdHJldHVybiBtZW1vO1xuXHR9LCB7fSk7XG5cblx0bGV0IG9yZGVyID0gW107XG5cdGxldCBwcm9jZXNzZWRPdXRwdXRzID0gbmV3IFNldCgpO1xuXHRsZXQgcHJvY2Vzc091dHB1dCA9IChrZXksIHNldCA9IG5ldyBTZXQoKSkgPT4ge1xuXHRcdGlmKHByb2Nlc3NlZE91dHB1dHMuaGFzKGtleSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llc1trZXldO1xuXHRcdGlmKCFkZXBzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2tleX0nIG5vdCBkZWZpbmVkIGluIGVxdWF0aW9ucyBzZXRgKTtcblx0XHR9XG5cdFx0aWYoc2V0LmhhcyhrZXkpKSB7XG5cdFx0XHRsZXQgcGF0aCA9IEFycmF5LmZyb20oc2V0LnZhbHVlcygpKS5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5O1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgJyR7a2V5fScgaGFzIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSAnJHtwYXRofSdgKTtcblx0XHR9XG5cdFx0c2V0LmFkZChrZXkpO1xuXG5cdFx0ZGVwcy5mb3JFYWNoKChkZXApID0+IHtcblx0XHRcdGlmKGRlcGVuZGVuY2llc1tkZXBdID09IG51bGwpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtrZXl9JyBoYXMgYSBtaXNzaW5nIGRlcGVuZGVuY3kgJyR7ZGVwfSdgKTtcblx0XHRcdH1cblx0XHRcdHByb2Nlc3NPdXRwdXQoZGVwLCBuZXcgU2V0KHNldCkpO1xuXHRcdH0pO1xuXHRcdHByb2Nlc3NlZE91dHB1dHMuYWRkKGtleSk7XG5cdFx0b3JkZXIucHVzaChrZXkpO1xuXHR9O1xuXHRPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXHRyZXR1cm4gb3JkZXI7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUludGVybmFscyhpbnB1dHMsIG5vbmJsb2NraW5nKSB7XG5cdGxldCBzZXRzID0gdGhpcy5zZXRzLFxuXHRcdGV2YWx1YXRpb25PcmRlciA9IHRoaXMuZXZhbHVhdGlvbk9yZGVyO1xuXG5cdGxldCBpbnB1dEtleXMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHNldHMuaW5wdXRzKSk7XG5cdGxldCBlcXVhdGlvbnMgPSBPYmplY3Qua2V5cyhzZXRzKS5yZWR1Y2UoKG1lbW8sIHNldEtleSkgPT4ge1xuXHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRPYmplY3Qua2V5cyhzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bWVtb1trZXldID0gc2V0W2tleV07XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcblxuXHQvLyBHZXQgb3B0aW9uc1xuXHRsZXQgbWF4U3RlcHMgPSAwLCBkZWx0YSA9IDA7XG5cdGlmKHRoaXMub3B0aW9ucy5pdGVyYXRpdmUpIHtcblx0XHRsZXQgaXRlcmF0aXZlID0gdGhpcy5vcHRpb25zLml0ZXJhdGl2ZTtcblx0XHRtYXhTdGVwcyA9IGl0ZXJhdGl2ZS5tYXhTdGVwcztcblx0XHRkZWx0YSA9IGl0ZXJhdGl2ZS5kZWx0YTtcblx0fVxuXHRsZXQgYWxsb3dOYU4gPSAhIXRoaXMub3B0aW9ucy5hbGxvd05hTjtcblxuXHQvLyBHZXQgc3RhcnRpbmcgc3RvcmVcblx0bGV0IHN0b3JlLCBzdG9yZVByb21pc2VzO1xuXHRzdG9yZVByb21pc2VzID0gZXZhbHVhdGlvbk9yZGVyLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0bWVtb1trZXldID0gKGlucHV0c1trZXldICE9PSB1bmRlZmluZWQgJiYgaW5wdXRLZXlzLmhhcyhrZXkpID8gaW5wdXRzW2tleV0gOiBlcXVhdGlvbnNba2V5XS52YWx1ZSk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcblxuXHRyZXR1cm4gYXN5bmMucHJvcHMoc3RvcmVQcm9taXNlcykudGhlbigocmVzdWx0KSA9PiB7XG5cdFx0c3RvcmUgPSByZXN1bHQ7XG5cdFx0cmV0dXJuIHN0ZXAuYmluZCh0aGlzKSgwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc3RlcChuKSB7XG5cdFx0c3RvcmVQcm9taXNlcyA9IGV2YWx1YXRpb25PcmRlci5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdFx0bGV0IGVxdWF0aW9uID0gZXF1YXRpb25zW2tleV07XG5cdFx0XHRpZihlcXVhdGlvbi5lcXVhdGlvbiAmJiAoZXF1YXRpb24udmFsdWUgPT09IHVuZGVmaW5lZCB8fCBuID4gMCkpIHtcblx0XHRcdFx0Ly8gVXNlIGxhc3QgaXRlcmF0aW9uIGlmIHZhbHVlIGlzIG5vdCB1bmRlZmluZWQsIG90aGVyd2lzZSwgdXNlIGN1cnJlbnQgc3RvcmVcblx0XHRcdFx0bWVtb1trZXldID0gZGkuaW5qZWN0KGVxdWF0aW9uLmVxdWF0aW9uLCAoZXF1YXRpb24udmFsdWUgPT09IHVuZGVmaW5lZCA/IG1lbW8gOiBzdG9yZSkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVtb1trZXldID0gc3RvcmVba2V5XTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblxuXHRcdHJldHVybiBhc3luYy5wcm9wcyhzdG9yZVByb21pc2VzKS50aGVuKChuZXh0U3RvcmUpID0+IHtcblx0XHRcdC8vIENoZWNrIGRlbHRhXG5cdFx0XHRsZXQgZGlydHkgPSBPYmplY3Qua2V5cyhuZXh0U3RvcmUpLnNvbWUoKGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgcHJldiA9IHN0b3JlW2tleV0sXG5cdFx0XHRcdFx0Y3VyciA9IG5leHRTdG9yZVtrZXldO1xuXG5cdFx0XHRcdGlmKCFhbGxvd05hTiAmJiBOdW1iZXIuaXNOYU4oY3VycikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7a2V5fSBpcyBOYU4gb24gc3RlcCAke259YCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYXRjaGVzXG5cdFx0XHRcdGlmKHByZXYgPT09IGN1cnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBCb3RoIGFyZSBudWxsIG9yIHVuZGVmaW5lZFxuXHRcdFx0XHRpZihwcmV2ID09IG51bGwgJiYgY3VyciA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25lIGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdFx0XHRcdGlmKHByZXYgPT0gbnVsbCB8fCBjdXJyID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGJvdGggTmFOXG5cdFx0XHRcdGlmKE51bWJlci5pc05hTihwcmV2KSAmJiBOdW1iZXIuaXNOYU4oY3VycikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBPbmUgaXMgMCwgY2hlY2sgdmVyc3VzIGRlbHRhXG5cdFx0XHRcdGlmKHByZXYgPT09IDAgfHwgY3VyciA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiBNYXRoLmFicygocHJldiAtIGN1cnIpIC8gTWF0aC5tYXgoTWF0aC5hYnMocHJldiksIE1hdGguYWJzKGN1cnIpKSkgPj0gZGVsdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDaGVjayB2ZXJzdXMgZGVsdGFcblx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKChwcmV2IC0gY3VycikgLyBjdXJyKSA+PSBkZWx0YTtcblx0XHRcdH0pO1xuXG5cdFx0XHRzdG9yZSA9IG5leHRTdG9yZTtcblxuXHRcdFx0bGV0IG5leHQgPSAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiAoKytuID4gbWF4U3RlcHMgfHwgIWRpcnR5KSA/IGZvcm1hdFJlc3VsdChzdG9yZSkgOiBzdGVwLmJpbmQodGhpcykobik7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5vbmJsb2NraW5nID8gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZShuZXh0LmJpbmQodGhpcykoKSkpKSA6IG5leHQoKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFJlc3VsdChyZXN1bHQpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMoc2V0cykucmVkdWNlKChzZXRNZW1vLCBzZXRLZXkpID0+IHtcblx0XHRcdGxldCBzZXQgPSBzZXRzW3NldEtleV07XG5cblx0XHRcdHNldE1lbW9bc2V0S2V5XSA9IE9iamVjdC5rZXlzKHNldCkucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdFx0bWVtb1trZXldID0gcmVzdWx0W2tleV07XG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0cmV0dXJuIHNldE1lbW87XG5cdFx0fSwge30pO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmZXIoKSB7XG5cdGxldCBkZWZlcnJlZCA9IHt9O1xuXHRkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcblx0fSk7XG5cdHJldHVybiBkZWZlcnJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKG9iaikge1xuXHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cdGxldCBwcm9taXNlcyA9IGtleXMubWFwKChrZXkpID0+IHtcblx0XHRyZXR1cm4gb2JqW2tleV07XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigodmFsdWVzKSA9PiB7XG5cdFx0cmV0dXJuIGtleXMucmVkdWNlKChtZW1vLCBrZXksIGkpID0+IHtcblx0XHRcdG1lbW9ba2V5XSA9IHZhbHVlc1tpXTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RoZW5hYmxlKHApIHtcblx0cmV0dXJuICEhcC50aGVuO1xufVxuIiwiaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi9zeW1ib2xzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0ZShmbikge1xuXHRpZiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIiAmJiBmblskaW5qZWN0XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0cmV0dXJuIGZuO1xuXHR9XG5cblx0aWYgKGZuIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRsZXQgZmllbGRzID0gZm47XG5cdFx0Zm4gPSBmbi5wb3AoKTtcblx0XHRmblskaW5qZWN0XSA9IGZpZWxkcztcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRsZXQgbWF0Y2hlcyA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvbig/OiAuKj98ID8pXFwoKC4qPylcXClcXHM/XFx7Lyk7XG5cdGlmKCFtYXRjaGVzLmxlbmd0aCkge1xuXHRcdG1hdGNoZXMgPSBmbi50b1N0cmluZygpLm1hdGNoKC9eXFwoKC4qPylcXClcXHM/PT5cXHM/XFx7Lyk7XG5cdH1cblx0Zm5bJGluamVjdF0gPSBtYXRjaGVzWzFdLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoKGEpID0+IGEpO1xuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGluamVjdEludGVybmFscyhzeW5jLCBmbiwgLi4uc3RvcmVzKSB7XG5cdGlmKCFmblskaW5qZWN0XSkge1xuXHRcdGFubm90YXRlKGZuKTtcblx0fVxuXG5cdGlmKHN0b3Jlc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0c3RvcmVzID0gc3RvcmVzWzBdO1xuXHR9XG5cblx0bGV0IGl0ZW1zID0gZm5bJGluamVjdF0ubWFwKChuYW1lKSA9PiB7XG5cdFx0bGV0IGZvdW5kU3RvcmUgPSBzdG9yZXMuZmluZCgoc3RvcmUpID0+IHtcblx0XHRcdHJldHVybiBzdG9yZVtuYW1lXSAhPT0gdW5kZWZpbmVkO1xuXHRcdH0pO1xuXHRcdGlmIChmb3VuZFN0b3JlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogJHtuYW1lfWAsIGZuKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZvdW5kU3RvcmVbbmFtZV07XG5cdH0pO1xuXG5cdGlmKHN5bmMpIHtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgaXRlbXMpO1xuXHR9XG5cdHJldHVybiBQcm9taXNlLmFsbChpdGVtcykudGhlbigoYXJncykgPT4ge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoZm4sIC4uLnN0b3Jlcykge1xuXHRyZXR1cm4gaW5qZWN0SW50ZXJuYWxzKGZhbHNlLCBmbiwgLi4uc3RvcmVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFN5bmMoZm4sIC4uLnN0b3Jlcykge1xuXHRyZXR1cm4gaW5qZWN0SW50ZXJuYWxzKHRydWUsIGZuLCAuLi5zdG9yZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbm5vdGF0YWJsZShmbikge1xuXHRyZXR1cm4gKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIpIHx8IChBcnJheS5pc0FycmF5KGZuKSAmJiB0eXBlb2YgZm5bZm4ubGVuZ3RoIC0gMV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cbiIsImV4cG9ydCBjb25zdCAkaW5qZWN0ID0gU3ltYm9sKCk7XG4iXX0=
