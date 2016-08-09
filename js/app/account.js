var appAccount=({
  data:{},
  init:function(){
    this.data.name = appUtil.data.retrieveFromCookie("portaluser");
    return this;
  },
  isLogin:function(){
    return this.data.name;
  }
}).init();