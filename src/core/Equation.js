import * as di from "../util/di";

export default class Equation {
	constructor(symbol, definition) {
		if (di.isAnnotatable(definition)) {
			// Provided definition is annotatable => it's an equation
			this.equation = di.annotate(definition);
		} else if(typeof definition == "object" && !Array.isArray(definition)) {
			// Provided definition is an object => can contain initial and equation
			this.initial = (definition.initial !== undefined ? definition.initial : definition.value);

			if (di.isAnnotatable(definition.equation)) {
				this.equation = di.annotate(definition.equation);
			}
		} else {
			// Provided definition is a value
			this.initial = definition;
		}

		this.hasInitial = (this.initial !== undefined);
	}

	evaluate(...stores) {
		return di.inject(this.equation, stores);
	}
}
