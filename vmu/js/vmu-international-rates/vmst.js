// For page load requests
function _$vmst(tid, xprops)
{
	
	if(!tid) return;
	
	// Parse Page Name and Levels
	// Stupid hack to not pass the incorrect tid for this page
	
	if(xprops && xprops.pageName=="My Account-Prepaid: Account Services: Service Settings"){
		s.pageName=xprops.pageName;
	}
	else{
		s.pageName = tid;
	}
	
   
	var levels = tid.split(":");
	s.channel = levels[0];
	if (levels.length > 1) s.prop9 = levels[1];
	if (levels.length > 2) s.prop10 = levels[2];

	// Other Page level Variables Defined in Corresonding Page Config
	for (var p in $vmpt[tid]) {
		
		if( typeof(s[p]) != "undefined") {
			s[p] += "," + $vmpt[tid][p];
		}
		else{
			s[p] = $vmpt[tid][p];
		}
	} 

	// Other Page level Variables Defined in Funciton Call
	for (var x in xprops) {
		if( typeof(s[x]) != "undefined" ) {
            if(x != "pageName"){    s[x] += "," + xprops[x];} // stupid hack to prevent pageName from being logged twice for the service settings tracking
        }
		else{
                if(x != "pageName"){ s[x] = xprops[x];} // stupid hack to prevent pageName from being logged twice for the service settings tracking
        }
	}
	
	

	// Which Language Are we Using
	try {
		if (jQuery('html').attr('lang') == "es") s.prop2 = "sp";
		else s.prop2 = "en";
	}
	catch(err) {
		s.prop2 = "en";
	}

	// Is user logged in/out
	try {
		if (jQuery.cookie("u_log")) s.prop3 = "Logged In";
		else s.prop3 = "Logged Out";
	}
	catch(err) {
		s.prop3 = "Logged Out";
	}
	
	// Is user a prospect or existing customer
	try {
		if (jQuery.cookie("u_cst")) s.prop4 = "customer";
		else s.prop4 = "prospect";
	}
	catch(err) {
		s.prop4 = "prospect";
	}
	
	///BAN and subscriber ID
	if ($j.cookie("ban")){
	   s.prop37 = $j.cookie("ban");
	   s.eVar37 = $j.cookie("ban");
	} 
	if ($j.cookie("subid")){
	   s.prop38 = $j.cookie("subid");
	   s.eVar38 = $j.cookie("subid");
	} 
	
	// Check for out of stock phones on phone details pages
	if( $j('#phoneDetailsSplash').length > 0 && $j('div.button_outofstock').length > 0 ) {
		s.eVar29= s.prop9 + ': out of stock';
	}

	// Fire ze'Pixels!
	var s_code=s.t();
	if (s_code) document.write(s_code);
}



//for onclick events
//atype: 'o' - custom link, 'd' - download link
function _$vmstl(tid, aobj, atype, xprops)
{
	//if(isDEVENVIRONMENT()) return;
		
	if(!tid) return;

	s=s_gi(s_account);
	
	var trackV = "";
	for(var p in xprops)
	{
		if(trackV != "") trackV += ",";
		trackV += p;
		if(p == "events") s.linkTrackEvents = xprops[p];
		s[p] = xprops[p];
	}
	
	if(trackV)
		s.linkTrackVars = trackV;

	s.tl(aobj, atype, tid);
}

//user clicks on print plan on vmu custom page.
function _$vmst_vmucustom_printplan()
{
	s.prop29='VM Custom : Great Value – Print This';
	s.linkTrackVars = 'prop29';
	s.tl(true,'o','Print This');
	s.prop29='';
}


//for when the user clicks on the Service Settings content filter drop down
function _$vmst_services_settings()
{
	s.prop31='My Account-Prepaid: Account Services: Service Settings: Content Filtering';
	s.linkTrackVars = 'prop31';
	s.tl(true,'o','Content Filtering');
	s.prop31='';
}

function _$vmst_mobile_ad_settings()
{
	s.prop31='My Account-Prepaid: Account Services: Service Settings: Mobile Advertising';
	s.linkTrackVars = 'prop31';
	s.tl(true,'o', 'Mobile Advertising');
	s.prop31='';
}

function _$vmst_business_reporting_settings()
{
	s.prop31='My Account-Prepaid: Account Services: Service Settings: Business Reporting';
	s.linkTrackVars = 'prop31';
	s.tl(true,'o','Business Reporting');
	s.prop31='';
}

function _$vmst_services_settings_no_choice_error()
{
	
	_$vmst('My Account-Prepaid: Account Services: Service Settings Error', {pageName:"My Account-Prepaid: Account Services: Service Settings",prop57:"My Account-Prepaid: Account Services: Service Settings",prop56:"Please select a valid filter setting.", events:"event58"})
	
}

function _$vmstlte(iccid, linkname)
{
	s.eVar32='LTE Device';
	s.prop32='LTE Device';

	if(iccid)
	{
		s.events=s.apl(s.events,'event32',',',2);
		s.linkTrackVars='eVar32,prop32,events';
		s.linkTrackEvents='event32';
	}
	else
		s.linkTrackVars='eVar32,prop32';

	s.tl(true,'o',linkname);
	s.eVar32="";
	s.prop32="";
	s.events="";
}

function _$vmstlte_modal(pid)
{
	s.pageName = pid;
	s.t();
}



function _$vmstnavtl(tid) {
	if(!tid) return;
	s.eVar7=tid;
	s.linkTrackVars='eVar7';
	s.tl(true,'o','main nav click');
}


function _$vmstCartView() {
	
	// Grab Previous Cart View Contents
	var lastCartProducts = jQuery.cookies.get('vmst_cartitems');
	
	
	// Parse Product in Cart
	var cartProducts = {};
	var cartSkus = Array();
	var lineCount = 0;
	var productCount = 0;
	s.products = '';

	jQuery('input').filter(function(){ return /lineItem\[[0-9]+\].sku/.test(this.name)}).each(function(index, value)
	{
		var inputNameParts = jQuery(this).attr('name').split('.');
		var lineSku = jQuery(this).val();
		var lineQuantity = parseInt(jQuery('input[name="'+inputNameParts[0]+'.quantity"]').val());
		cartSkus.push(lineSku);
		if( s.products.length > 0 ) s.products += ",;" + lineSku;
		else s.products += ";" + lineSku;
		
		// Create Product Object
		cartProducts[lineSku] = {};
		cartProducts[lineSku].quantity = lineQuantity;
		// Store any other properties here
		
		productCount += lineQuantity;
		lineCount++;
	});
	jQuery.cookies.set('vmst_cartitems', cartProducts, {path: '/'}); // Save Cookie For Future Comparison

	// Default Event
	s.events='scView';

	///////////////// Cart Event Overrides //////////////////
	var urlPrams = getUrlParameters(); // Grab URL GET Variables
	
	// Check for mini cart query string parameters
	if ('intid' in urlPrams) {
		var qsIntID = urlPrams['intid'].toString();
		if (qsIntID == 'MS:MiniCart:Details' || qsIntID == 'MS:MiniCart:Remove' || qsIntID == 'MS:MiniCart:Checkout') {
			s.events += ',event23';
		}
	}	

	// Check for the Add to Cart URL
	if (window.location.href.match('/catalogPurchase.do'))
	{
		if ( productCount == 1 ) { s.events += ',scOpen,scAdd'; } // First Product for cart open
		else { s.events += ',scAdd'; }
	}
	// Check for the update cart URL
	else if (window.location.href.match('/processShoppingcart.do'))
	{
		// Quantity Update e.g./processShoppingcart.do?lineItem%5B0%5D.quantity=1&lineItem%5B0%5D.sku=885909630523
		// Just check for the quanity param for the first line item. It adds get params for all line items in the cart
		// We don't use this information in processing the request, just to check if the action is triggered
		if ('lineItem[0].quantity' in urlPrams)
		{
		
			var itemAdded = false;
			var itemRemoved = false;
			var addedProducts = '';
			var removedProducts = '';
		
			// Check for Quantity Removes
			jQuery.each(lastCartProducts, function(i,n) {
				if (cartProducts[i] != undefined ) {
					if (cartProducts[i].quantity < n.quantity) {
						itemRemoved = true;
						if (removedProducts.length > 0) removedProducts += ",;"+i;
						else  removedProducts += ";"+i;
					}
				} else {
					itemRemoved = true;
					if (removedProducts.length > 0) removedProducts += ",;"+i;
					else  removedProducts += ";"+i;
				}
			});
		
			// Check for Quantity Adds
			jQuery.each(cartProducts, function(i,n){
				if (lastCartProducts[i].quantity < n.quantity) {
					itemAdded = true;
					if (addedProducts.length > 0 ) addedProducts += ",;"+i;
					else addedProducts += ";"+i;
				}
			});
			
			// Override Events and products if we changed the cart contents
			if (itemAdded)
			{
				s.events = 'scAdd';
				s.products = addedProducts;
			}
			else if (itemRemoved)
			{
				s.events = 'scRemove';
				s.products = removedProducts;
			}
			
		}
		
		// Remove From Cart - e.g. /processShoppingcart.do?remove=885909630523
		if ('remove' in urlPrams)
		{
			s.events = 'scRemove';
			s.products = ';'+urlPrams['remove'].toString();
		}
	}
	
	// Call Omniture Page Load Trigger
	_$vmst("Purchase-Prepaid: Shopping Cart");
}



omAddToCart = function(tid,productID) {
	// We are letting the cart page handle this.
	/*if (jQuery.cookie('u_cart')) {
		var eventString = "scAdd";
	}
	else {
		var eventString = "scAdd,scOpen";
	}		
	var productString = ";" + productID;
	
	_$vmstl(tid,this,'o',{events:eventString,products:productString});*/
}


function getUrlParameters() {
	var map = {};
	var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		map[key] = value;
	});
	return map;
}




//Omniture Pagecode vars  
var $vmpt = new Object();


//Service Settings page in My Account
$vmpt["My Account-Prepaid: Account Services: Service Settings Update Successful"] = {
		eVar24:"service setting", 
		prop7:"service setting",
		events:"event17"
	};
//Service Settings page in My Account
$vmpt["My Account-Prepaid: Account Services: Service Settings Error"] = {
		
	};

//Service Settings page in My Account
$vmpt["My Account-Prepaid: Account Services: Service Settings"] = {
		eVar24:"service setting",
		prop7:"service setting",
		events:"event16"
	};
/*$vmpt["Purchase-Prepaid: Shopping Cart"] = {eVar1:"Prepaid Purchase"};
$vmpt["Purchase-Prepaid: Order Success"] = {eVar1:"Prepaid Purchase", events:"purchase"};
$vmpt["Login-Prepaid: Generic Login Form"] = {prop19:"Log In-Error",eVar1:"Login",events:"event2"};
$vmpt["Login-Prepaid: Logout - End Session"] = {eVar1:"Login",events:"event3,event6"};
$vmpt["Help: Contact Us"] = {eVar1:"Contact Us"};
$vmpt["Help: Contact Us-Thank You Page"] = {eVar1:"Contact Us",events:"event4"};*/

$vmpt["Purchase-Prepaid: Shopping Cart"] = {
		eVar24:"prepaid purchase",
		prop7:"prepaid purchase",
		prop8:"prepaid purchase: step 1 > cart",
		events:"event16"
	};
$vmpt["Purchase-Prepaid: Order Review - A-Stock"] = {
		prop8:"prepaid purchase: step 3 > review order",
		events:"scCheckout"
	};
$vmpt["Purchase-Prepaid: Order Review - B-Stock"] = {
		prop8:"prepaid purchase: step 3 > review order",
		events:"scCheckout"
	};
$vmpt["Purchase-Prepaid: Order Success"] = {
		prop8:"prepaid purchase: step 4 > order success",
		events:"event17,purchase"
	};
	
$vmpt["Login-Prepaid: Generic Login Form"] = {
		eVar24:"login",
		prop7:"login",
		prop8:"login: step 1 > generic login form",
		events:"event16"
	};
$vmpt["Login-Prepaid: Logout - End Session"] = {
		prop8:"login: step 2 > logout",
		events:"event17"
	};

$vmpt["Help: Contact Us"] = {
	eVar24:"contact us",
	prop7:"contact us",
	prop8:"contact us: step 1",
	events:"event16"
};
$vmpt["Help: Contact Us-Thank You Page"] = {
		prop8:"contact us: step 2 > thank you",
		events:"event17"
};


/*$vmpt["Activate: Welcome Summary - PAYGO"] = {eVar1:"Activate",events:"event3,event7"};
$vmpt["Activate: Welcome Summary - TD"] = {eVar1:"Activate",events:"event3,event7"};
$vmpt["Activate: Welcome Summary - RO"] = {eVar1:"Activate",events:"event3,event7"};
$vmpt["Activate: Start"] = {eVar1:"Activate",events:"event 2"};
$vmpt["Activate: Card Fail"] = {prop19:"Activate-Card Fail"};
$vmpt["Activate: Child Suspend"] = {prop19:"Activate-Child Suspend"};
$vmpt["Activate: Child Warning"] = {prop19:"Activate-Child Warning"};*/

// Activation Flow
$vmpt["Activate: Start"] = {
		eVar24:"activation",
		prop7:"activation",
		prop8:"activation: step 1 > enter phone details",
		events:"event16"
	};
$vmpt["Activate: Check Coverage"] = {
		prop8:"activation: step 2 > enter account info"
	};
$vmpt["Activate: Card Fail"] = {
		eVar30:"activation: activate-card fail",
		events:"event21"
	};
$vmpt["Activate: Child Suspend"] = {
		eVar30:"activation: activate-child suspend",
		events:"event21"
	};
$vmpt["Activate: Child Warning"] = {
		eVar30:"activation: activate-child warning",
		events:"event21"
	};


/*$vmpt["Lost Phone: Landing Page"] = {eVar1:"lost phone",events:"event2"};
$vmpt["Lost Phone: Account Unsuspend-Failed"] = {prop19:"Lost Phone-Unsuspend Failed"};
$vmpt["Lost Phone: Account Unsuspend-Success"] = {eVar1:"Lost Phone",eVar11:"Lost Phone Purchase",events:"event3,event10"};*/


$vmpt["Lost Phone: Landing Page"] = {
		eVar24:"lost phone",
		prop7:"lost phone",
		prop8:"lost phone: step 1 > landing page",
		events:"event16"
	};
	
$vmpt["Lost Phone: Account Suspended-Cancel"] = {
		prop8:"lost phone: step 2 > account suspended-cancel",
		events:"event17"
	};
	
$vmpt["Lost Phone: Suspend Failed"] = {
		eVar30:"lost phone: suspend failed",
		events:"event21"
	};
	
$vmpt["Lost Phone: Replace Offer"] = {
		prop8:"lost phone: step 2 > replacement offer"
	};
	
$vmpt["Lost Phone: Account Suspended-No Action"] = {
		prop8:"lost phone: step 3 > suspended-no action",
		events:"event17"
	};


// One Step - Not a flow	
//Lost Phone: Account Unsuspend-Success
$vmpt["Lost Phone: Account Unsuspend-Failed"] = {
		eVar30:"lost phone: account unsuspend-failed",
		events:"event21"
	};



/*$vmpt["My Account-Prepaid: Account Curing: Retry Card Failed"] = {eVar1:"Account Curing",events:"event2"};
$vmpt["My Account-Prepaid: Account Curing: Curing Success"] = {eVar1:"Account Curing",events:"event3"};
$vmpt["My Account-Prepaid: Account Curing: Update RPV"] = {eVar1:"Account Curing-Update RPV",events:"event2"};
$vmpt["My Account-Prepaid: Account Curing: Update RPV Success"] = {eVar1:"Account Curing-Update RPV",events:"event3"};*/

$vmpt["My Account-Prepaid: Account Curing: Retry Card Failed"] = {
		eVar24:"account curing",
		prop7:"account curing",
		prop8:"account curing: step 1 > retry card failed",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Curing: Curing Success"] = {
		prop8:"account curing: step 2 > success",
		events:"event17"
	};
$vmpt["My Account-Prepaid: Account Curing: Update RPV"] = {
		eVar24:"account curing",
		prop7:"account curing",
		prop8:"account curing: step 1 > update RPV landing page",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Curing: Update RPV Success"] = {
		prop8:"account curing: step 2 > update RPV success",
		events:"event17"
	};



/*$vmpt["Top-Up: Start-Logged In - RPV"] = {events:"event2"};
$vmpt["Top-Up: Start-Logged In - No RPV"] = {events:"event2"};
$vmpt["Top-Up: PayGo-Credit Card Success"] = {eVar1:"Top-Up",eVar11:"Top-Up Purchase",events:"event3,event13"};
$vmpt["Top-Up: Top-Up Card Success"] = {eVar1:"Top-Up",eVar11:"Top-Up Purchase",events:"event3,event13"};
$vmpt["Top Up: RO-Success Top-Up Card or Credit Card Payment-RPV"] = {eVar1:"Top-Up",eVar11:"Top-Up Purchase",events:"event3,event13"};
$vmpt["Top-Up: Start-Not Logged In"] = {events:"event2"};
$vmpt["Top-Up: PayGo-Top-Up Success-Now Buy Minute Pack"] = {eVar1:"Top-Up",eVar11:"Top-Up Purchase",events:"event3,event13"};
$vmpt["Top-Up: System Error"] = {prop19:"Top-Up-System Error"};
$vmpt["Top-Up: Account Threshold"] = {prop19:"Top-Up-Account Threshold"};*/

// Account Top-Up Flow
$vmpt["Top-Up: Start-Logged In - RPV"] = {
		eVar24:"top-up",
		prop7:"top-up",
		prop8:"top-up: step 1 > start-logged in - rpv",
		events:"event16"
	};
$vmpt["Top-Up: Start-Logged In - No RPV"] = {
		eVar24:"top-up",
		prop7:"top-up",
		prop8:"top-up: step 1 > start-logged in - no rpv",
		events:"event16"
	};
$vmpt["Top-Up: Start-Not Logged In"] = {
		eVar24:"top-up",
		prop7:"top-up",
		prop8:"top-up: step 1 > start-not logged in",
		events:"event16"
	};
$vmpt["Top-Up: PayGo-Credit Card Success"] = {
		prop8:"top-up: step 2 > top-up purchase",
		events:"event17"
	};
$vmpt["Top-Up: Top-Up Card Success"] = {
		prop8:"top-up: step 2 > top-up purchase",
		events:"event17"
	};
$vmpt["Top Up: RO-Success Top-Up Card or Credit Card Payment-RPV"] = {
		prop8:"top-up: step 2 > top-up purchase",
		events:"event17"
	};
$vmpt["Top-Up: PayGo-Top-Up Success-Now Buy Minute Pack"] = {
		prop8:"top-up: step 2 > top-up purchase",
		events:"event17"
	};
$vmpt["Top-Up: System Error"] = {
		eVar30:"top-up: top-up-system error",
		events:"event21"
	};
$vmpt["Top-Up: Account Threshold"] = {
		eVar30:"top-up: top-up-account threshold",
		events:"event21"
	};



/*$vmpt["My Account-Prepaid: Account Services: Change Phone Number-Confirm"] = {eVar1:"Change Phone Number",events:"event3"};
$vmpt["My Account-Prepaid: Account Services: Change Phone Number-Start"] = {eVar1:"Change Phone Number",events:"event2"};
$vmpt["My Account-Prepaid: Account Activity: Auto Top Up Settings - RO Options"] = {eVar1:"Top-Up",events:"event2"};
$vmpt["My Account-Prepaid: Account Activity: Auto Top Up Settings - PAYGO Options"] = {eVar1:"Top-Up",events:"event2"};
$vmpt["My Account-Prepaid: Account Services: Swap Phone"] = {eVar1:"Phone Swap",events:"event2"};
$vmpt["My Account-Prepaid: Account Services: Data and Message-Add ISF Error"] = {prop19:"Top-Up - Add ISF Error"};
$vmpt["My Account-Prepaid: Account Services: MIN Swap-Error Result"] = {prop19:"MIN Swap-Error Result"};*/

$vmpt["My Account-Prepaid: Account Services: Change Phone Number-Start"] = {
		eVar24:"change phone number",
		prop7:"change phone number",
		prop8:"change phone number: step 1 > start",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Services: Change Phone Number-Confirm"] = {
		prop8:"change phone number: step 2 > confirm",
		events:"event17"
	};

$vmpt["My Account-Prepaid: Account Activity: Auto Top Up Settings - RO Options"] = {
		eVar24:"top-up",
		prop7:"top-up",
		prop8:"top-up: step 1 > Auto Top Up Settings - RO Options",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Activity: Auto Top Up Settings - PAYGO Options"] = {
		eVar24:"top-up",
		prop7:"top-up",
		prop8:"top-up: step 1 > Auto Top Up Settings - PAYGO Options",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Services: Swap Phone"] = {
		eVar24:"phone swap",
		prop7:"phone swap",
		prop8:"phone swap: step 1",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Account Services: Data and Message-Add ISF Error"] = {
		eVar30:"Top-Up - Add ISF Error",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Account Services: MIN Swap-Error Result"] = {
		eVar30:"MIN Swap-Error Result",
		events:"event21"
	};

$vmpt["My Account-Prepaid: Mobile Hotspot: Manage Mobile Hotspot"] = {
		prop7:'My Account Mobile Hotspot',
		eVar24:"My Account Mobile Hotspot",
		events:"event16"
	};
$vmpt["My Account-Prepaid: International Offers: Manage International Offers"] = {
		prop7:'My Account International Offers',
		eVar24:"My Account International Offers",
		events:"event16"
	};

/*$vmpt["My Account-Prepaid: Plan Migration: Start Overview"] = {eVar1:"Change Plan",events:"event2"};
$vmpt["My Account-Prepaid: Plan Migration: Failure"] = {prop19:"Migration-Pending Failure"};
$vmpt["My Account-Prepaid: Plan Migration: Credit Card Failure"] = {prop19:"Migration-Credit Card Failure"};
$vmpt["My Account-Prepaid: Plan Migration: Wait Fail"] = {prop19:"Migration-Minimum Wait Time Failure"};
$vmpt["My Account-Prepaid: Plan Migration: Credit Card Failure Attempt"] = {prop19:"Migration-Credit Card Failure Attempt"};
$vmpt["My Account-Prepaid: Plan Migration: Double"] = {prop19:"Migration-Double-Clicked Error"};
$vmpt["My Account-Prepaid: Plan Migration: Error"] = {prop19:"Migration-Error"};
$vmpt["My Account-Prepaid: Plan Migration: Plan Change Success"] = {eVar1:"Change Plan",events:"event3,event8"};*/

// Prepaid Account - Plan Migration Flow
$vmpt["My Account-Prepaid: Plan Migration: Start Overview"] = {
		eVar24:"change plan",
		prop7:"change plan",
		prop8:"change plan: step 1 > start overview",
		events:"event16"
	};
$vmpt["My Account-Prepaid: Plan Migration: Plan Change Success"] = {
		prop8:"change plan: step 2 > plan change success",
		events:"event17"
	};
$vmpt["My Account-Prepaid: Plan Migration: Failure"] = {
		eVar30:"change plan: migration-pending failure",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Plan Migration: Credit Card Failure"] = {
		eVar30:"change plan: migration-credit card failure",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Plan Migration: Wait Fail"] = {
		eVar30:"change plan: migration-minimum wait time failure",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Plan Migration: Credit Card Failure Attempt"] = {
		eVar30:"change plan: migration-credit card failure attempt",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Plan Migration: Double"] = {
		eVar30:"change plan: migration-double-clicked error",
		events:"event21"
	};
$vmpt["My Account-Prepaid: Plan Migration: Error"] = {
		eVar30:"change plan: migration-error",
		events:"event21"
	};

//ADD THIS
// Report event to Omniture
function shareEventHandler(evt) {
   //  alert(evt.type);
    // alert(evt.data.service);
    if (evt.type == 'addthis.menu.share') {
      /* s.linkTrackVars='action,events';  
       s.linkTrackEvents='AddThisShareEvents';  
       s.events='AddThisShareEvents';  
       s.action=evt.data.service;   
       s.tl(this,'o', evt.data.service); */ 
       s.events=s.apl(s.events,'event6',',',2); 
        s.eVar10=s.pageName + ": " + evt.data.service;
        s.linkTrackVars+=",eVar10,events";
        s.linkTrackEvents="event6";
         s.tl(this,'o', evt.data.service);
    }
    


}