<!DOCTYPE html>
<html ng-app="appSprint">
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
	<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
	<meta name="HandheldFriendly" content="True"/>
	<meta name="format-detection" content="telephone=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
	<meta name="description" content=""/>
	<meta name="keywords" content=""/>
	<meta name="author" content=""/>

	<title></title>
	<link rel="shortcut icon" href="img/favicon.png"/>
	<link rel="stylesheet" href="css/accordion-slider.css">  

  <link rel="stylesheet" href="css/ngDialog.min.css">
	<link rel="stylesheet" href="css/ngDialog-theme-default.css">  
	<link rel="stylesheet" href="css/loading.css">  
	<link rel="stylesheet" href="css/genie3.css">  
<%@include file="env_data.jsp" %>
  
  <script src="js/lib/sprintprepaid-bootstrap.min.js"></script>
  <script src="js/lib/jasny-bootstrap.min.js"></script>
	<script src="js/lib/angular.min.js"></script>
	<script src="js/lib/angular-messages.min.js"></script>
	<script src="js/lib/ngDialog.js"></script>
  <script src="js/lib/jquery.accordionSlider.min.js"></script>
  <script type="text/javascript" id="mpelid" src="//espanol.prepaid.sprint.com/mpel/mpel.js"></script>
  <script src="//maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <script src="//www.boostmobile.com/_themes/libs/js/gmap3.min.js"></script>

  
  <script type="text/javascript" src="js/common/util.js?version=<%=application.getAttribute("version")%>"></script>
  <script>
    if(location.host.indexOf("localhost")==0 || location.host.indexOf("144.229.209.141")==0){
      appUtil.appVersion=appUtil.data.generateId();
    }else{
      appUtil.appVersion=<%=application.getAttribute("version")%>;
    }
    appUtil.bDev=appConfig.dev;
    if(appConfig.channelVM!=null && appConfig.channelVM['connect']!= null && appConfig.channelVM['connect'] == true){
    	  appUtil.connectionVM=true;
  	  appUtil.vmVersion=appConfig.channelVM['version']
    	}else{
  		appUtil.connectionVM=false;
  	}
    var rootHash=appConfig.appMap[location.host].rootHash;
    if(!rootHash){
      rootHash="#!/";
    }
    $('<link href="'+appName+'/css/bootstrap.min.css" rel="stylesheet"/>').appendTo("head");
    $('<link href="'+appName+'/css/jasny-bootstrap.min.css" rel="stylesheet"/>').appendTo("head");
    $('<link href="'+appName+'/css/app-framework.css?version='+appUtil.appVersion+'" rel="stylesheet"/>').appendTo("head");
    if(appName=="bst" || appName=="vmu"){
      $('<link href="'+appName+'/css/store.css?version='+appUtil.appVersion+'" rel="stylesheet"/>').appendTo("head");
    }
    if(appName=="spp"){
      $('<link href="spp/css/additionalServices.css" rel="stylesheet"/>').appendTo("head");
    }
    appUtil.seoCanonicalEnabled=appConfig.seoCanonicalEnabled;
    if(appName=="bst"){
      appUtil.baseHref=location.protocol+linkMap.setting.bst.shop.host+"#!/";
    } else if( appName=="spp" ) {
      appUtil.baseHref=location.protocol+linkMap.setting.spp.shop.host+"#!/";
    } else if( appName=="vmu" ) {
      appUtil.baseHref=location.protocol+linkMap.setting.vmu.shop.host+"#!/";
    } else {
      appUtil.seoCanonicalEnabled=false;
      appUtil.baseHref="";
    }
    
  </script>
  <script>
    var MP = {
    <!-- mp_trans_disable_start --> 
      Version: '1.0.23',
      Domains: {'es':'espanol.prepaid.sprint.com'},	
      SrcLang: 'en',
    <!-- mp_trans_disable_end -->
      UrlLang: 'mp_js_current_lang',
      SrcUrl: decodeURIComponent('mp_js_orgin_url'),
    <!-- mp_trans_disable_start --> 	
      init: function(){
        if (MP.UrlLang.indexOf('p_js_')==1) {
          MP.SrcUrl=window.top.document.location.href;
          MP.UrlLang=MP.SrcLang;
      }
    },
    getCookie: function(name){
      var start=document.cookie.indexOf(name+'=');
      if(start < 0) return null;
      start=start+name.length+1;
      var end=document.cookie.indexOf(';', start);
      if(end < 0) end=document.cookie.length;
      while (document.cookie.charAt(start)==' '){ start++; }
      return decodeURIComponent(document.cookie.substring(start,end));
    },
    setCookie: function(name,value,path,domain){
      var cookie=name+'='+encodeURIComponent(value);
      if(path)cookie+='; path='+path;
      if(domain)cookie+='; domain='+domain;
      var now=new Date();
      now.setTime(now.getTime()+1000*60*60*24*365);
      cookie+='; expires='+now.toUTCString();
      document.cookie=cookie;
    },
    switchLanguage: function(lang){
      if(lang!=MP.SrcLang){
        var script=document.createElement('SCRIPT');
        script.src=location.protocol+'//'+MP.Domains[lang]+'/'+MP.SrcLang+lang+'/?1023749632;'+encodeURIComponent(MP.SrcUrl);
      document.body.appendChild(script);
      } else if(lang==MP.SrcLang && MP.UrlLang!=MP.SrcLang){
        var script=document.createElement('SCRIPT');
        script.src=location.protocol+'//'+MP.Domains[MP.UrlLang]+'/'+MP.SrcLang+MP.UrlLang+'/?1023749634;'+encodeURIComponent(location.href);
      document.body.appendChild(script);
      }
      return false;
    },
    switchToLang: function(url) {
      window.top.location.href=url; 
    }
    <!-- mp_trans_disable_end -->   
    };
  </script>
  <script>
    loadJs(appName+"/js/data/resource.js?version="+appUtil.appVersion);
  </script>
	<script src="js/app/analysisManager.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/common/data.js?version=<%=application.getAttribute("version")%>"></script>
	<script id="pathMapJs" src="js/app/pathMap.js?version=<%=application.getAttribute("version")%>"></script>
	<!--script id="pathMapJs" src="spp/js/app/pathMap.js?version=<%=application.getAttribute("version")%>"></script-->
  <script>
    if (appName == 'vmu') {
      loadJs("//display.ugc.bazaarvoice.com/static/VirginMobileUSA/en_US/bvapi.js");
    }
    else{
      loadJs(appName+"/js/lib/bvapi.js?version="+appUtil.appVersion);
    }    
    loadJs(appName+"/js/app/pathMap.js?version="+appUtil.appVersion);
  </script>
  <script src="js/app/account.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/app.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/phone.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/cart.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/checkout.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/banner.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/page.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/nextversion.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/store.js?version=<%=application.getAttribute("version")%>"></script>
  <script src="js/app/support.js?version=<%=application.getAttribute("version")%>"></script>
  <script type="text/javascript" src="//s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e3adf77133835ec" async="async"></script>
  <script>
    if(appName=="spp"){
      loadJs(appName+"/js/app/plan.js?version="+appUtil.appVersion);
      loadJs("spp/js/app/additionalservices.js?version="+appUtil.appVersion);
    }
      
  </script>
	<!--script id="pathMapJs" src="spp/js/app/additionalservices.js?version=<%=application.getAttribute("version")%>"></script-->
  <script>
    if(location.href.indexOf("ui-shop")>=0){
      loadJs("../ui-shared/linkHandler.js");
    }else{
      loadJs("/ui-shared/ui-shared/linkHandler.js");
    }
  </script>
  <script>
  if(!appConfig.paypalEnvironment){
    appConfig.paypalEnvironment='sandbox';
  }
  window.paypalCheckoutReady = function () {
  paypal.checkout.setup('6XF3MPZBZV6HU', {
  environment: appConfig.paypalEnvironment
  });
  };
  </script>
  <script async src="js/lib/paypal.js"></script>
	<link rel="stylesheet" href="css/share.css">  
	<link rel="stylesheet" href="promotion/promotion.css">  
  <script>
  	if(appName == 'bst'){
  		// <!-- adding google-site-verification IM3333005 / artf674358 -->
  		//<!-- adding Bing Webmaster Tools Verification Code -->
	    $('head').append('<meta name="google-site-verification" content="wRuoqqY5Q25iekb7axGGFEbdELWkanxbp_kK26EDB9g" />');
	    $('head').append('<meta name="msvalidate.01" content="F414A92D209B3A0FB3E83B79B51BE328" />');
	}
  </script>
</head>
<!--[if (IE)]>
  <link rel="stylesheet" href="css/ie_fix.css" type="text/css" />
<![endif]-->
<!--[if lte IE 8]>
  <link rel="stylesheet" href="css/non_support.css" type="text/css" />
<![endif]-->
<body ng-controller="appController as app" id="appController">
<a href="{{pathMap._home._hash}}"> </a>
<a id="triggerAutoRefreshTag" onclick='angular.element("#appController").scope().autoRefresh(location.hash);'></a>
    <app-head></app-head>
    <app-head-mini></app-head-mini>
    <div class="container main {{app.isCurrentContext(pathMap._phoneDetails._formatedHash) || app.isCurrentContext(pathMap._hotspotDetails._formatedHash) ? 'phonedetails' : ''}}">
      <app-navigator></app-navigator>
      <app-title></app-title>
      <banner></banner>
      <app-container></app-container>
      <store-container></store-container>
      <phone-container></phone-container>
      <support-container></support-container>
      <plan-container></plan-container>
      <as-container ng-if="appName=='spp'"></as-container>
      <checkout-container></checkout-container>
      <page></page>
      <nextversion></nextversion>
      <app-alert-msg></app-alert-msg>
      <app-common-dialog></app-common-dialog>
      <app-page-not-found></app-page-not-found>
    </div>
    <app-footer></app-footer>
<div id="loading">
  <div style="position:fixed;top:0;left:0;z-index:100;width:100%;height:100%;opacity:0.1;background-color:#000;">
    <div style="position:fixed;top:50%;left:50%;margin-top: -40px;margin-left: -40px;z-index:100;" class="loader">.</div>
    <div style="position:fixed;top:50%;left:50%;margin-top: -120px;margin-left: -240px;z-index:100;" class="loadingImg">
      <img src="img/loading.gif"/>
    </div>
  </div>
  <div class="support_browser" style="position:fixed;top:50%;left:50%;margin-top: 100px;margin-left: -20px;z-index:100;color:#FFF">Loading ...</div>
  <div class="non_support_browser" style="position:fixed;top:50%;left:50%;margin-top: 0px;margin-left: -200px;width:400px;z-index:100;color:#FFF">You're using a version of Internet Explorer we do not support. To view our website, please upgrade to the latest version of Internet Explorer through the <a href="https://www.microsoft.com/en-us/download/internet-explorer.aspx" target="_blank">Microsoft Download Center</a>.</div>
</div>
<iframe src="track.jsp" id="analysisTracker" style="width:0px;height:0px;display:none"></iframe>
</body>
</html>