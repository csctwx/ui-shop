


try {
    //Instantiate the class 
    var bmAboutClass = new bmAbout();
} catch (error) {
    //Throw errors to console instead of breaking page 
    console.log('Error on instantiation: ' + error.message);
    console.log(error.stack);
}


/**
 * Classes and methods for about us section
 * @returns {undefined}
 */
function bmAbout() {
    'use strict';
    var self = this;
    
    //Public Vars
    self.publicVars = {};

    //Private Vars
    var privateVars = {
        //submitPath : '/DynamicSendMailServlet',                                 //Path to submit the form too 
        //sendToEmail: 'jerrol dot krause@sprint.com'                               //Email to send form submission too
    };
    
    //Check if the form parameter is set, show the authorized or select retailer form elements 
    if (urlParams.form === 'select') {
        $('.select-app').show();
        $('.authorized').remove();
        $('#_fid_64').val('Select');
    } else {
        $('.select-app').remove();
        $('.authorized').show();
    }
    
    //Class for the dealer application page
    self.dealerForm = {
        form: $('#form_dealer'),                                                //Store the form as a variable
        cookie: {formData:{}},                                                  //Object containing all the field data to package into a cookie
        lastSaved: '',                                                          //Text string of last saved datetime
        submitPath : 'https://sprintscs.quickbase.com/db/bi85bsi39?a=API_AddRecord&apptoken=dqc6xq67m2py9czhv65uw9pyu4',//Path to submit the form too 
        //submitPath : '/DynamicSendMailServlet',                                 //Path to submit the form too 
        thankYouPath: '/about/application/thankyou/',                           //Path to thankyou page
        sendToEmail: 'BoostMobileNewDealers'+'@'+'sprint'+'.'+'com',            //Email to send form submission too
        bmFormData: {},                                                         //Store form data
        
        /**
         * Master initialization function
         * @returns {undefined}
         */
        init: function() {
            //Update the mail subject line with the name of the form being submitted
            $('#mail_subject').val($('#authorized h2').text() + ' Submission');
            //console.log('Init');
            //Check if form data is in the cookie
            self.dealerForm.bmFormData = $.cookies.get('bmFormData');
            //$.cookies.del('bmFormData');
            //bmFormData.completed = '08/27/2014';
            //Check if form data exists
            if (self.dealerForm.bmFormData !== null && typeof self.dealerForm.bmFormData !== 'undefined') {
                //Check if the completed flag has been set, if so show the completed message at the top
                if (typeof self.dealerForm.bmFormData.completed !== 'undefined') {
                    $('#completed-on').text(self.dealerForm.bmFormData.completed);
                    $('#completed').show();
                //Completed message NOT set, load cookied data    
                } else {
                    //Load previous form data into form
                    self.dealerForm.formLoad();
                }
            }
            
            self.dealerForm.events();
        }, //end init
        
        /**
         * Save all the form data into a cookie
         * @returns {undefined}
         */
        formSave: function() {
            //console.log('Saving Data...');
            //Generate the current date and load it into the last saved text location
            var currentdate = new Date(); 
            var datetime = 'Last Saved:' 
                + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
            $('.save-datetime').text(datetime);
            self.dealerForm.lastSaved = datetime;
            
            var saveData = false;
            //Loop through all the fields and load the ID's and values into an object
            $.each(self.dealerForm.form.find('input, textarea, select').filter(":visible").not('[type=submit]'), function(key, value) {
                //If this is NOT a radio button AND it has a value set. We only want to save a cookie if the user actually starts typing. Radio buttons are have default content and we want to exclude those initially
                if (value.type !== 'radio' && value.value !== '') {
                    //Set the saveform flag to true so that the form is saved
                    saveData = true;
                }

                //If this field's has a value and saveData is set to true
                if (value.value !== '' && saveData === true) {
                    //If this is a radio button and checked, load the value
                    if(value.type === 'radio' && value.checked === true){
                        self.dealerForm.cookie.formData[value.name] = value.value;
                    //If not a radio button (and thus unchecked) load this. This prevents radio buttons with unchecked values being loaded    
                    } else if(value.type !== 'radio'){
                        self.dealerForm.cookie.formData[value.name] = value.value;
                    }
                }
            });

            //Add last saved time to cookie
            self.dealerForm.cookie['lastSaved'] = self.dealerForm.lastSaved;
            //If save data is set to true, load the object into a cookie
            if (saveData === true) {
                jQuery.cookies.set('bmFormData', self.dealerForm.cookie, {path: '/'});
            };
            
            //console.log(self.dealerForm.cookie);
        },//end formSave
                
        /**
         * Load all the form data from the cookie back into the form
         * @returns {undefined}
         */
        formLoad: function() {
            //console.log('Form data found, loading...');
            //Loop through data object, load values from cookie into form
            $.each(self.dealerForm.bmFormData.formData, function(key, value) {
                var field = self.dealerForm.form.find('input, textarea, select').filter('[name = '+key+']');
                
                //If this is a radio button, apply the checked attribute instead
                if(field.attr('type') === 'radio'){
                    field.filter('[value='+value+']').attr('checked','checked');
                    if(field.parent().data('type') === value){
                        self.helpers.showHide(field.filter('[checked = checked]'));
                    }
                //If not radio, just load the value in
                } else {
                    $('#'+key).val(value);
                }
                
            });
            //Update last saved datetime
            $('.save-datetime').text(self.dealerForm.lastSaved);
        },//end formLoad
        
        /**
         * On form submit
         * @param {type} form - form selector sent by validator plugin
         * @returns {Boolean}
         */
        formSubmit: function(form) {
            $('#Submit').addClass('disabled').attr('disabled','disabled');
            $('#loading').css('display', 'inline-block');
            form.submit();
            return false;
        },//end formsubmit
        
        /**
         * Contains user interaction events
         * @returns {undefined}
         */
        events: function() {
            //console.log('Events');
            //User interactioni events that update the form with the correct action location to submit too. This is an anti-bot measure since bots don't perform these actions
            self.dealerForm.form.on('keypress mouseover', 'input, select, textarea', function() {
                self.helpers.notABot(self.dealerForm.submitPath,self.dealerForm.thankYouPath,self.dealerForm.sendToEmail);
                self.dealerForm.form.off('keypress mouseover');         //Remove these events so that this function doesn't keep firing
            //When an input is changed, save the form    
            }).on('change',function(){
                self.dealerForm.formSave();
            });
            
            //Show/hide content boxes within the form
            $('.showhide input').on('click', function() {
                self.helpers.showHide($(this));
            });
            
            //When a save button is clicked, save the form
            $('.save').on('click', function() {
                
                self.dealerForm.formSave();
                //Lil animation for user feedback
                $('.save').find('span').text('Saved!').delay(500).fadeOut('300',function(){
                    $(this).text('Save Form');
                    $(this).fadeIn();
                });
                
                return false;
            });

            //When a user updates their email address, update the mail from response
            $('#email, #_fid_15').on('change keyup', function() {
                $('#mail_from').val($(this).val());
            });
            
        }// end events
        
    };
    
    //Functionality for the submit location page
    self.submitLocation = {
        form: $('#form_submit'),                                                //Store the form as a variable
        submitPath : '/DynamicSendMailServlet',                                 //Path to submit the form too 
        thankYouPath: '/about/application/thankyou/',                           //Path to thankyou page
        sendToEmail: 'BoostMobileNewDealers'+'@'+'sprint'+'.'+'com',            //Email to send form submission too
        
        /**
         * Onload, do this
         * @returns {undefined}
         */
        init: function(){
            //Make sure user is not a bot
            self.submitLocation.form.on('keypress mouseover', 'input, select, textarea', function() {
                self.helpers.notABot(self.submitLocation.submitPath,self.submitLocation.thankYouPath,self.submitLocation.sendToEmail);
                self.submitLocation.form.off('keypress mouseover');             //Remove these events so that this function doesn't keep firing
            });
            
            
        }
    };//end submitLocation
    
    
    
    //Support methods not tied to a specific page
    self.helpers = {
        
         /**
         * Manages the show/hide functionality for field elements that reveal additional fields when checked
         * @param {jquery} obj - jQuery object that was clicked
         * @returns {undefined}
         */
        showHide: function(obj) {
            //console.log('showhide');
            var value = obj.val();
            var content = $('.' + obj.parent().data('show'));
            if (value === obj.parent().data('type')) {
                content.fadeIn();
            } else {
                content.fadeOut();
            }
        },//end showHide
        
        /**
         * If a user interaction event occured proving the submitter isn't a bot...
         * @param {type} submitTo - Set the form action to this
         * @param {type} thankYouPage - Where to send the user on successful form submit
         * @param {type} sendToEmail - Email the form contents to this user
         * @returns {undefined}
         */
        notABot: function(submitTo,thankYouPage,sendToEmail) {
            //console.log('Notabot');
            $('form').attr('action', submitTo);                   //Add submit location to form
            $('#mail_complete_url').val(thankYouPage);              //Add thankyou path to form
            $('#mail_to').val(sendToEmail);                         //Add send to email to form
        }
    };
    

    //console.log(self);
}    