var RATE_5=5, RATE_10=10;
var rateset = {};

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

			// Update (both) rate charts.
			updateRateCharts();

			$j('#search_results').show();
			
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
function updateRateCharts()
{
	// Specific rates
	$j('#search_results #country-name').html(rateset.country);
	$j('#search_results #specific_label').html(rateset.specific_type);
	$j('#search_results #specific_ic_rate').html(specificRateFormatter(RATE_5));
	$j('#search_results #specific_icp_rate').html(specificRateFormatter(RATE_10));

	// Other rates
	$j('#search_results #other_label').html(rateset.other_type);
	$j('#search_results #other_ic_rate').html(otherRateFormatter(RATE_5));
	$j('#search_results #other_icp_rate').html(otherRateFormatter(RATE_10));
	
	// Note - no discount chart
	$j('#search_results_note').html('The number you entered calls ' + rateset.country + '. This number is not included in either of our International Connect offers, but our standard rates are still a great option.');
}


function countryRateOveride(rateType, lineType)
{
	if( rateset.country == 'Dominican Republic' && rateType == RATE_10 && lineType == 'Landline' ) { return true; }
	if( rateset.country == 'Mexico' && rateType == RATE_10 && lineType == 'Mobile' ) { return true; }
	
	return false;
}


function specificRateFormatter(rateType)
{
	if( countryRateOveride(rateType, rateset.specific_type) ) { return 'Included with Plan Allowance**'; }
	
	var rate = (rateType == RATE_5) ? parseFloat(rateset.specific_add5) : parseFloat(rateset.specific_add10);
	if (parseFloat(rateset.specific_std) == rate && rate > 0) { return 'Not included'; }
	if (rate >= '1.00') { return 'Not included'; }
	if (rate.toFixed(2) == '0.00') { return 'UNLIMITED'; }
	return 'Not included';
}


function otherRateFormatter(rateType)
{
	if( countryRateOveride(rateType, rateset.other_type) ) { return 'Included with Plan Allowance**'; }
		
	var asLowAs = '';
	var min_rate = (rateType == RATE_5) ? parseFloat(rateset.other_min_add5) : parseFloat(rateset.other_min_add10);
	var max_rate = (rateType == RATE_5) ? parseFloat(rateset.other_max_add5) : parseFloat(rateset.other_max_add10);

	if (parseFloat(rateset.other_min_std) == min_rate && min_rate > 0) { return 'Not included'; }
	if (min_rate < max_rate) { asLowAs = ' for Most Locations*'; }
//	if (min_rate >= '1.00') { return 'Not included'; }
	if (min_rate.toFixed(2) == '0.00') { return 'UNLIMITED' + asLowAs; }
	
	return 'Not included';
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