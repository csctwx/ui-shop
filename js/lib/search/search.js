
//Wrap in try/catch for graceful error failure
try {
    //Instantiate the class
    var bmSearchClass = new bmSearch();
} catch (error) {
    //Throw errors to console instead of breaking page
    console.log(error.message);
    console.log(error.stack);
}


/**
 * Manages all of the interaction and functionality of the search page
 * @returns {undefined}
 */
function bmSearch(){
    'use strict';
    var self = this;
    
    //Public Vars
    self.vars = {
        searchTerm: urlParams.q,                                //Get search term from the URL params. This value is set in /_themes/h5bp/js/scripts.post.js
        merchFeedPath: '/feed/search-merch/',                        //URL to ajax search merch content from
        merchInput: $('#searchMerchInput'),                     //jQuery object of input box containing the keyword to use for the merch search
        merchOutput: $('#searchMerchResults'),                  //jQuery object of div container to place the merch search content results
        merchProductContainer: '.frame',                        //jQuery selector (NOT object) of an individual merch search product
        googleKey: googlekey,          //API key used by google search JS file
        page: 'search'
    };
    
    /* Check if we are on spanish, use that API key in stead */
    if(window.location.host === host_es || urlParams.lang === 'es'){
        self.vars.googleKey = googlekey_es;
    }
    
    //Object to keep track of async loaded content
    self.vars.content = {
        asyncResourcesLoaded: 0,                                //Counter to increment after async resources have been loaded. Leave at 0.
        asyncResourcesTotal: 2                                  //Total number of async resourcs loaded by this JS file. Should be just google and the merch search
    };

    //We need to know if this is an initial load of the search page or a refresh
    //Check if the referring page is different than the current page. Also make sure the #search hashtag is NOT present in the URL
    if (document.referrer.split('?')[0] !== window.location.href.split('?')[0] && window.location.hash !== '#search') {
        self.vars.firstLoad = true;
    } else {
        self.vars.firstLoad = false;
    }
    

    //If we're working locally, grab merch search from this resource instead. Redirects don't work locally
    if(window.location.host === 'localhost:8080'){
        self.vars.merchFeedPath = '/ServletTransformer?xml=/www/_themes/h5bp/xml/phones.xml&xsl=/www/_themes/h5bp/xsl/widgets/merch-search.xsl';
    }

    /**
     * Initialize the main search page
     * @returns {undefined}
     */
    self.initialize = function() {
        //Set a hashtag of search in the URL. This allows us to detect page refreshes
        window.location.hash = 'search';
        merchSearch.load();
        banners();
        analytics.linkTagging();
        events.checkLoaded('.gsc-results',events.loadComplete);
    };
    
    /**
     * Initialize the standalone search page used by the 404 page
     * @returns {undefined}
     */
    self.initializeSolo = function(){
        console.log('self.initializeSolo');
        self.vars.page = 'solo';
        $(".banners").load("/search/ .banners", function() {
            banners();
        });

        analytics.linkTagging();
        events.checkLoaded('.gsc-results', events.loadComplete);
    };
    

    //Class for items relating to the product placement element that appears on the search page
    var merchSearch = {
        /**
         * Remote loads the content we want in the merchant area of the search page
         * @returns {undefined}
         */
        load: function(){
            //Make sure a search term has been set, otherwise don't do anything
            if (self.vars.searchTerm !== undefined) {
              /*
                //Remote load the search content
                $.ajax({
                    url: self.vars.merchFeedPath
                }).done(function(content) {
                    //console.log('Done');
                    //Load the returned content into the search merch content area
              */
              console.log($("#searchData").html());
                    self.vars.merchOutput.html(parent.$("#searchData").html());
                    events.loadComplete('merchSearch');
              /*
                }).error(function(error){
                    console.log('Problem with product feed: '+error.statusText);
                    //On error, increment the count anyway. Ensures that all the page complete scripts fire anyway
                    events.loadComplete();
                });
              */
            }
        },
 
         /*
          * Controls the presentation of the merch search content on the page, initializes the quick search plugin to determine which products get displayed
          * @param {type} searchTerm - Keyword/s to supply to search products for
          * @returns {undefined}
          */
        showContent: function(searchTerm) {
            //console.log('merchSearch.showContent');
            //Update the input box with the search term we want quick search to use
            self.vars.merchInput.val(searchTerm);
            
            //Get jQuery collection of merch search items
            self.vars.merchContent = self.vars.merchOutput.find(self.vars.merchProductContainer);
            //Initialized quick search plugin. Documentation: https://github.com/riklomas/quicksearch
            self.vars.qs = self.vars.merchInput.quicksearch(self.vars.merchContent, {
                /**/
                show: function() {
                    $(this).addClass('show');  //Add a class of show to visible elements
                },
                //'delay': 300,
                hide: function() {
                    $(this).removeClass('show');
                    //'onAfter': function() {}
                }
            });
            //Remove all but the first 3 matching results
            self.vars.merchContent.not('.show:lt(3)').remove();
            //Now that merch search has been initialized, update the jQuery collection to only contain items that are visible
            self.vars.merchContent = self.vars.merchContent.filter('.show');
            //Check if any merch search products are visible
            if(self.vars.merchContent.length > 0){
                //Gracefully fade in the content box
                self.vars.merchOutput.parent().fadeIn();
            }
        }
    };

    /**
     * Displays a random banner in the right column of the page
     * @returns {undefined}
     */
    var banners = function(){
        
        //Get all banners
        self.vars.banners = $('.banners a'); 
        //Get all banners whose data-keyword attribute contains the searched keyword
        var banners = self.vars.banners.filter('[data-keywords *= "'+self.vars.searchTerm+'"]');
        //Check if the keyword result above returned no results, load all banners
        if(banners.length === 0){
            banners = self.vars.banners;
        }
        
        //Show random banner
        var random = Math.round(Math.random() * banners.length);
        banners.eq(random - 1).show();
       
    };
    
    //Class for loading and interacting with the google search API
    var googleAPI = {
        /**
         * Loads the Google javascript file used for custom search
         * @returns {undefined}
         */
        load: function(){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = '//www.google.com/cse/cse.js?cx=' + self.vars.googleKey;
            document.getElementsByTagName('head')[0].appendChild(script);
            //Start checking for when the search form is loaded
            events.checkLoaded('.gsc-results',events.loadComplete);
        },
        
        /**
         * Checks if Google has supplied an auto-corrected word for a misspelling, update the merch search product display
         * This is not the most effecient way to do this because we are re-initializing the quick search plugin instead of just updating the currently displayed products
         * This is necessary because jQuery CANNOT detect when an input value was changed programatically which is what quicksearch uses to determine which content is displayed
         * This also lets us de-couple the load times of the google form and merch search for a big performance gain since the re-init only fires when a misspelling is found
         * @returns {undefined}
         */
        spellCheck: function() {
            //console.log('merchSearch.spellCheck');
            //Check if a spelling fix is found
            var spellingFix = $('.gs-spelling i:first').html();
            //If so, reinitialize the merch search component with the spell corrected word
            if (spellingFix !== null) {
                merchSearch.showContent(spellingFix);
            }
        }
    };
    
    //Class for analytics/tracking
    var analytics = {
        /**
         * Manages the omniture tracking data that get set by the page onLoad
         * @returns {undefined}
         */
        trackPage: function() {
            console.log('analytics.trackPage');
            //Get current page of results
            self.vars.pageNum = $('.gsc-tabdActive .gsc-cursor-current-page').text() * 10;
            //Label + Search Term
            self.vars.label = $('.gsc-tabsArea .gsc-tabhActive').text().replace('&','and');
            
            //Generic Omniture vars
            //Some of this data is being provided by the page in search.xml
            s.channel = s.prop72 = s.prop71 = 'Search';
            
            //Make sure this is the first page load of search, not a refresh of paginate
            if(self.vars.firstLoad === true){
                self.vars.firstLoad = false;
                s.events = 'event98';
            }

            s.eVar1 = s.prop20 = self.vars.searchTerm + ' | ' + self.vars.label;
            s.list1 = "";
            
            //Get the number of results returned by Google
            //Check if the number is zero
            if ($('.gs-no-results-result .gs-snippet').length !== 0) {
                s.eVar2 = 'zero';
                s.eVar1 = s.prop20 = self.vars.searchTerm + ' | ' +'All';
                s.events = 'event98';
            //If not zero, do this
            } else {
                s.eVar2 = $('.gsc-above-wrapper-area .gsc-result-info').text().split(' ')[1];
                
                //List values
                var results = $('.gsc-tabdActive .gsc-webResult .gsc-webResult'); //Load into var for performance
                //Check if a spelling correction is present, remove from jQuery collection. Spelling correction appears in the DOM has another search result which skews the count
                if (results.eq(0).find('.gs-spelling').length !== 0) {
                    delete(results[0]);
                }
                //Loop thru remaining search options, build s.list1 variable
                if (results.length !== 0) {
                    //Loop through available results, build s.list1 data
                    results.each(function(index) {
                        s.list1 += "spot" + (index + 1 + self.vars.pageNum - 10);
                        if (index < results.length - 1) {
                            s.list1 += ', ';
                        }
                    });
                }
            }

            //Check if merch search results are visible
            if (self.vars.page !== 'solo' && self.vars.merchContent.length !== 'undefined') {
                //If merch search results are present, we need to update the omniture s.list1 value
                var list = "";
                //Since only 3 merch search items are allowed to be visible on the page, cap the count at 3
                var count = self.vars.merchContent.length;
                if (self.vars.merchContent.length > 3) {
                    count = 3;
                }

                //Loop through available results, add the appropriate values to the list variable
                var i = 1;
                while (i <= count) {
                    list += 'spotF' + (i) + ', ';
                    i++;
                }
                //Now that the list variable has been built, APPEND to the front of the s.list1 var. This ensures that even if google is loaded after merch, the values will still be in the correct location. F values should be in FRONT.
                s.list1 = list + s.list1;
            }
            //All done, send to omniture
            analytics.submit();
        },
        
        /**
         * Add tracking tags to all the links on the page
         * Note that we are using event handlers on the master parent elements. This way we do NOT have to retag content everytime it is swapped out via google
         * Also, the links are only updated on mouse over which is more effecient than retagging them all automatically on change
         * @returns {undefined}
         */        
        linkTagging: function(){
            //console.log('linkTagging');

            //Update links of merch search content
            //This uses an event handler on the merch search container and only updates the link on mouseover
            $('#searchMerchResults').on('mouseenter', 'a', function() {
                //?ID16=spotF1:All:galaxy&icamp=INTC_samsung-galaxy-s3_Search_Feature1_phone
                var mySelf = $(this);
                analytics.updateLinkState();
                var value = mySelf.attr('href');
                var id = String(mySelf.data('id')).toUpperCase();
                var myPosition = mySelf.index();
                var linkOmniture = 'ID16=spotF' + (myPosition + 1) + ':' + self.vars.label + ':' + self.vars.searchTerm;
                //INTC_samsung-galaxy-s3_Search_Feature1_Phone or INTC_PG_Search_Feature2_Plan
                var linkIcamp = 'icamp=INTC_'+mySelf.data('shortname')+'_Search_Feature'+(myPosition + 1)+'_'+mySelf.data('type');
                mySelf.attr('href', value.split('?')[0] + '?'+linkOmniture + '&' + linkIcamp);
            });

            //Update the link in the SERPS results on mouseover. This lets us use an event handler instead of having to manually update the links every time google changes content
            //This method is MUCH superior than manually updating the links. This way we don't need to wait for google to load to update links, just set an event listener on a master element
            $('#searchResults').on('mouseenter', '.gsc-tabdActive .gsc-result a.gs-title, .gsc-tabdActive .gsc-result a.gs-image', function() {
                var mySelf = $(this); //Load into var for performance
                analytics.updateLinkState();
                //Remove google's data cturl because it disable modifying this link
                mySelf.removeAttr('data-cturl');
               
                //If this URL already has query params, preserve them
                var myURL = mySelf.data('ctorig');
                if (mySelf.data('ctorig').indexOf('?') !== -1) {
                    myURL += '&';
                    //No query params
                } else {
                    myURL += '?';  //Get existing URL
                }
                
                //Get current page of pagination
                var myPosition = mySelf.closest('.gsc-tabdActive .gsc-webResult').index('.gsc-tabdActive .gsc-webResult') + self.vars.pageNum - 10;//Get this links position in the serps, factor in which page of results we're in
                //Update link of current URL
                mySelf.attr('href', myURL + 'ID16=spot' + myPosition + ':' + self.vars.label + ':' + self.vars.searchTerm);
            });

        },     
                
        /**
         * Updates the class variables that keep track of the current refinement tab and pagination location
         * @returns {undefined}
         */        
        updateLinkState: function(){
            self.vars.label = $('.gsc-tabsArea .gsc-tabhActive').text().replace('&','and');
            self.vars.pageNum = $('.gsc-tabdActive .gsc-cursor-current-page').text() * 10;
        },

        /**
         * Empties out all currently set omniture data
         * This allows us to send a fresh call to Omniture using onpage events
         * @returns {undefined}
         */
        reset: function() {
            var i, svarArr;
            //Since this is a standalone call, we need to empty out all the previous data in the S call and only send the changes
            for (i = 0; i < 75; i++) {
                s['prop' + i] = '';
                s['eVar' + i] = '';
                if (i <= 5) {
                    s['hier' + i] = '';
                }
            }
            svarArr = ['pageName', 'channel', 'products', 'events', 'campaign', 'purchaseID', 'state', 'zip', 'server', 'linkName'];
            for (i = 1; i < svarArr.length; i++) {
                s[svarArr[i]] = '';
            }
        }, //end resetOmniture
        
        /**
         * Sends the data to omniture
         * @returns {undefined}
         */
        submit: function() {
            console.log('Submitting');
            var s_code = s.t();
            if (s_code)$('body').prepend(s_code);
        }
    };
  
    //Class method for events
    var events = {
        
        /**
         * Checks if a particular piece of code is present in the DOM. Loop recursively until it is found and then fire a callback function
         * @param {string} selector - jQuery selector of DOM object to check for. Do NOT pass the collection object
         * @param {function} callback - Function to fire when content is found. This will send the value of the selector to the callback function
         * @returns {undefined}
         */
        checkLoaded: function(selector,callback){
            //console.log('Checking for: '+selector);
            if ($(selector).length !== 0) {
                callback(selector);
            } else {
                setTimeout(function() {events.checkLoaded(selector,callback);}, 300);//Loop recursively until the form is found
            }
        },
        
        /**
         * Determines which functionality is fired when the various asych content has completed loading
         * This allows us to fire content at specific times in the load order without needing the entire page to load
         * Because google search doesn't have a callback method, this function is needed to determine when the page/async content has fully loaded
         * @param {string} content - A string that corresponds to the switch statement. This determines which functionality is executed on each load
         * @returns {undefined}
         */
        loadComplete: function(content){
            console.log('loadComplete');
            //Increment the count of loaded resources
            self.vars.content.asyncResourcesLoaded += 1;
            
            //Check which resoure has loaded, fire appropriate code
            switch (content) {
                //Google search form
                case '.gsc-results':
                    //console.log('googleSearch loaded');
                break;
                //Merch search area
                case 'merchSearch':
                    //console.log('merchSearch loaded');
                    merchSearch.showContent(self.vars.searchTerm);
                break;
            }
            
            //ALL content has been loaded, fire appropriate methods that depend on BOTH merch search and google search to be loaded
            if(self.vars.content.asyncResourcesLoaded >= self.vars.content.asyncResourcesTotal || self.vars.page === 'solo'){
                //console.log('Page Fully Loaded');
                events.clicks();
                googleAPI.spellCheck();
                
                //if(self.vars.page !== 'solo'){
                    analytics.trackPage();
                //}
            }
        },
        
        /**
         * Contains click events
         * @returns {undefined}
         */        
        clicks: function(){
            console.log('Clicks');
            //When a search refinement tab is clicked, update all the links
            $('.gsc-tabsArea .gsc-tabHeader').on('click',function(){
                 analytics.reset();
                 setTimeout(function() {
                    events.checkLoaded('.gsc-tabdActive .gsc-webResult',analytics.trackPage);
                }, 500);
            });
            
            //When a pagination button is clicked. Using an event listener on the PARENT div since the buttons get unloaded everytime they are clicked
            $('#searchResults').on('click','.gsc-cursor-box .gsc-cursor .gsc-cursor-page',function(){
                analytics.reset();
                setTimeout(function() {
                    events.checkLoaded('.gsc-tabdActive .gsc-webResult',analytics.trackPage);
                }, 500);
            });
        }        
    };
    
    //Class for helper methods
    var helpers = {};   
    //console.log(self);
}