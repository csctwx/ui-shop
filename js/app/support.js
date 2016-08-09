(function() {
  var supportModule = angular.module('support-directives', []);
  var directiveSetting={
    moduleName:"support",
    items:"container"
  };
  if(appName=='spp'){
    directiveSetting.items+=",$faqs_internationalrates";
  }
  appUtil.ui.buildModuleDirective(supportModule,directiveSetting);
})();
appModule.controller('supportController', ['$http', '$scope', function($http, $scope) {
  var supportController = this;
  this.rates = [];
  this.rates_left = [];
  this.rates_right = [];
  this.support = {
    faqs: {
      internationalrates: {        
        init: function() {
          this.loadData(); 
        },
        loadData: function(){
           $http.get('spp/js/data/international-rates.csv').then(function(response) {
            
            //transfer csv data to array
            var cols = 6;
            var myrates = appUtil.data.processCSVData(response.data, cols);

            var mynewrates = [];
            for (var i = 0; i < myrates.length - 1; i++) {
              var rate = {};
              rate.country = myrates[i].country;
              rate.mytype = 'LandLine';

              rate.price = myrates[i].asLowAsLL?
                            ('As low as ' + myrates[i].landLine + '*')
                           :myrates[i].landLine;
              var rate2 = {};
              rate2.country = myrates[i].country;
              rate2.mytype = 'Mobile';
              rate2.price = myrates[i].asLowAsMobile?
                            ('As low as '+ myrates[i].mobile + '*')
                            :myrates[i].mobile;

              mynewrates.push(rate);
              mynewrates.push(rate2);
            }
            supportController.rates = mynewrates;
            var middle = (mynewrates.length) / 2;
            supportController.rates_left = mynewrates.slice(0, middle);
            supportController.rates_right = mynewrates.slice(middle, mynewrates.length);
          });      
        }
      }
    }
  };
}]);
