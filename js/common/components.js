var PageContext={
  map:null,
  menuVisible:false,
  mouseInMenu:false,
  curContext:null,
  defaultContext:null,
  assignHash:false,
  init:function(def,assignHash,map){
    this.map=map;
    this.defaultContext=def;
    this.assignHash=assignHash;
    return this;
  },
  //Control page content
  isCurrentContext:function(v){
    var bInit=false;
    if(!this.curContext){
      bInit=true;
      if(location.hash){
        this.curContext=location.hash.substr(1);
      }
    }
    if(!this.curContext){
      this.curContext=this.defaultContext;
    }
    if(bInit){
      this.setContext(this.curContext);
    }
    return this.curContext==v || this.curContext.indexOf(v+",")==0;
  },
  setContext:function(v){
    var cache=v;
    var vv=v.split(",");
    var parameters=null;
    if(vv.length>1){
      v=vv[0];
      parameters=vv[1].split("|");
    }
    if(this.map && !this.map[v]){
      v=this.defaultContext;
      cache=v;
    }
    if(this.map && this.map[v] && this.map[v].init){
      this.map[v].init(parameters);
    }
    this.curContext=v;
    this.setMouseInMenu(false);
    this.showMenu(false);
    var path=location.href.replace(location.hash,"");
    while(path.indexOf("#")==path.length-1){
      path=path.substr(0,path.length-1);
    }
    location.hash="#"+cache;
    window.scrollTo(0, 0);
    return this;
  },
  //Control menu
  showMenu:function(v){
    if(!this.mouseInMenu){
      this.menuVisible=v;
    }
  },
  setMouseInMenu:function(v){
    this.mouseInMenu=v;
  }
};



