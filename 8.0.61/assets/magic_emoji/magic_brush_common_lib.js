; var WeixinJSCore = {
};

window = this;
NativeGlobal.findElementById = undefined;
requestAnimationFrame = NativeGlobal.requestAnimationFrame;
cancelAnimationFrame = NativeGlobal.cancelAnimationFrame;
NativeGlobal.BindingObject = NativeGlobal.Watcher;
WeixinJSCore.invokeHandler = NativeGlobal.invokeHandler;

// console.log format

(function (global) {
  const Object$$toString = /* #__PURE__ */ (() => Object.prototype.toString)();
  const TO_STRING =
    /* #__PURE__ */ Function.prototype.call.bind(Object$$toString);

  function getDataType(data) {
    return TO_STRING(data).slice(8, -1); // Proxy 暂不考虑吧
  }

  // NOTICE: 跨context情况下，使用instanceof可能无法准确判断类型
  function safeInstanceOf(x, constructor) {
    // eslint-disable-next-line
    if (x == null) return false;
    // eslint-disable-next-line
    return (
      x instanceof constructor ||
      (x.constructor != null && x.constructor.name === constructor.name)
    );
  }
  // basic
  const isString = (x) => getDataType(x) === "String";
  const isNumber = (x) => getDataType(x) === "Number";
  const isBoolean = (x) =>
    x === true || x === false || getDataType(x) === "Boolean";
  const isUndefined = (x) => x === undefined;
  const isNull = (x) => x === null;
  const isNaN = /* #__PURE__ */ (() => Number.isNaN || ((x) => x !== x))();
  const isFinite = /* #__PURE__ */ (() =>
    Number.isFinite || ((x) => isNumber(x) && global.isFinite(x)))();
  const isInfinity = (x) => isNumber(x) && Math.abs(x) === Infinity;

  const isInteger = (value) => isFinite(value) && Math.floor(value) === value;

  const isBasicValue = (x) =>
    ["string", "number", "boolean", "undefined"].includes(typeof x);

  // Object
  const isObject = (x) => getDataType(x) === "Object";
  const isNonNullObject = (x) => isObject(x) && !isNull(x);
  const isJustObject = (x) => getDataType(x) === "Object";
  const isArray = /* #__PURE__ */ (() =>
    Array.isArray || ((x) => getDataType(x) === "Array"))();
  const isFunction = (x) => typeof x === "function";
  const isDate = (x) => getDataType(x) === "Date";
  const isRegExp = (x) => getDataType(x) === "RegExp";
  const isError = (x) => getDataType(x) === "Error";
  const isSymbol = (x) => getDataType(x) === "Symbol";
  const isMap = (x) => getDataType(x) === "Map";
  const isWeakMap = (x) => getDataType(x) === "WeakMap";
  const isSet = (x) => getDataType(x) === "Set";
  const isWeakSet = (x) => getDataType(x) === "WeakSet";
  const isPromise = (x) => getDataType(x) === "Promise";
  const isEmptyObject = (x) => {
    // eslint-disable-next-line
    for (const p in x) return false;
    return true;
  };

  // binary
  // export const isArrayBuffer = x => safeInstanceOf(x, ArrayBuffer)
  const isArrayBuffer = (x) => getDataType(x) === "ArrayBuffer";
  // export const isDataView = x => ArrayBuffer.isView(x) && safeInstanceOf(x, DataView)
  const isDataView = (x) => getDataType(x) === "DataView";
  // export const isTypedArray = x => ArrayBuffer.isView(x) && !safeInstanceOf(x, DataView)
  const isTypedArray = (x) => ArrayBuffer.isView(x) && !isDataView(x);

  // wx Type
  const isVirtualNode = (x) => x && x.type === "WxVirtualNode";
  const isVirtualText = (x) => x && x.type === "WxVirtualText";

  /* 必填参数的类型校验 */
  function paramCheck(value, expect, dept = "parameter") {
    const type = getDataType(expect);
    const valueType = getDataType(value);
    if (valueType !== type) {
      return `${dept} should be ${type} instead of ${valueType};`;
    }
    let result = "";
    switch (type) {
      case "Object":
        Object.keys(expect).forEach((key) => {
          result += paramCheck(value[key], expect[key], `${dept}.${key}`);
        });
        break;
      case "Array":
        if (value.length < expect.length) {
          return `${dept} should have at least ${expect.length} item;`;
        }
        for (let i = 0; i < expect.length; ++i) {
          result += paramCheck(value[i], expect[i], `${dept}[${i}]`);
        }
        break;
      default:
        break;
    }
    return result;
  }

  function safelyToString(value) {
    return JSON.stringify(value);
  }

  function getTypeKey(val) {
    const dataType = getDataType(val);
    if (dataType === "Number") {
      if (isNaN(val)) return "NaN";
      else if (isInfinity(val)) return "Infinity";
    } else if (dataType === "Object") {
      if (isNull(val)) return "Null";
    } else if (
      dataType.endsWith("Array") &&
      dataType !== "Array" &&
      isTypedArray(val)
    ) {
      return "TypedArray";
    }

    return dataType;
  }

  // vConsole 中使用 [xxx] 打印日志会被吞掉
  const mapping = {
    String: 0,
    NaN: "<NaN>",
    Infinity: (val) => (val > 0 ? "<Infinity>" : "<-Infinity>"),
    Number: 0,
    Boolean: 0,
    Null: 0,
    Undefined: "<Undefined>",

    Function: (val) =>
      val.name === "" ? "<Function>" : `<Function: ${val.name}>`,
    Date: (val) => `<Date: ${val.toJSON()}>`,
    RegExp: (val) => `<RegExp: ${val.toString()}>`,
    Error: (val) => `<${val.name}: ${val.message} at:\n${val.stack}>`,
    Symbol: (val) => `<Symbol: ${val.toString()}>`,
    Promise: "<Promise>",

    Map: (val) => `<Map: size=${val.size}>`,
    WeakMap: "<WeakMap>",
    Set: (val) => `<Set: size=${val.size}>`,
    WeakSet: "<WeakSet>",

    ArrayBuffer: (val) => `<ArrayBuffer: byteLength=${val.byteLength}>`,
    DataView: (val) =>
      `<DataView: byteLength=${val.byteLength}, byteOffset=${val.byteOffset}>`,
    TypedArray: (val) =>
      `<${
        val.constructor && val.constructor.name
          ? val.constructor.name
          : "TypedArray"
      }: byteLength=${val.byteLength}, length=${val.length}>`,
  };

  // object, array, number, string, boolean, and null
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
  function getMappedValue(val) {
    const typeKey = getTypeKey(val);
    if (typeKey in mapping) {
      if (!mapping[typeKey]) return [val, true];
      else if (!isFunction(mapping[typeKey])) return [mapping[typeKey], true];
      else return [mapping[typeKey](val), true];
    }
    return [null, false];
  }

  function decycleAndToJSONable(object) {
    const refs = new WeakMap();
    let refsSize = 0;
    return (function derez(val, path) {
      let res;
      const [mappedVal, isMapped] = getMappedValue(val);
      if (!isMapped) {
        if (refsSize > 3000) {
          return "<Hidden>";
        }
        if (refs.has(val)) {
          return `<Circular: ${refs.get(val)}>`;
        }

        refs.set(val, path);
        refsSize++;

        if (isArray(val))
          return val.map((ele, i) => derez(ele, `${path}[${i}]`));
        res = {};

        Object.keys(val).forEach((key) => {
          res[key] = derez(val[key], `${path}.${key}`);
        });

        return res;
      } else {
        return mappedVal;
      }
    })(object, "@");
  }

  function transformLogArgs(args) {
    try {
      args = Array.prototype.slice.call(args); // in case of arguments
      return args.map(decycleAndToJSONable);
    } catch (e) {
      console.warn("[console] This object can not be logged");
      return undefined;
    }
  }

  const LOG_LEVEL = {
    LOG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    DEBUG: 4,
    TIME: 5,
    TIME_END: 5,
  };

  const LOG_LEVEL_TEXT = {
    LOG: "log",
    INFO: "info",
    WARNING: "warn",
    ERROR: "error",
    DEBUG: "debug",
    TIME: "time",
    TIME_END: "timeEnd",
  };

  const MAX_LOG_LENGTH = 1024 * 1024;
  const MAX_LOG_LENGTH_DEBUG = 2 * 1024 * 1024;
  function getNativeGlobalLog(level, args, isDebugOn = true) {
    // 若未开启调试面板，只输出 warning 和 error
    try {
      const logs = transformLogArgs(args);
      if (typeof logs === "undefined") return undefined;
      const result = JSON.stringify({ level, logs }); // level 多出一点点就忽略吧
      if (result.length > MAX_LOG_LENGTH && !isDebugOn) {
        return JSON.stringify({ level, logs: ["<LOG_EXCEED_MAX_LENGTH>"] });
      } else if (result.length > MAX_LOG_LENGTH_DEBUG && isDebugOn) {
        return JSON.stringify({ level, logs: ["<LOG_EXCEED_MAX_LENGTH>"] });
      } else {
        return result;
      }
    } catch (e) {
      console.warn("[console] This object can not be logged");
      return undefined;
    }
  }

  const _levelMap = {
    0: 'debug',
    1: 'info',
    2: 'warn',
    3: 'error'
  };

  const _log = function (level, args) {
    const logData = getNativeGlobalLog(level, args);
    JSBridge.invoke('systemLog', { level: _levelMap[level] ?? 'debug', content: logData, enableVConsole: global.mb.enableVConsole });
  };
  global._log = _log;
})(this);

// console.log format done

// Bugfix: hook setTimeout / setInterval because of bug in node.js
(function(global) {
  if (!global.setTimeout) {
    global.setTimeout = global.NativeGlobal.setTimeout;
    global.clearTimeout = global.NativeGlobal.clearTimeout;
    global.setInterval = global.NativeGlobal.setInterval;
    global.clearInterval = global.NativeGlobal.clearInterval;
    return;
  }
  let reportJsException = function(content, extra) {
    var rptContent = [global.mb.env.bizName, 'js-exception', content.replaceAll(',', ';'), extra].join(',');
    NativeGlobal.Reporter.reportKV(26778, rptContent);
  }
  let TryCatchForCb = function(cb) {
    return function() {
      try {
        cb();
      } catch (e) {
        console.error(e);
        reportJsException(e?.stack ?? e?.message ?? JSON.stringify(e), 'Timeout');
      }
    };
  }
  var originSetTimeout = global.setTimeout;
  global.setTimeout = function(cb, after, ...args) {
    return originSetTimeout(new TryCatchForCb(cb), after, ...args);
  };
  var originSetInterval = global.setInterval;
  global.setInterval = function(cb, after, ...args) {
    return originSetInterval(new TryCatchForCb(cb), after, ...args);
  };
  // register global promise reject function
  global.onunhandledrejection = function(res) {
    let content = res?.reason?.stack ?? res?.reason?.message ?? JSON.stringify(res);
    console.error(res?.reason ?? content);
    let extra = 'Promise-' + (res?.type ?? '?');
    reportJsException(content, extra);
  };
})(this);

// Canvas / Image related

(function(global) {
  let OriginCanvas = NativeGlobal.ScreenCanvas;
  if (!OriginCanvas) return;
  var canvas = function() {
    let c = new OriginCanvas();
    c.id = c.__wid;
    return c;
  }
  NativeGlobal.Canvas = canvas;
  NativeGlobal.ScreenCanvas = canvas;
  global.ScreenCanvas = canvas;
  global.Image = NativeGlobal.Image;
})(this);

// Canvas / Image related done

// JSBridge

(function (global) {
  if (global.JSBridge) return;

  // devtools 跳过
  if (global.navigator && global.navigator.userAgent) {
    var userAgent = global.navigator.userAgent;
    if (userAgent.indexOf('appservice') > -1 || userAgent.indexOf('wechatdevtools') > -1) {
      return;
    }
  }

  var isWebView = global.hasOwnProperty('document');
  var isIosWebView = false;

  var invokeCallbacks = {};
  var invokeCallbackId = 0;

  var onCallbacks = {};

  var customEventPrefix = 'custom_event_';
  var subscribeCallbacks = {};

  if (isWebView) {
    var userAgent = global.navigator.userAgent;
    var isAndroidWebView = userAgent.indexOf('Android') != -1;
    isIosWebView = !isAndroidWebView;
  }

  var _invokeHandler = function (event, paramsString, callbackId, privateArgsString) {
    if (isIosWebView) {
      global.webkit.messageHandlers.invokeHandler.postMessage({
        event: event,
        paramsString: paramsString,
        callbackId: callbackId,
      });
      return "";
    } else {
      var result = WeixinJSCore.invokeHandler(event, paramsString, callbackId, privateArgsString);
      if (typeof result === 'string' && result !== '') {
        // sync functions
        try {
          result = JSON.parse(result);
        } catch (e) {
          result = {};
        }
      }
      return WeixinNativeBuffer.unpack(result);
    }
  }

  var _invokeImpl = function (event, params, callback = null, privateArgs) {
    if (params === null || params === undefined) {
      params = {};
    }
    if (typeof params !== 'object') {
      throw new Error("illegal params");
    }
    var paramsString = JSON.stringify(WeixinNativeBuffer.pack(params) || {});
    var callbackId = ++invokeCallbackId;
    if (typeof callback === 'function') {
      // console.log('async jsapi ' + callbackId + event);
      invokeCallbacks[callbackId] = callback;
    }
    return _invokeHandler(event, paramsString, callbackId, privateArgs);
  }

  // 包装了一层，保证 invoke 同步接口时，既有 callback 又有返回值
  var invoke = function (event, params, callback = null, privateArgs) {
    let ret = undefined;
    _invokeImpl(event, params, function(result) {
        ret = result;
        if (callback != null) {
            callback(result);
        }
    }, privateArgs);
    return ret;
  }

  var invokeCallbackHandler = function (callbackId, result) {
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result)
      } catch (e) {
        console.error('fail not compatible data' + result)
      }
    }
    result = WeixinNativeBuffer.unpack(result);
    var callback = invokeCallbacks[callbackId];
    if (typeof callback == 'function') {
      // console.log('invoke callback handler: true');
      try {
        callback(result);
      } catch (e) {
        console.warn('callback invoke handler failed!' + e.stack)
      }
      // console.log('invoke callback handler: true 1')
    }
    delete invokeCallbacks[callbackId];
  }

  var on = function (event, callback) {
    console.log('register on ', event)
    onCallbacks[event] = callback;
  }

  var subscribe = function (event, callback) {
    subscribeCallbacks[customEventPrefix + event] = callback;
  }

  var subscribeHandler = function (event, result, webviewId, ext) {
    if (typeof result === 'string' && result.length > 0) {
      try {
        result = JSON.parse(result)
      } catch(e) {}
    }
//    console.log('on subscribe event: ', event, JSON.stringify(result))
    result = WeixinNativeBuffer.unpack(result)

    var callback;
    if (event.indexOf(customEventPrefix) != -1) {
      callback = subscribeCallbacks[event];
    } else {
      callback = onCallbacks[event];
    }
    if (typeof callback == 'function') {
      callback(result, webviewId, ext);
    }
  }

  global.console = {
    debug: (...args) => {
      global._log(0, args);
      if (global._console) global._console.debug(...args);
    },
    log: (...args) => {
      global._log(0, args);
      if (global._console) global._console.log(...args);
    },
    info: (...args) => {
      global._log(1, args);
      if (global._console) global._console.info(...args);
    },
    warn: (...args) => {
      global._log(2, args);
      if (global._console) global._console.warn(...args);
    },
    error: (...args) => {
      global._log(3, args);
      if (global._console) global._console.error(...args);
    },
  };

  global.JSBridge = {
    invoke: invoke,
    invokeCallbackHandler: invokeCallbackHandler,
    on: on,
    subscribe: subscribe,
    subscribeHandler: subscribeHandler,
    log: global.console.log
  };
})(this);

// JSBridge done


// SubJsContext

(function (global) {
  if (!NativeGlobal.SubJsContext) return;
  function SubJsContext(name, env) {
    env['console'] = global.console;
    env['setTimeout'] = global.setTimeout;
    env['clearTimeout']= global.clearTimeout;
    env['setInterval']= global.setInterval;
    env['clearInterval']= global.clearInterval;
    env['JSBridge'] = global.JSBridge;
    let impl = new NativeGlobal.SubJsContext(name, env);
    return impl;
  }
  global.SubJsContext = SubJsContext;
}(this));

// SubJsContext done


// native buffer
/* eslint-disable */
var NativeBuffer = (function (global) {

  // iOS 下注入 WeixinNativeBuffer，Android 下注入 getNativeBufferId，setNativeBuffer，getNativeBuffer；
  var _getNativeBufferId = global.getNativeBufferId
  var _setNativeBuffer = global.setNativeBuffer
  var _getNativeBuffer = global.getNativeBuffer
  if (!_getNativeBufferId) {
    _getNativeBufferId = global.NativeGlobal.NativeBuffer.getNativeBufferId;
    _setNativeBuffer = global.NativeGlobal.NativeBuffer.setNativeBuffer;
    _getNativeBuffer = global.NativeGlobal.NativeBuffer.getNativeBuffer;
  } else {
    delete global.getNativeBufferId;
    delete global.setNativeBuffer;
    delete global.getNativeBuffer;
  }

  var __new = function (buffer) {
    var bufferId = _getNativeBufferId()
    _setNativeBuffer(bufferId, buffer)
    return bufferId
  }

  var __get = function (bufferId) {
    return _getNativeBuffer(bufferId)
  }

  var _new = function (buffer) {
    var ret = {}
    ret.id = __new(buffer)
    return ret
  }

  var _get = function (bufferObj) {
    if (bufferObj == null) {
      return
    }
    if (typeof bufferObj.id !== 'undefined') {
      return __get(bufferObj.id)
    } else if (typeof bufferObj.base64 !== 'undefined') {
      return base64ToArrayBuffer(bufferObj.base64)
    }
  }

  // src: https://github.com/davidchambers/Base64.js/blob/master/base64.js
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var btoa = btoa || function (input) {
    var str = String(input)
    var output = ''
    for (
      var block, charCode, idx = 0, map = chars;
      str.charAt(idx | 0) || (map = '=', idx % 1);
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3 / 4)
      if (charCode > 0xFF) {
        throw new Error('"btoa" failed')
      }
      block = block << 8 | charCode
    }
    return output
  }

  var atob = atob || function (input) {
    var str = String(input).replace(/=+$/, '')
    var output = ''
    if (str.length % 4 === 1) {
      throw new Error('"atob" failed')
    }
    for (
      var bc = 0, bs, buffer, idx = 0;
      buffer = str.charAt(idx++);
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ?
        output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer)
    }
    return output
  }

  var arrayBufferToBase64 = function (buffer) {
    var binaryString = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binaryString += String.fromCharCode(bytes[i])
    }
    return btoa(binaryString)
  }

  var base64ToArrayBuffer = function (base64) {
    var binaryString = atob(base64)
    var len = binaryString.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  var pack = function (params) {
    if (params == null) {
      return params
    }
    var nativeBuffers = []

    for (var key in params) {
      var value = params[key]
      if (typeof value !== 'undefined' && _getDataType(value) === 'ArrayBuffer' && typeof value.byteLength !== 'undefined') {
        var buffer = _new(value)
        buffer.key = key
        nativeBuffers.push(buffer)
      }
    }

    if (nativeBuffers.length > 0) {
      for (var i = 0; i < nativeBuffers.length; i++) {
        var buffer = nativeBuffers[i]
        delete params[buffer.key]
      }
      params.__nativeBuffers__ = nativeBuffers
    }

    return params
  }

  var unpack = function (params) {
    if (params == null || params.__nativeBuffers__ == null) {
      return params
    }

    var nativeBuffers = params.__nativeBuffers__
    delete params.__nativeBuffers__

    for (var i = 0; i < nativeBuffers.length; i++) {
      var buffer = nativeBuffers[i]
      if (buffer == null) continue;

      var arrayBuffer = _get(buffer)
      if (typeof arrayBuffer !== 'undefined' && _getDataType(arrayBuffer) === 'ArrayBuffer') {
        params[buffer.key] = arrayBuffer
      } else {
        console.log("get array buffer failed " + JSON.stringify(buffer))
      }
    }

    return params
  }

  var _getDataType = function (data) {
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  }

  return {
    new: _new,
    get: _get,
    pack: pack,
    unpack: unpack
  }
})(this);

var WeixinNativeBuffer = NativeBuffer
NativeBuffer = null

// native buffer done


// WebAssembly

var WebAssembly_Global = function () {
  return this;
}();

var wasm = {};

if (typeof NativeGlobal.WebAssembly !== 'undefined') {
  wasm = NativeGlobal.WebAssembly;
} else if (typeof WebAssembly_Global.WebAssembly !== 'undefined') {
  wasm = WebAssembly_Global.WebAssembly;
}

var WebAssembly = {
  Table: wasm.Table,
  Memory: wasm.Memory,
  Global: wasm.Global,
  Instance: wasm.Instance,
  instantiate: function instantiate(file, imports) {
    if (typeof file !== 'string') {
      return Promise.reject(new Error('WebAssembly.instantiate: first argument must be a string'));
    } else if (/^(wxfile|https?):/.test(file)) {
      return Promise.reject(new Error('WebAssembly.instantiate: not support wxfile: or http: path'));
    } else if (!/\.wasm(\.br)?$/.test(file)) {
      return Promise.reject(new Error('WebAssembly.instantiate: only support file type .wasm or .wasm.br'));
    }
    return wasm.instantiate(file, imports);
  }
};
WebAssembly_Global.WXWebAssembly = WebAssembly;
var _WebAssembly = wasm;

// Web Assembly done

// LazyLoad

(function(global) {
    var that = this;

    class LazyLoadModel {
        parent = null;
        name = "";

        constructor(parent, name) {
            this.parent = parent;
            this.name = name;
        }

        provideDelegateStr () {
            return this.name + '_';
        }
    };
    var lazyLoadModels = [];
    lazyLoadModels.push(new LazyLoadModel(that.NativeGlobal, 'WXAUDIO'));
    lazyLoadModels.push(new LazyLoadModel(that.NativeGlobal, 'WeMedia'));
    lazyLoadModels.push(new LazyLoadModel(that.NativeGlobal, 'Profiler'));

    for (const model of lazyLoadModels) {
        if (!model.parent[model.name]) {
            Object.defineProperty(model.parent, model.name, {
                get: function() {
                    if (model.isTriggeredInit) {
                        return model[model.provideDelegateStr()];
                    }
                    that.NativeGlobal.initModule(model.name);
                    model.isTriggeredInit = true;
                    return model[model.provideDelegateStr()];
                },

                set: function(value) {
                    model[model.provideDelegateStr()] = value;
                }
            });
        }
    }
})(this);

// LazyLoad done

// DevTools
(function(global) {
  var devtool = {};
  devtool.sendMessage = function(payload) {
    global.JSBridge.invoke("sendMessageToDevTools", { payload })
  }
  global.DevtoolsMessage = devtool;
})(this);
// DevTools done

// mb2.0 support

(function(global) {
  var mb = {
    envId: "",
    version: 0x2010000,
    PublicService: NativeGlobal.PublicService,
    JSBridge: global.JSBridge,
    SubJsContext: global.SubJsContext,
    ScreenCanvas: NativeGlobal.ScreenCanvas,
    OffscreenCanvas:NativeGlobal.OffscreenCanvas,
    requirePlugin: NativeGlobal.requirePlugin,
    loadFont: NativeGlobal.loadFont,
    setPreferredFps: NativeGlobal.setPreferredFramesPerSecond,
    ExternalTexture: NativeGlobal.ExternalTexture,
    switchVConsole: function(value) {
      global.mb.enableVConsole = value;
      global.JSBridge.invoke("setEnableDebug", { enable: !!value });
    }
  };
  NativeGlobal.onBizConnected = function(biz) {
    if (typeof mb.onBizConnected === 'function') {
      mb.onBizConnected(biz);
    } else {
      console.error("mb.onBizConnected not set!!")
    }
  }
  NativeGlobal.onBizDisconnected = function(biz) {
    if (typeof mb.onBizDisconnected === 'function') {
      mb.onBizDisconnected(biz)
    } else {
      console.error("mb.onBizDisconnected not set!!");
    }
  }
  global.mb = mb;
})(this);

// mb2.0 support done
