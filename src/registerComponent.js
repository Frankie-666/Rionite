let { utils: { mixin } } = require('cellx');
let elementConstructorMap = require('./elementConstructorMap');
let ElementProtoMixin = require('./ElementProtoMixin');

let createObject = Object.create;
let getPrototypeOf = Object.getPrototypeOf;
let hasOwn = Object.prototype.hasOwnProperty;

let inheritedStaticProperties = ['template', 'elementExtends', 'elementAttributes', 'assets'];

function registerComponent(componentConstr) {
	let elementIs = componentConstr.elementIs;

	if (!elementIs) {
		throw new TypeError('Static property "elementIs" is required');
	}

	let parentComponentConstr;

	inheritedStaticProperties.forEach(name => {
		if (!hasOwn.call(componentConstr, name)) {
			componentConstr[name] = (
				parentComponentConstr || (parentComponentConstr = getPrototypeOf(componentConstr.prototype).constructor)
			)[name];
		}
	});

	let elementExtends = componentConstr.elementExtends;
	let parentElementConstr = elementExtends ?
		elementConstructorMap[elementExtends] ||
			window[`HTML${ elementExtends.charAt(0).toUpperCase() + elementExtends.slice(1) }Element`] :
		HTMLElement;
	let elementProto = createObject(parentElementConstr.prototype);

	mixin(elementProto, ElementProtoMixin);
	elementProto._rioniteComponentConstructor = componentConstr;

	elementConstructorMap[elementIs] = document.registerElement(
		elementIs,
		elementExtends ? { extends: elementExtends, prototype: elementProto } : { prototype: elementProto }
	);

	return componentConstr;
}

module.exports = registerComponent;
