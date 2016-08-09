<%@include file="env_data.jsp" %><!DOCTYPE html>
<html>
<head>
<script>
var sdto =null;
function sendData(data,action){
  delete sdto;
  sdto=data;
  window.parent.appUtil.log(JSON.stringify(sdto,null,4));
  _satellite.track(action);
}
loadJs(appConfig[appName].analysisJs);
</script>
</head>
<body>

</body>
</html>
<!-- cs -->