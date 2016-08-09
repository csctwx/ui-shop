(function() {
  var pageModule = angular.module('page-directives', []);
  pageModule.directive("page", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "templates/page/content.html?"+appUtil.appVersion
    };
  });
})();
appModule.controller('pageController', ['$http','$scope', function($http,$scope){
  var pageController=this;
  this.lastParameters=null;
  this.lastContent=null;
  this.inStaticPage=false;
  this.pageAnchor=null;

  this.searchLocations=function(){
    var storeKeyword = $('#locations input#search').val();
    $('#locations #store-loading').show('fast');
    $('#locations ul li a').each(function(){
    //   var oldHref=$(this).attr('href');
      
    //   var newHref = oldHref.replace(/\/stores[^0-9]*/gi,'#!/store/');
    //   console.log(newHref);
    //   $(this).attr('href',newHref);
      if($(this).text().indexOf(storeKeyword) == -1){
        $(this).parent().hide();
      }
      else{
        $(this).parent().show();
      }
    });
    $('#locations #store-loading').hide();
  }
  
  this.init=function(){
    this.inStaticPage=false;
    this.pagePath=null;
    $(".breadcrumb").show();
  }
  this.setPagePath=function(html){
    this.pagePath=html;
  }
  
  this.runContent=function(data){
    this.inStaticPage=true;
    this.lastContent=data;
    $("#pageContext").hide();
    $("#pageContext").html("");
    try{
      var ds=$(data);
      for(var i=0;i<ds.length;i++){
        var d=ds[i];
        var t=d.tagName;
        if(t){
          t=t.toLowerCase();
        }
        if(t=="title"){
          pathMap._page._metaTitle=d.innerHTML;
        }else if(t=="meta"){
          if($(d).attr("name") && $(d).attr("name").toLowerCase()=="keywords"){
            pathMap._page._metaKeywords=$(d).attr("content");
          }else if($(d).attr("name") && $(d).attr("name").toLowerCase()=="description"){
            pathMap._page._metaDescription=$(d).attr("content");
          }else if($(d).attr("name") && $(d).attr("name").toLowerCase()=="page-title"){
            pathMap._page._title=$(d).attr("content");
          } else if ($(d).attr("name") && $(d).attr("name").toLowerCase()=="hide-breadcrumb"){
            $(".breadcrumb").hide();
          }
        }else if(t=='link'){
          $("head").append(d.outerHTML);
        }
        else if(t){
          try{
            $("#pageContext").append(d.outerHTML);
            var v=$("#pageContext").find("#page-path").remove()
            if(v.length>0){
              this.pagePath=v[0];
            }
          }catch(e){
            appUtil.log(e.message);
          }
        }else{
          $("#pageContext").append(d);
        }
      }
      pathMap._page._setMetas();
    }catch(e){
    }
    $("#pageContext").show();
    if(pageController.pageAnchor){
      appUtil.ui.scrollTopToElement("#"+pageController.pageAnchor);
    }
    setTimeout(function(){
      $("#loading").hide();
    }, 1000); 
  }
  this.buildContext=function(parameters){
    this.inStaticPage=true;
    if(parameters.substring(parameters.length-1)=="/"){
      parameters=parameters.substring(0,parameters.length-1);
    }
    var p = parameters.split("#");
    if(this.lastParameters==p[0]){
      try{
        $scope.app.stopAutoRefreshContent=false;
        staticPageHandler.buildContent();
      }catch(e){
        this.runContent(this.lastContent);
      }
      return;
    }else{
      this.lastParameters==p[0];
    }
    if( p.length > 1 ){
      this.pageAnchor=p[1];
    } else {
      this.pageAnchor=null;
    }
    $http.get(appName+"/pages/"+p[0]+".html?1"+appUtil.appVersion).success(function(data){
      pageController.runContent(data);
    }).error(function(data){
      appUtil.ui.autoHideWaiting();
      pathMap._pageNotFound=true;
      pageController.inStaticPage=false;
    });
    appUtil.ui.refreshContent($scope);
  };
  this.setContext=function(key,parameter){
    if(!parameter){
      key=key.split("/");
      var i=1;
      while(!parameter){
        parameter=key[key.length-i];
        i++;
      }
    }
    if(parameter){
      parameter=parameter.replace("/","");
      pageController.buildContext(parameter);
    }
  };  
}]);