(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.eqns = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _import = require("./util/symbols");

var symbols = _interopRequireWildcard(_import);

var _EquationSet$equationSetFactory = require("./core/EquationSet");

var _EquationSet$equationSetFactory2 = _interopRequireDefault(_EquationSet$equationSetFactory);

var _Input$inputFactory = require("./core/Input");

var _Input$inputFactory2 = _interopRequireDefault(_Input$inputFactory);

var _Output$outputFactory = require("./core/Output");

var _Output$outputFactory2 = _interopRequireDefault(_Output$outputFactory);

var _store$plugins = require("./util/state");

exports["default"] = Object.create(_store$plugins.plugins.fn, {
	get: {
		enumerable: true,
		value: _store$plugins.store.get.bind(_store$plugins.store)
	},
	has: {
		enumerable: true,
		value: _store$plugins.store.has.bind(_store$plugins.store)
	},

	plugins: {
		value: _store$plugins.plugins
	},

	EquationSet: {
		enumerable: true,
		value: _EquationSet$equationSetFactory2["default"]
	},
	equationSet: {
		enumerable: true,
		value: _EquationSet$equationSetFactory.factory
	},

	Input: {
		enumerable: true,
		value: _Input$inputFactory2["default"]
	},
	input: {
		enumerable: true,
		value: _Input$inputFactory.factory
	},

	Output: {
		enumerable: true,
		value: _Output$outputFactory2["default"]
	},
	output: {
		enumerable: true,
		value: _Output$outputFactory.factory
	},

	symbols: {
		value: Object.freeze(symbols)
	}
});
module.exports = exports["default"];

},{"./core/EquationSet":2,"./core/Input":3,"./core/Output":4,"./util/state":8,"./util/symbols":9}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.factory = factory;

var _Input = require("./Input");

var _Input2 = _interopRequireDefault(_Input);

var _Output = require("./Output");

var _Output2 = _interopRequireDefault(_Output);

var _import = require("../util/async");

var async = _interopRequireWildcard(_import);

var _$name$$injections$$inputs$$outputs$$evaluationOrder = require("../util/symbols");

var _store$plugins = require("../util/state");

var EquationSet = (function () {
	function EquationSet() {
		var _ref = arguments[0] === undefined ? {} : arguments[0];

		var _ref$name = _ref.name;
		var name = _ref$name === undefined ? null : _ref$name;
		var _ref$injections = _ref.injections;
		var injections = _ref$injections === undefined ? {} : _ref$injections;
		var _ref$inputs = _ref.inputs;
		var inputs = _ref$inputs === undefined ? {} : _ref$inputs;
		var _ref$outputs = _ref.outputs;
		var outputs = _ref$outputs === undefined ? {} : _ref$outputs;

		_classCallCheck(this, EquationSet);

		this.name = name;
		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}

	_createClass(EquationSet, [{
		key: "name",
		get: function () {
			return this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$name];
		},
		set: function (name) {
			var prevName = this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$name];
			if (prevName === name) {
				return;
			}

			if (prevName != null && _store$plugins.store.has(prevName)) {
				_store$plugins.store["delete"](prevName);
			}
			if (name != null) {
				if (_store$plugins.store.has(name)) {
					throw new Error("Equation Set '" + name + "' already exists.");
				}
				_store$plugins.store.set(name, this);
			}
			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$name] = name;
		}
	}, {
		key: "injections",
		get: function () {
			return this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$injections];
		},
		set: function (injections) {
			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$injections] = Object.freeze(injections);
		}
	}, {
		key: "inputs",
		get: function () {
			return this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$inputs];
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
						throw new Error("Invalid input symbol '" + item.symbol + "'");
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

			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$inputs] = Object.freeze(inputs);
		}
	}, {
		key: "outputs",
		get: function () {
			return this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$outputs];
		},
		set: function (outputs) {
			var convert = function convert(item) {
				if (item instanceof _Output2["default"]) {
					return item;
				}
				if (typeof item == "function" || item instanceof Array) {
					return new _Output2["default"]({
						formula: item
					});
				}
				return new _Output2["default"](item);
			};

			if (outputs instanceof Array) {
				outputs = outputs.reduce(function (memo, item) {
					item = convert(item);
					memo[item.symbol] = item;

					if (typeof item.symbol != "string") {
						throw new Error("Invalid output symbol '" + item.symbol + "'");
					}

					return memo;
				}, {});
			} else {
				outputs = Object.keys(outputs).reduce(function (memo, key) {
					var item = convert(outputs[key]);
					item.symbol = key;
					memo[key] = item;
					return memo;
				}, {});
			}

			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$outputs] = Object.freeze(outputs);
			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] = null;
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

			if (this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] == null) {
				this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder] = new Map();
			}

			var cacheKey = Array.from(evals).join(),
			    cache = this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder].get(cacheKey);
			if (cache) {
				return cache;
			}
			cache = resolveEvaluationOrder(this, evals);
			this[_$name$$injections$$inputs$$outputs$$evaluationOrder.$evaluationOrder].set(cacheKey, cache);

			return cache;
		}
	}, {
		key: "evaluate",
		value: function evaluate(rawIns) {
			var _this = this;

			for (var _len2 = arguments.length, evals = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				evals[_key2 - 1] = arguments[_key2];
			}

			var prePromise = async.props(rawIns);
			_store$plugins.plugins.pre.forEach(function (plugin) {
				prePromise = prePromise.then(function (data) {
					return plugin.call(_this, data);
				});
			});

			var postPromise = prePromise.then(function (ins) {
				return _this.evaluateRaw.apply(_this, [].concat([ins]).concat(evals));
			});
			_store$plugins.plugins.post.forEach(function (plugin) {
				postPromise = postPromise.then(function (data) {
					return plugin.call(_this, data);
				});
			});

			return postPromise;
		}
	}, {
		key: "evaluateRaw",
		value: function evaluateRaw(ins) {
			for (var _len3 = arguments.length, evals = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				evals[_key3 - 1] = arguments[_key3];
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
			throw new Error("Output '" + key + "' not defined in equations set");
		}
		if (set.has(key)) {
			var path = Array.from(set.values()).join(" -> ") + " -> " + key;
			throw new Error("Output '" + key + "' has a circular dependency '" + path + "'");
		}
		set.add(key);

		deps.filter(function (dep) {
			return ! ~injections.indexOf(dep) && ! ~inputs.indexOf(dep);
		}).forEach(function (dep) {
			if (! ~outputs.indexOf(dep)) {
				throw new Error("Output '" + key + "' has a missing dependency '" + dep + "'");
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

function factory(opts) {
	return new EquationSet(opts);
}

},{"../util/async":6,"../util/state":8,"../util/symbols":9,"./Input":3,"./Output":4}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.factory = factory;

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

function factory(opts) {
	return new Input(opts);
}

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
exports.factory = factory;

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

function factory(opts) {
	return new Output(opts);
}

},{"../util/di":7,"../util/symbols":9,"./Parameter":5}],5:[function(require,module,exports){
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

},{"../util/async":6,"../util/di":7,"../util/symbols":9}],6:[function(require,module,exports){
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

},{"../util/symbols":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var store = new Map();

exports.store = store;
var plugins = Object.freeze({
	pre: [],
	post: [],
	fn: {}
});
exports.plugins = plugins;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $inject = Symbol("$inject");
exports.$inject = $inject;
var $meta = Symbol("$meta");
exports.$meta = $meta;
var $name = Symbol("$name");

exports.$name = $name;
var $injections = Symbol("$injections");
exports.$injections = $injections;
var $inputs = Symbol("$inputs");
exports.$inputs = $inputs;
var $outputs = Symbol("$outputs");

exports.$outputs = $outputs;
var $evaluationOrder = Symbol("$evaluationOrder");
exports.$evaluationOrder = $evaluationOrder;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvYXN5bmMuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3RhdGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7OENBQ2lELG9CQUFvQjs7OztrQ0FDaEMsY0FBYzs7OztvQ0FDWixlQUFlOzs7OzZCQUM1QyxjQUFjOztxQkFFNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUZkLE9BQU8sQ0FFZSxFQUFFLEVBQUU7QUFDeEMsSUFBRyxFQUFFO0FBQ0osWUFBVSxFQUFFLElBQUk7QUFDaEIsT0FBSyxFQUFFLGVBTEQsS0FBSyxDQUtFLEdBQUcsQ0FBQyxJQUFJLGdCQUxmLEtBQUssQ0FLaUI7RUFDNUI7QUFDRCxJQUFHLEVBQUU7QUFDSixZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLEVBQUUsZUFURCxLQUFLLENBU0UsR0FBRyxDQUFDLElBQUksZ0JBVGYsS0FBSyxDQVNpQjtFQUM1Qjs7QUFFRCxRQUFPLEVBQUU7QUFDUixPQUFLLGlCQWJRLE9BQU8sQUFhTjtFQUNkOztBQUVELFlBQVcsRUFBRTtBQUNaLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLE9BQUssNkNBQWE7RUFDbEI7QUFDRCxZQUFXLEVBQUU7QUFDWixZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLGtDQXpCeUIsT0FBTyxBQXlCWjtFQUN6Qjs7QUFFRCxNQUFLLEVBQUU7QUFDTixZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLGlDQUFPO0VBQ1o7QUFDRCxNQUFLLEVBQUU7QUFDTixZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLHNCQWpDbUIsT0FBTyxBQWlDWjtFQUNuQjs7QUFFRCxPQUFNLEVBQUU7QUFDUCxZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLG1DQUFRO0VBQ2I7QUFDRCxPQUFNLEVBQUU7QUFDUCxZQUFVLEVBQUUsSUFBSTtBQUNoQixPQUFLLHdCQXpDb0IsT0FBTyxBQXlDWjtFQUNwQjs7QUFFRCxRQUFPLEVBQUU7QUFDUixPQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7RUFDN0I7Q0FDRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztRQ3dOYyxPQUFPLEdBQVAsT0FBTzs7cUJBMVFMLFNBQVM7Ozs7c0JBQ1IsVUFBVTs7OztzQkFDTixlQUFlOztJQUExQixLQUFLOzttRUFDcUQsaUJBQWlCOzs2QkFDMUQsZUFBZTs7SUFFdkIsV0FBVztBQUNwQixVQURTLFdBQVcsR0FDNkM7MENBQUosRUFBRTs7dUJBQTdELElBQUk7TUFBSixJQUFJLDZCQUFHLElBQUk7NkJBQUUsVUFBVTtNQUFWLFVBQVUsbUNBQUcsRUFBRTt5QkFBRSxNQUFNO01BQU4sTUFBTSwrQkFBRyxFQUFFOzBCQUFFLE9BQU87TUFBUCxPQUFPLGdDQUFHLEVBQUU7O3dCQURoRCxXQUFXOztBQUU5QixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztFQUN2Qjs7Y0FObUIsV0FBVzs7T0FRdkIsWUFBRztBQUNWLFVBQU8sSUFBSSxzREFaTCxLQUFLLENBWU8sQ0FBQztHQUNuQjtPQUNPLFVBQUMsSUFBSSxFQUFFO0FBQ2QsT0FBSSxRQUFRLEdBQUcsSUFBSSxzREFmYixLQUFLLENBZWUsQ0FBQztBQUMzQixPQUFHLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDckIsV0FBTztJQUNQOztBQUVELE9BQUcsUUFBUSxJQUFJLElBQUksSUFBSSxlQW5CakIsS0FBSyxDQW1Ca0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzNDLG1CQXBCSyxLQUFLLFVBb0JFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkI7QUFDRCxPQUFHLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDaEIsUUFBRyxlQXZCRSxLQUFLLENBdUJELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuQixXQUFNLElBQUksS0FBSyxvQkFBa0IsSUFBSSx1QkFBb0IsQ0FBQztLQUMxRDtBQUNELG1CQTFCSyxLQUFLLENBMEJKLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEI7QUFDRCxPQUFJLHNEQTdCRSxLQUFLLENBNkJBLEdBQUcsSUFBSSxDQUFDO0dBQ25COzs7T0FFYSxZQUFHO0FBQ2hCLFVBQU8sSUFBSSxzREFqQ0UsV0FBVyxDQWlDQSxDQUFDO0dBQ3pCO09BQ2EsVUFBQyxVQUFVLEVBQUU7QUFDMUIsT0FBSSxzREFwQ1MsV0FBVyxDQW9DUCxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDOUM7OztPQUVTLFlBQUc7QUFDWixVQUFPLElBQUksc0RBeENlLE9BQU8sQ0F3Q2IsQ0FBQztHQUNyQjtPQUNTLFVBQUMsTUFBTSxFQUFFO0FBQ2xCLE9BQUksT0FBTyxHQUFHLGlCQUFDLElBQUksRUFBSztBQUN2QixRQUFHLElBQUksOEJBQWlCLEVBQUU7QUFDekIsWUFBTyxJQUFJLENBQUM7S0FDWjtBQUNELFFBQUcsT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFO0FBQzNCLFlBQU8sdUJBQVU7QUFDaEIsWUFBTSxFQUFFLElBQUk7TUFDWixDQUFDLENBQUM7S0FDSDtBQUNELFFBQUcsT0FBTyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDM0MsWUFBTyx1QkFBVSxJQUFJLENBQUMsQ0FBQztLQUN2QjtBQUNELFdBQU8sd0JBQVcsQ0FBQztJQUNuQixDQUFDOztBQUVGLE9BQUcsTUFBTSxZQUFZLEtBQUssRUFBRTtBQUMzQixVQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxJQUFJLEVBQUs7QUFDdEMsU0FBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQixTQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFekIsU0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO0FBQ2xDLFlBQU0sSUFBSSxLQUFLLDRCQUEwQixJQUFJLENBQUMsTUFBTSxPQUFJLENBQUM7TUFDekQ7O0FBRUQsWUFBTyxJQUFJLENBQUM7S0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1AsTUFBTTtBQUNOLFVBQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUs7QUFDbEQsU0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFNBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBTyxJQUFJLENBQUM7S0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1A7O0FBRUQsT0FBSSxzREE5RXNCLE9BQU8sQ0E4RXBCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN0Qzs7O09BRVUsWUFBRztBQUNiLFVBQU8sSUFBSSxzREFsRndCLFFBQVEsQ0FrRnRCLENBQUM7R0FDdEI7T0FDVSxVQUFDLE9BQU8sRUFBRTtBQUNwQixPQUFJLE9BQU8sR0FBRyxpQkFBQyxJQUFJLEVBQUs7QUFDdkIsUUFBRyxJQUFJLCtCQUFrQixFQUFFO0FBQzFCLFlBQU8sSUFBSSxDQUFDO0tBQ1o7QUFDRCxRQUFHLE9BQU8sSUFBSSxJQUFJLFVBQVUsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO0FBQ3RELFlBQU8sd0JBQVc7QUFDakIsYUFBTyxFQUFFLElBQUk7TUFDYixDQUFDLENBQUM7S0FDSDtBQUNELFdBQU8sd0JBQVcsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQzs7QUFHRixPQUFHLE9BQU8sWUFBWSxLQUFLLEVBQUU7QUFDNUIsV0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQ3hDLFNBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckIsU0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRXpCLFNBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUNsQyxZQUFNLElBQUksS0FBSyw2QkFBMkIsSUFBSSxDQUFDLE1BQU0sT0FBSSxDQUFDO01BQzFEOztBQUVELFlBQU8sSUFBSSxDQUFDO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNQLE1BQU07QUFDTixXQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFLO0FBQ3BELFNBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqQyxTQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNsQixTQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQU8sSUFBSSxDQUFDO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNQOztBQUVELE9BQUksc0RBdEgrQixRQUFRLENBc0g3QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsT0FBSSxzREF2SHlDLGdCQUFnQixDQXVIdkMsR0FBRyxJQUFJLENBQUM7R0FDOUI7OztPQUVrQixZQUFHO0FBQ3JCLFVBQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7R0FDakM7OztTQUVpQiw4QkFBVztxQ0FBUCxLQUFLO0FBQUwsU0FBSzs7O0FBQzFCLE9BQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssRUFBRTtBQUM3QixTQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCO0FBQ0QsUUFBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV2QixPQUFHLElBQUksc0RBcElzQyxnQkFBZ0IsQ0FvSXBDLElBQUksSUFBSSxFQUFFO0FBQ2xDLFFBQUksc0RBckl3QyxnQkFBZ0IsQ0FxSXRDLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNuQzs7QUFFRCxPQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRTtPQUN0QyxLQUFLLEdBQUcsSUFBSSxzREF6SWdDLGdCQUFnQixDQXlJOUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsT0FBRyxLQUFLLEVBQUU7QUFDVCxXQUFPLEtBQUssQ0FBQztJQUNiO0FBQ0QsUUFBSyxHQUFHLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxPQUFJLHNEQTlJeUMsZ0JBQWdCLENBOEl2QyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTVDLFVBQU8sS0FBSyxDQUFDO0dBQ2I7OztTQUVPLGtCQUFDLE1BQU0sRUFBWTs7O3NDQUFQLEtBQUs7QUFBTCxTQUFLOzs7QUFDeEIsT0FBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxrQkFwSmEsT0FBTyxDQW9KWixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQy9CLGNBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RDLFlBQU8sTUFBTSxDQUFDLElBQUksUUFBTyxJQUFJLENBQUMsQ0FBQztLQUMvQixDQUFDLENBQUM7SUFDSCxDQUFDLENBQUM7O0FBRUgsT0FBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUMxQyxXQUFPLE1BQUssV0FBVyxDQUFDLEtBQUssUUFBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDLENBQUM7QUFDSCxrQkE3SmEsT0FBTyxDQTZKWixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ2hDLGVBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3hDLFlBQU8sTUFBTSxDQUFDLElBQUksUUFBTyxJQUFJLENBQUMsQ0FBQztLQUMvQixDQUFDLENBQUM7SUFDSCxDQUFDLENBQUM7O0FBRUgsVUFBTyxXQUFXLENBQUM7R0FDbkI7OztTQUVVLHFCQUFDLEdBQUcsRUFBWTtzQ0FBUCxLQUFLO0FBQUwsU0FBSzs7O0FBQ3hCLE9BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO09BQy9CLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtPQUNwQixPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFeEIsT0FBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsT0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQzNELFFBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDOztBQUVILE9BQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixTQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNqQyxXQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQzs7QUFFSCxPQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsU0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDbEMsWUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUM7O0FBR0gsVUFBTyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2xCLFVBQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUN4QixXQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDMUIsU0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDbEIsV0FBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzVCLFlBQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUM5QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQixXQUFPO0FBQ04sV0FBTSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3JELFlBQU8sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztLQUN4RCxDQUFDO0lBQ0YsQ0FBQyxDQUFDO0dBQ0g7OztRQXRNbUIsV0FBVzs7O3FCQUFYLFdBQVc7O0FBeU1oQyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLFFBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFLO0FBQy9DLE1BQUksQ0FBQyxHQUFHLENBQUMsR0FBRztBQUNYLFFBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ2pCLE9BQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO0dBQ2hCLENBQUM7QUFDRixTQUFPLElBQUksQ0FBQztFQUNaLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDUDs7QUFFRCxTQUFTLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDaEQsS0FBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO0tBQ2hELE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDckMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUV6QyxLQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUNmLE9BQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN6Qjs7QUFFRCxLQUFJLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDeEIsY0FBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUMxRCxDQUFDLENBQUM7O0FBRUgsS0FBSSxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVmLEtBQUksZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqQyxLQUFJLGFBQWE7Ozs7Ozs7Ozs7SUFBRyxVQUFDLEdBQUcsRUFBc0I7TUFBcEIsR0FBRyxnQ0FBRyxJQUFJLEdBQUcsRUFBRTs7QUFDeEMsTUFBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDN0IsVUFBTztHQUNQOztBQUVELE1BQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsTUFBRyxDQUFDLElBQUksRUFBRTtBQUNULFNBQU0sSUFBSSxLQUFLLGNBQVksR0FBRyxvQ0FBaUMsQ0FBQztHQUNoRTtBQUNELE1BQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNoQixPQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2hFLFNBQU0sSUFBSSxLQUFLLGNBQVksR0FBRyxxQ0FBZ0MsSUFBSSxPQUFJLENBQUM7R0FDdkU7QUFDRCxLQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUViLE1BQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDcEIsVUFBTyxFQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUMxRCxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ25CLE9BQUcsRUFBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDMUIsVUFBTSxJQUFJLEtBQUssY0FBWSxHQUFHLG9DQUErQixHQUFHLE9BQUksQ0FBQztJQUNyRTs7QUFFRCxnQkFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ2pDLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEIsa0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzFCLENBQUEsQ0FBQztBQUNGLE1BQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1NBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQztFQUFBLENBQUMsQ0FBQzs7QUFFM0MsUUFBTyxLQUFLLENBQUM7Q0FDYjs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDN0IsUUFBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUM3Qjs7Ozs7Ozs7Ozs7Ozs7OztRQ3BRZSxPQUFPLEdBQVAsT0FBTzs7MEJBUkQsYUFBYTs7OztJQUVkLEtBQUs7QUFDZCxVQURTLEtBQUssR0FDWDt3QkFETSxLQUFLOztBQUV4Qiw2QkFGbUIsS0FBSyw2Q0FFbEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO0VBQ3BCOztXQUhtQixLQUFLOztRQUFMLEtBQUs7OztxQkFBTCxLQUFLOztBQU1uQixTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDN0IsUUFBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUNVZSxPQUFPLEdBQVAsT0FBTzs7MEJBcEJELGFBQWE7Ozs7c0JBQ2YsWUFBWTs7SUFBcEIsRUFBRTs7dUJBQ1EsaUJBQWlCOztJQUVsQixNQUFNO0FBQ2YsVUFEUyxNQUFNLE9BQ0g7TUFBVixPQUFPLFFBQVAsT0FBTzs7d0JBREEsTUFBTTs7QUFFekIsNkJBRm1CLE1BQU0sNkNBRW5CLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7QUFFcEIsTUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3BDOztXQUxtQixNQUFNOztjQUFOLE1BQU07O1NBT2xCLG9CQUFZO3FDQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDakIsVUFBTyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDdkM7OztPQUVlLFlBQUc7QUFDbEIsVUFBTyxJQUFJLENBQUMsT0FBTyxVQWRiLE9BQU8sQ0FjZSxDQUFDO0dBQzdCOzs7UUFibUIsTUFBTTs7O3FCQUFOLE1BQU07O0FBZ0JwQixTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDN0IsUUFBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN4Qjs7Ozs7Ozs7Ozs7Ozs7O3NCQ3RCbUIsWUFBWTs7SUFBcEIsRUFBRTs7dUJBQ1MsZUFBZTs7SUFBMUIsS0FBSzs7cUJBQ0csaUJBQWlCOztJQUVoQixTQUFTO0FBQ2xCLFVBRFMsU0FBUyxHQUNTOzBDQUFKLEVBQUU7O01BQXZCLE1BQU0sUUFBTixNQUFNO3VCQUFFLElBQUk7TUFBSixJQUFJLDZCQUFHLEVBQUU7O3dCQURWLFNBQVM7O0FBRTVCLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0VBQ2pCOztjQUptQixTQUFTOztPQU1yQixZQUFHO0FBQ1YsVUFBTyxJQUFJLFFBVEwsS0FBSyxDQVNPLENBQUM7R0FDbkI7T0FDTyxVQUFDLEdBQUcsRUFBRTtBQUNiLE9BQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBSztBQUNqRCxRQUFJLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsUUFBRyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFCLFNBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0FBQ0QsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNqQixXQUFPLElBQUksQ0FBQztJQUNaLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVAsT0FBSSxRQXJCRSxLQUFLLENBcUJBLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNsQzs7O1NBRVcsd0JBQVk7OztxQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ3JCLE9BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFZCxTQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDdkMsUUFBSSxJQUFJLEdBQUcsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsUUFBRyxPQUFPLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDN0IsU0FBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQy9CO0FBQ0QsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNqQixDQUFDLENBQUM7O0FBRUgsVUFBTyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3pCOzs7UUFsQ21CLFNBQVM7OztxQkFBVCxTQUFTOzs7Ozs7Ozs7UUNKZCxLQUFLLEdBQUwsS0FBSztRQVNMLEtBQUssR0FBTCxLQUFLO1FBY0wsVUFBVSxHQUFWLFVBQVU7O0FBdkJuQixTQUFTLEtBQUssR0FBRztBQUN2QixLQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsU0FBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDbkQsVUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDM0IsVUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7RUFDekIsQ0FBQyxDQUFDO0FBQ0gsUUFBTyxRQUFRLENBQUM7Q0FDaEI7O0FBRU0sU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQzFCLEtBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsS0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoQyxTQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNoQixDQUFDLENBQUM7O0FBRUgsUUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM3QyxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSztBQUNwQyxPQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFVBQU8sSUFBSSxDQUFDO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNQLENBQUMsQ0FBQztDQUNIOztBQUVNLFNBQVMsVUFBVSxDQUFDLENBQUMsRUFBRTtBQUM3QixRQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0NBQ2hCOzs7Ozs7OztRQ3ZCZSxRQUFRLEdBQVIsUUFBUTtRQWdCUixNQUFNLEdBQU4sTUFBTTtRQStCTixhQUFhLEdBQWIsYUFBYTs7dUJBakRQLGlCQUFpQjs7QUFFaEMsU0FBUyxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQzVCLEtBQUksT0FBTyxFQUFFLElBQUksVUFBVSxJQUFJLEVBQUUsVUFIMUIsT0FBTyxDQUc0QixZQUFZLEtBQUssRUFBRTtBQUM1RCxTQUFPLEVBQUUsQ0FBQztFQUNWOztBQUVELEtBQUksRUFBRSxZQUFZLEtBQUssRUFBRTtBQUN4QixNQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsSUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLElBQUUsVUFWSSxPQUFPLENBVUYsR0FBRyxNQUFNLENBQUM7QUFDckIsU0FBTyxFQUFFLENBQUM7RUFDVjs7QUFFRCxHQUFFLFVBZEssT0FBTyxDQWNILEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDO1NBQUssQ0FBQztFQUFBLENBQUMsQ0FBQztBQUNqRyxRQUFPLEVBQUUsQ0FBQztDQUNWOztBQUVNLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBYTs7O21DQUFSLE1BQU07QUFBTixRQUFNOzs7QUFDbkMsS0FBSSxDQUFDLEVBQUUsVUFuQkEsT0FBTyxDQW1CRSxFQUFFO0FBQ2pCLElBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDbEI7Ozs7QUFJRCxLQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUU7QUFDOUIsUUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuQjs7QUFFRCxLQUFJLFFBQVEsR0FBRyxFQUFFLFVBN0JWLE9BQU8sQ0E2QlksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRXhDLE1BQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQ25ELE9BQUcsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUN0QixXQUFPLElBQUksQ0FBQztJQUNaO0FBQ0QsVUFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkIsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFZCxNQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7QUFDNUIsU0FBTSxJQUFJLEtBQUssOEJBQTRCLElBQUksRUFBSSxFQUFFLENBQUMsQ0FBQztHQUN2RDtBQUNELFNBQU8sU0FBUyxDQUFDO0VBQ2pCLENBQUMsQ0FBQzs7QUFFSCxRQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzNDLFNBQU8sRUFBRSxDQUFDLEtBQUssUUFBTyxJQUFJLENBQUMsQ0FBQztFQUM1QixDQUFDLENBQUM7Q0FDSDs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxFQUFFLEVBQUU7QUFDakMsUUFBTyxBQUFDLE9BQU8sRUFBRSxJQUFJLFVBQVUsSUFBTSxFQUFFLFlBQVksS0FBSyxJQUFJLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxBQUFDLENBQUM7Q0FDcEc7Ozs7Ozs7O0FDbkRNLElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O1FBQWxCLEtBQUssR0FBTCxLQUFLO0FBRVgsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNwQyxJQUFHLEVBQUUsRUFBRTtBQUNQLEtBQUksRUFBRSxFQUFFO0FBQ1IsR0FBRSxFQUFFLEVBQUU7Q0FDTixDQUFDLENBQUM7UUFKVSxPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7QUNGYixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBNUIsT0FBTyxHQUFQLE9BQU87QUFDYixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFBeEIsS0FBSyxHQUFMLEtBQUs7QUFDWCxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBQXhCLEtBQUssR0FBTCxLQUFLO0FBRVgsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQXBDLFdBQVcsR0FBWCxXQUFXO0FBQ2pCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUE1QixPQUFPLEdBQVAsT0FBTztBQUNiLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7UUFBOUIsUUFBUSxHQUFSLFFBQVE7QUFFZCxJQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQTlDLGdCQUFnQixHQUFoQixnQkFBZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgc3ltYm9scyBmcm9tIFwiLi91dGlsL3N5bWJvbHNcIjtcbmltcG9ydCB7ZGVmYXVsdCBhcyBFcXVhdGlvblNldCwgZmFjdG9yeSBhcyBlcXVhdGlvblNldEZhY3Rvcnl9IGZyb20gXCIuL2NvcmUvRXF1YXRpb25TZXRcIjtcbmltcG9ydCB7ZGVmYXVsdCBhcyBJbnB1dCwgZmFjdG9yeSBhcyBpbnB1dEZhY3Rvcnl9IGZyb20gXCIuL2NvcmUvSW5wdXRcIjtcbmltcG9ydCB7ZGVmYXVsdCBhcyBPdXRwdXQsIGZhY3RvcnkgYXMgb3V0cHV0RmFjdG9yeX0gZnJvbSBcIi4vY29yZS9PdXRwdXRcIjtcbmltcG9ydCB7c3RvcmUsIHBsdWdpbnN9IGZyb20gXCIuL3V0aWwvc3RhdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmNyZWF0ZShwbHVnaW5zLmZuLCB7XG5cdGdldDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0dmFsdWU6IHN0b3JlLmdldC5iaW5kKHN0b3JlKVxuXHR9LFxuXHRoYXM6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBzdG9yZS5oYXMuYmluZChzdG9yZSlcblx0fSxcblxuXHRwbHVnaW5zOiB7XG5cdFx0dmFsdWU6IHBsdWdpbnNcblx0fSxcblxuXHRFcXVhdGlvblNldDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0dmFsdWU6IEVxdWF0aW9uU2V0XG5cdH0sXG5cdGVxdWF0aW9uU2V0OiB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHR2YWx1ZTogZXF1YXRpb25TZXRGYWN0b3J5XG5cdH0sXG5cblx0SW5wdXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBJbnB1dFxuXHR9LFxuXHRpbnB1dDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0dmFsdWU6IGlucHV0RmFjdG9yeVxuXHR9LFxuXG5cdE91dHB1dDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0dmFsdWU6IE91dHB1dFxuXHR9LFxuXHRvdXRwdXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBvdXRwdXRGYWN0b3J5XG5cdH0sXG5cblx0c3ltYm9sczoge1xuXHRcdHZhbHVlOiBPYmplY3QuZnJlZXplKHN5bWJvbHMpXG5cdH1cbn0pO1xuIiwiaW1wb3J0IElucHV0IGZyb20gXCIuL0lucHV0XCI7XG5pbXBvcnQgT3V0cHV0IGZyb20gXCIuL091dHB1dFwiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCB7JG5hbWUsICRpbmplY3Rpb25zLCAkaW5wdXRzLCAkb3V0cHV0cywgJGV2YWx1YXRpb25PcmRlcn0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuaW1wb3J0IHtzdG9yZSwgcGx1Z2luc30gZnJvbSBcIi4uL3V0aWwvc3RhdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXF1YXRpb25TZXQge1xuXHRjb25zdHJ1Y3Rvcih7bmFtZSA9IG51bGwsIGluamVjdGlvbnMgPSB7fSwgaW5wdXRzID0ge30sIG91dHB1dHMgPSB7fX0gPSB7fSkge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5pbmplY3Rpb25zID0gaW5qZWN0aW9ucztcblx0XHR0aGlzLmlucHV0cyA9IGlucHV0cztcblx0XHR0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJG5hbWVdO1xuXHR9XG5cdHNldCBuYW1lKG5hbWUpIHtcblx0XHRsZXQgcHJldk5hbWUgPSB0aGlzWyRuYW1lXTtcblx0XHRpZihwcmV2TmFtZSA9PT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmKHByZXZOYW1lICE9IG51bGwgJiYgc3RvcmUuaGFzKHByZXZOYW1lKSkge1xuXHRcdFx0c3RvcmUuZGVsZXRlKHByZXZOYW1lKTtcblx0XHR9XG5cdFx0aWYobmFtZSAhPSBudWxsKSB7XG5cdFx0XHRpZihzdG9yZS5oYXMobmFtZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcXVhdGlvbiBTZXQgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RzLmApO1xuXHRcdFx0fVxuXHRcdFx0c3RvcmUuc2V0KG5hbWUsIHRoaXMpO1xuXHRcdH1cblx0XHR0aGlzWyRuYW1lXSA9IG5hbWU7XG5cdH1cblxuXHRnZXQgaW5qZWN0aW9ucygpIHtcblx0XHRyZXR1cm4gdGhpc1skaW5qZWN0aW9uc107XG5cdH1cblx0c2V0IGluamVjdGlvbnMoaW5qZWN0aW9ucykge1xuXHRcdHRoaXNbJGluamVjdGlvbnNdID0gT2JqZWN0LmZyZWV6ZShpbmplY3Rpb25zKTtcblx0fVxuXG5cdGdldCBpbnB1dHMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJGlucHV0c107XG5cdH1cblx0c2V0IGlucHV0cyhpbnB1dHMpIHtcblx0XHRsZXQgY29udmVydCA9IChpdGVtKSA9PiB7XG5cdFx0XHRpZihpdGVtIGluc3RhbmNlb2YgSW5wdXQpIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgSW5wdXQoe1xuXHRcdFx0XHRcdHN5bWJvbDogaXRlbVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwib2JqZWN0XCIgJiYgaXRlbSAhPSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgSW5wdXQoaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IElucHV0KCk7XG5cdFx0fTtcblxuXHRcdGlmKGlucHV0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRpbnB1dHMgPSBpbnB1dHMucmVkdWNlKChtZW1vLCBpdGVtKSA9PiB7XG5cdFx0XHRcdGl0ZW0gPSBjb252ZXJ0KGl0ZW0pO1xuXHRcdFx0XHRtZW1vW2l0ZW0uc3ltYm9sXSA9IGl0ZW07XG5cblx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uc3ltYm9sICE9IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgc3ltYm9sICcke2l0ZW0uc3ltYm9sfSdgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpbnB1dHMgPSBPYmplY3Qua2V5cyhpbnB1dHMpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gY29udmVydChpbnB1dHNba2V5XSk7XG5cdFx0XHRcdGl0ZW0uc3ltYm9sID0ga2V5O1xuXHRcdFx0XHRtZW1vW2tleV0gPSBpdGVtO1xuXHRcdFx0XHRyZXR1cm4gbWVtbztcblx0XHRcdH0sIHt9KTtcblx0XHR9XG5cblx0XHR0aGlzWyRpbnB1dHNdID0gT2JqZWN0LmZyZWV6ZShpbnB1dHMpO1xuXHR9XG5cblx0Z2V0IG91dHB1dHMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJG91dHB1dHNdO1xuXHR9XG5cdHNldCBvdXRwdXRzKG91dHB1dHMpIHtcblx0XHRsZXQgY29udmVydCA9IChpdGVtKSA9PiB7XG5cdFx0XHRpZihpdGVtIGluc3RhbmNlb2YgT3V0cHV0KSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJmdW5jdGlvblwiIHx8IGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IE91dHB1dCh7XG5cdFx0XHRcdFx0Zm9ybXVsYTogaXRlbVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgT3V0cHV0KGl0ZW0pO1xuXHRcdH07XG5cblxuXHRcdGlmKG91dHB1dHMgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0b3V0cHV0cyA9IG91dHB1dHMucmVkdWNlKChtZW1vLCBpdGVtKSA9PiB7XG5cdFx0XHRcdGl0ZW0gPSBjb252ZXJ0KGl0ZW0pO1xuXHRcdFx0XHRtZW1vW2l0ZW0uc3ltYm9sXSA9IGl0ZW07XG5cblx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uc3ltYm9sICE9IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgb3V0cHV0IHN5bWJvbCAnJHtpdGVtLnN5bWJvbH0nYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWVtbztcblx0XHRcdH0sIHt9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3V0cHV0cyA9IE9iamVjdC5rZXlzKG91dHB1dHMpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gY29udmVydChvdXRwdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWVtb1trZXldID0gaXRlbTtcblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9LCB7fSk7XG5cdFx0fVxuXG5cdFx0dGhpc1skb3V0cHV0c10gPSBPYmplY3QuZnJlZXplKG91dHB1dHMpO1xuXHRcdHRoaXNbJGV2YWx1YXRpb25PcmRlcl0gPSBudWxsO1xuXHR9XG5cblx0Z2V0IGV2YWx1YXRpb25PcmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFdmFsdWF0aW9uT3JkZXIoKTtcblx0fVxuXG5cdGdldEV2YWx1YXRpb25PcmRlciguLi5ldmFscykge1xuXHRcdGlmKGV2YWxzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdGV2YWxzID0gZXZhbHNbMF07XG5cdFx0fVxuXHRcdGV2YWxzID0gbmV3IFNldChldmFscyk7XG5cblx0XHRpZih0aGlzWyRldmFsdWF0aW9uT3JkZXJdID09IG51bGwpIHtcblx0XHRcdHRoaXNbJGV2YWx1YXRpb25PcmRlcl0gPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0bGV0IGNhY2hlS2V5ID0gQXJyYXkuZnJvbShldmFscykuam9pbigpLFxuXHRcdFx0Y2FjaGUgPSB0aGlzWyRldmFsdWF0aW9uT3JkZXJdLmdldChjYWNoZUtleSk7XG5cdFx0aWYoY2FjaGUpIHtcblx0XHRcdHJldHVybiBjYWNoZTtcblx0XHR9XG5cdFx0Y2FjaGUgPSByZXNvbHZlRXZhbHVhdGlvbk9yZGVyKHRoaXMsIGV2YWxzKTtcblx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdLnNldChjYWNoZUtleSwgY2FjaGUpO1xuXG5cdFx0cmV0dXJuIGNhY2hlO1xuXHR9XG5cblx0ZXZhbHVhdGUocmF3SW5zLCAuLi5ldmFscykge1xuXHRcdGxldCBwcmVQcm9taXNlID0gYXN5bmMucHJvcHMocmF3SW5zKTtcblx0XHRwbHVnaW5zLnByZS5mb3JFYWNoKChwbHVnaW4pID0+IHtcblx0XHRcdHByZVByb21pc2UgPSBwcmVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcblx0XHRcdFx0cmV0dXJuIHBsdWdpbi5jYWxsKHRoaXMsIGRhdGEpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRsZXQgcG9zdFByb21pc2UgPSBwcmVQcm9taXNlLnRoZW4oKGlucykgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuZXZhbHVhdGVSYXcuYXBwbHkodGhpcywgW10uY29uY2F0KFtpbnNdKS5jb25jYXQoZXZhbHMpKTtcblx0XHR9KTtcblx0XHRwbHVnaW5zLnBvc3QuZm9yRWFjaCgocGx1Z2luKSA9PiB7XG5cdFx0XHRwb3N0UHJvbWlzZSA9IHBvc3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcblx0XHRcdFx0cmV0dXJuIHBsdWdpbi5jYWxsKHRoaXMsIGRhdGEpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcG9zdFByb21pc2U7XG5cdH1cblxuXHRldmFsdWF0ZVJhdyhpbnMsIC4uLmV2YWxzKSB7XG5cdFx0bGV0IGluamVjdGlvbnMgPSB0aGlzLmluamVjdGlvbnMsXG5cdFx0XHRpbnB1dHMgPSB0aGlzLmlucHV0cyxcblx0XHRcdG91dHB1dHMgPSB0aGlzLm91dHB1dHM7XG5cblx0XHRsZXQgb3V0cyA9IHt9O1xuXHRcdHRoaXMuZ2V0RXZhbHVhdGlvbk9yZGVyLmFwcGx5KHRoaXMsIGV2YWxzKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdG91dHNba2V5XSA9IG91dHB1dHNba2V5XS5ldmFsdWF0ZShpbmplY3Rpb25zLCBpbnMsIG91dHMpO1xuXHRcdH0pO1xuXG5cdFx0bGV0IGluTWV0YXMgPSB7fTtcblx0XHRPYmplY3Qua2V5cyhpbnMpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0aW5NZXRhc1trZXldID0gaW5wdXRzW2tleV0uZXZhbHVhdGVNZXRhKGluamVjdGlvbnMsIGlucywgb3V0cyk7XG5cdFx0fSk7XG5cblx0XHRsZXQgb3V0TWV0YXMgPSB7fTtcblx0XHRPYmplY3Qua2V5cyhvdXRzKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdG91dE1ldGFzW2tleV0gPSBvdXRwdXRzW2tleV0uZXZhbHVhdGVNZXRhKGluamVjdGlvbnMsIGlucywgb3V0cyk7XG5cdFx0fSk7XG5cblxuXHRcdHJldHVybiBhc3luYy5wcm9wcyh7XG5cdFx0XHRpbnB1dHM6IGFzeW5jLnByb3BzKGlucyksXG5cdFx0XHRvdXRwdXRzOiBhc3luYy5wcm9wcyhvdXRzKSxcblx0XHRcdG1ldGFzOiBhc3luYy5wcm9wcyh7XG5cdFx0XHRcdGlucHV0czogYXN5bmMucHJvcHMoaW5NZXRhcyksXG5cdFx0XHRcdG91dHB1dHM6IGFzeW5jLnByb3BzKG91dE1ldGFzKVxuXHRcdFx0fSlcblx0XHR9KS50aGVuKChkYXRhKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnB1dHM6IHBhY2thZ2VSZXN1bHQoZGF0YS5pbnB1dHMsIGRhdGEubWV0YXMuaW5wdXRzKSxcblx0XHRcdFx0b3V0cHV0czogcGFja2FnZVJlc3VsdChkYXRhLm91dHB1dHMsIGRhdGEubWV0YXMub3V0cHV0cylcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFja2FnZVJlc3VsdChpdGVtcywgbWV0YXMpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1zKS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdG1lbW9ba2V5XSA9IHtcblx0XHRcdHZhbHVlOiBpdGVtc1trZXldLFxuXHRcdFx0bWV0YTogbWV0YXNba2V5XVxuXHRcdH07XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUV2YWx1YXRpb25PcmRlcihlcXVhdGlvbiwgZXZhbHMpIHtcblx0bGV0IGluamVjdGlvbnMgPSBPYmplY3Qua2V5cyhlcXVhdGlvbi5pbmplY3Rpb25zKSxcblx0XHRpbnB1dHMgPSBPYmplY3Qua2V5cyhlcXVhdGlvbi5pbnB1dHMpLFxuXHRcdG91dHB1dHMgPSBPYmplY3Qua2V5cyhlcXVhdGlvbi5vdXRwdXRzKTtcblxuXHRpZighZXZhbHMuc2l6ZSkge1xuXHRcdGV2YWxzID0gbmV3IFNldChvdXRwdXRzKTtcblx0fVxuXG5cdGxldCBkZXBlbmRlbmNpZXMgPSBuZXcgTWFwKCk7XG5cdG91dHB1dHMuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0ZGVwZW5kZW5jaWVzLnNldChrZXksIGVxdWF0aW9uLm91dHB1dHNba2V5XS5kZXBlbmRlbmNpZXMpO1xuXHR9KTtcblxuXHRsZXQgb3JkZXIgPSBbXTtcblxuXHRsZXQgcHJvY2Vzc2VkT3V0cHV0cyA9IG5ldyBTZXQoKTtcblx0bGV0IHByb2Nlc3NPdXRwdXQgPSAoa2V5LCBzZXQgPSBuZXcgU2V0KCkpID0+IHtcblx0XHRpZihwcm9jZXNzZWRPdXRwdXRzLmhhcyhrZXkpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGRlcHMgPSBkZXBlbmRlbmNpZXMuZ2V0KGtleSk7XG5cdFx0aWYoIWRlcHMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgT3V0cHV0ICcke2tleX0nIG5vdCBkZWZpbmVkIGluIGVxdWF0aW9ucyBzZXRgKTtcblx0XHR9XG5cdFx0aWYoc2V0LmhhcyhrZXkpKSB7XG5cdFx0XHRsZXQgcGF0aCA9IEFycmF5LmZyb20oc2V0LnZhbHVlcygpKS5qb2luKFwiIC0+IFwiKSArIFwiIC0+IFwiICsga2V5O1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgJyR7a2V5fScgaGFzIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSAnJHtwYXRofSdgKTtcblx0XHR9XG5cdFx0c2V0LmFkZChrZXkpO1xuXG5cdFx0ZGVwcy5maWx0ZXIoKGRlcCkgPT4ge1xuXHRcdFx0cmV0dXJuICF+aW5qZWN0aW9ucy5pbmRleE9mKGRlcCkgJiYgIX5pbnB1dHMuaW5kZXhPZihkZXApO1xuXHRcdH0pLmZvckVhY2goKGRlcCkgPT4ge1xuXHRcdFx0aWYoIX5vdXRwdXRzLmluZGV4T2YoZGVwKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE91dHB1dCAnJHtrZXl9JyBoYXMgYSBtaXNzaW5nIGRlcGVuZGVuY3kgJyR7ZGVwfSdgKTtcblx0XHRcdH1cblxuXHRcdFx0cHJvY2Vzc091dHB1dChkZXAsIG5ldyBTZXQoc2V0KSk7XG5cdFx0fSk7XG5cdFx0b3JkZXIucHVzaChrZXkpO1xuXHRcdHByb2Nlc3NlZE91dHB1dHMuYWRkKGtleSk7XG5cdH07XG5cdGV2YWxzLmZvckVhY2goKGtleSkgPT4gcHJvY2Vzc091dHB1dChrZXkpKTtcblxuXHRyZXR1cm4gb3JkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3J5KG9wdHMpIHtcblx0cmV0dXJuIG5ldyBFcXVhdGlvblNldChvcHRzKTtcbn1cbiIsImltcG9ydCBQYXJhbWV0ZXIgZnJvbSBcIi4vUGFyYW1ldGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IGV4dGVuZHMgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoYXJndW1lbnRzWzBdKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yeShvcHRzKSB7XG5cdHJldHVybiBuZXcgSW5wdXQob3B0cyk7XG59XG4iLCJpbXBvcnQgUGFyYW1ldGVyIGZyb20gXCIuL1BhcmFtZXRlclwiO1xuaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCB7JGluamVjdH0gZnJvbSBcIi4uL3V0aWwvc3ltYm9sc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3Rvcih7Zm9ybXVsYX0pIHtcblx0XHRzdXBlcihhcmd1bWVudHNbMF0pO1xuXG5cdFx0dGhpcy5mb3JtdWxhID0gZGkuYW5ub3RhdGUoZm9ybXVsYSk7XG5cdH1cblxuXHRldmFsdWF0ZSguLi5zdG9yZXMpIHtcblx0XHRyZXR1cm4gZGkuaW5qZWN0KHRoaXMuZm9ybXVsYSwgc3RvcmVzKTtcblx0fVxuXG5cdGdldCBkZXBlbmRlbmNpZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZm9ybXVsYVskaW5qZWN0XTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yeShvcHRzKSB7XG5cdHJldHVybiBuZXcgT3V0cHV0KG9wdHMpO1xufVxuIiwiaW1wb3J0ICogYXMgZGkgZnJvbSBcIi4uL3V0aWwvZGlcIjtcbmltcG9ydCAqIGFzIGFzeW5jIGZyb20gXCIuLi91dGlsL2FzeW5jXCI7XG5pbXBvcnQgeyRtZXRhfSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKHtzeW1ib2wsIG1ldGEgPSB7fX0gPSB7fSkge1xuXHRcdHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuXHRcdHRoaXMubWV0YSA9IG1ldGE7XG5cdH1cblxuXHRnZXQgbWV0YSgpIHtcblx0XHRyZXR1cm4gdGhpc1skbWV0YV07XG5cdH1cblx0c2V0IG1ldGEocmF3KSB7XG5cdFx0bGV0IG1ldGEgPSBPYmplY3Qua2V5cyhyYXcpLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG5cdFx0XHRsZXQgaXRlbSA9IHJhd1trZXldO1xuXHRcdFx0aWYoZGkuaXNBbm5vdGF0YWJsZShpdGVtKSkge1xuXHRcdFx0XHRpdGVtID0gZGkuYW5ub3RhdGUoaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRtZW1vW2tleV0gPSBpdGVtO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXG5cdFx0dGhpc1skbWV0YV0gPSBPYmplY3QuZnJlZXplKG1ldGEpO1xuXHR9XG5cblx0ZXZhbHVhdGVNZXRhKC4uLnN0b3Jlcykge1xuXHRcdGxldCBtZXRhID0ge307XG5cblx0XHRPYmplY3Qua2V5cyh0aGlzLm1ldGEpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bGV0IGl0ZW0gPSB0aGlzLm1ldGFba2V5XTtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRpdGVtID0gZGkuaW5qZWN0KGl0ZW0sIHN0b3Jlcyk7XG5cdFx0XHR9XG5cdFx0XHRtZXRhW2tleV0gPSBpdGVtO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFzeW5jLnByb3BzKG1ldGEpO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmZXIoKSB7XG5cdGxldCBkZWZlcnJlZCA9IHt9O1xuXHRkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcblx0fSk7XG5cdHJldHVybiBkZWZlcnJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKG9iaikge1xuXHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cdGxldCBwcm9taXNlcyA9IGtleXMubWFwKChrZXkpID0+IHtcblx0XHRyZXR1cm4gb2JqW2tleV07XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigodmFsdWVzKSA9PiB7XG5cdFx0cmV0dXJuIGtleXMucmVkdWNlKChtZW1vLCBrZXksIGkpID0+IHtcblx0XHRcdG1lbW9ba2V5XSA9IHZhbHVlc1tpXTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH0sIHt9KTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RoZW5hYmxlKHApIHtcblx0cmV0dXJuICEhcC50aGVuO1xufVxuIiwiaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0ZShmbikge1xuXHRpZiAodHlwZW9mIGZuID09IFwiZnVuY3Rpb25cIiAmJiBmblskaW5qZWN0XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0cmV0dXJuIGZuO1xuXHR9XG5cblx0aWYgKGZuIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRsZXQgZmllbGRzID0gZm47XG5cdFx0Zm4gPSBmbi5wb3AoKTtcblx0XHRmblskaW5qZWN0XSA9IGZpZWxkcztcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRmblskaW5qZWN0XSA9IGZuLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvbiAuKj9cXCgoLio/KVxcKS8pWzFdLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoKGEpID0+IGEpO1xuXHRyZXR1cm4gZm47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoZm4sIC4uLnN0b3Jlcykge1xuXHRpZiAoIWZuWyRpbmplY3RdKSB7XG5cdFx0Zm4gPSBhbm5vdGF0ZShmbik7XG5cdH1cblxuXHQvLyBUT0RPOiBTdXBwb3J0IGZ1bmN0aW9uIGFyZ3VtZW50IGRlc3RydWN0dXJlIHN5bnRheCB3aXRoIG5hdGl2ZSwgYmFiZWwsIGFuZCB0cmFjZXVyXG5cblx0aWYoc3RvcmVzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRzdG9yZXMgPSBzdG9yZXNbMF07XG5cdH1cblxuXHRsZXQgcHJvbWlzZXMgPSBmblskaW5qZWN0XS5tYXAoKG5hbWUpID0+IHtcblx0XHQvLyBSZXBsYWNlIHRoaXMgd2l0aCBcImZpbmRcIiB3aGVuIHRoYXQgaXMgcmVhZHlcblx0XHRsZXQgaW5qZWN0aW9uID0gc3RvcmVzLnJlZHVjZVJpZ2h0KChpdGVtLCBzdG9yZSkgPT4ge1xuXHRcdFx0aWYoaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0b3JlW25hbWVdO1xuXHRcdH0sIHVuZGVmaW5lZCk7XG5cblx0XHRpZiAoaW5qZWN0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZGVwZW5kZW5jeTogJHtuYW1lfWAsIGZuKTtcblx0XHR9XG5cdFx0cmV0dXJuIGluamVjdGlvbjtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKChhcmdzKSA9PiB7XG5cdFx0cmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5ub3RhdGFibGUoZm4pIHtcblx0cmV0dXJuICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiKSB8fCAoZm4gaW5zdGFuY2VvZiBBcnJheSAmJiB0eXBlb2YgZm5bZm4ubGVuZ3RoIC0gMV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cbiIsImV4cG9ydCBjb25zdCBzdG9yZSA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGNvbnN0IHBsdWdpbnMgPSBPYmplY3QuZnJlZXplKHtcblx0cHJlOiBbXSxcblx0cG9zdDogW10sXG5cdGZuOiB7fVxufSk7XG4iLCJleHBvcnQgY29uc3QgJGluamVjdCA9IFN5bWJvbChcIiRpbmplY3RcIik7XG5leHBvcnQgY29uc3QgJG1ldGEgPSBTeW1ib2woXCIkbWV0YVwiKTtcbmV4cG9ydCBjb25zdCAkbmFtZSA9IFN5bWJvbChcIiRuYW1lXCIpO1xuXG5leHBvcnQgY29uc3QgJGluamVjdGlvbnMgPSBTeW1ib2woXCIkaW5qZWN0aW9uc1wiKTtcbmV4cG9ydCBjb25zdCAkaW5wdXRzID0gU3ltYm9sKFwiJGlucHV0c1wiKTtcbmV4cG9ydCBjb25zdCAkb3V0cHV0cyA9IFN5bWJvbChcIiRvdXRwdXRzXCIpO1xuXG5leHBvcnQgY29uc3QgJGV2YWx1YXRpb25PcmRlciA9IFN5bWJvbChcIiRldmFsdWF0aW9uT3JkZXJcIik7XG4iXX0=
