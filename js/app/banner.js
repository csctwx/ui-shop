(function() {
  var bannerModule = angular.module('banner-directives', []);
  bannerModule.directive("banner", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "templates/banner/content.html?"+appUtil.appVersion
    };
  });
  bannerModule.directive("bannerItem", function() {
    return {
      restrict: 'E',
      replace:true,
      template:function(elem,attr){
        if(!attr.options){
          return;
        }
        var classKey=attr.url+"_"+attr.index;
        var objKey="\""+attr.url+"\"";
        var parameters="\""+attr.url+"\"";
        
        if(attr.extraheaders){
          objKey+="+JSON.stringify("+attr.extraheaders+")";
          parameters+=","+attr.extraheaders;
        }else{
          parameters+=",null";
        }
        
        var os=attr.options.toLowerCase().split(",");
        var htmlHeader="";
        var htmlFooter="";
        var cClass="";
        if(os.indexOf("bg_image")>=0){
          var cClass="class='"+attr.class+" "+classKey+(os.indexOf("hide_image_in_small")>=0?'_large_screen':'')+"'";
        }else{
          var cClass=attr.class?"class='"+attr.class+"'":"";        
        }
        var initFn="ng-init='bannerController.loadData("+parameters+")'";
        var obj="bannerController.dataMap["+objKey+"]["+attr.index+"]";

        if(os.indexOf("url")>=0){
          htmlHeader+="<a id='"+classKey+"' "+initFn+" "+cClass+" style='cursor:pointer' ng-href='{{"+obj+".url}}'>";
          htmlFooter="</a>"+htmlFooter;
        }else if(os.indexOf("no_url")>=0){
			// do nothing
		}else{
          htmlHeader+="<a "+initFn+" "+cClass+">";
          htmlFooter="</a>"+htmlFooter;
        }
        
        if(os.indexOf("phone_number")>=0){
          htmlHeader+="<span>{{"+obj+"}}</span>";
        }
        
        if(os.indexOf("image")>=0){
          htmlHeader+="<img alt='{{"+obj+".alt}}' ng-src='{{"+obj+".imageUrl}}'/>";
        }
        if(os.indexOf("icon")>=0){
          htmlHeader+="<img alt='{{"+obj+".alt}}' class='promoIcon' ng-src='{{"+obj+".imageUrl}}'/>";
        }
        if(os.indexOf("title")>=0){
          if(attr.class=="promo01"){
            htmlHeader+="<h1 class='promoHeading' ng-bind-html='"+obj+".title'></h1>";
          }else{
            htmlHeader+="<h3 class='promoHeading' ng-bind-html='"+obj+".title'></h1>";
          }
        }
        if(os.indexOf("description")>=0){
          htmlHeader+="<p class='promoText'>{{"+obj+".description}}</p>";
        }
        if(os.indexOf("link_text")>=0){
          htmlHeader+="<span class='promoLink'>{{"+obj+".linkText}}</span>";
        }
        if(os.indexOf("text")>=0){
          htmlHeader+="<h3 class='callNow' ng-show='"+obj+"'><span class='promoLink'>{{"+obj+"}}</span></h3>";
        }
        if(os.indexOf("text_inline")>=0 && os.indexOf("no_url")>=0){
            htmlHeader+="<span "+initFn+" ng-show='"+obj+"' class='promoLink'>{{"+obj+"}}</span>";
          }
  		if (os.indexOf("orderbyphone")>=0){
  			htmlHeader+="<section class='orderbyphone' "+initFn+" ng-show='"+obj+"'>" + 
  						"<h3>Order by phone</h3><h4>Need help picking a phone or plan?</h4>"+
  						"<h4>Call us now</h4><h2>{{"+obj+"}}</h2></section>";
  		}
  		if (os.indexOf("phone_grid")>=0){
			htmlHeader+="<section class='notice phones visible-xs visible-md visible-lg' "+initFn+" ng-show='"+obj+"'>" + 
				"<h3>Call our live experts to pick your phone &amp; plan  {{"+obj+"}}</h3></section>";
  		}
  		if (os.indexOf("cart")>=0){
  			htmlHeader+="<section "+initFn+" ng-show='"+obj+"'>" + 
  						"<h3>New Customers</h3>" +
  						"<p>Have questions? Finish your order on the phone. Call now.</p>" +
  						"<h2>{{"+obj+"}}</h2></section>";
  		}
  		if (os.indexOf("phone_details")>=0){
  			htmlHeader+="<section  class='notice phones visible-xs visible-md visible-lg' "+ initFn +" ng-show='"+obj+"'>" + 
  						"<h3>Call now to order this phone {{"+obj+"}} </h3></section>";
  		}
  		if (os.indexOf("home")>=0){
  			htmlHeader+="<h3 "+ initFn +" ng-show='"+obj+"'>New Customers! Call our live experts to pick your perfect phone &amp; plan <span>Call Now! {{"+obj+"}} </span></h3>";
  		}
  		
  		return htmlHeader+htmlFooter;
        
      }
    };
  });

  bannerModule.directive("bannerDirective", ['$http', '$timeout',function($http, $timeout) {

    var createBanner = function (id, scope, init){
      appUtil.getBanner($http, id).success(function (data){
        if (data.responses.response[0].overlayBannerResponse.description.$ == 'SUCCESS'){
          var field = "htmlString" + id.replace(/-/g, '');
          var htmlblock = data.responses.response[0].overlayBannerResponse.overlayBanner.htmlBlock.$;
          if (appUtil.inDev() && htmlblock.indexOf("/repository") >= 0) {
        	  htmlblock = htmlblock.replace(/\/repository\//g,'https://vm7-msdp.test.boostmobile.com/repository/');
	      }
          scope.bannerRes[field] = appUtil.ui.trustAsHtml(htmlblock);
          if (init)
            setTimeout("appUtil.mapImgFun();",5000);
        }
      });
    };

    return {
      restrict: 'E',
      replace: true,
      link: function (scope, ele, attr){
        scope.bannerRes = {};
        createBanner(attr.bannerId, scope, !!attr.initMap);
      },
      template: function (ele, attr){
        var id = attr.bannerId.replace(/-/g, '');

        return '<div ng-bind-html="bannerRes.htmlString'+id+'" ></div>';
      }
    };

  }]);

})();

appModule.controller('bannerController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var bannerController=this;
  bannerController.bindingIndex = '0';
  this.dataMap={};

  this.loadData=function(url,extraheaders){
    var key=url;
    if(extraheaders){
      key+=JSON.stringify(extraheaders);
    }
    if(this.dataMap[key]){
      this.initScript(this.dataMap[key],url);
      return;
    }else{
      this.dataMap[key]=[];
    }

    appUtil.net.getData($http,url,null,extraheaders).success(function(data){
      var ds=bannerController.scrubData(data.responses.response);
      bannerController.dataMap[key]=ds;
      for(var i=0;i<ds.length;i++){
        var d=ds[i];
        if(d && d.imageUrl){
          var k=url+"_"+i;
          appUtil.ui.createStyleClass("."+k,"{background-image:url("+d.imageUrl+")}");
          appUtil.ui.createStyleClass("@media (min-width:768px) {."+k+"_large_screen","{background-image:url("+d.imageUrl+")}}");
        }
        if(d && d.title){
          d.title=appUtil.ui.trustAsHtml(d.title);
        }
        if(d && d.url && d.url.indexOf("javascript:")==0){
          d.script=d.url.substring("javascript:".length);
          d.url="";
        }
      }
      bannerController.initScript(ds,url);
    }); 
  };
  
  this.initScript=function(ds,url){
    for(var i=0;i<ds.length;i++){
      var d=ds[i];
      if(d && d.script){
        var k=url+"_"+i;
        
        eval('$("#"+k)[0].onclick=function(){'+d.script+'};');
      }
    }
    appUtil.ui.refreshContent();
  };
  
  this.scrubData=function(data){
    var returnData=[];
    var ds=appUtil.data.toArray(data);
    for(var i=0;i<ds.length;i++){
      var d=ds[i];
      var item={};
      if(d.getBannerResponse && d.getBannerResponse.banner){
        item=appUtil.data.simplifyObject(d.getBannerResponse.banner);
        item.imageUrl=appUtil.data.formatImagePath(item.imageUrl);
      }else{
        item=d.$;
      }
      returnData.push(item);
    }
    return returnData;
  };
}]);