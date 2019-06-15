import OurVue__default from 'vue';



var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var O = 'object';
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == O && globalThis) ||
  check(typeof window == O && window) ||
  check(typeof self == O && self) ||
  check(typeof commonjsGlobal == O && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var hide = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    hide(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.1.3',
  mode: 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var functionToString = shared('native-function-to-string', Function.toString);

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(functionToString.call(WeakMap));

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store = new WeakMap$1();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(functionToString).split('toString');

shared('inspectSource', function (it) {
  return functionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else hide(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
});
});

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$1 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod$1(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$1(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      hide(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var Symbol$1 = global_1.Symbol;
var store$1 = shared('wks');

var wellKnownSymbol = function (name) {
  return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
    || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var IE_PROTO$1 = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

hiddenKeys[IE_PROTO$1] = true;

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var iterators = {};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var charAt = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var bindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var ITERATOR$3 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$3]
    || it['@@iterator']
    || iterators[classof(it)];
};

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator;
  if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    result = new C();
    for (;!(step = iterator.next()).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$4] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$4] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: arrayFrom
});

var from_1 = path.Array.from;

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
_export({ target: 'Array', stat: true }, {
  isArray: isArray
});

var isArray$1 = path.Array.isArray;

var isArray$2 = isArray$1;

// @ts-ignore
const isArray$3 = Array.isArray || isArray$2;
// --- Instance ---
const arrayIncludes$1 = (array, value) => array.indexOf(value) !== -1;
const concat = (...args) => Array.prototype.concat.apply([], args);

var nativeAssign = Object.assign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
// should work with symbols and should have deterministic property order (V8 bug)
var objectAssign = !nativeAssign || fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var assign = path.Object.assign;

// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
var sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

// `Object.is` method
// https://tc39.github.io/ecma262/#sec-object.is
_export({ target: 'Object', stat: true }, {
  is: sameValue
});

var is = path.Object.is;

const getOwnPropertyNames = Object.getOwnPropertyNames;
const keys$1 = Object.keys;
const freeze = Object.freeze;
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * Note object could be a complex type like array, date, etc.
 */
const isObject$1 = (obj) => obj !== null && typeof obj === 'object';
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
/**
 * Deep-freezes and object, making it immutable / read-only.
 * Returns the same object passed-in, but frozen.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
const deepFreeze = (obj) => {
    let o = obj;
    // Retrieve the property names defined on object
    const props = getOwnPropertyNames(obj);
    // Freeze properties before freezing self
    for (let prop of props) {
        let value = o[prop];
        o[prop] = value && isObject$1(value) ? deepFreeze(value) : value;
    }
    return freeze(obj);
};
// --- "Instance" ---
const hasOwnProperty$1 = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const cloneDeep = (obj, defaultValue = obj) => {
    if (isArray$3(obj)) {
        return obj.reduce((result, val) => [...result, cloneDeep(val, val)], []);
    }
    if (isPlainObject(obj)) {
        return keys$1(obj).reduce((result, key) => (Object.assign({}, result, { [key]: cloneDeep(obj[key], obj[key]) })), {});
    }
    return defaultValue;
};

/**
 * Utilities to get information about the current environment
 */
const hasWindowSupport = typeof window !== 'undefined';
const hasDocumentSupport = typeof document !== 'undefined';
const hasNavigatorSupport = typeof navigator !== 'undefined';
const isBrowser = hasWindowSupport && hasDocumentSupport && hasNavigatorSupport;
// Browser type sniffing
const userAgent = isBrowser ? window.navigator.userAgent.toLowerCase() : '';
const isJSDOM = userAgent.indexOf('jsdom') > 0;
const isIE = /msie|trident/.test(userAgent);
// Determine if the browser supports the option passive for events
const hasPassiveEventSupport = (() => {
    let passiveEventSupported = false;
    if (isBrowser) {
        try {
            const options = {
                get passive() {
                    // This function will be called when the browser
                    // attempts to access the passive property.
                    /* istanbul ignore next: will never be called in JSDOM */
                    passiveEventSupported = true;
                    return undefined;
                }
            };
            window.addEventListener('test', options, options);
            window.removeEventListener('test', options, options);
        }
        catch (err) {
            /* istanbul ignore next: will never be called in JSDOM */
            passiveEventSupported = false;
        }
    }
    return passiveEventSupported;
})();
const hasTouchSupport = isBrowser && ('ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0);
const hasPointerEventSupport = isBrowser && Boolean(window.PointerEvent || window.MSPointerEvent);
const hasIntersectionObserverSupport = isBrowser &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    // Edge 15 and UC Browser lack support for `isIntersecting`
    // but we an use intersectionRatio > 0 instead
    // 'isIntersecting' in window.IntersectionObserverEntry.prototype &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype;
const getEnv = (key, fallback = null) => {
    const env = typeof process !== 'undefined' && process ? process.env || {} : {};
    if (!key) {
        /* istanbul ignore next */
        return env;
    }
    return env[key] || fallback;
};
const getNoWarn = () => getEnv('BOOTSTRAP_VUE_NO_WARN');

/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */
const warn = (message) => /* istanbul ignore next */ {
    if (!getNoWarn()) {
        console.warn(`[BootstrapVue warn]: ${message}`);
    }
};

//
// Single point of contact for Vue
//
// TODO:
//   Conditionally import Vue if no global Vue
//
const Vue = OurVue__default;
function functionalComponent(options) {
    return Vue.extend(Object.assign({}, options, { functional: true }));
}
/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */
const checkMultipleVue = (() => {
    let checkMultipleVueWarned = false;
    const MULTIPLE_VUE_WARNING = [
        'Multiple instances of Vue detected!',
        'You may need to set up an alias for Vue in your bundler config.',
        'See: https://bootstrap-vue.js.org/docs#using-module-bundlers'
    ].join('\n');
    return (Vue) => {
        /* istanbul ignore next */
        if (!checkMultipleVueWarned && OurVue__default !== Vue && !isJSDOM) {
            warn(MULTIPLE_VUE_WARNING);
        }
        checkMultipleVueWarned = true;
    };
})();

/**
 * Get property defined by dot/array notation in string.
 *
 * @link https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf#gistcomment-1935901
 *
 * @param {Object} obj
 * @param {string|Array} path
 * @param {*} defaultValue (optional)
 * @return {*}
 */
const get$1 = (obj, path, defaultValue = null) => {
    // Handle array of path values
    path = isArray$3(path) ? path.join('.') : path;
    // If no path or no object passed
    if (!path || !isObject$1(obj)) {
        return defaultValue;
    }
    // Handle edge case where user has dot(s) in top-level item field key
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2762
    if (obj.hasOwnProperty(path)) {
        return obj[path];
    }
    // Handle string array notation (numeric indices only)
    path = String(path).replace(/\[(\d+)]/g, '.$1');
    const steps = path.split('.').filter(Boolean);
    // Handle case where someone passes a string of only dots
    if (steps.length === 0) {
        return defaultValue;
    }
    // Traverse path in object to find result
    return steps.every(step => isObject$1(obj) && obj.hasOwnProperty(step) && (obj = obj[step]) != null)
        ? obj
        : defaultValue;
};

const BV_CONFIG_PROP_NAME = '$bvConfig';
// General BootstrapVue configuration
//
// BREAKPOINT DEFINITIONS
//
// Some components (BCol and BFormGroup) generate props based on breakpoints, and this
// occurs when the component is first loaded (evaluated), which may happen before the
// config is created/modified
//
// To get around this we make these components async (lazy evaluation)
// The component definition is only called/executed when the first access to the
// component is used (and cached on subsequent uses)
//
// See: https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components
//
// PROP DEFAULTS
//
// For default values on props, we use the default value factory function approach so
// so that the default values are pulled in at each component instantiation
//
//  props: {
//    variant: {
//      type: String,
//      default: () => getConfigComponent('BAlert', 'variant')
//    }
//  }
// prettier-ignore
var DEFAULTS = deepFreeze({
    // Breakpoints
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    // Component Specific defaults are keyed by the component
    // name (PascalCase) and prop name (camelCase)
    BAlert: {
        dismissLabel: 'Close',
        variant: 'info'
    },
    BBadge: {
        variant: 'secondary'
    },
    BButton: {
        variant: 'secondary'
    },
    BButtonClose: {
        // `textVariant` is `null` to inherit the current text color
        textVariant: null,
        ariaLabel: 'Close'
    },
    BCardSubTitle: {
        // BCard and BCardBody also inherit this prop
        subTitleTextVariant: 'muted'
    },
    BCarousel: {
        labelPrev: 'Previous Slide',
        labelNext: 'Next Slide',
        labelGotoSlide: 'Goto Slide',
        labelIndicators: 'Select a slide to display'
    },
    BDropdown: {
        toggleText: 'Toggle Dropdown',
        variant: 'secondary',
        splitVariant: null
    },
    BFormFile: {
        browseText: 'Browse',
        // Chrome default file prompt
        placeholder: 'No file chosen',
        dropPlaceholder: 'Drop files here'
    },
    BFormText: {
        textVariant: 'muted'
    },
    BImg: {
        blankColor: 'transparent'
    },
    BImgLazy: {
        blankColor: 'transparent'
    },
    BJumbotron: {
        bgVariant: null,
        borderVariant: null,
        textVariant: null
    },
    BListGroupItem: {
        variant: null
    },
    BModal: {
        titleTag: 'h5',
        size: 'md',
        headerBgVariant: null,
        headerBorderVariant: null,
        headerTextVariant: null,
        headerCloseVariant: null,
        bodyBgVariant: null,
        bodyTextVariant: null,
        footerBgVariant: null,
        footerBorderVariant: null,
        footerTextVariant: null,
        cancelTitle: 'Cancel',
        cancelVariant: 'secondary',
        okTitle: 'OK',
        okVariant: 'primary',
        headerCloseLabel: 'Close'
    },
    BNavbar: {
        variant: null
    },
    BNavbarToggle: {
        label: 'Toggle navigation'
    },
    BProgress: {
        variant: null
    },
    BProgressBar: {
        variant: null
    },
    BSpinner: {
        variant: null
    },
    BTable: {
        selectedVariant: 'primary',
        headVariant: null,
        footVariant: null
    },
    BToast: {
        toaster: 'b-toaster-top-right',
        autoHideDelay: 5000,
        variant: null,
        toastClass: null,
        headerClass: null,
        bodyClass: null,
        solid: false
    },
    BToaster: {
        ariaLive: null,
        ariaAtomic: null,
        role: null
    },
    BTooltip: {
        delay: 0,
        boundary: 'scrollParent',
        boundaryPadding: 5
    },
    BPopover: {
        delay: 0,
        boundary: 'scrollParent',
        boundaryPadding: 5
    }
});

// --- Constants ---
const VueProto = OurVue__default.prototype;

const toType = (val) => typeof val;
const isUndefined = (val) => val === undefined;
const isNull = (val) => val === null;
const isFunction = (val) => toType(val) === 'function';
const isString = (val) => toType(val) === 'string';
const isVueElement = (val) => val.__vue__ && val instanceof HTMLElement;

// --- Constants ---
const w = hasWindowSupport ? window : {};
const elProto = typeof Element !== 'undefined' ? Element.prototype : {};
// --- Normalization utils ---
// See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
/* istanbul ignore next */
const matchesEl = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector;
// See: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
/* istanbul ignore next */
const closestEl = elProto.closest ||
    function (sel) {
        let el = this;
        do {
            // Use our "patched" matches function
            if (matches(el, sel)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (!isNull(el) && el.nodeType === Node.ELEMENT_NODE);
        return null;
    };
// `requestAnimationFrame()` convenience method
// We don't have a version for cancelAnimationFrame, but we don't call it anywhere
const requestAF = w.requestAnimationFrame ||
    w.webkitRequestAnimationFrame ||
    w.mozRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    w.oRequestAnimationFrame ||
    (cb => {
        // Fallback, but not a true polyfill
        // All browsers we support (other than Opera Mini) support
        // `requestAnimationFrame()` without a polyfill
        /* istanbul ignore next */
        return setTimeout(cb, 16);
    });
const MutationObs = w.MutationObserver ||
    w.WebKitMutationObserver ||
    w.MozMutationObserver ||
    null;
// --- Utils ---
// Normalize event options based on support of passive option
// Exported only for testing purposes
// Option key in object is capture not useCapture
const parseEventOptions = (options) => {
    /* istanbul ignore else: can't test in JSDOM, as it supports passive */
    if (hasPassiveEventSupport) {
        return isObject$1(options) ? options : { capture: Boolean(options || false) };
    }
    else {
        // Need to translate to actual Boolean value
        return Boolean(isObject$1(options) ? options.capture : options);
    }
};
// Attach an event listener to an element
const eventOn = (el, evtName, handler, options) => {
    if (el && el.addEventListener) {
        el.addEventListener(evtName, handler, parseEventOptions(options));
    }
};
// Remove an event listener from an element
const eventOff = (el, evtName, handler, options) => {
    if (el && el.removeEventListener) {
        el.removeEventListener(evtName, handler, parseEventOptions(options));
    }
};
// Determine if an element is an HTML Element
const isElement = (el) => Boolean(el && el.nodeType === Node.ELEMENT_NODE);
// Determine if an element matches a selector
const matches = (el, selector) => {
    if (!isElement(el)) {
        return false;
    }
    return matchesEl.call(el, selector);
};
// Set an attribute on an element
const setAttr = (el, attr, value) => {
    if (attr && isElement(el)) {
        el.setAttribute(attr, value);
    }
};
// Remove an attribute from an element
const removeAttr = (el, attr) => {
    if (attr && isElement(el)) {
        el.removeAttribute(attr);
    }
};

/**
 * Convert a value to a string that can be rendered.
 */
const toString$1 = (val, spaces = 2) => {
    return isUndefined(val) || isNull(val)
        ? ''
        : isArray$3(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
            ? JSON.stringify(val, null, spaces)
            : String(val);
};

const ANCHOR_TAG = 'a';
// Precompile RegExp
const commaRE = /%2C/g;
const encodeReserveRE = /[!'()*]/g;
// Method to replace reserved chars
const encodeReserveReplacer = (c) => '%' + c.charCodeAt(0).toString(16);
// Fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = (str) => encodeURIComponent(toString$1(str))
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ',');
// Stringifies an object of query parameters
// See: https://github.com/vuejs/vue-router/blob/dev/src/util/query.js
const stringifyQueryObj = (obj) => {
    if (!isPlainObject(obj)) {
        return '';
    }
    const query = keys$1(obj)
        .map(key => {
        const val = obj[key];
        if (isUndefined(val)) {
            return '';
        }
        else if (isNull(val)) {
            return encode(key);
        }
        else if (isArray$3(val)) {
            return val
                .reduce((results, val2) => {
                if (isNull(val2)) {
                    results.push(encode(key));
                }
                else if (!isUndefined(val2)) {
                    // Faster than string interpolation
                    results.push(encode(key) + '=' + encode(val2));
                }
                return results;
            }, [])
                .join('&');
        }
        // Faster than string interpolation
        return encode(key) + '=' + encode(val);
    })
        /* must check for length, as we only want to filter empty strings, not things that look falsey! */
        .filter(x => x.length > 0)
        .join('&');
    return query ? `?${query}` : '';
};
const isRouterLink = (tag) => tag !== ANCHOR_TAG;
const computeTag = ({ to, disabled } = {}, thisOrParent) => {
    return thisOrParent.$router && to && !disabled
        ? thisOrParent.$nuxt
            ? 'nuxt-link'
            : 'router-link'
        : ANCHOR_TAG;
};
const computeRel = ({ target, rel } = {}) => {
    if (target === '_blank' && isNull(rel)) {
        return 'noopener';
    }
    return rel || null;
};
const computeHref = ({ href, to } = {}, tag = ANCHOR_TAG, fallback = '#', toFallback = '/') => {
    // We've already checked the $router in computeTag(), so isRouterLink() indicates a live router.
    // When deferring to Vue Router's router-link, don't use the href attribute at all.
    // We return null, and then remove href from the attributes passed to router-link
    if (isRouterLink(tag)) {
        return null;
    }
    // Return `href` when explicitly provided
    if (href) {
        return href;
    }
    // Reconstruct `href` when `to` used, but no router
    if (to) {
        // Fallback to `to` prop (if `to` is a string)
        if (isString(to)) {
            return to || toFallback;
        }
        // Fallback to `to.path + to.query + to.hash` prop (if `to` is an object)
        let _to = to;
        if (isPlainObject(to) && (_to.path || _to.query || _to.hash)) {
            const path = toString$1(_to.path);
            const query = stringifyQueryObj(_to.query);
            let hash = toString$1(_to.hash);
            hash = !hash || hash.charAt(0) === '#' ? hash : `#${hash}`;
            return `${path}${query}${hash}` || toFallback;
        }
    }
    // If nothing is provided return the fallback
    return fallback;
};

const allListenTypes = { hover: true, click: true, focus: true };
const BVBoundListeners = '__BV_boundEventListeners__';
const getTargets = (binding) => {
    const targets = keys$1(binding.modifiers || {}).filter(t => !allListenTypes[t]);
    if (binding.value) {
        targets.push(binding.value);
    }
    return targets;
};
const bindTargets = (vnode, binding, listenTypes, fn) => {
    const targets = getTargets(binding);
    const listener = () => {
        fn({ targets, vnode });
    };
    keys$1(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            let el = vnode.elm;
            eventOn(el, type, listener);
            const boundListeners = el[BVBoundListeners] || {};
            boundListeners[type] = boundListeners[type] || [];
            boundListeners[type].push(listener);
            el[BVBoundListeners] = boundListeners;
        }
    });
    // Return the list of targets
    return targets;
};
const unbindTargets = (vnode, binding, listenTypes) => {
    keys$1(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            let el = vnode.elm;
            const boundListeners = el[BVBoundListeners] && el[BVBoundListeners][type];
            if (boundListeners) {
                boundListeners.forEach(listener => eventOff(el, type, listener));
                delete el[BVBoundListeners][type];
            }
        }
    });
};

export { BV_CONFIG_PROP_NAME as B, DEFAULTS as D, OurVue__default as O, isArray$3 as a, isString as b, cloneDeep as c, isUndefined as d, getOwnPropertyNames as e, checkMultipleVue as f, get$1 as g, hasOwnProperty$1 as h, isPlainObject as i, concat as j, keys$1 as k, arrayIncludes$1 as l, functionalComponent as m, computeTag as n, computeHref as o, isRouterLink as p, isVueElement as q, isFunction as r, computeRel as s, bindTargets as t, unbindTargets as u, removeAttr as v, warn as w, setAttr as x };
