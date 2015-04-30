import Parameter from "./Parameter";
import {inject, annotate} from "../util/di";
import {$inject} from "../util/symbols";

export default class Output extends Parameter {
	constructor({formula}) {
		super(arguments[0]);

		this.formula = annotate(formula);
	}

	evaluate(...stores) {
		return inject(this.formula, stores);
	}

	get dependencies() {
		return this.formula[$inject];
	}
}
