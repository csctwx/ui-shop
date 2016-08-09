/*
 * SPRINT SELF-CARE PROJECT FRONTEND API TESTING
 * francis.bonneau@ericsson.com
 *
 * Tests for /primary-rest/shop_get_phones_by_brand_id?brandId=spp
 * 
 */

/*********************** Tests Setup ***********************/

var url = environment.protocol + ":" + environment.host + ":" + environment.port + "/primary-rest/shop_get_phones_by_brand_id?brandId=spp";

// Define the setup, teardown, loadJS, loadPostmanVariables, grepModeFilters and testNotEns
function loadJS(e){var t=document.createElement("script");t.type="text/javascript",t.async=!1,t.src=e,(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(t)}function loadPostmanVariables(){var e={};return e.showOnlyFailed=JSON.parse(globals.showOnlyFailed),e.showValues=JSON.parse(globals.showValues),e.grepMode=JSON.parse(globals.grepMode),e.debugMode=JSON.parse(globals.debugMode),e}function grepModeFilter(e){return e=_.mapKeys(e,function(e,t){return e===!0?url+"\n      PASS: "+t+"\n":url+"\n      FAIL: "+t+"\n"})}function testNotEmpty(e,t,n){var s,a=!_.isEmpty(n);a?(_.isEmpty(n.$)||(n=n.$),s=e+" has a "+t,env.showValues&&(s=s+" : "+n,s.length>100&&(s=s.substring(0,97)+"..."))):s=e+" doesn't have a "+t,env.showOnlyFailed?a===!1&&(tests[s]=a):tests[s]=a}function setup(e){var e=loadPostmanVariables(environment);return e}function teardown(){env.grepMode&&(tests=grepModeFilter(tests))}

var env = setup(env);

/************************* Testing *************************/

tests["Status code is 200"] = responseCode.code === 200;

tests["Response time is less than 5000ms"] = responseTime < 5000;

//------------------------------------------------- Data validation tests

//var data = xmlToJson(responseBody);
var data = JSON.parse(responseBody);

var response =  data.responses.response[0];

testNotEmpty("the body", "response", response);
 
if (!_.isEmpty(response)) {

    var phonesList = data.responses.response[0].getListPhonesResponse.phones;
    testNotEmpty("the response", "phonesList", phonesList);

    if (!_.isEmpty(phonesList)) {
        
        var i = 0;

        _.forEach(phonesList.phone, function(phone) {
            
            testNotEmpty("the phone #" + i, "phoneName", phone.phoneName);

            if (_.isEmpty(phone.phoneName)) {
                var testPrefix = i;
            } else {
                var testPrefix = phone.phoneName['$'].replace(/(\r\n|\n|\r)/gm," ");
            }

            testNotEmpty(testPrefix, "externalUrl", phone.externalUrl);
            testNotEmpty(testPrefix, "manufacturerName", phone.manufacturerName);
            testNotEmpty(testPrefix, "shortDescription", phone.shortDescription);

            testNotEmpty(testPrefix, "filters", phone.filters);
            if (!_.isEmpty(phone.filters)) {
                testNotEmpty(testPrefix, "filters.feature", phone.filters.feature);
            }
            
            testNotEmpty(testPrefix, "phoneType", phone.phoneType);

            testNotEmpty(testPrefix, "phoneVariants", phone.phoneVariants);

            if(!_.isEmpty(phone.phoneVariants)) {

                var j = 0;
                _.forEach(phone.phoneVariants, function(phoneVariant) {

                    testPrefix = testPrefix + " phoneVariant #"  + j;

                    testNotEmpty(testPrefix, "sku", phoneVariant.sku);
                    testNotEmpty(testPrefix, "price", phoneVariant.price);
                    testNotEmpty(testPrefix, "inventory", phoneVariant.inventory);


                    //testNotEmpty(testPrefix, "memoryVariant", phoneVariant.memoryVariant);
                    //testNotEmpty(testPrefix, "colorVariant", phoneVariant.colorVariant);
                    //testNotEmpty(testPrefix, "grandientColor", phoneVariant.grandientColor);

                    testNotEmpty(testPrefix, "shopGridPicture", phoneVariant.shopGridPicture);
                    // perform additionnal testing if there is a shopGridPicture
                    if (!_.isEmpty(phoneVariant.shopGridPicture)) {
                        testNotEmpty(testPrefix + " shopGridPicture", "fileName", phoneVariant.shopGridPicture.fileName);
                        testNotEmpty(testPrefix + " shopGridPicture", "uRI", phoneVariant.shopGridPicture.uRI);
                    }

                    testNotEmpty(testPrefix, "heroImage", phoneVariant.heroImage);
                    // perform additionnal testing if there is a heroImage
                    if (!_.isEmpty(phoneVariant.heroImage)) {
                        testNotEmpty(testPrefix + " heroImage", "fileName", phoneVariant.heroImage.fileName);
                        testNotEmpty(testPrefix + " heroImage", "uRI", phoneVariant.heroImage.uRI);
                    }

                    j = j +1;
                });

            }
            i = i + 1;

        }); // _.forEach(phonesList, function(phone) {

    }
}


/********************* Tests Teardown **********************/

// Post-testing formatting
teardown();
