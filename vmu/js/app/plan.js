(function() {
  var planModule = angular.module('plan-directives', []);

  var directiveSetting={
    moduleName:"plan",
    items:"$container,$main"
  };
  appUtil.ui.buildModuleDirective(planModule,directiveSetting);
})();
appModule.controller('planController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var planController=this;
  this.data={};
  this.setContext=function(key,parameter){
    if(key==pathMap._plans._formatedHash){
      appUtil.ui.refreshContent();
    }
  };
  this.loadFaqs=function(){
    appUtil.net.getLocalData($http,"spp/js/data/faqs.json").success(function(data){
      for(var i=0;i<data.length;i++){
        data[i].content=$sce.trustAsHtml(data[i].content);
      }
      planController.data.faqs=data;
    });
  };
  this.loadFaqs();

}]);

