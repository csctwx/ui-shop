pathMap.home.plans={
  _title:"Plans",
  _controller:"app",
  _metaTitle:"No Contract & Prepaid Phone Plans from Sprint Prepaid",
  _metaDescription:"See how much you can save by choosing a no contract phone plan from Sprint Prepaid. Get the same great network without the hassle of a contract.",
  _metaKeywords:"prepaid phone plans, prepaid cell phone plans, no contract phone plans, no contract cell phone plans",
  _shortcut:"plan",
  _adobeData:{
    page : {
      channel : 'eStore',
      subSection : 'Plans', 
      name : 'Plans Wall'
    }
  },
  _match:function(hash){
    if(hash==this._formatedHash){
      if(location.hash.indexOf("#!/plans/faq")<0) {
        this._flag="";
      }
      return true;
    }
    var vs=hash.split("/");
    if(hash.indexOf("#!/home/plans/faq")==0){
      this._flag=vs[3];
      return true;
    }
    return false;
  },
  _generateExtendTitle:function(){
  },
  _finalArrange:function(hash){
    pathMap._scrollPage(hash,this);
  },
  additionalservices:{
    _title:"Additional Services",
    _controller:"app",
    _metaTitle:"Sprint Prepaid Additional Services | Insurance, International Rates, Hotspot",
    _metaDescription:"Sprint Prepaid add on plans include mobile hotspot, international rates, phone insurance and more.",
    _metaKeywords:"prepaid additional services, sprint prepaid add ons, international rates, phone insurance, mobile hotspot",
    _shortcut:"additionalServices",
    _curTabIdx:-1,
    _match:function(hash){
      return hash.indexOf(this._formatedHash)>=0;
    },
    _setContext:function(hash){
      if(this._match(hash)){
        var scope=angular.element("#appController").scope();
        appUtil.ui.setMetaInfo("title",this._metaTitle);
        appUtil.ui.setMetaInfo("description",this._metaDescription);
        appUtil.ui.setMetaInfo("keywords",this._metaKeywords);
        pathMap._insertCommonAdobeData(this._adobeData);
        analysisManager.sendData();
        var v = hash.replace(this._formatedHash,"");
        if(v){
          v=v.split("/")[0];
          var items=appUtil.$scope.asController.data.items;
          for(var i=0;i<items.length;i++){
            if(items[i].key==v){
              this._curTabIdx=i;
              this._flag=v;
              break;
            }
          }
          windowResizeObjMap.additionalServicesResizeFun=this._resizeSmallTail;
          setTimeout("pathMap._additionalServices._resizeSmallTail()",100);
        }else{
          this._curTabIdx=-1;
          this._flag="";
        }
        pathMap._scrollPage(hash,this);
        return true;
      }
      return false;
    },
    _resizeSmallTail:function(){
      var v = location.hash.replace(pathMap._additionalServices._hash,"");
      if(v!=location.hash && v.length>1){
        v=v.replace("/","");
        $("."+v+".small_tile").css({height:($("#"+v).height()+2)+"px"});
      }else{
        delete windowResizeObjMap.additionalServicesResizeFun;
      }
    },
    _generateExtendTitle:function(ps){
      this._extendTitle= "";
    },
    _adobeData:{
      page : {
        channel : 'eStore',
        subSection : 'Plans', 
        name : 'Additional Services'
      }
    }
  }
};
pathMap.home.bestbuy={
  _title:"",
  _controller:"app",
  _metaTitle:"Bestbuy Prepaid Phones & No Contract Phones from Sprint Prepaid",
  _metaDescription:"Bestbuy Find all your favorite phones without the hassle of a contract. Get savings without sacrificing your network and choose Sprint Prepaid.",
  _metaKeywords:"Bestbuy prepaid phones, no contract phones, sprint prepaid",
  _adobeData:{
    page : {
      channel : 'Bestbuy',
      subSection : 'Bestbuy', 
      name : 'Bestbuy Page'
    }
  }
};

pathMap.home.support = {
  _title:"Support",
  _controller:"supportController",
  _match:function(hash){
    return hash == this._formatedHash;
  },
  faqs:{
    _title:"FAQs",
    _controller:"supportController",
    _match:function(hash){
      return hash == this._formatedHash;
    },
    internationalrates:{
      _title:"International Rates",
      _controller:"supportController",
      _match:function(hash){
        return hash.indexOf(this._formatedHash)==0;
      }
    }
  }
};

pathMap._init();