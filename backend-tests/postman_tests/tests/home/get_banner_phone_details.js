/*
 * SPRINT SELF-CARE PROJECT FRONTEND API TESTING
 * francis.bonneau@ericsson.com
 *
 * Tests for /primary-rest/get_banner_phone_details?brandId=SPP
 * 
 */

/*********************** Tests Setup ***********************/

var url = environment.protocol + ":" + environment.host + ":" + environment.port + "/primary-rest/get_banner_phone_details?brandId=SPP";

// Define the setup, teardown, loadJS, loadPostmanVariables, grepModeFilters and testNotEns
function loadJS(e){var t=document.createElement("script");t.type="text/javascript",t.async=!1,t.src=e,(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(t)}function loadPostmanVariables(){var e={};return e.showOnlyFailed=JSON.parse(globals.showOnlyFailed),e.showValues=JSON.parse(globals.showValues),e.grepMode=JSON.parse(globals.grepMode),e.debugMode=JSON.parse(globals.debugMode),e}function grepModeFilter(e){return e=_.mapKeys(e,function(e,t){return e===!0?url+"\n      PASS: "+t+"\n":url+"\n      FAIL: "+t+"\n"})}function testNotEmpty(e,t,n){var s,a=!_.isEmpty(n);a?(_.isEmpty(n.$)||(n=n.$),s=e+" has a "+t,env.showValues&&(s=s+" : "+n,s.length>100&&(s=s.substring(0,97)+"..."))):s=e+" doesn't have a "+t,env.showOnlyFailed?a===!1&&(tests[s]=a):tests[s]=a}function setup(e){var e=loadPostmanVariables(environment);return e}function teardown(){env.grepMode&&(tests=grepModeFilter(tests))}

var env = setup(env);

/************************* Testing *************************/

// Default tests

tests["Status code is 200"] = responseCode.code === 200;
tests["Response time is less than 5000ms"] = responseTime < 5000;

// Data validation tests

var data = JSON.parse(responseBody);

var response =  data.responses.response;

testNotEmpty("the body", "response", response);
 
if (!_.isEmpty(response)) {

    var i = 0;
    _.forEach(response, function(element) {
    
        //testNotEmpty("element #" + i, "@class", element['@class']);
        testNotEmpty("element #" + i, "@code", element['@code']);
        testNotEmpty("element #" + i, "@name", element['@name']);
        testNotEmpty("element #" + i, "@position", element['@position']);
        testNotEmpty("element #" + i, "@uuid", element['@uuid']);

        i = i + 1;
    });

}


/********************* Tests Teardown **********************/

// Post-testing formatting
teardown();
