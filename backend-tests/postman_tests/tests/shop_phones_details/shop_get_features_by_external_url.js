/*
 * SPRINT SELF-CARE PROJECT FRONTEND API TESTING
 * francis.bonneau@ericsson.com
 *
 * Tests for /shop_get_features_by_external_url?phoneId={{phoneId}}&brandId=SPP
 * 
 */

/*********************** Tests Setup ***********************/
var url = environment.protocol + ":" + environment.host + ":" + environment.port + "/primary-rest/shop_get_features_by_external_url?phoneId=" + environment.phoneId + "&brandId=SPP";

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

        testNotEmpty("element #" + i, "getFeaturesResponse", element.getFeaturesResponse);

        if (!_.isEmpty(element.getFeaturesResponse)) {

            testNotEmpty("getFeaturesResponse", "description", element.getFeaturesResponse.description);
            testNotEmpty("getFeaturesResponse", "status", element.getFeaturesResponse.status);

            testNotEmpty("getFeaturesResponse", "phoneFeatures", element.getFeaturesResponse.phoneFeatures);
            var phoneFeatures = element.getFeaturesResponse.phoneFeatures;

            if (!_.isEmpty(phoneFeatures)) {

                var j = 0;

                testNotEmpty("features", "generalFeatures", phoneFeatures.generalFeatures);
                if (!_.isEmpty(phoneFeatures.generalFeatures)) {

                    j = 0;
                    _.forEach(phoneFeatures.generalFeatures, function(feature) {                    
                        testNotEmpty("generalFeatures #" + j, "description", feature.description);
                        testNotEmpty("generalFeatures #" + j, "title", feature.title);
                        testNotEmpty("generalFeatures #" + j, "type", feature.type);
                        j = j + 1;
                    });
                }

                testNotEmpty("features", "specialFeatures", phoneFeatures.specialFeatures);
                if (!_.isEmpty(phoneFeatures.specialFeatures)) {

                    j = 0;
                    _.forEach(phoneFeatures.specialFeatures, function(feature) {                                            
                        testNotEmpty("specialFeatures #" + j, "title", feature.title);
                        //testNotEmpty("specialFeatures #" + j, "type", feature.type);
                        j = j + 1;
                    });

                }

                testNotEmpty("features", "specifationImage", phoneFeatures.specifationImage);
                if (!_.isEmpty(phoneFeatures.specifationImage)) {

                    testNotEmpty("specifationImage", "fileName", phoneFeatures.specifationImage.fileName);
                    testNotEmpty("specifationImage", "uRI", phoneFeatures.specifationImage.uRI, tests, env);            
                }

                testNotEmpty("features", "technicalFeatures", phoneFeatures.technicalFeatures);
                if (!_.isEmpty(phoneFeatures.technicalFeatures)) {

                    testNotEmpty("technicalFeatures", "memory", phoneFeatures.technicalFeatures.memory);
                    testNotEmpty("technicalFeatures", "os", phoneFeatures.technicalFeatures.os);
                    testNotEmpty("technicalFeatures", "processor", phoneFeatures.technicalFeatures.processor);

                    testNotEmpty("technicalFeatures", "group", phoneFeatures.technicalFeatures.group);

                    if (!_.isEmpty(phoneFeatures.technicalFeatures.group)) {

                        j = 0;      
                        _.forEach(phoneFeatures.technicalFeatures.group, function(featureGroup) {                                            
                            testNotEmpty("specialFeatures group #" + j, "@id", featureGroup['@id']);
                            testNotEmpty("specialFeatures group #" + j, "order", featureGroup.order);
                            testNotEmpty("specialFeatures group #" + j, "specs", featureGroup.specs);


                            if (!_.isEmpty(featureGroup.specs.spec)) { 


                                var k = 0;
                                _.forEach(featureGroup.specs.spec, function(spec) { 
                                    testNotEmpty("specialFeatures group #" + j + " spec #" + k, "$", spec['$']);
                                    testNotEmpty("specialFeatures group #" + j + " spec #" + k, "@order", spec['@order']);
                                    testNotEmpty("specialFeatures group #" + j + " spec #" + k, "@type", spec['@type']);
                                    k = k + 1;
                                });

                            }

                            j = j + 1;
                        });

                    } // if (!_.isEmpty(phoneFeatures.technicalFeatures.group)) {

                } // if (!_.isEmpty(phoneFeatures.technicalFeatures)) {

            } // if (!_.isEmpty(phoneFeatures)) {

        }

        i = i + 1;
    });

}


/********************* Tests Teardown **********************/

// Post-testing formatting
teardown();


