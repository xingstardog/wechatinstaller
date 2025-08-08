GameGlobal = this;
GameGlobal.__needInjectWeAppAdapter = true;
// 适配 mb 2.0
(function(global) {
    if (typeof WeixinJSBridge !== 'undefined') {
        return;
    }
    global.WeixinJSBridge = JSBridge;
    // invokeSync && invokeAsync 支持
    const invokeSync = (apiName, args) => {
        let ret = undefined;
        if (!args) {
            args = {}
        }
        return JSBridge.invoke(apiName, args)
    }

    const invokeAsync = (apiName, args, callback) => {
        if (!args) {
            args = {}
        }

        var cb = function (res) {
            if (callback) {
                res = res || {};
                if (res.errCode === 0 || res.errMsg.indexOf(`:ok`) >= 0) {
                    callback.success(res)
                } else {
                    callback.fail(res.errMsg)
                }
            }
        }
        JSBridge.invoke(apiName, args, cb);
    }
    global.invokeSync = invokeSync;
    global.invokeAsync = invokeAsync;
    global.__wxConfig = mb.env;
})(this);

// require / define

(function (global) {
  var MODULE_STATUS_UNLOAD = 1;
  var MODULE_STATUS_LOADED = 2;

  // "modId" : { status: MODULE_STATUS_UNLOAD | MODULE_STATUS_LOADED, factory: func | object, exports: module.exports }
  var MODULES = {};
  var notCacheScripts = {};

  var backupGlobalFlags = function () {
    return {
      __wxRoute: global.__wxRoute,
      __wxAppCurrentFile__: global.__wxAppCurrentFile__,
      __wxRouteBegin: global.__wxRouteBegin,
    };
  }
  var restoreGlobalFlags = function (globalFlags) {
    global.__wxRoute = globalFlags.__wxRoute
    global.__wxAppCurrentFile__ = globalFlags.__wxAppCurrentFile__
    global.__wxRouteBegin = globalFlags.__wxRouteBegin
  };

  //modId 为绝对路径
  //factory = function(require, module) 模块暴漏接口可以通过module.exports 或者 return
  define = function (modId, factory) {
    MODULES[modId] = {
      status: MODULE_STATUS_UNLOAD,
      factory: factory
    };
  };

  var getModDir = function (modId) {
    var match = modId.match(/(.*)\/([^/]+)?$/);
    return !match || !match[1] ? './' : match[1];
  }

  var getSubPackageConfig = function (dir) {
    if (!dir) {
      return undefined;
    }

    if (__wxConfig.subPackages) {
      for (var i = 0, len = __wxConfig.subPackages.length; i < len; i++) {
        if (dir.indexOf(__wxConfig.subPackages[i].root) === 0) {
          return __wxConfig.subPackages[i];
        }
      }
    }

    return undefined;
  }

  var splitPath = function (path) {
    var realPath = [],
      paths = path.split('/');

    for (var i = 0, len = paths.length; i < len; ++i) {
      // 转换目录路径
      var pathItem = paths[i];
      if (pathItem == '' || pathItem == '.') {
        continue;
      }
      if (pathItem == '..') {
        if (realPath.length == 0) {
          realPath = null;
          break;
        }
        realPath.pop();
      } else if (i + 1 < len && paths[i + 1] == '..') {
        i++;
      } else {
        realPath.push(pathItem);
      }
    }

    return realPath;
  }

  var checkNodeModulesFile = function (dirPath) {
    var requirePath = splitPath(dirPath + '/index.js').join('/');
    if (MODULES[requirePath]) return requirePath;

    requirePath = splitPath(dirPath).join('/');
    if (!/\.js$/.test(requirePath)) requirePath += '.js';
    if (MODULES[requirePath]) return requirePath;

    return '';
  }

  var checkNodeModules = function (modId, modDir, requireId) {
    var id = modId;
    if (!/\.js$/.test(id)) id += '.js';

    // 包内文件
    if (typeof id === 'string' && MODULES[id]) return id;

    // 从 node_modules 里检查
    var realDirpath = splitPath(modDir);
    if (!realDirpath) throw new Error('can\'t find module : ' + requireId);

    var modRelativePath = modId.substring(realDirpath.join('/').length),
      requirePath;

    while (realDirpath.length) {
      // 非根目录
      var dirPath = realDirpath.join('/') + '/miniprogram_npm' + modRelativePath;

      requirePath = checkNodeModulesFile(dirPath);
      if (requirePath) break;

      realDirpath.pop();
    }

    if (!requirePath) {
      // 根目录
      modRelativePath = modRelativePath[0] === '/' ? modRelativePath : '/' + modRelativePath;
      var dirPath = 'miniprogram_npm' + modRelativePath;

      requirePath = checkNodeModulesFile(dirPath);
    }

    return requirePath ? requirePath : modId;
  }

  var _require = function (modId) {
    var modDir = getModDir(modId);
    return function (requireId) {
      // modId
      if (typeof requireId !== 'string') {
        throw new Error('require args must be a string');
      }

      var realFilepath = splitPath(modDir + '/' + requireId);
      if (requireId === '/__wx__/private-api') realFilepath = splitPath(requireId);
      if (!realFilepath) throw new Error('can\'t find module : ' + requireId);

      try {
        var id = realFilepath.join('/');
        id = checkNodeModules(id, modDir, requireId);

        // 功能页后续分包加载，functional-pages（功能页函数）文件夹放入分包，文件夹内外
        // 不能互相 require。功能页改分包前先检查，如果有错误 require 报错并上报，功能
        // 页切分包之后去掉
        var inFunctionalPage = function (id) {
          return splitPath(id)[0] === 'functional-pages';
        };
        if (inFunctionalPage(id) !== inFunctionalPage(modId)) {
          Reporter.thirdErrorReport({
            error: new Error('should not require across "functional-pages" folder'),
            extend: 'at require("' + requireId + '") in ' + modId
          });
        };
        // 功能页 require 检查 end

        // 在这里判断是否允许 require
        if (__wxConfig.platform === 'devtools' && __wxConfig.subPackages) {
          var distConfig = getSubPackageConfig(id);
          var srcConfig = getSubPackageConfig(modId);

          // 需 require 的模块在分包中，且与本文件不是同一个分包，或者本文件在主包，被 require 的文件在分包中
          if (distConfig &&
            distConfig !== srcConfig) {
            throw new Error('should not require ' + requireId + ' in ' + modId + ' because they are in diffrent subPackages');
          }
        }
        return require(id);
      } catch (e) {
        // throw new Error("Error, realFilepath = " + realFilepath.join("/") + ", modId = " + modId + ", requireId = " + requireId)
        /*
        console.error("Error, modId = " + modId + ", requireId = " + requireId)
        console.error(e)
        */
        throw e;
      }
    }
  }

  // modId 为绝对路径
  require = function (modId, cache) {
    if (typeof cache === 'undefined') {
      cache = true;
    }

    if (typeof modId !== 'string') {
      throw new Error('require args must be a string');
    }
    var mod = MODULES[modId];
    if (!mod) {
      // 尝试 require 根目录的 npm 包
      var rootModId = modId.indexOf('/') === -1 ? modId + '/index.js' : modId;
      rootModId = 'miniprogram_npm/' + rootModId;
      if (!/\.js$/.test(rootModId)) rootModId += '.js';
      mod = MODULES[rootModId];
    }
    if (!modId.endsWith('.js')) modId += '.js';
    if (!mod) {
      // 尝试是否未加载的自定义组件 js
      var compFile = '/' + modId.substr(0, modId.length - 3) + '.appservice.js';
      var globalFlags = backupGlobalFlags();
      __subContextEngine__.loadJsFiles([compFile]);
      restoreGlobalFlags(globalFlags);
      mod = MODULES[modId];
    }
    if (!mod) {
      throw new Error('module "' + modId + '" is not defined');
    }

    var module = { exports: {} }; // module.exports
    var factory = mod.factory;

    if (!cache || notCacheScripts[modId]) {
      delete mod.exports;
      mod.status = MODULE_STATUS_UNLOAD;
      notCacheScripts[modId] = true;

      factory && factory(_require(modId), module, module.exports);
      return module.exports;
    }

    if (mod.status === MODULE_STATUS_UNLOAD) {
      mod.exports = module.exports;
      mod.status = MODULE_STATUS_LOADED;

      var ret = undefined;
      try {
        factory && (ret = factory(_require(modId), module, module.exports));
      } catch (e) {
        mod.status = MODULE_STATUS_UNLOAD;
        throw e;
      }

      mod.exports = module.exports !== undefined ? module.exports : ret;
    }

    // else if (mod.status == MODULE_STATUS_LOADED)
    return mod.exports;
  }

  requireOnce = function (modId) {
    return require(modId, false);
  }

  global.__modules__ = MODULES;// 用于上报
})(this);

// require / define done

var wx = {};

(function (global) {
    if (global) {
        global.evfx = {}
    }

    wx.getSystemInfoSync = function () {
        return invokeSync("getSystemInfoSync", {})
    }

    wx.getSystemInfo = function (obj) {
        const cb = {
            success: function (res) {
                if (obj && obj.success) {
                    obj.success(res)
                }
            },
            fail: function (errMsg) {
                if (obj && obj.fail) {
                    obj.fail(errMsg)
                }
            }
        }
        return invokeAsync("getSystemInfo", {}, cb)
    }

    var screenCanvas = undefined;

    wx.createCanvas = function () {
        var canvas;
        if (!screenCanvas) {
            canvas = new NativeGlobal.Canvas()
            screenCanvas = canvas
        } else {
            canvas = new NativeGlobal.OffscreenCanvas()
        }
        if (canvas.setTouchableRects) { // adapt for mb2.0
            canvas.setTouchableRects([]);
        }
        return canvas
    }

    wx.createImage = function () {
        return new NativeGlobal.Image()
    }

    wx.createInnerAudioContext = function () {
        return {
            onCanplay: function () {

            },
            onPlay: function () {

            },
            onPause: function () {

            },
            onEnded: function () {

            },
            onError: function () {

            },
            play: function () {

            },
            seek: function () {

            },
        }
    }

    wx.onTouchStart = function () {

    }

    wx.onTouchMove = function () {

    }

    wx.onTouchEnd = function () {

    }

    wx.onTouchCancel = function () {

    }

    wx.request = function () {

    }

    wx.connectSocket = function () {

    }

    wx.getStorageInfoSync = function () {
        return {
            keys: []
        }
    }

    wx.getStorageSync = function () {

    }

    wx.setStorageSync = function () {

    }

    wx.removeStorageSync = function () {

    }

    wx.clearStorageSync = function () {

    }

    wx.cloud = {
        init: function () {

        },
        database: function () {

        },
        callFunction: function () {

        }
    }

    wx.env = {
        USER_DATA_PATH: "wxfile://usr",
        CLIENT_VERSION: global.__wxConfig.clientVersion,
        COMMONLIB_VERSION: "1.0.0"
    }

    wx.getFileSystemManager = function () {
        return {
            readFile: function (args = {}) {
                console.log("readFile!! path: " + args.filePath + "       encoding: " + args.encoding);

                var arg = {
                    filePath: args.filePath,
                    encoding: args.encoding,
                    position: args.position,
                    length: args.length
                }
                var cb = function (result) {
                    console.log(result)
                    if (result.__nativeBuffers__) {
                        var ab = WeixinNativeBuffer.get(result.__nativeBuffers__[0].id)
                        args.success({
                            data: ab
                        });
                    } else {
                        args.success({
                            data: result.data
                        });
                    }
                }

                WeixinJSBridge.invoke("readFile", arg, cb);
            },
            readdir: function (args) {
                var arg = {
                    dirPath: args.dirPath
                };
                var cbs = {
                    success: args.success,
                    fail: args.fail,
                    complete: args.complete
                }

                console.log("call readdir");
                WeixinJSBridge.invoke("readdir", arg, args.success)
            },
            getFileInfo: function () {

            },
            copyFile: function () {

            },
            unlink: function () {

            },
            writeFile: function () {

            },
            mkdir: function () {

            },
            readFileSync: function (filePath, encoding, position, length) {
                var arg = {
                    filePath: filePath,
                    encoding: encoding,
                    position: position,
                    length: length
                };

                const ret = invokeSync("readFileSync", arg);
                if (ret && ret.data) {
                    console.log(["readFileSync: ", arg, ret.data]);
                    return ret.data;
                } else {
                    console.log("readFileSync failed... " + JSON.stringify(ret))
                }
            },
            accessSync: function (path) {
                var arg = {
                    path: path
                };
                return invokeSync("accessSync", arg);
            },
            statSync: function (path, recursive = false) {
                var arg = {
                    path: path,
                    recursive: recursive
                };
                let errMsg;
                let stats;

                console.log("call statSync");
                WeixinJSBridge.invoke("statSync", arg, res => {
                    if (res && res.errMsg) {
                        const name = 'statSync'
                        const isFail = res.errMsg.indexOf(`${name}:fail`) === 0

                        if (isFail) {
                            errMsg = res.errMsg;
                        } else {
                            filterStatRes(res, path)
                            stats = res.stats
                        }
                    }
                });
                if (errMsg) {
                    console.error(errMsg)
                    throw new Error(errMsg)
                } else {
                    return stats
                }
            },
            saveFile: function (args) {
                var arg = {
                    tempFilePath: args.tempFilePath,
                    filePath: args.filePath
                };
                var cbs = {
                    success: args.success,
                    fail: args.fail,
                    complete: args.complete
                }

                console.log("call saveFile");
                WeixinJSBridge.invoke("saveFile", arg, args.success)
            },
            readdirSync: function (dirPath) {
                var arg = {
                    dirPath: dirPath,
                };
                let files
                let errMsg

                console.log("call readdirSync");
                WeixinJSBridge.invoke("readdirSync", arg, res => {
                    if (res && res.files) {
                        files = res.files
                    } else {
                        errMsg = res.errMsg;
                    }
                });

                if (errMsg) {
                    console.error(errMsg)
                    throw new Error(errMsg)
                } else {
                    return files
                }
            },
            unlinkSync: function (filePath) {
                var arg = {
                    filePath: filePath,
                };

                let errMsg
                console.log("call unlinkSync");
                WeixinJSBridge.invoke('unlinkSync', arg, res => {
                    if (res && res.errMsg) {
                        const name = 'unlinkSync'
                        const isFail = res.errMsg.indexOf(`${name}:fail`) === 0

                        if (isFail) {
                            errMsg = res.errMsg
                        }
                    }
                })

                if (errMsg) {
                    console.error(errMsg)
                    throw new Error(errMsg)
                }
            },
            mkdirSync: function (dirPath, recursive = false) {
                var arg = {
                    dirPath: dirPath,
                    recursive: recursive
                };

                let errMsg
                console.log("call mkdirSync");
                WeixinJSBridge.invoke('mkdirSync', arg, res => {
                    if (res && res.errMsg) {
                        // const isSuccess = res.errMsg.indexOf(`${name}:ok`) === 0
                        const name = 'mkdirSync'
                        const isFail = res.errMsg.indexOf(`${name}:fail`) === 0

                        if (isFail) {
                            errMsg = res.errMsg
                        }
                    }
                })

                if (errMsg) {
                    console.error(errMsg)
                    throw new Error(errMsg)
                }
            },
            unzip: function (args) {
                var arg = {
                    zipFilePath: args.zipFilePath,
                    targetPath: args.targetPath
                };
                var cbs = {
                    success: args.success,
                    fail: args.fail,
                    complete: args.complete
                }

                console.log("call unzip");
                WeixinJSBridge.invoke("unzip", arg, args.success)
            }
        }
    }

    wx.downloadFile = function () {

    }

    wx.postMessage = function () {

    }

    wx.getNetworkType = function () {
        return {
            "networkType": "wifi"
        }
    }

    wx.createVideo = function () {
        return {
            destroy: function () {

            },

        }
    }

    wx.performance = function () {
        return {
            now: function () {
                return global.performance.now()
            }
        }
    }

    wx.getABTestConfig = function (args) {
        return invokeSync("getABTestConfig", args)
    }

    wx.kvReport = function (params) {
        const cb = {
            success: function (res) {
                if (params && params.success) {
                    params.success(res)
                }
            },
            fail: function (errMsg) {
                if (params && params.fail) {
                    params.fail(errMsg)
                }
            }
        }
        invokeAsync("kvReport", params, cb)
    }

    wx.reportIDKey = function (params) {
        const cb = {
            success: function (res) {
                if (params && params.success) {
                    params.success(res)
                }
            },
            fail: function (errMsg) {
                if (params && params.fail) {
                    params.fail(errMsg)
                }
            }
        }
        invokeAsync("reportIDKey", params, cb)
    }

    wx.gc = function() {
        if (NativeGlobal && NativeGlobal.gc && typeof(NativeGlobal.gc) === 'function') {
            NativeGlobal.gc()
        }
    }

    wx.magicEmoji = {
        onMagicEmojiSent: function (callback) {
            if (callback && typeof callback === "function") {
                WeixinJSBridge.on("MagicEmojiSent", function (result) {
                    callback(result, result.msgMeta);
                })
            }
        },
        onUnityEvent: function (callback) {
            if (callback && typeof callback === "function") {
                WeixinJSBridge.on("UnityEvent", function (result) {
                    callback(result);
                })
            }
        },
        shakeVisibleBubblesAndAvatars: function (params = {}) {
            const cb = {
                success: function (res) {
                    if (params && params.success) {
                        params.success(res)
                    }
                },
                fail: function (errMsg) {
                    if (params && params.fail) {
                        params.fail(errMsg)
                    }
                }
            }
            invokeAsync("shakeVisibleBubblesAndAvatars", params, cb)
        },
        getMsgMeta: function (msgId, needFrame) {
            const arg = {
                msgId: msgId,
                needFrame: needFrame,
            }

            return invokeSync("getMsgMeta", arg)
        },

        impact: function (params = {}) {
            const cb = {
                success: function (res) {
                    if (params && params.success) {
                        params.success(res)
                    }
                },
                fail: function (errMsg) {
                    if (params && params.fail) {
                        params.fail(errMsg)
                    }
                }
            }
            invokeAsync("impact", params, cb)
        },

        getVisibleMsgMetas: function(needFrame) {
            const arg = {
                needFrame: needFrame
            }
            return invokeSync("getVisibleMsgMetas", arg)
        }
    }

})(window);
