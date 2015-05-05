import * as symbols from "./util/symbols";
import {default as EquationSet, factory as equationSetFactory} from "./core/EquationSet";
import {default as Input, factory as inputFactory} from "./core/Input";
import {default as Output, factory as outputFactory} from "./core/Output";
import {store, plugins} from "./util/state";

export default Object.create(plugins.fn, {
	get: {
		enumerable: true,
		value: store.get.bind(store)
	},
	has: {
		enumerable: true,
		value: store.has.bind(store)
	},

	plugins: {
		value: plugins
	},

	EquationSet: {
		enumerable: true,
		value: EquationSet
	},
	equationSet: {
		enumerable: true,
		value: equationSetFactory
	},

	Input: {
		enumerable: true,
		value: Input
	},
	input: {
		enumerable: true,
		value: inputFactory
	},

	Output: {
		enumerable: true,
		value: Output
	},
	output: {
		enumerable: true,
		value: outputFactory
	},

	symbols: {
		value: Object.freeze(symbols)
	}
});
