import Parameter from "./Parameter";
import * as di from "../util/di";
import {$inject} from "../util/symbols";

export default class Output extends Parameter {
	constructor({formula}) {
		super(arguments[0]);

		this.formula = di.annotate(formula);
	}

	evaluate(...stores) {
		return di.inject(this.formula, stores);
	}

	get dependencies() {
		return this.formula[$inject];
	}
}
