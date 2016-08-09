(function() {
var cartModule = angular.module('cart-directives', []);
  cartModule.directive("cartRoom", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: appName+"/templates/cart/room.html?"+appUtil.appVersion
    };
  });
})();

appModule.controller('cartController', ['$http','$scope', function($http,$scope){
  var cartController=this;
  this.IB=false;
  this.init=function(){
    if(ibToken){
      cartController.IB=true;      
    }
    var data = appUtil.data.retrieveFromLocal("cart");
    if(this.data){
      while(this.data.items.length>0){
        this.data.items.splice(0,1);
      }
    }else{
      this.data = {items:[],version:$scope.app.config.DATA_VERSION};
    }   
    if( data && data.version==$scope.app.config.DATA_VERSION) {
      for(var i=0;i<data.items.length;i++){
        this.data.items.push(data.items[i]);
      }
    }
    this.save();
  };
  this.addDeviceToCart=function(device){
    var item=null;
    if(device.ibPayment) {
      if(this.data.items.length>0) {
        $scope.showMessage("You cannot add an Easy Pay device to a non-empty cart.","warning");
        return;
      }
    } else {
      for(var i=0;i<this.data.items.length;i++){
        if(this.data.items[i].ibPayment) {
          $scope.showMessage("You cannot add another item to cart with Easy Pay device.","warning");
          return;
        }
      }
    }
    for(var i=0;i<this.data.items.length;i++){
      var d = this.data.items[i];
      //I don't know why browser auto set the hashkey attribute, and it cause some problem.
      delete d.$$hashKey;
      if(d.sku==device.sku){
        item=d;
        item.quantity=Number(item.quantity)+Number(device.quantity);
      }
    }
    var bOpen=false;
    if(item==null){
      item={
        deviceId:device.id,
        name:device.name,
        brand:device.brand,
        sku:device.sku,
        color:device.color,
        memory:device.memory,
        inventory:device.inventory,
        image:device.checkoutImage,
        modelPrice:device.price,
        accessoryInd:device.accessoryInd,
        orderLineId:1,
        quantity:device.quantity,
        purchaseLimit:device.purchaseLimit,
        checkoutText:device.checkoutText,
        condition:device.condition,
        myUrl:device.myUrl,
        ibPayment:device.ibPayment,
        subscriberId:device.subscriberId
      }
      if(item.ibPayment) {
        item["ibEligibilityInd"]=device.ibEligibilityInd;
        item["ibEmi"]=device.ibEmi;
        item["loanTerm"]=device.loanTerm;
        item["loanAmount"]=device.loanAmount;
        item["downPaymentAmount"]=device.downPaymentAmount;
        item["lastInstallmentDueDate"]=device.lastInstallmentDueDate;
        item["lastInstallmentAmount"]=device.lastInstallmentAmount;
      }
      this.data.items.push(item);
      bOpen=true;
    }
    if(this.save()){
      $scope.showMessage("Product added to your shopping cart.","info");
      appUtil.net.setUrlHash(pathMap._checkout._hash);
    }
  };
  this.getTotalQuantity=function(){
    var v=0;
    for(var i=0;i<this.data.items.length;i++){
      if(this.data.items[i].quantity){
        v+=Number(this.data.items[i].quantity);
      }
    }
    return v;
  };
  this.getSubTotal=function(){
    var v=0;
    for(var i=0;i<this.data.items.length;i++){
      if(this.data.items[i].quantity){
        v+=parseFloat(this.data.items[i].quantity)*parseFloat(this.data.items[i].modelPrice);
      }
    }
    return v;
  };
  this.removeItem=function(data){
    appUtil.data.removeItemFromArray(this.data.items,data);
    this.save();
  };
  this.setQuantity=function(item, n){
    item.quantity=n;
    this.save();
  };
  this.save=function(){
    var bok=true;
    var phoneQuantity=0;
    for(var i=0;i<this.data.items.length;i++){
      if(this.data.items[i].quantity && !this.data.items[i].accessoryInd){
        phoneQuantity+=Number(this.data.items[i].quantity);
      }
    }
    if( phoneQuantity > $scope.app.config["max-number-of-phones"] ) {
      $scope.showMessage("You can only purchase maximum of "+ $scope.app.config["max-number-of-phones"]+" devices at once.","warning");
      bok=false;
    }else{
      for(var i=0;i<this.data.items.length;i++){
        var item=this.data.items[i];
        if(item.quantity==0){
          item.quantity=1;
        }else if(!item.quantity){
          var os=$("#checkout_step_1").find("input[type='number']");
          var bReset=false;
          for(var n=0;n<os.length;n++){
            if(os[n].value=="0"){
              bReset=true;
              os[n].value=1;
              item.quantity=1;
            }else if(os[n].value==""){
              bReset=true;
              os[n].value=1;
              item.quantity=1;
            }
          }
          if(!bReset){
            return;
          }else{
            $scope.showMessage("The minimum quantity is 1.","warning");
          }
        }
        if(item.purchaseLimit && item.quantity>item.purchaseLimit){
          bok=false;
          $scope.showMessage("You can only purchase maximum of "+item.purchaseLimit+" "+item.brand+" "+item.name+" at once.","warning");
        }
      }
    }
    if(bok){
      if(!pathMap._checkout._adobeData.shop){//For Complete Checkout
        var storageData=appUtil.data.retrieveFromLocal("cart");
        if(!storageData){
          storageData={items:[]};
        }

        var action=null;
        var updateItem=null;
        for(var i=0;i<this.data.items.length;i++){
          var d1=this.data.items[i];
          var bFound=false;
          for(var n=0;n<storageData.items.length;n++){
            d2=storageData.items[n];
            if(d1.sku==d2.sku){
              bFound=true;
              if(d1.quantity>d2.quantity){
                action="add";
                updateItem=pathMap._checkout._generateAnalysisProductList([d1],d1.quantity-d2.quantity);
              }else if(d1.quantity<d2.quantity){
                action="remove";
                updateItem=pathMap._checkout._generateAnalysisProductList([d1],d2.quantity-d1.quantity);
              }
              break;
            }
          }
          if(!bFound){
            action="add";
          }
        }
        
        if(!action && this.data.items.length<storageData.items.length){
          action="remove";
          if(this.data.items.length>0){
            for(var i=0;i<storageData.items.length;i++){
              var d1=storageData.items[i];
              var bFound=false;
              for(var n=0;n<this.data.items.length;n++){
                var d2=this.data.items[n];
                if(d1.sku==d2.sku){
                  bFound=true;
                  break;
                }
              }
              if(!bFound){
                updateItem=pathMap._checkout._generateAnalysisProductList([d1]);
              }
            }
          }else{
            updateItem=pathMap._checkout._generateAnalysisProductList(storageData.items);
          }
        }
        if(action){
          var data={
            shop:{
              cart:{
                action:action,
                productList:updateItem?updateItem:pathMap._checkout._generateAnalysisProductList(this.data.items)
              }
            }
          };
          if(action=="add" && pathMap._formatedLocationHash!=pathMap._checkout._formatedHash){
            data.shop.cart.view="true";
            data.shop.cart.viewType="page";
            data.shop.cart.open=this.data.items.length==1 && this.data.items[0].quantity==1?"true":"false";
            
            data.page={interaction:pathMap._checkout._analysisInteractionData};
          }
          pathMap._checkout._generateAnalysisData(data);

          if(arguments.callee.caller!=this.clean && (pathMap._formatedLocationHash==pathMap._checkout._formatedHash || action=="remove")){
            if(data.shop.cart.viewType=="page"){
              analysisManager.sendData();
            }else{
              if(action=="add"){
                analysisManager.sendWidgetData("cartActionAdd");
              }else{
                analysisManager.sendWidgetData("cartActionRemove");
              }
            }
          }
        }
      }

      appUtil.data.storeToLocal("cart",this.data);
      $("#synCartCount").html(this.getTotalQuantity());    
    }else{
      this.init();
    }
    return bok;
  };
  this.clean=function(){
    while(this.data.items.length>0){
      this.data.items.splice(0,1);
    }
    this.save();
  };
  this.getPhoneTitle=function(item,variant){
    var title = item.brand + " " + item.name;
    if(variant.color){
      title+= " (" + variant.color;
      if(variant.memory){
        title+=", "+variant.memory;
      }
      title+=")";
    }else if(variant.memory){
      title+=" ("+variant.memory+")";
    }
    return title;
  };
  this.getQuantityOptions=function(item){
    var c=0;
    for(var i=0;i<this.data.items.length;i++){
      if(this.data.items[i].quantity && !this.data.items[i].accessoryInd){
        c+=this.data.items[i].quantity;
      }
    }
    c-=item.quantity;
    c=$scope.app.config["max-number-of-phones"]-c;
    if(!item.purchaseLimit){
      item.purchaseLimit=null;
    }
    var v= item.purchaseLimit==null?c:item.purchaseLimit<c?item.purchaseLimit:c;
    var vs=[];
    for(var i=1;i<=v;i++){
      vs.push(i);
    }
    return vs;
  };
  $scope.pushAutoRefresh("$scope.cartController.init()");
  this.init();
}]);
