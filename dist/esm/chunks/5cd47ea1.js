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

var from_1$1 = from_1;

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
// --- Static ---
const from = Array.from || from_1$1;
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

var assign$1 = assign;

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

// --- Static ---
const assign$2 = Object.assign || assign$1;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const keys$1 = Object.keys;
const defineProperties = Object.defineProperties;
const defineProperty$1 = Object.defineProperty;
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
const readonlyDescriptor = () => ({
    enumerable: true,
    configurable: false,
    writable: false
});
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

class BvEvent {
    constructor(type, eventInit = {}) {
        // super(type, eventInit)
        // Start by emulating native Event constructor.
        if (!type) {
            /* istanbul ignore next */
            throw new TypeError(`Failed to construct '${this.constructor.name}'. 1 argument required, ${arguments.length} given.`);
        }
        // Assign defaults first, the eventInit,
        // and the type last so it can't be overwritten.
        assign$2(this, BvEvent.Defaults, this.constructor.Defaults, eventInit, { type });
        // Freeze some props as readonly, but leave them enumerable.
        defineProperties(this, {
            type: readonlyDescriptor(),
            cancelable: readonlyDescriptor(),
            nativeEvent: readonlyDescriptor(),
            target: readonlyDescriptor(),
            relatedTarget: readonlyDescriptor(),
            vueTarget: readonlyDescriptor(),
            componentId: readonlyDescriptor()
        });
        // Create a private variable using closure scoping.
        let defaultPrevented = false;
        // Recreate preventDefault method. One way setter.
        this.preventDefault = function preventDefault() {
            if (this.cancelable) {
                defaultPrevented = true;
            }
        };
        // Create 'defaultPrevented' publicly accessible prop
        // that can only be altered by the preventDefault method.
        defineProperty$1(this, 'defaultPrevented', {
            enumerable: true,
            get() {
                return defaultPrevented;
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    static get Defaults() {
        return {
            type: '',
            cancelable: true,
            nativeEvent: null,
            target: null,
            relatedTarget: null,
            vueTarget: null,
            componentId: null
        };
    }
}

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
const hasMutationObserverSupport = typeof MutationObserver !== 'undefined' ||
    typeof WebKitMutationObserver !== 'undefined' ||
    typeof MozMutationObserver !== 'undefined';
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
/**
 * Warn when no MutationObserver support is given
 * @param {string} source
 * @returns {boolean} warned
 */
const warnNoMutationObserverSupport = (source) => {
    /* istanbul ignore else */
    if (hasMutationObserverSupport) {
        return false;
    }
    else {
        warn(`${source}: Requires MutationObserver support.`);
        return true;
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
// Method to grab a config value based on a dotted/array notation key
const getConfigValue = (key) => {
    return VueProto[BV_CONFIG_PROP_NAME]
        ? VueProto[BV_CONFIG_PROP_NAME].getConfigValue(key)
        : cloneDeep(get$1(DEFAULTS, key));
};
// Method to grab a config value for a particular component
const getComponentConfig = (cmpName, key) => {
    // Return the particular config value for key for if specified,
    // otherwise we return the full config (or an empty object if not found)
    return key ? getConfigValue(`${cmpName}.${key}`) : getConfigValue(cmpName) || {};
};

const toType = (val) => typeof val;
const isUndefined = (val) => val === undefined;
const isNull = (val) => val === null;
const isFunction = (val) => toType(val) === 'function';
const isString = (val) => toType(val) === 'string';
const isNumber = (val) => toType(val) === 'number';
const isVueElement = (val) => val.__vue__ && val instanceof HTMLElement;

// --- Constants ---
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
const w = hasWindowSupport ? window : {};
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
const d = hasDocumentSupport ? document : {};
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
const elProto = typeof Element !== 'undefined' ? Element.prototype : {};
// --- Normalization utils ---
// Determine if an element is an HTML Element
const isElement = (el) => Boolean(el && el.nodeType === Node.ELEMENT_NODE);
// See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
/* istanbul ignore next */
const matchesEl = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector;
// Determine if an element matches a selector
const matches = (el, selector) => {
    if (!isElement(el)) {
        return false;
    }
    return matchesEl.call(el, selector);
};
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
const requestAF = w.requestAnimationFrame ||
    w.webkitRequestAnimationFrame ||
    w.mozRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    w.oRequestAnimationFrame ||
    ((cb) => {
        // Fallback, but not a true polyfill
        // All browsers we support (other than Opera Mini) support
        // `requestAnimationFrame()` without a polyfill
        /* istanbul ignore next */
        return setTimeout(cb, 16);
    });
const MutationObs = w.MutationObserver || w.WebKitMutationObserver || w.MozMutationObserver || null;
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
// Returns true if the parent element contains the child element
const contains = (parent, child) => {
    if (!parent || !isFunction(parent.contains)) {
        return false;
    }
    return parent.contains(child);
};
// Select all elements matching selector. Returns `[]` if none found
const selectAll = (selector, root) => from((isElement(root) ? root : d).querySelectorAll(selector));
// Select a single element, returns `null` if not found
const select = (selector, root) => !selector ? null : (isElement(root) ? root : d).querySelector(selector) || null;
// Finds closest element matching selector. Returns `null` if not found
const closest = (selector, root) => {
    if (!isElement(root)) {
        return null;
    }
    const el = closestEl.call(root, selector);
    // Emulate jQuery closest and return `null` if match is the passed in element (root)
    return el === root ? null : el;
};
// Add a class to an element
const addClass = (el, className) => {
    // We are checking for `el.classList` existence here since IE 11
    // returns `undefined` for some elements (e.g. SVG elements)
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2713
    if (className && isElement(el) && el.classList) {
        el.classList.add(className);
    }
};
// Remove a class from an element
const removeClass = (el, className) => {
    // We are checking for `el.classList` existence here since IE 11
    // returns `undefined` for some elements (e.g. SVG elements)
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2713
    if (className && isElement(el) && el.classList) {
        el.classList.remove(className);
    }
};
// Test if an element has a class
const hasClass = (el, className) => {
    // We are checking for `el.classList` existence here since IE 11
    // returns `undefined` for some elements (e.g. SVG elements)
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2713
    if (className && isElement(el) && el.classList) {
        return el.classList.contains(className);
    }
    return false;
};
// Set an attribute on an element
const setAttr = (el, attr, value) => {
    if (attr && isElement(el)) {
        el.setAttribute(attr, value || '');
    }
};
// Remove an attribute from an element
const removeAttr = (el, attr) => {
    if (attr && isElement(el)) {
        el.removeAttribute(attr);
    }
};
// Get an attribute value from an element
// Returns `null` if not found
const getAttr = (el, attr) => attr && isElement(el) ? el.getAttribute(attr) : null;
// Return the Bounding Client Rect of an element
// Returns `null` if not an element
/* istanbul ignore next: getBoundingClientRect() doesn't work in JSDOM */
const getBCR = (el) => isElement(el) ? el.getBoundingClientRect() : null;
// Get computed style object for an element
/* istanbul ignore next: getComputedStyle() doesn't work in JSDOM */
const getCS = (el) => 
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
hasWindowSupport && isElement(el) ? w.getComputedStyle(el) : {};
// Return an element's offset with respect to document element
// https://j11y.io/jquery/#v=git&fn=jQuery.fn.offset
const offset = (el) => /* istanbul ignore next: getBoundingClientRect(), getClientRects() doesn't work in JSDOM */ {
    let _offset = { top: 0, left: 0 };
    if (!isElement(el) || el.getClientRects().length === 0) {
        return _offset;
    }
    const bcr = getBCR(el);
    if (bcr) {
        if (el.ownerDocument) {
            const win = el.ownerDocument.defaultView;
            if (win) {
                _offset.top = bcr.top + win.pageYOffset;
                _offset.left = bcr.left + win.pageXOffset;
            }
        }
    }
    return _offset;
};
// Return an element's offset with respect to to it's offsetParent
// https://j11y.io/jquery/#v=git&fn=jQuery.fn.position
const position = (el) => /* istanbul ignore next: getBoundingClientRect() doesn't work in JSDOM */ {
    let _offset = { top: 0, left: 0 };
    if (!isElement(el)) {
        return _offset;
    }
    let parentOffset = { top: 0, left: 0 };
    const elStyles = getCS(el);
    if (elStyles.position === 'fixed') {
        _offset = getBCR(el) || _offset;
    }
    else {
        _offset = offset(el);
        const doc = el.ownerDocument;
        if (doc) {
            let offsetParent = el.offsetParent || doc.documentElement;
            while (offsetParent &&
                (offsetParent === doc.body || offsetParent === doc.documentElement) &&
                getCS(offsetParent).position === 'static') {
                offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== el && offsetParent.nodeType === Node.ELEMENT_NODE) {
                parentOffset = offset(offsetParent);
                const offsetParentStyles = getCS(offsetParent);
                if (offsetParentStyles) {
                    parentOffset.top += parseFloat(offsetParentStyles.borderTopWidth || '');
                    parentOffset.left += parseFloat(offsetParentStyles.borderLeftWidth || '');
                }
            }
        }
    }
    return {
        top: _offset.top - parentOffset.top - parseFloat(elStyles.marginTop || ''),
        left: _offset.left - parentOffset.left - parseFloat(elStyles.marginLeft || '')
    };
};
// Determine if an HTML element is visible - Faster than CSS check
const isVisible = (el) => {
    if (!isElement(el) || !contains(d.body, el)) {
        return false;
    }
    if (el.style.display === 'none') {
        // We do this check to help with vue-test-utils when using v-show
        /* istanbul ignore next */
        return false;
    }
    // All browsers support getBoundingClientRect(), except JSDOM as it returns all 0's for values :(
    // So any tests that need isVisible will fail in JSDOM
    // Except when we override the getBCR prototype in some tests
    const bcr = getBCR(el);
    return Boolean(bcr && bcr.height > 0 && bcr.width > 0);
};
// Determine if an element is disabled
const isDisabled = (el) => !isElement(el) || el.disabled || Boolean(getAttr(el, 'disabled')) || hasClass(el, 'disabled');

/*
 * Utility Methods
 */
// Better var type detection
function toType$1(obj) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
}
// Check config properties for expected types
function typeCheckConfig(componentName, config, configTypes) {
    for (const property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
            const expectedTypes = configTypes[property];
            const value = config[property];
            let valueType = value && isElement(value) ? 'element' : toType$1(value);
            // handle Vue instances
            valueType = value && value._isVue ? 'component' : valueType;
            if (!new RegExp(expectedTypes).test(valueType)) {
                /* istanbul ignore next */
                warn(`${componentName}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}"`);
            }
        }
    }
}
class Directive {
    // Main constructor
    constructor(element, config, $root) {
        this.clearProps();
        this.$element = element;
        this.$timeouts = {};
        this.$intervals = {};
        this.init();
        this.updateConfig(config, $root);
    }
    init() { }
    static get NAME() {
        return '';
    }
    get name() {
        return this.constructor.NAME;
    }
    get defaultConfig() {
        return this.constructor.DEFAULT;
    }
    getStaticProp(name) {
        return this.constructor[name];
    }
    static get DEFAULT() {
        return {};
    }
    static get DEFAULT_TYPE() {
        return undefined;
    }
    static ParseBindings(bindings) {
        return undefined;
    }
    static get ElementHoldingProp() {
        return `__BV_${this.NAME}__`;
    }
    static ValidateApply(element, config, $root) {
        return true;
    }
    static Dispose(el) {
        // Remove PopOver on our element
        let current = el[this.ElementHoldingProp];
        if (current instanceof this) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            current.dispose();
            el[this.ElementHoldingProp] = undefined;
            delete el[this.ElementHoldingProp];
        }
    }
    static Apply(el, bindings, vnode) {
        if (!isBrowser || !this.call) {
            /* istanbul ignore next */
            return;
        }
        let constructor = this;
        let name = this.ElementHoldingProp;
        if (this.ValidateApply(el, bindings, vnode))
            return;
        const config = this.ParseBindings(bindings);
        if (!config)
            return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = el[name];
        if (current instanceof Directive) {
            current.updateConfig(config);
        }
        else {
            if (!vnode.context)
                return // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;
            el[name] = new constructor(el, config, vnode.context.$root);
        }
    }
    preUpdateConfig() { }
    postUpdateConfig() { }
    updateConfig(config, $root) {
        this.preUpdateConfig();
        this.unListen();
        let constructor = this.constructor;
        const cfg = this.processConfig(Object.assign({}, constructor.DEFAULT, config));
        if ($root) {
            this.$root = $root;
        }
        if (constructor.DEFAULT_TYPE) {
            typeCheckConfig(constructor.NAME, cfg, constructor.DEFAULT_TYPE);
        }
        this.$config = cfg;
        this.listen();
        this.postUpdateConfig();
    }
    processConfig(config) {
        return config;
    }
    clearProps() {
        let obj = this;
        if (this.$timeouts)
            Object.entries(obj).forEach(([, value]) => clearTimeout(value));
        if (this.$intervals)
            Object.entries(obj).forEach(([, value]) => clearInterval(value));
        Object.keys(obj).forEach(k => {
            let prop = k;
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                //@ts-ignore
                obj[prop] = undefined;
            }
        });
    }
    dispose() {
        this.preDispose();
        this.unListen();
        this.clearProps();
        this.postDispose();
    }
    preDispose() { }
    postDispose() { }
    listen() { }
    unListen() { }
    activeTimeout(name) {
        return !isUndefined(this.$timeouts) && !isUndefined(this.$timeouts[name]);
    }
    activeInterval(name) {
        return !isUndefined(this.$intervals) && !isUndefined(this.$intervals[name]);
    }
    setTimeout(name, handler, timeout, ...args) {
        if (!this.$timeouts) {
            this.$timeouts = {};
        }
        let id = setTimeout(handler, timeout, ...args);
        this.$timeouts[name] = id;
        return id;
    }
    clearTimeout(name) {
        if (!this.$timeouts) {
            return;
        }
        clearTimeout(this.$timeouts[name]);
    }
    setInterval(name, handler, timeout, ...args) {
        if (!this.$intervals) {
            this.$intervals = {};
        }
        let id = setInterval(handler, timeout, ...args);
        this.$intervals[name] = id;
        return id;
    }
    clearInterval(name) {
        if (!this.$intervals) {
            return;
        }
        clearTimeout(this.$intervals[name]);
        this.$intervals[name] = undefined;
    }
    static GetBvDirective() {
        let constructor = this;
        return {
            bind(el, bindings, vnode) {
                constructor.Apply(el, bindings, vnode);
            },
            inserted(el, bindings, vnode) {
                constructor.Apply(el, bindings, vnode);
            },
            update(el, bindings, vnode) {
                if (bindings.value !== bindings.oldValue) {
                    constructor.Apply(el, bindings, vnode);
                }
            },
            componentUpdated(el, bindings, vnode) {
                if (bindings.value !== bindings.oldValue) {
                    constructor.Apply(el, bindings, vnode);
                }
            },
            unbind(el) {
                constructor.Dispose(el);
            }
        };
    }
}

const noop = () => { };

/**
 * Observe a DOM element changes, falls back to eventListener mode
 * @param {Element} el The DOM element to observe
 * @param {Function} callback callback to be called on change
 * @param {object} [opts={childList: true, subtree: true}] observe options
 * @see http://stackoverflow.com/questions/3219758
 */
const observeDom = (el, callback, opts) => /* istanbul ignore next: difficult to test in JSDOM */ {
    // Handle cases where we might be passed a Vue instance
    el = el ? el.$el || el : null;
    // Early exit when we have no element
    /* istanbul ignore next: difficult to test in JSDOM */
    if (!isElement(el)) {
        return null;
    }
    // Exit and throw a warning when `MutationObserver` isn't available
    if (warnNoMutationObserverSupport('observeDom')) {
        return null;
    }
    // Define a new observer
    const obs = new MutationObs((mutations) => {
        let changed = false;
        // A mutation can contain several change records, so we loop
        // through them to see what has changed
        // We break out of the loop early if any "significant" change
        // has been detected
        for (let i = 0; i < mutations.length && !changed; i++) {
            // The mutation record
            const mutation = mutations[i];
            // Mutation type
            const type = mutation.type;
            // DOM node (could be any DOM node type - HTMLElement, Text, comment, etc.)
            const target = mutation.target;
            // Detect whether a change happened based on type and target
            if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
                // We ignore nodes that are not TEXT (i.e. comments, etc)
                // as they don't change layout
                changed = true;
            }
            else if (type === 'attributes') {
                changed = true;
            }
            else if (type === 'childList' &&
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                // This includes HTMLElement and text nodes being
                // added/removed/re-arranged
                changed = true;
            }
        }
        // We only call the callback if a change that could affect
        // layout/size truely happened
        if (changed) {
            callback();
        }
    });
    // Have the observer observe foo for changes in children, etc
    obs.observe(el, Object.assign({ childList: true, subtree: true }, opts));
    // We return a reference to the observer so that `obs.disconnect()`
    // can be called if necessary
    // To reduce overhead when the root element is hidden
    return obs;
};

const TestPartial1 = () => {
    return 'TEST PARTIAL 1';
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

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.15.0
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser$1 && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser$1 && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction$1(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser$1 && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser$1 && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE$1(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE$1(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE$1(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE$1(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty$2 = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE$1(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE$1(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE$1()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction$1(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser$1 && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty$2(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty$2(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset$1(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty$2({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty$2({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty$2({}, side, reference[side]),
      end: defineProperty$2({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide$1(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset$1,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide$1
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction$1(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

const NAME = 'tooltip';
const CLASS_PREFIX = 'bs-tooltip';
const BS_CLASS_PREFIX_REGEX = new RegExp(`\\b${CLASS_PREFIX}\\S+`, 'g');
const TRANSITION_DURATION = 150;
// Modal $root hidden event
const MODAL_CLOSE_EVENT = 'bv::modal::hidden';
// Modal container for appending tooltip/popover
const MODAL_CLASS = '.modal-content';
const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    TOPLEFT: 'top',
    TOPRIGHT: 'top',
    RIGHTTOP: 'right',
    RIGHTBOTTOM: 'right',
    BOTTOMLEFT: 'bottom',
    BOTTOMRIGHT: 'bottom',
    LEFTTOP: 'left',
    LEFTBOTTOM: 'left'
};
const OffsetMap = {
    AUTO: 0,
    TOPLEFT: -1,
    TOP: 0,
    TOPRIGHT: +1,
    RIGHTTOP: -1,
    RIGHT: 0,
    RIGHTBOTTOM: +1,
    BOTTOMLEFT: -1,
    BOTTOM: 0,
    BOTTOMRIGHT: +1,
    LEFTTOP: -1,
    LEFT: 0,
    LEFTBOTTOM: +1
};
const HoverState = {
    SHOW: 'show',
    OUT: 'out'
};
const ClassName = {
    FADE: 'fade',
    SHOW: 'show'
};
const Selector = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
};
const Defaults$1 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<div class="tooltip-inner"></div>' +
        '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    placement: 'top',
    offset: 0,
    arrowPadding: 6,
    container: false,
    fallbackPlacement: 'flip',
    callbacks: {},
    boundary: 'scrollParent',
    boundaryPadding: 5,
    content: ''
};
// Transition event names
const TransitionEndEvents = {
    WebkitTransition: ['webkitTransitionEnd'],
    MozTransition: ['transitionend'],
    OTransition: ['otransitionend', 'oTransitionEnd'],
    transition: ['transitionend']
};
// Options for Native Event Listeners (since we never call preventDefault)
const EvtOpts = { passive: true, capture: false };
/*
 * ToolTip class definition
 */
class ToolTip extends Directive {
    // Main constructor
    init() {
        this.$isEnabled = true;
        this.$activeTrigger = {};
        this.$forceHide = this.forceHide.bind(this);
        this.$doHide = this.doHide.bind(this);
        this.$doShow = this.doShow.bind(this);
        this.$doDisable = this.doDisable.bind(this);
        this.$doEnable = this.doEnable.bind(this);
        this._noop = noop.bind(this);
        this.$timeouts = { hover: undefined, fade: undefined };
        this.$intervals = { visible: undefined };
    }
    // NOTE: Overridden by PopOver class
    static get Default() {
        return Defaults$1;
    }
    // NOTE: Overridden by PopOver class
    static get NAME() {
        return NAME;
    }
    static ValidateApply() {
        if (!Popper) {
            /* istanbul ignore next */
            warn('v-b-popover: Popper.js is required for PopOvers to work');
            /* istanbul ignore next */
            return false;
        }
        return true;
    }
    // Update config
    processConfig(config) {
        // Merge config into defaults. We use "this" here because PopOver overrides Default
        // Sanitize delay
        if (config.delay && isNumber(config.delay)) {
            /* istanbul ignore next */
            config.delay = {
                show: config.delay,
                hide: config.delay
            };
        }
        // Title for tooltip and popover
        if (config.title && isNumber(config.title)) {
            /* istanbul ignore next */
            config.title = config.title.toString();
        }
        // Content only for popover
        if (config.content && isNumber(config.content)) {
            /* istanbul ignore next */
            config.content = config.content.toString();
        }
        // Hide element original title if needed
        this.fixTitle();
        // Update the config
        return config;
    }
    // Destroy this instance
    preDispose() {
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // Remove popper
        if (this.$popper) {
            this.$popper.destroy();
        }
        // Remove tip from document
        if (this.$tip && this.$tip.parentElement) {
            this.$tip.parentElement.removeChild(this.$tip);
        }
    }
    enable() {
        // Create a non-cancelable BvEvent
        const enabledEvt = new BvEvent('enabled', {
            cancelable: false,
            target: this.$element,
            relatedTarget: null
        });
        this.$isEnabled = true;
        this.emitEvent(enabledEvt);
    }
    disable() {
        // Create a non-cancelable BvEvent
        const disabledEvt = new BvEvent('disabled', {
            cancelable: false,
            target: this.$element,
            relatedTarget: null
        });
        this.$isEnabled = false;
        this.emitEvent(disabledEvt);
    }
    // Click toggler
    toggle(event) {
        if (!this.$isEnabled) {
            /* istanbul ignore next */
            return;
        }
        /* istanbul ignore else */
        if (event && this.$activeTrigger) {
            this.$activeTrigger.click = !this.$activeTrigger.click;
            if (this.isWithActiveTrigger()) {
                this.enter(null);
            }
            else {
                this.leave(null);
            }
        }
        else {
            if (hasClass(this.getTipElement(), ClassName.SHOW)) {
                this.leave(null);
            }
            else {
                this.enter(null);
            }
        }
    }
    // Show tooltip
    show() {
        if (!this.$element || !document.body.contains(this.$element) || !isVisible(this.$element)) {
            // If trigger element isn't in the DOM or is not visible
            return;
        }
        // Build tooltip element (also sets this.$tip)
        const tip = this.getTipElement();
        this.fixTitle();
        this.setContent(tip);
        if (!this.isWithContent(tip)) {
            // If no content, don't bother showing
            /* istanbul ignore next */
            this.$tip = undefined;
            /* istanbul ignore next */
            return;
        }
        // Set ID on tip and aria-describedby on element
        setAttr(tip, 'id', this.$id || '');
        this.addAriaDescribedby();
        // Set animation on or off
        if (!this.$config)
            return;
        if (this.$config.animation) {
            addClass(tip, ClassName.FADE);
        }
        else {
            removeClass(tip, ClassName.FADE);
        }
        const placement = this.getPlacement();
        const attachment = this.constructor.getAttachment(placement);
        this.addAttachmentClass(attachment);
        // Create a cancelable BvEvent
        const showEvt = new BvEvent('show', {
            cancelable: true,
            target: this.$element,
            relatedTarget: tip
        });
        this.emitEvent(showEvt);
        if (showEvt.defaultPrevented) {
            // Don't show if event cancelled
            this.$tip = undefined;
            return;
        }
        // Insert tooltip if needed
        const container = this.getContainer();
        if (!document.body.contains(tip)) {
            container.appendChild(tip);
        }
        // Refresh popper
        this.removePopper();
        this.$popper = this.$element
            ? new Popper(this.$element, tip, this.getPopperConfig(placement, tip))
            : undefined;
        // Transitionend callback
        const complete = () => {
            if (this.$config && this.$config.animation) {
                this.fixTransition(tip);
            }
            const prevHoverState = this.$hoverState;
            this.$hoverState = undefined;
            if (prevHoverState === HoverState.OUT) {
                this.leave(null);
            }
            // Create a non-cancelable BvEvent
            const shownEvt = new BvEvent('shown', {
                cancelable: false,
                target: this.$element,
                relatedTarget: tip
            });
            this.emitEvent(shownEvt);
        };
        // Enable while open listeners/watchers
        this.setWhileOpenListeners(true);
        // Show tip
        addClass(tip, ClassName.SHOW);
        // Start the transition/animation
        this.transitionOnce(tip, complete);
    }
    // Handler for periodic visibility check
    visibleCheck(on) {
        this.clearInterval('visible');
        if (on) {
            this.setInterval('visible', () => {
                const tip = this.$tip;
                if (tip && !isVisible(this.$element) && hasClass(tip, ClassName.SHOW)) {
                    // Element is no longer visible, so force-hide the tooltip
                    this.forceHide();
                }
            }, 100);
        }
    }
    setWhileOpenListeners(on) {
        // Modal close events
        this.setModalListener(on);
        // Periodic $element visibility check
        // For handling when tip is in <keepalive>, tabs, carousel, etc
        this.visibleCheck(on);
        // Route change events
        this.setRouteWatcher(on);
        // On-touch start listeners
        this.setOnTouchStartListener(on);
        if (on && this.$config && /(focus|blur)/.test(this.$config.trigger)) {
            // If focus moves between trigger element and tip container, don't close
            eventOn(this.$tip, 'focusout', this, EvtOpts);
        }
        else {
            eventOff(this.$tip, 'focusout', this, EvtOpts);
        }
    }
    // Force hide of tip (internal method)
    forceHide() {
        if (!this.$tip || !hasClass(this.$tip, ClassName.SHOW)) {
            /* istanbul ignore next */
            return;
        }
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // Clear any hover enter/leave event
        this.clearTimeout('hover');
        this.$hoverState = '';
        // Hide the tip
        this.hide(null, true);
    }
    // Hide tooltip
    hide(callback, force) {
        const tip = this.$tip;
        if (!tip) {
            /* istanbul ignore next */
            return;
        }
        // Create a cancelable BvEvent
        const hideEvt = new BvEvent('hide', {
            // We disable cancelling if force is true
            cancelable: !force,
            target: this.$element,
            relatedTarget: tip
        });
        this.emitEvent(hideEvt);
        if (hideEvt.defaultPrevented) {
            // Don't hide if event cancelled
            return;
        }
        // Transitionend callback
        const complete = () => {
            if (this.$hoverState !== HoverState.SHOW && tip.parentNode) {
                // Remove tip from DOM, and force recompile on next show
                tip.parentNode.removeChild(tip);
                this.removeAriaDescribedby();
                this.removePopper();
                this.$tip = undefined;
            }
            if (callback) {
                callback();
            }
            // Create a non-cancelable BvEvent
            const hiddenEvt = new BvEvent('hidden', {
                cancelable: false,
                target: this.$element,
                relatedTarget: null
            });
            this.emitEvent(hiddenEvt);
        };
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // If forced close, disable animation
        if (force) {
            removeClass(tip, ClassName.FADE);
        }
        // Hide tip
        removeClass(tip, ClassName.SHOW);
        if (this.$activeTrigger) {
            this.$activeTrigger.click = false;
            this.$activeTrigger.focus = false;
            this.$activeTrigger.hover = false;
        }
        // Start the hide transition
        this.transitionOnce(tip, complete);
        this.$hoverState = '';
    }
    emitEvent(evt) {
        const evtName = evt.type;
        if (this.$root && this.$root.$emit) {
            // Emit an event on $root
            this.$root.$emit(`bv::${this.constructor.NAME}::${evtName}`, evt);
        }
        const callbacks = this.$config
            ? this.$config.callbacks || {}
            : {};
        if (callbacks && isFunction(callbacks[evtName])) {
            callbacks[evtName](evt);
        }
    }
    getContainer() {
        const container = this.$config ? this.$config.container : false;
        const body = document.body;
        // If we are in a modal, we append to the modal instead of body,
        // unless a container is specified
        return container === false
            ? closest(MODAL_CLASS, this.$element) || body
            : select(container, body) || body;
    }
    // Will be overridden by PopOver if needed
    addAriaDescribedby() {
        // Add aria-describedby on trigger element, without removing any other IDs
        let desc = getAttr(this.$element, 'aria-describedby') || '';
        desc = desc
            .split(/\s+/)
            .concat(this.$id || '')
            .join(' ')
            .trim();
        setAttr(this.$element, 'aria-describedby', desc);
    }
    // Will be overridden by PopOver if needed
    removeAriaDescribedby() {
        let desc = getAttr(this.$element, 'aria-describedby') || '';
        desc = desc
            .split(/\s+/)
            .filter((d) => d !== (this.$id || ''))
            .join(' ')
            .trim();
        if (desc) {
            /* istanbul ignore next */
            setAttr(this.$element, 'aria-describedby', desc);
        }
        else {
            removeAttr(this.$element, 'aria-describedby');
        }
    }
    removePopper() {
        if (this.$popper) {
            this.$popper.destroy();
        }
        this.$popper = undefined;
    }
    transitionOnce(tip, complete) {
        const transEvents = this.getTransitionEndEvents();
        let called = false;
        this.clearTimeout('fade');
        const fnOnce = () => {
            if (called) {
                /* istanbul ignore next */
                return;
            }
            called = true;
            this.clearTimeout('fade');
            transEvents.forEach((evtName) => {
                eventOff(tip, evtName, fnOnce, EvtOpts);
            });
            // Call complete callback
            complete();
        };
        if (hasClass(tip, ClassName.FADE)) {
            transEvents.forEach((evtName) => {
                eventOn(tip, evtName, fnOnce, EvtOpts);
            });
            // Fallback to setTimeout()
            this.setTimeout('fade', fnOnce, TRANSITION_DURATION);
        }
        else {
            fnOnce();
        }
    }
    // What transitionend event(s) to use? (returns array of event names)
    getTransitionEndEvents() {
        for (const name in TransitionEndEvents) {
            if (this.$element && !isUndefined(this.$element.style.getPropertyValue(name))) {
                return TransitionEndEvents[name];
            }
        }
        // Fallback
        /* istanbul ignore next */
        return [];
    }
    /* istanbul ignore next */
    update() {
        if (!isUndefined(this.$popper)) {
            this.$popper.scheduleUpdate();
        }
    }
    // NOTE: Overridden by PopOver class
    isWithContent(tip) {
        tip = tip || this.$tip;
        if (!tip) {
            /* istanbul ignore next */
            return false;
        }
        return Boolean((select(Selector.TOOLTIP_INNER, tip) || {}).innerHTML);
    }
    // NOTE: Overridden by PopOver class
    addAttachmentClass(attachment) {
        addClass(this.getTipElement(), `${CLASS_PREFIX}-${attachment}`);
    }
    getTipElement() {
        if (!this.$tip && this.$config) {
            // Try and compile user supplied template, or fallback to default template
            this.$tip =
                this.compileTemplate(this.$config.template) ||
                    this.compileTemplate(this.constructor.Default.template);
        }
        this.$tip.tabIndex = -1;
        return this.$tip;
    }
    compileTemplate(html) {
        if (!html || !isString(html)) {
            /* istanbul ignore next */
            return;
        }
        let div = document.createElement('div');
        div.innerHTML = html.trim();
        const node = div.firstElementChild ? div.removeChild(div.firstElementChild) : undefined;
        div = null;
        return node;
    }
    // NOTE: Overridden by PopOver class
    setContent(tip) {
        this.setElementContent(select(Selector.TOOLTIP_INNER, tip), this.getTitle());
        removeClass(tip, ClassName.FADE);
        removeClass(tip, ClassName.SHOW);
    }
    setElementContent(container, content) {
        if (!container) {
            // If container element doesn't exist, just return
            /* istanbul ignore next */
            return;
        }
        const allowHtml = this.$config ? this.$config.html : false;
        if (isObject$1(content) && content.nodeType) {
            // Content is a DOM node
            if (allowHtml) {
                if (content.parentElement !== container) {
                    container.innerHTML = '';
                    container.appendChild(content);
                }
            }
            else {
                /* istanbul ignore next */
                container.innerText = content.innerText;
            }
        }
        else {
            // We have a plain HTML string or Text
            container[allowHtml ? 'innerHTML' : 'innerText'] = content;
        }
    }
    // NOTE: Overridden by PopOver class
    getTitle() {
        let title = this.$config && this.$config.title ? this.$config.title : '';
        if (isFunction(title)) {
            // Call the function to get the title value
            /* istanbul ignore next */
            title = title(this.$element);
        }
        if (isObject$1(title) && title.nodeType && !title.innerHTML.trim()) {
            // We have a DOM node, but without inner content,
            // so just return empty string
            /* istanbul ignore next */
            title = '';
        }
        if (isString(title)) {
            title = title.trim();
        }
        if (!title) {
            // If an explicit title is not given, try element's title attributes
            title = getAttr(this.$element, 'title') || getAttr(this.$element, 'data-original-title') || '';
            title = title.trim();
        }
        return title;
    }
    static getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
    }
    listen() {
        const triggers = this.$config && this.$config.trigger
            ? this.$config.trigger.trim().split(/\s+/)
            : [];
        const el = this.$element;
        // Listen for global show/hide events
        this.setRootListener(true);
        // Using 'this' as the handler will get automatically directed to
        // this.handleEvent and maintain our binding to 'this'
        triggers.forEach((trigger) => {
            if (trigger === 'click') {
                eventOn(el, 'click', this, EvtOpts);
            }
            else if (trigger === 'focus') {
                eventOn(el, 'focusin', this, EvtOpts);
                eventOn(el, 'focusout', this, EvtOpts);
            }
            else if (trigger === 'blur') {
                // Used to close $tip when element looses focus
                eventOn(el, 'focusout', this, EvtOpts);
            }
            else if (trigger === 'hover') {
                eventOn(el, 'mouseenter', this, EvtOpts);
                eventOn(el, 'mouseleave', this, EvtOpts);
            }
        }, this);
    }
    unListen() {
        const events = ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave'];
        // Using "this" as the handler will get automatically directed to this.handleEvent
        events.forEach((evt) => {
            eventOff(this.$element, evt, this, EvtOpts);
        }, this);
        // Stop listening for global show/hide/enable/disable events
        this.setRootListener(false);
    }
    handleEvent(e) {
        // This special method allows us to use "this" as the event handlers
        if (isDisabled(this.$element)) {
            // If disabled, don't do anything. Note: If tip is shown before element gets
            // disabled, then tip not close until no longer disabled or forcefully closed.
            /* istanbul ignore next */
            return;
        }
        if (!this.$isEnabled) {
            // If not enable
            return;
        }
        const type = e.type;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const $element = this.$element;
        const $tip = this.$tip;
        if (type === 'click') {
            this.toggle(e);
        }
        else if (type === 'focusin' || type === 'mouseenter') {
            this.enter(e);
        }
        else if (type === 'focusout') {
            // target is the element which is loosing focus
            // and relatedTarget is the element gaining focus
            if ($tip && $element && $element.contains(target) && $tip.contains(relatedTarget)) {
                // If focus moves from $element to $tip, don't trigger a leave
                /* istanbul ignore next */
                return;
            }
            if ($tip && $element && $tip.contains(target) && $element.contains(relatedTarget)) {
                // If focus moves from $tip to $element, don't trigger a leave
                /* istanbul ignore next */
                return;
            }
            /* istanbul ignore next: difficult to test */
            if ($tip && $tip.contains(target) && $tip.contains(relatedTarget)) {
                // If focus moves within $tip, don't trigger a leave
                return;
            }
            /* istanbul ignore next: difficult to test */
            if ($element && $element.contains(target) && $element.contains(relatedTarget)) {
                // If focus moves within $element, don't trigger a leave
                return;
            }
            // Otherwise trigger a leave
            this.leave(e);
        }
        else if (type === 'mouseleave') {
            this.leave(e);
        }
    }
    /* istanbul ignore next */
    setRouteWatcher(on) {
        if (on) {
            this.setRouteWatcher(false);
            if (this.$root && Boolean(this.$root.$route)) {
                this.$routeWatcher = this.$root.$watch('$route', (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return;
                    }
                    // If route has changed, we force hide the tooltip/popover
                    this.forceHide();
                });
            }
        }
        else {
            if (this.$routeWatcher) {
                // Cancel the route watcher by calling the stored reference
                this.$routeWatcher();
                this.$routeWatcher = undefined;
            }
        }
    }
    /* istanbul ignore next */
    setModalListener(on) {
        const modal = closest(MODAL_CLASS, this.$element);
        if (!modal) {
            // If we are not in a modal, don't worry. be happy
            return;
        }
        // We can listen for modal hidden events on $root
        if (this.$root) {
            this.$root[on ? '$on' : '$off'](MODAL_CLOSE_EVENT, this.$forceHide);
        }
    }
    setRootListener(on) {
        // Listen for global 'bv::{hide|show}::{tooltip|popover}' hide request event
        if (this.$root) {
            this.$root[on ? '$on' : '$off'](`bv::hide::${this.name}`, this.$doHide);
            this.$root[on ? '$on' : '$off'](`bv::show::${this.name}`, this.$doShow);
            this.$root[on ? '$on' : '$off'](`bv::disable::${this.name}`, this.$doDisable);
            this.$root[on ? '$on' : '$off'](`bv::enable::${this.name}`, this.$doEnable);
        }
    }
    doHide(id) {
        // Programmatically hide tooltip or popover
        if (!id) {
            // Close all tooltips or popovers
            this.forceHide();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Close this specific tooltip or popover
            this.hide();
        }
    }
    doShow(id) {
        // Programmatically show tooltip or popover
        if (!id) {
            // Open all tooltips or popovers
            this.show();
        }
        else if (id && this.$element && this.$element.id && this.$element.id === id) {
            // Show this specific tooltip or popover
            this.show();
        }
    }
    doDisable(id) {
        // Programmatically disable tooltip or popover
        if (!id) {
            // Disable all tooltips or popovers
            this.disable();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Disable this specific tooltip or popover
            this.disable();
        }
    }
    doEnable(id) {
        // Programmatically enable tooltip or popover
        if (!id) {
            // Enable all tooltips or popovers
            this.enable();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Enable this specific tooltip or popover
            this.enable();
        }
    }
    setOnTouchStartListener(on) {
        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children
        // Only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
            /* istanbul ignore next: JSDOM does not support 'ontouchstart' event */
            from(document.body.children).forEach((el) => {
                if (on) {
                    eventOn(el, 'mouseover', this._noop);
                }
                else {
                    eventOff(el, 'mouseover', this._noop);
                }
            });
        }
    }
    fixTitle() {
        const el = this.$element;
        if (getAttr(el, 'title') || !isString(getAttr(el, 'data-original-title'))) {
            setAttr(el, 'data-original-title', getAttr(el, 'title') || '');
            setAttr(el, 'title', '');
        }
    }
    // Enter handler
    enter(e) {
        if (e && this.$activeTrigger) {
            this.$activeTrigger[e.type === 'focusin' ? 'focus' : 'hover'] = true;
        }
        if (hasClass(this.getTipElement(), ClassName.SHOW) || this.$hoverState === HoverState.SHOW) {
            this.$hoverState = HoverState.SHOW;
            return;
        }
        this.clearTimeout('hover');
        this.$hoverState = HoverState.SHOW;
        let config = this.$config;
        if (config && (!config.delay || !config.delay.show)) {
            this.show();
            return;
        }
        this.setTimeout('hover', () => {
            if (this.$hoverState === HoverState.SHOW) {
                this.show();
            }
        }, this.$config && this.$config.delay
            ? this.$config.delay.show
            : undefined);
    }
    // Leave handler
    leave(e) {
        let config = this.$config;
        if (e && this.$activeTrigger) {
            this.$activeTrigger[e.type === 'focusout' ? 'focus' : 'hover'] = false;
            if (e.type === 'focusout' && /blur/.test(config.trigger)) {
                // Special case for `blur`: we clear out the other triggers
                this.$activeTrigger.click = false;
                this.$activeTrigger.hover = false;
            }
        }
        if (this.isWithActiveTrigger()) {
            return;
        }
        this.clearTimeout('hover');
        this.$hoverState = HoverState.OUT;
        if (!config.delay || (config.delay && !config.delay.hide)) {
            this.hide();
            return;
        }
        this.setTimeout('hover', () => {
            if (this.$hoverState === HoverState.OUT) {
                this.hide();
            }
        }, config.delay.hide);
    }
    getPopperConfig(placement, tip) {
        let config = this.$config;
        return {
            placement: this.constructor.getAttachment(placement),
            modifiers: {
                offset: { offset: this.getOffset(placement, tip) },
                flip: { behavior: config.fallbackPlacement },
                arrow: { element: '.arrow' },
                preventOverflow: {
                    padding: config.boundaryPadding,
                    boundariesElement: config.boundary
                }
            },
            onCreate: (data) => {
                // Handle flipping arrow classes
                /* istanbul ignore next */
                if (data.originalPlacement !== data.placement) {
                    this.handlePopperPlacementChange(data);
                }
            },
            onUpdate: (data) => {
                // Handle flipping arrow classes
                /* istanbul ignore next */
                this.handlePopperPlacementChange(data);
            }
        };
    }
    /* istanbul ignore next */
    getOffset(placement, tip) {
        let config = this.$config;
        if (!config || !config.offset) {
            const arrow = select(Selector.ARROW, tip);
            const arrowOffset = parseFloat(getCS(arrow).width || '0') + parseFloat(config.arrowPadding);
            switch (OffsetMap[placement.toUpperCase()]) {
                case +1:
                    return `+50%p - ${arrowOffset}px`;
                case -1:
                    return `-50%p + ${arrowOffset}px`;
                default:
                    return 0;
            }
        }
        return config.offset;
    }
    getPlacement() {
        let config = this.$config;
        const placement = config.placement;
        if (isFunction(placement)) {
            /* istanbul ignore next */
            return placement.call(this, this.$tip, this.$element);
        }
        return placement;
    }
    isWithActiveTrigger() {
        for (const trigger in this.$activeTrigger) {
            if (this.$activeTrigger[trigger]) {
                return true;
            }
        }
        return false;
    }
    // NOTE: Overridden by PopOver class
    /* istanbul ignore next */
    cleanTipClass() {
        const tip = this.getTipElement();
        const tabClass = tip.className.match(BS_CLASS_PREFIX_REGEX);
        if (!isNull(tabClass) && tabClass.length > 0) {
            tabClass.forEach((cls) => {
                removeClass(tip, cls);
            });
        }
    }
    /* istanbul ignore next */
    handlePopperPlacementChange(data) {
        this.cleanTipClass();
        this.addAttachmentClass(this.constructor.getAttachment(data.placement));
    }
    /* istanbul ignore next */
    fixTransition(tip) {
        let config = this.$config;
        const initConfigAnimation = config.animation || false;
        if (!isNull(getAttr(tip, 'x-placement'))) {
            return;
        }
        removeClass(tip, ClassName.FADE);
        config.animation = false;
        this.hide();
        this.show();
        config.animation = initConfigAnimation;
    }
}

export { isObject$1 as A, BV_CONFIG_PROP_NAME as B, select as C, DEFAULTS as D, addClass as E, removeClass as F, isNull as G, getAttr as H, Directive as I, isNumber as J, eventOn as K, eventOff as L, observeDom as M, selectAll as N, OurVue__default as O, isVisible as P, isElement as Q, getBCR as R, hasClass as S, ToolTip as T, closest as U, matches as V, position as W, offset as X, TestPartial1 as Y, isArray$3 as a, isString as b, cloneDeep as c, isUndefined as d, getOwnPropertyNames as e, checkMultipleVue as f, get$1 as g, hasOwnProperty$1 as h, isPlainObject as i, hasWindowSupport as j, concat as k, keys$1 as l, arrayIncludes$1 as m, functionalComponent as n, computeTag as o, computeHref as p, isRouterLink as q, isVueElement as r, isFunction as s, computeRel as t, bindTargets as u, unbindTargets as v, warn as w, removeAttr as x, setAttr as y, getComponentConfig as z };
