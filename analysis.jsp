<%@include file="env_data.jsp" %><!doctype html>
<html lang="en">
<head>
  <script>
    
    var version=location.hash.substring(1).split(",")[0];
    var pathName=location.hash.substring(1).split(",")[1];
    if(pathName){
      eval("var node=window.parent.pathMap."+pathName);
    }else{
      var path=window.parent.pathMap._getCurPath();
      var node = path[path.length-1];
    }
    window.sdto = node._adobeData;
    window.parent.appUtil.log("Nav: "+location.search);
    window.parent.appUtil.log("Data: "+JSON.stringify(window.sdto,null,4))
      
    function prepareRemove(){
      if(window._satellite){
        setTimeout("removeMe()",1000);
      }else{
        setTimeout("prepareRemove()",1000);
      }
    }
    function removeMe(){
      parent.analysisManager.removeTmpFrame(version,node);
    }
    loadJs(appConfig[appName].analysisJs);

  </script>
  
  <script type="text/javascript" src="//s.btstatic.com/tag.js">
         { site: "9v8Thi0", mode: "sync" }
  </script>
</head>
<body>

</body>
<script>
setTimeout("prepareRemove()",100);
</script>
</html>
