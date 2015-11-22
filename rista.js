(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rista"] = factory();
	else
		root["rista"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var EventEmitter = _require.EventEmitter;
	var map = _require.map;
	var list = _require.list;
	var cellx = _require.cellx;
	var d = _require.d;
	var utils = _require.utils;

	var settings = __webpack_require__(2);
	var morphElement = __webpack_require__(3);
	var observeDOM = __webpack_require__(4);
	var Component = __webpack_require__(6);

	var _require2 = __webpack_require__(9);

	var applyComponents = _require2.applyComponents;
	var destroyComponents = _require2.destroyComponents;
	var KEY_COMPONENT = Component.KEY_COMPONENT;
	var defineComponentSubclass = Component.defineSubclass;

	var eventTypes = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'dragstart', 'drag', 'dragenter', 'dragleave', 'dragover', 'drop', 'dragend', 'keydown', 'keypress', 'keyup', 'abort', 'error', 'resize', 'select', 'change', 'submit', 'reset', 'focusin', 'focusout'];

	var inited = false;

	/**
	 * @typesign (name: string, description: {
	 *     blockName?: string,
	 *     preinit?: (),
	 *     render?: (): string,
	 *     init?: (),
	 *     canComponentMorph?: (): boolean,
	 *     dispose?: ()
	 * });
	 */
	function component(name, description) {
		defineComponentSubclass(name, description);

		if (inited) {
			applyComponents(document.documentElement);
		}
	}

	function onDocumentEvent(evt) {
		var node = evt.target;
		var attrName = 'rt-' + evt.type;
		var targets = [];
		var component = undefined;

		while (true) {
			if (!component && node.nodeType == 1 && node.hasAttribute(attrName)) {
				targets.unshift(node);
			}

			node = node.parentNode;

			if (!node) {
				break;
			}

			if (node[KEY_COMPONENT]) {
				component = node[KEY_COMPONENT];

				for (var i = targets.length; i;) {
					var target = targets[--i];
					var handler = component[target.getAttribute(attrName)];

					if (handler) {
						handler.call(component, evt, target);
						targets.splice(i, 1);
					}
				}

				if (!targets.length) {
					break;
				}
			}
		}
	}

	document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
		document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

		utils.nextTick(function () {
			eventTypes.forEach(function (type) {
				document.addEventListener(type, onDocumentEvent);
			});

			observeDOM(function (removedNodes, addedNodes) {
				removedNodes.forEach(function (node) {
					if (node.nodeType == 1) {
						destroyComponents(node);
					}
				});

				addedNodes.forEach(function (node) {
					if (node.nodeType == 1) {
						applyComponents(node);
					}
				});
			});

			applyComponents(document.documentElement);

			inited = true;
		});
	});

	var rista = module.exports = {
		EventEmitter: EventEmitter,
		map: map,
		list: list,
		cellx: cellx,
		d: d,
		utils: utils,
		settings: settings,
		morphElement: morphElement,
		Component: Component,
		component: component
	};
	rista.rista = rista; // for destructuring

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function(undefined) {
		'use strict';

		var hasOwn = Object.prototype.hasOwnProperty;
		var toString = Object.prototype.toString;
		var push = Array.prototype.push;
		var slice = Array.prototype.slice;
		var splice = Array.prototype.splice;

		var global = Function('return this;')();

		var invokeCell;

		/**
		 * @typesign (value?, opts?: {
		 *     get?: (value): *,
		 *     validate?: (value),
		 *     computed?: false,
		 *     debugKey?: string
		 * }): cellx;
		 *
		 * @typesign (formula: (): *, opts?: {
		 *     get?: (value): *,
		 *     set?: (value),
		 *     validate?: (value),
		 *     computed?: true,
		 *     debugKey?: string
		 * }): cellx;
		 */
		function cellx(value, opts) {
			if (!opts) {
				opts = {};
			}

			var initialValue = value;

			function cell(value) {
				return invokeCell(cell, initialValue, opts, this, value, slice.call(arguments, 1), arguments.length);
			}
			cell.constructor = cellx;

			return cell;
		}
		cellx.cellx = cellx; // for destructuring

		var KEY_UID = '__cellx_uid__';
		var KEY_CELLS = '__cellx_cells__';

		if (global.Symbol && typeof Symbol.iterator == 'symbol') {
			KEY_UID = Symbol(KEY_UID);
			KEY_CELLS = Symbol(KEY_CELLS);
		}

		cellx.KEY_CELLS = KEY_CELLS;

		var uidCounter = 0;

		/**
		 * @typesign (err);
		 */
		var logError;

		if (global.console) {
			if (console.error) {
				logError = function(err) {
					console.error(err === Object(err) && err.stack || err);
				};
			} else {
				logError = function(err) {
					console.log('Error: ' + (err === Object(err) && err.stack || err));
				};
			}
		} else {
			logError = function() {};
		}

		/**
		 * For override:
		 * @example
		 * var cellx = require('cellx');
		 * var winston = require('winston');
		 *
		 * cellx._logError = function(err) {
		 *     winston.log('error', err.message + ' ' + err.stack);
		 * };
		 */
		cellx._logError = logError;

		/**
		 * @typesign (target: Object, source: Object): Object;
		 */
		function mixin(target, source) {
			var names = Object.getOwnPropertyNames(source);

			for (var i = names.length; i;) {
				Object.defineProperty(target, names[--i], Object.getOwnPropertyDescriptor(source, names[i]));
			}

			return target;
		}

		/**
		 * @typesign (a, b): boolean;
		 */
		var is = Object.is || function(a, b) {
			if (a === 0 && b === 0) {
				return 1 / a == 1 / b;
			}
			return a === b || (a != a && b != b);
		};

		/**
		 * @typesign (value): boolean;
		 */
		var isArray = Array.isArray || function(value) {
			return toString.call(value) == '[object Array]';
		};

		/**
		 * @typesign (description: {
		 *     Extends: Function,
		 *     Implements?: Array<Function>,
		 *     Static?: Object,
		 *     constructor?: Function
		 * }): Function;
		 */
		function createClass(description) {
			var parent;

			if (description.Extends) {
				parent = description.Extends;
				delete description.Extends;
			} else {
				parent = Object;
			}

			var constr;

			if (hasOwn.call(description, 'constructor')) {
				constr = description.constructor;
				delete description.constructor;
			} else {
				constr = function() {};
			}

			if (description.Static) {
				mixin(constr, description.Static);
				delete description.Static;
			}

			var proto = constr.prototype = Object.create(parent.prototype);

			if (description.Implements) {
				description.Implements.forEach(function(impl) {
					mixin(proto, impl.prototype);
				});

				delete description.Implements;
			}

			mixin(proto, description);

			proto.constructor = constr;

			return constr;
		}

		// gulp-include
		/**
		 * @typesign (cb: ());
		 */
		var nextTick = (function() {
			if (global.process && process.toString() == '[object process]' && process.nextTick) {
				return process.nextTick;
			}
		
			if (global.setImmediate) {
				return function(cb) {
					setImmediate(cb);
				};
			}
		
			if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
				var prm = Promise.resolve();
		
				return function(cb) {
					prm.then(function() {
						cb();
					});
				};
			}
		
			if (global.postMessage && !global.ActiveXObject) {
				var queue;
		
				global.addEventListener('message', function() {
					if (queue) {
						var q = queue;
		
						queue = null;
		
						for (var i = 0, l = q.length; i < l; i++) {
							try {
								q[i]();
							} catch (err) {
								cellx._logError(err);
							}
						}
					}
				}, false);
		
				return function(cb) {
					if (queue) {
						queue.push(cb);
					} else {
						queue = [cb];
						postMessage('__tic__', '*');
					}
				};
			}
		
			return function(cb) {
				setTimeout(cb, 1);
			};
		})();
		
		(function() {
			var Map = global.Map;
		
			if (!Map) {
				var entryStub = {
					value: undefined
				};
		
				Map = createClass({
					constructor: function(entries) {
						this._entries = Object.create(null);
						this._objectStamps = {};
		
						this._first = null;
						this._last = null;
		
						this.size = 0;
		
						if (entries) {
							for (var i = 0, l = entries.length; i < l; i++) {
								this.set(entries[i][0], entries[i][1]);
							}
						}
					},
		
					has: function(key) {
						return !!this._entries[this._getValueStamp(key)];
					},
		
					get: function(key) {
						return (this._entries[this._getValueStamp(key)] || entryStub).value;
					},
		
					set: function(key, value) {
						var entries = this._entries;
						var keyStamp = this._getValueStamp(key);
		
						if (entries[keyStamp]) {
							entries[keyStamp].value = value;
						} else {
							var entry = entries[keyStamp] = {
								key: key,
								keyStamp: keyStamp,
								value: value,
								prev: this._last,
								next: null
							};
		
							if (this.size++) {
								this._last.next = entry;
							} else {
								this._first = entry;
							}
		
							this._last = entry;
						}
		
						return this;
					},
		
					delete: function(key) {
						var keyStamp = this._getValueStamp(key);
						var entry = this._entries[keyStamp];
		
						if (!entry) {
							return false;
						}
		
						if (--this.size) {
							var prev = entry.prev;
							var next = entry.next;
		
							if (prev) {
								prev.next = next;
							} else {
								this._first = next;
							}
		
							if (next) {
								next.prev = prev;
							} else {
								this._last = prev;
							}
						} else {
							this._first = null;
							this._last = null;
						}
		
						delete this._entries[keyStamp];
						delete this._objectStamps[keyStamp];
		
						return true;
					},
		
					clear: function() {
						var entries = this._entries;
		
						for (var stamp in entries) {
							delete entries[stamp];
						}
		
						this._objectStamps = {};
		
						this._first = null;
						this._last = null;
		
						this.size = 0;
					},
		
					_getValueStamp: function(value) {
						switch (typeof value) {
							case 'undefined': {
								return 'undefined';
							}
							case 'object': {
								if (value === null) {
									return 'null';
								}
		
								break;
							}
							case 'boolean': {
								return '?' + value;
							}
							case 'number': {
								return '+' + value;
							}
							case 'string': {
								return ',' + value;
							}
						}
		
						return this._getObjectStamp(value);
					},
		
					_getObjectStamp: function(obj) {
						if (!hasOwn.call(obj, KEY_UID)) {
							if (!Object.isExtensible(obj)) {
								var stamps = this._objectStamps;
								var stamp;
		
								for (stamp in stamps) {
									if (stamps[stamp] == obj) {
										return stamp;
									}
								}
		
								stamp = String(++uidCounter);
								stamps[stamp] = obj;
		
								return stamp;
							}
		
							Object.defineProperty(obj, KEY_UID, {
								value: String(++uidCounter)
							});
						}
		
						return obj[KEY_UID];
					},
		
					forEach: function(cb, context) {
						if (context == null) {
							context = global;
						}
		
						var entry = this._first;
		
						while (entry) {
							cb.call(context, entry.value, entry.key, this);
		
							do {
								entry = entry.next;
							} while (entry && !this._entries[entry.keyStamp]);
						}
					},
		
					toString: function() {
						return '[object Map]';
					}
				});
		
				[
					['keys', function(entry) {
						return entry.key;
					}],
					['values', function(entry) {
						return entry.value;
					}],
					['entries', function(entry) {
						return [entry.key, entry.value];
					}]
				].forEach(function(iterator) {
					var getStepValue = iterator[1];
		
					Map.prototype[iterator[0]] = function() {
						var entries = this._entries;
						var entry;
						var done = false;
						var map = this;
		
						return {
							next: function() {
								if (!done) {
									if (entry) {
										do {
											entry = entry.next;
										} while (entry && !entries[entry.keyStamp]);
									} else {
										entry = map._first;
									}
		
									if (entry) {
										return {
											value: getStepValue(entry),
											done: false
										};
									}
		
									done = true;
								}
		
								return {
									value: undefined,
									done: true
								};
							}
						};
					};
				});
			}
		
			cellx.Map = Map;
		})();
		
		/**
		 * @typedef {{
		 *     target?: Object,
		 *     type: string,
		 *     bubbles?: boolean,
		 *     isPropagationStopped?: boolean
		 * }} cellx~Event
		 */
		
		(function() {
			var KEY_INNER = '__cellx_EventEmitter_inner__';
		
			if (global.Symbol && typeof Symbol.iterator == 'symbol') {
				KEY_INNER = Symbol(KEY_INNER);
			}
		
			/**
			 * @class cellx.EventEmitter
			 * @extends {Object}
			 * @typesign new (): cellx.EventEmitter;
			 */
			var EventEmitter = createClass({
				Static: {
					KEY_INNER: KEY_INNER
				},
		
				constructor: function() {
					/**
					 * @type {Object<Array<{ listener: (evt: cellx~Event): boolean|undefined, context: Object }>>}
					 */
					this._events = Object.create(null);
				},
		
				/**
				 * @typesign (
				 *     type: string,
				 *     listener: (evt: cellx~Event): boolean|undefined,
				 *     context?: Object
				 * ): cellx.EventEmitter;
				 *
				 * @typesign (
				 *     listeners: Object<(evt: cellx~Event): boolean|undefined>,
				 *     context?: Object
				 * ): cellx.EventEmitter;
				 */
				on: function(type, listener, context) {
					if (typeof type == 'object') {
						context = listener;
		
						var listeners = type;
		
						for (type in listeners) {
							this._on(type, listeners[type], context);
						}
					} else {
						this._on(type, listener, context);
					}
		
					return this;
				},
				/**
				 * @typesign (
				 *     type: string,
				 *     listener: (evt: cellx~Event): boolean|undefined,
				 *     context?: Object
				 * ): cellx.EventEmitter;
				 *
				 * @typesign (
				 *     listeners: Object<(evt: cellx~Event): boolean|undefined>,
				 *     context?: Object
				 * ): cellx.EventEmitter;
				 *
				 * @typesign (): cellx.EventEmitter;
				 */
				off: function(type, listener, context) {
					if (type) {
						if (typeof type == 'object') {
							context = listener;
		
							var listeners = type;
		
							for (type in listeners) {
								this._off(type, listeners[type], context);
							}
						} else {
							this._off(type, listener, context);
						}
					} else if (this._events) {
						this._events = Object.create(null);
					}
		
					return this;
				},
		
				/**
				 * @typesign (
				 *     type: string,
				 *     listener: (evt: cellx~Event): boolean|undefined,
				 *     context?: Object
				 * );
				 */
				_on: function(type, listener, context) {
					var index = type.indexOf(':');
		
					if (index != -1) {
						this['_' + type.slice(index + 1)]('on', type.slice(0, index), listener, context);
					} else {
						var events = (this._events || (this._events = Object.create(null)))[type];
		
						if (!events) {
							events = this._events[type] = [];
						}
		
						events.push({
							listener: listener,
							context: context || this
						});
					}
				},
				/**
				 * @typesign (
				 *     type: string,
				 *     listener: (evt: cellx~Event): boolean|undefined,
				 *     context?: Object
				 * );
				 */
				_off: function(type, listener, context) {
					var index = type.indexOf(':');
		
					if (index != -1) {
						this['_' + type.slice(index + 1)]('off', type.slice(0, index), listener, context);
					} else {
						var events = this._events && this._events[type];
		
						if (!events) {
							return;
						}
		
						if (!context) {
							context = this;
						}
		
						for (var i = events.length; i;) {
							var evt = events[--i];
		
							if (evt.context == context && (evt.listener == listener || evt.listener[KEY_INNER] === listener)) {
								events.splice(i, 1);
								break;
							}
						}
		
						if (!events.length) {
							delete this._events[type];
						}
					}
				},
		
				/**
				 * @typesign (
				 *     type: string,
				 *     listener: (evt: cellx~Event): boolean|undefined,
				 *     context?: Object
				 * ): cellx.EventEmitter;
				 */
				once: function(type, listener, context) {
					function wrapper() {
						this._off(type, wrapper, context);
						return listener.apply(this, arguments);
					}
					wrapper[KEY_INNER] = listener;
		
					this._on(type, wrapper, context);
		
					return this;
				},
		
				/**
				 * @typesign (evt: cellx~Event): cellx~Event;
				 * @typesign (type: string): cellx~Event;
				 */
				emit: function(evt) {
					if (typeof evt == 'string') {
						evt = {
							target: this,
							type: evt
						};
					} else if (!evt.target) {
						evt.target = this;
					}
		
					this._handleEvent(evt);
		
					return evt;
				},
		
				/**
				 * @typesign (evt: cellx~Event);
				 *
				 * For override:
				 * @example
				 * function View(el) {
				 *     this.element = el;
				 *     el._view = this;
				 * }
				 *
				 * View.prototype = Object.create(EventEmitter.prototype);
				 * View.prototype.constructor = View;
				 *
				 * View.prototype.getParent = function() {
				 *     var node = this.element;
				 *
				 *     while (node = node.parentNode) {
				 *         if (node._view) {
				 *             return node._view;
				 *         }
				 *     }
				 *
				 *     return null;
				 * };
				 *
				 * View.prototype._handleEvent = function(evt) {
				 *     // call super._handleEvent
				 *     EventEmitter.prototype._handleEvent.call(this, evt);
				 *
				 *     var parent = this.getParent();
				 *
				 *     if (parent && evt.bubbles !== false && !evt.isPropagationStopped) {
				 *         parent._handleEvent(evt);
				 *     }
				 * };
				 */
				_handleEvent: function(evt) {
					var events = this._events && this._events[evt.type];
		
					if (events) {
						events = events.slice();
		
						for (var i = 0, l = events.length; i < l; i++) {
							try {
								if (events[i].listener.call(events[i].context, evt) === false) {
									evt.isPropagationStopped = true;
								}
							} catch (err) {
								this._logError(err);
							}
						}
					}
				},
		
				/**
				 * @typesign (err);
				 */
				_logError: function(err) {
					cellx._logError(err);
				}
			});
		
			cellx.EventEmitter = EventEmitter;
		})();
		
		var ObservableCollection;
		
		(function() {
			var Map = cellx.Map;
			var EventEmitter = cellx.EventEmitter;
		
			ObservableCollection = createClass({
				Extends: EventEmitter,
		
				constructor: function() {
					/**
					 * @type {Map<*, uint>}
					 */
					this._valueCounts = new Map();
				},
		
				/**
				 * @typesign (evt: cellx~Event);
				 */
				_onItemChange: function(evt) {
					this._handleEvent(evt);
				},
		
				/**
				 * @typesign (value);
				 */
				_registerValue: function(value) {
					var valueCounts = this._valueCounts;
					var valueCount = valueCounts.get(value);
		
					if (valueCount) {
						valueCounts.set(value, valueCount + 1);
					} else {
						valueCounts.set(value, 1);
		
						if (this.adoptsItemChanges && value instanceof EventEmitter) {
							value.on('change', this._onItemChange, this);
						}
					}
				},
		
				/**
				 * @typesign (value);
				 */
				_unregisterValue: function(value) {
					var valueCounts = this._valueCounts;
					var valueCount = valueCounts.get(value);
		
					if (valueCount > 1) {
						valueCounts.set(value, valueCount - 1);
					} else {
						valueCounts.delete(value);
		
						if (this.adoptsItemChanges && value instanceof EventEmitter) {
							value.off('change', this._onItemChange, this);
						}
					}
				},
		
				/**
				 * Освобождает занятые инстансом ресурсы.
				 * @typesign ();
				 */
				dispose: function() {
					if (this.adoptsItemChanges) {
						this._valueCounts.forEach(function(value) {
							if (value instanceof EventEmitter) {
								value.off('change', this._onItemChange, this);
							}
						}, this);
					}
				}
			});
		})();
		
		(function() {
			var Map = cellx.Map;
			var EventEmitter = cellx.EventEmitter;
		
			/**
			 * @class cellx.ObservableMap
			 * @extends {cellx.EventEmitter}
			 * @implements {ObservableCollection}
			 *
			 * @typesign new (entries?: Object|Array<{ 0, 1 }>|cellx.ObservableMap, opts?: {
			 *     adoptsItemChanges: boolean = true
			 * }): cellx.ObservableMap;
			 */
			var ObservableMap = createClass({
				Extends: EventEmitter,
				Implements: [ObservableCollection],
		
				constructor: function(entries, opts) {
					EventEmitter.call(this);
					ObservableCollection.call(this);
		
					this._entries = new Map();
		
					this.size = 0;
		
					/**
					 * @type {boolean}
					 */
					this.adoptsItemChanges = !opts || opts.adoptsItemChanges !== false;
		
					if (entries) {
						var mapEntries = this._entries;
		
						if (entries instanceof ObservableMap) {
							entries._entries.forEach(function(value, key) {
								mapEntries.set(key, value);
								this._registerValue(value);
							}, this);
						} else if (isArray(entries)) {
							for (var i = 0, l = entries.length; i < l; i++) {
								var entry = entries[i];
		
								mapEntries.set(entry[0], entry[1]);
								this._registerValue(entry[1]);
							}
						} else {
							for (var key in entries) {
								mapEntries.set(key, entries[key]);
								this._registerValue(entries[key]);
							}
						}
		
						this.size = mapEntries.size;
					}
				},
		
				/**
				 * @typesign (key): boolean;
				 */
				has: function(key) {
					return this._entries.has(key);
				},
		
				/**
				 * @typesign (value): boolean;
				 */
				contains: function(value) {
					return this._valueCounts.has(value);
				},
		
				/**
				 * @typesign (key): *;
				 */
				get: function(key) {
					return this._entries.get(key);
				},
		
				/**
				 * @typesign (key, value): cellx.ObservableMap;
				 */
				set: function(key, value) {
					var entries = this._entries;
					var hasKey = entries.has(key);
					var oldValue;
		
					if (hasKey) {
						oldValue = entries.get(key);
		
						if (is(oldValue, value)) {
							return this;
						}
		
						this._unregisterValue(oldValue);
					}
		
					entries.set(key, value);
					this._registerValue(value);
		
					if (!hasKey) {
						this.size++;
					}
		
					this.emit({
						type: 'change',
						subtype: hasKey ? 'update' : 'add',
						key: key,
						oldValue: oldValue,
						value: value
					});
		
					return this;
				},
		
				/**
				 * @typesign (key): boolean;
				 */
				delete: function(key) {
					var entries = this._entries;
		
					if (!entries.has(key)) {
						return false;
					}
		
					var value = entries.get(key);
		
					entries.delete(key);
					this._unregisterValue(value);
		
					this.size--;
		
					this.emit({
						type: 'change',
						subtype: 'delete',
						key: key,
						oldValue: value,
						value: undefined
					});
		
					return true;
				},
		
				/**
				 * @typesign (): cellx.ObservableMap;
				 */
				clear: function() {
					if (!this.size) {
						return this;
					}
		
					this._entries.clear();
					this._valueCounts.clear();
					this.size = 0;
		
					this.emit({
						type: 'change',
						subtype: 'clear'
					});
		
					return this;
				},
		
				/**
				 * @typesign (cb: (value, key, map: cellx.ObservableMap), context?: Object);
				 */
				forEach: function(cb, context) {
					if (context == null) {
						context = global;
					}
		
					this._entries.forEach(function(value, key) {
						cb.call(context, value, key, this);
					}, this);
				},
		
				/**
				 * @typesign (): { next: (): { value, done: boolean } };
				 */
				keys: function() {
					return this._entries.keys();
				},
		
				/**
				 * @typesign (): { next: (): { value, done: boolean } };
				 */
				values: function() {
					return this._entries.values();
				},
		
				/**
				 * @typesign (): { next: (): { value: { 0, 1 }, done: boolean } };
				 */
				entries: function() {
					return this._entries.entries();
				},
		
				/**
				 * @typesign (): cellx.ObservableMap;
				 */
				clone: function() {
					return new this.constructor(this, {
						adoptsItemChanges: this.adoptsItemChanges
					});
				}
			});
		
			cellx.ObservableMap = ObservableMap;
		
			/**
			 * @typesign (
			 *     entries?: Object|Array<{ 0, 1 }>|cellx.ObservableMap,
			 *     opts?: { adoptsItemChanges: boolean = true }
			 * ): cellx.ObservableMap;
			 *
			 * @typesign (
			 *     entries?: Object|Array<{ 0, 1 }>|cellx.ObservableMap,
			 *     adoptsItemChanges: boolean = true
			 * ): cellx.ObservableMap;
			 */
			function map(entries, opts) {
				return new ObservableMap(entries, typeof opts == 'boolean' ? { adoptsItemChanges: opts } : opts);
			}
		
			cellx.map = map;
		})();
		
		(function() {
			var EventEmitter = cellx.EventEmitter;
		
			/**
			 * @typesign (a, b): -1|1|0;
			 */
			function defaultComparator(a, b) {
				if (a < b) { return -1; }
				if (a > b) { return 1; }
				return 0;
			}
		
			/**
			 * @typesign (list: cellx.ObservableList, items: Array);
			 */
			function addRange(list, items) {
				var listItems = list._items;
		
				if (list.sorted) {
					var comparator = list.comparator;
		
					for (var i = 0, l = items.length; i < l; i++) {
						var item = items[i];
						var low = 0;
						var high = listItems.length;
		
						while (low != high) {
							var mid = (low + high) >> 1;
		
							if (comparator(item, listItems[mid]) < 0) {
								high = mid;
							} else {
								low = mid + 1;
							}
						}
		
						listItems.splice(low, 0, item);
						list._registerValue(item);
					}
				} else {
					push.apply(listItems, items);
		
					for (var j = items.length; j;) {
						list._registerValue(items[--j]);
					}
				}
		
				list.length = listItems.length;
			}
		
			/**
			 * @class cellx.ObservableList
			 * @extends {cellx.EventEmitter}
			 * @implements {ObservableCollection}
			 *
			 * @typesign new (items?: Array|cellx.ObservableList, opts?: {
			 *     adoptsItemChanges: boolean = true,
			 *     comparator?: (a, b): int,
			 *     sorted?: boolean
			 * }): cellx.ObservableList;
			 */
			var ObservableList = createClass({
				Extends: EventEmitter,
				Implements: [ObservableCollection],
		
				constructor: function(items, opts) {
					EventEmitter.call(this);
					ObservableCollection.call(this);
		
					if (!opts) {
						opts = {};
					}
		
					this._items = [];
		
					this.length = 0;
		
					/**
					 * @type {boolean}
					 */
					this.adoptsItemChanges = opts.adoptsItemChanges !== false;
		
					/**
					 * @type {?(a, b): int}
					 */
					this.comparator = null;
		
					this.sorted = false;
		
					if (opts.sorted || (opts.comparator && opts.sorted !== false)) {
						this.comparator = opts.comparator || defaultComparator;
						this.sorted = true;
					}
		
					if (items) {
						addRange(this, items instanceof ObservableList ? items._items : items);
					}
				},
		
				/**
				 * @typesign (index: int, allowEndIndex: boolean = false): uint|undefined;
				 */
				_validateIndex: function(index, allowEndIndex) {
					if (index === undefined) {
						return index;
					}
		
					if (index < 0) {
						index += this.length;
		
						if (index < 0) {
							throw new RangeError('Index out of range');
						}
					} else if (index >= (this.length + (allowEndIndex ? 1 : 0))) {
						throw new RangeError('Index out of range');
					}
		
					return index;
				},
		
				/**
				 * @typesign (value): boolean;
				 */
				contains: function(value) {
					return this._valueCounts.has(value);
				},
		
				/**
				 * @typesign (value, fromIndex: int = 0): int;
				 */
				indexOf: function(value, fromIndex) {
					return this._items.indexOf(value, this._validateIndex(fromIndex));
				},
		
				/**
				 * @typesign (value, fromIndex: int = -1): int;
				 */
				lastIndexOf: function(value, fromIndex) {
					return this._items.lastIndexOf(value, this._validateIndex(fromIndex));
				},
		
				/**
				 * @typesign (index: int): *;
				 */
				get: function(index) {
					return this._items[this._validateIndex(index)];
				},
		
				/**
				 * @typesign (index: int = 0, count?: uint): Array;
				 */
				getRange: function(index, count) {
					index = this._validateIndex(index || 0, true);
		
					var items = this._items;
		
					if (count === undefined) {
						return items.slice(index);
					}
		
					if (index + count > items.length) {
						throw new RangeError('"index" and "count" do not denote a valid range');
					}
		
					return items.slice(index, index + count);
				},
		
				/**
				 * @typesign (index: int, value): cellx.ObservableList;
				 */
				set: function(index, value) {
					if (this.sorted) {
						throw new TypeError('Can\'t set to sorted list');
					}
		
					index = this._validateIndex(index);
		
					var items = this._items;
		
					if (is(items[index], value)) {
						return this;
					}
		
					this._unregisterValue(items[index]);
		
					items[index] = value;
					this._registerValue(value);
		
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (index: int, items: Array): cellx.ObservableList;
				 */
				setRange: function(index, items) {
					if (this.sorted) {
						throw new TypeError('Can\'t set to sorted list');
					}
		
					index = this._validateIndex(index);
		
					var itemCount = items.length;
		
					if (!itemCount) {
						return this;
					}
		
					if (index + itemCount > this.length) {
						throw new RangeError('"index" and length of "items" do not denote a valid range');
					}
		
					var listItems = this._items;
					var changed = false;
		
					for (var i = index + itemCount; i > index;) {
						var item = items[--i];
		
						if (!is(listItems[i], item)) {
							this._unregisterValue(listItems[i]);
		
							listItems[i] = item;
							this._registerValue(item);
		
							changed = true;
						}
					}
		
					if (changed) {
						this.emit('change');
					}
		
					return this;
				},
		
				/**
				 * @typesign (item): cellx.ObservableList;
				 */
				add: function(item) {
					this.addRange([item]);
					return this;
				},
		
				/**
				 * @typesign (items: Array): cellx.ObservableList;
				 */
				addRange: function(items) {
					if (!items.length) {
						return this;
					}
		
					addRange(this, items);
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (index: int, item): cellx.ObservableList;
				 */
				insert: function(index, item) {
					this.insertRange(index, [item]);
					return this;
				},
		
				/**
				 * @typesign (index: int, items: Array): cellx.ObservableList;
				 */
				insertRange: function(index, items) {
					if (this.sorted) {
						throw new TypeError('Can\'t insert to sorted list');
					}
		
					index = this._validateIndex(index, true);
		
					var itemCount = items.length;
		
					if (!itemCount) {
						return this;
					}
		
					splice.apply(this._items, [].concat(index, 0, items));
		
					for (var i = itemCount; i;) {
						this._registerValue(items[--i]);
					}
		
					this.length += itemCount;
		
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (item, fromIndex: int = 0): cellx.ObservableList;
				 */
				remove: function(item, fromIndex) {
					var index = this._items.indexOf(item, this._validateIndex(fromIndex));
		
					if (index == -1) {
						return this;
					}
		
					this._items.splice(index, 1);
					this._unregisterValue(item);
		
					this.length--;
		
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (item, fromIndex: int = 0): cellx.ObservableList;
				 */
				removeAll: function(item, fromIndex) {
					var items = this._items;
					var index = this._validateIndex(fromIndex);
					var changed = false;
		
					while ((index = items.indexOf(item, index)) != -1) {
						items.splice(index, 1);
						this._unregisterValue(item);
		
						changed = true;
					}
		
					if (changed) {
						this.length = items.length;
						this.emit('change');
					}
		
					return this;
				},
		
				/**
				 * @typesign (index: int): cellx.ObservableList;
				 */
				removeAt: function(index) {
					this._unregisterValue(this._items.splice(this._validateIndex(index), 1)[0]);
					this.length--;
		
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (index: int = 0, count?: uint): cellx.ObservableList;
				 */
				removeRange: function(index, count) {
					index = this._validateIndex(index || 0, true);
		
					var items = this._items;
		
					if (count === undefined) {
						count = items.length - index;
					} else if (index + count > items.length) {
						throw new RangeError('"index" and "count" do not denote a valid range');
					}
		
					if (!count) {
						return this;
					}
		
					for (var i = index + count; i > index;) {
						this._unregisterValue(items[--i]);
					}
					items.splice(index, count);
		
					this.length -= count;
		
					this.emit('change');
		
					return this;
				},
		
				/**
				 * @typesign (): cellx.ObservableList;
				 */
				clear: function() {
					if (this.length) {
						this._items.length = 0;
						this._valueCounts.clear();
		
						this.length = 0;
		
						this.emit('change');
					}
		
					return this;
				},
		
				/**
				 * @typesign (separator: string = ','): string;
				 */
				join: function(separator) {
					return this._items.join(separator);
				},
		
				/**
				 * @typesign (cb: (item, index: uint, arr: cellx.ObservableList), context: Object = global);
				 */
				forEach: null,
		
				/**
				 * @typesign (cb: (item, index: uint, arr: cellx.ObservableList): *, context: Object = global): Array;
				 */
				map: null,
		
				/**
				 * @typesign (cb: (item, index: uint, arr: cellx.ObservableList): boolean, context: Object = global): Array;
				 */
				filter: null,
		
				/**
				 * @typesign (cb: (item, index: uint, arr: cellx.ObservableList): boolean, context: Object = global): boolean;
				 */
				every: null,
		
				/**
				 * @typesign (cb: (item, index: uint, arr: cellx.ObservableList): boolean, context: Object = global): boolean;
				 */
				some: null,
		
				/**
				 * @typesign (cb: (accumulator: *, item, index: uint, arr: cellx.ObservableList): *, initialValue?): *;
				 */
				reduce: null,
		
				/**
				 * @typesign (cb: (accumulator: *, item, index: uint, arr: cellx.ObservableList): *, initialValue?): *;
				 */
				reduceRight: null,
		
				/**
				 * @typesign (): cellx.ObservableList;
				 */
				clone: function() {
					return new this.constructor(this, {
						adoptsItemChanges: this.adoptsItemChanges,
						comparator: this.comparator,
						sorted: this.sorted
					});
				},
		
				/**
				 * @typesign (): Array;
				 */
				toArray: function() {
					return this._items.slice();
				},
		
				/**
				 * @typesign (): string;
				 */
				toString: function() {
					return this._items.join();
				}
			});
		
			['forEach', 'map', 'filter', 'every', 'some', 'reduce', 'reduceRight'].forEach(function(name) {
				ObservableList.prototype[name] = function() {
					return Array.prototype[name].apply(this, arguments);
				};
			});
		
			cellx.ObservableList = ObservableList;
		
			/**
			 * @typesign (items?: Array|cellx.ObservableList, opts?: {
			 *     adoptsItemChanges: boolean = true,
			 *     comparator?: (a, b): int,
			 *     sorted?: boolean
			 * }): cellx.ObservableList;
			 *
			 * @typesign (items?: Array|cellx.ObservableList, adoptsItemChanges: boolean = true): cellx.ObservableList;
			 */
			function list(items, opts) {
				return new ObservableList(items, typeof opts == 'boolean' ? { adoptsItemChanges: opts } : opts);
			}
		
			cellx.list = list;
		})();
		
		(function() {
			var EventEmitter = cellx.EventEmitter;
		
			var KEY_INNER = EventEmitter.KEY_INNER;
		
			var error = {
				original: null
			};
		
			var currentlyRelease = false;
		
			/**
			 * @type {Array<Array<cellx.Cell>|null>}
			 */
			var releasePlan = [[]];
		
			var releasePlanIndex = 0;
			var maxLevel = -1;
		
			var calculatedCell = null;
		
			var releaseVersion = 1;
		
			function release() {
				if (releasePlanIndex > maxLevel) {
					return;
				}
		
				currentlyRelease = true;
		
				do {
					var bundle = releasePlan[releasePlanIndex];
		
					if (bundle) {
						var cell = bundle.shift();
		
						if (releasePlanIndex) {
							var index = releasePlanIndex;
		
							if (cell._active) {
								cell._recalc();
							}
		
							if (!releasePlan[index].length) {
								releasePlan[index] = null;
		
								if (releasePlanIndex) {
									releasePlanIndex++;
								}
							}
						} else {
							var changeEvent = cell._changeEvent;
		
							cell._fixedValue = cell._value;
							cell._changeEvent = null;
		
							cell._changed = true;
		
							if (cell._events.change) {
								cell._handleEvent(changeEvent);
							}
		
							var slaves = cell._slaves;
		
							for (var i = 0, l = slaves.length; i < l; i++) {
								var slave = slaves[i];
		
								if (slave._fixed) {
									(releasePlan[1] || (releasePlan[1] = [])).push(slave);
		
									if (!maxLevel) {
										maxLevel = 1;
									}
		
									slave._fixed = false;
								}
							}
		
							if (!releasePlan[0].length) {
								releasePlanIndex++;
							}
						}
					} else {
						releasePlanIndex++;
					}
				} while (releasePlanIndex <= maxLevel);
		
				maxLevel = -1;
		
				releaseVersion++;
		
				currentlyRelease = false;
			}
		
			/**
			 * @class cellx.Cell
			 * @extends {cellx.EventEmitter}
			 *
			 * @example
			 * var a = new Cell(1);
			 * var b = new Cell(2);
			 * var c = new Cell(function() {
			 *     return a.get() + b.get();
			 * });
			 *
			 * c.on('change', function() {
			 *     console.log('c = ' + c.get());
			 * });
			 *
			 * console.log(c.get());
			 * // => 3
			 *
			 * a.set(5);
			 * b.set(10);
			 * // => 'c = 15'
			 *
			 * @typesign new (value?, opts?: {
			 *     owner?: Object,
			 *     get?: (value): *,
			 *     validate?: (value),
			 *     onchange?: (evt: cellx~Event): boolean|undefined,
			 *     onerror?: (evt: cellx~Event): boolean|undefined,
			 *     computed?: false,
			 *     debugKey?: string
			 * }): cellx.Cell;
			 *
			 * @typesign new (formula: (): *, opts?: {
			 *     owner?: Object,
			 *     get?: (value): *,
			 *     set?: (value),
			 *     validate?: (value),
			 *     onchange?: (evt: cellx~Event): boolean|undefined,
			 *     onerror?: (evt: cellx~Event): boolean|undefined,
			 *     computed?: true,
			 *     debugKey?: string
			 * }): cellx.Cell;
			 */
			var Cell = createClass({
				Extends: EventEmitter,
		
				constructor: function(value, opts) {
					EventEmitter.call(this);
		
					if (!opts) {
						opts = {};
					}
		
					this.owner = opts.owner || null;
		
					this.computed = typeof value == 'function' &&
						(opts.computed !== undefined ? opts.computed : value.constructor == Function);
		
					this._value = undefined;
					this._fixedValue = undefined;
					this.initialValue = undefined;
					this._formula = null;
		
					this._get = opts.get || null;
					this._set = opts.set || null;
		
					this._validate = opts.validate || null;
		
					/**
					 * Ведущие ячейки.
					 * @type {?Array<cellx.Cell>}
					 */
					this._masters = null;
					/**
					 * Ведомые ячейки.
					 * @type {Array<cellx.Cell>}
					 */
					this._slaves = [];
		
					/**
					 * @type {uint|undefined}
					 */
					this._level = 0;
		
					this._active = !this.computed;
		
					this._changeEvent = null;
					this._isChangeCancellable = true;
		
					this._lastErrorEvent = null;
		
					this._fixed = true;
		
					this._version = 0;
		
					this._changed = false;
		
					this._circularityCounter = 0;
		
					if (this.computed) {
						this._formula = value;
					} else {
						if (this._validate) {
							this._validate.call(this.owner || this, value);
						}
		
						this._value = this._fixedValue = this.initialValue = value;
		
						if (value instanceof EventEmitter) {
							value.on('change', this._onValueChange, this);
						}
					}
		
					if (opts.onchange) {
						this.on('change', opts.onchange);
					}
					if (opts.onerror) {
						this.on('error', opts.onerror);
					}
				},
		
				/**
				 * @type {boolean}
				 */
				get changed() {
					if (!currentlyRelease) {
						release();
					}
		
					return this._changed;
				},
		
				/**
				 * @override
				 */
				on: function(type, listener, context) {
					if (!currentlyRelease) {
						release();
					}
		
					if (this.computed && !this._events.change && !this._slaves.length) {
						this._activate();
					}
		
					EventEmitter.prototype.on.call(this, type, listener, context);
		
					return this;
				},
				/**
				 * @override
				 */
				off: function(type, listener, context) {
					if (!currentlyRelease) {
						release();
					}
		
					EventEmitter.prototype.off.call(this, type, listener, context);
		
					if (this.computed && !this._events.change && !this._slaves.length) {
						this._deactivate();
					}
		
					return this;
				},
		
				/**
				 * @override
				 */
				_on: function(type, listener, context) {
					EventEmitter.prototype._on.call(this, type, listener, context || this.owner);
				},
				/**
				 * @override
				 */
				_off: function(type, listener, context) {
					EventEmitter.prototype._off.call(this, type, listener, context || this.owner);
				},
		
				/**
				 * @typesign (listener: (err: Error|null, evt: cellx~Event): boolean|undefined): cellx.Cell;
				 */
				subscribe: function(listener) {
					function wrapper(evt) {
						return listener.call(this, evt.error || null, evt);
					}
					wrapper[KEY_INNER] = listener;
		
					this
						.on('change', wrapper)
						.on('error', wrapper);
		
					return this;
				},
				/**
				 * @typesign (listener: (err: Error|null, evt: cellx~Event): boolean|undefined): cellx.Cell;
				 */
				unsubscribe: function(listener) {
					this
						.off('change', listener)
						.off('error', listener);
		
					return this;
				},
		
				/**
				 * @typesign (slave: cellx.Cell);
				 */
				_registerSlave: function(slave) {
					if (this.computed && !this._events.change && !this._slaves.length) {
						this._activate();
					}
		
					this._slaves.push(slave);
				},
				/**
				 * @typesign (slave: cellx.Cell);
				 */
				_unregisterSlave: function(slave) {
					this._slaves.splice(this._slaves.indexOf(slave), 1);
		
					if (this.computed && !this._events.change && !this._slaves.length) {
						this._deactivate();
					}
				},
		
				/**
				 * @typesign ();
				 */
				_activate: function() {
					if (this._version != releaseVersion) {
						this._masters = null;
						this._level = 0;
		
						var value = this._tryFormula();
		
						if (value === error) {
							this._handleError(error.original);
						} else if (!is(this._value, value)) {
							this._value = value;
							this._changed = true;
						}
		
						this._version = releaseVersion;
					}
		
					var masters = this._masters || [];
		
					for (var i = masters.length; i;) {
						masters[--i]._registerSlave(this);
					}
		
					this._active = true;
				},
				/**
				 * @typesign ();
				 */
				_deactivate: function() {
					var masters = this._masters || [];
		
					for (var i = masters.length; i;) {
						masters[--i]._unregisterSlave(this);
					}
		
					this._active = false;
				},
		
				/**
				 * @typesign (evt: cellx~Event);
				 */
				_onValueChange: function(evt) {
					if (this._changeEvent) {
						evt.prev = this._changeEvent;
		
						this._changeEvent = evt;
		
						if (this._value === this._fixedValue) {
							this._isChangeCancellable = false;
						}
					} else {
						releasePlan[0].push(this);
		
						releasePlanIndex = 0;
		
						if (maxLevel == -1) {
							maxLevel = 0;
						}
		
						evt.prev = null;
		
						this._changeEvent = evt;
						this._isChangeCancellable = false;
		
						if (!currentlyRelease) {
							nextTick(release);
						}
					}
				},
		
				/**
				 * @typesign (): *;
				 */
				get: function() {
					if (!currentlyRelease) {
						release();
					}
		
					if (this.computed && !this._active && this._version != releaseVersion) {
						this._masters = null;
						this._level = 0;
		
						var value = this._tryFormula();
		
						if (value === error) {
							this._handleError(error.original);
						} else {
							if (!is(this._value, value)) {
								this._value = value;
								this._changed = true;
							}
						}
		
						this._version = releaseVersion;
					}
		
					if (calculatedCell) {
						if (calculatedCell._masters) {
							if (calculatedCell._masters.indexOf(this) == -1) {
								calculatedCell._masters.push(this);
		
								if (calculatedCell._level <= this._level) {
									calculatedCell._level = this._level + 1;
								}
							}
						} else {
							calculatedCell._masters = [this];
							calculatedCell._level = this._level + 1;
						}
					}
		
					return this._get ? this._get.call(this.owner || this, this._value) : this._value;
				},
		
				/**
				 * @typesign (value): boolean;
				 */
				set: function(value) {
					if (this.computed && !this._set) {
						throw new TypeError(
							(this.debugKey ? '[' + this.debugKey + '] ' : '') + 'Cannot write to read-only cell'
						);
					}
		
					var oldValue = this._value;
		
					if (is(oldValue, value)) {
						return false;
					}
		
					if (this._validate) {
						this._validate.call(this.owner || this, value);
					}
		
					if (this.computed) {
						this._set.call(this.owner || this, value);
					} else {
						this._value = value;
		
						if (oldValue instanceof EventEmitter) {
							oldValue.off('change', this._onValueChange, this);
						}
						if (value instanceof EventEmitter) {
							value.on('change', this._onValueChange, this);
						}
		
						if (this._changeEvent) {
							if (is(value, this._fixedValue) && this._isChangeCancellable) {
								if (releasePlan[0].length == 1) {
									releasePlan[0].pop();
		
									if (!maxLevel) {
										maxLevel = -1;
									}
								} else {
									releasePlan[0].splice(releasePlan[0].indexOf(this), 1);
								}
		
								this._changeEvent = null;
							} else {
								this._changeEvent = {
									target: this,
									type: 'change',
									oldValue: oldValue,
									value: value,
									prev: this._changeEvent
								};
							}
						} else {
							releasePlan[0].push(this);
		
							releasePlanIndex = 0;
		
							if (maxLevel == -1) {
								maxLevel = 0;
							}
		
							this._changeEvent = {
								target: this,
								type: 'change',
								oldValue: oldValue,
								value: value,
								prev: null
							};
							this._isChangeCancellable = true;
		
							if (!currentlyRelease) {
								nextTick(release);
							}
						}
					}
		
					return true;
				},
		
				/**
				 * @typesign (): boolean|undefined;
				 */
				recalc: function() {
					return this._recalc(true);
				},
		
				/**
				 * @typesign (force: boolean = false): boolean|undefined;
				 */
				_recalc: function(force) {
					if (!force) {
						if (this._version == releaseVersion + 1) {
							if (++this._circularityCounter == 10) {
								this._fixed = true;
								this._version = releaseVersion + 1;
		
								this._handleError(new RangeError('Circular dependency detected'));
		
								return false;
							}
						} else {
							this._circularityCounter = 1;
						}
					}
		
					var oldMasters = this._masters;
					this._masters = null;
		
					var oldLevel = this._level;
					this._level = 0;
		
					var value = this._tryFormula();
		
					var masters = this._masters || [];
					var haveRemovedMasters = false;
		
					for (var i = oldMasters.length; i;) {
						var oldMaster = oldMasters[--i];
		
						if (masters.indexOf(oldMaster) == -1) {
							oldMaster._unregisterSlave(this);
							haveRemovedMasters = true;
						}
					}
		
					if (haveRemovedMasters || oldMasters.length < masters.length) {
						for (var j = masters.length; j;) {
							var master = masters[--j];
		
							if (oldMasters.indexOf(master) == -1) {
								master._registerSlave(this);
							}
						}
		
						var level = this._level;
		
						if (level > oldLevel) {
							(releasePlan[level] || (releasePlan[level] = [])).push(this);
		
							if (maxLevel < level) {
								maxLevel = level;
							}
		
							if (force) {
								nextTick(release);
							}
		
							return;
						}
					}
		
					this._fixed = true;
					this._version = releaseVersion + 1;
		
					if (value === error) {
						this._handleError(error.original);
					} else {
						var oldValue = this._value;
		
						if (!is(oldValue, value) || value instanceof EventEmitter) {
							this._value = value;
							this._changed = true;
		
							if (this._events.change) {
								this.emit({
									type: 'change',
									oldValue: oldValue,
									value: value,
									prev: null
								});
							}
		
							var slaves = this._slaves;
		
							for (var k = 0, n = slaves.length; k < n; k++) {
								var slave = slaves[k];
		
								if (slave._fixed) {
									var slaveLevel = slave._level;
		
									(releasePlan[slaveLevel] || (releasePlan[slaveLevel] = [])).push(slave);
		
									if (maxLevel < slaveLevel) {
										maxLevel = slaveLevel;
									}
		
									slave._fixed = false;
								}
							}
		
							return true;
						}
					}
		
					return false;
				},
		
				/**
				 * @typesign (): *;
				 */
				_tryFormula: function() {
					var prevCalculatedCell = calculatedCell;
					calculatedCell = this;
		
					try {
						var value = this._formula.call(this.owner || this);
		
						if (this._validate) {
							this._validate.call(this.owner || this, value);
						}
		
						return value;
					} catch (err) {
						error.original = err;
						return error;
					} finally {
						calculatedCell = prevCalculatedCell;
					}
				},
		
				/**
				 * @typesign (err: Error);
				 */
				_handleError: function(err) {
					this._logError(err);
		
					this._handleErrorEvent({
						type: 'error',
						error: err
					});
				},
		
				/**
				 * @override
				 * @typesign (err: Error);
				 */
				_logError: function(err) {
					cellx._logError((this.debugKey ? '[' + this.debugKey + '] ' : '') + err.stack);
				},
		
				/**
				 * @typesign (evt: cellx~Event);
				 */
				_handleErrorEvent: function(evt) {
					if (this._lastErrorEvent === evt) {
						return;
					}
		
					this._lastErrorEvent = evt;
		
					this._handleEvent(evt);
		
					var slaves = this._slaves;
		
					for (var i = 0, l = slaves.length; i < l; i++) {
						if (evt.isPropagationStopped) {
							break;
						}
		
						slaves[i]._handleErrorEvent(evt);
					}
				},
		
				/**
				 * @typesign (): cellx.Cell;
				 */
				dispose: function() {
					if (!currentlyRelease) {
						release();
					}
		
					this._dispose();
		
					return this;
				},
		
				/**
				 * @typesign ();
				 */
				_dispose: function() {
					this.off();
		
					if (this._active) {
						var slaves = this._slaves;
		
						for (var i = 0, l = slaves.length; i < l; i++) {
							slaves[i]._dispose();
						}
					}
				}
			});
		
			cellx.Cell = Cell;
		})();
		
		(function() {
			var Map = cellx.Map;
			var Cell = cellx.Cell;
		
			var cellProto = Cell.prototype;
		
			invokeCell = function(wrapper, initialValue, opts, owner, firstArg, otherArgs, argCount) {
				if (!owner || owner == global) {
					owner = wrapper;
				}
		
				if (!hasOwn.call(owner, KEY_CELLS)) {
					Object.defineProperty(owner, KEY_CELLS, {
						value: new Map()
					});
				}
		
				var cell = owner[KEY_CELLS].get(wrapper);
		
				if (!cell) {
					if (initialValue != null && typeof initialValue == 'object') {
						if (typeof initialValue.clone == 'function') {
							initialValue = initialValue.clone();
						} else if (isArray(initialValue)) {
							initialValue = initialValue.slice();
						} else if (initialValue.constructor === Object) {
							initialValue = mixin({}, initialValue);
						} else {
							switch (toString.call(initialValue)) {
								case '[object Date]': {
									initialValue = new Date(initialValue);
									break;
								}
								case '[object RegExp]': {
									initialValue = new RegExp(initialValue);
									break;
								}
							}
						}
					}
		
					opts = Object.create(opts);
					opts.owner = owner;
		
					cell = new Cell(initialValue, opts);
					owner[KEY_CELLS].set(wrapper, cell);
				}
		
				switch (argCount) {
					case 0: {
						return cell.get();
					}
					case 1: {
						return cell.set(firstArg);
					}
					default: {
						switch (firstArg) {
							case 'bind': {
								wrapper = wrapper.bind(owner);
								wrapper.constructor = cellx;
								return wrapper;
							}
							case 'unwrap': {
								return cell;
							}
							default: {
								return cellProto[firstArg].apply(cell, otherArgs);
							}
						}
					}
				}
			};
		})();
		
		(function() {
			function observable(target, name, descr, opts) {
				if (arguments.length == 1) {
					opts = target;
		
					return function(target, name, descr) {
						return observable(target, name, descr, opts);
					};
				}
		
				if (!opts) {
					opts = {};
				}
		
				opts.computed = false;
		
				var _name = '_' + name;
		
				target[_name] = cellx(descr.initializer(), opts);
		
				return {
					configurable: descr.configurable,
					enumerable: descr.enumerable,
		
					get: function() {
						return this[_name]();
					},
		
					set: function(value) {
						this[_name](value);
					}
				};
			}
		
			function computed(target, name, descr, opts) {
				if (arguments.length == 1) {
					opts = target;
		
					return function(target, name, descr) {
						return computed(target, name, descr, opts);
					};
				}
		
				var value = descr.initializer();
		
				if (typeof value != 'function') {
					throw new TypeError('Property value must be a function');
				}
		
				if (!opts) {
					opts = {};
				}
		
				opts.computed = true;
		
				var _name = '_' + name;
		
				target[_name] = cellx(value, opts);
		
				var descriptor = {
					configurable: descr.configurable,
					enumerable: descr.enumerable,
		
					get: function() {
						return this[_name]();
					}
				};
		
				if (opts.set) {
					descriptor.set = function(value) {
						this[_name](value);
					};
				}
		
				return descriptor;
			}
		
			cellx.d = {
				observable: observable,
				computed: computed
			};
		})();
		

		cellx.utils = {
			logError: logError,
			mixin: mixin,
			createClass: createClass,
			nextTick: nextTick
		};

		if (true) {
			if (true) {
				module.exports = cellx;
			} else {
				exports.cellx = cellx;
			}
		} else {
			global.cellx = cellx;
		}
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var settings = {
		blockNameCase: 'camel' // 'pascal', 'hyphen'
	};

	module.exports = settings;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Original code: https://github.com/patrick-steele-idem/morphdom
	 */

	'use strict';

	var PREFIX_KEY = ':';
	var PREFIX_TEXT_NODE = ',';
	var PREFIX_COMMENT_NODE = '#';

	var specialElementHandlers = {
		INPUT: function INPUT(target, source) {
			if (target.value != source.value) {
				target.value = source.value;
			}

			target.checked = source.checked;
		},

		TEXTAREA: function TEXTAREA(target, source) {
			var value = source.value;

			if (target.value != value) {
				target.value = value;
			}

			if (target.firstChild) {
				target.firstChild.nodeValue = value;
			}
		},

		OPTION: function OPTION(target, source) {
			target.selected = source.selected;
		}
	};

	function noop() {}

	function defaultGetElementKey(el) {
		return el.getAttribute('key');
	}

	function morphAttributes(target, source) {
		var sourceAttributes = source.attributes;
		var foundAttributes = Object.create(null);

		for (var i = sourceAttributes.length; i;) {
			var attr = sourceAttributes[--i];
			var attrName = attr.name;
			var attrValue = attr.value;

			foundAttributes[attrName] = true;

			if (target.getAttribute(attrName) != attrValue) {
				target.setAttribute(attrName, attrValue);
			}
		}

		var targetAttributes = target.attributes;

		for (var i = targetAttributes.length; i;) {
			var attr = targetAttributes[--i];
			var attrName = attr.name;

			if (!foundAttributes[attrName]) {
				target.removeAttribute(attrName);
			}
		}
	}

	/**
	 * @typesign (target: HTMLElement, source: HTMLElement, options: {
	 *     getElementKey?: (el: HTMLElement): string|undefined,
	 *     contentOnly: boolean = false,
	 *     onBeforeMorphElement?: (source: HTMLElement, target: HTMLElement): boolean|undefined,
	 *     onBeforeMorphElementContent?: (source: HTMLElement, target: HTMLElement): boolean|undefined,
	 *     onBeforeNodeDiscarded?: (node: Node): boolean|undefined,
	 *     onNodeDiscarded?: (node: Node)
	 * });
	 */
	function morphElement(target, source, options) {
		if (!options) {
			options = {};
		}

		var getElementKey = options.getElementKey || defaultGetElementKey;
		var contentOnly = options.contentOnly === true;
		var onBeforeMorphElement = options.onBeforeMorphElement || noop;
		var onBeforeMorphElementContent = options.onBeforeMorphElementContent || noop;
		var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
		var onNodeDiscarded = options.onNodeDiscarded || noop;

		var storedElements = Object.create(null);
		var unmatchedElements = Object.create(null);

		function storeContent(el) {
			var childNodes = el.childNodes;

			for (var _i = 0, _l = childNodes.length; _i < _l; _i++) {
				var childNode = childNodes[_i];

				if (childNode.nodeType == 1) {
					var key = getElementKey(childNode);

					if (key) {
						var stamp = childNode.tagName + PREFIX_KEY + key;
						(storedElements[stamp] || (storedElements[stamp] = [])).push(childNode);
					}

					storeContent(childNode);
				}
			}
		}

		function morphNode(target, source, contentOnly) {
			if (target.nodeType == 1) {
				if (!contentOnly) {
					if (onBeforeMorphElement(target, source) === false) {
						return;
					}

					morphAttributes(target, source);

					if (onBeforeMorphElementContent(target, source) === false) {
						return;
					}
				}

				var targetChildNodes = target.childNodes;
				var storedChildNodes = {};

				for (var _i2 = 0, _l2 = targetChildNodes.length; _i2 < _l2; _i2++) {
					var childNode = targetChildNodes[_i2];
					var stamp = undefined;

					switch (childNode.nodeType) {
						case 1:
							{
								var key = getElementKey(childNode);

								if (key) {
									stamp = childNode.tagName + PREFIX_KEY + key;

									var els = unmatchedElements[stamp];

									if (els) {
										var el = els.shift();

										if (!els.length) {
											delete unmatchedElements[stamp];
										}

										el.blank.parentNode.replaceChild(childNode, el.blank);
										morphNode(childNode, el.element, false);
									} else {
										(storedElements[stamp] || (storedElements[stamp] = [])).push(childNode);
									}

									continue;
								}

								stamp = childNode.tagName;
								break;
							}
						case 3:
							{
								stamp = PREFIX_TEXT_NODE + childNode.nodeValue;
								break;
							}
						case 8:
							{
								stamp = PREFIX_COMMENT_NODE + childNode.nodeValue;
								break;
							}
						default:
							{
								throw new TypeError('Unsupported node type');
							}
					}

					(storedChildNodes[stamp] || (storedChildNodes[stamp] = [])).push(childNode);
				}

				var sourceChildNodes = source.childNodes;

				for (var _i3 = 0, _l3 = sourceChildNodes.length; _i3 < _l3; _i3++) {
					var sourceChildNode = sourceChildNodes[_i3];
					var stamp = undefined;
					var unique = false;

					switch (sourceChildNode.nodeType) {
						case 1:
							{
								var key = getElementKey(sourceChildNode);

								if (key) {
									stamp = sourceChildNode.tagName + PREFIX_KEY + key;
									unique = true;
								} else {
									stamp = sourceChildNode.tagName;
								}

								break;
							}
						case 3:
							{
								stamp = PREFIX_TEXT_NODE + sourceChildNode.nodeValue;
								break;
							}
						case 8:
							{
								stamp = PREFIX_COMMENT_NODE + sourceChildNode.nodeValue;
								break;
							}
						default:
							{
								throw new TypeError('Unsupported node type');
							}
					}

					var storedNodes = unique ? storedElements : storedChildNodes;
					var nodes = storedNodes[stamp];
					var beforeElement = targetChildNodes[_i3] || null;

					if (nodes) {
						var targetChildNode = nodes.shift();

						if (!nodes.length) {
							delete storedNodes[stamp];
						}

						if (!beforeElement || targetChildNode != beforeElement) {
							target.insertBefore(targetChildNode, beforeElement);
						}

						if (targetChildNode.nodeType == 1) {
							morphNode(targetChildNode, sourceChildNode, false);
						}
					} else {
						switch (sourceChildNode.nodeType) {
							case 1:
								{
									var el = document.createElement(sourceChildNode.tagName);
									target.insertBefore(el, beforeElement);

									if (unique) {
										(unmatchedElements[stamp] || (unmatchedElements[stamp] = [])).push({
											blank: el,
											element: sourceChildNode
										});
									} else {
										morphNode(el, sourceChildNode, false);
									}

									break;
								}
							case 3:
								{
									target.insertBefore(document.createTextNode(sourceChildNode.nodeValue), beforeElement);
									break;
								}
							case 8:
								{
									target.insertBefore(document.createComment(sourceChildNode.nodeValue), beforeElement);
									break;
								}
							default:
								{
									throw new TypeError('Unsupported node type');
								}
						}
					}
				}

				for (var stamp in storedChildNodes) {
					var childNodes = storedChildNodes[stamp];

					for (var _i4 = 0, _l4 = childNodes.length; _i4 < _l4; _i4++) {
						var childNode = childNodes[_i4];

						if (onBeforeNodeDiscarded(childNode) !== false) {
							childNode.parentNode.removeChild(childNode);

							if (childNode.nodeType == 1) {
								storeContent(childNode);
							}

							onNodeDiscarded(childNode);
						}
					}
				}

				var specialElementHandler = specialElementHandlers[target.tagName];

				if (specialElementHandler) {
					specialElementHandler(target, source);
				}
			} else {
				target.nodeValue = source.nodeValue;
			}
		}

		morphNode(target, source, contentOnly);

		var ch = undefined;

		do {
			ch = false;

			for (var stamp in unmatchedElements) {
				ch = true;

				var els = unmatchedElements[stamp];
				delete unmatchedElements[stamp];

				for (var i = 0, l = els.length; i < l; i++) {
					var el = els[i];
					morphNode(el.blank, el.element, false);
				}
			}
		} while (ch);

		for (var stamp in storedElements) {
			var els = storedElements[stamp];

			for (var _i5 = 0, _l5 = els.length; _i5 < _l5; _i5++) {
				var el = els[_i5];

				if (onBeforeNodeDiscarded(el) !== false) {
					el.parentNode.removeChild(el);
					onNodeDiscarded(el);
				}
			}
		}
	}

	module.exports = morphElement;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var nextTick = _require.utils.nextTick;

	var Set = __webpack_require__(5);

	var removedNodes = new Set();
	var addedNodes = new Set();

	var releasePlanned = false;

	var listeners = [];

	function registerRemovedNode(node) {
		if (addedNodes.has(node)) {
			addedNodes['delete'](node);
		} else {
			removedNodes.add(node);

			if (!releasePlanned) {
				releasePlanned = true;
				nextTick(release);
			}
		}
	}

	function registerAddedNode(node) {
		if (removedNodes.has(node)) {
			removedNodes['delete'](node);
		} else {
			addedNodes.add(node);

			if (!releasePlanned) {
				releasePlanned = true;
				nextTick(release);
			}
		}
	}

	function release() {
		releasePlanned = false;

		if (removedNodes.size || addedNodes.size) {
			for (var i = 0, l = listeners.length; i < l; i++) {
				listeners[i](removedNodes, addedNodes);
			}

			removedNodes.clear();
			addedNodes.clear();
		}
	}

	/**
	 * @typsign (listener: (removedNodes: Set<Node>, addedNodes: Set<Node>));
	 */
	function observeDOM(listener) {
		listeners.push(listener);
	}

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var docEl = document.documentElement;

	if (MutationObserver) {
		document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
			document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

			var obs = new MutationObserver(function (mutations) {
				for (var i = 0, l = mutations.length; i < l; i++) {
					var mutation = mutations[i];
					var _removedNodes = mutation.removedNodes;
					var _addedNodes = mutation.addedNodes;

					for (var _i = 0, _l = _removedNodes.length; _i < _l; _i++) {
						registerRemovedNode(_removedNodes[_i]);
					}
					for (var _i2 = 0, _l2 = _addedNodes.length; _i2 < _l2; _i2++) {
						registerAddedNode(_addedNodes[_i2]);
					}
				}
			});

			obs.observe(docEl, {
				childList: true,
				subtree: true
			});
		});
	} else {
		docEl.addEventListener('DOMNodeRemoved', function (evt) {
			registerRemovedNode(evt.target);
		}, false);
		docEl.addEventListener('DOMNodeInserted', function (evt) {
			registerAddedNode(evt.target);
		}, false);
	}

	module.exports = observeDOM;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var Map = _require.Map;
	var createClass = _require.utils.createClass;

	var Set = window.Set;

	if (!Set || Set.toString().indexOf('[native code]') == -1) {
		Set = createClass({
			constructor: function constructor() {
				this._entries = new Map();
				this.size = 0;
			},

			has: function has(value) {
				return this._entries.has(value);
			},

			add: function add(value) {
				this._entries.set(value, value);
				this.size = this._entries.size;
				return this;
			},

			'delete': function _delete(value) {
				if (this._entries['delete'](value)) {
					this.size--;
					return true;
				}

				return false;
			},

			clear: function clear() {
				this._entries.clear();
				this.size = 0;
			},

			forEach: function forEach(cb, context) {
				var _this = this;

				if (context == null) {
					context = window;
				}

				this._entries.forEach(function (value) {
					cb.call(context, value, value, _this);
				});
			}
		});
	}

	module.exports = Set;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var EventEmitter = _require.EventEmitter;
	var cellx = _require.cellx;
	var _require$utils = _require.utils;
	var logError = _require$utils.logError;
	var mixin = _require$utils.mixin;
	var createClass = _require$utils.createClass;

	var settings = __webpack_require__(2);
	var nextUID = __webpack_require__(7);
	var hasClass = __webpack_require__(8);
	var morphElement = __webpack_require__(3);

	var KEY_COMPONENT = '__rista_component__';
	var KEY_INITIAL_KEY = '__rista_initialKey__';

	/**
	 * @typesign (name: string);
	 */
	function checkName(name) {
		if (!/^[a-z](?:\-?[0-9a-z])*$/i.test(name)) {
			throw new TypeError('Component name "' + name + '" is not valid');
		}
	}

	/**
	 * @typesign (name: string): string;
	 */
	function hyphenize(name) {
		return name[0].toLowerCase() + name.slice(1).replace(/([A-Z])/g, '-$1').replace('--', '-').toLowerCase();
	}

	/**
	 * @typesign (name: string): string;
	 */
	function pascalize(name) {
		return name[0].toUpperCase() + name.slice(1).replace(/\-([0-9a-z])/gi, function (match, chr) {
			return chr.toUpperCase();
		});
	}

	var componentSubclasses = Object.create(null);
	var selector = '[rt-is]';

	/**
	 * @typesign (name: string): Function|undefined;
	 */
	function getComponentSubclass(name) {
		return componentSubclasses[hyphenize(name)];
	}

	function _registerComponentSubclass(name, componentSubclass) {
		if (componentSubclasses[name]) {
			throw new TypeError('Component "' + name + '" is already registered');
		}

		componentSubclasses[name] = componentSubclass;
		selector += ', ' + name;

		return componentSubclass;
	}

	/**
	 * @typesign (name: string, componentSubclass: Function): Function;
	 */
	function registerComponentSubclass(name, componentSubclass) {
		checkName(name);
		return _registerComponentSubclass(hyphenize(name), componentSubclass);
	}

	/**
	 * @typesign (name: string, description: {
	 *     blockName?: string,
	 *     preinit?: (),
	 *     render?: (): string,
	 *     init?: (),
	 *     canComponentMorph?: (): boolean,
	 *     dispose?: ()
	 * }): Function;
	 */
	function defineComponentSubclass(name, description) {
		checkName(name);

		var pName = pascalize(name);
		var hName = hyphenize(name);

		var constr = Function('Component', 'return function ' + pName + '(block) { Component.call(this, block); };')(Component);

		var proto = constr.prototype = Object.create(Component.prototype);

		mixin(proto, description);
		proto.constructor = constr;

		if (!proto.blockName) {
			switch (settings.blockNameCase) {
				case 'camel':
					{
						proto.blockName = pName[0].toLowerCase() + pName.slice(1);
						break;
					}
				case 'pascal':
					{
						proto.blockName = pName;
						break;
					}
				case 'hyphen':
					{
						proto.blockName = hName;
						break;
					}
			}
		}

		return _registerComponentSubclass(hName, constr);
	}

	/**
	 * @typesign (block: HTMLElement): string;
	 */
	function getBlockKey(block) {
		var attrs = block.attributes;
		var key = [];

		for (var i = attrs.length; i;) {
			var attr = attrs[--i];
			key.push(attr.name + '=' + attr.value);
		}

		return JSON.stringify(key.sort());
	}

	/**
	 * @typesign (component: rista.Component);
	 */
	function morphComponentContent(component) {
		var el = document.createElement('div');
		el.innerHTML = component._componentContent();

		morphElement(component.block, el, {
			contentOnly: true,

			getElementKey: function getElementKey(el) {
				if (el.hasAttribute('key')) {
					return el.getAttribute('key');
				}

				if (el.hasAttribute('rt-is') || getComponentSubclass(el.tagName.toLowerCase())) {
					var key = el[KEY_INITIAL_KEY];

					if (key) {
						return key;
					}

					key = el[KEY_INITIAL_KEY] = getBlockKey(el);

					return key;
				}
			},

			onBeforeMorphElement: function onBeforeMorphElement(el) {
				var component = el[KEY_COMPONENT];

				if (component) {
					if (component.canComponentMorph) {
						return component.canComponentMorph();
					}

					return false;
				}
			},

			onBeforeMorphElementContent: function onBeforeMorphElementContent(el) {
				if (!el[KEY_INITIAL_KEY] && (el.hasAttribute('rt-is') || getComponentSubclass(el.tagName.toLowerCase()))) {
					el[KEY_INITIAL_KEY] = getBlockKey(el);
				}
			},

			onNodeDiscarded: function onNodeDiscarded(node) {
				if (node[KEY_COMPONENT]) {
					node[KEY_COMPONENT].destroy();
				}
			}
		});
	}

	/**
	 * @class rista.Component
	 * @extends {cellx.EventEmitter}
	 *
	 * @typesign new (block: HTMLElement): rista.Component;
	 */
	var Component = createClass({
		Extends: EventEmitter,

		Static: {
			KEY_COMPONENT: KEY_COMPONENT,

			getSubclass: getComponentSubclass,
			registerSubclass: registerComponentSubclass,

			defineSubclass: defineComponentSubclass,

			getSelector: function getSelector() {
				return selector;
			}
		},

		/**
	  * For override.
	  * @type {string}
	  */
		blockName: undefined,

		/**
	  * @final
	  * @type {cellx<string>}
	  */
		_componentContent: cellx(function () {
			var content = this.render();
			return Array.isArray(content) ? content.join('') : content;
		}),

		constructor: function constructor(block) {
			if (block[KEY_COMPONENT]) {
				throw new TypeError('Element is already used as a block of component');
			}

			/**
	   * @type {Array<{ dispose: () }>}
	   */
			this._disposables = {};

			/**
	   * Корневой элемент компонента.
	   * @type {HTMLElement}
	   */
			this.block = block;
			block[KEY_COMPONENT] = this;

			this.destroyed = false;

			if (!hasClass(block, this.blockName)) {
				block.className = this.blockName + ' ' + block.className;
			}

			if (this.preinit) {
				this.preinit();
			}

			if (this.render) {
				morphComponentContent(this);
				this._componentContent('on', 'change', this._onComponentContentChange);
			}

			if (this.init) {
				this.init();
			}
		},

		/**
	  * @override
	  */
		_handleEvent: function _handleEvent(evt) {
			EventEmitter.prototype._handleEvent.call(this, evt);

			var parent = this.getParent();

			if (parent && evt.bubbles !== false && !evt.isPropagationStopped) {
				if (!parent.destroyed) {
					parent._handleEvent(evt);
				}
			}
		},

		/**
	  * For override.
	  */
		preinit: null,
		/**
	  * For override.
	  */
		render: null,
		/**
	  * For override.
	  */
		init: null,
		/**
	  * For override.
	  */
		dispose: null,

		_onComponentContentChange: function _onComponentContentChange() {
			morphComponentContent(this);
		},

		/**
	  * @typesign (): HTMLElement|null;
	  */
		getParent: function getParent() {
			var node = this.block;

			while (node = node.parentNode) {
				if (node[KEY_COMPONENT]) {
					return node[KEY_COMPONENT];
				}
			}

			return null;
		},

		/**
	  * @typesign (): Array<HTMLElement>;
	  */
		getDescendants: function getDescendants() {
			return Array.prototype.map.call(this.block.querySelectorAll(selector), function (block) {
				return block[KEY_COMPONENT];
			}).filter(function (component) {
				return component;
			});
		},

		/**
	  * @typesign (selector: string): $|NodeList;
	  */
		$: (function (_$) {
			function $(_x) {
				return _$.apply(this, arguments);
			}

			$.toString = function () {
				return _$.toString();
			};

			return $;
		})(function (selector) {
			selector = selector.split('&');

			selector = selector.length == 1 ? selector[0] : selector.join('.' + this.blockName);

			if (typeof $ == 'function' && $.fn) {
				return $(this.block).find(selector);
			}

			return this.block.querySelectorAll(selector);
		}),

		/**
	  * @typesign (name: string): Array<rista.Component>;
	  */
		$$: function $$(name) {
			var els = this.block.querySelectorAll('[name=' + name + ']');
			var components = [];

			for (var i = 0, l = els.length; i < l; i++) {
				var component = els[i][KEY_COMPONENT];

				if (component) {
					components.push(component);
				}
			}

			return components;
		},

		/**
	  * @typesign (method: string, ...args: Array): Array;
	  */
		broadcast: function broadcast(method) {
			var args = Array.prototype.slice.call(arguments, 1);

			return this.getDescendants().map(function (descendant) {
				if (!descendant.destroyed && typeof descendant[method] == 'function') {
					return descendant[method].apply(descendant, args);
				}
			});
		},

		listenTo: function listenTo(target, type, listener, context) {
			var _this2 = this;

			var listenings = undefined;

			if (Array.isArray(target) || target.addClass && target.append) {
				listenings = [];

				for (var i = 0, l = target.length; i < l; i++) {
					listenings.push(this.listenTo(target[i], type, listener, context));
				}
			} else if (typeof type == 'object') {
				listenings = [];

				if (Array.isArray(type)) {
					var types = type;

					for (var i = 0, l = types.length; i < l; i++) {
						listenings.push(this.listenTo(target, types[i], listener, context));
					}
				} else {
					var listeners = type;

					context = listener;

					for (var _type in listeners) {
						listenings.push(this.listenTo(target, _type, listeners[_type], context));
					}
				}
			} else if (Array.isArray(listener)) {
				listenings = [];

				var listeners = listener;

				for (var i = 0, l = listeners.length; i < l; i++) {
					listenings.push(this.listenTo(target, type, listeners[i], context));
				}
			} else if (typeof listener == 'object') {
				listenings = [];

				var listeners = listener;

				for (var _name in listeners) {
					listenings.push(this.listenTo(target[_name]('unwrap', 0), type, listeners[_name], context));
				}
			} else {
				return this._listenTo(target, type, listener, context);
			}

			var id = nextUID();

			var stopListening = function stopListening() {
				for (var i = listenings.length; i;) {
					listenings[--i].stop();
				}

				delete _this2._disposables[id];
			};

			var listening = this._disposables[id] = {
				stop: stopListening,
				dispose: stopListening
			};

			return listening;
		},

		/**
	  * @typesign (
	  *     target: cellx.EventEmitter|EventTarget,
	  *     type: string,
	  *     listener: (evt: cellx~Event): boolean|undefined,
	  *     context?: Object
	  * ): { stop: (), dispose: () };
	  */
		_listenTo: function _listenTo(target, type, listener, context) {
			var _this3 = this;

			if (!context) {
				context = this;
			}

			if (target instanceof EventEmitter) {
				target.on(type, listener, context);
			} else if (typeof target.addEventListener == 'function') {
				if (target != context) {
					listener = listener.bind(context);
				}

				target.addEventListener(type, listener);
			} else {
				throw new TypeError('Unable to add a listener');
			}

			var id = nextUID();

			var stopListening = function stopListening() {
				if (_this3._disposables[id]) {
					if (target instanceof EventEmitter) {
						target.off(type, listener, context);
					} else {
						target.removeEventListener(type, listener);
					}

					delete _this3._disposables[id];
				}
			};

			var listening = this._disposables[id] = {
				stop: stopListening,
				dispose: stopListening
			};

			return listening;
		},

		/**
	  * @typesign (cb: Function, delay: uint): { clear: (), dispose: () };
	  */
		setTimeout: (function (_setTimeout) {
			function setTimeout(_x2, _x3) {
				return _setTimeout.apply(this, arguments);
			}

			setTimeout.toString = function () {
				return _setTimeout.toString();
			};

			return setTimeout;
		})(function (cb, delay) {
			var _this4 = this;

			var id = nextUID();

			var timeoutId = setTimeout(function () {
				delete _this4._disposables[id];
				cb.call(_this4);
			}, delay);

			var _clearTimeout = function _clearTimeout() {
				if (_this4._disposables[id]) {
					clearTimeout(timeoutId);
					delete _this4._disposables[id];
				}
			};

			var timeout = this._disposables[id] = {
				clear: _clearTimeout,
				dispose: _clearTimeout
			};

			return timeout;
		}),

		/**
	  * @typesign (cb: Function, delay: uint): { clear: (), dispose: () };
	  */
		setInterval: (function (_setInterval) {
			function setInterval(_x4, _x5) {
				return _setInterval.apply(this, arguments);
			}

			setInterval.toString = function () {
				return _setInterval.toString();
			};

			return setInterval;
		})(function (cb, delay) {
			var _this5 = this;

			var id = nextUID();

			var intervalId = setInterval(function () {
				cb.call(_this5);
			}, delay);

			var _clearInterval = function _clearInterval() {
				if (_this5._disposables[id]) {
					clearInterval(intervalId);
					delete _this5._disposables[id];
				}
			};

			var interval = this._disposables[id] = {
				clear: _clearInterval,
				dispose: _clearInterval
			};

			return interval;
		}),

		/**
	  * @typesign (cb: Function): Function{ cancel: (), dispose: () };
	  */
		registerCallback: function registerCallback(cb) {
			var _this6 = this;

			var id = nextUID();
			var _this = this;

			var callback = function callback() {
				if (_this._disposables[id]) {
					delete _this._disposables[id];
					return cb.apply(_this, arguments);
				}
			};

			var cancelCallback = function cancelCallback() {
				delete _this6._disposables[id];
			};

			callback.cancel = cancelCallback;
			callback.dispose = cancelCallback;

			this._disposables[id] = callback;

			return callback;
		},

		/**
	  * @typesign ();
	  */
		destroy: function destroy() {
			if (this.destroyed) {
				return;
			}

			this._componentContent('dispose', 0);

			var disposables = this._disposables;

			for (var id in disposables) {
				disposables[id].dispose();
			}

			if (this.dispose) {
				try {
					this.dispose();
				} catch (err) {
					logError(err);
				}
			}

			this.block[KEY_COMPONENT] = null;

			this.destroyed = true;
		}
	});

	module.exports = Component;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var uidCounter = 0;

	/**
	 * @typesign (): string;
	 */
	function nextUID() {
	  return String(++uidCounter);
	}

	module.exports = nextUID;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * @typesign (el: HTMLElement, name: string): boolean;
	 */
	"use strict";

	var hasClass = undefined;

	if (document.documentElement.classList) {
		hasClass = function (el, name) {
			return el.classList.contains(name);
		};
	} else {
		(function () {
			var reNotWhite = /\S+/g;

			hasClass = function (el, name) {
				return (el.className.match(reNotWhite) || []).indexOf(name) != -1;
			};
		})();
	}

	module.exports = hasClass;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var logError = _require.utils.logError;

	var _require2 = __webpack_require__(6);

	var KEY_COMPONENT = _require2.KEY_COMPONENT;
	var getComponentSubclass = _require2.getSubclass;
	var getComponentSelector = _require2.getSelector;

	/**
	 * @typesign (el: HTMLElement): Array<HTMLElement>;
	 */
	function findBlocks(el) {
		var blocks = [];

		if (el.hasAttribute('rt-is') || getComponentSubclass(el.tagName.toLowerCase())) {
			blocks.push(el);
		}

		blocks.push.apply(blocks, el.querySelectorAll(getComponentSelector()));

		return blocks;
	}

	/**
	 * @typesign (el: HTMLElement);
	 */
	function applyComponents(el) {
		var blocks = findBlocks(el);

		for (var i = blocks.length; i;) {
			var block = blocks[--i];

			if (!block[KEY_COMPONENT]) {
				var componentSubclass = getComponentSubclass(block.getAttribute('rt-is') || block.tagName.toLowerCase());

				if (componentSubclass) {
					try {
						new componentSubclass(block);
					} catch (err) {
						logError(err);
					}
				}
			}
		}
	}

	/**
	 * @typesign (el: HTMLElement);
	 */
	function destroyComponents(el) {
		var blocks = findBlocks(el);

		for (var i = blocks.length; i;) {
			var component = blocks[--i][KEY_COMPONENT];

			if (component) {
				component.destroy();
			}
		}
	}

	module.exports = {
		applyComponents: applyComponents,
		destroyComponents: destroyComponents
	};

/***/ }
/******/ ])
});
;