var errUnableToFind = "We were unable to find your location, please revise your search and try again.";
var errEnterMoreInfo = "Please enter more information to perform a search.";

var myname = "mycoverage2";
var pageInitialized = false;

var dataservlet="http://coverage.sprint.com/action/MyCoverageDataServlet";
var showNationWide = true;
var highSpeedAlwaysOn = false;
//showNationWide=false; -- put in database (reseller text) for profiles that do not have any 1X coverage.
//MCW 7/10/09 - bad memory... this variable has been commented out everywhere, and comcast has 1X in their
//					 now.  I know I made a change for this, but what was it?  Maybe all I did was remove it
//					 from their profile since they didn't need it.

var zooming = false;
var currentLevel=0;
var changinglayers = false;
var addrVisible = false;
var addressForm;
var bShowPinpoint = false;
var selectCand = false;
var geocodedAddr = false;
var PinpointFlag = false;
var pinpointState = "min";
var showShopBtn = true;
var zoomSlider=false;
var zoomclick=false;
var zoomSliderPos=0;
var zoomSliderMin=0;
var zoomSliderMax= 270; //290;
var zoomLevels = [3300, 1000, 500, 250, 100, 50, 25, 10, 5, 3, 1, .5];
//var zoomLevelsOL = [3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16];
var zoomLevelsOL = [3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16];
var dodebug=false;
var dragmap=false;
var imageStreamURL = "http://coverage.sprint.com/action/ResellerImageStream";
var useBusyTimer=false;
var checkDelayms=3500;
var checkBusyId=null;

var candXML;
var candAddr = "";

var defaultX = -95.9;
var defaultY = 37.1;

//Values used for currently displayed map
var geoCenterX = -95.9;
var geoCenterY = 37.1;
var centerX = geoCenterX;
var centerY = geoCenterY;
var scale = 3300;
var imgPath = "";
var maptop = 55.0105;
var mapleft = -125.84137;
var mapright = -65.95863;
var mapbottom = 19.18943;
var imgWidth = 420;
var imgHeight = 315;
var degPerPixY=0.11371788309060666
var degPerPixX=0.14257794909431942

//Coverage variables parsed from xml
var coverageLevelCDMA = "";
var coverageLeveliDEN = ""; //TODO: remove
var covLevelDiscl = "We do not have coverage level information for all areas.";
//var showCovLevelDiscl = "N"; //not used
var covCDMA = "N"; //TODO: used to enable coverage quality display in legend.. remove
//var covEVDO = "N"; //not used
//var covRoamCDMA = "N"; //not used
//var covRoamAnalog = "N"; //not used

var resellerId;
var defaultStaticMap="/images/usDefault.gif";
var showSignalStrength = false;
var staticUSmap = true;//true; TODO: Set to true before migrating!!

//TODO: Get layer list from ResellerProfileFactory
/*
var showData1900Affiliate = "F"; //not used
var showData1900Sprint = "F"; //not used
var showData1XRTTRoaming = "F"; //not used
var showAmazonPRLEVDO = "F"; //not used
var showEVDORevA = "F"; //not used
var showEVDORoaming = "F"; //not used
var showHOH = "F"; //not used
var showVoice1900Affiliate = "F"; //not used
var showVoice1900Roaming = "F"; //not used
var showVoice1900Sprint = "F"; //not used
var showVoice800Roaming = "F"; //not used
var showSRACov = "F"; //not used
//E3308
var showAmazonPRLCov = "F"; //not used
*/

/*
function defaultClickHandler()
{
   return;
}

function imgClickHandler (img,event)
{
  if (window.event)
    alert(window.event.offsetX + ':' + window.event.offsetY);
  else if (event.target) {
    var coords = {x: 0, y: 0 };
    var el = event.target;
    do {
      coords.x += el.offsetLeft;
      coords.y += el.offsetTop;
    }
    while ((el = el.offsetParent));
    var offsetX = event.clientX - coords.x;
    var offsetY = event.clientY - coords.y;
    alert(offsetX + ':' + offsetY);
  }
}
*/

if(typeof Array.prototype.forEach=="undefined"){
 Array.prototype.forEach=function(funct,obj){
  var ln=this.length;
  for(var key=0; key<ln; key++){
   if(typeof this[key] !="undefined"){
    if(obj){
     funct.apply(obj,[this[key],key,this]);
    }
    else{
     funct(this[key],key,this);
    }    
   }
  }
 };
}

//<!--From dynamicdrive.com-->
function getposOffset(what, offsettype)
{
	if (what == null) return null;
	var totaloffset=(offsettype=="left") ? what.offsetLeft : what.offsetTop;
	var parentEl=what.offsetParent;
	while (parentEl!=null)
	{
		totaloffset=(offsettype=="left") ? totaloffset+parentEl.offsetLeft : totaloffset+parentEl.offsetTop;
		parentEl=parentEl.offsetParent;
	}
	return totaloffset;
}

function getMouseOffset(event)
{
	var iebody=(document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body

	var dsocleft=document.all? iebody.scrollLeft : pageXOffset
	var dsoctop=document.all? iebody.scrollTop : pageYOffset
	return dsoctop + event.clientY;
}

function getMouseOffsetX(event)
{
	var iebody=(document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body

	var dsocleft=document.all? iebody.scrollLeft : pageXOffset
	var dsoctop=document.all? iebody.scrollTop : pageYOffset
	return dsocleft + event.clientX;
}


function showpos(obj,event)
{
	var objoffset = getposOffset(document.getElementById("slicer_pic"),"top") ;
	if (objoffset == null) return;
	var mouseOffset = getMouseOffset(event);
   if (dodebug)
   {
	  document.getElementById("frmImpact2").txtStatus.value=(mouseOffset - objoffset);
   }
	if ((zoomSlider == true || zoomclick == true) && (mouseOffset - objoffset) > zoomSliderMin && (mouseOffset - objoffset) <= zoomSliderMax) //event.clientY > 204 && event.clientY < 300 &&
	{
	   zoomSliderPos = mouseOffset - (objoffset +15);
	   document.getElementById("slicer_slider").style.top = zoomSliderPos + "px";
	}
}

//Move to common.js
function showposmap(obj,event)
{
	var mapobj = document.getElementById("mapimg");
	if (document.getElementById("mapimg") == null)
	{
		return;
	}
	if (scale == zoomLevels[0])
	{
		if (mapobj.style.cursor != "default")
			mapobj.style.cursor="default";
		return;
	}
	else
	{
		if (mapobj.style.cursor != "pointer")
			mapobj.style.cursor="pointer"; //move
	}
	var objoffset = getposOffset(document.getElementById("mapcontainer"),"top") ;
	if (objoffset == null) return;
	var objoffsetx = getposOffset(document.getElementById("mapcontainer"),"left") ;
	if (objoffsetx == null) return;
	var mouseOffset = getMouseOffset(event);
	var mouseOffsetx = getMouseOffsetX(event);
   if (dodebug)
   {
	  document.getElementById("frmImpact2").txtStatus.value=dragmap + ":" + (mouseOffset - objoffset) + "," + (mouseOffsetx - objoffsetx);
	  //log((mouseOffset - objoffset) + "," + (mouseOffsetx - objoffsetx));
   }

	if (dragmap == true)
	{
			hidePinpoint();
	}
	
	if (dragmap == true && (mouseOffset - objoffset) > 0 && (mouseOffset - objoffset) <= imgHeight && (mouseOffsetx - objoffsetx) > 0 && (mouseOffsetx - objoffsetx) <= imgWidth)
	{
		newmapy = (mouseOffset - objoffset) - startmapy;
		newmapx = (mouseOffsetx - objoffsetx) - startmapx;
		document.getElementById("mapimg").style.top = newmapy + "px";
		document.getElementById("mapimg").style.left = newmapx + "px";
	}

}

function dropMap()
{
	if (dodebug)
		document.getElementById("frmImpact2").txtStatus.value="Moved map " + (newmapx) + " left/right and " + ( newmapy) + " up/down.";
	log("Moved map " + (newmapx) + " left/right and " + ( newmapy) + " up/down.");
	if (Math.abs(newmapx) > 0 || Math.abs(newmapy) > 0)
		doRecenter(newmapx,newmapy);
	else
		log("minor change, not reloading map.");
}

function clickmap(obj,event)
{
if(event.preventDefault)
 {
  event.preventDefault();
 }
 	var objoffset = getposOffset(document.getElementById("mapcontainer"),"top") ;
	if (objoffset == null) return;
	var objoffsetx = getposOffset(document.getElementById("mapcontainer"),"left") ;
	if (objoffsetx == null) return;
	var mouseOffset = getMouseOffset(event);
	var mouseOffsetx = getMouseOffsetX(event);

	dragmap = true;
	startmapy = mouseOffset - objoffset;
	startmapx = mouseOffsetx - objoffsetx;
	newmapx = 0; //Set initial value
	newmapy = 0; //Set initial value
   if (dodebug)
   {
	  document.getElementById("frmImpact2").txtStatus.value="Clickstart:" + (mouseOffset - objoffset) + "," + (mouseOffsetx - objoffsetx);
	  log("Clickstart: startmapx: " + startmapx + ", startmapy: " + startmapy + ", old values of newmapx:" + newmapx + ", newmapy:" + newmapy);
   }
}


function setZoomSlider()
{
	 log("setZoomSlider: zoomSliderPos=" + zoomSliderPos);
    if (zoomclick)
    	return;
    var base=4;
    var incr=24; //26; //292 / 11;
    var zoomstr = "zoom positions: ";
    for (var i=0; i<12; i++)
    	zoomstr += (base + incr * i) + " ";
	//alert(zoomstr);
	if (zoomSliderPos < base + incr * 0)
		setZoom(0);
	else if (zoomSliderPos < base + incr * 1)
		setZoom(1);
	else if (zoomSliderPos < base + incr * 2)
		setZoom(2);
	else if (zoomSliderPos < base + incr * 3)
		setZoom(3);
	else if (zoomSliderPos < base + incr * 4)
		setZoom(4);
	else if (zoomSliderPos < base + incr * 5)
		setZoom(5);
	else if (zoomSliderPos < base + incr * 6)
		setZoom(6);
	else if (zoomSliderPos < base + incr * 7)
		setZoom(7);
	else if (zoomSliderPos < base + incr * 8)
		setZoom(8);
	else if (zoomSliderPos < base + incr * 9)
		setZoom(9);
	else if (zoomSliderPos < base + incr * 10)
		setZoom(10);
	else if (zoomSliderPos >= base + incr * 10)
		setZoom(11);
	document.getElementById("slicer_slider").focus();
}

function syncZoomSlider(zoomlevel)
{
    var base=-12; //offset up by half of slider height
    var incr= 24; //26; //294 / 11;
	zoomSliderPos = base + (incr * zoomlevel);
	document.getElementById("slicer_slider").style.top = zoomSliderPos + "px";
}

function clear_form() {
         document.getElementById("frmImpact2").mapstreet.value="";
         document.getElementById("frmImpact2").mapcity.value="";
         document.getElementById("frmImpact2").mapstate.value="";
         document.getElementById("frmImpact2").mapzip.value="";
}

function CheckOptions() {
   if (document.getElementById("frmImpact2").mapstate.value=="NOSELECT") {
      document.getElementById("frmImpact2").mapstate.value=" ";
    }
}


function doMapIt(form)
{
	//checkFields();
	//if (document.getElementById("mapit").enabled == true)
	{
		zooming=false;changinglayers=false;geocodeAddress(form);
	}
}

function checkFields()
{

		var formOK = false;
		if (document.getElementById("frmImpact2").mapstreet.value != "" &&
			document.getElementById("frmImpact2").mapcity.value != "" &&
			document.getElementById("frmImpact2").mapstate.value != "")
		{
			formOK = true;
		}
		else if (document.getElementById("frmImpact2").mapstreet.value != "" &&
		document.getElementById("frmImpact2").mapzip.value != "" )
		{
			formOK = true;
		}
		else if (document.getElementById("frmImpact2").mapcity.value != "" &&
			document.getElementById("frmImpact2").mapstate.value != "")
		{
			formOK = true;
		}
		else if (document.getElementById("frmImpact2").mapzip.value != "" )
		{
			formOK = true;
		}

		return formOK;
}

function checkInput(form, event)
{
	//alert("checkinput");
	//else
	//{
	//	checkFields();
	//}
}

//For AJAX stuff
function geocodeAddress(form)
{

  // Obtain an XMLHttpRequest instance
  var req = newXMLHttpRequest();

  // Set the handler function to receive callback notifications
  // from the request object
  var handlerFunction = getReadyStateHandler(req, readGeocodeResponse);
  req.onreadystatechange = handlerFunction;

  // Open an HTTP POST connection to the shopping cart servlet.
  // Third parameter specifies request is asynchronous.
  req.open("POST", dataservlet, true);

  // Specify that the body of the request contains form data
  req.setRequestHeader("Content-Type",
                       "application/x-www-form-urlencoded");

  // Send form encoded data stating that I want to add the
  // specified item to the cart.
  // "GeoCodeType=ExactAddress"
  var urlString = "mapAction=geocode"
  		+ "&street=" + escape(form.mapstreet.value)
  		+ "&city=" + escape(form.mapcity.value)
  		+ "&state=" + escape(form.mapstate.value)
  		+ "&zip=" + (form.mapzip.value);

  req.send(urlString);
  if (dodebug)
  {
    document.getElementById("mapsearchresults").value=urlString;
    log("geocodeAddress:" + dataservlet + "?" + urlString);
  }

  //MCW commented so busy div doesn't show until we are reading the image... may just have to live with it.
  toggleBusy(true);
  reStoreAddrForm();
  geocodedAddr=false; //Initialize to false in case an error occurs.
  hidePinpoint();
  pinpointState = "min";

  if (dodebug)
  {
	  document.getElementById("frmImpact2").txtStatus.value="Sending request....";
  }
  //document.getElementById("frmImpact2").mapgeocodecenterX.value="";
  //document.getElementById("frmImpact2").mapgeocodecenterY.value="";
  //frmImpact2
  showScale();
}

function showScale() {
	var currentZoom = -1;
	var strmapScale = "";
	for (i=0;i<12;i++)
	{
		strmapScale = "mapScale" + i;
		document.getElementById(strmapScale).style.display='none';
		if (zoomLevels[i] == scale)
			  document.getElementById(strmapScale).style.display='';
	}
}

/*
 * Returns a new XMLHttpRequest object, or false if this browser
 * doesn't support it
 */
function newXMLHttpRequest() {

  var xmlreq = false;

  if (window.XMLHttpRequest) {

    // Create XMLHttpRequest object in non-Microsoft browsers
    xmlreq = new XMLHttpRequest();

  } else if (window.ActiveXObject) {

    // Create XMLHttpRequest via MS ActiveX
    try {
      // Try to create XMLHttpRequest in later versions
      // of Internet Explorer

      xmlreq = new ActiveXObject("Msxml2.XMLHTTP");

    } catch (e1) {

      // Failed to create required ActiveXObject

      try {
        // Try version supported by older versions
        // of Internet Explorer

        xmlreq = new ActiveXObject("Microsoft.XMLHTTP");

      } catch (e2) {

        // Unable to create an XMLHttpRequest with ActiveX
      }
    }
  }

  return xmlreq;
}

/*
 * Returns a function that waits for the specified XMLHttpRequest
 * to complete, then passes its XML response
 * to the given handler function.
 * req - The XMLHttpRequest whose state is changing
 * responseXmlHandler - Function to pass the XML response to
 */
function getReadyStateHandler(req, responseXmlHandler) {

  // Return an anonymous function that listens to the
  // XMLHttpRequest instance
  return function () {

    // If the request's status is "complete"
    if (req.readyState == 4) {

      // Check that a successful server response was received
      if (req.status == 200) {

        // Pass the XML payload of the response to the
        // handler function
		  if (dodebug)
		  {
           document.getElementById("frmImpact2").txtXml.value=req.responseText;
        }
        responseXmlHandler(req.responseXML);

      } else {

        // An HTTP problem has occurred
        //alert("HTTP error: " + req.status);
		  if (dodebug)
		  {
           document.getElementById("frmImpact2").txtXml.value=req.responseText;
        }
      }
    }
  }
}

function selectCandidate(candNum)
{
    if (candXML == null)
    {
        alert("No candidates exist yet.");
    	return;
    }
    var cart = candXML.getElementsByTagName("impactwebds")[0];
    if (cart == null)
    	return;
    var candidateAddr = cart.getElementsByTagName("candidateAddress")[candNum];
    if (candidateAddr == null)
    	return;

	candAddr = getCandidateDisplayAddr(candidateAddr, true);
	var street = getTagValue(candidateAddr.getElementsByTagName("street")[0].firstChild);
	var street2 = getTagValue(candidateAddr.getElementsByTagName("street2")[0].firstChild);
	if (street2 != null && street2 != "")
	   street += " & " + street2;
	document.getElementById("frmImpact2").mapstreet.value = street;
	document.getElementById("frmImpact2").mapcity.value = getTagValue(candidateAddr.getElementsByTagName("city")[0].firstChild);
	document.getElementById("frmImpact2").mapstate.value = getTagValue(candidateAddr.getElementsByTagName("state")[0].firstChild);
	document.getElementById("frmImpact2").mapzip.value = getTagValue(candidateAddr.getElementsByTagName("zip")[0].firstChild);

	var dataEl = cart.getElementsByTagName("data")[0];
	coverageLevelCDMA = getTagValue(dataEl.getElementsByTagName("coverageQualityCDMA")[0].firstChild);
	//coverageLeveliDEN = getTagValue(dataEl.getElementsByTagName("coverageQualityIDEN")[0].firstChild);
	//showCovLevelDiscl = getTagValue(dataEl.getElementsByTagName("showSignalStrengthDisclaimer")[0].firstChild);
	covCDMA = getTagValue(dataEl.getElementsByTagName("CDMA")[0].firstChild);
	//covEVDO = getTagValue(dataEl.getElementsByTagName("EVDO")[0].firstChild);
	//covRoamCDMA = getTagValue(dataEl.getElementsByTagName("roamDigital")[0].firstChild);
	//covRoamAnalog = getTagValue(dataEl.getElementsByTagName("roamAnalog")[0].firstChild);

   updatePinpoint();
   //bShowPinpoint=true;
   geocodedAddr=true;
   addRecentSearch();

   var x = candidateAddr.getElementsByTagName("geocodeCenterX")[0].firstChild.nodeValue;
    var y = candidateAddr.getElementsByTagName("geocodeCenterY")[0].firstChild.nodeValue;
    centerX = x;
    centerY = y;
    geoCenterX = x;
    geoCenterY = y;
    selectCand = true;
	scale = '3'; //candidateAddr.getElementsByTagName("scale")[0].firstChild.nodeValue;

	reStoreAddrForm();
	recenterMap(x,y);
   //bShowPinpoint=true;
	//showPinpoint();
	log("calling omniture in selectCandidate:" + document.getElementById("frmImpact2").mapcity.value + "," + document.getElementById("frmImpact2").mapstate.value + "," + document.getElementById("frmImpact2").mapzip.value);
	makeOmnitureCall('mapit');
}

function getTagValue(node)
{
   var res = "";
	if (node != null)
	{
		res = node.nodeValue;
	}
	if (res == null)
		res = "";
	return res;
}

function readGeocodeResponse(cartXML)
{

  if (dodebug)
  {
	 document.getElementById("frmImpact2").txtStatus.value="Processing response....";
  }

 // Get the root element from the document

 var cart = cartXML.getElementsByTagName("impactwebds")[0];

 if (cart != null)
 {
	var items = cart.getElementsByTagName("location")[0];
	if (items != null)
	{
		var geocoderesult = items.getElementsByTagName("geocodeResult")[0].firstChild.nodeValue;
		//if (geocoderesult == 'match not found')
		var precisionCode = getTagValue(items.getElementsByTagName("precisionCode")[0].firstChild);
		if (geocoderesult == 'match not found' || precisionCode == "G1")
		{
		  if (dodebug)
		  {
			document.getElementById("frmImpact2").txtStatus.value=geocoderesult;
		  }
			//toggleAddrVisible(document.getElementById('addrForm'), true);
			showError(errUnableToFind);
			toggleBusy(false);
		  if (dodebug)
		  {
			document.getElementById("frmImpact2").txtStatus.value=geocoderesult;
		  }
			//alert(geocoderesult);
			return;
		}
	}
	if (cart.getElementsByTagName("error")[0].firstChild != null)
	{
		var errormsg = cart.getElementsByTagName("error")[0].firstChild.nodeValue;
 	   if (dodebug)
	   {
		  document.getElementById("frmImpact2").txtStatus.value=errormsg;
  		}
		//toggleAddrVisible(document.getElementById('addrForm'), true);
		toggleBusy(false);
		return;
	}

	//Check for candidate #2 (index 1) -- if so, present choices to user.
	var candidateAddr = cart.getElementsByTagName("candidateAddress")[0];
	candXML = cartXML; //Test for TWC change.
	//alert("Candidate:" + (candidateAddr != null));
	if (cart.getElementsByTagName("candidateAddress")[1] != null)
	{
		//toggleAddrVisible(document.getElementById('addrForm'), true);
		toggleBusy(false);

	   //alert('before');
	   reSizeAddrForm();
	   candXML = cartXML;
	   //Multiple candidates returned
		document.getElementById('cand0td').style.display='none';
		document.getElementById('cand1td').style.display='none';
		document.getElementById('cand2td').style.display='none';
	   var candNum=0;
	   while (candidateAddr != null && candNum < 3)
	   {
	   	document.getElementById('cand'+candNum+'addr').innerHTML = getCandidateDisplayAddr(candidateAddr, false);
	   	/*
	   	 var street = getTagValue(candidateAddr.getElementsByTagName("street")[0].firstChild);
	       var street2 = getTagValue(candidateAddr.getElementsByTagName("street2")[0].firstChild);
	       if (street2 != null && street2 != "")
	           street += " & " + street2;
	      
		   document.getElementById('cand'+candNum+'addr').innerHTML = street + "<br/>" +
					getTagValue(candidateAddr.getElementsByTagName("city")[0].firstChild) + ", " +
					getTagValue(candidateAddr.getElementsByTagName("state")[0].firstChild) + " " +
					getTagValue(candidateAddr.getElementsByTagName("zip")[0].firstChild);
			*/
		   document.getElementById('cand'+candNum+'map').src=getTagValue(candidateAddr.getElementsByTagName("thumnailPath")[0].firstChild);
		   document.getElementById('cand'+candNum+'td').style.display="";
		   //alert(candNum);

		   candNum = parseInt(candNum) + 1;
		   candidateAddr = cart.getElementsByTagName("candidateAddress")[candNum];
	   }

	}
	else
	{
	    //Single address returned, update variables and show map
		candAddr = getCandidateDisplayAddr(candidateAddr, true);
		var items = cart.getElementsByTagName("location")[0];
		geoCenterX = items.getElementsByTagName("geocodeCenterX")[0].firstChild.nodeValue;
		geoCenterY = items.getElementsByTagName("geocodeCenterY")[0].firstChild.nodeValue;
		centerX = items.getElementsByTagName("centerX")[0].firstChild.nodeValue;
		centerY = items.getElementsByTagName("centerY")[0].firstChild.nodeValue;
		maptop = items.getElementsByTagName("top")[0].firstChild.nodeValue;
		mapleft = items.getElementsByTagName("left")[0].firstChild.nodeValue;
		mapright = items.getElementsByTagName("right")[0].firstChild.nodeValue;
		mapbottom = items.getElementsByTagName("bottom")[0].firstChild.nodeValue;
		scale = items.getElementsByTagName("scale")[0].firstChild.nodeValue;
		imgPath = cart.getElementsByTagName("map_imagefilepath")[0].firstChild.nodeValue;

		var dataEl = cart.getElementsByTagName("data")[0];
		coverageLevelCDMA = getTagValue(dataEl.getElementsByTagName("coverageQualityCDMA")[0].firstChild);
		//coverageLeveliDEN = getTagValue(dataEl.getElementsByTagName("coverageQualityIDEN")[0].firstChild);

		//showCovLevelDiscl = getTagValue(dataEl.getElementsByTagName("showSignalStrengthDisclaimer")[0].firstChild);
		covCDMA = getTagValue(dataEl.getElementsByTagName("CDMA")[0].firstChild);
		//covEVDO = getTagValue(dataEl.getElementsByTagName("EVDO")[0].firstChild);
		//covRoamCDMA = getTagValue(dataEl.getElementsByTagName("roamDigital")[0].firstChild);
		//covRoamAnalog = getTagValue(dataEl.getElementsByTagName("roamAnalog")[0].firstChild);

		//Update form fields with new values.
		//document.getElementById("frmImpact2").mapgeocodecenterX.value = geoCenterX;
		//document.getElementById("frmImpact2").mapgeocodecenterY.value = geoCenterY;
		
		document.getElementById("covaddr").innerHTML=getCandidateDisplayAddr(candidateAddr);

		updatePinpoint();
		bShowPinpoint=true;
		geocodedAddr=true;
		addRecentSearch();
		//document.getElementById("frmImpact2").mapcenterX.value = centerX;
		//document.getElementById("frmImpact2").mapcenterY.value = centerY;


		//Disable old map..
		//getMapImage();

		//OpenLayers code..
			var newcenter = {lon: centerX, lat: centerY}; //WGS84
			//center = {lon: -10578273.21697, lat: 4580565.3563798}; //EPSG:3857
			var datapoint = new OpenLayers.LonLat(newcenter.lon, newcenter.lat);
			var proj_1 = new OpenLayers.Projection("EPSG:4326");
			var proj_2 = new OpenLayers.Projection("EPSG:3857");
			datapoint.transform(proj_1, proj_2);
        //var center = new OpenLayers.LonLat(MapInitialPosition.Lon, MapInitialPosition.Lat)
		toggleBusy(false);
		var newlevel = zoomLevelsOL[getCurrentZoomLevel()];
        MapHandler.Map.setCenter(datapoint, newlevel);
        MapHandler.Map.getLayersByName("Coverage")[0].setVisibility(true);
        //for(var i=0, len=this.dataLayers.length; i<len; i++) {
        //    var layerEntry = this.dataLayers[i];
        //    layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        //}        
		var markers = MapHandler.Map.getLayersByName("Markers");
		if (!markers || markers.length == 0) {
			markers = new OpenLayers.Layer.Markers( "Markers" );
			MapHandler.Map.addLayer(markers);
		} else {
			markers = markers[0];
			markers.clearMarkers();
		}
		var size = new OpenLayers.Size(24,44);
		var offset = new OpenLayers.Pixel(-(size.w/2), -(size.h-8));
		var icon = new OpenLayers.Icon('http://coverage.sprint.com/images/PinPointExample.png', size, offset);
		markers.addMarker(new OpenLayers.Marker(MapHandler.Map.getCenter(),icon));
		//markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon.clone()));

		log("calling omniture in readGeocodeResponse:" + document.getElementById("frmImpact2").mapcity.value + "," + document.getElementById("frmImpact2").mapstate.value + "," + document.getElementById("frmImpact2").mapzip.value);
		makeOmnitureCall('mapit');
	}
  }
  else
  {
	  if (dodebug)
	  {
	     document.getElementById("frmImpact2").txtStatus.value = "root element is null -- " + cartXML.doctype;
	  }
  }

}

function getCandidateDisplayAddr(candidateAddr, oneLine)
{
	if (!oneLine)
		oneLine = false;
		
	if (candidateAddr != null)
	{
		var street = getTagValue(candidateAddr.getElementsByTagName("street")[0].firstChild);
	 	var street2 = getTagValue(candidateAddr.getElementsByTagName("street2")[0].firstChild);
	 	if (street2 != null && street2 != "")
			street += " & " + street2;

		var addrStr = "";
		if (street != null && street != "")
		{
			addrStr += street;
			if (oneLine == false)
				addrStr += "<br/>";
			else
				addrStr += ", ";
		}

		if (getTagValue(candidateAddr.getElementsByTagName("city")[0].firstChild) != null)
		{
			addrStr += getTagValue(candidateAddr.getElementsByTagName("city")[0].firstChild);
		}

		if (getTagValue(candidateAddr.getElementsByTagName("state")[0].firstChild) != null)
		{
			if (addrStr != "")
				addrStr += ", ";
			addrStr += getTagValue(candidateAddr.getElementsByTagName("state")[0].firstChild);
		}

		if (getTagValue(candidateAddr.getElementsByTagName("zip")[0].firstChild) != null)
		{
			if (addrStr != "")
				addrStr += " ";
			addrStr += getTagValue(candidateAddr.getElementsByTagName("zip")[0].firstChild);
		}

		return addrStr;

	}
	else
		return "";
}


function readRecenterResponse(cartXML)
{

  if (dodebug)
  {
	 document.getElementById("frmImpact2").txtStatus.value="Processing response....";
  }


 // Get the root element from the document

 var cart = cartXML.getElementsByTagName("impactwebds")[0];

 if (cart != null)
 {

	if (cart.getElementsByTagName("error")[0].firstChild != null)
	{
		var errormsg = cart.getElementsByTagName("error")[0].firstChild.nodeValue;
	  if (dodebug)
	  {
		 document.getElementById("frmImpact2").txtStatus.value=errormsg;
	  }
		return;
	}

	var items = cart.getElementsByTagName("location")[0];
	if (selectCand == true)
	{
	   //Grab geocode center for selected candidate so pinpoint will show.
	   //alert("updating geocode center: " + geoCenterX + "," + geoCenterY );
		selectCand = false;
		geoCenterX = items.getElementsByTagName("geocodeCenterX")[0].firstChild.nodeValue;
		geoCenterY = items.getElementsByTagName("geocodeCenterY")[0].firstChild.nodeValue;
	}
	var mapaction = getTagValue(items.getElementsByTagName("mapAction")[0].firstChild);
	centerX = items.getElementsByTagName("centerX")[0].firstChild.nodeValue;
	centerY = items.getElementsByTagName("centerY")[0].firstChild.nodeValue;
	maptop = items.getElementsByTagName("top")[0].firstChild.nodeValue;
	mapleft = items.getElementsByTagName("left")[0].firstChild.nodeValue;
	mapright = items.getElementsByTagName("right")[0].firstChild.nodeValue;
	mapbottom = items.getElementsByTagName("bottom")[0].firstChild.nodeValue;
	scale = items.getElementsByTagName("scale")[0].firstChild.nodeValue;
	imgPath = cart.getElementsByTagName("map_imagefilepath")[0].firstChild.nodeValue;
	//Update form fields with new values.
	//document.getElementById("frmImpact2").mapgeocodecenterX.value = geoCenterX;
	//document.getElementById("frmImpact2").mapgeocodecenterY.value = geoCenterY;

	//if we did a getbounds, none of the coverage tags will be populated.	
	if (mapaction != 'getbounds')
	{
		var dataEl = cart.getElementsByTagName("data")[0];
		if (dataEl != null)
		{
			coverageLevelCDMA = getTagValue(dataEl.getElementsByTagName("coverageQualityCDMA")[0].firstChild);
			//coverageLeveliDEN = getTagValue(dataEl.getElementsByTagName("coverageQualityIDEN")[0].firstChild);
			//showCovLevelDiscl = getTagValue(dataEl.getElementsByTagName("showSignalStrengthDisclaimer")[0].firstChild);
			updatePinpoint();
		}
	}

	//disable-OL
	//getMapImage(); 
  }
  else
  {
     if (dodebug)
     {
        document.getElementById("frmImpact2").txtStatus.value = "root element is null -- " + cartXML.doctype;
     }
  }

}


/*--------------------------------------------------------------------------------------------------------
| getMapImageURL - generates URL for map image based on current zoom level and map options checked.
|
| This portion of code was moved out of getMapImage originally in the SCT to support the thumbail maps.
| For the MVNO maps, as of E3308.057 (July 2009), the layer flags for coverage layers have been removed
| from this function, and are retrieved from the reseller profile in ResellerImageStream.  The checkbox
| list for layer control is generated dynamically from the reseller profile, and this fucntion processes
| that array.
*---------------------------------------------------------------------------------------------------------*/
function getMapImageURL()
{

    var bTemp = false;

    var fMCities = "F";
    var fMHighways = "F";
    var fStreets = "F";
    var fRoads = "F";
    var fRoadNames = "F";

    bTemp = document.getElementById("chkCities").checked;
    if (bTemp)
    {
       fMCities = 'T';
    }

    //Set appropriate default for secondary highways
    if (scale >=250)
    {
    	fMHighways = 'F';
    }
    else
    {
      fMHighways = 'T';
    }
    //Should only look at the checkbox for 500 & 250 miles
    bTemp = document.getElementById("chkHighways").checked;
    if (bTemp && (scale == 250 || scale == 500))
    {
       fMHighways = 'T';
    }
    if (scale == 50)
    {
		 bTemp = document.getElementById("chkRoads").checked;
		 if (bTemp)
		 {
			 fRoads = 'T';
		 }
	 }
    if (scale < 50)
    {
		fRoads = 'T';
	 }
	 if ((scale == 5) || (scale == 3))
	 {
		 bTemp = document.getElementById("chkRoadNames").checked;
		 if (bTemp)
		 {
			 fRoadNames = 'T';
		 }
	 }
	 if (scale < 2)
	 {
      bTemp = document.getElementById("chkStreets").checked;
      if (bTemp)
      {
        fStreets = 'T';
      }
    }

	 fShowPinpoint='F';
	 if (geocodedAddr == true && (zoomLevels[0] != scale))
	 {
	 	fShowPinpoint='T';
	 }

 	 var urlString = imageStreamURL
 		+ "?mapcenterx=" + centerX + "&mapcentery=" + centerY
 		+ "&geocenterx=" + geoCenterX + "&geocentery=" + geoCenterY
 		+ "&endlinex=&endliney=&scale=" + scale
 		+ "&width=" + imgWidth + "&height=" + imgHeight + "&showPinpoint=" + fShowPinpoint
 		+ "&resellerid=" + resellerId
 		+ "&layers="
 			+ fMCities
 			+ fMHighways
 			+ fStreets
 			+ fRoads
 			+ fRoadNames;

    for (ii=0; ii< covcheckboxes.length; ii++)
    {
			urlString += "&" + covcheckboxes[ii] + "=" + ( document.getElementById(covcheckboxes[ii]).checked ? "Y" : "N" );
 	 }

	return urlString;
}


// The getMapImage function should only be called after making the xml call to update the field variables.
// If this is not done, the variables will get out of sync with the map and subsequent actions will have
// unpredictable results.
function getMapImage()
{
   if (imgPath == "")
    	return;

   //toggleAddrVisible(document.getElementById('addrForm'), false);

   //toggleBusy(true); //MCW disabled for OL

	urlString = getMapImageURL();

	//Reset map image to static map when zooming all the way out.
	if (staticUSmap && scale == zoomLevels[0])
	{
  		//Temporarily commented out to generate static map
		urlString = defaultStaticMap;
  		log("scale:" + scale + ", zoomlevels[0]:" + zoomLevels[0] + ", switching to static map:" + urlString);
	}

	if (dodebug)
	{
		document.getElementById("frmImpact2").txtStatus.value = "Loading image..." + urlString;
		log("Loading image: " + urlString);
	}
	/* Disable old map images..
 	document.getElementById("mapimg").src=urlString;
	*/
 	updatePinpoint();
 	showScale();

	//OpenLayers code.. 	
	try { console.log("setting timer..");} catch (ex) {}
	window.setTimeout(function () {
		try { console.log("refreshing coverage..");} catch (ex) {}
		MapHandler.refreshCoverage();
		changinglayers=false;
	  },10);

}

function doRecenterClick(obj,event)
{

  var offsetX = 0;
  var offsetY = 0;

  //mcw 2011-06-17 commented out so dblclick from us view works on first map load
  //if (imgPath == "")
  //	return;

	var objoffset = getposOffset(document.getElementById("mapimg"),"top") ;
	var objoffsetx = getposOffset(document.getElementById("mapimg"),"left") ;
	var mouseOffset = getMouseOffset(event);
	var mouseOffsetx = getMouseOffsetX(event);
	offsetX = mouseOffsetx - objoffsetx;
	offsetY = mouseOffset - objoffset;

/*
//Code copied from servlet for reference.
// min y is located in the extreme south
double yDeg_per_pixel = (drMapBounds.ymax - drMapBounds.ymin) / imgHeight;
double yDelta = yDeg_per_pixel * (imgHeight - convertStringToDouble(loc.sImgY, cp.sLog));
float fNewCenterY = (float) (drMapBounds.ymin + yDelta);

// min x is located in the extreme west
double xDeg_per_pixel = (drMapBounds.xmax - drMapBounds.xmin) / imgWidth;
double xDelta = xDeg_per_pixel * convertStringToDouble(loc.sImgX, cp.sLog);
float fNewCenterX = (float) (drMapBounds.xmin + xDelta);
*/

//alert(offsetX + "," + offsetY);
  oldCenterX = centerX;
  oldCenterY = centerY;
  //imgWidth = document.getElementById("mapimg").width;
  //imgHeight = document.getElementById("mapimg").height;
  scaleWidth = Math.abs(Math.abs(mapright) - Math.abs(mapleft));
  scaleHeight = Math.abs(Math.abs(maptop) - Math.abs(mapbottom));
  degPerPixX = scaleWidth / (imgWidth);
  degPerPixY = scaleHeight / (imgHeight);
  xDelta = degPerPixX * parseFloat(offsetX);
  yDelta = degPerPixY * (parseFloat(imgHeight) - parseFloat(offsetY));
  centerX = parseFloat(mapleft) + xDelta;
  centerY = parseFloat(mapbottom) + yDelta;
  /*
  alert("oldCenterX:" + oldCenterX
  	+ "\noldCenterY:" + oldCenterY
  	+ "\nimgWidth:  " + imgWidth
  	+ "\nimgHeight: " + imgHeight
  	+ "\ndegPerPixX:" + degPerPixX
  	+ "\ndegPerPixY:" + degPerPixY
  	+ "\nxDelta:    " + xDelta
  	+ "\nyDelta:    " + yDelta
  	+ "\nnewCenterX:" + centerX
  	+ "\nnewCenterY:" + centerY
  	+ "\nscale:    :" + scale);
  */
  //DO either recenterMap or zoomIn - not both.
  if (scale == zoomLevels[11])
  {
  	 recenterMap(centerX, centerY);
  }
  else
  {
    //If we are at national level, skip a level or two to prevent over-use of 1500 mile zoom
    if (scale == zoomLevels[0])
    {
      scale = zoomLevels[2];
    }
  	 //zoomIn(); //can't use zoomIn(), or it will just do a getbounds and not get new coverage data
	var currentZoom = -1;
	for (i=0;i<12;i++)
	{
		if (zoomLevels[i] == scale)
		{
			currentZoom = i;
			break;
		}
	}
	//alert("Current zoom,scale:" + currentZoom + "," + scale);
	if (currentZoom < 11)
	{
		scale = zoomLevels[parseInt(currentZoom)+1];
	}
	else
	{
		return;
	}

   zooming = true;
   //setZoom(parseInt(currentZoom)+1);
	recenterMap(centerX, centerY);//, false);  	 
  }
  bShowPinpoint=false;
  showScale();
}

//New function to recenter map after dragging.
function doRecenter(offsetX,offsetY)
{
  if (imgPath == "")
  	return;

  //alert(offsetX + "," + offsetY);
  oldCenterX = centerX;
  oldCenterY = centerY;
  scaleWidth = Math.abs(Math.abs(mapright) - Math.abs(mapleft));
  scaleHeight = Math.abs(Math.abs(maptop) - Math.abs(mapbottom));
  degPerPixX = scaleWidth / (imgWidth);
  degPerPixY = scaleHeight / (imgHeight);
  xDelta = degPerPixX * parseFloat(offsetX);
  yDelta = degPerPixY * parseFloat(offsetY);
  centerX = parseFloat(oldCenterX) - xDelta;
  centerY = parseFloat(oldCenterY) + yDelta;
  log("imgWidth:" + imgWidth + ",imgHeight:" + imgHeight + ",degPerPixX:" + degPerPixX + ",degPerPixY:" + degPerPixY);
  log("x delta:" + xDelta + ", y delta:" + yDelta);
  //alert("old:" + oldCenterX + "," + oldCenterY + " - new: " + centerX + "," + centerY);
  recenterMap(centerX, centerY);
  //zoomIn();
  bShowPinpoint=false;
  showScale();
}


function recenterMap(centerX, centerY, isZoom)
{

  // Obtain an XMLHttpRequest instance
  var req = newXMLHttpRequest();

  // Set the handler function to receive callback notifications
  // from the request object
  var handlerFunction = getReadyStateHandler(req, readRecenterResponse);
  req.onreadystatechange = handlerFunction;

  // Open an HTTP POST connection to the shopping cart servlet.
  // Third parameter specifies request is asynchronous.
  req.open("POST", dataservlet, true);

  if (isZoom)
  {
     mapaction = "getbounds";
  }
  else
  {
  	  mapaction = "recenter";
  }

  // Specify that the body of the request contains form data
  req.setRequestHeader("Content-Type",
                       "application/x-www-form-urlencoded");

  // Send form encoded data stating that I want to add the
  // specified item to the cart.
  var urlString = "mapAction=" + mapaction
		+ "&scale=" + scale
  		+ "&width=" + imgWidth
  		+ "&height=" + imgHeight
  		+ "&geocodeCenterX=" + geoCenterX
  		+ "&geocodeCenterY=" + geoCenterY
  		+ "&centerX=" + centerX
  		+ "&centerY=" + centerY;

  if (dodebug)
  {
  	 document.getElementById("mapsearchresults").value=urlString;
  }

  req.send(urlString);

  //MCW commented out so busy div does not show until we load an image
  //toggleBusy(true); //MCW disabled for OL
  //MCW - for now leave on so we can test pinpoint updates
  //bShowPinpoint=false;
  hidePinpoint();
  if (dodebug)
  {
    document.getElementById("frmImpact2").txtStatus.value="Sending request....";
  }
  return;
}

function doPan(direction)
{
	//for openalayers:  -x = west, +x = east, -y = north, +y = south
	var panx=0;
	var pany=0;
		switch(direction){
		case 'N':
			pany=-100;
			break;
		case 'S':
			pany=100;
			break;
		case 'W':
			panx=-100;
			break;
		case 'E':
			panx=100;
			break;
		case 'NE':
			pany=-100;
			panx=100;
			break;
		case 'SE':
			pany=100;
			panx=100;
			break;
		case 'SW':
			pany=100;
			panx=-100;
			break;
		case 'NW':
			pany=-100;
			panx=-100;
			break;
	}
	MapHandler.Map.pan(panx,pany);
	return;
	
  // Obtain an XMLHttpRequest instance
  var req = newXMLHttpRequest();

  // Set the handler function to receive callback notifications
  // from the request object
  var handlerFunction = getReadyStateHandler(req, readRecenterResponse);
  req.onreadystatechange = handlerFunction;

  // Open an HTTP POST connection to the shopping cart servlet.
  // Third parameter specifies request is asynchronous.
  req.open("POST", dataservlet, true);

  // Specify that the body of the request contains form data
  req.setRequestHeader("Content-Type",
                       "application/x-www-form-urlencoded");

  paramData = "mapAction=pan"
  		+ "&pan_dir=" + direction
  		+ "&scale=" + scale
  		+ "&geocodeCenterX=" + geoCenterX
  		+ "&geocodeCenterY=" + geoCenterY
  		+ "&centerX=" + centerX
  		+ "&centerY=" + centerY;

  req.send(paramData);
  if (dodebug)
  {
	 document.getElementById("mapsearchresults").value=paramData;
  }

  //toggleBusy(true); //MCW disabled for OL
  bShowPinpoint = false;
  hidePinpoint();
  if (dodebug)
  {
    document.getElementById("frmImpact2").txtStatus.value="Sending request....";
  }
}

function showInsetMap(insetLoc)
{
	if (insetLoc == "AK")
	{
		centerX = -149.89260864257812;
		centerY = 61.2948112487793;
		document.getElementById("frmImpact2").mapstate.value="AK";
		s_prop32 = document.getElementById("frmImpact2").mapcity.value;
		currentLevel=1;
		scale = 1000;
		recenterMap(centerX, centerY);
	}
	else if (insetLoc == "HI")
	{
		centerX = -156.6522674560547;
		centerY = 20.835241317749023;
		document.getElementById("frmImpact2").mapstate.value="HI";
		s_prop32 = document.getElementById("frmImpact2").mapcity.value;
		currentLevel=2;
		scale = 500;
		recenterMap(centerX, centerY);
	}
	else if (insetLoc == "PR")
	{
		centerX = -66.08016967773438; //-65.77912902832031;
		centerY = 18.420085906982422; //18.1754207611084;
		document.getElementById("frmImpact2").mapstate.value="PR";
		s_prop32 = document.getElementById("frmImpact2").mapcity.value;
		currentLevel=3;
		scale = 250;
		recenterMap(centerX, centerY);
	}
}

function onMoveStart(event) {
	log("onMoveStart() called.");
	var evtswitch = false;
	if (evtswitch && event.zoomChanged && event.object.zoom < MapDefaults.minZoomLevel) {
		event.preventDefault();
		return false;
	}
}

function onZoomStart(event) {
	try {
	log("event:" + JSON.stringify(event));
	} catch (ex) {
		log(ex);
	}
}

function onMapMove(event) {
	log("onMapMove() called.");
	var datapoint = MapHandler.Map.getCenter();
	var proj_1 = new OpenLayers.Projection("EPSG:4326");
	var proj_2 = new OpenLayers.Projection("EPSG:3857");
	datapoint.transform(proj_2, proj_1);
	centerX = datapoint.lon;
	centerY = datapoint.lat;
	var mapscaleOL = MapHandler.Map.getZoom();
	scale = convertZoomLevel(mapscaleOL);

	//Static map
	if (scale != 3300) 
	{
		MapHandler.Map.getLayersByName('Coverage')[0].setVisibility(true);
		hideLayer("mapimg");
		//log("Calling recenterMap()");
		//recenterMap(centerX,centerY);
	} else {
		showLayer("mapimg");
		//MapHandler.Map.getLayersByName('Coverage')[0].setVisibility(false);
	}

	//Markers
	if (MapHandler.Map.getLayersByName('Markers').length > 0) 
	{
		if (scale < 3300) 
		{
			MapHandler.Map.getLayersByName('Markers')[0].setVisibility(true);
		} else {
			MapHandler.Map.getLayersByName('Markers')[0].setVisibility(false);
		}
	}

	//updatePageforZoom();
}

function onMapZoom(event) {
	log("onMapZoom() called.");
	var mapscaleOL = MapHandler.Map.getZoom();
	scale = convertZoomLevel(mapscaleOL);
	//updatePageforZoom();
	updatePinpoint();
}

function getCurrentZoomLevel() {
	for (i=0;i<12;i++)
	{
		if (zoomLevels[i] == scale)
			currentZoom = i;
	}
	return currentZoom;
}

function convertZoomLevel(zoomOL) {
	for (i=0;i<12;i++)
	{
		if (zoomLevelsOL[i] == zoomOL)
			currentZoom = i;
	}
	return zoomLevels[currentZoom];
}

function zoomIn()
{
	//call zoomIn() on OL map
	//MapHandler.Map.zoomIn();

	var currentZoom = -1;
	for (i=0;i<12;i++)
	{
		if (zoomLevels[i] == scale)
			currentZoom = i;
	}
	//alert("Current zoom,scale:" + currentZoom + "," + scale);
	if (currentZoom < 11)
	{
		//scale = zoomLevels[parseInt(currentZoom)+1];
	}
	else
	{
		return;
	}

   zooming = true;
   setZoom(parseInt(currentZoom)+1);
}

function zoomOut()
{
	if (MapHandler.Map.getZoom() > MapDefaults.minZoomLevel) {
		//MapHandler.Map.zoomOut();
	}

    //alert("zoomout");
	var currentZoom = -1;
	for (i=0;i<12;i++)
	{
		if (zoomLevels[i] == scale)
			currentZoom = i;
	}
	//alert("Current zoom,scale:" + currentZoom + "," + scale);
	if (currentZoom > 0)
	{
		//scale = zoomLevels[parseInt(currentZoom)-1];
	}
	else
	{
		return;
	}

   zooming = true;
   //document.getElementById("txtZoomLevel").value = Math.round(scale);
   setZoom(parseInt(currentZoom)-1);
}

function setZoom(level)
{

	//These are actually backward... if I flip the graphics around, this is ok, but the logic for the zoom bar would have to be reversed...
	if (level == 0) {
		MapHandler.Map.zoomTo(zoomLevelsOL[level]);//(MapDefaults.minZoomLevel);
	} else if (level == 11) {
		MapHandler.Map.zoomTo(zoomLevelsOL[level]);//(MapDefaults.maxZoomLevel);
	}
	else {
		MapHandler.Map.zoomTo(zoomLevelsOL[level]);//
	}

	//TODO: because of click and zoom, this is breaking the recenter.. need to also
	//check to see if centerx,centery have changed.
   //make sure zoom level is changing
   if (scale == zoomLevels[level])
   {
   	  //alert( "Requested zoom level:" + zoomLevels[level] );
      //alert("zoom unchanged, returning.");
   	  return;
   }

	currentLevel = level;
   zooming = true;
   //alert( "Requested zoom level:" + zoomLevels[level] );

   scale = zoomLevels[level];//level;
   //document.getElementById("txtZoomLevel").value = Math.round(zoomLevels[level]);
   syncZoomSlider(level);
	if (level == 0)
	{
		//Reset x,y, change to static map, clear mapped address
		centerX = defaultX;
		centerY = defaultY;
		document.getElementById("covaddr").innerHTML="";
		//document.getElementById("covaddr1").innerHTML="";
		//hideSearchResults();
	}
   
   hidePinpoint();
   zoomMap();
}

function zoomMap()
{

	//Call recenterMap, which will use the new scale to get a new image at the same centerX, centerY
	recenterMap(centerX, centerY,true);


	//was calling this, but it did not update the field variables, so subsequent pans used old map bounds!
	//getMapImage();
}

function updatePageforZoom()
{
	var level;
	for (i=0;i<12;i++)
	{
		if (zoomLevels[i] == scale)
		{
			level = i;
		}
	}

	syncZoomSlider(level);

  if (scale == zoomLevels[0])
  {
  		clear_form();
  		//If uncommented, this code will disable option checkboxes at the national zoom
  		/*
  		hideLayer("mapdetailoptions");
  		
  		for (i=0;i<covcheckboxes.length;i++)
  		{
  			document.getElementById(covcheckboxes[i]).disabled=true;
  			document.getElementById("spn"+covcheckboxes[i]).style.color="#AAAAAA";
  		}
  		*/
  		
		//showLayer("mapAK");
		//showLayer("mapHI");
		//showLayer("mapPR");
  }
  else
  {
  		//If uncommented, this code will disable option checkboxes at the national zoom
  		/*
  		showLayer("mapdetailoptions");
  		if (hasCheckboxes)
  		{
  			showLayer("impactServices");
  		}
  		for (i=0;i<covcheckboxes.length;i++)
  		{
  			document.getElementById(covcheckboxes[i]).disabled=false;
  			document.getElementById("spn"+covcheckboxes[i]).style.color="";
  		}
  		*/
  		
		//hideLayer("mapAK");
		//hideLayer("mapHI");
		//hideLayer("mapPR");
  }

	document.getElementById('MajorCities').style.display='';
	document.getElementById('SecondaryRoads').style.display='none';
	document.getElementById('MajorRoads').style.display='none';
	document.getElementById('MajorRoadNames').style.display='none';
	document.getElementById('Streets').style.display='none';

	if ((scale == 500) || (scale == 250))
		{
			document.getElementById('MajorCities').style.display='';
			document.getElementById('SecondaryRoads').style.display='';
			document.getElementById('MajorRoads').style.display='none';
			document.getElementById('MajorRoadNames').style.display='none';
			document.getElementById('Streets').style.display='none';
		}
	if (scale == 50)
		{
			document.getElementById('MajorCities').style.display='';
			document.getElementById('SecondaryRoads').style.display='none';
			document.getElementById('MajorRoads').style.display='';
			document.getElementById('MajorRoadNames').style.display='none';
			document.getElementById('Streets').style.display='none';
		}
	if ((scale == 5) || (scale == 3))
		{
			document.getElementById('MajorCities').style.display='none';
			document.getElementById('SecondaryRoads').style.display='none';
			document.getElementById('MajorRoads').style.display='none';
			document.getElementById('MajorRoadNames').style.display='';
			document.getElementById('Streets').style.display='none';
		}
	if (scale < 3)
		{
			document.getElementById('MajorCities').style.display='none';
			document.getElementById('SecondaryRoads').style.display='none';
			document.getElementById('MajorRoads').style.display='none';
			document.getElementById('MajorRoadNames').style.display='none';
			document.getElementById('Streets').style.display='';
		}
		
	//setPageHeight();

}

function recenterLastAddress()
{
	if (geocodedAddr == false)
		return;

	centerX=geoCenterX;
	centerY=geoCenterY;
	var newcenter = {lon: centerX, lat: centerY}; //WGS84
	//center = {lon: -10578273.21697, lat: 4580565.3563798}; //EPSG:3857
	var datapoint = new OpenLayers.LonLat(newcenter.lon, newcenter.lat);
	var proj_1 = new OpenLayers.Projection("EPSG:4326");
	var proj_2 = new OpenLayers.Projection("EPSG:3857");
	datapoint.transform(proj_1, proj_2);
	MapHandler.Map.setCenter(datapoint);
	
	if (centerX != geoCenterX || centerY != geoCenterY)
	{
		centerX=geoCenterX;
		centerY=geoCenterY;
		recenterMap(centerX, centerY);
	}

	bShowPinpoint=true;
	updatePinpoint();
}

function toggleAddrVisible(addrDiv, visibility)
{
	//addrVisible = !addrVisible;
	addrVisible = visibility;
	if (addrVisible)
	{
	   if (PinpointFlag)
	      minimizePinpoint();
	   else
	     hidePinpoint();
	   //document.getElementById("error_msg").style.display='none';
		addrDiv.style.visibility='visible';
		document.getElementById("mapstreet").focus();
		document.getElementById("mapstreet").select();
	}
	else
	{
		addrDiv.style.visibility='hidden';
	}

	return;
}

function toggleBusy(vis)
{
	var busy = document.getElementById("busy");
	if (busy == null)
		return;

	if (vis)
	{
		//toggleAddrVisible(document.getElementById('addrForm'), false);
		//alert('show pinpoint: ' + bShowPinpoint);
		//if (bShowPinpoint)
		//	showPinpoint();
		hidePinpoint();
		busy.style.visibility='visible';
		if (useBusyTimer)
		{
			if (checkBusyId!=null)
			{
				//log("toggleBusy clearing checkBusy interval.");
				clearInterval(checkBusyId);
			}
			//log("*** toggleBusy setting checkBusy interval.");
			checkBusyId = setInterval(checkBusy, checkDelayms);
		}
	}
	else
	{
		busy.style.visibility='hidden';
		if (checkBusyId!=null)
		{
			//log("toggleBusy clearing checkBusy interval.");
			clearInterval(checkBusyId);
		}
	}
}

function checkBusy()
{
	log("checkbusy starting..");
	var busy = document.getElementById("busy");
	if (busy == null)
	{
		log("body div not located.");
		return;
	}

	if (busy.style.visibility=='visible')
	{
		log("** checkBusy calling onMapLoad()");
		//toggleBusy(false);
		onMapLoad();
	}

}

//<!--Start of changes for Pinpoints & Address Fields D8328-->
	var pinMinimized=new Boolean();
	pinMinimized=false;
	var fullAddress="";
	function reSizeAddrForm()
	{
		document.getElementById("error_msg").style.display='none';
		document.getElementById('complete_info').style.display='none';
		//document.getElementById('addrForm').style.height='190px';
		document.getElementById('sevr_loc_txt').style.display='';
		document.getElementById('map_opt').style.display='';
		//document.getElementById('addrRightShadow').style.height='277';
		//document.getElementById('addrBottomShadow').style.top='275';
	}
	function reStoreAddrForm()
	{
		document.getElementById("error_msg").style.display='none';
		document.getElementById('complete_info').style.display='';
		//document.getElementById('addrForm').style.height='100px';
		document.getElementById('sevr_loc_txt').style.display='none';
		document.getElementById('map_opt').style.display='none';
		//document.getElementById('addrRightShadow').style.height='112';
		//document.getElementById('addrBottomShadow').style.top='110';
	}
//<!--End of changes for Pinpoints & Address Fields D8328-->



	function updatePinpoint()
	{
			updatePageforZoom();

			//PJ8051 - change from 50 to 6 miles for signal strength to match SCT
			var ssZoom = 6;

			//TODO: Use ResellerProfile legend items
				var addrStr = "";
				if (candAddr != "")
				{
					addrStr = candAddr; //"";
				}
				else
				{
					if (document.getElementById("frmImpact2").mapstreet.value != "")
						addrStr += document.getElementById("frmImpact2").mapstreet.value;
	
					if (document.getElementById("frmImpact2").mapcity.value != "")
					{
						if (addrStr != "")
							addrStr += " ";
						addrStr += document.getElementById("frmImpact2").mapcity.value;
					}
	
					if (document.getElementById("frmImpact2").mapstate.value != "")
					{
						if (addrStr != "")
							addrStr += ", ";
						addrStr += document.getElementById("frmImpact2").mapstate.value;
					}
	
					if (document.getElementById("frmImpact2").mapzip.value != "")
					{
						if (addrStr != "")
							addrStr += " ";
						addrStr += document.getElementById("frmImpact2").mapzip.value;
					}
				}
	
			   //alert(document.getElementById('minaddress').style.width + ',' + document.getElementById('minaddress').clientWidth);return false;
			   //alert(document.getElementById("spCovgQualityInd").innerHTML);
				document.getElementById("pinaddress").innerHTML=addrStr;
				if (addrStr.length > 30)
					addrStr = addrStr.substring(0,30) + "...";
				document.getElementById("minaddress").innerHTML=addrStr;
	
				//document.getElementById('spOtherSrvcLink').style.display='';
				//document.getElementById('spAnalogVoiceCoverage').style.display='none';
	
				//document.getElementById('spDigitalVoiceCoverage').style.display='none';
	
				document.getElementById('spChoice').innerHTML='<b>Coverage:</b>';
	
				if (scale > ssZoom)
				{
					//if (hasiDEN)
					{
						//mcw uncomment to enable dynamic show/hide of dynamic legend item for iden
						//hideLayer('legendiDENss');
						
					}
					//if (hasSprintVoice && showSignalStrength)
					{
						//mcw uncomment to enable dynamic show/hide of dynamic legend item for cmda
						hideLayer('legendNationalNetworkss');
						
					}
					for (ii=0; ii< legenditems.length; ii++)
					{
						hideLayer(legenditems[ii]+"ss");
					}
	
					
				}
				if (scale <= ssZoom && showSignalStrength == true) 
				{
					for (ii=0; ii< legenditems.length; ii++)
					{
						showLayer(legenditems[ii]+"ss");
					}
	
					//Old signal strength meter
					//document.getElementById('tbody2').style.display='';
	
					if (hasSprintVoice)
					{
						showLayer('legendNationalNetworkss');
						if (covCDMA == 'Y')
						{
							document.getElementById("spCovgQuality").innerHTML="<b>"+ coverageLevelCDMA +"</b>";
							if (coverageLevelCDMA != 'No Coverage')
								document.getElementById('CovgQualityText').style.display='';
							else
								document.getElementById('CovgQualityText').style.display='none';
						}
						else
						{
							document.getElementById('CovgQualityText').style.display='none';
						}
		
						//Impossible to reach this
						if (showSignalStrength == false)
						{
							document.getElementById('CovgQualityText').style.display='none';
						}
	
					}
										
				}
				else
				{
					//Wonder why this was commented out...
					document.getElementById('CovgQualityText').style.display='none';

				}
			//End of override
			
			//Update page height to make sure legend isn't cut off.
			setPageHeight();
	}

	function onMapLoad(object, element)
	{
		document.getElementById("mapimg").style.top = "0px";
		document.getElementById("mapimg").style.left = "0px";
	   toggleBusy(false);
		if (bShowPinpoint && (zoomLevels[0] != scale))
			showPinpoint();
	}

	function setPageHeight()
	{
		var tmpHeight = document.getElementById("drawersntabs").clientHeight;
		var tmpMapOpt = document.getElementById("mapoptions").offsetTop + document.getElementById("mapoptions").clientHeight;
		log("drawersntabs height:" + tmpHeight);
		if (tmpHeight < 430)
		{
			tmpHeight = 430;
		}
		else
		{
			tmpHeight += 10;
		}
		if (tmpHeight < tmpMapOpt)
		{
			tmpHeight = tmpMapOpt;
		}
		
		document.getElementById("impactMainContent").style.height= tmpHeight + "px";
		log("set maincontent height to :" + tmpHeight);
		//alert("Set MainContent height to:" + tmpHeight + "px");
	}


	function minimizePinpoint()
	{
		hidePinpoint();
		pinpointState = "min";
		showPinpoint();
		//document.getElementById('pinpointMin').style.visibility='visible';
	}

	function hidePinpoint()
	{
		PinpointFlag = false;
		document.getElementById('pinpointMin').style.visibility='hidden';
		document.getElementById('pinpoint').style.visibility='hidden';
	}

	function showPinpoint()
	{
		return;
		
		if (geocodedAddr == false)
			return;
		PinpointFlag = true;
		if (pinpointState == "min")
		{
			document.getElementById('pinpointMin').style.visibility='visible';
			document.getElementById('pinpoint').style.visibility='hidden';
			document.getElementById('pinpointMin').style.top = ((imgHeight / 2) + 15 - document.getElementById('pinpointMin').clientHeight + 6 ) + 'px';
		}
		else
		{
			//toggleAddrVisible(document.getElementById('addrForm'), false);
			document.getElementById('pinpointMin').style.visibility='hidden';
			document.getElementById('pinpoint').style.visibility='visible';
			//alert( ((imgHeight / 2) + 15 - document.getElementById('pinpoint').clientHeight + 6 )+ ",actual top:" + document.getElementById('pinpoint').style.top);
			document.getElementById('pinpoint').style.top = ((imgHeight / 2) + 15 - document.getElementById('pinpoint').clientHeight + 6 ) + 'px';
		}
	}

	function restorePinpoint()
	{
		pinpointState = "max";
		showPinpoint();
	}

function onKeyPress(e)
{
//alert("keypress1");
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return false;
    //alert("keypress2");
    if (keycode == 13 )
    {
    	if (checkFields())
    	{
			 zooming=false;
			 changinglayers=false;
			 //alert("keypress3");
			 //document.getElementById("recenterlink").focus(); //commented out due to errors. 2/20/2010
			 geocodeAddress(document.getElementById("frmImpact2"));
			 //alert("keypress4");
			 return false;
		}
		else
		{
			//alert("fields not validated.");
			return false;
		}
    }
    //alert("keypress5");
    //document.getElementById("recenterlink").focus();
    return true;
}

function showHide(layerName)
{
if (document.getElementById)
  {var fred = document.getElementById(layerName);var display = fred.style.display ? '' : 'none';fred.style.display = display;return;
  }
}

function popUp(page, name, w, h, scroll, showToolbar)
{ var winl = (screen.width - w) / 2;var wint = (screen.height - h) / 2;var toolbar = 'toolbar=yes';
	 if ( !showToolbar ) {toolbar = 'toolbar=no';}winprop  = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable,' +toolbar;win = window.open(page, name, winprop);
	 if (parseInt(navigator.appVersion) >= 4) {win.window.focus();}}var win=null;function NewWindow(mypage,myname,w,h,scroll,pos) {if(pos=="center") {LeftPosition=(screen.width)?(screen.width-w)/2:100;TopPosition=(screen.height)?(screen.height-h)/2:100;}
	 else
	 if(pos!="center" || pos==null) {LeftPosition=0;TopPosition=20;}settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+scroll+',location=yes,directories=yes,status=yes,menubar=yes,toolbar=yes,resizable=yes';win=window.open(mypage,myname,settings);
}

function printPage()
{
	if (window.print)
	{ window.print(); }
	else
	{ alert(toprint); }
}

function refillSelect(key,targetForm,targetName,list,selectedValue)
{
	var target = '';
	for ( var i = 0; i < targetForm.elements.length; i++ )
	{
		if ( targetForm.elements[i].name == targetName )
		{
			target = targetForm.elements[i];
		}
	}
	if ( target == '' )
	{
		return;
	}

	target.options.length = list[key].length;
	var selected = false;
	for ( var i = 0; i < target.options.length; i++ )
	{
		target.options[i].value = list[key][i];
		target.options[i].text = list[key][i];
		if ( target.options[i].value == selectedValue )
		{
			selected = true;
			target.options[i].selected = true;
			target.selectedIndex = i;
		}
	}
	if ( !selected )
	{
		target.selectedIndex = 0;
	}
}

function showError(txt)
{
	document.getElementById("error_txt").innerHTML=txt;
	document.getElementById("error_msg").style.display='';
	//document.getElementById("complete_info").style.display='none';
}

function showLayer(layerName)
{
	//log("showLayer:" + layerName);
	if (document.getElementById)
	{
		if(!layerName.nodeName) layerName = document.getElementById(layerName);
		if(layerName)
		{
			layerName.style.display = '';
		}
	}
}

function hideLayer(layerName)
{
	//log("hideLayer:" + layerName);
	if (document.getElementById)
	{
		if(!layerName.nodeName) layerName = document.getElementById(layerName);
		if(layerName)
		{
			layerName.style.display = 'none';
		}
	}
}

function setClass(layerName, newClassName)
{
	if (document.getElementById)
	{
		if(!layerName.nodeName) layerName = document.getElementById(layerName);
		if(layerName)
		{
			layerName.className=newClassName;
		}
	}
}

function setVisibility(layerName, vis)
{
	var svis;
	if (vis)
		svis = "visible";
	else
		svis = "hidden";

	log("Layer:" + layerName + "=" + svis);
	if (document.getElementById)
	{
		if(!layerName.nodeName) layerName = document.getElementById(layerName);
		if(layerName)
		{
			layerName.style.visibility = svis;
		}
	}
}


var recentSearches = [
	[ false, "", "", "", "" ],
	[ false, "", "", "", "" ],
	[ false, "", "", "", "" ],
	[ false, "", "", "", "" ],
	[ false, "", "", "", "" ] 	];


function loadRecentAddrs()
{
	if (getCookie("myrecentaddr"))
	{
		log(getCookie("myrecentaddr"));
		var addrs=getCookie("myrecentaddr").split('|');
		idx=0;
		addrs.forEach(function(val)
			{
				log(val);
				if (val > "")
				{
					var parts=val.split("~");
					if (parts != undefined && parts[0] != "undefined" && parts[1] != "undefined" && parts[2] != "undefined" && parts[3] != "undefined")
					{
						log("Adding:" + parts);
						recentSearches[idx][0] = true;
						recentSearches[idx][1] = parts[0];
						recentSearches[idx][2] = parts[1];
						recentSearches[idx][3] = parts[2];
						recentSearches[idx][4] = parts[3];
						idx++;
					}
				}
			});
	}
}


function showRecentSearches()
{
	if (document.getElementById("recentsearchdiv").style.display=="none")
	{
		for ( var idx = 0; idx < recentSearches.length; idx++ )
		{
			if (recentSearches[idx][0] == true)
			{
				document.getElementById("recentsearch"+idx).innerHTML=getRecentAddr(idx);
				showLayer("search"+idx);
			}
			else
			{
				hideLayer("search"+idx);
			}
		}

		if (recentSearches[0][0] == false)
			showLayer("norecentsearches");
		else
			hideLayer("norecentsearches");

		document.getElementById("recentsearchdiv").style.display="";
		showLayer("recentsearchdiv");
		setVisibility("formline1", false);
		setVisibility("formline2", false);
	}
	else
	{
		hideRecentSearches();
	}
}

function hideRecentSearches()
{
	//document.getElementById('recentsearchdiv').style.display='none';
	hideLayer("recentsearchdiv");
	setVisibility("formline1", true);
	setVisibility("formline2", true);
}

function getRecentSearch(idx)
{
	hideRecentSearches();

  var form = document.getElementById('frmImpact2');

	form.mapstreet.value = recentSearches[idx][1];
	form.mapcity.value = recentSearches[idx][2];
	form.mapstate.value = recentSearches[idx][3];
	form.mapzip.value = recentSearches[idx][4];
	if (checkFields())
		doMapIt(form);
}

function addRecentSearch()
{
  var form = document.getElementById('frmImpact2');

	var tmpstreet = form.mapstreet.value;
	var tmpcity = form.mapcity.value;
	var tmpstate = form.mapstate.value;
	var tmpzip = form.mapzip.value;

	var dup = false;
	var firstfree = -1;
	var cookieval="";
	//log("addRecentSearch:before for loop.");
	for ( var idx = 0; idx < recentSearches.length; idx++ )
	{
		if (compareAddr(idx, tmpstreet, tmpcity, tmpstate, tmpzip) == true)
			dup = true;
		if (recentSearches[idx][0] == false)
		{
			firstfree = idx;
			break;
		}
		cookieval += recentSearches[idx][1] + "~" +
						recentSearches[idx][2] + "~" +
						recentSearches[idx][3] + "~" +
						recentSearches[idx][4] + "|";
	}
	//log("addRecentSearch:after for loop." + dup + "," + firstfree);
	if (dup == false && firstfree == -1)
	{
		cookieval="";
		for ( var idx = 0; idx < recentSearches.length - 1; idx++ )
		{
			recentSearches[idx][1] = recentSearches[idx+1][1];
			recentSearches[idx][2] = recentSearches[idx+1][2];
			recentSearches[idx][3] = recentSearches[idx+1][3];
			recentSearches[idx][4] = recentSearches[idx+1][4];
			cookieval += recentSearches[idx][1] + "~" +
							recentSearches[idx][2] + "~" +
							recentSearches[idx][3] + "~" +
							recentSearches[idx][4] + "|";
		}
		recentSearches[4][0] = false;
		firstfree = 4;
	}
	if (dup == false && firstfree < recentSearches.length)
	{
		idx = firstfree;
		recentSearches[idx][0] = true;
		recentSearches[idx][1] = tmpstreet;
		recentSearches[idx][2] = tmpcity;
		recentSearches[idx][3] = tmpstate;
		recentSearches[idx][4] = tmpzip;
		//log("addRecentSearch:added search=" + recentSearches[idx]);
		cookieval += recentSearches[idx][1] + "~" +
						recentSearches[idx][2] + "~" +
						recentSearches[idx][3] + "~" +
						recentSearches[idx][4] + "|";
	}
	setCookie("myrecentaddr",cookieval);
}

function compareAddr(idx, street, city, state, zip)
{
	//log("compareAddr(" + idx + "):" + recentSearches[idx]);
	if (recentSearches[idx][0] == false) return false;
	if (recentSearches[idx][1] != street) return false;
	if (recentSearches[idx][2] != city) return false;
	if (recentSearches[idx][3] != state) return false;
	if (recentSearches[idx][4] != zip) return false;

	return true;

}

function getRecentAddr(idx)
{
	if (recentSearches[idx][0] == true)
	{
		var street = recentSearches[idx][1];

		var addrStr = "";
		if (street != null && street != "")
			addrStr += street + ", ";

		if (recentSearches[idx][2] != "")
		{
			addrStr += recentSearches[idx][2];
		}

		if (recentSearches[idx][3] != "")
		{
			if (addrStr != "")
				addrStr += ", ";
			addrStr += recentSearches[idx][3];
		}

		if (recentSearches[idx][4] != "")
		{
			if (addrStr != "")
				addrStr += " ";
			addrStr += recentSearches[idx][4];
		}

		return addrStr;
	}
	else
		return "";
}


function getCookie(Name)
{
     var search = Name + "="
     if (document.cookie.length > 0)
     {
        // if there are any cookies
        offset = document.cookie.indexOf(search)
        if (offset != -1)
        { // if cookie exists
           offset += search.length
           // set index of beginning of value
           end = document.cookie.indexOf(";", offset)
           // set index of end of cookie value
           if (end == -1)
           end = document.cookie.length
           return unescape(document.cookie.substring(offset, end))
        }
     }
}

// Sets cookie values. Expiration date is optional
function setCookie(name, value, expire)
{
		document.cookie = name + "=" + escape(value)
		    + ( (expire == null) ? "" : ("; expires=" + expire.toGMTString()) )
}


function setupDebug()
{
	dodebug=true;
	_debug=true; //enable logging window.
   with(document.getElementById('hiddenstuff'))
   {
   	style.position='absolute';
   	style.top='850px';
   	style.visibility='visible';
   	style.display='';
   	style.width='730px';
   };
   with(document.getElementById("frmImpact2"))
   {
   	txtStatus.style.display='';
   	txtStatus.style.width='700px';
   	txtXml.style.display='';
   	txtXml.style.width='700px';
   	txtXml.style.height='120px';
   	mapsearchresults.style.display='';
   	mapsearchresults.style.width='700px';
   }
}


function makeOmnitureCall(whichFunc)
{
	//No omniture for MVNO tool.
	return false;
	
	if (!pageInitialized)
	{
		//alert("makeOmnitureCall - page not initialized yet!");
		return false;
	}

	var drawerLabel;
	var tabLabel;

	/*
	switch(selectedDrawer){
		case 'voice':
			drawerLabel='Voice Coverage';
		break;
		case 'data':
			drawerLabel='Data, Email and Multimedia';
			break;
		case 'walkietalkie':
			drawerLabel='Nextel Direct Connect®';
			break;
	}
	switch(selectedTab) {
		case 'sprint':
			tabLabel='Sprint Devices';
			break;
		case 'nextel':
			tabLabel='Nextel Devices';
			break;
		case 'combo':
			tabLabel='PowerSource Devices';
			break;
		case 'wimax':
			tabLabel='Sprint Devices with 4G';
			break;
	}
	*/

	switch(whichFunc) {
		case 'coverage':
			if (Analytics != undefined && Analytics.CovTool != undefined) {
				log("Calling Analytics.CovTool.coverageDevice(" + drawerLabel + "," + tabLabel + ")" );
				var t=setTimeout("Analytics.CovTool.coverageDevice('" + drawerLabel + "', '" + tabLabel + "')",100);
				//Analytics.CovTool.coverageDevice(drawerLabel, tabLabel);
			}
			else
			{
				log("Analytics not defined");
			}
			break;
		case 'mapit':
			if (Analytics != undefined && Analytics.CovTool != undefined) {
				log("Calling Analytics.CovTool.mapItHandler(" + document.getElementById("frmImpact2").mapcity.value + "," + document.getElementById("frmImpact2").mapstate.value + "," + document.getElementById("frmImpact2").mapzip.value + ")" );
				var t=setTimeout("Analytics.CovTool.mapItHandler('" + document.getElementById("frmImpact2").mapcity.value + "','" + document.getElementById("frmImpact2").mapstate.value + "','" + document.getElementById("frmImpact2").mapzip.value + "')",100);
				//Analytics.CovTool.mapItHandler(document.getElementById("frmImpact2").mapcity.value,document.getElementById("frmImpact2").mapstate.value,document.getElementById("frmImpact2").mapzip.value);
			}
			else
			{
				log("Analytics not defined");
			}
			//Old omniture code.
			//s_prop33="";
			//s_prop34="";
			break;
	}

	//TODO: Use settimeout to call these functions in the background, and then it should be safe to have them triggered
	//      on the click event instead of waiting until the end.

	//Old omniture code.
	//log("calling omniture. s_prop32=" + s_prop32 + ", s_prop33=" + s_prop33 + ", s_prop34=" + s_prop34);
	//s_gs(s_account);

}

resellerId = 'BO543STC';
var resellerName = 'Boost Mobile CDMA';
defaultStaticMap = 'images/BO543STC.gif';
var covlayers = ['Spark2500_1', 'Spark1900_1', 'Spark800_1', 'Spark2500_2', 'Spark1900_2', 'Spark800_2', 'Spark2500', 'Spark1900', 'Spark800', 'LTE', '4G', 'EVDORevA', 'HOH', 'Data1900Sprint', 'Data1900Affiliate', 'Voice1900Sprint', 'Voice1900Affiliate', 'nocoverage'];
var covcheckboxes = ['chkSpark', 'chkLTE', 'chk4G', 'chkData'];
var legenditems = ['legendSpark', 'legendLTE', 'legend4G', 'legendEVDO', 'legend1XRTT', 'legendNationalNetwork', 'legendNoCoverage'];
hasCheckboxes=true;
showSignalStrength=true;
hasSprintVoice=true;
function profileInit() {


}



var hasLatLong = false;

document.ondragstart = function(e) {

return false;

}

function init() {
  MapHandler.init();
  MapHandler.Map.updateSize();
}