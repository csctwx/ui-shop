var analysisManager={
  tmpFrameMap:{},
  sendData:function(pathName){
    var version=appUtil.data.generateId();
    var tmpFrame = $("<iframe id=\"analysisFrame\" style=\"width:0px;height:0px;\"></iframe>").appendTo("body");
    this.tmpFrameMap[version]=tmpFrame;
    var path="analysis.jsp";
    if(pathMap._curNav){
      path+="?INTNAV="+pathMap._curNav;
      pathMap._curNav="";
    }
    path+="#"+version+",";
    if(pathName){
      path+=pathName;
    }

    tmpFrame[0].src=path;
    appUtil.log("sendAnalysisData ...")
  },
  removeTmpFrame:function(v,node){
    this.tmpFrameMap[v].remove();
    delete this.tmpFrameMap[v];
    if(node._resetAnalysisData){
      node._resetAnalysisData();
    }
    //appUtil.log("removeAnalysisFrame ...");
  },
  sendWidgetData:function(v){
    var path=pathMap._getCurPath();
    var sdto=angular.copy(path[path.length-1]._adobeData);
    if(path[path.length-1]._resetAnalysisData){
      path[path.length-1]._resetAnalysisData();
    }
    $("#analysisTracker")[0].contentWindow.sendData(sdto,v);
  }
};
