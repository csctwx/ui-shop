
## SPRINT SELF-CARE PROJECT FRONTEND API TESTING

This folder contains the tests for the backend APIs used by the shop frontend in the Sprint self-care project. The frontend is a angular.js application that use a lot of differents REST calls to populate the views. For example, those calls include the phones descriptions, features and price data that is then rendered in the UI. All that data is stored in MSDP, and the REST APIs are also served from MSDP and the adaption node specific to this project. 

The tests are used to validate that all the data returned by the REST APIs is present and valid.

### Prerequistes & installation

The tests are written and executed with a tool called [Postman](https://www.getpostman.com). Postman is a chrome web application where the tests can be executed and modified, but for easier automation it is prefered to use another tool by the same developpers than Postman, called [Newman](https://github.com/postmanlabs/newman).

Installing Postman is simple, just install it from the Chrome web store and follow the [launch instructions](https://www.getpostman.com/docs/launch).

Installing Newman is a bit more complex, you need Node.js and NPM, they can be downloaded on [https://nodejs.org/download/](https://nodejs.org/download/). Then to install Newman use the following command : 

    npm install -g newman

### Structure

The folders are organized the following way : 

    .
    ├── data.csv    # The data file contains the phones list and the data that needs to be validated
    ├── newman.sh   # Script to run the tests
    ├── postman_tests
    │   ├── globals.postman_globals       # Postman global variables
    │   ├── lib
    │   │   └── util.js                   # Shared JS function across the tests
    │   ├── Mockwire.postman_environment  # Mockwire Postman env variables
    │   ├── Sprint_Live_website.postman_environment # Prod Postman env variables
    │   └── tests   # The actual tests, this is a just a copy, the executed code is in the postman_collection file
    │       ├── home
    │       ├── shop_phones
    │       └── shop_phones_details
    ├── README.MD
    ├── Sprint_MSDP.json.postman_collection  # The Postman tests file that can be imported
    └── wiremock    # Wiremock is a tool to mock the REST APIs if needed
        ├── __files
        ├── mappings
        └── wiremock-1.55-standalone.jar


### Usage

To run the tests you can use Postman and import the tests collection & environnement, or you can use Newman in the command line directly. Provided is a bash script that run Newman with the correct parameters : 

    ./newman.sh

By default all the tests results are displayed, but that is a lot of output so to display only the failed tests you can filter the output with grep : 

    ./newman.sh | grep -B 1 FAIL


### Questions ?

francis.bonneau@ericsson.com