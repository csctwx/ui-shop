<script>
var a="${pageContext.request.contextPath}";
var a =a+"/#!/"+location.href.split(location.host+a+"/")[1];
location.href=a;
</script>