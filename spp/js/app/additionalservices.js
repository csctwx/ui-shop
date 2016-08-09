(function() {
  var asModule = angular.module('as-directives', []);

  var directiveSetting={
    moduleName:"as",
    items:"$container,$main,$callwatch,$datapacks,$premiumcallerid,$internationalrates,$mobilehotspot,$phoneinsurance"
  };
  appUtil.ui.buildModuleDirective(asModule,directiveSetting);
})();
appModule.controller('asController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var asController=this;
  appUtil.$scope.asController=this;
  this.data={};
  
  this.setContext=function(key,parameter){
    if(key==pathMap._additionalServices._formatedHash){
      appUtil.ui.refreshContent();
    }
  };
  this.loadData=function(){
    appUtil.net.getLocalData($http,"spp/js/data/additionalServices.json").success(function(data){
      for(var i=0;i<data.additionalServices.length;i++){
        data.additionalServices[i].idx=i;
      }
      asController.data={
        items:data.additionalServices,
        legal:$sce.trustAsHtml(data.legal)
      };
    });
  };
  this.loadData();

  this.additionalServicesColCount=3;
  this.getTailClassName=function($index){
    var len = this.data.items.length;
    var tailCount=len%this.additionalServicesColCount;
    if(tailCount==0 || len-$index-tailCount>0){
      return "";
    }else{
      return "tail_in_"+tailCount;
    }
  };
  this.getTileParentClass=function($index){
    var idx=$index;
    if(pathMap._additionalServices._curTabIdx==idx){
      return "show_panel";
    }else if(pathMap._additionalServices._curTabIdx>=0 && parseInt(idx/this.additionalServicesColCount)==parseInt(pathMap._additionalServices._curTabIdx/this.additionalServicesColCount)){
      return "show_small";
    }else{
      return "show_tile";
    }
    return v;
  };
}]);

