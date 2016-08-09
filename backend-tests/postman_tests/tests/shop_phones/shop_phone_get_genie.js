/*
 * SPRINT SELF-CARE PROJECT FRONTEND API TESTING
 * francis.bonneau@ericsson.com
 *
 * Tests for /primary-rest/shop_phone_get_genie?brandId=SPP
 * 
 */

/*********************** Tests Setup ***********************/

var url = environment.protocol + ":" + environment.host + ":" + environment.port + "/primary-rest/shop_phone_get_genie?brandId=SPP";

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
        testNotEmpty("element #" + i, "@uuid", element['@uuid']);

        testNotEmpty("element #" + i, "phoneGenieListResponse", element.phoneGenieListResponse);

        if (!_.isEmpty(element.phoneGenieListResponse)) {

            testNotEmpty("phoneGenieListResponse", "description", element.phoneGenieListResponse.description);
            testNotEmpty("phoneGenieListResponse", "status", element.phoneGenieListResponse.status);
            testNotEmpty("phoneGenieListResponse", "phone", element.phoneGenieListResponse.phone);

            var phoneList = element.phoneGenieListResponse.phone;

            var j = 0;
            _.forEach(phoneList, function(phone) {
                
               testNotEmpty("the phone #" + i, "phoneName", phone.phoneName);
               
               var testPrefix;

                if (_.isEmpty(phone.phoneName)) {
                    testPrefix = i;
                } else {
                    testPrefix = phone.phoneName['$'].replace(/(\r\n|\n|\r)/gm," ");
                }


                //testNotEmpty(testPrefix, "associatedAccessoryId", phone.associatedAccessoryId);

                testNotEmpty(testPrefix, "compareImages", phone.compareImages);
                if (!_.isEmpty(phone.compareImages.compareImage)) {
                    _.forEach(phone.compareImages.compareImage, function(img) { 
                        testNotEmpty(testPrefix, "fileName", img.fileName);
                        testNotEmpty(testPrefix, "uRI", img.uRI);
                    });
                }

                testNotEmpty(testPrefix, "disclaimerMini", phone.disclaimerMini);
                testNotEmpty(testPrefix, "externalUrl", phone.externalUrl);


                testNotEmpty(testPrefix, "filters", phone.filters);
                if (!_.isEmpty(phone.filters)) {
                    testNotEmpty(testPrefix, "filters.feature", phone.filters.feature);
                }

                testNotEmpty(testPrefix, "generalAvailabilityDate", phone.generalAvailabilityDate);
                testNotEmpty(testPrefix, "genieOrder", phone.genieOrder);
                testNotEmpty(testPrefix, "manufacturerName", phone.manufacturerName);
                testNotEmpty(testPrefix, "phoneType", phone.phoneType);

                testNotEmpty(testPrefix, "phoneVariants", phone.phoneVariants);
  
                if(!_.isEmpty(phone.phoneVariants)) {

                    var k = 0;
                    _.forEach(phone.phoneVariants, function(phoneVariant) {

                        testPrefix = testPrefix + " phoneVariant #"  + k;

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

                        k = k +1;
                    });

                }

                testNotEmpty(testPrefix, "shortDescription", phone.shortDescription);
                
            });
            
        }

        i = i + 1;
    });

}


/********************* Tests Teardown **********************/

// Post-testing formatting
teardown();


