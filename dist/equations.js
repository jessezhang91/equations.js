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

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var Equation = function Equation(_ref) {
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
};

exports["default"] = Equation;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
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

var Input = (function (_Parameter) {
	function Input(_ref) {
		var value = _ref.value;

		_classCallCheck(this, Input);

		_get(Object.getPrototypeOf(Input.prototype), "constructor", this).call(this, arguments[0]);

		this.value = value;
	}

	_inherits(Input, _Parameter);

	_createClass(Input, [{
		key: "evaluate",
		value: function evaluate() {
			return this.value;
		}
	}]);

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

var Output = (function (_Parameter) {
	function Output(_ref) {
		var equation = _ref.equation;

		_classCallCheck(this, Output);

		_get(Object.getPrototypeOf(Output.prototype), "constructor", this).call(this, arguments[0]);

		this.equation = _inject$annotate.annotate(equation);
	}

	_inherits(Output, _Parameter);

	_createClass(Output, [{
		key: "evaluate",
		value: function evaluate() {
			for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
				stores[_key] = arguments[_key];
			}

			return _inject$annotate.inject(this.equation, stores);
		}
	}, {
		key: "dependencies",
		get: function () {
			return this.equation.$inject;
		}
	}]);

	return Output;
})(_Parameter3["default"]);

exports["default"] = Output;
module.exports = exports["default"];

},{"../util/di":6,"./Parameter":5}],5:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _$meta = require("../util/symbols");

var Parameter = function Parameter(_ref) {
	var _ref$$meta = _ref[_$meta.$meta];
	var meta = _ref$$meta === undefined ? {} : _ref$$meta;

	_classCallCheck(this, Parameter);

	this[_$meta.$meta] = meta;
};

exports["default"] = Parameter;
module.exports = exports["default"];

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uLmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7d0JBQ0UsaUJBQWlCOzs7O3FCQUNwQixjQUFjOzs7O3NCQUNiLGVBQWU7Ozs7cUJBRW5CO0FBQ2QsU0FBUSx1QkFBQTtBQUNSLE1BQUssb0JBQUE7QUFDTCxPQUFNLHFCQUFBO0FBQ04sUUFBTyxFQUFQLE9BQU87Q0FDUDs7Ozs7Ozs7Ozs7O0lDVm9CLFFBQVEsR0FDakIsU0FEUyxRQUFRLE9BQzhCOzRCQUE3QyxVQUFVO0tBQVYsVUFBVSxtQ0FBRyxFQUFFO3dCQUFFLE1BQU07S0FBTixNQUFNLCtCQUFHLEVBQUU7eUJBQUUsT0FBTztLQUFQLE9BQU8sZ0NBQUcsRUFBRTs7dUJBRG5DLFFBQVE7O0FBRTNCLEtBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLEtBQUksQ0FB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QUMsSUFBSSxFQUFLOztBQUV4QyxNQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN6RCxPQUFHLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDdEIsV0FBTyxJQUFJLENBQUM7SUFDWjtBQUNELFVBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ25CLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWQsTUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO0FBQzVCLFNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3ZEO0FBQ0QsU0FBTyxTQUFTLENBQUM7RUFDakIsQ0FBQyxDQUFDOztBQUVILFFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0MsU0FBTyxFQUFFLENBQUMsS0FBSyxRQUFPLElBQUksQ0FBQyxDQUFDO0VBQzVCLENBQUMsQ0FBQztDQUNIOzs7Ozs7OztBQ2pETSxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBNUIsT0FBTyxHQUFQLE9BQU87QUFDYixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFBeEIsS0FBSyxHQUFMLEtBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgc3ltYm9scyBmcm9tIFwiLi91dGlsL3N5bWJvbHNcIjtcbmltcG9ydCBFcXVhdGlvbiBmcm9tIFwiLi9jb3JlL0VxdWF0aW9uXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vY29yZS9JbnB1dFwiO1xuaW1wb3J0IE91dHB1dCBmcm9tIFwiLi9jb3JlL091dHB1dFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdEVxdWF0aW9uLFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRzeW1ib2xzXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXF1YXRpb24ge1xuXHRjb25zdHJ1Y3Rvcih7aW5qZWN0aW9ucyA9IHt9LCBpbnB1dHMgPSB7fSwgb3V0cHV0cyA9IHt9fSkge1xuXHRcdHRoaXMuaW5qZWN0aW9ucyA9IGluamVjdGlvbnM7XG5cdFx0dGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cdFx0dGhpcy5vdXRwdXRzID0gb3V0cHV0cztcblx0fVxufVxuIiwiaW1wb3J0IFBhcmFtZXRlciBmcm9tIFwiLi9QYXJhbWV0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7dmFsdWV9KSB7XG5cdFx0c3VwZXIoYXJndW1lbnRzWzBdKTtcblxuXHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdGV2YWx1YXRlKCkge1xuXHRcdHJldHVybiB0aGlzLnZhbHVlO1xuXHR9XG59XG4iLCJpbXBvcnQgUGFyYW1ldGVyIGZyb20gXCIuL1BhcmFtZXRlclwiO1xuaW1wb3J0IHtpbmplY3QsIGFubm90YXRlfSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7ZXF1YXRpb259KSB7XG5cdFx0c3VwZXIoYXJndW1lbnRzWzBdKTtcblxuXHRcdHRoaXMuZXF1YXRpb24gPSBhbm5vdGF0ZShlcXVhdGlvbik7XG5cdH1cblxuXHRldmFsdWF0ZSguLi5zdG9yZXMpIHtcblx0XHRyZXR1cm4gaW5qZWN0KHRoaXMuZXF1YXRpb24sIHN0b3Jlcyk7XG5cdH1cblxuXHRnZXQgZGVwZW5kZW5jaWVzKCkge1xuXHRcdHJldHVybiB0aGlzLmVxdWF0aW9uLiRpbmplY3Q7XG5cdH1cbn1cbiIsImltcG9ydCB7JG1ldGF9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3Ioe1skbWV0YV06IG1ldGEgPSB7fX0pIHtcblx0XHR0aGlzWyRtZXRhXSA9IG1ldGE7XG5cdH1cbn1cbiIsImltcG9ydCB7JGluamVjdH0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gYW5ub3RhdGUoZm4pIHtcblx0aWYgKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIgJiYgZm5bJGluamVjdF0gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGlmIChmbiBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0bGV0IGZpZWxkcyA9IGZuO1xuXHRcdGZuID0gZm4ucG9wKCk7XG5cdFx0Zm5bJGluamVjdF0gPSBmaWVsZHM7XG5cdFx0cmV0dXJuIGZuO1xuXHR9XG5cblx0Zm5bJGluamVjdF0gPSBmbi50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb24gLio/XFwoKC4qPylcXCkvKVsxXS5zcGxpdCgvXFxzKixcXHMqLykuZmlsdGVyKGZ1bmN0aW9uIChhKSB7XG5cdFx0cmV0dXJuIGE7XG5cdH0pO1xuXHRyZXR1cm4gZm47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoZm4sIC4uLnN0b3Jlcykge1xuXHRpZiAoIWZuWyRpbmplY3RdKSB7XG5cdFx0Zm4gPSBhbm5vdGF0ZShmbik7XG5cdH1cblxuXHQvLyBUT0RPOiBTdXBwb3J0IGZ1bmN0aW9uIGFyZ3VtZW50IGRlc3RydWN0dXJlIHN5bnRheCB3aXRoIG5hdGl2ZSwgYmFiZWwsIGFuZCB0cmFjZXVyXG5cblx0aWYoc3RvcmVzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRzdG9yZXMgPSBzdG9yZXNbMF07XG5cdH1cblxuXHRsZXQgcHJvbWlzZXMgPSBmblskaW5qZWN0XS5tYXAoKG5hbWUpID0+IHtcblx0XHQvLyBSZXBsYWNlIHRoaXMgd2l0aCBcImZpbmRcIiB3aGVuIHRoYXQgaXMgcmVhZHlcblx0XHRsZXQgaW5qZWN0aW9uID0gc3RvcmVzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChpdGVtLCBzdG9yZSkge1xuXHRcdFx0aWYoaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0b3JlW25hbWVdO1xuXHRcdH0sIHVuZGVmaW5lZCk7XG5cblx0XHRpZiAoaW5qZWN0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIGRlcGVuZGVuY3k6IFwiICsgbmFtZSwgZm4pO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5qZWN0aW9uO1xuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKGFyZ3MpID0+IHtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cdH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0ICRpbmplY3QgPSBTeW1ib2woXCIkaW5qZWN0XCIpO1xuZXhwb3J0IGNvbnN0ICRtZXRhID0gU3ltYm9sKFwiJG1ldGFcIik7XG4iXX0=
