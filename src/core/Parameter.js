import {$meta} from "../util/symbols";

export default class Parameter {
	constructor({[$meta]: meta = {}}) {
		this[$meta] = meta;
	}
}
