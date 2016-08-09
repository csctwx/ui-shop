var pathMap={
  _curNav:"",
  home:{
    _title:"Home",
    _controller:"app",
    _setMetas:function(para){
      appUtil.ui.setMetaInfo("title",this._metaTitle);
      appUtil.ui.setMetaInfo("description",this._metaDescription);
      appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
      appUtil.ui.setCanonical("");
    },
    coveragemap:{
      _title:"Coverage Map",
      _controller:"app",
      _shortcut:"coverageMap",
      _finalArrange:function(){
        if($("#coverageMapFrame").length==0){
          setTimeout("pathMap._coverageMap._finalArrange()",100);
        }else if(window.screen.width>800){
          if(appName=="bst"){
            if(appUtil.$scope.app.zipCodeHandler.value){
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=BO543STC&mapzip="+appUtil.$scope.app.zipCodeHandler.value;
            }else{
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=BO543STC&language=en";
            }
          } else if (appName=="vmu") {
    	    if(appUtil.$scope.app.zipCodeHandler.value){
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=VMU4MMLE&chkSpark=N&chkLTE=N&chk4G=N&chkData=N&chkNatNet=Y&mapzip="+appUtil.$scope.app.zipCodeHandler.value;
            }else{
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=VMU4MMLE&chkSpark=N&chkLTE=N&chk4G=N&chkData=N&chkNatNet=Y&language=en";
            }
          } else{
            if(appUtil.$scope.app.zipCodeHandler.value){
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=SPREPAID&mapzip="+appUtil.$scope.app.zipCodeHandler.value;
            }else{
              $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=SPREPAID";
            }
          }
          $("#coverageMapFrame")[0].height=520;
        }else{
          //$("#coverageMapFrame")[0].src="coverage/map.html?id=BO543STC&mapzip="+appUtil.$scope.app.zipCodeHandler.value;
          //$("#coverageMapFrame")[0].height=880;
          $("#coverageMapFrame")[0].src="//coverage.sprint.com/mycoverage.jsp?id=BO543STC&mapzip="+appUtil.$scope.app.zipCodeHandler.value;
          $("#coverageMapFrame")[0].height=520;
          
        }
        appUtil.ui.refreshContent();
      },
      _setMetas:function(para){
        appUtil.ui.setMetaInfo("title",this._metaTitle);
        appUtil.ui.setMetaInfo("description",this._metaDescription);
        appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
        appUtil.ui.setCanonical("coveragemap/");
      },
    },
    store:{
      _title:"Store Locator",
      _controller:"storeController",
      _shortcut:"store",
      _match:function(hash){
        return hash.indexOf(this._formatedHash)==0;
      },
      _setMetas:function(para){
        appUtil.ui.setMetaInfo("title",this._metaTitle);
        appUtil.ui.setMetaInfo("description",this._metaDescription);
        appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
        appUtil.ui.setCanonical("store/");
      },
      _sendAnalysisData:function(zip,message){
        if(!zip){
          this._adobeData.page.name = 'Find A Store Location Entry';
        }else{
          this._adobeData.page.name = 'Find A Store Location Results';
          this._adobeData.location={zip:zip};
          this._adobeData.messages={message:message};
        }
        
        pathMap._insertCommonAdobeData(this._adobeData);
        analysisManager.sendData("_store");
      }
    },
    search:{
      _title:"Search",
      _controller:"app",
      _match:function(hash){
        return hash.indexOf(this._formatedHash)==0;
      }
    },
    shop:{
      _title:"Shop",
      _controller:"app",
      _setMetas:function(para){
        appUtil.ui.setMetaInfo("title",this._metaTitle);
        appUtil.ui.setMetaInfo("description",this._metaDescription);
        appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
        appUtil.ui.setCanonical("shop/");
      },
      phones:{
        _title:"Shop Phones",
        _controller:"phoneController",
        _match:function(hash){
          if(hash==this._formatedHash){
            return true;
          }else if(hash.indexOf(this._formatedHash)!=0){
            return false;
          }
          var v = hash.replace(this._formatedHash,"").split("/")[0];
          return v!="details" && v!="compare" && v!="accessories" && v!="deals";
        },
        _setMetas:function(para){
          appUtil.ui.setMetaInfo("title",this._metaTitle);
          appUtil.ui.setMetaInfo("description",this._metaDescription);
          appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
          appUtil.ui.setCanonical("shop/phones/");
        },
        _generateExtendTitle:function(ps){
          this._extendTitle= "";
        },
        details:{
          _controller:"phoneController",
          _shortcut:"phoneDetails",
          _generateExtendTitle:function(){
            
          },
          _sendAnalysisData:function(item,tab){
            this._adobeData.page.name = 'Phone Details - '+tab;
            this._adobeData.page.subSubSection=item.brand;
            this._adobeData.shop.prodView=item.selectedVariant.sku;
            this._adobeData.shop.prodName=item.name;
            this._adobeData.shop.prodBrand=item.brand;
            this._adobeData.shop.prodRetailPrice=item.selectedVariant.price;
            if(item.selectedVariant.msrp) {
              this._adobeData.shop.prodRetailPrice=item.selectedVariant.msrp;
            } else {
              this._adobeData.shop.prodRetailPrice=item.selectedVariant.price;
            }
            this._adobeData.shop.prodPromoDiscount=item.selectedVariant.discount;
            this._adobeData.shop.prodCartPrice=item.selectedVariant.price;
            this._adobeData.shop.prodAvailability=item.selectedVariant.inventory;
            
            pathMap._insertCommonAdobeData(this._adobeData);
            analysisManager.sendData();
          },
          _match:function(hash){
            return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
          },
          _setMetas:function(para){
            var d = appUtil.$scope.phoneController.details.data;
            var m=d.name+" "+d.selectedColor +" "+d.selectedMemory;
            appUtil.ui.setMetaInfo("title",m+" | "+appDisplayName);
            appUtil.ui.setMetaInfo("description",m);
            appUtil.ui.setCanonical("shop/phones/"+d.id+"/features/");
          }
        },
        compare:{
          _title:"Compare",
          _generateAnalysisData:function(items){
            var vs=""
            for(var i=0;i<items.length;i++){
              vs+=","+items[i].name;
            }
            if(vs){
              vs=vs.substring(1);
            }
            this._adobeData.shop.comparisons=vs;
          },
          _controller:"phoneController",
          _shortcut:"phoneCompare",
          _setMetas:function(para){
            appUtil.ui.setMetaInfo("title",this._metaTitle);
            appUtil.ui.setMetaInfo("description",this._metaDescription);
            appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
            appUtil.ui.setCanonical("shop/phones/compare/");
          },
        }
      },
      deals:{
        _title:"Deals",
        _controller:"phoneController",
        _shortcut:"phoneDeals",
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        },
        _match:function(hash){
          if(hash==this._formatedHash){
            return true;
          }
          return false;
        },
        _setMetas:function(para){
          appUtil.ui.setMetaInfo("title",this._metaTitle);
          appUtil.ui.setMetaInfo("description",this._metaDescription);
          appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
          appUtil.ui.setCanonical("shop/deals/");
        }
      },
      hotspots:{
        _title:appName=='vmu'?"Broadband2Go Devices": 'Wi-Fi Hotspots',
        _controller:"phoneController",
        _shortcut:"hotspots",
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        },
        _match:function(hash){
          if(hash==this._formatedHash){
            return true;
          }
          return false;
        },
        _setMetas:function(para){
          appUtil.ui.setMetaInfo("title",this._metaTitle);
          appUtil.ui.setMetaInfo("description",this._metaDescription);
          appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
          appUtil.ui.setCanonical("shop/hotspots/");
        },
        details:{
          _title:"",
          _controller:"phoneController",
          _shortcut:"hotspotDetails",
          _generateExtendTitle:function(){
            
          },
          _match:function(hash){
            return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
          },
          _setMetas:function(para){
            var d = appUtil.$scope.phoneController.hotspots.device;
            if(!para){
              para="";
            }else{
              appUtil.ui.setCanonical(para);
              para=para.replace("/"," ");
            }
            if(d.meta) {
              if( d.meta.title ) {
                appUtil.ui.setMetaInfo("title",d.meta.title+" - "+para); }
              if( d.meta.description ) {
                appUtil.ui.setMetaInfo("description",d.meta.description+ " for "+para); }
              if( d.meta.keywords ) {
                appUtil.ui.setMetaInfo("description",d.meta.keywords); }
            }
          }
        }
      },
      checkout:{
        _title:"Checkout",
        _controller:"checkoutController",
        _match:function(hash){
          return !pathMap._pageNotFound && hash.indexOf(this._formatedHash)==0;
        },
        _analysisInteractionData:{
          pageEvent : 'transactionStart',
          transactionName : 'checkout'
        },
        _generateAnalysisProductList:function(list,quantity){
          var vs=[];
          for(var i=0;i<list.length;i++){
            var discount=list[i].discountTotal;
            if(!discount){
              discount="0.00";
            }else{
              discount=appUtil.ui.formatCurrency(discount)
            }
            vs.push("Phone;"+list[i].sku+";"+(quantity?quantity:list[i].quantity)+";"+list[i].modelPrice+";"+discount);
          }
          return vs;
        },
        _generateAnalysisData:function(data){
          appUtil.data.attachData(data,this._adobeData);
          pathMap._insertCommonAdobeData(this._adobeData);
        },
        _resetAnalysisData:function(){
          this._adobeData={
            page : {
              channel : 'eStore',
              subSection : 'Checkout', 
              name : 'Shipping and Billing',
            }
          }
          return this._adobeData;
        }
      },
      accessories:{
        _title:"Accessories",
        _controller:"phoneController",
        _shortcut:"phoneAccessories",
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        },
        _match:function(hash){
          if(hash==this._formatedHash){
            return true;
          }
          return false;
        },
        _setMetas:function(para){
          appUtil.ui.setMetaInfo("title",this._metaTitle);
          appUtil.ui.setMetaInfo("description",this._metaDescription);
          appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
          appUtil.ui.setCanonical("shop/accessories/");
        },
        accessoriesList:{
          _controller:"phoneController",
          _shortCut:"accessoriesList",
          _generateAnalysisData:function(items){
            var vs=""
            for(var i=0;i<items.length;i++){
              vs+=","+items[i].name;
            }
            if(vs){
              vs=vs.substring(1);
            }
            this._adobeData.shop.comparisons=vs;
          },
          _generateExtendTitle:function(items){
            this._title= "Shop Accessories for " +items[0].toUpperCase().replace(/-/g," ");
          },
          _match:function(hash){
            if(hash.indexOf(this._formatedHash)==0){
              return true;
            }
            return false;
          }
        },
      },
      market:{
        _title:"Boost Market",
        _controller:"app",
        _shortcut:"market",
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        }
      },
      orderStatus:{
        _title:"Order Status",
        _controller:"checkoutController",
        _shortcut:"orderStatus",
        _generateAnalysisData:function(items){
          var vs=""
          for(var i=0;i<items.length;i++){
            vs+=","+items[i].name;
          }
          if(vs){
            vs=vs.substring(1);
          }
          this._adobeData.shop.comparisons=vs;
        },
        _setMetas:function(para){
          appUtil.ui.setMetaInfo("title",this._metaTitle);
          appUtil.ui.setMetaInfo("description",this._metaDescription);
          appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
          appUtil.ui.setCanonical("shop/orderStatus/");
        },
      }
    },
    page:{
      _title:"",
      _controller:"pageController",
      _match:function(hash){
        return appUtil.$scope.pageController && appUtil.$scope.pageController.inStaticPage || hash.indexOf(this._formatedHash)==0;
      },
      _generateExtendTitle:function(ps){
        //this._title= appUtil.ui.htmlToText(appUtil.data.keyToTitle(ps[ps.length-1]));
      },
      _setMetas:function(para){
        appUtil.ui.setMetaInfo("title",this._metaTitle);
        appUtil.ui.setMetaInfo("description",this._metaDescription);
        appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
      },
      _sendAnalysisData:function(data){
        this._adobeData=data;
        pathMap._insertCommonAdobeData(this._adobeData);
        analysisManager.sendData();
      }
    },
    nextversion:{
      _controller:"nextversionController"
    },
    pagenotfound:{
      _title:"Page Not Found",
      _controller:"app",
      _match:function(hash){
        return pathMap._pageNotFound;
      }
    }
  },
  _getCurPath:function(){
    if(appUtil.$scope.pageController && appUtil.$scope.pageController.inStaticPage || !pathMap._formatedLocationHash){
      return [pathMap._home,pathMap._page];
    }
    if(this._pageNotFound){
      return [pathMap._home,pathMap._pagenotfound];
    }
    if(pathMap._formatedLocationHash==this._cacheHash){
      return this._cachePath;
    }
    this._cacheHash=pathMap._formatedLocationHash;
    this._cachePath=[];
    var hash=this._cacheHash.split("#")[1].replace("!","").split("/");
    var lastNode=this;
    for(var i=0;i<hash.length;i++){
      var h=hash[i].replace(/%20/g, ' ');
      if(h){
        var n=lastNode[h];
        if(n){
          this._cachePath.push(n);
          //n._extendTitle="";
          lastNode=n;
        }else{
          if(lastNode._generateExtendTitle){
            if(!hash[hash.length-1]){
              hash.splice(hash.length-1);
            }
            lastNode._generateExtendTitle(hash.splice(i));
          }else{
            if(lastNode._title!='Store Locator' && lastNode._title!='Checkout'){lastNode._extendTitle=(lastNode._title?", ":"")+h;}
          }
          break;
        }
      }
    }
    if(this._cachePath.length==0 || !this._cachePath[0]._formatedHash){
      this._pageNotFound=true;
    }
    return this._cachePath;
  },
  _insertCommonAdobeData:function(d){
    d.page.language = 'EN';
    d.page.app = appName;
    d.login = {status: ''};
    d.account = {BAN : ''};   
    //d.page.href = location.href; 
    d.subscription = { 
      subscriberID : '',
      currentDeviceID : '',
      planID : '',
      restartElig : '',
      throttleState : '',
      usageSummary:''
    };
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
    d.page.app = app;
    return d;
  },
  _formatHash:function(){
    this._formatedLocationHash=location.hash.replace("#!","#!/home");
    if(this._formatedLocationHash.indexOf(pathMap._phones._formatedHash)==0){
      var v = this._formatedLocationHash.replace(pathMap._phones._formatedHash,"").split("/")[0];
      if(v && v[0]!="@" && v!="compare" && v!="accessories" && v!="deals"){
        this._formatedLocationHash = this._formatedLocationHash.replace(pathMap._phones._formatedHash,pathMap._phones._formatedHash+"details/");
      }
    }
    if(this._formatedLocationHash.indexOf(pathMap._hotspots._formatedHash)==0){
      var v = this._formatedLocationHash.replace(pathMap._hotspots._formatedHash,"").split("/")[0];
      if(v){
        this._formatedLocationHash = this._formatedLocationHash.replace(pathMap._hotspots._formatedHash,pathMap._hotspots._formatedHash+"details/");
      }
    }
    if(this._formatedLocationHash.indexOf(pathMap._phoneAccessories._formatedHash)==0){
      var v = this._formatedLocationHash.replace(pathMap._phoneAccessories._formatedHash,"").split("/")[0];
      if(v){
        this._formatedLocationHash = this._formatedLocationHash.replace(pathMap._phoneAccessories._formatedHash,pathMap._accessoriesList._formatedHash);
      }
    }
    return this._formatedLocationHash;
  },
  _triggerApp:function(){
    appUtil.$scope && appUtil.$scope.pageController?appUtil.$scope.pageController.init():"";
    this._pageNotFound=false;
    appUtil.ui.setCanonical();
    try{
      //check url query
      if(location.hash.indexOf("?")>0){
        var vs1=location.hash.split("?");
        var vs2=location.href.split("#!");
        location.href=vs2[0]+"?"+vs1[1]+vs1[0];
        return;
      }
      var v = location.hash.split("|");
      if(v.length>1){
        this._curNav=v[1];
        location.replace(v[0]);
        return;
      }
      if(location.hash=="#" || location.hash=="#!"){
        location.replace(pathMap._home._hash);
        return;
      }else if(location.hash.substring(location.hash.length-1)!="/"){
        location.replace(location.hash+"/");
        return;
      }
      
      this._formatHash();
      angular.element("#appController").scope().assignContext(pathMap._formatedLocationHash);
    }catch(e){
      setTimeout("pathMap._triggerApp()",10);
    }
    //for hidding menu on small screen.
    $(document).click();    
  },
  _init:function(){
    if(!pathResource){
      setTimeout("pathMap._init()",10);
      return;
    }
    this._tmpShortcut={};
    this._hash="#!/";
    this._loadNodeResource();
    this._build(this,this);
    this._location = location;
    for(var k in this._tmpShortcut){
      this[k]=this._tmpShortcut[k];
    }
    delete this._tmpShortcut;
    return this;
  },
  _scrollPage:function(hash,item){
    if(location.hash.indexOf(item._hash)==0){
      if(pathMap._lastHash.indexOf(item._hash)<0) {
        if(item._flag){
          appUtil.ui.scrollTopToElement("#"+item._flag);
          appUtil.ui.refreshContent(true);
        } else {
          appUtil.ui.refreshContent();
        }
      }else{
        appUtil.ui.refreshContent(true);
      }
    }else{
      appUtil.ui.refreshContent();
    }
  },
  _loadNodeResource:function(node,rNode){
    if(!node){
      node=this;
    }
    if(!rNode){
      rNode=pathResource;
    }
    for(k in rNode){
      if(k.indexOf("_")==0){
        node[k]=rNode[k];
      }
    }
    
    for(var k in node){
      if(rNode[k] && k.indexOf("_")!=0){
        this._loadNodeResource(node[k],rNode[k]);
      }
    }
  },
  _build:function(map,node){
    for(var k in node){
      if(k.indexOf("_")!=0){
        if(k=="home" || k=="details"){
          node[k]._hash=node._hash;
        }else{
          node[k]._hash=node._hash+k+"/";
        }
        if(node._formatedHash){
          node[k]._formatedHash=node._formatedHash+k+"/";
        }else{
          node[k]._formatedHash=node._hash+k+"/";
        }
        var shortcut="_"+(node[k]._shortcut || k);
        if(map._tmpShortcut[shortcut]){
          alert("Parse error! Duplicate short-cut,"+shortcut+" in pathMap setting.");
        }else{
          map._tmpShortcut[shortcut]=node[k];
        }
        if(!node[k]._match){
          node[k]._match=function(hash){
            return hash==this._formatedHash;
          };
        }
        if(!node[k]._setContext){
          node[k]._setContext=function(hash){
            if(this._match(hash)){
              var key=this._formatedHash;
              var para=hash.replace(key,"");
              if(this._setMetas){
                this._setMetas(para);
              }else{
                appUtil.ui.setMetaInfo("title",this._metaTitle);
                appUtil.ui.setMetaInfo("description",this._metaDescription);
                appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
              }
              var scope=angular.element("#appController").scope();
              if(eval("scope."+this._controller+".setContext")){
                eval("scope."+this._controller+".setContext(key,para);");
              }else if(this._finalArrange){
                this._finalArrange(hash);
              }else{
                appUtil.ui.refreshContent();
              }
              if(!this._sendAnalysisData && this._adobeData){
                pathMap._insertCommonAdobeData(this._adobeData);
                analysisManager.sendData();
              }
              return true;
            }
            for(var kk in this){
              if(kk.indexOf("_")!=0 && kk.indexOf("$")!=0){
                if(this[kk]._setContext(hash)){
                  return true;
                }
              }
            }
            return false;
          };
        }
        this._build(map,node[k]);
      }
    }
  }
};