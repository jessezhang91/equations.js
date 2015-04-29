export default class Equation {
	constructor({injections = {}, inputs = {}, outputs = {}}) {
		this.injections = injections;
		this.inputs = inputs;
		this.outputs = outputs;
	}
}
