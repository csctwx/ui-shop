<%@ page import="java.util.*,java.io.*" %>
<%
if(application.getAttribute("version")==null){
  application.setAttribute("version",new java.util.Date().getTime());
}
application.setAttribute("appConfig",null);
Object appConfig=null;
Object appLinkJs=null;
Object appRedirect=null;
if(application.getAttribute("appConfig")==null){
  Properties properties = new Properties();
  String folder=System.getProperty("confdir");
  if(folder==null){
    folder="conf";
	//folder="C:/tomcat/conf";
  }
  File shopJson=new File(folder+"/shop.json");
  File linksJson=new File(folder+"/links.json");
  File redirectJson=new File(folder+"/redirect.json");
  appConfig = new Scanner(shopJson).useDelimiter("\\Z").next();
  appLinkJs= new Scanner(linksJson).useDelimiter("\\Z").next();
  appRedirect= new Scanner(redirectJson).useDelimiter("\\Z").next();
  application.setAttribute("appConfig",appConfig);
  application.setAttribute("appLinkJs",appLinkJs);
  application.setAttribute("appRedirect",appRedirect);
}
appConfig=application.getAttribute("appConfig");
appLinkJs=application.getAttribute("appLinkJs");
request.setCharacterEncoding("UTF-8");
String myAccountTokenHeader = (String)request.getHeader("MY-ACCOUNT-IB-DATA");
appRedirect=application.getAttribute("appRedirect");
//String myAccountToken=(String)session.getAttribute("MY-ACCOUNT-IB-DATA");
String myAccountToken=request.getParameter("MY-ACCOUNT-IB-DATA");

// String myAccountToken="asdf";
if(myAccountToken==null){
  if(myAccountTokenHeader!=null){
     myAccountToken=myAccountTokenHeader;  
  }else{
	  myAccountToken="";
  }
}
%>
	<script src="js/lib/jquery.min.js"></script>
<script>
  var appConfig=<%=appConfig%>;
  var ibToken="<%=myAccountToken%>";     
  var appName=appConfig.appMap[location.host].name.toLowerCase();
	var appErrorCheckout1="";
	var appErrorCheckout2="";
	var appErrorCheckout3="";
  var appDisplayName="";
  switch(appName) {
	  case 'bst':
		  appDisplayName = "Boost Mobile";
	appErrorCheckout1=appConfig.bst.errorStep1;
	appErrorCheckout2=appConfig.bst.errorStep2;
	appErrorCheckout3=appConfig.bst.errorStep3;
	      break;
	  case 'vmu':
		  appDisplayName = "Virgin Mobile";
	appErrorCheckout1=appConfig.vmu.errorStep1;
	appErrorCheckout2=appConfig.vmu.errorStep2;
	appErrorCheckout3=appConfig.vmu.errorStep3;
	      break;
	  default:
		  appDisplayName = "Sprint Prepaid";
	appErrorCheckout1=appConfig.spp.errorStep1;
	appErrorCheckout2=appConfig.spp.errorStep2;
	appErrorCheckout3=appConfig.spp.errorStep3;
	}

  function loadJs(name,preId){
    var script=document.createElement('script');
    script.type='text/javascript';
    script.src=name;
    if(preId){
      $(script).insertAfter(preId);
    }else{
      $("head").append(script);
    }
  }
  <%=appLinkJs%>;
  
	/*
	 * Redirect Script
	 */
	 var appRedirect=<%=appRedirect%>;
   if(ibToken){
    appRedirect.bst = jQuery.extend({}, appRedirect.bst_installmentBilling);
   }
		function initiateRedirectRules(){
			if (appConfig.redVenturesRedirect) {
				var redirectRuleObject = appRedirect[appName];
				for (var item in redirectRuleObject) {
					var lc = item.substring(item.length-1);
					var hashlocation = location.hash;
					if (lc == "*") {
						//User has typed in * at the end of the redirect rule
						if (hashlocation.indexOf(item.substring(0,item.length-1)) > -1) {
							window.location.replace(redirectRuleObject[item]);
						}
					} else if (lc == "$") {
						//User has typed in $ at the end of the redirect rule
						if (hashlocation.indexOf(item.substring(0,item.length-1)) > -1) {
							var newlocation = hashlocation.replace("#!","");
							window.location.replace(newlocation);
						}
					} else {
						if (hashlocation == item) {
							window.location.replace(redirectRuleObject[item]);
						}
					}
				}
			}
		}
		initiateRedirectRules();
		window.onhashchange = initiateRedirectRules;
	  
</script>