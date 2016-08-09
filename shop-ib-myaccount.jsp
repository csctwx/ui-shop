<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>   
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<%

String myAccountToken=(String)request.getParameter("MY-ACCOUNT-IB-DATA");

String site = request.getContextPath()+"/#!/shop/phones/";

//String site = "http://boostmobile.com:8080/sprintsc-repo/ui-shop/#!/shop/phones/";
response.setStatus(response.SC_TEMPORARY_REDIRECT);
session.setAttribute("MY-ACCOUNT-IB-DATA",myAccountToken);
//response.sendRedirect(site);
//response.addHeader("Location", site);

%>

<jsp:forward page="<%=site%>" />
    <jsp:param name="MY-ACCOUNT-IB-DATA" value="<%=myAccountToken%>"/>
</jsp:forward>

token = <%=myAccountToken%>
site = <%=site%>

</html>