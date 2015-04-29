import Parameter from "./Parameter";
import {inject, annotate} from "../util/di";

export default class Output extends Parameter {
	constructor({equation}) {
		super(arguments[0]);

		this.equation = annotate(equation);
	}

	evaluate(...stores) {
		return inject(this.equation, stores);
	}

	get dependencies() {
		return this.equation.$inject;
	}
}
