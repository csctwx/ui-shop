function resizeSelf()
{
	if(self==top) return;
	
	var x = $j('body').width();
	var y = 100 + $j('body').height();
	parent.$j.fn.colorbox.resize( {innerWidth: 900,innerHeight: y} );
}

$j(document).ready(function()
{
	resizeSelf();
});    

	
$j(document).ready(function() {
	/*  Default string handling (hiding and showing) in the phone_number field.  */
	$j('.rate_calc_form input#phone_number').bind('focusin', function() {
		if ($j(this).attr('value') == 'XXXXXXXXXX') {
			$j(this).attr('value', '');
		}
		clearErrorState();
	});
	$j('.rate_calc_form input#phone_number').bind('focusout', function() {
		if($j(this).attr('value') == '') {
			$j(this).attr('value', 'XXXXXXXXXX');
		}
	});
});


$j(document).ready(function() {
	/*  Handle searching for rates  */
	$j('.rate_calc_form a.btn_search').click(function(e){
		// Hide the rate-chart if it's visible.
		hideRateCharts();

		clearErrorState();

		// Perform the search - grandfathered states are taken into account when data is returned (prevents further
		// complicating the back-end).
		$j.post('../../../../vmuInternationalConnectServlet', {
			phone_prefix: $j('.rate_calc_form #phone_prefix :selected').attr('value'),
			phone_number: $j('.rate_calc_form #phone_number').attr('value')
		}, function(data) {

			var rates = $j.parseJSON(data);

			// Replaces what the user entered as a phone number with the returned, (and possibly) cleaned-up version.
			$j('.rate_calc_form #phone_number').attr('value', rates.phone_number);

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
			var plan = $j('.rate_calc_form .rate_selection input[name="rate_set"]:checked').attr('value');
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
			$j('.rate_calc_search_results li p').removeClass('subtle');
			$j('.rate_calc_search_results li p').removeClass('stacked');

			// Update (both) rate charts.
			updateRateCharts(rateset);

			// Determine which chart to show.
			if ((rateset.specific_std == rateset.specific_add5 && rateset.specific_add5 == rateset.specific_add10)
				&& (rateset.other_min_std == rateset.other_min_add5 && rateset.other_min_add5 == rateset.other_min_add10)) {
				$j('#search_results_note').show();
			} else {
				//if (rateset.subgpu.substr(1,3) > 200) {
				//	$j('#search_results.single').slideDown(300);
				//} else {
					$j('#search_results').show();
				//}
			}
			
			resizeSelf();
			
			return true;
		});

		e.preventDefault();
	});
});


$j(document).ready(function() {
	/*  When a user hits 'enter' or 'return' when a form field has focus, it'll automatically submit the form. We
	    are trapping the form submission and instead, replacing it with a .click() event on the search button.  */
	$j('form#rate_calculator_form').bind('submit', function(e) {
		$j('.rate_calc_form a.btn_search').click();
		e.preventDefault();
	});
});






/*  Hides the rate charts (if they're visible)  */
function hideRateCharts( ) {
	if ($j('#search_results').is(':visible')) {
		$j('#search_results').hide();
	}
	if ($j('#search_results_note').is(':visible')) {
		$j('#search_results_note').hide();
	}
	if ($j('#search_results.single').is(':visible')) {
		$j('#search_results.single').hide();
	}
}


/*  Remove error states (if necessary)  */
function clearErrorState( ) {
	$j('.rate_calc_form #phone_number').removeClass('error');
	$j('.error_message').hide();
}


/*  Display an error in the rate finder form.  */
function showError( error ) {
	$j('.rate_calc_form #phone_number').addClass('error');
	$j('.error_message').show();
}


/*  Updates the rate charts (both).  */
function updateRateCharts( rateset ) {

	//single_row = (rateset.subgpu.substr(1,3) > 200) ? true : false;

	// Specific rates
	$j('#search_results #country-name').html(rateset.country);
	$j('#search_results #specific_label').html(rateset.specific_type);
	$j('#search_results #specific_standard_rate').html(specificRateFormatter($j('#search_results #specific_standard_rate'), rateset.specific_std, rateset.specific_std, true));
	$j('#search_results #specific_ic_rate').html(specificRateFormatter($j('#search_results #specific_ic_rate'), rateset.specific_std, rateset.specific_add5, false));
	$j('#search_results #specific_icp_rate').html(specificRateFormatter($j('#search_results #specific_icp_rate'), rateset.specific_std, rateset.specific_add10, false));

	// Other rates
	$j('#search_results #other_label').html(rateset.other_type);
	$j('#search_results #other_standard_rate').html(otherRateFormatter($j('#search_results #other_standard_rate'), rateset.other_min_std, rateset.other_min_std, rateset.other_max_std, true));
	$j('#search_results #other_ic_rate').html(otherRateFormatter($j('#search_results #other_ic_rate'), rateset.other_min_std, rateset.other_min_add5, rateset.other_max_add5, false));
	$j('#search_results #other_icp_rate').html(otherRateFormatter($j('#search_results #other_icp_rate'), rateset.other_min_std, rateset.other_min_add10, rateset.other_max_add10, false));

	// Note - no discount chart
	$j('#search_results_note').html('The number you entered calls ' + rateset.country + '. This number is not included in either of our International Connect offers, but our standard rates are still a great option.');

	// Set the 'Best Deal' icon position.
	var plan = $j('.rate_calc_form .rate_selection input[name="rate_set"]:checked').attr('value');
	if (plan == 1) {
		if (rateset.specific_add5 <= rateset.specific_add10) {
			$j('.rate_calc_search_results #best_deal').addClass('add5');
			$j('.rate_calc_search_results').removeClass('gf').addClass('add5');
		} else {
			$j('.rate_calc_search_results #best_deal').removeClass('add5');
			$j('.rate_calc_search_results').removeClass('gf').removeClass('add5');
		}
	} else {
		$j('.rate_calc_search_results').removeClass('add5');
		$j('.rate_calc_search_results').addClass('gf');
	}
}


/*  Nicely formats the rate for display in the rate chart.  */
function specificRateFormatter( obj, std_rate, rate, is_std ) {
	std_rate = parseFloat(std_rate);
	rate = parseFloat(rate);

	// Does the standard rate apply?
	if (!is_std && std_rate == rate) {
		$j(obj).addClass('subtle');
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
		$j(obj).addClass('subtle');
		return 'Standard Rate Applies';
	}

	if (is_std) {
		if (min_rate < max_rate && min_rate != '0.00') {
			rate_string = 'As low as<br/>';
			$j(obj).addClass('stacked');
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