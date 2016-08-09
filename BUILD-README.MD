
## SPRINT SHOP BUILD

The build commmands for the Sprint shop are automated with the [Grunt](http://gruntjs.com/) command line tool. This file document the installation procedure for Grunt and how to use the build script.

### Installation

Node.js and NPM must be installed first in order to use Grunt. Follow the installations instructions on https://nodejs.org/download/

Once they are installed you can install Grunt with the following command : 

    npm install -g grunt-cli

Then you can install the different Grunt plugins used in the project also with NPM : 

    cd ui-shop
    npm install

That's it for the installation !

### Usage

Grunt is a tool capable of running different 'tasks' that can be combined to complete the build procedure. You can view the list of the tasks and the different Grunt arguments by entering : 

    grunt --help

### Main tasks

    # The default task, can be runned with 'grunt'
    # Simple build, just copy the files and add them to the war in /build
    grunt build

    # Create the war file and the 19089-CXP902_7485-SPP-shop-frontend zip in /build
    grunt build-release
      
    # Do the build and send the war file to the local tomcat /webapps directory
    grunt build-tomcat

    # Build + Minify all the files before adding them to the war file
    grunt build-min 
     
    # Task to execute the Postman APIs testing for the backend
    grunt test-backend


### Other tasks

    # List the contents of the generated war file
    grunt shell:lswar
    
    # Analyse the javascript code and output potential improvements
    grunt jshint

    # Analyse the javascript code and output a simple complexity chart
    grunt complexity:simple

    # Analyse the javascript code and output a full complexity analysis
    grunt complexity:generic

    # Deploy the war file to a remote tomcat server
    grunt tomcat_deploy

    # Redeploy the war file to a remote tomcat server
    grunt tomcat_redeploy

    # Continuously check the JS files for changes and run jshint
    grunt watch:jshint
    

### Questions ?

francis.bonneau@ericsson.com