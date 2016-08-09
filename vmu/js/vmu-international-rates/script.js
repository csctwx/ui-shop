function getQueryVar(qvar)
{
	var qstr = unescape(window.location.search) + '&';
	var val = qstr.replace(new RegExp('.*?[&\\?]' + qvar + '=(.*?)&.*'), "$1");
	return val == qstr ? false : val;
}

$j(document).ready(function()
{
	$j(document).pngFix();

	//Initialize Mega Nav
	navInit();

	// init global free shipping bug
	//initShippingBug();

	var marketingPromo = getQueryVar('pcode');
	
	if (marketingPromo) $j.cookies.set('promo', marketingPromo, { domain:'.virginmobileusa.com' });
	//US vs THEM modal:
	if (document.URL.indexOf("#compare") != -1) { show_compare(); }
	
	// ******** START Top Nav Current Section Indicator
	
	// Shop
	if ($j('.shop_landing').length > 0 ||
		$j('.phonegrid').length > 0 ||
		$j('#bb2g_devices').length > 0 ||
		$j('.accessories').length > 0 ||
		$j('#deals').length > 0 ||
		$j('#phoneDetailsTabbed').length > 0 ||
		$j('#deviceDetailsTabbed').length > 0 ||
		$j('.compareContent').length > 0) $j('#navShop').addClass('currentTab');
	// Plans
	if ($j('.plan_landing').length > 0 ||
		$j('#intl-rates').length > 0 ||
		$j('#planDetailsTabbed').length > 0) $j('#navPlans').addClass('currentTab');
	// Why-Choose-US
	if ($j('#why-choose-us').length > 0) $j('#navWhy').addClass('currentTab');
	// Support
	if ($j('.support').length > 0) $j('#navSupport').addClass('currentTab');
	// ******** END Top Nav Current Section Indicator
	
	//Get Login Status
	checkLoggedIn();
	
	// Set Customer Type
	$j('body').addClass(customerType);

	//Initialize homepage slider if it exists
	if (slideContainer.length > 0) sliderInit();
	
	$j('a.androidPopLink').colorbox({width: 920, height: 667, iframe: true, opacity: 0.8 });
	
	// Alternate Homepage Content
	if ($j('body.page_home').length > 0 && customerType == 'customer')
	{
		$j('.left div.prospectPromo').remove(); 
		$j('.right div.prospectFeature').remove(); 		
		$j('.featuresWrap .left').html(customerPromos);
		$j('.featuresWrap .right').html(customerFeatures);		
	}
	
	if ($j('body.branding_bt #phoneDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		bt_phoneDetailContentInit();
	}
	
	if ($j('body.branding_bt #planDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		bt_planDetailContentInit();
	}
	
	if ($j('body.branding_bb2g #planDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		bb2g_planDetailContentInit();
	}
	
	if ($j('#deviceDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		bb2g_DetailContentInit();
	}
	
	if ($j('body.branding_pl #phoneDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		pl_phoneDetailContentInit();
	}
	
	if ($j('body.branding_pl #planDetailsTabbed').length > 0) 
	{
		contentAJAXTabsInit();
		pl_planDetailContentInit();
	}
	
	if ($j('div#deals #dealsTabbed').length > 0) 
	{
		dealsTabsInit();
	}
	
	if ($j('.coloroptions').length > 0) 
	{
		setupColorOptions();
	}
	
	if ($j('body.cart #cartP1').length > 0) 
	{
		setupCartLanding();
	}
	
	if ($j('body.support').length > 0) 
	{
		$j('#faq_list').setupAccordion();
	}
	
	// Plan Detail - International Rates - Dropdown
	$j('body').on("change", "#irates", function() 
	{
		if ($j(this).val() == "select") 
			$j('#rates_wrap').slideUp();
		else 
		{
			$j('#rates_display').html(_VMU_buildIratesDetailsPage($j(this).val()));
			$j('#rates_wrap').slideDown();
		}
	});
	
	//Print Links
	$j('a.print').on('click', function(evt) 
	{
		evt.preventDefault();
		window.print();
	});
	
	// Intl Rates Page
	if ($j('div#intl-rates').length > 0) 
	{
		$j('#rates_display').html(_VMU_buildIratesDetailsPage($j('select#irates').val()));
		
		$j('div#intl-rates select#irates').change(function() 
		{
			$j('#rates_display').html(_VMU_buildIratesDetailsPage($j(this).val()));
		});
	}	
	
	// FAQ's Accordion & Pagination
	if ($j('#faqList').length > 0) 
	{
		$j('#faqList').setupAccordion();	
		setNumberOfPages();
		paginate(1);

		$j('#pagination').change(function() 
		{
			var startRow = (10*($j('#pagination').val()-1))+1
			paginate(startRow);
		});
	}
	
	// Tool Tips
	setupToolTips();	
	
	// Aside Boxes - Click to Tab
	$j('body').on('click','#aboxBeyondTalk', function() 
	{
		window.location.hash = 'plan';
		$j(window).trigger('hashchange');
	});

	$j('body').on('click','#aboxReviews', function() 
	{
		window.location.hash = 'reviews';
		$j(window).trigger('hashchange');
	});
	
	$j('body').on('click', '#consumer_response', function() 
	{
		window.location.hash = 'reviews';
		$j(window).trigger('hashchange');
	});	
	
	// Colorbox Calls delegated to play nice with AJAX tabs
	$j("body")
		.on("click", 'a.comesWithPopLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 960, height: 608, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on("click", 'div.zoom a', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 960, height: 608, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on("click", 'a.btn_zoom', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 960, height: 608, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on("click", 'a.splashPopOverLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 967, height: 583, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on("click", 'a.splashDemoLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({innerWidth: 960, innerHeight: 635, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
			$j('#cboxClose').hide();
		})
		.on("click", 'a.androidPopLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 920, height: 667, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on("click", 'a.comesWithLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width: 960, height: 608, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on('click', 'div.comesWithCBox', function(e)
		{
			e.preventDefault();
			$j.colorbox({href:"/includes/common/pop-overs/comes-with.html", width: 960, height: 608, iframe: true, opacity: 0.8 });
		})
		.on('click', 'div.comesWithCBoxiPhone', function(e)
		{
			e.preventDefault();
			$j.colorbox({href:"/includes/common/pop-overs/comes-with-iphone.html", width: 960, height: 608, iframe: true, opacity: 0.8 });
		})
		.on('click', 'a#slider-iphone-learn_more', function(e)
		{
			e.preventDefault();
			$j.fancybox({
				'autoScale':'false',
				'width' : 940,
				'height' : 432,
				'transistionIn':'none',
				'transitionOut':'none',
				'type':'iframe',
				'href':'http://channelpartners.apple.com/partners/iphone-4s/story/'
			});
			//$j.colorbox({innerWidth: 960, innerHeight: 450, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on('click', 'a.appleCarePop', function(e) 
		{
			e.preventDefault();
			$j.colorbox({innerWidth: 900, innerHeight: 700, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
		})
		.on('click', 'a.my_account_overlay', function(e) 
		{
			e.preventDefault();
			$j.colorbox({width:"805px", height: "500px", iframe:true, scrolling: false, href: $j(this).attr("href") });
		})
		.on('click', 'a.howToLink', function(e) 
		{
			e.preventDefault();
			$j.colorbox({innerWidth:"885px", innerHeight: "510px", iframe:true, scrolling: false, href: $j(this).attr("href") });
		});
	
	// UL Environment Scores Modal Link
	$j("body").on('click', 'a#ul-env-view', function(e)
	{
		e.preventDefault();
		$j.colorbox({href:"#ul-env-score-pane", width: 960, inline:true, scrolling:false, opacity: 0.8 });
	});
	
	if (window.location.hash.length != 0)
	{
		var hashid = window.location.hash.split("#")[1];
		if (hashid === "ule")
			$j('body a#ul-env-view').trigger('click');
	}
	
	// Home Page Color Boxes
	$j('div#vmuHome').on('click', 'a.colorbox', function(e) 
	{
		e.preventDefault();
		$j.colorbox({innerWidth: 700, innerHeight: 460, iframe: true, opacity: 0.8, href: $j(this).attr("href") });
	});
	
	// US V Them Link
	$j("body").on('click', '.usVThemLink', function(e) 
	{
		e.preventDefault();
		$j.colorbox({href:"/competitor-comparison.html", innerWidth: 960, innerHeight: 1400, iframe: true, opacity: 0.8 });
	});
	
	$j("h3#promo4").on('click', 'a.cmpPlans2', function(e)
	{
		e.preventDefault();
		$j.colorbox(
		{
			innerWidth: 869, 
			innerHeight: 678, 
			iframe: true, 
			opacity: 0.8, 
			href: $j(this).attr("href"),
			onOpen:function()
			{
				$j("#colorbox").addClass("planCompare");
			},
			onClosed:function()
			{
				$j("#colorbox").removeClass("planCompare");
			}
		});
	});
	
	$j("div#comparePlans").on('click', 'a.cmpPlans2', function(e)
	{
		e.preventDefault();
		$j.colorbox(
		{
			innerWidth: 869, 
			innerHeight: 678, 
			iframe: true, 
			opacity: 0.8, 
			href: $j(this).attr("href"),
			onOpen:function()
			{
				$j("#colorbox").addClass("planCompare");
			},
			onClosed:function()
			{
				$j("#colorbox").removeClass("planCompare");
			}
		});
	});
	
	$j("h2#plansTxtLink").on('click', 'a.cmpPlans2', function(e)
	{
		e.preventDefault();
		$j.colorbox(
		{
			innerWidth: 869, 
			innerHeight: 678, 
			iframe: true, 
			opacity: 0.8, 
			href: $j(this).attr("href"),
			onOpen:function()
			{
				$j("#colorbox").addClass("planCompare");
			},
			onClosed:function()
			{
				$j("#colorbox").removeClass("planCompare");
			}
		});
	});
	
	$j("body.plan_landing").on("click", "a.a_text", function(e) 
	{
		e.preventDefault();
		$j.colorbox(
		{
			innerWidth: 869, 
			innerHeight: 678, 
			iframe: true, 
			opacity: 0.8, 
			href: $j(this).attr("href"),
			onOpen:function()
			{
				$j("#colorbox").addClass("planCompare");
			},
			onClosed:function()
			{
				$j("#colorbox").removeClass("planCompare");
			}
		});
	});
	
	$j("div#sitemap").on('click', 'a.cmpPlans', function(e)
	{
		e.preventDefault();
		$j.colorbox(
		{
			innerWidth: 869, 
			innerHeight: 678, 
			iframe: true, 
			opacity: 0.8, 
			href: $j(this).attr("href"),
			onOpen:function()
			{
				$j("#colorbox").addClass("planCompare");
			},
			onClosed:function()
			{
				$j("#colorbox").removeClass("planCompare");
			}
		});
	});
	
	// Phone Detail - Top Features - Show/Hide Additional Features
	$j('body').on('click', 'div.featuresExpand a', function(evt) 
	{
		evt.preventDefault();
		if ($j(this).hasClass('expanded')) 
		{
			$j(this).parent().parent().children('div.moreFeaturesWrap').slideUp(function() 
			{
				$j('div.featuresExpand a').removeClass('expanded').text('// VIEW FULL FEATURE LIST');
			});
		} 
		else 
		{
			$j(this).parent().parent().children('div.moreFeaturesWrap').slideDown(function() 
			{
				$j('div.featuresExpand a').addClass('expanded').text('// HIDE FULL FEATURE LIST');
			});
		}
	});
	
	$j('div#planDetailsTabbed').on('click', 'ul.color_nav a', function(evt) 
	{
		evt.preventDefault();
		var selectedColor = $j(this).attr('data-color');
		var selectedTarget = $j(this).attr('data-target');
		
		$j('div#'+selectedTarget+' div.image').removeClass('active');
		$j('div#'+selectedTarget+' div.image.'+selectedColor).addClass('active');
		$j('div#'+selectedTarget+' div.pricing').removeClass('active');
		$j('div#'+selectedTarget+' div.pricing.'+selectedColor).addClass('active');
	});	
	
	/* Accessory by phones - counts */
	if ($j('div#phoneChooser').length > 0) 
	{		
		// Set Initial Counts
		$j('span.countShowing').html($j("ul.manulist > li:visible").size());
		$j('span.countTotal').html($j("ul.manulist > li").size());		
		$j('.manufacturers').change(function()
		{
	    	var selected = $j(this).find(':selected');
			
	    	$j('ul.manulist li').hide();
			
			if ($j(this).val() == 'all') 
			{
				$j('.scroll-content ul li').show();
			} 
			else 
			{
	    		$j('.'+selected.val()).show();
	    		$j('.optionvalue').html(selected.html()).
	       		attr('class', 'optionvalue '+selected.val());
			}
			
			s.eVar31='manufacturer: ' + selected.val();
			s.events=s.apl(s.events,'event22',',',2);
			s.linkTrackVars='eVar31, events';
			s.linkTrackEvents='event22';
			s.tl(true,'o','accessory pull down');			
			$j('span.countShowing').html($j("ul.manulist > li:visible").size());
		});
	}
	
	//Propagate cart number
	cartFill();
});

// Check Customer Type
var customerType = ($j.cookie('u_cst')) ? 'customer' : 'prospect';

/*########################### BEGIN VMU TOP NAV #################################*/
var navShopBtn = $j('#navShop');
var navPlanBtn = $j('#navPlans');
var navSupportBtn = $j('#navSupport');
var mContainer = $j('#megaMenu');
var shpContent = $j('#shopMenu');
var plnContent = $j('#plansMenu');
var supContent = $j('#supportMenu');
var hoverOnDelay = 500;
var hoverOutDelay = 250;
var menuOpen = menuHovered = navShopHovered = navPlansHovered =  navSupportHovered = false;
var activeTab;
var isHoliday = false;

function navShopDelayOpen() { setTimeout(navShopOpen,hoverOnDelay); }
function navPlansDelayOpen() { setTimeout(navPlansOpen,hoverOnDelay); }
function navSupportDelayOpen() { setTimeout(navSupportOpen,hoverOnDelay); }
function navDelayClose() { setTimeout(navClose,hoverOutDelay); }

function navShopOpen() 
{
	if (navShopHovered || navPlansHovered || navSupportHovered) 
	{
		menuOpen ? shpContent.fadeIn('fast') : shpContent.show();
		menuOpen ? plnContent.fadeOut('fast') : plnContent.hide();
		menuOpen ? supContent.fadeOut('fast') : supContent.hide();
		mContainer.stop().slideDown(function() 
		{
			menuOpen = true;
			// Fix for partially opened menu freezes
			if (mContainer.css('display') == 'block')
				mContainer.animate({height: 254});
		});		
		$j('#vmuTop .mainNav a').removeClass('active');
		activeTab.addClass('active');
	}
}

function navPlansOpen() 
{
	if (navShopHovered || navPlansHovered || navSupportHovered) 
	{
		menuOpen ? shpContent.fadeOut('fast') : shpContent.hide();
		menuOpen ? plnContent.fadeIn('fast') : plnContent.show();
		menuOpen ? supContent.fadeOut('fast') : supContent.hide();
		$j('#megaMenu:animated').stop();
		mContainer.slideDown(function() 
		{
			menuOpen = true;
			// Fix for partially opened menu freezes
			if (mContainer.css('display') == 'block')
				mContainer.animate({height: 254});
		});		
		$j('#vmuTop .mainNav a').removeClass('active');
		activeTab.addClass('active');
	}
}

function navSupportOpen() 
{
	if (navShopHovered || navPlansHovered || navSupportHovered) 
	{
		menuOpen ? shpContent.fadeOut('fast') : shpContent.hide();
		menuOpen ? plnContent.fadeOut('fast') : plnContent.hide();
		menuOpen ? supContent.fadeIn('fast') : supContent.show();
		$j('#megaMenu:animated').stop();
		mContainer.slideDown(function() 
		{
			menuOpen = true;
			// Fix for partially opened menu freezes
			if (mContainer.css('display') == 'block')
				mContainer.animate({height: 254});
		});		
		$j('#vmuTop .mainNav a').removeClass('active');
		activeTab.addClass('active');
	}
}

function navClose() 
{
	if (!menuHovered && !navShopHovered && !navPlansHovered && !navSupportHovered) 
	{
		mContainer.stop().slideUp(function()
		{
			menuOpen = false;
		});
		
		$j('#vmuTop .mainNav a').removeClass('active');
	}
}

function navInit() 
{
	// Navigation Shop Button Hovering
	navShopBtn.hover(
		function() 
		{
			navShopHovered = true;
			activeTab = $j(this);
			menuOpen ? navShopOpen() : navShopDelayOpen();
		},
		function() 
		{
			navShopHovered = false;
			navDelayClose();
		});

	// Navigation Plan Button Hovering
	navPlanBtn.hover(
		function() 
		{
			navPlansHovered = true;
			activeTab = $j(this);
			menuOpen ? navPlansOpen() : navPlansDelayOpen();
		},
		function() 
		{
			navPlansHovered = false;
			navDelayClose();
		});

	// Navigation Support Button Hovering
	navSupportBtn.hover(
		function() 
		{
			navSupportHovered = true;
			activeTab = $j(this);
			menuOpen ? navSupportOpen() : navSupportDelayOpen();
		},
		function() 
		{
			navSupportHovered = false;
			navDelayClose();
		});

	// Navigation Mega Menu Button Hovering
	mContainer.hover(
		function()
		{
			menuHovered = true;
		},
		function()
		{
			menuHovered = false;
			navDelayClose();
		});

	$j('#navWhy').mouseenter(navClose);
	//$j('#navSupport').mouseenter(navClose);
	$j('#navCart').mouseenter(navClose);
}
/*########################### END VMU TOP NAV #################################*/

/*########################### BEGIN VMU CART ICON #################################*/
function cartFill() 
{	
	var cart_string = $j.cookies.get('virgin_cart');

	if (cart_string == null || cart_string == "") return;
	
	var cart_array = cart_string;
	var html = []
	var totalPrice = $j.cookies.get('virgin_cart_total');
	var totalItems = cart_array.length;
	var totalQty = 0;
	
	if (totalItems > 0) { $j('#navCart').addClass('full'); }
	
	$j('#miniCart').hover(function(e)
	{
		//var clkTrack = $j('#navCart').attr('onclick');
		if (totalItems >= 3)
		{
			$j(this).addClass('cartOpen').find('.cartItems').slideDown('fast', function()
			{
				$j('.scroll').tinyscrollbar({ sizethumb: 130 });	
			});
		}
		else
		{
			$j('.scroll').addClass('disable');
			$j(this).addClass('cartOpen').find('.cartItems').slideDown('fast');
		}
		
	},function() 
	{
		$j(this).removeClass('cartOpen').find('.cartItems').hide();
		//$j('#navCart').off('click', function(e) { e.preventDefault(); });
	});

	for (i = 0; i < totalItems; i++) 
	{		
		var itemarray = cart_array[i].toString().split(',');
		totalQty = totalQty + parseInt(itemarray[4]);
		// console.log(totalQty);
		
		if (itemarray[0] == 'phone') 
		{
			var itemImg = '<img src="/_img/_phones/' + itemarray[2] + '/minicart.png" />';
		}
		else 
		{
			var itemImg = '<img src="/_img/accessories/PREPAID_ACCESSORIES/thumb-' + itemarray[2] + '.png" width="47" height="47" />';
		}
		
		if (parseInt(itemarray[4]) != 1)
		{
			var itemTotal = Number(parseFloat(itemarray[3].replace("$",""))*parseInt(itemarray[4])).toFixed(2);
			html.push('<li><div class="itemThumb">' + itemImg + '</div>'
				+ '<div class="itemInfo"><h5>' + itemarray[1] + '</h5>'
				+ '<div class="itemQty">Qty: <span>' + itemarray[4] + '</span></div><a class="itemAction" href="https://www.virginmobileusa.com/#!/shop/checkout/?intid=MS:MiniCart:Remove">// Edit or Remove</a></div>'
				+ '<div class="itemPrices"><span class="itemPrice">$' + itemTotal + '</span><span class="unitPrice">' + itemarray[3] + ' each</span></div></li>');
		} 
		else 
		{
			html.push('<li><div class="itemThumb">' + itemImg + '</div>'
				+ '<div class="itemInfo"><h5>' + itemarray[1] + '</h5>'
				+ '<div class="itemQty">Qty: <span>' + itemarray[4] + '</span></div><a class="itemAction" href="https://www.virginmobileusa.com/#!/shop/checkout/?intid=MS:MiniCart:Remove">// Edit or Remove</a></div>'
				+ '<div class="itemPrices"><span class="itemPrice">' + itemarray[3] + '</span></div></li>');
		}
	}
	
	if (totalItems > 0)
	{
		$j('#navCart').css({'width': '126px', 'paddingLeft': '30px', 'backgroundImage': 'none'})
		$j('#navCart').prepend('<span>' + totalQty + '</span>');
	}
		
	$j('.cartItems ul.items').html(html.reverse().join(""));
	$j('#minicart_price').html(totalPrice);
}
/*########################### END VMU CART ICON #################################*/

/*########################### BEGIN VMU HOME SLIDER #################################*/
var slideControls = $j('#sliderControl');
var slideContainer = $j('#slider');
var docWidth = $j(window).width();
var slideWidth = 963;
var boltIndent = 432;
var boltIndentLeft = -580;
var boltIndentRight = 580;
var sliderGutter = 0;
var slides = new Array();
var animations = new Array();
var boltSlides = new Array();
var boltSlidesLeft = new Array();
var boltSlidesRight = new Array();
var boltSlidesInSpeed = new Array();
var boltSlidesLeftInSpeed = new Array();
var boltSlidesRightInSpeed = new Array();
var boltSlidesOutSpeed = new Array();
var boltSlidesLeftOutSpeed = new Array();
var boltSlidesRightOutSpeed = new Array();
var normalSlidesInSpeed = new Array();
var normalSlidesOutSpeed = new Array();
var currentSlide = 0;
var slideInSpeed = 500;
var slideInSpeedLeft = 500;
var slideInSpeedRight = 500;
var slideOutSpeed = 500;
var slideOutSpeedLeft = 500;
var slideOutSpeedRight = 500;
var canSlide = true;
var slideshowTimer;
var slideshowSpeed = 6000;

function sliderInit() 
{	
	// Load in slides from home.js
	if (customerType == 'customer') 
	{
		$j('div#slider div.prospectSlide').remove();
		
		for(slide in customerSlides) 
			$j('div#slider').append(customerSlides[slide]);
	}

	// Store references to each slide & accompaning bolt slides
	var count = 0;
	
	jQuery.each($j('#slider .slide'), function() 
	{
		slides.push($j(this));
		animations.push($j(this).attr('data-animation'));
		$j(this).css(animations[count], docWidth + "px");
		
		// Store normal 'fade' slides
		normalSlidesInSpeed[count] = 
			typeof($j(this).attr('data-inspeed')) != "undefined" ? parseInt($j(this).attr('data-inspeed'), 10) : slideInSpeed;
		normalSlidesOutSpeed[count] = 
			typeof($j(this).attr('data-outspeed')) != "undefined" ? parseInt($j(this).attr('data-outspeed'), 10) : slideOutSpeed;
		
		// Solitary Bolt Slide
		if ($j('#bolt-' + $j(this).attr('id')).length > 0)
		{
			var normalBolt = $j('#bolt-' + $j(this).attr('id'));
			
			boltSlides[count] = normalBolt;
			boltSlidesInSpeed[count] = 
				typeof(normalBolt.attr('data-inspeed')) != "undefined" ? parseInt(normalBolt.attr('data-inspeed'), 10) : slideInSpeed;
			boltSlidesOutSpeed[count] = 
				typeof(normalBolt.attr('data-outspeed')) != "undefined" ? parseInt(normalBolt.attr('data-outspeed'), 10) : slideOutSpeed;
		}
			
		// Left Bolt Slide
		if ($j('#bolt-' + $j(this).attr('id') + 'L').length > 0)
		{
			var leftBolt = $j('#bolt-' + $j(this).attr('id') + 'L');
			
			boltSlidesLeft[count] = leftBolt;
			boltSlidesLeftInSpeed[count] = 
				typeof(leftBolt.attr('data-inspeed')) != "undefined" ? parseInt(leftBolt.attr('data-inspeed'), 10) : slideInSpeedLeft;
			boltSlidesLeftOutSpeed[count] = 
				typeof(leftBolt.attr('data-outspeed')) != "undefined" ? parseInt(leftBolt.attr('data-outspeed'), 10) : slideOutSpeedLeft;
		}
			
		// Right Bolt Slide
		if ($j('#bolt-' + $j(this).attr('id') + 'R').length > 0)
		{
			var rightBolt = $j('#bolt-' + $j(this).attr('id') + 'R');
			
			boltSlidesRight[count] = rightBolt;
			boltSlidesRightInSpeed[count] = 
				typeof(rightBolt.attr('data-inspeed')) != "undefined" ? parseInt(rightBolt.attr('data-inspeed'), 10) : slideInSpeedRight;
			boltSlidesRightOutSpeed[count] = 
				typeof(rightBolt.attr('data-outspeed')) != "undefined" ? parseInt(rightBolt.attr('data-outspeed'), 10) : slideOutSpeedRight;
		}
		
		count++;
	});
	
	// Build Slider Controls for each Slide
	for(i = 1; i <= slides.length; i++) 
	{
		var slideBtn = "";
		if (customerType == 'customer')
		{
			var slideBtn = $j('<a data-slide_id="' + i + '" id="sliderControlCustomer_' + i + '" href="#" class="page' + (i == 1 ? ' current first' : '') + '"><span></span>' + i + '</a>');
		}
		else
		{
			var slideBtn = $j('<a data-slide_id="' + i + '" id="sliderControl_' + i + '" href="#" class="page' + (i == 1 ? ' current first' : '') + '"><span></span>' + i + '</a>');
		}
		
		slideControls.append(slideBtn);
		slideBtn.click(function(evt)
		{
			evt.preventDefault();
			transitionSlides(currentSlide, parseInt($j(this).attr('data-slide_id')) - 1);
			stopSlideshow();
			slideControls.children('a.pause').hide();
			slideControls.children('a.play').show();
		});
	}

	// Add Play/Pause Buttons
	var pauseBtn = $j('<a href="#" class="pause">Pause</a>');
	var playBtn = $j('<a href="#" class="play">Play</a>');
	slideControls.append(playBtn);
	slideControls.append(pauseBtn);
	
	// Position Controls and setup sizing vars now
	// and when the window is resized
	positionSliderComponents();
	$j(window).resize(function() { positionSliderComponents(); });
	
	// Play Button Pressed
	slideControls.children('a.play').click(function(e)
	{
		e.preventDefault();
		slideControls.children('a.pause').show();
		slideControls.children('a.play').hide();
		playSlideshow();
	});

	// Pause Button Pressed
	slideControls.children('a.pause').click(function(e)
	{
		e.preventDefault();
		slideControls.children('a.pause').hide();
		slideControls.children('a.play').show();
		stopSlideshow();
	});
	
	// The following code intelligently pauses the slide animation when the CTA button is hovered over
	var sliderT = null;
	
	$j("a.slider_cta, a.slider-overlay").hoverIntent(
	function(e)
	{
		if (sliderT != null) clearTimeout(sliderT);
		if (slideControls.children('a.pause:visible').length > 0) stopSlideshow();
	},
	function(e)
	{
		if (slideControls.children('a.pause:visible').length > 0) 
		{
			sliderT = window.setTimeout( 
			    function() 
				{  
					// Start the slideshow
					playSlideshow();
			    },  
			    3000  
			);
		}
	});
	
	$j('a.bolt_launch_btn').click(function(evt)
	{
		evt.preventDefault();
		console.log('bolt expander clicked');
	});

	window.setTimeout( 
	    function() 
		{  
	        // Animate first slide in
			transitionSlides(currentSlide, currentSlide);
			// Start the slideshow
			startSlideshow();
	    },  
	    1000  
	);
}

function transitionSlides(slideOut, slideIn)
{
	if (canSlide) 
	{
		var animOutArgs = {};
		var animInArgs = {};
		
		canSlide = false;
		animOutArgs[animations[slideOut]] = docWidth;
		animOutArgs['opacity'] = 0;
		animInArgs[animations[slideIn]] = sliderGutter;
		animInArgs['opacity'] = 1;

		if (slideOut != slideIn) 
		{
			slides[slideOut].animate(animOutArgs, slideOutSpeed, function() 
			{
				$j(this).hide().removeClass('triggerAnimation');
				slides[slideIn].show().animate(
					animInArgs, 
					normalSlidesInSpeed[slideIn], 
					function() 
					{
						currentSlide = slideIn;
						canSlide = true;
						setTimeout(function() {	$j(this).addClass('triggerAnimation'); }, 3000)
					});
				
				// Check for bolt slide
				if (typeof(boltSlides[slideIn]) != "undefined") 
				{
					boltSlides[slideIn]
						.show()
						.addClass('triggerAnimation')
						.animate({'right': 0}, boltSlidesInSpeed[slideIn], function() {});
				}
				
				// Check for bolt left slide
				if (typeof(boltSlidesLeft[slideIn]) != "undefined") 
				{
					boltSlidesLeft[slideIn]
						.show()
						.addClass('triggerAnimation')
						.animate({'left': 0}, boltSlidesLeftInSpeed[slideIn], function() {});
				}

				// Check for bolt right slide
				if (typeof(boltSlidesRight[slideIn]) != "undefined") 
				{
					boltSlidesRight[slideIn]
						.show()
						.addClass('triggerAnimation')
						.animate({'right': 0}, boltSlidesRightInSpeed[slideIn], function() {});
				}
			});
			
			// Check for bolt slide
			if (typeof(boltSlides[slideOut]) != "undefined") 
			{
				boltSlides[slideOut]
					.animate(
						{'right': (-1 * (boltIndent + sliderGutter))}, 
						boltSlidesOutSpeed[slideOut], 
						function() { $j(this).hide().removeClass('triggerAnimation'); });
			}
			
			// Check for left bolt slide
			if (typeof(boltSlidesLeft[slideOut]) != "undefined") 
			{
				boltSlidesLeft[slideOut]
					.animate(
						{'left': ((boltIndentLeft - sliderGutter))}, 
						boltSlidesLeftOutSpeed[slideOut], 
						function() { $j(this).hide().removeClass('triggerAnimation'); });
			}

			// Check for right bolt slide
			if (typeof(boltSlidesRight[slideOut]) != "undefined") 
			{
				boltSlidesRight[slideOut]
					.animate(
						{'right': (-1 * (boltIndentRight + sliderGutter))}, 
						boltSlidesRightOutSpeed[slideOut], 
						function() { $j(this).hide().removeClass('triggerAnimation'); });
			}
		}
		else 
		{
			// Only A Slide In
			slides[slideIn].show().addClass('triggerAnimation').animate(
				animInArgs, 
				normalSlidesInSpeed[slideIn], 
				function() { canSlide = true; });
			
			// Check for bolt slide
			if (typeof(boltSlides[slideIn]) != "undefined") 
			{
				boltSlides[slideIn]
					.show()
					.addClass('triggerAnimation')
					.animate({'right': 0}, boltSlidesInSpeed[slideIn], function() {});
			}
			
			// Check for left bolt slide
			if (typeof(boltSlidesLeft[slideIn]) != "undefined") 
			{
				boltSlidesLeft[slideIn]
					.show()
					.addClass('triggerAnimation')
					.animate({'left': 0}, boltSlidesLeftInSpeed[slideIn], function() {});
			}

			// Check for right bolt slide
			if (typeof(boltSlidesRight[slideIn]) != "undefined") 
			{
				boltSlidesRight[slideIn]
					.show()
					.addClass('triggerAnimation')
					.animate({'right': 0}, boltSlidesRightInSpeed[slideIn], function() {});
			}
		}
		
		// Adjust the active button on the controls
		slideControls.children().removeClass('current');
		slideControls.children("a:nth-child(" + (slideIn + 1) + ")").addClass('current');
	}
}

function positionSliderComponents() 
{
	docWidth = $j(window).width();
	documentWidth = $j(document).width();
	sliderGutter = (docWidth > slideWidth ? (docWidth - slideWidth) / 2 : 3);
	slideContainer.width(docWidth > slideWidth ? docWidth : slideWidth);
	
	// Position Controls
	slideControls.css('left', sliderGutter + "px");
	
	// Size Slides
	jQuery.each($j('#slider .slide'), function() 
	{
		if ($j(this).attr('data-animation') == "none") 
		{
			$j(this).width(documentWidth);
		} 
		else 
		{
			$j(this).width(docWidth > slideWidth ? slideWidth + ((docWidth - slideWidth) / 2) + 10 : slideWidth + 10);
		}
	});
	
	$j('#slider .bolt_slide').width(boltIndent + sliderGutter);
	
	// Position Slides
	$j('#slider .slide').filter(":hidden").each(function() 
	{
		var cssAttr = $j(this).attr('data-animation');
		
		if (cssAttr != 'none') 
		{
			$j(this).css(cssAttr, docWidth).css('opacity', 0);
		} 
		else 
		{
			$j(this).css({right : "0px", width : "100%", opacity: "0"});
		}	
	});
	$j('#slider .slide').filter(":visible").each(function() 
	{
		var cssAttr = $j(this).attr('data-animation');
		
		$j(this).css(cssAttr, (docWidth > slideWidth ? sliderGutter+"px" : "0px")).css('opacity', 1);
	});
	$j('#slider .bolt_slide').filter(":hidden").css('right', (-1 * (boltIndent + sliderGutter)) + 'px');
	$j('#slider .bolt_slideL').filter(":hidden").css('left', ((boltIndentLeft - sliderGutter)) + 'px');
	$j('#slider .bolt_slideR').filter(":hidden").css('right', (-1 * (boltIndentRight + sliderGutter)) + 'px');
	$j('#slider .bolt_slide').filter(":visible").css('right', "0px");
	$j('#slider .bolt_slideL').filter(":visible").css('left', "0px");
	$j('#slider .bolt_slideR').filter(":visible").css('right', "0px");
}

function playSlideshow() 
{
	var nextSlide = currentSlide + 1;
	
	if (nextSlide > (slides.length - 1)) nextSlide = 0;
	
	transitionSlides(currentSlide, nextSlide);
	slideshowTimer = setTimeout(function() { playSlideshow(); }, slideshowSpeed);
} 

function startSlideshow() 
{
	slideshowTimer = setTimeout(function() { playSlideshow(); }, slideshowSpeed);
	slideControls.children('a.pause').show();
	slideControls.children('a.play').hide();
}

function stopSlideshow() 
{
	clearTimeout(slideshowTimer);
}
/*########################### END VMU HOME SLIDER #################################*/

/*########################### BEGIN PAGE CONTENT TABS #############################*/
function dealsTabsInit()
{
	var dealsCount = $j('a.dealLink').length - $j('a.dealLink.nodisplay').length;
	var iphoneDealsCount = $j('a.iphoneDeal').length - $j('a.iphoneDeal.nodisplay').length;
	var btDealsCount = $j('a.beyondtalkDeal').length - $j('a.beyondtalkDeal.nodisplay').length;
	var bb2gDealsCount = $j('a.broadbandDeal').length - $j('a.broadbandDeal.nodisplay').length;
	var plDealsCount = $j('a.payloDeal').length - $j('a.payloDeal.nodisplay').length;
	
	// Show No Deals Message if there are no deals
	if (dealsCount <= 0)
	{
		$j('beyondTalkNoDeals').removeClass('hidden');
		$j('.beyondTalkNoDeals').fadeIn('slow'); 
		// Note: if we want a custom mssg for absolutely no deals placements
		// we can just add a 5th mssg in deals.html and set a unique class
		// name to be used int he above fadeIn.
	}
	
	$j('#tabBar').on('click', 'a', function(evt)
	{
		evt.preventDefault();
		
		// Swap Tab Styles
		$j('#tabBar li').removeClass('active');
		$j(this).parent().addClass('active');
	
		var activeTab = $j(this).attr('id');
		
		if (activeTab == 'allTab')
		{
			$j('.msg:visible').not('.beyondTalkNoDeals').hide();
			
			if (dealsCount == 0) 
				$j('.beyondTalkNoDeals').fadeIn('slow');
			else 
				$j('.beyondTalkNoDeals:visible').hide();
			
			$j('a.dealLink').fadeIn('slow');
		}
		else if (activeTab == 'iphoneTab')
		{
			$j('.msg').not('.iphoneNoDeals').hide();
			
			if (iphoneDealsCount == 0) 
				$j('.iphoneNoDeals').fadeIn('slow');
			else 
				$j('.iphoneNoDeals:visible').hide();
			
			$j('a.dealLink:visible').not('.iphoneDeal').hide();
			$j('.iphoneDeal').fadeIn('slow');
		}
		else if (activeTab == 'btTab')
		{
			$j('.msg').not('.beyondTalkNoDeals').hide();
			
			if (btDealsCount == 0) 
				$j('.beyondTalkNoDeals').fadeIn('slow');
			else 
				$j('.beyondTalkNoDeals:visible').hide();
			
			$j('a.dealLink:visible').not('.beyondtalkDeal').hide();
			$j('.beyondtalkDeal').fadeIn('slow');
		}
		else if (activeTab == 'bb2gTab')
		{
			$j('.msg').not('.broadbandNoDeals').hide();
			
			if (bb2gDealsCount == 0) 
				$j('.broadbandNoDeals').fadeIn('slow');
			else 
				$j('.broadbandNoDeals:visible').hide();
			
			$j('a.dealLink:visible').not('.broadbandDeal').hide();
			$j('.broadbandDeal').fadeIn('slow');
		}
		else if (activeTab == 'plTab')
		{
			$j('.msg').not('.payloNoDeals').hide();
			
			if (plDealsCount == 0) 
				$j('.payloNoDeals').fadeIn('slow');
			else 
				$j('.payloNoDeals:visible').hide();
			
			$j('a.dealLink:visible').not('.payloDeal').hide();
			$j('.payloDeal').fadeIn('slow');
		}
		
		return false;
	});
	
	if (window.location.hash.length != 0)
	{
		var hashid = window.location.hash.split("#")[1];
		
		if (hashid === "iphone")
			$j('#tabBar a#iphoneTab').trigger('click');
		else if (hashid === "vm")
			$j('#tabBar a#btTab').trigger('click');
		else if (hashid === "bb2g")
			$j('#tabBar a#bb2gTab').trigger('click');
		else if (hashid === "pl")
			$j('#tabBar a#plTab').trigger('click');
	}
}

function switchTab(newTabId) 
{
	var tabId = '#' + newTabId + 'Tab';
	var contentId = '#' + newTabId;
	
	$j('#tabBar li').removeClass('active');
	$j('#tabBar li a' + tabId).parent().addClass('active');
	$j('#tabbedContent').children().removeClass('active');
	$j('#tabbedContent').children(contentId).addClass('active');
}

/*************************************************************************
*  contentAJAXTabsInit() should replace contentTabsInit() when the XSL
*     has been fully developed with tab content broken out into either 
*     different files or different handlers.
**************************************************************************/
var oldPage = "0";

function contentAJAXTabsInit() 
{	
	$j('#tabBar').on('click', 'a', function(evt)
	{
		evt.preventDefault();
		_this = $j(this);

		// flop titles
		window.location.hash = _this.attr("title");
		
		// Show/Hide Content if browser is not capable of hashtag listening
		if ($j('html').hasClass('no-hashchange')) 
			switchAJAXContent(_this.attr('href'));
	});
	
	$j(window).bind('hashchange', function()
	{
		newHash = window.location.hash.substring(1);
		
		if (newHash) 
		{
			var newLink = newHash;
			switchAJAXContent(newLink);
		} 
		else if (!newHash && oldPage == "1")
		{
			var noHash = window.location.pathname;
			var index = noHash.lastIndexOf("/");
			var newLink = noHash.substr(index).split("/");
			var finalLink = newLink;

			if (newLink[1] == "") 
			{
				index = noHash.split("/");
				finalLink = index[index.length - 2];
			}
			
			switchAJAXContent(finalLink);
		} 
		else 
		{
			oldPage = "1";
		};
	});

	$j(window).trigger('hashchange');
}

function switchAJAXContent(thisLink) 
{	
	// this snippet looks for a hash orphaned after a forward slash, which has been breaking tab navigation, and fixes nav
	var domainlessURL = window.location.pathname + window.location.hash;
	var explodedURL = domainlessURL.split("/");
	var newURL = "";
	
	if (explodedURL[explodedURL.length - 1].charAt(0) == "#") 
	{
		for (i = 0; i < explodedURL.length - 2; i++) 
			newURL += explodedURL[i] + "/";
			
		thisLink = newURL + thisLink;
	}
		
	if (thisLink.charAt(thisLink.length - 1) != "/") 
		thisLink += "/";
	
	$j.get(thisLink, function(data)
	{
		var pageContent = $j("#tabbedContent", data).html();
		$j('#tabbedContent').html(pageContent);
		switchAJAXContent_complete();
	});
	
	// Swap Tab Styles
	$j('#tabBar li').removeClass('active');
	$j("#tabBar").find("li a[title='" + window.location.hash.substring(1) + "']").parent("li").addClass('active');
}

// This is called whenever the ajax tab content switch is completed.
// Any javascript that needs to be called on the new content should
// be called here.
function switchAJAXContent_complete() 
{	
	// re-init US vs THEM Widget
	if ($j('#wo-phone-comparison-widget').length > 0)
	{
		// following function is currently defined in phone-detail-beyond-talk-features.xsl
		wo_init_PhoneComparisonWidget();
	}

	// Active Hot Apps Tab
	if ($j('section#hot_apps').length > 0) 
	{
		$j.each($j('#hot_apps div.appsTab'), function(index, value) 
		{
			$j('#'+value.id).appTabsScroller();
		});
	}
	
	// FAQ's Accordion & Pagination
	if ($j('#faqList').length > 0) 
	{
		$j('#faqList').setupAccordion();
	
		setNumberOfPages();
		paginate(1);

		$j('#pagination').change(function() 
		{
			var startRow = (10 * ($j('#pagination').val() - 1)) + 1;
			paginate(startRow);
		});
	}

	// accessories tab - equal heights
	$j('div.accDisplay div.upper').equalHeights();
	
	// omniture tracking through tabs
	if ($j("body").data("title")) 
	{
		try
		{
			var tid = $j("body").data("title") + " : " + $j('#tabBar li.active a').attr('title');
			
			_$vmst(tid, {eVar23:$j('#tabBar li.active a').attr('title')});
		}
		catch(err) {;}
	}
	
	// Tool Tips
	setupToolTips();
	
	// Recall Bazarre Voice
	bvLoadQA();
	bvLoadRR();
}

function setupToolTips() 
{	
	/* In Stores Tool Tip */
	$j('a#inStores').qtip(
	{
		position: { my: 'top center', at: 'bottom center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' },
		content: { text: $j('#retailersThumbs') }
	});
	
	/* Phone Specs Android (i) Tool Tip */
	$j('a.learnMoreIconSmall').qtip(
	{
		position: { my: 'bottom center', at: 'top center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow ui-tooltip-small' }
	});
	
	/* Plan Legal Pop-Up (Plan Page) */
	$j('a.tooltip-plan').qtip(
	{
		position: { my: 'bottom center', at: 'top center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' },
		content: { text: true }
	});
	
	/* Sidebar Legal Pop-Up */
	$j('a.tooltip-side').qtip({
		position: { my: 'bottom right', at: 'bottom center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' }
	});
	
	$j('a.tooltip-plan-leftalign').qtip(
	{
		position: { my: 'bottom left', at: 'top center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' },
		content: { text: true }
	});
	$j('a.tooltip-hotspot').qtip(
	{
		position: { my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' },
		content: { text: true }
	});
	
	$j('a.tooltip-plan-rightalign').qtip(
	{
		position: { my: 'bottom right', at: 'top center', viewport: $j(window), adjust: {method: 'shift', resize: true} },
		style: { classes: 'qtip-shadow' },
		content: { text: true }
	});
	
	$j('a.tooltip-top-right').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: true},
		position: {my: 'bottom left', at: 'top right', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('a.tooltip-detail-memory').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>Portion of memory used by existing content. A portion of phone memory storage is<br/>dedicated to the operating system and required services.  As a result this portion of<br/>memory is not usable by applications, pictures, videos or other personal data.</span>"},
		position: {my: 'bottom center', at: 'top center', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('a.tooltip-green20').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>ENTER PROMO CODE<br/><span style='color:#d70020'>GREEN20</span> AT CHECKOUT</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('span.tooltip-green20').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>ENTER PROMO CODE<br/><span style='color:#d70020'>GREEN20</span> AT CHECKOUT</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('a.tooltip-levelboxGS3').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>Free Samsung Level Box with purchase of the Samsung Galaxy S&#174; III<br/>from virginmobileusa.com. Purchase must occur on 12/16/2014 and must use<br/>promo code <span style='color:#d70020'>SMSNGLEVEL</span> at checkout.</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('a.tooltip-levelboxGS5').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>Free Samsung Level Box with purchase of the Samsung Galaxy S&#174; 5<br/>from virginmobileusa.com. Purchase must occur on 12/16/2014 and must use<br/>promo code <span style='color:#d70020'>SMSNGLEVEL</span> at checkout.</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('span.tooltip-levelboxGS5').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>Free Samsung Level Box with purchase of the Samsung Galaxy S&#174; 5<br/>from virginmobileusa.com. Purchase must occur on 12/16/2014 and must use<br/>promo code <span style='color:#d70020'>SMSNGLEVEL</span> at checkout.</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
	$j('span.tooltip-levelboxGS3').qtip(
	{
		style: {classes: 'qtip-shadow'}, 
		content: {text: "<span style='color:#000;font:bold 10px Arial;'>Free Samsung Level Box with purchase of the Samsung Galaxy S&#174; III<br/>from virginmobileusa.com. Purchase must occur on 12/16/2014 and must use<br/>promo code <span style='color:#d70020'>SMSNGLEVEL</span> at checkout.</span>"},
		position: {my: 'top left', at: 'bottom middle', viewport: $j(window), adjust: {method: 'shift', resize: true}}
	});
}

/* =============================================================================
	Hot Apps Tab Scroller

	Last Modified: 5/16/2012
   ========================================================================== */
$j.fn.appTabsScroller = function()
{
	var currentScroll = 0;
	var appCount = $j(this).children('div.scrollContainer').children('.appsScroller').children().length;
	var leftArrow = $j(this).children('div.scrollLeft');
	var rightArrow = $j(this).children('div.scrollRight');
	var scrollable = $j(this).children('div.scrollContainer').children('div.appsScroller');
	
	if (appCount > 3) rightArrow.removeClass('inactive');

	rightArrow.on('click', function() 
	{
		if (!$j(this).hasClass('inactive')) 
		{
			currentScroll++;
			
			var scrollAmount = (-205 * currentScroll) + "px";
			
			scrollable.animate(
				{'left': scrollAmount},
				500, 
				'swing',
				function() {}
			);
			leftArrow.removeClass('inactive');
			
			if (currentScroll+3 >= appCount) rightArrow.addClass('inactive');
		}
	});
	
	leftArrow.on('click', function() 
	{
		if (!$j(this).hasClass('inactive')) 
		{
			currentScroll--;
			
			var scrollAmount = (-205*currentScroll)+"px";
			
			scrollable.animate(
				{'left': scrollAmount},
				500, 'swing',
				function() {}
			);
			
			if (currentScroll <= 0) leftArrow.addClass('inactive');
			if (appCount > 3) rightArrow.removeClass('inactive');
		}
	});
}
/*########################### END PAGE CONTENT TABS ###############################*/

/*########################### BEGIN PHONE DETAILS CONTENT ############################*/
function bt_phoneDetailContentInit() 
{	
	/* Phone Detail - Phone Splash - Position Bolt Slider */
	if ($j('div.backgroundFeature').length > 0) 
	{		
		/* Choose Bolt Slider Img */
		var numBolts = isHoliday ? 5 : 10;
		var numBoltsHoliday = isHoliday ? 2 : 10;
		var whichImgNum = Math.floor((Math.random() * numBolts) + 1);	
		var whichImgNumHoliday = Math.floor((Math.random() * numBoltsHoliday) + 1);			
		var original_source = $j("#btSplashImg").attr('src');		
		var imgUrl = '';
		
		if (original_source.indexOf('valentines') != -1)
		{
			imgUrl = '/_img/2015/bt-splash-bolt-valentines.jpg';
			$j('.backgroundFeature').css('background','url("../../_img/2012/bt-details-overview-bg.gif") repeat-x scroll center bottom transparent');
		}
		/*else if (original_source.indexOf('independence') != -1)
		{
			imgUrl = '/_img/2012/homepage/bt-splash-bolt-independence.jpg?062813'; 
			$j('.backgroundFeature').css('background','url("../../_img/2012/bt-details-overview-bg.gif") repeat-x scroll center bottom transparent');
		}*/
		else
		{
			imgUrl = '/_img/2015/bt-splash-bolt-'+ whichImgNum +'.jpg';
			/*imgUrl = '/_img/2014/holiday/bt-splash-bolt-'+ whichImgNumHoliday +'.jpg';*/
			
		}
		
		$j('#btSplashImg').attr('src', imgUrl);
		
		pos_btPhonesBolt();
		$j(window).resize(function()
		{
			pos_btPhonesBolt();
		});
	}

	/* Buyback tab */
	$j("a#buyback-tab").click(function(e)
	{
		e.preventDefault();

		if ($j("div#buyback-pane").is(":hidden"))
		{
			$j("div#buyback-pane").slideDown("fast");
			$j("a#buyback-tab").addClass('is-open');
			
			if ($j("#buyback-pricing").attr("src") == "")
			{
				$j("#buyback-pricing").attr("src", "https://buyback.virginmobileusa.com/vmb/breakout_pricing");
				
				try
				{
					s.prop7 = 'buyback price module';
					s.eVar24 = 'buyback price module';
					s.events = 'event16';					
					s.linkTrackVars='prop7,eVar24,events';
					s.linkTrackEvents='event16';					
					s.tl(true,'o','buyback price module');
				}
				catch(err) {;}
			}
		}
		else
		{
			$j("div#buyback-pane").hide();
			$j("a#buyback-tab").removeClass('is-open');
		}

		return false;
	});
	
	/* Color Nav */
	$j('ul.color_nav').on('click', 'a', function(evt)
	{
		evt.preventDefault();
		
		var selectedColor = $j(this).attr('data-color');
		
		// Switch Indicator
		$j('ul.color_nav a').removeClass('active');
		$j(this).addClass('active');
		
		// Switch Large Phone
		$j('div.phone_large').removeClass('active');
		$j('div.phone_large.'+selectedColor).addClass('active');
		
		// Switch Details
		$j('div.detailsDisplay').removeClass('active');
		$j('div.detailsDisplay.'+selectedColor).addClass('active');
	});	

	// Phone Detail - Hot Apps - Tabbed Content
	$j('body.branding_bt').on('click', 'section#hot_apps header nav a', function(evt) 
	{
		evt.preventDefault();
		$j('section#hot_apps header nav a').removeClass('active');
		$j(this).addClass('active');
	
		var contentId = $j(this).attr('rel');
		
		$j('section#hot_apps div.appsTab').removeClass('active');
		$j('section#hot_apps div#'+contentId).addClass('active');
	});
	
	// Phone Detail - Hot Apps - Tabbed Content - Carousel
	if ($j('section#hot_apps').length > 0) 
	{
		$j.each($j('#hot_apps div.appsTab'), function(index, value) 
		{
			$j('#'+value.id).appTabsScroller();
		});
	}

	// Plan Detail - Coverage Check - clear zip filed on focus
	$j('#coverageZipField').clearOnFocus();
	deviceDetailsCoverageCheck();

	// Plan Detail - Internation Rates - Dropdown
	$j('section#intl_rates select#irates').change(function() 
	{
		if ($j(this).val() == "select") $j('#rates_wrap').slideUp();
		else 
		{
			$j('#rates_display').html(_VMU_buildIratesDetailsPage($j(this).val()));
			$j('#rates_wrap').slideDown();
		}
	});
}

function bt_planDetailContentInit() 
{	
	// Background Feature Position
	if ($j('div.backgroundFeature').length > 0) 
	{
		pos_btPlansBolt();
		$j(window).resize(function()
		{
			pos_btPlansBolt();
		});
	}
	
	// Plan Splash - Coverage Check - Right now this is not functional. 
	//		To see a demonstration type in '12345' for success or anything else for failure
	$j('#coverageCheckSubmit').on('click', function(evt)
	{
		$j('div.covCheck form').fadeOut(function() 
		{
			if ($j('#coverageZipField').val() == '12345') 
				$j('div.covCheckForm div.success').fadeIn();
			else 
				$j('div.covCheckForm div.failure').fadeIn();
		});
		
		return false;
	});


	// Plans Overview - Internation Rates - Dropdown
	$j('section#intl_rates select#irates').change(function() 
	{
		if ($j(this).val() == "select") 
			$j('#rates_wrap').slideUp();
		else 
		{
			$j('#rates_display').html(_VMU_buildIratesDetailsPage($j(this).val()));
			$j('#rates_wrap').slideDown();
		}
	});
	
	// Plan Splash - Coverage Check - clear zip filed on focus
	$j('#coverageZipField').clearOnFocus();	
	$j('section#consumer_response').on('click', function() { switchTab('reviews'); });
}

function bb2g_planDetailContentInit() 
{	
	// Background Feature Position
	if ($j('div.backgroundFeature').length > 0) 
	{
		pos_btPlansBolt();
		$j(window).resize(function()
		{
			pos_btPlansBolt();
		});
	}
	
	// Plan Splash - Coverage Check - Right now this is not functional. 
	//		To see a demonstration type in '12345' for success or anything else for failure
	$j('#coverageCheckSubmit').on('click', function(evt)
	{
		$j('div.covCheck form').fadeOut(function() 
		{
			if ($j('#coverageZipField').val() == '12345') 
				$j('div.covCheckForm div.success').fadeIn();
			else 
				$j('div.covCheckForm div.failure').fadeIn();
		});
		
		return false;
	});

	// Color Box Popups
	//$j('a.comesWithPopLink').colorbox({width: 960, height: 608, iframe: true, opacity: 0.8 });
	//$j('div.zoom a').colorbox({width: 960, height: 608, iframe: true, opacity: 0.8 });
	
	// Plan Splash - Coverage Check - clear zip field on focus
	$j('#coverageZipField').clearOnFocus();	
	
	$j('div#tabbedContent').on('click', 'section#consumer_response', function() 
	{
		window.location.hash = "reviews";
		switchAJAXContent('/mobile-broadband-plans/broadband-2-go/reviews');
	});
}

/* Repositions Phone Splash Background Bolt Feature */
function pos_btPhonesBolt()
{
	docWidth = $j(window).width();
	
	var minBoldWidth = 435;
	var gutter = Math.ceil((docWidth - 963) / 2);
	
	if (gutter < 0) gutter = 0;
	
	$j('div.backgroundFeature').width(Math.round(minBoldWidth + gutter)).removeClass('hidden');
}

function pos_btPlansBolt()
{
	docWidth = $j(window).width();
	
	//var minBoldWidth = 455;
	var minBoldWidth = 505;
	var gutter = Math.ceil((docWidth - 963) / 2);
	
	if (gutter < 0) gutter = 0;
	
	$j('div.backgroundFeature').width(Math.round(minBoldWidth + gutter));
}
/*########################### END PHONE DETAILS CONTENT ############################*/

function pl_phoneDetailContentInit() 
{
	// Plan Detail - Coverage Check - clear zip filed on focus
	$j('#coverageZipField').clearOnFocus();
	deviceDetailsCoverageCheck();

	/* Buyback tab */
	$j("a#buyback-tab").click(function(e)
	{
		e.preventDefault();
		
		if ($j("div#buyback-pane").is(":hidden"))
		{
			$j("div#buyback-pane").slideDown("fast");
			$j("a#buyback-tab").addClass('is-open');
			
			if ($j("#buyback-pricing").attr("src") == "")
			{
				$j("#buyback-pricing").attr("src", "https://buyback.virginmobileusa.com/vmb/breakout_pricing");
				try
				{
					s.prop7 = 'buyback price module';
					s.eVar24 = 'buyback price module';
					s.events = 'event16';					
					s.linkTrackVars='prop7,eVar24,events';
					s.linkTrackEvents='event16';					
					s.tl(true,'o','buyback price module');
				}
				catch(err) {;}
			}
		}
		else
		{
			$j("div#buyback-pane").hide();
			$j("a#buyback-tab").removeClass('is-open');
		}

		return false;
	});
	
	$j('ul.color_nav').on('click', 'a', function(evt)
	{
		evt.preventDefault();
		var selectedColor = $j(this).attr('data-color');
		
		// Switch Indicator
		$j('ul.color_nav a').removeClass('active');
		$j(this).addClass('active');
		
		// Switch Large Phone
		$j('div.phone_large').removeClass('active');
		$j('div.phone_large.'+selectedColor).addClass('active');
		
		// Switch Details
		$j('div.detailsDisplay').removeClass('active');
		$j('div.detailsDisplay.'+selectedColor).addClass('active');
	});

	// Plan Detail - Internation Rates - Dropdown
	$j('section#intl_rates select#irates').change(function() 
	{
		if ($j(this).val() == "select") 
			$j('#rates_wrap').slideUp();
		else 
		{
			$j('#rates_display').html(_VMU_buildIratesDetailsPage($j(this).val()));
			$j('#rates_wrap').slideDown();
		}
	});

	// Phone Details COLORBOX Popup Actions
	//$j('a.splashPopOverLink').colorbox({width: 967, height: 583, iframe: true, opacity: 0.8 });
	//$j('a.androidPopLink').colorbox({width: 920, height: 667, iframe: true, opacity: 0.8 });
	//$j('a.comesWithLink').colorbox({width: 960, height: 608, iframe: true, opacity: 0.8 });
}

function pl_planDetailContentInit() 
{	
	// Background Feature Position
	if ($j('div.backgroundFeature').length > 0) 
	{
		pos_btPlansBolt();
		
		$j(window).resize(function() 
		{
			pos_btPlansBolt();
		});
	}
	
	// Plan Splash - Coverage Check - Right now this is not functional. 
	//		To see a demonstration type in '12345' for success or anything else for failure
	$j('#coverageCheckSubmit').on('click', function(evt)
	{
		$j('div.covCheck form').fadeOut(function() 
		{
			if ($j('#coverageZipField').val() == '12345') 
				$j('div.covCheckForm div.success').fadeIn();
			else 
				$j('div.covCheckForm div.failure').fadeIn();
		});
		
		return false;
	});
	
	// Color Box Popups
	//$j("#tabbedContent").on('a.comesWithPopLink').colorbox({width: 960, height: 608, iframe: true, opacity: 0.8 });
	//$j('div.zoom a').colorbox({width: 960, height: 608, iframe: true, opacity: 0.8 });
	
	// Plan Splash - Coverage Check - clear zip filed on focus
	$j('#coverageZipField').clearOnFocus();	
	$j('section#consumer_response').on('click', function() { switchTab('reviews'); });
}

/*########################### BEGIN BB2G DETAILS CONTENT ############################*/
function bb2g_DetailContentInit() 
{	
	// Background Feature Position
	if ($j('div.backgroundFeature').length > 0) 
	{
		pos_bb2gDevicesBolt();
		$j(window).resize(function()
		{
			pos_bb2gDevicesBolt();
		});
	}

	// Coverage Check
	$j('#coverageZipField').clearOnFocus();
	deviceDetailsCoverageCheck();
}

/* Repositions Phone Splash Background Bolt Feature */
function pos_bb2gDevicesBolt()
{
	docWidth = $j(window).width();
	
	var bolt = $j('div.backgroundFeature');
	var boltWidth = 775;
	var rightBound = (docWidth / 2) - 150;
	
	if (boltWidth > rightBound) 
	{
		if (docWidth > 963)
			bolt.css('left', rightBound - boltWidth + "px").show();
		else bolt.css('left', "-437px").show();
	}
	else 
		bolt.css('left', "0").width(rightBound).show();
}
/*########################### END BB2G DETAILS CONTENT ############################*/

/*########################### BEGIN DETAILS PAGE COMMON FUNCTIONS ############################*/
function deviceDetailsCoverageCheck() 
{
	// Plan Detail - Coverage Check - Right now this is not functional. 
	//		To see a demonstration type in '12345' for success or anything else for failure
	$j('#coverageCheckSubmit').on('click', function(evt)
	{
		evt.preventDefault;
		$j('section#coverage div.result').removeClass('success').removeClass('failed'); // Clear Results
		
		if ($j('#coverageZipField').val() == '12345') 
			$j('section#coverage div.result').addClass('success');
		else 
			$j('section#coverage div.result').addClass('failed');
			
		return false;
	});
}
/*########################### END DETAILS PAGE COMMON FUNCTIONS ############################*/

function checkLoggedIn() 
{
	if ($j.cookie || $j('body').hasClass('log_pre') || $j('body').hasClass('log_post')) 
	{		
		if ($j.cookie('u_log')) 
		{
			cookieValue = $j.cookie('u_log');
			
			if (cookieValue == "pre") 
			{
				$j('body').addClass('log');
				$j('body').addClass('log_pre');
			} 
			else if (cookieValue == "post") 
			{
				$j('body').addClass('log');
				$j('body').addClass('log_post');
			}
		}
		
		// if body doesn't have the 'log' class at this point, then exit
		if (!($j('body').hasClass('log'))) { return; }
		
		// Add Logout to Nav
		$j('#logout').show();
		$j('#logout>a').attr('href', 'https://www2.virginmobileusa.com/login/logout.do');		
		// Change Behavior of TopUp Nav Link
		//$j('#topupNav>a').addClass('my_account_overlay');
	}	
}

/*########################### BEGIN CART LANDING CONTENT ############################*/
function setupCartLanding() 
{	
	var $pc = $j("#cart_p1-input-promo_code");
	
	$pc.clearOnFocusPromo();
	$pc.closest(".cart-errata-promo").find("a").bind("click", function(e)
	{
		if (!$j(this).hasClass("promoEntered")) e.preventDefault();
		
		$pc.val('');
		$j('#promoCodeForm').submit();
	});	
}

/* Repositions Phone Splash Background Bolt Feature */
function pos_bb2gDevicesBolt()
{
	docWidth = $j(window).width();
	
	var bolt = $j('div.backgroundFeature');
	var boltWidth = 775;
	var rightBound = (docWidth / 2) - 150;
	
	if (boltWidth > rightBound) 
	{
		if (docWidth > 963)
			bolt.css('left', rightBound - boltWidth + "px").show();
		else bolt.css('left', "-437px").show();
	}
	else 
		bolt.css('left', "0").width(rightBound).show();
}
/*########################### END CART LANDING CONTENT ############################*/

/* =============================================================================
	Clears default field text upon focus & restores upon unfocus if
	nothing has been typed into the field.
	
	Author: Tori Holmes-Kirk (tori.holmes-kirk@beamland.com)
	Last Modified: 5/4/2012
   ========================================================================== */
$j.fn.clearOnFocus = function()
{
    return this.focus(function()
	{
        var v = $j(this).val();
        $j(this).val(v === this.defaultValue ? '' : v);
    }).blur(function()
	{
        var v = $j(this).val();
        $j(this).val(v.match(/^\s+$|^$/) ? this.defaultValue : v);
    });
};

$j.fn.clearOnFocusPromo = function()
{
    return this.bind("focus", function()
	{
        var v = $j(this).val();
        $j(this).val(v === this.defaultValue ? '' : v);
		if (v === this.defaultValue) $j(this).closest(".cart-errata-promo").find('a').attr("class", "");
    }).bind("blur", function()
	{
        var v = $j(this).val();
        $j(this).val(v.match(/^\s+$|^$/) ? this.defaultValue : v);
		if (v.match(/^\s+$|^$/)) $j(this).closest(".cart-errata-promo").find('a').attr("class", "");
    }).bind("keyup", function(e)
	{
		var v = $j(this).val();
		var c = (v.length < 0) ? "" : "promoEntered";
		$j(this).closest(".cart-errata-promo").find('a').attr("class", c);
	});
};

/* =============================================================================
  	Sets all the elements provided via a jquery selector to be the same height
	as the tallest element.
	
	*** ! Should be called within a $j(window).load() block ! ***
	
	Author: Tori Holmes-Kirk (tori.holmes-kirk@beamland.com)
	Last Modified: 5/4/2012
   ========================================================================== */
$j.fn.equalHeights = function() 
{
	var maxHeight = 0;
	
	$j(this).each(function(index) 
	{
		var colHeight = $j(this).height();
		maxHeight = Math.max(colHeight, maxHeight);
	});
	
	$j(this).height(maxHeight);
};

/* =============================================================================
	Accordion Show/Hide for device faq's etc.

	Last Modified: 5/16/2012
   ========================================================================== */
$j.fn.setupAccordion = function(el) 
{
	if (typeof document.body.style.maxHeight === "undefined") // if IE6
	{ 
		$j(this).find('h2 a').click(function() 
		{
			if (!$j(this).parent().parent().hasClass('expanded')) 
			{ 
				$j(this).parent().parent().removeClass('expanded');
			} 
			else 
			{
				$j(this).parent().parent().siblings().removeClass('expanded');
				$j(this).parent().parent().addClass('expanded');
			};
			
			return false;
		});
	} 
	else // if NOT IE6
	{ 
		$j(this).find('h2 a').click(function() 
		{
			if (!$j(this).parent().parent().hasClass('expanded')) 
			{ 
				$j(this).parent().parent().siblings().removeClass('expanded').find('.body').hide(); 
				$j(this).parent().parent().addClass('expanded').find('.body').hide().fadeIn(400).slideDown(400); 
			} 
			else 
			{
				$j(this).parent().parent().removeClass('expanded').find('.body').hide(); 
			};
			
			return false;
		});
	}
};

/* =============================================================================
	FAQ Paginationfor device faq's etc.

	Last Modified: 5/31/2012
   ========================================================================== */
setNumberOfPages = function(numberOfRows) 
{
	if (!numberOfRows) { var numberOfRows = 10; }
	
	var faqCount = $j('#faqList>li').length;
	var numOfPages = Math.ceil(faqCount/numberOfRows);
	
	$j('#pageList span').html(numOfPages);
	$j('#total_questions').html(faqCount);
	
	// remove any option items more than the first
	$j('#pagination option:gt(0)').remove();

	for (var i=2; i<=numOfPages; i++) 
	{
		$j('#pagination').append('<option value="'+i+'">'+i+'</option>');	
	}
}

paginate = function(startRow, numberOfRows) 
{
	if (!numberOfRows) { var numberOfRows = 10;	}

	// lt and gt are zero based, so subtract from the start and end
	var start = startRow - 1;
	var end = start + (numberOfRows - 1);	
	var startNum = startRow;
	var endNum = startRow + (numberOfRows - 1);
	var faqCount = $j('#faqList>li').length;

	if (endNum > faqCount) { endNum = faqCount; }

	// show all 
	$j('#faqList>li').show();
	
	// hide any prior to the startrow
	$j('#faqList>li:lt('+start+')').hide();
	
	// hide any above startrow+19
	$j('#faqList>li:gt('+end+')').hide();
	
	// update which are being shown
	$j('#question_range').html(startNum+'-'+endNum);
}

function closeTestDrive() 
{
	$j.colorbox.close();
}

/* =============================================================================
	ColorOptions Setup

	Last Modified: 5/16/2012
   ========================================================================== */
function setupColorOptions () 
{	
	$j('.coloroptions').each(function(coloritemWrapper) 
	{
		$j(this).find('.colorpicker a').click(function(e) 
		{
			e.preventDefault();
			var selectedColor = this.href.split('#')[1];
			$j(this).closest('.coloroptions').removeClass('color1 color2 color3').addClass(selectedColor);
		});
	});
}

/**
 * Equal Heights Plugin
 * Equalize the heights of elements. Great for columns or any elements
 * that need to be the same size (floats, etc).
 * 
 * Version 1.0
 * Updated 12/10/2008
 *
 * Copyright (c) 2008 Rob Glazebrook (cssnewbie.com) 
 *
 * Usage: $(object).equalHeights([minHeight], [maxHeight]);
 * 
 * Example 1: $(".cols").equalHeights(); Sets all columns to the same height.
 * Example 2: $(".cols").equalHeights(400); Sets all cols to at least 400px tall.
 * Example 3: $(".cols").equalHeights(100,300); Cols are at least 100 but no more
 * than 300 pixels tall. Elements with too much content will gain a scrollbar.
 */
(function($) 
{
	$.fn.equalHeights = function(minHeight, maxHeight) 
	{
		tallest = (minHeight) ? minHeight : 0;
		this.each(function() 
		{
			if ($(this).height() > tallest) 
			{
				tallest = $(this).height();
			}
		});
		
		if ((maxHeight) && tallest > maxHeight) tallest = maxHeight;
		
		return this.each(function() 
		{
			$(this).height(tallest).css("overflow","hidden");
		});
	}
})(jQuery);

// Cart COLORBOX Popup Actions
$j('body.cart div.cart_sidebar-cell a').colorbox({width: 967, height: 583, iframe: true, opacity: 0.8 });
//$j('a.androidPopLink').colorbox({width: 920, height: 667, iframe: true, opacity: 0.8 });
/*$j('div.comesWithCBox').on('click', function(evt)
{
	evt.preventDefault();
	$j.colorbox({href:"/includes/common/pop-overs/comes-with.html", width: 960, height: 608, iframe: true, opacity: 0.8 });
});*/	
	
//  --------------------------
//    USER ACCOUNT MIGRATION 
//  --------------------------
//  For questions regarding this code contact victor.valle@sprint.com 
//  jQuery cookie plugin minified
//(function(e,t,n) {function i(e) {return e}function s(e) {return decodeURIComponent(e.replace(r," "))}var r=/\+/g;var o=e.cookie=function(r,u,a) {if (u!==n) {a=e.extend({},o.defaults,a);if (u===null) {a.expires=-1}if (typeof a.expires==="number") {var f=a.expires,l=a.expires=new Date;l.setDate(l.getDate()+f)}u=o.json?JSON.stringify(u):String(u);return t.cookie=[encodeURIComponent(r),"=",o.raw?u:encodeURIComponent(u),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=o.raw?i:s;var h=t.cookie.split("; ");for(var p=0,d=h.length;p<d;p++) {var v=h[p].split("=");if (c(v.shift())===r) {var m=c(v.join("="));return o.json?JSON.parse(m):m}}return null};o.defaults={};e.removeCookie=function(t,n) {if (e.cookie(t)!==null) {e.cookie(t,null,n);return true}return false}})(jQuery,document)

$j(document).ready(function() 
{
	//console.log("base_vds.js");

	// Changes links of the top header links in the pages
	//overrideNavClick(".cartBtn");
	//overrideNavClick(".btn_addtocart");
	overrideNavClick("#topNavTrackOrder");
	overrideNavClick("#topNavActivate");
	overrideNavClick("#topNavTopup");
	overrideNavClick("#topNavMyAccount");
	overrideNavClick("#topNavSignOut");
	//overrideNavClick("#bottomNavContactUs");
	overrideNavClick("#helpSupportMyAccount");
	overrideNavClick("#helpSupportFAQsMyAccount");
	overrideNavClick("#cellPhoneAccessoriesPageMyAccount");

	// Intercepts log out link and deletes the user account cookie
	//$j("#topNavSignOut").click(function() 
	//{
	//	 $j.cookie("user_account_type", null, {domain: ".virginmobileusa.com", path: "/"});
	//});

	//Intercepts the click of 'add to cart' in the Paylo Plans
	$j(".cartBtn").click(function() 
	{
		overrideClick(this);
		return false;
	});
	
		//Intercepts the click of 'add to cart' in the phone grid page
	$j(".btn_addtocart").click(function() 
	{
		overrideClick(this);
		return false;
	});
	
		//Intercepts the click of 'add to cart' in the phone grid page
	$j(".addToCart").click(function() 
	{
		overrideClick(this);
		return false;
	});	

	//Intercepts the click of 'show cart' in the header
	$j("#navCart").click(function() 
	{
		overrideClick(this);
		return false;
	});

	function overrideClick(linkElement) 
	{
		var shopURL = $j(linkElement).attr("href");		
		var newShopURL = processShopURL(shopURL);
		
		//console.log("Shop redirected to: " + newShopURL);
		document.location.href = newShopURL;
	}
	
	function overrideNavClick(linkElement) 
	{
		var newNavURL = processNavURL($j(linkElement).attr("href"));
		
		//console.log(linkElement + " redirected to: " + newNavURL);
		$j(linkElement).attr("href", newNavURL);
	}

	//Intercepts the click of 'add to cart' of the phone details page
	$j(".button_add_to_cart").click(function() 
	{
		var shopForm = $j(this).parent().parent().is("form") ? $j(this).parent().parent() : $j(this).parent();
		var shopURL = shopForm.attr("action");			
		var newShopURL = processShopURL(shopURL);
		
		//console.log("Shop form redirecting to: " + newShopURL);
		shopForm.attr("action", newShopURL);
		shopForm.submit();
		return false;
	});
});

function processNavURL(navURL) 
{
	try 
	{
		var currentDomain = "www1.virginmobileusa.com";
		var defaultDomain = "www2.virginmobileusa.com";
		var feaDomain = "www2.virginmobileusa.com";
		var legacyDomain = "www1.virginmobileusa.com";
		var cookieName = "user_account_type";
		var cookieValue = $j.cookie(cookieName);

		if (cookieValue == "fea") 
			return navURL.replace(currentDomain, feaDomain);
		else 
		{
			if (cookieValue == "legacy") 
				return navURL.replace(currentDomain, legacyDomain);
			else 
				return navURL.replace(currentDomain, defaultDomain);
		}
	} 
	catch(err) { return navURL; }
}

function processShopURL(shopURL) 
{
	var currentDomain = "www1.virginmobileusa.com";
	var defaultDomain = "www2.virginmobileusa.com";
	var feaDomain = "www2.virginmobileusa.com";
	var legacyDomain = "www1.virginmobileusa.com";
	var cookieName = "user_account_type";
	var cookieValue = $j.cookie(cookieName);

	if (cookieValue == "fea") 
		return shopURL.replace(currentDomain, feaDomain);
	else 
	{
		if (cookieValue == "legacy")
			return shopURL.replace(currentDomain, legacyDomain);
		else 
			return shopURL.replace(currentDomain, defaultDomain);
	}
}
// Account migration code end ************************

// Modal pop for Get Your Benjamin Promo
/*$j(document).ready(function()
{	
	$j(".show-benjamin").click(function(e)
	{
		e.preventDefault();
		show_benjamin();
	});
});

function show_benjamin()
{
	$j.colorbox(
	{
		href:'/marketing/get-your-benjamin.html?intid=AB:POPUP:130628:BT:Brand:Benjamin:Terms:LM',
		innerWidth: 900,
		innerHeight: 610,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() { $j("#colorbox").addClass("benjamin"); },
		onClosed:function() { $j("#colorbox").removeClass("benjamin"); }
	});
}*/


// Modal pop for Freefest Promo
/*$j(document).ready(function()
{
	if (window.location.href.indexOf("/shop/cell-phones/samsung-galaxy-III-4G-LTE-phone") != -1)
	{
		if (window.location.href.indexOf("/shop/cell-phones/samsung-galaxy-III-4G-LTE-phone/features/?intid=AB:Modal:130729:BT:FreefestFlash:GS3:PD") != -1)
		{}
		else{
		show_freefest();
		}
	}
});

function show_freefest()
{
	$j.colorbox(
	{
		href:'/marketing/freefest.html?intid=AB:PhonePage:130729:BT:FreefestFlash:GS3:SeeDetails',
		innerWidth: 900,
		innerHeight: 750,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/freefest_closebtn.gif) no-repeat scroll -22px 0 transparent");
			$j('#cboxClose.phoneDetail')
		},
		onClosed:function() { $j("#colorbox").removeClass("freefest"); $j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
	});
	
}*/

/*function show_2monthsfree()
{
	$j.colorbox(
	{
		href:'/marketing/2monthsfree.html',
		innerWidth: 600,
		innerHeight: 580,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() { $j("#colorbox").addClass("2monthsfree"); },
		onClosed:function() { $j("#colorbox").removeClass("2monthsfree"); }
	});
}*/

function show_accountbonus()
{
	$j.colorbox(
	{
		href:'/marketing/accountbonus.html?intid=AB:MODAL:140708:BB2G:25AC:Mingle:SD',
		innerWidth: 900,
		innerHeight: 810,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
			//$j('#cboxClose.phoneDetail')},
		//onClosed:function() { $j("#colorbox").removeClass("freefest"); //$j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
		}
	});	
}

function show_freeShippingModal(tracking)
{
	var urlTracking = tracking == undefined ? "" : urlTracking = tracking.indexOf("?") >= 0 ? tracking : "?" + tracking;
	
	$j.colorbox(
	{		
		href:'/marketing/free-shipping-tc.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 800,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
			//$j('#cboxClose.phoneDetail')},
			//onClosed:function() { $j("#colorbox").removeClass("freefest"); //$j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
		}
	});
	
}

function show_accountBonusBB2G(intid)
{
	var urlTracking;
	
	if (intid == undefined) 
	{
		urlTracking = "";}
	else 
	{ 
		urlTracking = "?" + intid;
	}
	
	$j.colorbox(
	{		
		href:'/marketing/accountBonusBB2G.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 810,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
			//$j('#cboxClose.phoneDetail')},
		//onClosed:function() { $j("#colorbox").removeClass("freefest"); //$j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
		}
	});
	
}

function show_catsies()
{
	$j.colorbox(
	{
		href:'/marketing/catsies.html',
		innerWidth: 900,
		innerHeight: 900,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_catsiesgrid()
{
	$j.colorbox(
	{
		href:'/marketing/catsies.html?intid=AB:GridBanner:140612:BT:Catsies:Samsung:SD',
		innerWidth: 900,
		innerHeight: 900,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_salepluscredit()
{
	$j.colorbox(
	{
		href:'/marketing/salepluscredit.html',
		innerWidth: 900,
		innerHeight: 900,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("accountcredit"); 
			$j("#colorbox").removeClass("accountcredit"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_accountBonusBT(intid)
{
	var urlTracking;
	
	if (intid == undefined) 
	{
		urlTracking = "";}
	else 
	{ 
		urlTracking = "?" + intid;
	}
	
	$j.colorbox(
	{		
		href:'/marketing/accountbonusBT.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 880,
		iframe: true,
		opacity: 0.8,
		scrolling: true,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("accountcredit"); 
			$j("#colorbox").removeClass("accountcredit"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_accountBonusBTFlash(intid)
{
	var urlTracking;
	
	if (intid == undefined) 
	{
		urlTracking = "";}
	else 
	{ 
		urlTracking = "?" + intid;
	}
	
	$j.colorbox(
	{		
		href:'/marketing/accountbonusBTFlash.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 926,
		iframe: true,
		opacity: 0.8,
		scrolling: true,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("accountcredit"); 
			$j("#colorbox").removeClass("accountcredit"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_accountBonusPL(caller)
{
	var urlTracking = caller != "undefined" && $j(caller).attr("id") == "promo-banner" ? "?intid=AB:GRID:140715:PL:AC:SD" : "?intid=AB:MODAL:140715:PL:AC:SD";
	
	$j.colorbox(
	{		
		href:'/marketing/accountbonusPL.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 900,
		iframe: true,
		opacity: 0.8,
		scrolling: true,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("accountcredit"); 
			$j("#colorbox").removeClass("accountcredit"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

function show_paylo_accountbonus()
{
	$j.colorbox(
	{
		href:'/marketing/paylo_accountbonus.html',
		innerWidth: 900,
		innerHeight: 750,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
			//$j('#cboxClose.phoneDetail')},
		//onClosed:function() { $j("#colorbox").removeClass("freefest"); //$j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
		}
	});	
}

function show_accountcredit()
{
	$j.colorbox(
	{
		href:'/marketing/account-credit.html',
		innerWidth: 600,
		innerHeight: 580,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");

		}
	});	
}

function Show_55AcctCredit(caller)
{
	var urlTracking = caller != "undefined" && $j(caller).attr("id") == "promo-banner" ? "?intid=AB:GRID:140708:BT:55AC:SD" : "?intid=AB:MODAL:140708:BT:55AC:SD";
	
	$j.colorbox(
	{
		href:'/marketing/account-credit-55.html' + urlTracking,
		innerWidth: 900,
		innerHeight: 820,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
		}
	});	
}

/*function show_rt1_accountbonus()
{
	$j.colorbox(
	{
		href:'/marketing/accountbonus.html?intid=AB:RT1:131219:BT:Holiday2013:35AcctBon:LM',
		innerWidth: 900,
		innerHeight: 750,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() 
		{ 
			$j("#colorbox").addClass("freefest"); 
			$j("#colorbox").removeClass("freefest"); 
			$j('#cboxClose').css("background","url(/_img/2012/promos/modal_closebtn.png) no-repeat scroll -22px 0 transparent");
			//$j('#cboxClose.phoneDetail')},
		//onClosed:function() { $j("#colorbox").removeClass("freefest"); //$j('#cboxClose').css("background","url(/_img/2012/colorbox_closebtn.gif) no-repeat scroll -22px 0 transparent"); }
		}
	});	
}*/

/* Used by BT/BB2G/Paylo plan splash pages for Check Coverage button */
String.prototype.fulltrim = String.prototype.fulltrim || function() { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " "); };

function isValidUSZip(zip) { return /^\d{5}(-\d{4})?$/.test(zip); }

function checkPlanCoverage(ptype, zipel)
{
	var zipval = document.getElementById(zipel).value.fulltrim();
	var query = '/check-cell-phone-coverage?plan='+ptype;
	if (isValidUSZip(zipval)) query +='&zip='+zipval;

	window.location.href = query;
	return false;
}
/* END */

/****************** Us-vs-Them Start ******************/
function show_compare(tracking) 
{
	var customQuerystring = "";
	
	if (document.URL.indexOf("#compare") != -1)
	{
		var compare_hash = document.URL.split('#')[1]; 
		customQuerystring = "?" + compare_hash.split(":")[1];
	}
	else
	{
		customQuerystring = tracking != null && tracking != "undefined" ? tracking : "";
	}
	 
	 var compare_url = "//uswhistleout.s3.amazonaws.com/public/widgets/VirginMobile/ComparisonWidget/ComparisonWidget.html" + customQuerystring;

	// If colorBox falters in IE8 or earlier uncomment the browser 
	// detect if to utilize a popup window instead.
	/*if (document.all && !document.addEventListener) 
	{
		window.open(compare_url,'_blank', 'width=1000,height=820,scrollbars=1,directories=0,status=0,toolbar=0,menubar=0,location=0');
	}
	else
	{*/
		/*$j.colorbox({
			href: compare_url, 
			initialHeight: 850,
			innerWidth: 1000, 
			innerHeight: 850,
			iframe: true, 
			opacity: 0.8, 
			scrolling: false, 
			onComplete: function()
			{
			   $j("#cboxLoadedContent").css('padding-top','30px');
			   $j("#cboxLoadedContent").css('height','820px');
			}
		}); 
		return false;  */
	//} /* Uncomment if uncommenting the if..else above */
}
/****************** Us-vs-Them End ******************/

function show_livefeed()
{
	$j.colorbox(
	{
		href:'/marketing/ff-livefeed.html?intid=MA:LP:FreeFest:LiveFeed',
		innerWidth: 710,
		innerHeight: 625,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() { $j("#colorbox").addClass("ff-livefeed"); },
		onClosed:function() { $j("#colorbox").removeClass("ff-livefeed"); }
	});
}

function show_flyaway()
{
	$j.colorbox(
	{
		href:'/marketing/ff-sweepstakes.html?intid=MA:LT1:130729:FreefestFlyaway:EC',
		innerWidth: 720,
		innerHeight: 870,
		iframe: true,
		opacity: 0.8,
		scrolling: false,
		onOpen:function() { $j("#colorbox").addClass("ff-sweepstakes"); },
		onClosed:function() { $j("#colorbox").removeClass("ff-sweepstakes"); }
	});
}

function show_compareIphones()
{
	$j.colorbox(
	{
		href:"/marketing/iphone-compare.html", 
		width: 1100, 
		height: 600, 
		iframe: true, 
		opacity: 0.8 
	});
}

/* Global Free Shipping Bug */
function initShippingBug()
{
	var mlsLeft = 0;
	var doCounter = false;
	var doBug = false;
	var bugSrc = '';	
	var dueDate = new Array
	(
		//{ mls: Date.parse(new Date("December 16, 2013 12:00:00 GMT")), bugSrc: 'http://www.virginmobileusa.com/_img/2013/holiday/deals/fd_bug01.png', type: 'counter' },
		//{ mls: Date.parse(new Date("December 26, 2013 22:00:00 GMT")), bugSrc: 'http://www.virginmobileusa.com/_img/2013/holiday/deals/fd_bug02.png', type: 'counter' },
		//{ mls: Date.parse(new Date("December 26, 2013 04:00:00 GMT")), bugSrc: '', type: 'off' },
		{ mls: Date.parse(new Date("March 29, 2014 03:59:00 GMT")), bugSrc: '/_img/2014/promos/fd_bug_fos_03_28.png', type: 'fixed' }
	);
	var mlsSelf = Date.parse(new Date());
	
	for(var i=0; i<dueDate.length; i++)
	{
		mlsLeft = dueDate[i].mls - mlsSelf;
		if (mlsLeft > 0)
		{
			doCounter = (dueDate[i].type == 'counter') ? true : false;
			doBug = (dueDate[i].type != 'off') ? true : false;
			bugSrc = dueDate[i].bugSrc;
			break;
		}
	}
	
	if (doBug)
	{
		var _fdBug = '';
		_fdBug +=	'<div style="position:fixed; width:100%; height:56px; bottom:0; z-index:9998; font:bold 16px/18px arial;">';
		_fdBug +=		'<div id="fdbug" style="position:relative; width:607px; height:62px; margin:0 auto; background:url('+bugSrc+') no-repeat 0 0; cursor:pointer;">';
		
		if (doCounter)
		{
			var dayLeft = (mlsLeft > 0) ? (Math.floor((Math.floor(mlsLeft/1000))/86400))+1 : 0;
			_fdBug +=	'<span style="position:absolute; left:83px; top:30px; width:18px; height:18px; text-align:center;">' +(Math.floor(dayLeft / 10))+ '</span>';
			_fdBug +=	'<span style="position:absolute; left:103px; top:30px; width:18px; height:18px; text-align:center;">' +(dayLeft % 10)+ '</span>';
		}_
		_fdBug +=		'</div>';
		_fdBug +=	'</div>';
		$j('body').append(_fdBug);
		
		$j('body').on('click','#fdbug', function(e)
		{
			window.location.href = 'http://www.virginmobileusa.com/shop/cell-phones/?intid=AB:Bnr:140320:FreeShip:SN';
			//window.open("/marketing/free-shipping-tc.html", "vmushipping", "width=900,height=700,location=no,scrollbars=no,status=no,toolbar=no,resizable=no").focus();
		});
	}
}