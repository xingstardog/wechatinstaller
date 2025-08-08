(function() {
if (typeof wx !== 'undefined') {
  if (typeof wxNative === 'undefined') {
    if (typeof wx.getBaseMethods !== 'function') {
      return 'fail:init wxNative fail, wx.getBaseMethods is null'
    }
    wxNative = (function () {
      var _baseMethods = wx.getBaseMethods();

      var _invokeMethod = _baseMethods.invokeMethod;
      var _onMethod = _baseMethods.onMethod;

      var _openChannelsRedPacketPublish = function (args) {
        _invokeMethod("openChannelsRedPacketPublish", args);
      };

      var _openWCPayOverseaPaymentReceive = function (args) {
        _invokeMethod("openWCPayOverseaPaymentReceive", args);
      };

      var _requestPayAuthen = function (args) {
        _invokeMethod("requestPayAuthen", args);
      };

      var _openRedPacketEditPage = function (args) {
        _invokeMethod("openRedPacketEditPage", args);
      };

      var _requestOfflineUserBindQuery = function (args) {
        _invokeMethod("requestOfflineUserBindQuery", args);
      };

      var _private_onWebPageUrlExposed = function(args) {
          _invokeMethod("private_onWebPageUrlExposed", args)
      };
      var _handleWCPayOverseaWalletBuffer = function (args) {
        _invokeMethod("handleWCPayOverseaWalletBuffer", args);
      };

      var _notifyDcpPaymentCallback = function(args) {
        _invokeMethod("notifyDcpPaymentCallback", args);
      };

      var _shareFinderEndorsementToFriend = function (args) {
        _invokeMethod("shareFinderEndorsementToFriend", args);
      }

      var _openFinderProfile = function (args) {
        _invokeMethod("openFinderProfile", args);
      }

      var _shareFinderProduct = function (args) {
          _invokeMethod("shareFinderProduct", args);
       }

      var _openFinderChattingUI = function (args) {
          _invokeMethod("openFinderChattingUI", args);
       }

      var _shareFinderOrder = function (args) {
          _invokeMethod("shareFinderOrder", args);
       }

      var _getLocalLiveInfo = function (args) {
          _invokeMethod("getLocalLiveInfo", args);
       }

      var _startChannelsLive = function (args) {
          _invokeMethod("startChannelsLive", args);
       }

      var _endorsementFinished = function (args) {
        _invokeMethod("endorsementFinished", args);
      }

      var _kvReport = function (args) {
        _invokeMethod("kvReport", args);
      }

      var _declareOriginalFinished = function (args) {
        _invokeMethod("declareOriginalFinished", args);
      }



      var _openWebViewUseFastLoad = function (args) {
        _invokeMethod("openWebViewUseFastLoad", args);
      };

      var _sendRedCoverAppMsg = function (args) {
        _invokeMethod("sendRedCoverAppMsg", args);
      };

      var _jumpRedPacketEnvelopeList = function (args) {
        _invokeMethod("jumpRedPacketEnvelopeList", args);
      };

      var _jumpRedPacketEnvelopePreview = function (args) {
        _invokeMethod("jumpRedPacketEnvelopePreview", args);
      };

      var _phoneBindCardEntry = function (args) {
          _invokeMethod("phoneBindCardEntry", args);
      };

      var _openChannelsOrderCenter = function (args) {
          _invokeMethod("openChannelsOrderCenter", args);
      };

      var _shareCurrentFinderLive = function (args) {
          _invokeMethod("shareCurrentFinderLive", args);
      };

      var _controlFinderLiveShopShelf = function (args) {
          _invokeMethod("controlFinderLiveShopShelf", args);
      };

      var _shareImageMessage = function (args) {
          _invokeMethod("shareImageMessage", args);
      };

      var _onNavigateBackIntercept = function (args) {
          _invokeMethod("onNavigateBackIntercept", args);
      };

      var _setNavigateBackInterceptionForFakeNative = function (args) {
          _invokeMethod("setNavigateBackInterceptionForFakeNative", args);
      };

      var _getPhoneNumberForFakeNative = function (args) {
          _invokeMethod("getPhoneNumberForFakeNative", args);
      };

      var _showLiveToast = function (args) {
          _invokeMethod("showLiveToast", args);
      };

      var _requestSnsPayment = function (args) {
          _invokeMethod("requestSnsPayment", args);
      };

      var _jumpToWCPayMessage = function (args) {
          _invokeMethod("jumpToWCPayMessage", args);
      };

      var _createWebViewForFastLoad = function (args) {
        _invokeMethod("createWebViewForFastLoad", args);
      };

      var _downloadPageDataForFastLoad = function (args) {
        _invokeMethod("downloadPageDataForFastLoad", args);
      };

      var _openLiteApp = function(args) {
        _invokeMethod("openLiteApp", args);
      }

      var _preloadLiteApp = function(args) {
        _invokeMethod("preloadLiteApp", args);
      }

      function transWxmlToHtml(url) {
        if (typeof url !== 'string') {
          return url;
        } else {
          var splits = url.split('?');
          var path = splits[0];
          var query = splits[1];

          if (!path.endsWith('html')) {
            path += '.html';
          }

          if (typeof query !== 'undefined') {
            return path + "?" + query;
          } else {
            return path;
          }
        }
      }

      var _navigateToMiniProgram = function (args) {
        if (args.path) {
            args.path = transWxmlToHtml(args.path);
        }
        _invokeMethod("navigateToMiniProgram", args);
      };
      var _navigateToMiniProgramForFinderProductShare = function (args) {
        if (args.path) {
            args.path = transWxmlToHtml(args.path);
        }
        _invokeMethod("navigateToMiniProgramForFinderProductShare", args)
      };

      var _onWxNativeEvent = function (callback) {
        _onMethod('onWxNativeEvent', callback);
      };

      var _onUpdateChannelFeedsEvent = function (callback) {
        _onMethod('onUpdateChannelFeeds', callback);
      };

      var _onGetRecentUsageListResult = function (callback) {
         _onMethod('onGetRecentUsageListResult', callback);
      };

      var _onSheetModeVisibleHeightChange = function (callback) {
         _onMethod('onSheetModeVisibleHeightChange', callback);
      };

      var _onEcsEvent = function (callback) {
         _onMethod('onEcsEvent', callback);
      };

      var _saveSplashScreenshot = function(args) {
        _invokeMethod("saveSplashScreenshot", args)
      }
      var _hideSplashScreenshot = function(args) {
        _invokeMethod("hideSplashScreenshot", args)
      }

      var _removeSplashScreenshot = function(args) {
        _invokeMethod("removeSplashScreenshot", args)
      }

      var _getRecentUsageList = function(args) {
         _invokeMethod("getRecentUsageList", args)
      }

      var _operateRecentUsageList = function(args) {
         _invokeMethod("operateRecentUsageList", args)
      }

      var _openWCExDeviceList = function(args) {
          _invokeMethod("openWCExDeviceList", args)
      }

      var _checkStrangerContactListIsFriend = function(args) {
          _invokeMethod("checkStrangerContactListIsFriend", args)
      }

      var _openTextStateMessage = function(args) {
          _invokeMethod("openTextStateMessage", args)
      }

      var _openChannelsPostPage = function(args) {
          _invokeMethod("openChannelsPostPage", args)
      }

      var _openChannelsCreateContact = function(args) {
          _invokeMethod("openChannelsCreateContact", args)
      }

      var _recordOperateUserDataInWa = function(args) {
          _invokeMethod("recordOperateUserDataInWa", args)
      }

      var _extTransfer = function(args) {
          _invokeMethod("extTransfer", args)
      }
      var _webTransfer = function(args) {
          _invokeMethod("webTransfer", args)
      }
      var _ecdsaSign = function(args) {
          _invokeMethod("ecdsaSign", args)
      }

      var _getWCCoinBalance = function (args) {
        _invokeMethod("getWCCoinBalance", args);
      };

      var _buyWCCoin= function (args) {
        _invokeMethod("buyWCCoin", args);
      };

      var _consumeWCCoin = function (args) {
        _invokeMethod("consumeWCCoin", args);
      };

      var _showWCCoinFirstBuyCoinTips = function (args) {
        _invokeMethod("showWCCoinFirstBuyCoinTips", args);
      };
      var _shareFinderShop = function (args) {
        _invokeMethod("shareFinderShop", args);
      };

      var _enterWCCoinHomePage = function (args) {
        _invokeMethod("enterWCCoinHomePage", args);
      };

      var _callbackDataToNative = function (args) {
        _invokeMethod("callbackDataToNative", args);
      };

      var _onNativePostData = function (callback) {
        _onMethod("onNativePostData", callback)
      };

      var _nativeWXPayCgiTunnel = function (args) {
        _invokeMethod("nativeWXPayCgiTunnel", args);
      };

      var _openCustomerServiceChatForFakeNative = function (args) {
       _invokeMethod("openCustomerServiceChatForFakeNative", args);
      };

      var _rtosWatchQuickReply = function (callback) {
        _invokeMethod("rtosWatchQuickReply", callback)
      };

      var _chooseMultiWechatChatroom = function(args) {
        _invokeMethod("chooseMultiWechatChatroom", args)
      };

      var _getWeAppNewTipsInfo = function(args) {
           _invokeMethod("getWeAppNewTipsInfo", args)
      };

      var _deleteWeAppNewTipsInfo = function(args) {
          _invokeMethod("deleteWeAppNewTipsInfo", args)
      };

      var _operateWxappCGI = function(args) {
          _invokeMethod("operateWxappCGI", args)
      };

      var _shareSpecificWxapp = function(args) {
          _invokeMethod("shareSpecificWxapp", args)
      };

      var _operateWxappStarItem = function(args) {
          _invokeMethod("operateWxappStarItem", args)
      };

      var _pushNativeWebView = function(args) {
          _invokeMethod("pushNativeWebView", args)
      };

      var _getABTestConfig = function(args) {
          _invokeMethod("getABTestConfig", args)
      };

      var _openBizProfile = function(args) {
          _invokeMethod("openBizProfile", args)
      };

      var _privateEnterContact = function(args) {
          _invokeMethod("privateEnterContact", args)
      };

      var _launchMiniProgram = function(args) {
        _invokeMethod("launchMiniProgram", args)
      };

      var _getAppContact = function(args) {
          _invokeMethod("getAppContact", args)
      };

      var _setNavigateBackInterception = function(args) {
          _invokeMethod("setNavigateBackInterception", args)
      };

      var _updateAppContact = function(args) {
          _invokeMethod("updateAppContact", args)
      };

      var _publishWeChatStateDirectly = function (args) {
          _invokeMethod("publishWeChatStateDirectly", args)
      };

      var _requestWCPayRealnameVerify = function(args) {
        _invokeMethod("requestWCPayRealnameVerify", args);
      }


      var _quickSendRedPacket = function(args) {
          _invokeMethod("quickSendRedPacket", args);
      }

      var _roamApiChannel = function(args) {
          _invokeMethod("roamApiChannel", args)
      }
      var _goToLiteAppRoam = function(args) {
          _invokeMethod("goToLiteAppRoam", args)
      }

       var _sheetModeWindowStateChangedEvent = function (callback) {
             _onMethod('sheetModeWindowStateChangedEvent', callback);
       };

      var _getWeAppProfileInfo = function(args) {
          _invokeMethod("getWeAppProfileInfo", args)
      };

      var _openWeComUserProfileForFakeNative = function (args) {
       _invokeMethod("openWeComUserProfileForFakeNative", args);
      };

      var _requestContactDisplayInfo = function(args) {
          _invokeMethod("requestContactDisplayInfo", args);
      }

      var _openAddressEditor = function (args) {
       _invokeMethod("openAddressEditor", args);
      };

      var _openMyAddress = function (args) {
       _invokeMethod("openMyAddress", args);
      };


      var _handleBrandPersonalCenterAction = function(args) {
          _invokeMethod("handleBrandPersonalCenterAction", args);
      }

      var _requestFindPayPwdWay = function(args) {
           _invokeMethod("requestFindPayPwdWay", args);
      }

      var _captureHTMLWebviewFullScreenshot = function(args) {
          _invokeMethod("captureHTMLWebviewFullScreenshot", args);
      }

      var _setScreenMode = function (args) {
       _invokeMethod("setScreenMode", args);
      };

      var _collectWepalm = function(args) {
        _invokeMethod("collectWepalm", args);
      }

      var _getAccessibilitySecureRiskInfo = function(args) {
        _invokeMethod("getAccessibilitySecureRiskInfo", args);
      }

      var _openNewLifeEditor = function (args) {
       _invokeMethod("openNewLifeEditor", args);
      };

      var _openNewLifeDetail = function (args) {
       _invokeMethod("openNewLifeDetail", args);
      };

      var _getEncryptHKPasswd = function(args) {
         _invokeMethod("getEncryptHKPasswd", args);
      };

      var _insertFinderWidget = function (args) {
        _invokeMethod("insertFinderWidget", args);
      };
      var _getFinderWidget = function (args) {
        _invokeMethod("getFinderWidget", args);
      };

      var _systemCapabilityAuthorizationStatus = function (args) {
        _invokeMethod("systemCapabilityAuthorizationStatus", args);
      };

      var _requestSystemCapabilityAuthorization = function (args) {
        _invokeMethod("requestSystemCapabilityAuthorization", args);
      };

      var _openCardPkgDetailList = function(args) {
        _invokeMethod("openCardPkgDetailList", args);
      };

      var _updateCommonUsedList = function (args) {
             _invokeMethod("updateCommonUsedList", args);
      };

      var _private_quicklyAddBrandContact = function (args) {
        _invokeMethod("private_quicklyAddBrandContact", args);
      };

      var _handleEcsAction = function (args) {
        _invokeMethod("handleEcsAction", args);
      };

      var _uploadToCommonCDN = function (args) {
        _invokeMethod("uploadToCommonCDN", args);
      };

      var _genRedPackageCover = function(args) {
        _invokeMethod("genRedPackageCover", args);
      };

      var _openUserProfile = function(args) {
        _invokeMethod("openUserProfile", args);
      }

      var _private_choosePoi = function(args) {
        _invokeMethod("private_choosePoi", args);
      }

      var _showSmileyPanel = function(args) {
        _invokeMethod("showSmileyPanel", args);
      }

      var _onGetSmiley = function (callback) {
         _onMethod('onGetSmiley', callback);
      }

      /**** Add JsApi Here ****/

      var methodsList = {
        openRedPacketEditPage: _openRedPacketEditPage,
        requestPayAuthen: _requestPayAuthen,
        openChannelsRedPacketPublish: _openChannelsRedPacketPublish,
        openWCPayOverseaPaymentReceive: _openWCPayOverseaPaymentReceive,
        requestOfflineUserBindQuery: _requestOfflineUserBindQuery,
        private_onWebPageUrlExposed: _private_onWebPageUrlExposed,
        handleWCPayOverseaWalletBuffer: _handleWCPayOverseaWalletBuffer,
        navigateToMiniProgram: _navigateToMiniProgram,
        navigateToMiniProgramForFinderProductShare: _navigateToMiniProgramForFinderProductShare,
        shareFinderEndorsementToFriend : _shareFinderEndorsementToFriend,
        openFinderProfile : _openFinderProfile,
        shareFinderProduct : _shareFinderProduct,
        openFinderChattingUI : _openFinderChattingUI,
        shareFinderOrder : _shareFinderOrder,
        getLocalLiveInfo : _getLocalLiveInfo,
        startChannelsLive : _startChannelsLive,
        endorsementFinished : _endorsementFinished,
        kvReport : _kvReport,
        declareOriginalFinished : _declareOriginalFinished,
        saveSplashScreenshot : _saveSplashScreenshot,
        hideSplashScreenshot : _hideSplashScreenshot,
        removeSplashScreenshot : _removeSplashScreenshot,
        openWebViewUseFastLoad : _openWebViewUseFastLoad,
        getRecentUsageList: _getRecentUsageList,
        operateRecentUsageList: _operateRecentUsageList,
        openWCExDeviceList: _openWCExDeviceList,
        openChannelsPostPage: _openChannelsPostPage,
        openChannelsCreateContact: _openChannelsCreateContact,
        openWCExDeviceList: _openWCExDeviceList,
        sendRedCoverAppMsg: _sendRedCoverAppMsg,
        jumpRedPacketEnvelopeList: _jumpRedPacketEnvelopeList,
        jumpRedPacketEnvelopePreview: _jumpRedPacketEnvelopePreview,
        openTextStateMessage: _openTextStateMessage,
        checkStrangerContactListIsFriend: _checkStrangerContactListIsFriend,
        phoneBindCardEntry: _phoneBindCardEntry,
        openChannelsOrderCenter: _openChannelsOrderCenter,
        shareCurrentFinderLive: _shareCurrentFinderLive,
        controlFinderLiveShopShelf: _controlFinderLiveShopShelf,
        shareImageMessage: _shareImageMessage,
        onNavigateBackIntercept: _onNavigateBackIntercept,
        setNavigateBackInterceptionForFakeNative: _setNavigateBackInterceptionForFakeNative,
        getPhoneNumberForFakeNative: _getPhoneNumberForFakeNative,
        showLiveToast: _showLiveToast,
        requestSnsPayment: _requestSnsPayment,
        jumpToWCPayMessage: _jumpToWCPayMessage,
        recordOperateUserDataInWa : _recordOperateUserDataInWa,
        openLiteApp: _openLiteApp,
        preloadLiteApp: _preloadLiteApp,
        notifyDcpPaymentCallback : _notifyDcpPaymentCallback,

        extTransfer: _extTransfer,
        webTransfer: _webTransfer,
        ecdsaSign : _ecdsaSign,

        getWCCoinBalance: _getWCCoinBalance,
        buyWCCoin: _buyWCCoin,
        consumeWCCoin: _consumeWCCoin,
        showWCCoinFirstBuyCoinTips: _showWCCoinFirstBuyCoinTips,
        enterWCCoinHomePage: _enterWCCoinHomePage,
        nativeWXPayCgiTunnel: _nativeWXPayCgiTunnel,
        callbackDataToNative: _callbackDataToNative,

        createWebViewForFastLoad: _createWebViewForFastLoad,
        downloadPageDataForFastLoad: _downloadPageDataForFastLoad,
        shareFinderShop:_shareFinderShop,
        openCustomerServiceChatForFakeNative: _openCustomerServiceChatForFakeNative,

        rtosWatchQuickReply: _rtosWatchQuickReply,
        chooseMultiWechatChatroom: _chooseMultiWechatChatroom,

        getWeAppNewTipsInfo: _getWeAppNewTipsInfo,
        deleteWeAppNewTipsInfo: _deleteWeAppNewTipsInfo,

        privateEnterContact: _privateEnterContact,
        openBizProfile: _openBizProfile,
        getABTestConfig: _getABTestConfig,
        getAppContact: _getAppContact,
        setNavigateBackInterception: _setNavigateBackInterception,

        launchMiniProgram: _launchMiniProgram,

        operateWxappCGI: _operateWxappCGI,
        shareSpecificWxapp: _shareSpecificWxapp,
        operateWxappStarItem: _operateWxappStarItem,
        pushNativeWebView: _pushNativeWebView,
        updateAppContact: _updateAppContact,
        requestWCPayRealnameVerify: _requestWCPayRealnameVerify,
        quickSendRedPacket: _quickSendRedPacket,
        roamApiChannel: _roamApiChannel,
        goToLiteAppRoam: _goToLiteAppRoam,
        getWeAppProfileInfo: _getWeAppProfileInfo,
        openCardPkgDetailList: _openCardPkgDetailList,

        openWeComUserProfileForFakeNative: _openWeComUserProfileForFakeNative,
        requestContactDisplayInfo: _requestContactDisplayInfo,
        handleBrandPersonalCenterAction: _handleBrandPersonalCenterAction,

        openMyAddress: _openMyAddress,
        openAddressEditor: _openAddressEditor,
        publishWeChatStateDirectly: _publishWeChatStateDirectly,
        requestFindPayPwdWay: _requestFindPayPwdWay,
        getEncryptHKPasswd : _getEncryptHKPasswd,

        captureHTMLWebviewFullScreenshot: _captureHTMLWebviewFullScreenshot,
        setScreenMode: _setScreenMode,
        collectWepalm: _collectWepalm,
        getAccessibilitySecureRiskInfo: _getAccessibilitySecureRiskInfo,
        insertFinderWidget: _insertFinderWidget,
        getFinderWidget: _getFinderWidget,
        openNewLifeEditor: _openNewLifeEditor,
        openNewLifeDetail: _openNewLifeDetail,
        updateCommonUsedList: _updateCommonUsedList,
        systemCapabilityAuthorizationStatus: _systemCapabilityAuthorizationStatus,
        requestSystemCapabilityAuthorization: _requestSystemCapabilityAuthorization,
        private_quicklyAddBrandContact: _private_quicklyAddBrandContact,
        handleEcsAction: _handleEcsAction,
        uploadToCommonCDN: _uploadToCommonCDN,
        genRedPackageCover: _genRedPackageCover,
        openUserProfile: _openUserProfile,
        private_choosePoi: _private_choosePoi,
        showSmileyPanel: _showSmileyPanel,
      };
      /**** Add JsApiEvent Here ****/

      var eventList = {
        onWxNativeEvent: _onWxNativeEvent,
        onNativePostData: _onNativePostData,
        onUpdateChannelFeedsEvent: _onUpdateChannelFeedsEvent,
        onGetRecentUsageListResult: _onGetRecentUsageListResult,
        sheetModeWindowStateChangedEvent: _sheetModeWindowStateChangedEvent,
        onSheetModeVisibleHeightChange: _onSheetModeVisibleHeightChange,
        onEcsEvent: _onEcsEvent,
        onGetSmiley: _onGetSmiley,
      };
      ["onRequestStatusEmojiPanelDismiss", "onRequestStatusEmojiPanelShow","onPostTextStatus", "onRequestRecommendIconComplete"].forEach(name => {
        eventList[name] = function(callback) {
          _onMethod(name, callback)
        }
      });
      /**** canIUse ****/

      var canIUse = function canIUse(name) {
        name = name || ''
        return !!methodsList[name];
      };

      return Object.assign({
        canIUse: canIUse
      }, methodsList, eventList);
    })();
    return 'ok:init wxNative ok'
  } else {
    return 'ok:init wxNative skipped, already init'
  }
} else {
  return "fail:init wxNative fail, wx is null"
}
})();
