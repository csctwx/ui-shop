/*
 * SPRINT SELF-CARE PROJECT FRONTEND API TESTING
 * francis.bonneau@ericsson.com
 */

 /*********************** Utilities ***********************/

// Function used to inject an external JS file into Postman
// doesnt work with the Newman cli tool
function loadJS(url){
  var newscript = document.createElement('script');
  newscript.type = 'text/javascript';
  newscript.async = false;
  newscript.src = url;
  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
}

// Parse the string variables defined in the Postman environment
function loadPostmanVariables(environment) { 

    var env = {};

    // Show only the tests that failed
    env.showOnlyFailed = JSON.parse(globals['showOnlyFailed']);

    // Show all the tested properties values (only if showOnlyFailed = false)
    env.showValues = JSON.parse(globals['showValues']);

    // Add the PASS: or FAIL: to each test name for easier console filtering
    env.grepMode = JSON.parse(globals['grepMode']);

    // additionnal debugging info
    env.debugMode = JSON.parse(globals['debugMode']);

    return env;
}   

function grepModeFilter(tests, env) {

    tests = _.mapKeys(tests, function(value, key) { 
        if (value === true) {
            return url + "\n" + "      PASS: " + key + "\n";
        } else {
            return url + "\n" + "      FAIL: " + key + "\n";
        }
    });
    return tests;
}

function testNotEmpty(outputPrefix, fieldName, fieldValue) {     
    
    var testResult = !_.isEmpty(fieldValue);
    var testName;

    if (testResult) {
        
        // take care of the $ symbol in every parameter
        if (!_.isEmpty(fieldValue['$'])) fieldValue = fieldValue['$'];
        
        testName = outputPrefix + " has a " + fieldName;

        if (env.showValues) {
            testName = testName + " : " + fieldValue;

            if (testName.length > 100) {
                testName = testName.substring(0,97) + "...";    
            }            
        }

    } else {
        testName = outputPrefix + " doesn't have a " + fieldName;
    }

    if(env.showOnlyFailed) {
        if (testResult === false) tests[testName] = testResult;
    } else { 
        tests[testName] = testResult;
    } 
}


/*********************** Scaffolding ***********************/

function setup(env) {

    var env = loadPostmanVariables(environment);

    return env;
}

function teardown() {

    if (env.grepMode) tests = grepModeFilter(tests);
 }
