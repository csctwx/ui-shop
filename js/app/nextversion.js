(function() {
  var nextversionModule = angular.module('nextversion-directives', []);
  nextversionModule.directive("nextversion", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "templates/nextversion.html?"+appUtil.appVersion
    };
  });
})();

appModule.controller('nextversionController', ['$scope', function($scope){
  var nextversionController=this;
  this.setContext=function(key,parameter){
    appUtil.ui.refreshContent();
  };
}]);