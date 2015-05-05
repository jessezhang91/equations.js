import Parameter from "./Parameter";

export default class Input extends Parameter {
	constructor() {
		super(arguments[0]);
	}
}

export function factory(opts) {
	return new Input(opts);
}
