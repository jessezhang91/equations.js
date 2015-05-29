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

			var pickedIns = pickKeys(rawIns, Object.keys(this.inputs));

			var prePromise = async.props(pickedIns);
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
		value: function evaluateRaw(rawIns) {
			for (var _len3 = arguments.length, evals = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				evals[_key3 - 1] = arguments[_key3];
			}

			var ins = pickKeys(rawIns, Object.keys(this.inputs));

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

function pickKeys(item, keys) {
	return keys.reduce(function (memo, key) {
		memo[key] = item[key];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL2luZGV4LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0VxdWF0aW9uU2V0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL0lucHV0LmpzIiwiRzovUHJvamVjdHMvUGVyc29uYWwvZXF1YXRpb25zLmpzL3NyYy9jb3JlL091dHB1dC5qcyIsIkc6L1Byb2plY3RzL1BlcnNvbmFsL2VxdWF0aW9ucy5qcy9zcmMvY29yZS9QYXJhbWV0ZXIuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvYXN5bmMuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvZGkuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3RhdGUuanMiLCJHOi9Qcm9qZWN0cy9QZXJzb25hbC9lcXVhdGlvbnMuanMvc3JjL3V0aWwvc3ltYm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7c0JDQXlCLGdCQUFnQjs7SUFBN0IsT0FBTzs7OENBQ2lELG9CQUFvQjs7OztrQ0FDaEMsY0FBYzs7OztvQ0FDWixlQUFlOzs7OzZCQUM1QyxjQUFjOztxQkFFNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUZkLE9BQU8sQ0FFZSxFQUFFLEVBQUU7QUFDeEMsSUFBRyxFQUFFO0FBQ0osWUFBVSxFQUFFLElBQUk7QUFDaEIsT0FBSyxFQUFFLGVBTEQsS0FBSyxDQUtFLEdBQUcsQ0FBQyxJQUFJLGdCQUxmLEtBQUssQ0FLaUI7RUFDNUI7QUFDRCxJQUFHLEVBQUU7QUFDSixZQUFVLEVBQUUsSUFBSTtBQUNo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QUFDcEMsSUFBRyxFQUFFLEVBQUU7QUFDUCxLQUFJLEVBQUUsRUFBRTtBQUNSLEdBQUUsRUFBRSxFQUFFO0NBQ04sQ0FBQyxDQUFDO1FBSlUsT0FBTyxHQUFQLE9BQU87Ozs7Ozs7O0FDRmIsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQTVCLE9BQU8sR0FBUCxPQUFPO0FBQ2IsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQXhCLEtBQUssR0FBTCxLQUFLO0FBQ1gsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztRQUF4QixLQUFLLEdBQUwsS0FBSztBQUVYLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUFwQyxXQUFXLEdBQVgsV0FBVztBQUNqQixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBNUIsT0FBTyxHQUFQLE9BQU87QUFDYixJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O1FBQTlCLFFBQVEsR0FBUixRQUFRO0FBRWQsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUE5QyxnQkFBZ0IsR0FBaEIsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIHN5bWJvbHMgZnJvbSBcIi4vdXRpbC9zeW1ib2xzXCI7XG5pbXBvcnQge2RlZmF1bHQgYXMgRXF1YXRpb25TZXQsIGZhY3RvcnkgYXMgZXF1YXRpb25TZXRGYWN0b3J5fSBmcm9tIFwiLi9jb3JlL0VxdWF0aW9uU2V0XCI7XG5pbXBvcnQge2RlZmF1bHQgYXMgSW5wdXQsIGZhY3RvcnkgYXMgaW5wdXRGYWN0b3J5fSBmcm9tIFwiLi9jb3JlL0lucHV0XCI7XG5pbXBvcnQge2RlZmF1bHQgYXMgT3V0cHV0LCBmYWN0b3J5IGFzIG91dHB1dEZhY3Rvcnl9IGZyb20gXCIuL2NvcmUvT3V0cHV0XCI7XG5pbXBvcnQge3N0b3JlLCBwbHVnaW5zfSBmcm9tIFwiLi91dGlsL3N0YXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IE9iamVjdC5jcmVhdGUocGx1Z2lucy5mbiwge1xuXHRnZXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBzdG9yZS5nZXQuYmluZChzdG9yZSlcblx0fSxcblx0aGFzOiB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHR2YWx1ZTogc3RvcmUuaGFzLmJpbmQoc3RvcmUpXG5cdH0sXG5cblx0cGx1Z2luczoge1xuXHRcdHZhbHVlOiBwbHVnaW5zXG5cdH0sXG5cblx0RXF1YXRpb25TZXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBFcXVhdGlvblNldFxuXHR9LFxuXHRlcXVhdGlvblNldDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0dmFsdWU6IGVxdWF0aW9uU2V0RmFjdG9yeVxuXHR9LFxuXG5cdElucHV0OiB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHR2YWx1ZTogSW5wdXRcblx0fSxcblx0aW5wdXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBpbnB1dEZhY3Rvcnlcblx0fSxcblxuXHRPdXRwdXQ6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHZhbHVlOiBPdXRwdXRcblx0fSxcblx0b3V0cHV0OiB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHR2YWx1ZTogb3V0cHV0RmFjdG9yeVxuXHR9LFxuXG5cdHN5bWJvbHM6IHtcblx0XHR2YWx1ZTogT2JqZWN0LmZyZWV6ZShzeW1ib2xzKVxuXHR9XG59KTtcbiIsImltcG9ydCBJbnB1dCBmcm9tIFwiLi9JbnB1dFwiO1xuaW1wb3J0IE91dHB1dCBmcm9tIFwiLi9PdXRwdXRcIjtcbmltcG9ydCAqIGFzIGFzeW5jIGZyb20gXCIuLi91dGlsL2FzeW5jXCI7XG5pbXBvcnQgeyRuYW1lLCAkaW5qZWN0aW9ucywgJGlucHV0cywgJG91dHB1dHMsICRldmFsdWF0aW9uT3JkZXJ9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcbmltcG9ydCB7c3RvcmUsIHBsdWdpbnN9IGZyb20gXCIuLi91dGlsL3N0YXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWF0aW9uU2V0IHtcblx0Y29uc3RydWN0b3Ioe25hbWUgPSBudWxsLCBpbmplY3Rpb25zID0ge30sIGlucHV0cyA9IHt9LCBvdXRwdXRzID0ge319ID0ge30pIHtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuaW5qZWN0aW9ucyA9IGluamVjdGlvbnM7XG5cdFx0dGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cdFx0dGhpcy5vdXRwdXRzID0gb3V0cHV0cztcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiB0aGlzWyRuYW1lXTtcblx0fVxuXHRzZXQgbmFtZShuYW1lKSB7XG5cdFx0bGV0IHByZXZOYW1lID0gdGhpc1skbmFtZV07XG5cdFx0aWYocHJldk5hbWUgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZihwcmV2TmFtZSAhPSBudWxsICYmIHN0b3JlLmhhcyhwcmV2TmFtZSkpIHtcblx0XHRcdHN0b3JlLmRlbGV0ZShwcmV2TmFtZSk7XG5cdFx0fVxuXHRcdGlmKG5hbWUgIT0gbnVsbCkge1xuXHRcdFx0aWYoc3RvcmUuaGFzKG5hbWUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXF1YXRpb24gU2V0ICcke25hbWV9JyBhbHJlYWR5IGV4aXN0cy5gKTtcblx0XHRcdH1cblx0XHRcdHN0b3JlLnNldChuYW1lLCB0aGlzKTtcblx0XHR9XG5cdFx0dGhpc1skbmFtZV0gPSBuYW1lO1xuXHR9XG5cblx0Z2V0IGluamVjdGlvbnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbJGluamVjdGlvbnNdO1xuXHR9XG5cdHNldCBpbmplY3Rpb25zKGluamVjdGlvbnMpIHtcblx0XHR0aGlzWyRpbmplY3Rpb25zXSA9IE9iamVjdC5mcmVlemUoaW5qZWN0aW9ucyk7XG5cdH1cblxuXHRnZXQgaW5wdXRzKCkge1xuXHRcdHJldHVybiB0aGlzWyRpbnB1dHNdO1xuXHR9XG5cdHNldCBpbnB1dHMoaW5wdXRzKSB7XG5cdFx0bGV0IGNvbnZlcnQgPSAoaXRlbSkgPT4ge1xuXHRcdFx0aWYoaXRlbSBpbnN0YW5jZW9mIElucHV0KSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IElucHV0KHtcblx0XHRcdFx0XHRzeW1ib2w6IGl0ZW1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcIm9iamVjdFwiICYmIGl0ZW0gIT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IElucHV0KGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBJbnB1dCgpO1xuXHRcdH07XG5cblx0XHRpZihpbnB1dHMgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0aW5wdXRzID0gaW5wdXRzLnJlZHVjZSgobWVtbywgaXRlbSkgPT4ge1xuXHRcdFx0XHRpdGVtID0gY29udmVydChpdGVtKTtcblx0XHRcdFx0bWVtb1tpdGVtLnN5bWJvbF0gPSBpdGVtO1xuXG5cdFx0XHRcdGlmKHR5cGVvZiBpdGVtLnN5bWJvbCAhPSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IHN5bWJvbCAnJHtpdGVtLnN5bWJvbH0nYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWVtbztcblx0XHRcdH0sIHt9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aW5wdXRzID0gT2JqZWN0LmtleXMoaW5wdXRzKS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgaXRlbSA9IGNvbnZlcnQoaW5wdXRzW2tleV0pO1xuXHRcdFx0XHRpdGVtLnN5bWJvbCA9IGtleTtcblx0XHRcdFx0bWVtb1trZXldID0gaXRlbTtcblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9LCB7fSk7XG5cdFx0fVxuXG5cdFx0dGhpc1skaW5wdXRzXSA9IE9iamVjdC5mcmVlemUoaW5wdXRzKTtcblx0fVxuXG5cdGdldCBvdXRwdXRzKCkge1xuXHRcdHJldHVybiB0aGlzWyRvdXRwdXRzXTtcblx0fVxuXHRzZXQgb3V0cHV0cyhvdXRwdXRzKSB7XG5cdFx0bGV0IGNvbnZlcnQgPSAoaXRlbSkgPT4ge1xuXHRcdFx0aWYoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwiZnVuY3Rpb25cIiB8fCBpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBPdXRwdXQoe1xuXHRcdFx0XHRcdGZvcm11bGE6IGl0ZW1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IE91dHB1dChpdGVtKTtcblx0XHR9O1xuXG5cblx0XHRpZihvdXRwdXRzIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdG91dHB1dHMgPSBvdXRwdXRzLnJlZHVjZSgobWVtbywgaXRlbSkgPT4ge1xuXHRcdFx0XHRpdGVtID0gY29udmVydChpdGVtKTtcblx0XHRcdFx0bWVtb1tpdGVtLnN5bWJvbF0gPSBpdGVtO1xuXG5cdFx0XHRcdGlmKHR5cGVvZiBpdGVtLnN5bWJvbCAhPSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG91dHB1dCBzeW1ib2wgJyR7aXRlbS5zeW1ib2x9J2ApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0XHR9LCB7fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dHB1dHMgPSBPYmplY3Qua2V5cyhvdXRwdXRzKS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdFx0XHRsZXQgaXRlbSA9IGNvbnZlcnQob3V0cHV0c1trZXldKTtcblx0XHRcdFx0aXRlbS5zeW1ib2wgPSBrZXk7XG5cdFx0XHRcdG1lbW9ba2V5XSA9IGl0ZW07XG5cdFx0XHRcdHJldHVybiBtZW1vO1xuXHRcdFx0fSwge30pO1xuXHRcdH1cblxuXHRcdHRoaXNbJG91dHB1dHNdID0gT2JqZWN0LmZyZWV6ZShvdXRwdXRzKTtcblx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbnVsbDtcblx0fVxuXG5cdGdldCBldmFsdWF0aW9uT3JkZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RXZhbHVhdGlvbk9yZGVyKCk7XG5cdH1cblxuXHRnZXRFdmFsdWF0aW9uT3JkZXIoLi4uZXZhbHMpIHtcblx0XHRpZihldmFsc1swXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRldmFscyA9IGV2YWxzWzBdO1xuXHRcdH1cblx0XHRldmFscyA9IG5ldyBTZXQoZXZhbHMpO1xuXG5cdFx0aWYodGhpc1skZXZhbHVhdGlvbk9yZGVyXSA9PSBudWxsKSB7XG5cdFx0XHR0aGlzWyRldmFsdWF0aW9uT3JkZXJdID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGxldCBjYWNoZUtleSA9IEFycmF5LmZyb20oZXZhbHMpLmpvaW4oKSxcblx0XHRcdGNhY2hlID0gdGhpc1skZXZhbHVhdGlvbk9yZGVyXS5nZXQoY2FjaGVLZXkpO1xuXHRcdGlmKGNhY2hlKSB7XG5cdFx0XHRyZXR1cm4gY2FjaGU7XG5cdFx0fVxuXHRcdGNhY2hlID0gcmVzb2x2ZUV2YWx1YXRpb25PcmRlcih0aGlzLCBldmFscyk7XG5cdFx0dGhpc1skZXZhbHVhdGlvbk9yZGVyXS5zZXQoY2FjaGVLZXksIGNhY2hlKTtcblxuXHRcdHJldHVybiBjYWNoZTtcblx0fVxuXG5cdGV2YWx1YXRlKHJhd0lucywgLi4uZXZhbHMpIHtcblx0XHRsZXQgcGlja2VkSW5zID0gcGlja0tleXMocmF3SW5zLCBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykpO1xuXG5cdFx0bGV0IHByZVByb21pc2UgPSBhc3luYy5wcm9wcyhwaWNrZWRJbnMpO1xuXHRcdHBsdWdpbnMucHJlLmZvckVhY2goKHBsdWdpbikgPT4ge1xuXHRcdFx0cHJlUHJvbWlzZSA9IHByZVByb21pc2UudGhlbigoZGF0YSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gcGx1Z2luLmNhbGwodGhpcywgZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGxldCBwb3N0UHJvbWlzZSA9IHByZVByb21pc2UudGhlbigoaW5zKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ldmFsdWF0ZVJhdy5hcHBseSh0aGlzLCBbXS5jb25jYXQoW2luc10pLmNvbmNhdChldmFscykpO1xuXHRcdH0pO1xuXHRcdHBsdWdpbnMucG9zdC5mb3JFYWNoKChwbHVnaW4pID0+IHtcblx0XHRcdHBvc3RQcm9taXNlID0gcG9zdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gcGx1Z2luLmNhbGwodGhpcywgZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwb3N0UHJvbWlzZTtcblx0fVxuXG5cdGV2YWx1YXRlUmF3KHJhd0lucywgLi4uZXZhbHMpIHtcblx0XHRsZXQgaW5zID0gcGlja0tleXMocmF3SW5zLCBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykpO1xuXG5cdFx0bGV0IGluamVjdGlvbnMgPSB0aGlzLmluamVjdGlvbnMsXG5cdFx0XHRpbnB1dHMgPSB0aGlzLmlucHV0cyxcblx0XHRcdG91dHB1dHMgPSB0aGlzLm91dHB1dHM7XG5cblx0XHRsZXQgb3V0cyA9IHt9O1xuXHRcdHRoaXMuZ2V0RXZhbHVhdGlvbk9yZGVyLmFwcGx5KHRoaXMsIGV2YWxzKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdG91dHNba2V5XSA9IG91dHB1dHNba2V5XS5ldmFsdWF0ZShpbmplY3Rpb25zLCBpbnMsIG91dHMpO1xuXHRcdH0pO1xuXG5cdFx0bGV0IGluTWV0YXMgPSB7fTtcblx0XHRPYmplY3Qua2V5cyhpbnMpLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0aW5NZXRhc1trZXldID0gaW5wdXRzW2tleV0uZXZhbHVhdGVNZXRhKGluamVjdGlvbnMsIGlucywgb3V0cyk7XG5cdFx0fSk7XG5cblx0XHRsZXQgb3V0TWV0YXMgPSB7fTtcblx0XHRPYmplY3Qua2V5cyhvdXRzKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdG91dE1ldGFzW2tleV0gPSBvdXRwdXRzW2tleV0uZXZhbHVhdGVNZXRhKGluamVjdGlvbnMsIGlucywgb3V0cyk7XG5cdFx0fSk7XG5cblxuXHRcdHJldHVybiBhc3luYy5wcm9wcyh7XG5cdFx0XHRpbnB1dHM6IGFzeW5jLnByb3BzKGlucyksXG5cdFx0XHRvdXRwdXRzOiBhc3luYy5wcm9wcyhvdXRzKSxcblx0XHRcdG1ldGFzOiBhc3luYy5wcm9wcyh7XG5cdFx0XHRcdGlucHV0czogYXN5bmMucHJvcHMoaW5NZXRhcyksXG5cdFx0XHRcdG91dHB1dHM6IGFzeW5jLnByb3BzKG91dE1ldGFzKVxuXHRcdFx0fSlcblx0XHR9KS50aGVuKChkYXRhKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnB1dHM6IHBhY2thZ2VSZXN1bHQoZGF0YS5pbnB1dHMsIGRhdGEubWV0YXMuaW5wdXRzKSxcblx0XHRcdFx0b3V0cHV0czogcGFja2FnZVJlc3VsdChkYXRhLm91dHB1dHMsIGRhdGEubWV0YXMub3V0cHV0cylcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFja2FnZVJlc3VsdChpdGVtcywgbWV0YXMpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1zKS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdG1lbW9ba2V5XSA9IHtcblx0XHRcdHZhbHVlOiBpdGVtc1trZXldLFxuXHRcdFx0bWV0YTogbWV0YXNba2V5XVxuXHRcdH07XG5cdFx0cmV0dXJuIG1lbW87XG5cdH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gcGlja0tleXMoaXRlbSwga2V5cykge1xuXHRyZXR1cm4ga2V5cy5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuXHRcdG1lbW9ba2V5XSA9IGl0ZW1ba2V5XTtcblx0XHRyZXR1cm4gbWVtbztcblx0fSwge30pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRXZhbHVhdGlvbk9yZGVyKGVxdWF0aW9uLCBldmFscykge1xuXHRsZXQgaW5qZWN0aW9ucyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLmluamVjdGlvbnMpLFxuXHRcdGlucHV0cyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLmlucHV0cyksXG5cdFx0b3V0cHV0cyA9IE9iamVjdC5rZXlzKGVxdWF0aW9uLm91dHB1dHMpO1xuXG5cdGlmKCFldmFscy5zaXplKSB7XG5cdFx0ZXZhbHMgPSBuZXcgU2V0KG91dHB1dHMpO1xuXHR9XG5cblx0bGV0IGRlcGVuZGVuY2llcyA9IG5ldyBNYXAoKTtcblx0b3V0cHV0cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRkZXBlbmRlbmNpZXMuc2V0KGtleSwgZXF1YXRpb24ub3V0cHV0c1trZXldLmRlcGVuZGVuY2llcyk7XG5cdH0pO1xuXG5cdGxldCBvcmRlciA9IFtdO1xuXG5cdGxldCBwcm9jZXNzZWRPdXRwdXRzID0gbmV3IFNldCgpO1xuXHRsZXQgcHJvY2Vzc091dHB1dCA9IChrZXksIHNldCA9IG5ldyBTZXQoKSkgPT4ge1xuXHRcdGlmKHByb2Nlc3NlZE91dHB1dHMuaGFzKGtleSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZGVwcyA9IGRlcGVuZGVuY2llcy5nZXQoa2V5KTtcblx0XHRpZighZGVwcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgJyR7a2V5fScgbm90IGRlZmluZWQgaW4gZXF1YXRpb25zIHNldGApO1xuXHRcdH1cblx0XHRpZihzZXQuaGFzKGtleSkpIHtcblx0XHRcdGxldCBwYXRoID0gQXJyYXkuZnJvbShzZXQudmFsdWVzKCkpLmpvaW4oXCIgLT4gXCIpICsgXCIgLT4gXCIgKyBrZXk7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE91dHB1dCAnJHtrZXl9JyBoYXMgYSBjaXJjdWxhciBkZXBlbmRlbmN5ICcke3BhdGh9J2ApO1xuXHRcdH1cblx0XHRzZXQuYWRkKGtleSk7XG5cblx0XHRkZXBzLmZpbHRlcigoZGVwKSA9PiB7XG5cdFx0XHRyZXR1cm4gIX5pbmplY3Rpb25zLmluZGV4T2YoZGVwKSAmJiAhfmlucHV0cy5pbmRleE9mKGRlcCk7XG5cdFx0fSkuZm9yRWFjaCgoZGVwKSA9PiB7XG5cdFx0XHRpZighfm91dHB1dHMuaW5kZXhPZihkZXApKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgT3V0cHV0ICcke2tleX0nIGhhcyBhIG1pc3NpbmcgZGVwZW5kZW5jeSAnJHtkZXB9J2ApO1xuXHRcdFx0fVxuXG5cdFx0XHRwcm9jZXNzT3V0cHV0KGRlcCwgbmV3IFNldChzZXQpKTtcblx0XHR9KTtcblx0XHRvcmRlci5wdXNoKGtleSk7XG5cdFx0cHJvY2Vzc2VkT3V0cHV0cy5hZGQoa2V5KTtcblx0fTtcblx0ZXZhbHMuZm9yRWFjaCgoa2V5KSA9PiBwcm9jZXNzT3V0cHV0KGtleSkpO1xuXG5cdHJldHVybiBvcmRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3Rvcnkob3B0cykge1xuXHRyZXR1cm4gbmV3IEVxdWF0aW9uU2V0KG9wdHMpO1xufVxuIiwiaW1wb3J0IFBhcmFtZXRlciBmcm9tIFwiLi9QYXJhbWV0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBQYXJhbWV0ZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihhcmd1bWVudHNbMF0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3J5KG9wdHMpIHtcblx0cmV0dXJuIG5ldyBJbnB1dChvcHRzKTtcbn1cbiIsImltcG9ydCBQYXJhbWV0ZXIgZnJvbSBcIi4vUGFyYW1ldGVyXCI7XG5pbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0IHskaW5qZWN0fSBmcm9tIFwiLi4vdXRpbC9zeW1ib2xzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dHB1dCBleHRlbmRzIFBhcmFtZXRlciB7XG5cdGNvbnN0cnVjdG9yKHtmb3JtdWxhfSkge1xuXHRcdHN1cGVyKGFyZ3VtZW50c1swXSk7XG5cblx0XHR0aGlzLmZvcm11bGEgPSBkaS5hbm5vdGF0ZShmb3JtdWxhKTtcblx0fVxuXG5cdGV2YWx1YXRlKC4uLnN0b3Jlcykge1xuXHRcdHJldHVybiBkaS5pbmplY3QodGhpcy5mb3JtdWxhLCBzdG9yZXMpO1xuXHR9XG5cblx0Z2V0IGRlcGVuZGVuY2llcygpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtdWxhWyRpbmplY3RdO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3J5KG9wdHMpIHtcblx0cmV0dXJuIG5ldyBPdXRwdXQob3B0cyk7XG59XG4iLCJpbXBvcnQgKiBhcyBkaSBmcm9tIFwiLi4vdXRpbC9kaVwiO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSBcIi4uL3V0aWwvYXN5bmNcIjtcbmltcG9ydCB7JG1ldGF9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyYW1ldGVyIHtcblx0Y29uc3RydWN0b3Ioe3N5bWJvbCwgbWV0YSA9IHt9fSA9IHt9KSB7XG5cdFx0dGhpcy5zeW1ib2wgPSBzeW1ib2w7XG5cdFx0dGhpcy5tZXRhID0gbWV0YTtcblx0fVxuXG5cdGdldCBtZXRhKCkge1xuXHRcdHJldHVybiB0aGlzWyRtZXRhXTtcblx0fVxuXHRzZXQgbWV0YShyYXcpIHtcblx0XHRsZXQgbWV0YSA9IE9iamVjdC5rZXlzKHJhdykucmVkdWNlKChtZW1vLCBrZXkpID0+IHtcblx0XHRcdGxldCBpdGVtID0gcmF3W2tleV07XG5cdFx0XHRpZihkaS5pc0Fubm90YXRhYmxlKGl0ZW0pKSB7XG5cdFx0XHRcdGl0ZW0gPSBkaS5hbm5vdGF0ZShpdGVtKTtcblx0XHRcdH1cblx0XHRcdG1lbW9ba2V5XSA9IGl0ZW07XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9LCB7fSk7XG5cblx0XHR0aGlzWyRtZXRhXSA9IE9iamVjdC5mcmVlemUobWV0YSk7XG5cdH1cblxuXHRldmFsdWF0ZU1ldGEoLi4uc3RvcmVzKSB7XG5cdFx0bGV0IG1ldGEgPSB7fTtcblxuXHRcdE9iamVjdC5rZXlzKHRoaXMubWV0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRsZXQgaXRlbSA9IHRoaXMubWV0YVtrZXldO1xuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGl0ZW0gPSBkaS5pbmplY3QoaXRlbSwgc3RvcmVzKTtcblx0XHRcdH1cblx0XHRcdG1ldGFba2V5XSA9IGl0ZW07XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYXN5bmMucHJvcHMobWV0YSk7XG5cdH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkZWZlcigpIHtcblx0bGV0IGRlZmVycmVkID0ge307XG5cdGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0ZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0ZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuXHR9KTtcblx0cmV0dXJuIGRlZmVycmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMob2JqKSB7XG5cdGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblx0bGV0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4ge1xuXHRcdHJldHVybiBvYmpba2V5XTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCh2YWx1ZXMpID0+IHtcblx0XHRyZXR1cm4ga2V5cy5yZWR1Y2UoKG1lbW8sIGtleSwgaSkgPT4ge1xuXHRcdFx0bWVtb1trZXldID0gdmFsdWVzW2ldO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fSwge30pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUocCkge1xuXHRyZXR1cm4gISFwLnRoZW47XG59XG4iLCJpbXBvcnQgeyRpbmplY3R9IGZyb20gXCIuLi91dGlsL3N5bWJvbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRlKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiICYmIGZuWyRpbmplY3RdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRpZiAoZm4gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdGxldCBmaWVsZHMgPSBmbjtcblx0XHRmbiA9IGZuLnBvcCgpO1xuXHRcdGZuWyRpbmplY3RdID0gZmllbGRzO1xuXHRcdHJldHVybiBmbjtcblx0fVxuXG5cdGZuWyRpbmplY3RdID0gZm4udG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uIC4qP1xcKCguKj8pXFwpLylbMV0uc3BsaXQoL1xccyosXFxzKi8pLmZpbHRlcigoYSkgPT4gYSk7XG5cdHJldHVybiBmbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdChmbiwgLi4uc3RvcmVzKSB7XG5cdGlmICghZm5bJGluamVjdF0pIHtcblx0XHRmbiA9IGFubm90YXRlKGZuKTtcblx0fVxuXG5cdC8vIFRPRE86IFN1cHBvcnQgZnVuY3Rpb24gYXJndW1lbnQgZGVzdHJ1Y3R1cmUgc3ludGF4IHdpdGggbmF0aXZlLCBiYWJlbCwgYW5kIHRyYWNldXJcblxuXHRpZihzdG9yZXNbMF0gaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdHN0b3JlcyA9IHN0b3Jlc1swXTtcblx0fVxuXG5cdGxldCBwcm9taXNlcyA9IGZuWyRpbmplY3RdLm1hcCgobmFtZSkgPT4ge1xuXHRcdC8vIFJlcGxhY2UgdGhpcyB3aXRoIFwiZmluZFwiIHdoZW4gdGhhdCBpcyByZWFkeVxuXHRcdGxldCBpbmplY3Rpb24gPSBzdG9yZXMucmVkdWNlUmlnaHQoKGl0ZW0sIHN0b3JlKSA9PiB7XG5cdFx0XHRpZihpdGVtICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RvcmVbbmFtZV07XG5cdFx0fSwgdW5kZWZpbmVkKTtcblxuXHRcdGlmIChpbmplY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBkZXBlbmRlbmN5OiAke25hbWV9YCwgZm4pO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5qZWN0aW9uO1xuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKGFyZ3MpID0+IHtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbm5vdGF0YWJsZShmbikge1xuXHRyZXR1cm4gKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIpIHx8IChmbiBpbnN0YW5jZW9mIEFycmF5ICYmIHR5cGVvZiBmbltmbi5sZW5ndGggLSAxXSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuIiwiZXhwb3J0IGNvbnN0IHN0b3JlID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgY29uc3QgcGx1Z2lucyA9IE9iamVjdC5mcmVlemUoe1xuXHRwcmU6IFtdLFxuXHRwb3N0OiBbXSxcblx0Zm46IHt9XG59KTtcbiIsImV4cG9ydCBjb25zdCAkaW5qZWN0ID0gU3ltYm9sKFwiJGluamVjdFwiKTtcbmV4cG9ydCBjb25zdCAkbWV0YSA9IFN5bWJvbChcIiRtZXRhXCIpO1xuZXhwb3J0IGNvbnN0ICRuYW1lID0gU3ltYm9sKFwiJG5hbWVcIik7XG5cbmV4cG9ydCBjb25zdCAkaW5qZWN0aW9ucyA9IFN5bWJvbChcIiRpbmplY3Rpb25zXCIpO1xuZXhwb3J0IGNvbnN0ICRpbnB1dHMgPSBTeW1ib2woXCIkaW5wdXRzXCIpO1xuZXhwb3J0IGNvbnN0ICRvdXRwdXRzID0gU3ltYm9sKFwiJG91dHB1dHNcIik7XG5cbmV4cG9ydCBjb25zdCAkZXZhbHVhdGlvbk9yZGVyID0gU3ltYm9sKFwiJGV2YWx1YXRpb25PcmRlclwiKTtcbiJdfQ==
