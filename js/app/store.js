(function() {
  var storeModule = angular.module('store-directives', []);
  var directiveSetting={
    moduleName:"store",
    items:"container,main,main_phone,featured,normal,options"
  };
  appUtil.ui.buildModuleDirective(storeModule,directiveSetting);
})();
appModule.controller('storeController', ['$http','$scope','$sce', function($http,$scope,$sce){
  var storeController=this;
  $scope.storeController=this;
  this.paramHash="";
  this.params={};
  this.featuredList=[];
  this.curLocationInfo="";
  this.mapList=[];
  this.enterFlag=null;
  
  this.buildMapUrl=function(){
    var url=this.params.zipcode;
    if(url){
      for(var k in this.params){
        if(this.params[k] && k!="zipcode"){
          url+=","+k;
        }
      }
      appUtil.net.setUrlHash(pathMap._store._hash+url+"/1/");
    }
  }
  this.buildParams=function(p,pNum){
    this.lastHash=this.paramHash;
    this.paramHash=p;
    this.params={zipcode:"",phones:"",reboost:"", topup:"", b2g:"", pref:""};
    var ps=p.split(",");
    for(var i=0;i<ps.length;i++){
      if(this.params[ps[i]]==""){
        this.params[ps[i]]=1;
      }else{
        if(appUtil.data.validZip(ps[i])){
          this.params.zipcode=ps[i];
          appUtil.$scope.app.zipCodeHandler.update(this.params.zipcode);
        }
      }
    }
    if(this.params.zipcode){
      this.psUrl="";
      for(var k in this.params){
        if(this.params[k]){
          this.psUrl+= '&' + k + '=' + this.params[k];
        }
      }
      this.psUrl=this.psUrl.substring(1)+"&page="+parseInt((pNum-1)/5+1);
    }else{
      this.psUrl="";
      this.params.zipcode=appUtil.$scope.app.zipCodeHandler.value;
      storeController.curLocationInfo=null;
    }
  };
  
  this.isNeedRequest=function(filter,pNum){
    if(this.paramHash!=filter){
      return true;
    }
    var n=(pNum-1)*this.pageHandler.prePageCount;
    if(n>this.pageHandler.data.length){
      n=this.pageHandler.data.length-1;
    }
    return !this.pageHandler.data[n];
  }
  
  this.simplifyData=function(data){
    data=appUtil.data.simplifyObject(data.responses.response[0].storeLocatorSearchResult);
    if(data.resultsFoundInd){
      if(data.featuredStores){
        data.featuredStores=data.featuredStores.featuredStore;
      }
      if(data.stores){
        data.stores=data.stores.store;
      }
    }
    return data;
  }
  
  this.initStoreMapByHash=function(hash){
    var vs=hash.split("/");
    if(vs.length){
      var pNum=1;
      if(vs.length>1){
        pNum=parseInt(vs[1]);
      }
      if(!pNum || pNum<0){
        pNum=1;
      }
      if(storeController.enterFlag!="map" || this.isNeedRequest(vs[0],pNum)){
        storeController.enterFlag="map";
        this.buildParams(vs[0],pNum);
        if(this.psUrl){
          appUtil.net.getData(appUtil.$http,"shop_get_store_locations","?showCaseInd=false&"+this.psUrl+"&brandId="+appName).success(function(data){
            data=storeController.simplifyData(data);
            if(data.resultsFoundInd){
              var start=parseInt((pNum-1)/5)*5*storeController.pageHandler.prePageCount;
              
              if(storeController.paramHash!=storeController.lastHash){
                storeController.pageHandler.data=[];
                storeController.pageHandler.pages=[];
                storeController.mapList=[];
                storeController.featuredList=[];
                
                storeController.curLocationInfo=data.city+", "+data.state+" "+data.zipCode;
                for(var i=0;i<data.resultsFoundNum;i++){
                  storeController.pageHandler.data.push(null);
                }
                for(var i=0;data.featuredStores && i<data.featuredStores.length && i<3;i++){
                  var d=data.featuredStores[i];
                  storeController.featuredList.push(d);
                }
              }

              for(var i=0;data.stores && i<data.stores.length;i++){
                var d=data.stores[i];
                var idx=start+i;
                
               // d.name+=" "+idx; //for demo only, remove alter (lws)
                storeController.pageHandler.data[idx]=d;

                if(idx<50){
                  d={
                    "lat": d.lat,
                    "lng": d.lng,
                    "options": {
                      "icon": d.preferedInd?"img/store/icon-boost.png":"img/store/icon-boost-blue.png"
                    },
                    "data": "<div class='st-tooltip'><h3 class='st-tooltip-name'>"+d.name+"</h3><div class='st-tooltip-street'>"+d.addressLine+"</div><div class='st-tooltip-address'>"+d.city+" "+d.state+" "+d.zipcode+"</div><a href='http://maps.google.com/maps?q="+d.addressLine+" "+d.city+" "+d.state+", "+d.zipcode+"' class='tooltip-directions' target='_blank'>Click here for directions</a</div>"
                  }
                  storeController.mapList.push(d);
                }
              }

              if(storeController.paramHash!=storeController.lastHash){
                $('#map').slideDown(function(){
                  storeController.loadMap(storeController.mapList);
                });
              }
              storeController.pageHandler.gotoPage(pNum);
              pathMap._store._sendAnalysisData(storeController.params.zipcode,"");
            }else{
              pathMap._store._sendAnalysisData(storeController.params.zipcode,data.errorResponse.errorMessage);
              appUtil.ui.alert(data.errorResponse.errorMessage);
            }
          });
        }else{
          pathMap._store._sendAnalysisData();
        }
      }else if(pNum!=this.pageHandler.curPage.number){
        this.pageHandler.gotoPage(pNum);
      }
    }
  };

  this.popPhoneStores=function(){
    $scope.app.zipCodeHandler.popDialog(this.initStoreMapByPhone);
  }
  
  this.initStoreMapByPhone=function(zip,pNum){
    if(!pNum){
      storeController.paramHash="";
      pNum=1;
    }
    if(storeController.enterFlag!="phone" || storeController.isNeedRequest(zip,pNum)){
      storeController.enterFlag="phone";
      appUtil.net.getData(appUtil.$http,"shop_get_store_locations","?showCaseInd=true&zipcode="+zip+"&brandId="+appName).success(function(data){
        data=storeController.simplifyData(data);
        if(data.resultsFoundInd){
          var start=parseInt((pNum-1)/5)*5*storeController.pageHandler.prePageCount;
          
          storeController.pageHandler.data=[];
          storeController.pageHandler.pages=[];
          
          storeController.curLocationInfo=data.city+", "+data.state+" "+data.zip;
          data.resultsFoundNum=data.featuredStores.length;
          for(var i=0;i<data.resultsFoundNum;i++){
            storeController.pageHandler.data.push(null);
          }

          for(var i=0;data.featuredStores && i<data.featuredStores.length;i++){
            var d=data.featuredStores[i];
            var idx=start+i;
            
           // d.name+=" "+idx; //for demo only, remove alter (lws)
            storeController.pageHandler.data[idx]=d;
          }

          storeController.pageHandler.gotoPage(pNum);
//          $("#phoneStoreDialog").modal({keyboard:true, backdrop: "true"});
          setTimeout('$("#phoneStoreDialog").modal({keyboard:true, backdrop: true});$("#phoneStoreDialog button").focus();',500)
          pathMap._store._sendAnalysisData(zip, "");
        }else{
          pathMap._store._sendAnalysisData(zip, data.errorResponse.errorMessage);
          appUtil.ui.alert(data.errorResponse.errorMessage);
        }
      });
    }else if(pNum!=this.pageHandler.curPage.number){
      this.pageHandler.gotoPage(pNum);
    }
  }
  
  this.pageHandler={
    prePageCount:10,
    curPage:{},
    data:[],
    paramHash:"",
    buildPages:function(){
      
    },
    gotoPage:function(pNum){
      var last=pNum*this.prePageCount;
      if(last>this.data.length){
        last=this.data.length;
        pNum=parseInt(this.data.length/this.prePageCount)+1;
      }
      var first=(pNum-1)*this.prePageCount;
      if(first<0){
        first=0;
      }
      this.curPage.data=[];
      for(var i=first;i<last;i++){
        this.curPage.data.push(this.data[i]);
      }
      this.curPage.number=pNum;
      this.curPage.firstRecordIdx=first+1;
      this.curPage.lastRecordIdx=last;
      this.lastPageNumber=parseInt((this.data.length-1)/this.prePageCount)+1;
      this.curStartPageNumber=parseInt((pNum-1)/this.prePageCount)*this.prePageCount+1;
      this.curEndPageNumber=this.curStartPageNumber+10;
      if(this.curEndPageNumber>this.lastPageNumber){
        this.curEndPageNumber=this.lastPageNumber;
      }
      

     this.pages=[];   
     var num= this.lastPageNumber-pNum;
     var a =11-num;
     var count = 0;
     
     if(a>5)
    {
    	   count= (pNum-a)+1;
    }
     else
    {
    	  count = pNum-5;
    }
    	 
    	 
      if(pNum>=11){
    	  for(var i=count;i<pNum+5;i++){
    		  if(i<=this.curEndPageNumber){
    			  this.pages.push(i);  
    		  }else{
    			  break;
    		  }
    	   }
      }else{
    	  
    	  for(var i=this.curStartPageNumber;i<=this.curEndPageNumber;i++){
    	        this.pages.push(i);
    	      }
      
      }
      
      
      
      
      
      
      
      
    }
    
  }
  
  this.loadMap=function(data) {
    //Create the map entity
    $("#map").gmap3({
      map: {},
      //clear previous map markers -- artf686056
      clear: {
          name:["marker"]
        },
      //Create map markets for each entry in the data objt
      marker: {
        values: data,
        options: {
          draggable: false
        },
        events: {
          //On clickevent, show a tooltip
          click: function(marker, event, context) {
            var map = $(this).gmap3("get");
            var infowindow = $(this).gmap3({get: {name: "infowindow"}});
            if (infowindow) {
              infowindow.open(map, marker);
              infowindow.setContent(context.data);
            } else {
              $(this).gmap3({
                infowindow: {
                  anchor: marker,
                  options: {content: context.data}
                }
              });
            }
          },
          //Close tooltip on mouseout        
          mouseout: function() {
            var infowindow = $(this).gmap3({get: {name: "infowindow"}});
            if (infowindow) {
              //infowindow.close();
            }
          }
        }
      }
    }, "autofit"); //Center and size map to contain map points
  };
  
  this.setContext=function(key,parameter){
    if(key==pathMap._store._formatedHash){
      this.initStoreMapByHash(parameter);
    }
    appUtil.ui.refreshContent(true);
  }
}]);