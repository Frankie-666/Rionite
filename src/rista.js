let cellx = require('cellx');
let observeDOM = require('./observeDOM');
let View = require('./View');
let { initViews, destroyViews } = require('./dom');

let { KEY_VIEW, define: defineView } = View;

let rista = {
	cellx,
	d: cellx.d,
	View: View,
	view: defineView
};
rista.rista = rista; // for destructuring

let eventTypes = [
	'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout',
	'dragstart', 'drag', 'dragenter', 'dragleave', 'dragover', 'drop', 'dragend',
	'keydown', 'keypress', 'keyup',
	'abort', 'error', 'resize',
	'select', 'change', 'submit', 'reset',
	'focusin', 'focusout'
];

function onDocumentEvent(evt) {
	let node = evt.target;
	let attrName = 'rt-' + evt.type;
	let targets = [];

	while (true) {
		if (node.nodeType == 1 && node.hasAttribute(attrName)) {
			targets.push(node);
		}

		node = node.parentNode;

		if (!node) {
			break;
		}

		if (node[KEY_VIEW]) {
			let view = node[KEY_VIEW];

			for (let i = 0, l = targets.length; i < l; i++) {
				let handler = view[targets[i].getAttribute(attrName)];

				if (handler) {
					handler.call(view, evt);
				}
			}

			break;
		}
	}
}

document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
	document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

	eventTypes.forEach(type => {
		document.addEventListener(type, onDocumentEvent);
	});

	observeDOM((removedNodes, addedNodes) => {
		for (let i = 0, l = removedNodes.length; i < l; i++) {
			let removedNode = removedNodes[i];

			if (removedNode.nodeType == 1) {
				destroyViews(removedNode);
			}
		}

		for (let i = 0, l = addedNodes.length; i < l; i++) {
			let addedNode = addedNodes[i];

			if (addedNode.nodeType == 1) {
				initViews(addedNode);
			}
		}
	});

	initViews(document.documentElement);
});

module.exports = rista;
