import Parameter from "./Parameter";

export default class Input extends Parameter {
	constructor({value}) {
		super(arguments[0]);

		this.value = value;
	}

	evaluate() {
		return this.value;
	}
}
