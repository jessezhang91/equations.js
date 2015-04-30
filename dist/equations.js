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

},{"./core/Equation":2,"./core/Input":3,"./core/Output":4,"./util/symbols":7}],2:[function(require,module,exports){
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

var _$injections$$inputs$$outputs = require("../util/symbols");

var Equation = (function () {
	function Equation(_ref) {
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
			return this[_$injections$$inputs$$outputs.$injections];
		},
		set: function (injections) {
			if (injections instanceof Map) {
				this[_$injections$$inputs$$outputs.$injections] = injections = new Map(injections);
			} else {
				this[_$injections$$inputs$$outputs.$injections] = injections = Object.keys(injections).reduce(function (map, key) {
					map.add(key, injections[key]);
				}, new Map());
			}

			injections.forEach(function (item, key) {
				if (typeof key != "string") {
					throw new Error("Invalid injection provided");
				}
			});
		}
	}, {
		key: "inputs",
		get: function () {
			return this[_$injections$$inputs$$outputs.$inputs];
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
				if (typeof item == "object") {
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
						map.add(key, item);
					});
					_this[_$injections$$inputs$$outputs.$inputs] = inputs = map;
				})();
			} else if (inputs instanceof Array) {
				this[_$injections$$inputs$$outputs.$inputs] = inputs = inputs.reduce(function (map, item) {
					map.add(item.symbol, convert(item));
				}, new Map());
			} else {
				this[_$injections$$inputs$$outputs.$inputs] = inputs = Object.keys(inputs).reduce(function (map, key) {
					var item = convert(inputs[key]);
					item.symbol = key;
					map.add(key, item);
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
			return this[_$injections$$inputs$$outputs.$outputs];
		},
		set: function (outputs) {
			var _this2 = this;

			var convert = function convert(item) {
				if (item instanceof _Output2["default"]) {
					return item;
				}
				return new _Output2["default"](item);
			};

			if (outputs instanceof Map) {
				(function () {
					var map = new Map();
					outputs.forEach(function (item, key) {
						item = convert(item);
						item.symbol = key;
						map.add(key, item);
					});
					_this2[_$injections$$inputs$$outputs.$outputs] = outputs = map;
				})();
			} else {
				this[_$injections$$inputs$$outputs.$outputs] = Object.keys(outputs).reduce(function (map, key) {
					var item = convert(outputs[key]);
					item.symbol = key;
					map.add(key, item);
				}, new Map());
			}

			outputs.forEach(function (item, key) {
				if (item.symbol !== key || typeof key != "string") {
					throw new Error("Invalid output provided");
				}
			});
		}
	}]);

	return Equation;
})();

exports["default"] = Equation;
module.exports = exports["default"];

},{"../util/symbols":7,"./Input":3,"./Output":4}],3:[function(require,module,exports){
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

var _inject$annotate = require("../util/di");

var _$inject = require("../util/symbols");

var Output = (function (_Parameter) {
	function Output(_ref) {
		var formula = _ref.formula;

		_classCallCheck(this, Output);

		_get(Object.getPrototypeOf(Output.prototype), "constructor", this).call(this, arguments[0]);

		this.formula = _inject$annotate.annotate(formula);
	}

	_inherits(Output, _Parameter);

	_createClass(Output, [{
		key: "evaluate",
		value: function evaluate() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			return _inject$annotate.inject(this.formula, stores);
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

},{"../util/di":6,"../util/symbols":7,"./Parameter":5}],5:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _$meta = require("../util/symbols");

var Parameter = (function () {
	function Parameter(_ref) {
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
				map.set(key, meta[key]);
			}, new Map());
		}
	}, {
		key: "evaluateMeta",
		value: function evaluateMeta() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}
		}
	}]);

	return Parameter;
})();

exports["default"] = Parameter;
module.exports = exports["default"];

//

},{"../util/symbols":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.annotate = annotate;
exports.inject = inject;

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

},{"../util/symbols":7}],7:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7d0JBQ0UsaUJBQWlCOzs7O3FCQUNwQixjQUFjOzs7O3NCQUNiLGVBQWU7Ozs7cUJBRW5CO0FBQ2QsU0FBUSx1QkFBQTtBQUNSLE1BQUssb0JBQUE7QUFDTCxPQUFNLHFCQUFBO0FBQ04sUUFBTyxFQUFQLE9BQU87Q0FDUDs7Ozs7Ozs7Ozs7Ozs7OztxQkNWaUIsU0FBUzs7OztzQkFDUixVQUFVOzs7OzRDQUNnQixpQkFBaUI7O0lBRXpDLFFBQVE7QUFDakIsVUFEUyxRQUFRLE9BQzhCOzZCQUE3QyxVQUFVO01BQVYsVUFBVSxtQ0FBRyxFQUFFO3lCQUFFLE1BQU07TUFBTixNQUFNLCtCQUFHLEVBQUU7MEJBQUUsT0FBTztNQUFQLE9BQU8sZ0NBQUcsRUFBRTs7d0JBRG5DLFFBQVE7O0FBRTNCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FB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QztJQUNaO0FBQ0QsT0FBRyxLQUFLLFlBQVksR0FBRyxFQUFFO0FBQ3hCLFdBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QjtBQUNELFVBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ25CLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWQsTUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO0FBQzVCLFNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3ZEO0FBQ0QsU0FBTyxTQUFTLENBQUM7RUFDakIsQ0FBQyxDQUFDOztBQUVILFFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0MsU0FBTyxFQUFFLENBQUMsS0FBSyxRQUFPLElBQUksQ0FBQyxDQUFDO0VBQzVCLENBQUMsQ0FBQztDQUNIOzs7Ozs7OztBQ3BETSxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBNUIsT0FBTyxHQUFQLE9BQU87QUFDYixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBQXhCLEtBQUssR0FBTCxLQUFLO0FBRVgsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQXBDLFdBQVcsR0FBWCxXQUFXO0FBQ2pCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUE1QixPQUFPLEdBQVAsT0FBTztBQUNiLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUE5QixRQUFRLEdBQVIsUUFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBzeW1ib2xzIGZyb20gXCIuL3V0aWwvc3ltYm9sc1wiO1xuaW1wb3J0IEVxdWF0aW9uIGZyb20gXCIuL2NvcmUvRXF1YXRpb25cIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9jb3JlL0lucHV0XCI7XG5pbXBvcnQgT3V0cHV0IGZyb20gXCIuL2NvcmUvT3V0cHV0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0RXF1YXRpb24sXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdHN5bWJvbHNcbn07XG4iLCJpbXBvcnQgSW5wdXQgZnJvbSBcIi4vSW5wdXRcIjtcbmltcG9ydCBPdXRwdXQgZnJvbSBcIi4vT3V0cHV0XCI7XG5pbXBvcnQgeyRpbmplY3Rpb25zLCAkaW5wdXRzLCAkb3V0cHV0c30gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHtpbmplY3Rpb25zID0ge30sIGlucHV0cyA9IHt9LCBvdXRwdXRzID0ge319KSB7XG5cdFx0dGhpcy5pbmplY3Rpb25zID0gaW5qZWN0aW9ucztcblx0XHR0aGlzLmlucHV0cyA9IGlucHV0cztcblx0XHR0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuXHR9XG5cblx0Z2V0IGluamVjdGlvbnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJGluamVjdGlvbnNdO1xuXHR9XG5cdHNldCBpbmplY3Rpb25zKGluamVjdGlvbnMpIHtcblx0XHRpZihpbmplY3Rpb25zIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0XHR0aGlzWyRpbmplY3Rpb25zXSA9IGluamVjdGlvbnMgPSBuZXcgTWFwKGluamVjdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzWyRpbmplY3Rpb25zXSA9IGluamVjdGlvbnMgPSBPYmplY3Qua2V5cyhpbmplY3Rpb25zKS5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG5cdFx0XHRcdG1hcC5hZGQoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuXHRcdFx0fSwgbmV3IE1hcCgpKTtcblx0XHR9XG5cblx0XHRpbmplY3Rpb25zLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0aWYodHlwZW9mIGtleSAhPSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5qZWN0aW9uIHByb3ZpZGVkXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0IGlucHV0cygpIHtcblx0XHRyZXR1cm4gdGhpc1skaW5wdXRzXTtcblx0fVxuXHRzZXQgaW5wdXRzKGlucHV0cykge1xuXHRcdGxldCBjb252ZXJ0ID0gKGl0ZW0pID0+IHtcblx0XHRcdGlmKGl0ZW0gaW5zdGFuY2VvZiBJbnB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBJbnB1dCh7XG5cdFx0XHRcdFx0c3ltYm9sOiBpdGVtXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IElucHV0KGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBJbnB1dCgpO1xuXHRcdH07XG5cblx0XHRpZihpbnB1dHMgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdGxldCBtYXAgPSBuZXcgTWFwKCk7XG5cdFx0XHRpbnB1dHMuZm9yRWFjaCgoaXRlbSwga2V5KSA9PiB7XG5cdFx0XHRcdGl0ZW0gPSBjb252ZXJ0KGl0ZW0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWFwLmFkZChrZXksIGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzWyRpbnB1dHNdID0gaW5wdXRzID0gbWFwO1xuXHRcdH0gZWxzZSBpZihpbnB1dHMgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0dGhpc1skaW5wdXRzXSA9IGlucHV0cyA9IGlucHV0cy5yZWR1Y2UoKG1hcCwgaXRlbSkgPT4ge1xuXHRcdFx0XHRtYXAuYWRkKGl0ZW0uc3ltYm9sLCBjb252ZXJ0KGl0ZW0pKTtcblx0XHRcdH0sIG5ldyBNYXAoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXNbJGlucHV0c10gPSBpbnB1dHMgPSBPYmplY3Qua2V5cyhpbnB1dHMpLnJlZHVjZSgobWFwLCBrZXkpID0+IHtcblx0XHRcdFx0bGV0IGl0ZW0gPSBjb252ZXJ0KGlucHV0c1trZXldKTtcblx0XHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRcdG1hcC5hZGQoa2V5LCBpdGVtKTtcblx0XHRcdH0sIG5ldyBNYXAoKSk7XG5cdFx0fVxuXG5cdFx0aW5wdXRzLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0aWYoaXRlbS5zeW1ib2wgIT09IGtleSB8fCB0eXBlb2Yga2V5ICE9IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBpbnB1dCBwcm92aWRlZFwiKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGdldCBvdXRwdXRzKCkge1xuXHRcdHJldHVybiB0aGlzWyRvdXRwdXRzXTtcblx0fVxuXHRzZXQgb3V0cHV0cyhvdXRwdXRzKSB7XG5cdFx0bGV0IGNvbnZlcnQgPSAoaXRlbSkgPT4ge1xuXHRcdFx0aWYoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgT3V0cHV0KGl0ZW0pO1xuXHRcdH07XG5cblx0XHRpZihvdXRwdXRzIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0XHRsZXQgbWFwID0gbmV3IE1hcCgpO1xuXHRcdFx0b3V0cHV0cy5mb3JFYWNoKChpdGVtLCBrZXkpID0+IHtcblx0XHRcdFx0aXRlbSA9IGNvbnZlcnQoaXRlbSk7XG5cdFx0XHRcdGl0ZW0uc3ltYm9sID0ga2V5O1xuXHRcdFx0XHRtYXAuYWRkKGtleSwgaXRlbSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXNbJG91dHB1dHNdID0gb3V0cHV0cyA9IG1hcDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpc1skb3V0cHV0c10gPSBPYmplY3Qua2V5cyhvdXRwdXRzKS5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gY29udmVydChvdXRwdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWFwLmFkZChrZXksIGl0ZW0pO1xuXHRcdFx0fSwgbmV3IE1hcCgpKTtcblx0XHR9XG5cblx0XHRvdXRwdXRzLmZvckVhY2goKGl0ZW0sIGtleSkgPT4ge1xuXHRcdFx0aWYoaXRlbS5zeW1ib2wgIT09IGtleSB8fCB0eXBlb2Yga2V5ICE9IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBvdXRwdXQgcHJvdmlkZWRcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCBQYXJhbWV0ZXIgZnJvbSBcIi4vUGFyYW1ldGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IGV4dGVuZHMgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoYXJndW1lbnRzWzBdKTtcblx0fVxufVxuIiwiaW1wb3J0IFBhcmFtZXRlciBmcm9tIFwiLi9QYXJhbWV0ZXJcIjtcbmltcG9ydCB7aW5qZWN0LCBhbm5vdGF0ZX0gZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCB7JGluamVjdH0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7Zm9ybXVsYX0pIHtcblx0XHRzdXBlcihhcmd1bWVudHNbMF0pO1xuXG5cdFx0dGhpcy5mb3JtdWxhID0gYW5ub3RhdGUoZm9ybXVsYSk7XG5cdH1cblxuXHRldmFsdWF0ZSguLi5zdG9yZXMpIHtcblx0XHRyZXR1cm4gaW5qZWN0KHRoaXMuZm9ybXVsYSwgc3RvcmVzKTtcblx0fVxuXG5cdGdldCBkZXBlbmRlbmNpZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZm9ybXVsYVskaW5qZWN0XTtcblx0fVxufVxuIiwiaW1wb3J0IHskbWV0YX0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7c3ltYm9sLCBtZXRhID0ge319KSB7XG5cdFx0dGhpcy5zeW1ib2wgPSBzeW1ib2w7XG5cdFx0dGhpcy5tZXRhID0gbWV0YTtcblx0fVxuXG5cdGdldCBtZXRhKCkge1xuXHRcdHJldHVybiB0aGlzWyRtZXRhXTtcblx0fVxuXHRzZXQgbWV0YShtZXRhKSB7XG5cdFx0aWYobWV0YSBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdFx0dGhpc1skbWV0YV0gPSBtZXRhO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXNbJG1ldGFdID0gT2JqZWN0LmtleXMobWV0YSkucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0bWFwLnNldChrZXksIG1ldGFba2V5XSk7XG5cdFx0fSwgbmV3IE1hcCgpKTtcblx0fVxuXG5cdGV2YWx1YXRlTWV0YSguLi5zdG9yZXMpIHtcblx0XHQvL1xuXHR9XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGZuWyRpbmplY3RdID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uIC4qP1xcKCguKj8pXFwpLylbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuXHRcdHJldHVybiBhO1xuXHR9KTtcblx0cmV0dXJuIGZuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KGZuLCAuLi5zdG9yZXMpIHtcblx0aWYgKCFmblskaW5qZWN0XSkge1xuXHRcdGZuID0gYW5ub3RhdGUoZm4pO1xuXHR9XG5cblx0Ly8gVE9ETzogU3VwcG9ydCBmdW5jdGlvbiBhcmd1bWVudCBkZXN0cnVjdHVyZSBzeW50YXggd2l0aCBuYXRpdmUsIGJhYmVsLCBhbmQgdHJhY2V1clxuXG5cdGlmKHN0b3Jlc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0c3RvcmVzID0gc3RvcmVzWzBdO1xuXHR9XG5cblx0bGV0IHByb21pc2VzID0gZm5bJGluamVjdF0ubWFwKChuYW1lKSA9PiB7XG5cdFx0Ly8gUmVwbGFjZSB0aGlzIHdpdGggXCJmaW5kXCIgd2hlbiB0aGF0IGlzIHJlYWR5XG5cdFx0bGV0IGluamVjdGlvbiA9IHN0b3Jlcy5yZWR1Y2VSaWdodCgoaXRlbSwgc3RvcmUpID0+IHtcblx0XHRcdGlmKGl0ZW0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHN0b3JlIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0XHRcdHJldHVybiBzdG9yZS5nZXQobmFtZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RvcmVbbmFtZV07XG5cdFx0fSwgdW5kZWZpbmVkKTtcblxuXHRcdGlmIChpbmplY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogXCIgKyBuYW1lLCBmbik7XG5cdFx0fVxuXHRcdHJldHVybiBpbmplY3Rpb247XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoYXJncykgPT4ge1xuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fSk7XG59XG4iLCJleHBvcnQgY29uc3QgJGluamVjdCA9IFN5bWJvbChcIiRpbmplY3RcIik7XG5leHBvcnQgY29uc3QgJG1ldGEgPSBTeW1ib2woXCIkbWV0YVwiKTtcblxuZXhwb3J0IGNvbnN0ICRpbmplY3Rpb25zID0gU3ltYm9sKFwiJGluamVjdGlvbnNcIik7XG5leHBvcnQgY29uc3QgJGlucHV0cyA9IFN5bWJvbChcIiRpbnB1dHNcIik7XG5leHBvcnQgY29uc3QgJG91dHB1dHMgPSBTeW1ib2woXCIkb3V0cHV0c1wiKTtcbiJdfQ==
