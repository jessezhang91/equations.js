import * as di from "../util/di";

export default class Equation {
	constructor(symbol, equation) {
		if (di.isAnnotatable(equation)) {
			this.equation = di.annotate(equation);
		} else if(typeof equation == "object") {
			this.value = (equation.initial !== undefined ? equation.initial : equation.value);

			if (di.isAnnotatable(equation.equation)) {
				this.equation = di.annotate(equation.equation);
			}
		} else {
			this.value = equation;
		}
	}

	evalulate(...stores) {
		return di.inject(this.equation, stores);
	}
}
