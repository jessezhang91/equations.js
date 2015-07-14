import * as di from "./util/di";
import EquationSet from "./core/EquationSet";

export default function eqns(fn) {
	let data;
	if(di.isAnnotatable(fn)) {
		data = di.injectSync(fn, eqns.libraries || {});
	} else {
		data = fn;
	}
	return new EquationSet(data);
}
