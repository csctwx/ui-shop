(function() {
  var appTemplates="@head,@footer,$home,$shop,navigator,container,@head_mini,coverage_map,alert_msg,common_dialog,zipcode,page_not_found";
  if(appName=="spp"){
    appTemplates+=",$bestbuy";
  }else if(appName=="vmu"){
    appTemplates+=",$market,$search,$search_data";
  }else{
    appTemplates+=",$title,$market,$search,$search_data";
  }
  
  var app = angular.module('app-directives', []);
  var directiveSetting={
    moduleName:"app",
    items:appTemplates
  };
  appUtil.ui.buildModuleDirective(app,directiveSetting);
})();
var moduleList = ['ngDialog', 'app-directives', 'phone-directives', 'support-directives', 'cart-directives', 'checkout-directives', 'banner-directives', 'page-directives', 'nextversion-directives', 'store-directives'];
if (appName == "spp") {
    moduleList.push('as-directives');
    moduleList.push('plan-directives');
}
var appModule = angular.module('appSprint', moduleList)

appModule.value('carousel', {

  bannerTop:{
    id: 'carousel-banner-top',
    items: [      
      {
        image: 'bst/img/hero_2for65.jpg',
        url: 'https://www.boostmobile.com/specials/1021/',
        alt: '2 Lines for $65'
      },
      {
        image: 'bst/img/FamPlan_HPHero.jpg',
        url: 'https://www.boostmobile.com/shop/plans/family-plans/',
        alt: 'Family Plan'
      },
      {
        image: 'bst/img/hero_rebate.jpg',
        url: 'https://www.boostmobile.com/shop/phones',
        alt: 'Discount & Rebate'
      },
      {
        image: 'bst/img/Mex5_HPHero.jpg',
        url: '#!/shop/plans/international-services/?icamp=INTC_HP_Row1d_Main_IntlRoaming',
        alt: 'Mexico $5'
      }      
    ]    
  },
  bannerTopMobile:{
    id: 'carousel-banner-top-mobile',
    items: [      
      {
        image: 'bst/img/hero_2for65_mobile.jpg',
        url: 'https://www.boostmobile.com/specials/1021/',
        alt: '2 Lines for $65'
      },
      {
        image: 'bst/img/FamPlan_HPHero_Mobile.jpg',
        url: 'https://www.boostmobile.com/shop/plans/family-plans/',
        alt: 'Family Plan'
      },
      { 
        image: 'bst/img/hero_rebateMobile.jpg',
        url: 'https://www.boostmobile.com/shop/phones',
        alt: 'Discount & Rebate'
        
      },
      {
        image: 'bst/img/mobile_mexico.jpg',
        url: '#!/shop/plans/international-connect/?icamp=INTC_HP_Row1d_Main_IntlRoaming',
        alt: 'Mexico $5'
      }      
    ]        
  }
});

appModule.directive('appCarousel', function($interval) {
    return {
        restrict: "EA",
        scope: {
            carousel: "="
        },
        templateUrl: "templates/app/carousel.html",
        link: function(scope, element, attrs) {
            var stopTime = $interval(function() {
                element.find('.right.carousel-control').trigger('click');
            }, 5000);

            element.on('$destroy', function() {
                $interval.cancel(stopTime);
            });
        }
    }
});

appModule.factory('loadingListener', [function() {
    var loadingListener = {
        request: function(config) {
            appUtil.ui.autoShowWaiting();
            return config;
        },
        response: function(response) {
            appUtil.ui.autoHideWaiting();
            return response;
        }
    };
    return loadingListener;
}]);

appModule.factory('AnalysisService', function() {
    var analysisData = {};

    var analysis = {};
    analysis.setCommonData = function(dataObj) {
        analysisData = {
            page: {},
            shop: {
                cart: ""
            },
            login: {
                "status": ""
            },
            account: {
                BAN: ""
            },
            subscription: {
                subscriberID: "",
                currentDeviceID: "",
                planID: "",
                restartElig: "",
                throttleState: "",
                usageSummary: ""
            }
        };        
        var path = pathMap._getCurPath();
        var node = path[path.length - 1];
        analysisData.page = node._adobeData.page;
        analysisData.page.language = '';
        if(dataObj){
            if(dataObj.page){
                this.setPageData(dataObj.page);
            }
            if(dataObj.shop){
                this.setShopData(dataObj.shop);
            }
        }
        if(!analysisData.page.app){
            var app = '';
            if(appName == 'bst'){
                app = 'BoostMobile';
            }
            else if(appName == 'spp'){
                app = 'SprintPrepaid';
            }
            else if(appName == 'vmu'){
                app = 'VMU';
            }
            else if(appName == 'aw'){
                app = 'AW';
            }
            analysisData.page.app = app; 
        }               
    };
    analysis.setPageData = function(pageObj) {
        angular.forEach(pageObj, function(value, key){
            analysisData.page[key] = value;
        });        
    };
    analysis.setShopData = function(shopObj) {
        angular.forEach(shopObj, function(value, key){
            analysisData.shop[key] = value;
        }); 
    };
    analysis.getData = function() {
        return analysisData;
    };
    analysis.sendAnalysisData = function() {
        var path = pathMap._getCurPath();
        var node = path[path.length - 1];
        node._adobeData = analysisData;
        analysisManager.sendData();
    }

    return analysis;
});

appModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('loadingListener');
}]);
appModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode(true);
}]);
appModule.config(['ngDialogProvider', function(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        trapFocus: false,
        preCloseCallback: function() {
            console.log('default pre-close callback');
        }
    });
}]);

//add unsafe html filter
appModule.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }
});
appModule.controller('appController', ['$sce','$http','$scope','$rootScope','ngDialog', 'carousel', function($sce,$http,$scope,$rootScope,ngDialog,carousel){
  var app=this;
  $scope.appUtil=appUtil;
  $scope.appAccount=appAccount;
  appUtil.init(null,$sce,$http,$scope);
  $scope.JSON=JSON;
  $scope.commonData=commonData;
  $scope.pathMap=pathMap;
  $scope.linkMap=linkMap;
  $scope.appName=appName;
  $scope.appErrorCheckout1=appErrorCheckout1;
  $scope.appErrorCheckout2=appErrorCheckout2;
  $scope.appErrorCheckout3=appErrorCheckout3;
  $scope.appDisplayName=appDisplayName;
  this.carousel=carousel;
  this.config={
    DATA_VERSION:"1.0"
  }
    this.loadGlobalConfig=function(){
        appUtil.net.getData($http,"shop_get_configuration","?confName=all").success(function(data){
            if(data.responses.response && data.responses.response[0].configurationResponse){
                for(var i=0;i<data.responses.response[0].configurationResponse.output.configuration.entry.length;i++){
                  var d=data.responses.response[0].configurationResponse.output.configuration.entry[i];
                  if(d.key && d.value){
                    app.config[d.key.$]=d.value.$;
                  }
                }
            }
            if (appName == 'bst') {
                if (app.config["maxItemNumbersBST"]) {
                    app.config["max-number-of-phones"] = app.config["maxItemNumbersBST"];
                }
                if (app.config["genieListBST"]) {
                    app.config["genieList"] = app.config["genieListBST"];
                }
            }
            if (appName == 'spp') {
                if (app.config["maxItemNumbersSPP"]) {
                    app.config["max-number-of-phones"] = app.config["maxItemNumbersSPP"];
                }
                if (app.config["genieListSPP"]) {
                    app.config["genieList"] = app.config["genieListSPP"];
                }
            }
            if (appName == 'asw') {
                if (app.config["maxItemNumbersASW"]) {
                    app.config["max-number-of-phones"] = app.config["maxItemNumbersASW"];
                }
                if (app.config["genieListASW"]) {
                    app.config["genieList"] = app.config["genieListASW"];
                }
            }
        });
    }
    this.loadGlobalConfig();
    this.exeInShop = function() {
        $("#cart-count").show();
    };
    this.getSearchResults = function(event) {
        if (!event.keyCode || (event.keyCode && event.keyCode == 13)) {
            if ($('#searchInput').val()) {
                location.hash = '#!/search/' + $('#searchInput').val();
                $('#searchInput').val('');
            }


        }
    };
    this.enableSearch = function() {
        $('#searchBar').css('display', 'block');
    };
    this.alertMsg = {
        title: "",
        description: "",
        link: "",
        url: "",
        show: function(msg) {
            if (!angular.isObject(msg)) {
                msg = { description: msg };
            }
            this.title = msg.title;
            this.description = msg.description;
            if (!msg.links) {
                msg.links = [{ title: "Close", url: location.href }];
            }
            this.links = msg.links;
            $(function() {
                $("#alertMsg").modal();
            });
            appUtil.ui.refreshContent(true);
        }

    }
    this.ib = {
        clear: function() {
            console.log("==>removing IB token from storage");
            appUtil.data.removeFromLocal("ibToken");
        },
        init: function() { 
            if (ibToken || ('#!/shop/phones/' == location.hash)) {
                appUtil.data.storeToLocal("ibToken", ibToken);
                console.log("==>app: found IB token " + ibToken);
            } else {
                ibToken = appUtil.data.retrieveFromLocal("ibToken");
                if (ibToken) {
                    console.log("==>app: retrieved IB token from storage " + ibToken);
                } else {
                    console.log("==>app: no IB token");
                }
            }
        }
    }
    this.ib.init();
    this.zipCodeHandler = {
        storeName: "selectedZipCode",
        value: appUtil.data.retrieveFromLocal("selectedZipCode"),
        update: function(v) {
            if (v) {
                this.value = v;
            }
            appUtil.data.storeToLocal(this.storeName, this.value);
            if (this.extendFun) {
                this.extendFun(this.value);
                this.extendFun = null;
            }
        },
        popDialog: function(fun) {
            this.extendFun = fun;
            $("#zipcodeDialog").modal();
            setTimeout("$('#zipcodeDialog').find('input')[0].focus()", 1000);
        }
    }
    this.commonDialog = {
        title: "",
        content: "",
        externalLink: "",
        show: function(dialog) {
            if (dialog.externalLink) {
                $("#commonDialogFrame")[0].src = dialog.externalLink;
                this.showIframe = true;
            } else {
                var dialogClass = dialog.contentTag.replace('#', '');
                // alert(dialogClass);
                $('#commonDialog .modal-dialog').addClass(dialogClass);
                this.title = dialog.title;
                this.content = $(dialog.contentTag).html();
                this.showIframe = false;
            }

            appUtil.ui.refreshContent(true);
            $("#commonDialogOpenner").click();
        }
    };
    $scope.assignContext = function(hashKey) {
        if (hashKey[hashKey.length - 1] != "/") {
            hashKey += "/";
        }



        if (!pathMap.home._setContext(hashKey)) {
            appUtil.$scope.pageController.buildContext(location.hash.substring(3));

        }

    };
    this.isCurrentContext = function(hashKey) {
        if ($scope.pageController && $scope.pageController.inStaticPage) {
            return false;
        } else if (pathMap._pageNotFound) {
            return false;
        }
        if (hashKey) {
            var ps = $scope.pathMap._getCurPath();
            for (var i = ps.length - 1; i >= 0; i--) {
                if (ps[i]._hash) {
                    return ps[i]._match(hashKey);
                }
            }
        }
        return false;

    }

    this.setSearchQuery = function() {

        var q = location.hash.toLocaleString().split("/");
        if (q.indexOf("search") >= 0) {
            q = q[q.indexOf("search") + 1];
        } else {
            q = location.hash;
        }
        q = q.replace("%20", " ");
        q = q.replace(/[,\./\\$%&#!~`+$*\(\)\{\}\[\]-_<>?=-]/g, " ").trim();
        var w = $("#searchBox")[0];
        if (w.contentWindow.location.search != "?q=" + q || w.contentWindow.stoppedSearch) {
            if (this.lastQuery != q) {
                this.lastQuery = q;
                if (appName == 'vmu') {
                    var searchpage = 'searchVMU.html'; }
                if (appName == 'bst') {
                    var searchpage = 'search.html'; }
                w.src = searchpage + "?q=" + q;

            }
        }
    }

    $scope.assignContext = function(hashKey) {
        if (hashKey[hashKey.length - 1] != "/") {
            hashKey += "/";
        }
        if (!pathMap.home._setContext(hashKey)) {
            appUtil.$scope.pageController.buildContext(location.hash.substring(3));
        }

    }
    $scope.showMessage = function(msg, type) {
        if ($scope.dialogMsg != msg && $scope.dialogMsg)
            $scope.dialog.close();

        if (($scope.dialogMsg != msg && $scope.dialogMsg) || !$scope.dialogMsg) {
            $scope.dialog = ngDialog.open({
                template: '<p class="' + type + '">' + msg + '</p>',
                plain: true,
                closeByDocument: false,
                closeByEscape: true,
                overlay: false,
                showClose: false,
                type: type
            });
            $scope.dialogMsg = msg;
            setTimeout(function() {
                $scope.dialog.close();
                $scope.dialogMsg = undefined;
            }, type == 'error' ? 5000 : type == 'warning' ? 3000 : 2000);
        }
    }
    $scope.autoRefreshFns = [];
    $scope.pushAutoRefresh = function(fn) {
        this.autoRefreshFns.push(fn);
    }
    $scope.autoRefresh = function() {
        for (var i = 0; i < this.autoRefreshFns.length; i++) {
            eval(this.autoRefreshFns[i]);
        }
        if (!this.stopAutoRefreshContent) {
            appUtil.ui.refreshContent(true);
        }
    }

    $scope.handleUIIssue = function() {
        appUtil.ui.buildToolTip();
        appUtil.ui.buildPopover();

        if (app.isCurrentContext(pathMap._phones._formatedHash) || app.isCurrentContext(pathMap._phoneDetails._formatedHash)) {
            var classList = $('.ieBackgroundColor');
            $.each(classList, function(index, item) {
                item = $(item);
                var cs = item.attr('class').split(/\s+/);
                for (var i = 0; i < cs.length; i++) {
                    if (cs[i].indexOf("background_") == 0) {
                        item.css({ backgroundColor: cs[i].replace("background_", "#") })
                        break;
                    }
                }
            });

        }
    }

}]);

//Listen link (hash) update
$(function(){
  $(window).on( "hashchange",function(){
    if('#!/bestbuy/' == location.hash){
      location.hash = '#!/';
      // pathMap._pageNotFound=true;
    }
    appUtil.$scope.stopAutoRefreshContent=false;
    appUtil.ui.endIdleReminder("#checkout_help_reminder");
    pathMap._triggerApp();
    pathMap._lastHash=location.hash;
    setTimeout("appUtil.$scope.handleUIIssue();",1000);
    /* remove this because it messes up new tab with an inline anchor target
    setTimeout(function(){
      window.scrollTo(0, 0);
    },1500);
    */
  });
  $(window).focus(function() {
    $("#triggerAutoRefreshTag").click();
  });
});
$(document).ready(function() {
    pathMap._lastHash = "";
    if (location.hash) {
        if ('#!/bestbuy/' == location.hash) {
            location.hash = '#!/';
            // pathMap._pageNotFound=true;
        }
        setTimeout("pathMap._triggerApp();", 100);
    } else {
        location.hash = rootHash;
    }
    /* remove this because it messes up new tab with an inline anchor target
      setTimeout(function(){
        window.scrollTo(0, 0);
      },3500);
    */
    //add search box callback function for store locations
    $('#locations input#search').on('input', function() {
        alert(88);
    });

    //Set home banner carousel autoplay
    // setInterval(function(){
    //                         $('#carousel-banner-top .right.carousel-control').trigger('click');
    //                         $('#carousel-banner-top-mobile .right.carousel-control').trigger('click');
    //                       }, 5000);

})

function setAppMenu() {
    if ($(".cart").length < 1) {
        setTimeout(setAppMenu, 1);
        return;
    }
    $('.carousel').carousel({
        pause: true,
        interval: false
    })
    $(function() {
        if (appName != 'bst') {
            $(".dropdown").hover(
                function() {
                    $('.dropdown-menu', this).stop(true, true).fadeIn("fast");
                    $(this).toggleClass('open');
                },
                function() {
                    $('.dropdown-menu', this).stop(true, true).fadeOut("fast");
                    $(this).toggleClass('open');
                });
        }
    });
}
setAppMenu();
$(document).on("click", ".coverageMapLink", function() {
    $("#coverageMapLink").click();
});
$(window).on("resize", function() {
    windowResizeObjMap.triggerByResize();
    windowResizeSearchBox.triggerByResize();
});
$(window).on('load', function() {
    windowResizeSearchBox.triggerByResize();
});


var windowResizeObjMap = {
    triggerByResize: function() {
        for (var k in windowResizeObjMap) {
            if (k != "triggerByResize") {
                windowResizeObjMap[k]();
            }
        }
    },
    mapImgFun: function() {
        var vs = $(".mapImg");
        for (var i = 0; i < vs.length; i++) {
            var v = vs[i];
            var init = !v._initialWidth;
            if (init) {
                $(v).css({ "width": "initial", "max-width": "initial" });
                v._initialWidth = $(v).width();
                $(v).css({ "width": "100%", "max-width": "100%" });
            }
            var r = $(v).width() / v._initialWidth;

            var os = $($(".mapImg").attr("usemap") + " area");
            if (init) {
                v._initialCoords = [];
            }
            for (var n = 0; n < os.length; n++) {
                var o = os[n];
                if (init) {
                    v._initialCoords.push(o.coords);
                }
                var coords = v._initialCoords[n].split(",");
                for (var m = 0; m < coords.length; m++) {
                    coords[m] *= r;
                }
                o.coords = coords.toString().replace(/\[\]/g, "");
            }
        }
    }

}
var windowResizeSearchBox = {
        triggerByResize: function() {
            $('#searchBox').each(function(index) {
                // alert('here');
                var widthHtml = $('html').css('width').slice(0, -2);
                if (widthHtml < 971) {
                    $(this).contents().find('html .col_right').hide();
                } else {
                    $(this).contents().find('html .col_right').show();
                }
                var heightIframeHtml = $(this).contents().find('html').css('height').slice(0, -2);
                var heightIframe = $(this).css('height').slice(0, -2);
                //console.log('iframe:'+heightIframe+', html:'+heightIframeHtml);
                if (heightIframe != heightIframeHtml) {
                    $(this).css('height', heightIframeHtml + 'px');
                }
            });
        }
    }
    //setTimeout("appUtil.$scope.handleUIIssue();",100);
