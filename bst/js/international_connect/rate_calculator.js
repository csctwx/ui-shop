

$(document).ready(function() {
	/*  Setup mouse-overs for buttons  */
	$('.rate_calc_form a.btn_search, .rate_calc_search_results ul.add_offer_buttons a').bind('mouseenter mouseleave', function(){
		$(this).toggleClass('over');
	});
});


$(document).ready(function() {
	/*  Default string handling (hiding and showing) in the phone_number field.  */
	$('.rate_calc_form input#phone_number').bind('focusin', function() {
		if ($(this).attr('value') == 'XXXXXXXXXX') {
			$(this).attr('value', '');
		}
		clearErrorState();
	});
	$('.rate_calc_form input#phone_number').bind('focusout', function() {
		if($(this).attr('value') == '') {
			$(this).attr('value', 'XXXXXXXXXX');
		}
	});
});


$(document).ready(function() {
	/*  Handle searching for rates  */
	$('.rate_calc_form a.btn_search').click(function(e){
		// Hide the rate-chart if it's visible.
		hideRateCharts();

		clearErrorState();

		// Perform the search - grandfathered states are taken into account when data is returned (prevents further
		// complicating the back-end).
		$.post('/shop/InternationalConnectServlet', {
		
			phone_prefix: $('.rate_calc_form #phone_prefix :selected').attr('value'),
			phone_number: $('.rate_calc_form input#phone_number').val()
		}, function(data) {

			var rates = $.parseJSON(data);

			// Replaces what the user entered as a phone number with the returned, (and possibly) cleaned-up version.
			$('.rate_calc_form #phone_number').attr('value', rates.phone_number);

			// Check if there was an error.
			if (rates.error) {
				showError(data.error);
				return true;
			}

			// We've noticed that sometimes mobile or landline rates are missing. We're checking for this and
			// copying over the landline/mobile rates to the set that's missing.
			rates = supplementMissingRates(rates);

			// Generate ambiguous rateset.
			rateset = generateRateset(rates);

			// Overwrites rateset values based on grandfather plans.
			var plan = $('.rate_calc_form .rate_selection input[name="rate_set"]:checked').attr('value');
			switch(plan) {
				case '2':
					rateset.specific_add5 = rates.specific_gf1;
					if (rates.specific_type == 'Landline') {
						rateset.other_min_add5 = rates.mobi_min_gf1;
						rateset.other_max_add5 = rates.mobi_max_gf1;
					} else {
						rateset.other_min_add5 = rates.land_min_gf1;
						rateset.other_max_add5 = rates.land_max_gf1;
					}
					break;

				case '3':
					rateset.specific_add5 = rates.specific_gf2;
					if (rates.specific_type == 'Landline') {
						rateset.other_min_add5 = rates.mobi_min_gf2;
						rateset.other_max_add5 = rates.mobi_max_gf2;
					} else {
						rateset.other_min_add5 = rates.land_min_gf2;
						rateset.other_max_add5 = rates.land_max_gf2;
					}
					break;
			}

			// Clear any 'subtle' classes within the rate charts.
			$('.rate_calc_search_results li p').removeClass('subtle');
			$('.rate_calc_search_results li p').removeClass('stacked');

			// Update (both) rate charts.
			updateRateCharts(rateset);

			// Determine which chart to show.
			if ((rateset.specific_std == rateset.specific_add5 && rateset.specific_add5 == rateset.specific_add10)
				&& (rateset.other_min_std == rateset.other_min_add5 && rateset.other_min_add5 == rateset.other_min_add10)) {
				$('#search_results_note').slideDown(300);
			} else {
				//if (rateset.subgpu.substr(1,3) > 200) {
				//	$('#search_results.single').slideDown(300);
				//} else {
					$('#search_results').slideDown(300);
				//}
			}

			return true;
		});

		e.preventDefault();
	});
});


$(document).ready(function() {
	/*  When a user hits 'enter' or 'return' when a form field has focus, it'll automatically submit the form. We
	    are trapping the form submission and instead, replacing it with a .click() event on the search button.  */
	$('form#rate_calculator_form').bind('submit', function(e) {
		$('.rate_calc_form a.btn_search').click();
		e.preventDefault();
	});
});






/*  Hides the rate charts (if they're visible)  */
function hideRateCharts( ) {
	if ($('#search_results').is(':visible')) {
		$('#search_results').slideUp(200);
	}
	if ($('#search_results_note').is(':visible')) {
		$('#search_results_note').slideUp(200);
	}
	if ($('#search_results.single').is(':visible')) {
		$('#search_results.single').slideUp(200);
	}
}


/*  Remove error states (if necessary)  */
function clearErrorState( ) {
	$('.rate_calc_form #phone_number').removeClass('error');
	$('.rate_calc_form .error_message').hide();
}


/*  Display an error in the rate finder form.  */
function showError( error ) {
	$('.rate_calc_form #phone_number').addClass('error');
	$('.rate_calc_form .error_message').show();
}


/*  Updates the rate charts (both).  */
function updateRateCharts( rateset ) {

	single_row = (rateset.subgpu.substr(1,3) > 200) ? true : false;

	// Specific rates
	$('.rate_calc_search_results #country .country_name').html(rateset.country);
	if (single_row) {
		$('.rate_calc_search_results #specific_label div').html('Number Entered');
	} else {
		$('.rate_calc_search_results #specific_label div').html('<div class="pre_label">Number Entered:</div>' + rateset.specific_type);
	}
	$('.rate_calc_search_results #specific_standard_rate p').html(specificRateFormatter($('.rate_calc_search_results #specific_standard_rate p'), rateset.specific_std, rateset.specific_std, true));
	$('.rate_calc_search_results #specific_ic_rate p').html(specificRateFormatter($('.rate_calc_search_results #specific_ic_rate p'), rateset.specific_std, rateset.specific_add5, false));
	$('.rate_calc_search_results #specific_icp_rate p').html(specificRateFormatter($('.rate_calc_search_results #specific_icp_rate p'), rateset.specific_std, rateset.specific_add10, false));

	// Other rates
	$('.rate_calc_search_results #other_label p').html(rateset.other_type);
	$('.rate_calc_search_results #other_standard_rate p').html(otherRateFormatter($('.rate_calc_search_results #other_standard_rate p'), rateset.other_min_std, rateset.other_min_std, rateset.other_max_std, true));
	$('.rate_calc_search_results #other_ic_rate p').html(otherRateFormatter($('.rate_calc_search_results #other_ic_rate p'), rateset.other_min_std, rateset.other_min_add5, rateset.other_max_add5, false));
	$('.rate_calc_search_results #other_icp_rate p').html(otherRateFormatter($('.rate_calc_search_results #other_icp_rate p'), rateset.other_min_std, rateset.other_min_add10, rateset.other_max_add10, false));

	// Note - no discount chart
	$('#search_results_note .notice p').html('The number you entered calls ' + rateset.country + '. This number is not included in either of our International Connect offers, but our standard rates are still a great option.');

	// Set the 'Best Deal' icon position.
	var plan = $('.rate_calc_form .rate_selection input[name="rate_set"]:checked').attr('value');
	if (plan == 1) {
		if (rateset.specific_add5 <= rateset.specific_add10) {
			$('.rate_calc_search_results #best_deal').addClass('add5');
			$('.rate_calc_search_results').removeClass('gf').addClass('add5');
		} else {
			$('.rate_calc_search_results #best_deal').removeClass('add5');
			$('.rate_calc_search_results').removeClass('gf').removeClass('add5');
		}
	} else {
		$('.rate_calc_search_results').removeClass('add5');
		$('.rate_calc_search_results').addClass('gf');
	}
}


/*  Nicely formats the rate for display in the rate chart.  */
function specificRateFormatter( obj, std_rate, rate, is_std ) {
	std_rate = parseFloat(std_rate);
	rate = parseFloat(rate);

	// Does the standard rate apply?
	if (!is_std && std_rate == rate) {
		$(obj).addClass('subtle');
		return 'Standard Rate Applies';
	}

	if (rate >= '1.00') {
		return '$' + rate.toFixed(2) + ' / minute';
	}
	if (rate.toFixed(2) == '0.00') {
		return 'UNLIMITED';
	}

	return Math.round(rate * 100) + '&cent; / minute';
}


/*  Nicely formats the rate for display in the rate chart.  */
function otherRateFormatter( obj, std_rate, min_rate, max_rate, is_std ) {
	var rate_string = '';
	std_rate = parseFloat(std_rate);
	min_rate = parseFloat(min_rate);
	max_rate = parseFloat(max_rate);

	// Does the standard rate apply?
	if (!is_std && std_rate == min_rate) {
		$(obj).addClass('subtle');
		return 'Standard Rate Applies';
	}

	if (is_std) {
		if (min_rate < max_rate && min_rate != '0.00') {
			rate_string = 'As low as<br/>';
			$(obj).addClass('stacked');
		}
	} else if (min_rate < max_rate && min_rate != '0.00') {
		rate_string = 'As low as ';
	}

	if (min_rate >= '1.00') {
		return rate_string + '$' + min_rate.toFixed(2) + ' / minute';
	}
	if (min_rate.toFixed(2) == '0.00') {
		return rate_string + 'UNLIMITED';
	}
	return rate_string + Math.round(min_rate * 100) + '&cent; / minute';
}


/*  Copies over missing rates when available.  */
function supplementMissingRates( rates ) {
	if (rates.specific_std == null) {
		if ((rates.specific_type == 'Mobile' && rates.mobi_min_std != null)
			|| (rates.specific_type == 'Landline' && rates.land_min_std == null && rates.mobi_min_std != null)) {
			rates.specific_std		= rates.mobi_min_std;
			rates.specific_add5		= rates.mobi_min_add5;
			rates.specific_add10	= rates.mobi_min_add10;
			rates.specific_gf1		= rates.mobi_min_gf1;
			rates.specific_gf2		= rates.mobi_min_gf2;
		} else if ((rates.specific_type == 'Landline' && rates.land_min_std != null)
			|| (rates.specific_type == 'Mobile' && rates.mobi_min_std == null && rates.land_min_std != null)) {
			rates.specific_std		= rates.land_min_std;
			rates.specific_add5		= rates.land_min_add5;
			rates.specific_add10	= rates.land_min_add10;
			rates.specific_gf1		= rates.land_min_gf1;
			rates.specific_gf2		= rates.land_min_gf2;
		}
	}

	// Overwrite any missing rates.
	if (rates.mobi_min_std == null && rates.land_min_std != null) {
		rates.mobi_min_std		= rates.land_min_std;
		rates.mobi_max_std		= rates.land_max_std;
		rates.mobi_min_add5		= rates.land_min_add5;
		rates.mobi_max_add5		= rates.land_max_add5;
		rates.mobi_min_add10	= rates.land_min_add10;
		rates.mobi_max_add10	= rates.land_max_add10;
		rates.mobi_min_gf1		= rates.land_min_gf1;
		rates.mobi_max_gf1		= rates.land_max_gf1;
		rates.mobi_min_gf2		= rates.land_min_gf2;
		rates.mobi_max_gf2		= rates.land_max_gf2;
	} else if (rates.land_min_std == null && rates.mobi_min_std != null) {
		rates.land_min_std		= rates.mobi_min_std;
		rates.land_max_std		= rates.mobi_max_std;
		rates.land_min_add5		= rates.mobi_min_add5;
		rates.land_max_add5		= rates.mobi_max_add5;
		rates.land_min_add10	= rates.mobi_min_add10;
		rates.land_max_add10	= rates.mobi_max_add10;
		rates.land_min_gf1		= rates.mobi_min_gf1;
		rates.land_max_gf1		= rates.mobi_max_gf1;
		rates.land_min_gf2		= rates.mobi_min_gf2;
		rates.land_max_gf2		= rates.mobi_max_gf2;
	}

	return rates;
}


/*  Creates a rateset that doesn't reference 'mobi' or 'land', but instead 'specific', or 'other'.  */
function generateRateset( rates ) {
	var set = {
		country:			rates.country,
		specific_type:		rates.specific_type,
		subgpu:				rates.subgpu,
		area_name:			rates.area_name,
		city_service_name:	rates.city_service_name,
		mobile_network:		rates.mobile_network,

		specific_std:		rates.specific_std,
		specific_add5:		rates.specific_add5,
		specific_add10:		rates.specific_add10
	};

	// Copying over the "other" line-type rates. When the user enters a landline, the 'other' line type is
	// Mobile. We're copying over the other line-type rates so that they can be ambiguously referenced in
	// functions.
	if (rates.specific_type == 'Landline') {
		set.other_type		= 'Mobile';
		set.other_min_std	= rates.mobi_min_std;
		set.other_max_std	= rates.mobi_max_std;
		set.other_min_add5	= rates.mobi_min_add5;
		set.other_max_add5	= rates.mobi_max_add5;
		set.other_min_add10	= rates.mobi_min_add10;
		set.other_max_add10	= rates.mobi_max_add10;
	} else {
		set.other_type		= 'Landline';
		set.other_min_std	= rates.land_min_std;
		set.other_max_std	= rates.land_max_std;
		set.other_min_add5	= rates.land_min_add5;
		set.other_max_add5	= rates.land_max_add5;
		set.other_min_add10	= rates.land_min_add10;
		set.other_max_add10	= rates.land_max_add10;
	}

	return set;
}