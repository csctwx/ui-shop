var appUtil = {
  connectVM: function(url,remoteParameters){
   var mockUrl;
    if(appName == 'spp'){      
        mockUrl = "https://vm"+appUtil.vmVersion+"-msdp.test.prepaid.sprint.com/primary-rest/"+url;
       }else if(appName == 'bst'){
        mockUrl = "https://vm"+appUtil.vmVersion+"-msdp.test.boostmobile.com/primary-rest/"+url;
       }else if(appName == 'vmu'){
      mockUrl ="https://vm"+appUtil.vmVersion+"-msdp.test.virginmobileusa.com/primary-rest/"+url;
    }
     if (remoteParameters) {
     if(remoteParameters.indexOf("?") > -1){
      mockUrl = mockUrl + remoteParameters + "&" + "brandId=" + appName;
     }else{
       mockUrl = mockUrl +"?"+remoteParameters + "&" + "brandId=" + appName;
     }
        }else{
         mockUrl = mockUrl +"?"+ "brandId=" + appName;
        }
     return mockUrl;
  },
  inDev: function() {
    return location.host.indexOf("localhost") >= 0 || location.host.indexOf("vmu-local-app") >= 0 || location.host.indexOf("127.0.0.1") >= 0 || location.host.indexOf("boostmobile.com:7000") == 0 || location.host.indexOf("boostmobile.com:8080") == 0 || location.host.indexOf("vmu-local-app:8080") == 0;
  },
  init: function($route, $sce, $http, $scope) {
    this.$route = $route;
    this.$sce = $sce;
    this.$http = $http;
    this.$scope = $scope;
    this.cusSto = this.data.getStorage();
  },
  ui: {
    loadingCount: 0,
    styleMap: {},
    buildToolTip: function() {
      setTimeout("$('[data-toggle=\"tooltip\"]').tooltip()", 1000);
    },
    buildPopover: function() {
      var originalLeave = $.fn.popover.Constructor.prototype.leave;
      $.fn.popover.Constructor.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        var container, timeout;
        originalLeave.call(this, obj);
        if (obj.currentTarget) {
          container = $(obj.currentTarget).siblings('.popover')
          timeout = self.timeout;
          container.one('mouseenter', function() {
            clearTimeout(timeout);
            container.one('mouseleave', function() {
              $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
          })
        }
      };
      setTimeout("$('body').popover({selector: '[data-popover]', trigger: 'click hover', placement: 'auto', delay:{show: 10, hide: 400}})", 1000);
    },
    formatSup: function(ids) {
      $(ids).each(
        function() {
          var v = this.innerHTML;
          if (v.indexOf("<sup>") < 0 && v.indexOf("®") >= 0) {
            $(this).html(v.replace(/®/g, "<sup>®</sup>"));
          }
        }
      );
    },
    generateFullHref: function(hash, revmoeSearch) {
      if (revmoeSearch) {
        return location.href.replace(location.search, "").replace(location.hash, hash);
      }
      return location.href.replace(location.hash, hash);
    },
    createStyleClass: function(name, value) {
      if (appUtil.ui.styleMap[name]) {
        return;
      }
      $("head").append("<style>" + name + value + "</style>");
      appUtil.ui.styleMap[name] = 1;
    },
    setMetaInfo: function(name, value) {
      if (name == "title") {
        $('html head title').text(value);
      } else {
        $('html head meta[name=' + name + ']').attr("content", value);
      }
    },
    setCanonical: function(h){
      if( !appUtil.seoCanonicalEnabled ) {
        return;
      }
      if( h != null ){
        var b = appUtil.baseHref+h;
        if( $('html head link[rel="canonical"]').length ) {
          $('html head link[rel="canonical"]').attr('href',b);
        } else {
          $('html head').append('<link rel="canonical" href="'+b+'">');
        }
      } else {
        if( $('html head link[rel="canonical"]').length ) {
          $('html head link[rel="canonical"]').remove();
        }
      }
    },
    scrollTopToElement: function(e) {
      try {
        if ($(e).length && $(e).offset().top) {
          if (!this._loadTime) {
            this._loadTime = 1000;
          }
          setTimeout("appUtil.$scope.$apply();window.scrollTo(0,$('" + e + "').offset().top-100);", this._loadTime);
          this._loadTime = 100;
          return;
        }
      } catch (e) {}
      setTimeout("appUtil.ui.scrollTopToElement('" + e + "');", 100);
    },
    refreshContent: function(noScrollTop) {
      if (!noScrollTop) {
        setTimeout("appUtil.$scope.$apply();window.scrollTo(0,0);", 1);
      } else {
        setTimeout("appUtil.$scope.$apply();", 1);
      }
    },
    reload: function() {
      appUtil.$route.reload();
    },
    resizeIframe: function(id, bReadySet) {
      var obj = $(id)[0];
      if (bReadySet) {
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
      } else if (obj.ready) {
        setTimeout("appUtil.ui.resizeIframe('" + id + "',true)", 100);
      } else {
        setTimeout("appUtil.ui.resizeIframe('" + id + "',false)", 100);
      }
    },
    alert: function(msg) {
      appUtil.$scope.app.alertMsg.show(msg);
    },
    autoShowWaiting: function() {
      appUtil.ui.loadingCount++;
      if (appUtil.ui.loadingCount > 0) {
        $("#loading").show();
      }
    },
    autoHideWaiting: function() {
      appUtil.ui.loadingCount--;
      if (appUtil.ui.loadingCount <= 0) {
        $("#loading").hide();
        appUtil.ui.loadingCount = 0;
      }
    },
    trustAsHtml: function(v) {
      return appUtil.$sce.trustAsHtml(v);
    },
    htmlToText: function(v) {
      return $("<div>" + v + "</div>").text();
    },
    formatCurrency: function(v) {
      v = parseInt(v * 100);
      if (v == 0) {
        return "0.00";
      } else if (v < 10) {
        return "0.0" + v;
      } else if (v < 100) {
        return "0." + v;
      }
      v = v + "";
      return v.substring(0, v.length - 2) + "." + v.substring(v.length - 2);
    },
    generateDirectiveFun: function(moduleName, item, appPath) {
      return function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: appPath + "templates/" + moduleName + "/" + item + ".html?" + appUtil.appVersion
        };
      }
    },
    buildModuleDirective: function(module, directiveSetting) {
      directiveSetting.items = directiveSetting.items.split(",");
      for (var i = 0; i < directiveSetting.items.length; i++) {
        var item = directiveSetting.items[i];
        var appPath = "";
        if (item[0] == "$") {
          item = item.substring(1);
          appPath = appName + "/";
        } else if (item[0] == "@") {
          item = item.substring(1);
          if (location.pathname.indexOf("ui-shop/") >= 0) {
            var path = location.pathname.replace("ui-shop/", "ui-shared/");
          } else {
            var path = location.pathname + "ui-shared/ui-shared/";
          }
          appPath = path + appName + "/";
        }

        var key = directiveSetting.moduleName;
        var names = item.split("_");
        for (var n = 0; n < names.length; n++) {
          key += appUtil.data.capitalize(names[n]);
        }
        module.directive(key, appUtil.ui.generateDirectiveFun(directiveSetting.moduleName, item, appPath));
      }
    },
    openPopTip: function(id, event) {
      var wWidth = $(window).width();
      if (wWidth > 768) {
        $(id).show();
        var mLeft = event.pageX;
        var mTop = event.pageY;
        var pWidth = $(id)[0].clientWidth;
        var pHeight = $(id)[0].clientHeight;
        var pLeft = mLeft;
        if ((mLeft + pWidth) > wWidth) {
          pLeft = mLeft - pWidth;
        }
        var pTop = mTop - pHeight;
        $(id).css({
          top: pTop,
          left: pLeft
        });
      } else {
        $(id).show();
        var mLeft = 0;
        var mTop = event.pageY;
        var pWidth = $(id)[0].clientWidth;
        var pHeight = $(id)[0].clientHeight;
        var pLeft = mLeft;
        if (pWidth > wWidth) {
          pWidth = wWidth;
        } else {
          pLeft = (wWidth - pWidth) / 2;
        }
        var pTop = mTop - pHeight;
        pTop = pTop < 98 ? 98 : pTop;
        $(id).css({
          top: pTop,
          left: pLeft,
          width: pWidth
        });
      }
    },
    closePopTip: function(id, event) {
      if (event.type == 'click') {
        $(id).hide();
      } else {
        var mLeft = event.pageX;
        var mTop = event.pageY;
        var pLeft = parseInt($(id).css("left"));
        var pRight = pLeft + $(id)[0].clientWidth;
        var pTop = parseInt($(id).css("top"));
        var pBottom = pTop + $(id)[0].clientHeight;
        if ((mLeft < pLeft) || (mLeft > pRight) || (mTop < pTop) || (mTop > pBottom)) {
          $(id).hide();
        }
      }
    },
    centerElement: function(id) {
      $(id).show();
      $(id).css({
        position: "absolute",
        left: ($(window).width() - $(id)[0].clientWidth) / 2,
        top: ($(window).height() - $(id)[0].clientHeight) / 2
      })
    },
    startIdleReminder: function(id, timeInSecond, fun) {
      if (!this.reminders) {
        this.reminders = {};
      }
      this.reminders[id] = {
        fun: function() {
          if (appUtil.ui.reminders[id]) {
            clearTimeout(appUtil.ui.reminders[id].timeoutHandler);
          }
          appUtil.ui.reminders[id] = {
            timeoutHandler: setTimeout(fun, timeInSecond * 1000)
          };
        }
      };

      $("body," + id).on("keydown mousemove", function() {
        if (appUtil.ui.reminders[id]) {
          clearTimeout(appUtil.ui.reminders[id].timeoutHandler);
        }
        appUtil.ui.reminders[id] = {
          timeoutHandler: setTimeout(fun, timeInSecond * 1000)
        };
      });
      this.reminders[id].fun();
    },
    endIdleReminder: function(id) {
      try {
        clearTimeout(appUtil.ui.reminders[id].timeoutHandler);
      } catch (e) {

      }
      $("body," + id).off("keydown mousemove");
    },
    setEqualHeightLists: function(ulElement) {
      setTimeout(function() {
        var ulWidth = $(ulElement)[0].clientWidth;
        //var ulWidth = 640;        
        var lists = $(ulElement).children('li');
        var liWidth = lists[0].clientWidth;
        var cols = Math.floor(ulWidth / liWidth);
        for (var i = 0; i < (lists.length - cols); i += cols) {
          var maxHeight = 0;
          for (var j = i; j < (i + cols); j++) {
            maxHeight = (lists[j].clientHeight > maxHeight) ? lists[j].clientHeight : maxHeight;
          }
          var maxHeight = maxHeight + "px";
          for (var j = i; j < (i + cols); j++) {
            lists[j].style.height = maxHeight;
          }
        }
      }, 1);
    },
    previousPage: function() {
      window.history.back();
    }
  },
  net: {
    headersSetting: {
      headers: {
        name: "sprint"
      }
    },
    setUrlHash: function(v) {
      location.hash = v;
    },
    postData: function($http, url, data, extraHeaders) {
      var headers = appUtil.net.headersSetting;
      if (extraHeaders) {
        for (var k in extraHeaders) {
          headers.headers[k] = extraHeaders[k];
        }
      }
      return $http.post(appUtil.net.formatDataUrl(url), data, headers).error(function(data, status, headers, config) {
        appUtil.ui.alert(appMsg[appName].sysError);
        appUtil.ui.autoHideWaiting();
      });
    },
    getLocalData: function($http, url) {
      var path = location.pathname.replace("index.jsp", "");
      return $http.get(path + url).error(function(data, status, headers, config) {
        appUtil.ui.alert(appMsg[appName].sysError);
        appUtil.ui.autoHideWaiting();
      });
    },
    getData: function($http, url, parameters, extraheaders) {
      var headers = angular.copy(appUtil.net.headersSetting);
      if (extraheaders) {
        for (var k in extraheaders) {
          headers.headers[k] = extraheaders[k];
        }
      }
      if (url.indexOf("/primary/") >= 0) {
        headers.headers.accept = "text/html";
      } else {
        headers.headers.accept = "application/json"
      }
      return $http.get(appUtil.net.formatDataUrl(url, parameters), headers).error(function(data, status, headers, config) {
        appUtil.ui.alert(appMsg[appName].sysError);
        appUtil.ui.autoHideWaiting();
      });
    },
    formatDataUrl: function(url, remoteParameters) {
      if (appUtil.inDev()) {
      if(appUtil.connectionVM){
        return appUtil.connectVM(url, remoteParameters)
      }
        if (url[0] != "/") {
          url = "/" + url;
        }
        //appName = bst,spp,vmu based on the appName the application gets the data.
        url = "data/"+appName+"/"+ url;
        if (url.indexOf("/primary/") < 0) {
          url += ".json?"
        } else {
          url += ".html?"
        }
        return url + remoteParameters + "&" + appUtil.appVersion;
      } else {
        if (remoteParameters) {
          url = url + remoteParameters + "&"
        } else {
          url = url + "?"
        }
        if (url.indexOf("/primary/") != 0) {
          return "/primary-rest/" + url + "brandId=" + appName;
        }
        return url;
      }
    }
  },
  data: {
    lastId: new Date().getTime(),    
    generateId: function() {
      return this.lastId++;
    },
    validZip: function(p) {
      if (p) {
        var v = p.match(/[0-9]{5}/);
        return v && v[0] == p;
      }
      return false;
    },
    storeToLocal: function(name, value) {
      var data = JSON.parse(appUtil.cusSto.getItem("sprintShop-data"));
      if(data==null){
        data={};
      }
      value = angular.copy(value);
      data[name] = value;
      data.updateTime = new Date().getTime();
      data = JSON.stringify(data);
      appUtil.cusSto.setItem("sprintShop-data", data);
    },
    retrieveFromLocal: function(name) {
      var data = appUtil.cusSto.getItem("sprintShop-data");
      if (data) {
        data = JSON.parse(data);
        if (data.updateTime) {
          if (new Date().getTime() - data.updateTime <= 7 * 24 * 3600000) {
            return data[name];
          }
        } else {
          return data[name];
        }
      }
      appUtil.cusSto.setItem("sprintShop-data", "{\"updateTime\":" + (new Date().getTime()) + "}");
      return null;
    },
    removeFromLocal: function(name) {
      var data = appUtil.cusSto.getItem("sprintShop-data");
      if( data ) {
        data = JSON.parse(data);
        if( data[name] ) {
          delete data[name];
          data.updateTime = new Date().getTime();
          data = JSON.stringify(data);
          appUtil.cusSto.setItem("sprintShop-data", data);
        }
      }
    },
    retrieveFromCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },
    simplifyObject: function(o) {
      if (typeof o == "object") {
        if (jQuery.isEmptyObject(o)) {
          return "";
        }
        for (var k in o) {
          if (k == "$") {
            if (o.$ == "true") {
              return true;
            } else if (o.$ == "false") {
              return false;
            } else if ($.isNumeric(o.$)) {
              return parseFloat(o.$);
            } else {
              return o.$;
            }
          } else {
            o[k] = appUtil.data.simplifyObject(o[k]);
          }
        }
        return o;
      } else {
        return o;
      }
    },
    rename: function(obj, oldName, newName) {
      if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
      }
    },
    toArray: function(v) {
      if (v == null) {
        return [];
      }
      if (!angular.isArray(v)) {
        return [v];
      }
      return v;
    },
    removeItemFromArray: function(items, item) {
      for (var i = 0; i < items.length; i++) {
        if (items[i] == item) {
          items.splice(i, 1);
          return;
        }
      }
    },
    retrieveIntersection: function(d1, d2) {
      var d = {};
      for (var k in d1) {
        if (d2[k] == d1[k]) {
          d[k] = d2[k];
        }
      }
      return d;
    },
    retrieveUnion: function(d1, d2) {
      var d = {};
      if (d1 != null) {
        for (var k in d1) {
          d[k] = d1[k];
        }
      }
      if (d2 != null) {
        for (var k in d2) {
          d[k] = d2[k];
        }
      }
      return d;
    },
    hasIntersection: function(d1, d2) {
      for (var k in d1) {
        if (d2[k] == d1[k]) {
          return true;
        }
      }
      return false;
    },
    capitalize: function(txt, all) {
      if ((typeof all !== "undefined") && (all == "true")) {
        return txt.replace(/([^\W_]+[^\s-]*) */g);
      } else {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      }
    },
    keyToTitle: function(k) {
      var t = "";
      var bFirst = true;
      var last = "";
      for (var i = 0; i < k.length; i++) {
        var v = k[i];
        if (i == 0) {
          v = v.toUpperCase();
        }
        if (v >= "A" && v <= "Z" && !bFirst) {
          bFirst = true;
          t += " ";
        } else if (v >= "A" && v <= "Z") {
          if (i + 1 < k.length) {
            var vv = k[i + 1];
            if (!(vv >= "A" && vv <= "Z")) {
              t += " ";
            }
          }
        } else {
          bFirst = false;
        }

        t += v;
        last = v;
      }
      return t;
    },
    initObjValue: function(souData, valueObj, path, valueName, initValue) {
      if (!angular.isObject(souData) || angular.isDate(souData) || angular.isArray(souData)) {
        eval(path + "." + valueName + "=" + initValue + ";");
        return;
      }
      for (var k in souData) {
        eval(path + "." + k + "={}");
        appUtil.data.initObjValue(souData[k], valueObj, path + "." + k, valueName, initValue);
      }
    },
    formatImagePath: function(v) {
      try {
        v = v.substring(v.indexOf("/repository"));
        if (appUtil.inDev() && v.indexOf("/repository") >= 0) {
          v = "https://vm4-msdp.test.boostmobile.com/" + v;
        }
      } catch (e) {}
      return v;
    },
    attachData: function(dFrom, dTo) {
      for (var k in dFrom) {
        if (!k) {
          continue;
        }
        if (dTo[k] && angular.isObject(dTo[k]) && !angular.isArray(dTo[k])) {
          appUtil.data.attachData(dFrom[k], dTo[k]);
        } else {
          dTo[k] = dFrom[k];
        }
      }
      return dTo;
    },
    processCSVData: function(allText, cols) {
      var record_num = cols; // or however many elements there are in each row
      var allTextLines = allText.split(/\r\n|\n/);
      var entries = allTextLines[0].split(',');
      entries = ['country', 'lowest', 'landLine', 'asLowAsLL', 'mobile', 'asLowAsMobile'];
      var lines = [];

      var headings = entries.splice(0, record_num);
      for (var i = 1; i < allTextLines.length; i++) {
        entries = allTextLines[i].split(',');
        var tarr = {};
        for (var j = 0; j < record_num; j++) {
          tarr[headings[j]] = entries.shift();
          if (3 == j || 5 == j) {
            if (tarr[headings[j]]) {
              tarr[headings[j]] = tarr[headings[j]] + ' ';
            }
          }
        }
        lines.push(tarr);
      }
      return lines;
    },
    getStorage: function() {
      var storageImpl;

      try {
        localStorage.setItem("storage", "");
        localStorage.removeItem("storage");
        storageImpl = localStorage;
      } catch (err) {
        storageImpl = new function(){

          var structureLocalStorage = {};

          this.setItem = function(key, value) {
            structureLocalStorage[key] = value;
          };

          this.getItem = function(key) {
            if (typeof structureLocalStorage[key] != 'undefined') {
              //return structureLocalStorage[key];
              return null;
            } else {
              return null;
            }
          };

          this.removeItem = function(key) {
            structureLocalStorage[key] = undefined;
          }
        };
      }

      return storageImpl;

    },
    base64Array2String: function(array) {
      var result = "";
      for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
      }
      return result;
    },
    formatMDN: function (mdn) {
      var formattedmdn = mdn.substring(0,3) + '-' + mdn.substring(3,6) + '-' + mdn.substring(6,10);
      return formattedmdn;
    },
    unformatMDN: function(formattedMDN){
      return formattedMDN.replace(/-/g,'');
    }
  },
  exeFun: function(fun) {
    if (fun) {
      if (angular.isFunction(fun)) {
        fun();
      } else {
        eval(fun);
      }
    }
  },
  log: function(msg) {
    try {
      if (appUtil.bDev) {
        console.log(msg);
      }
    } catch (e) {

    }
  },
  showDialog: function(dialog) {
    appUtil.$scope.app.commonDialog.show(dialog);
  },
  isLocal: function (){
    var absUrl = window.location.href;
    return absUrl.indexOf('http://vmu-local-app')>-1;
  },
  isProd: function (){
	    var absUrl = window.location.href;
	    return ((absUrl.indexOf('http://www')>-1) || (absUrl.indexOf('https://www')>-1));
	  },
  getBanner: function (http, bannerId) {
    if (bannerId) {
      return http({
        method: 'GET',
        url: appUtil.net.formatDataUrl('shop_get_overlay_banner', '?overlayBannerId='+bannerId),
        headers: {
          'name': 'sprint'
        }
      });
    }
  },
  mapImgFun:function(){
    var vs=$(".mapImg");
    for(var i=0;i<vs.length;i++){
      var v=vs[i];
      var init=!v._initialWidth;
      if(init){
        $(v).css({"width":"initial","max-width":"initial"});
        v._initialWidth=$(v).width();
        $(v).css({"width":"100%","max-width":"100%"});
      }
      var r =$(v).width()/v._initialWidth;

      var os=$($(".mapImg").attr("usemap")+" area");
      if(init){
        v._initialCoords=[];
      }
      for(var n=0;n<os.length;n++){
        var o=os[n];
        if(init){
          v._initialCoords.push(o.coords);
        }
        var coords=v._initialCoords[n].split(",");
        for(var m=0;m<coords.length;m++){
          coords[m]*=r;
        }
        o.coords=coords.toString().replace(/\[\]/g,"");
      }
    }
  }
};