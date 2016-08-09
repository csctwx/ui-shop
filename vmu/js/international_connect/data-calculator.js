try {
    //Instantiate the class 
    var bmDataCalcClass = new bmDataCalc();
} catch (error) {
    //Throw errors to console instead of breaking page 
    console.log('Error on instantiation: ' + error.message);
    console.log(error.stack);
}


/**
 * Manages all of the interaction and functionality of the search page
 * @returns {undefined}
 */
function bmDataCalc() {
    'use strict';
    var self = this;
    
    //Public Vars
    self.publicVars = {
        data: 0,                                                                //How much current data is present in the sliders
        dataTotal: 10,                                                          //Max # of GB's to calculate against
        maxHeight : $('#db-data').height(),                                     //Max height of the data readout slider
        windowOffset : $('#db-window').css('bottom'),                           //Offset for the window that appears on the data readout slider
        daysInMonth: 32                                                         //Number of days in the month to calculate the totals
    };
    
    //Private vars
    var privateVars = {
        sliders : $(".slider"),                                                 //Store sliders in a variable
        plansObj : {                                                            //Data in GB, css ID to show in slider
            10: 'db-window-plan3',
            5: 'db-window-plan2',
            1: 'db-window-plan1'
        }
    };
    
    /**
     * Initialize data calculator, also has event handlers
     * @returns {undefined}
     */
    self.initialize = function() {
        
        //Initialize the sliders
        privateVars.sliders.slider({
            slide: function(event, ui) {
                //Update data attribute on this element with actual data value
                var me = $(this);
                $(this).data('count', ui.value * me.data('max') / 100);
                dataCalc();
                
                /*   debugging    */
                var me = $(this);
                var quanity = me.data('count');
                var dataMe = quanity * me.data('value-kb');
                $(this).parent().find('.debug .mb').text(Math.round(dataMe/1000 * 100) / 100);
                $(this).parent().find('.debug .gb').text(Math.round(dataMe/1000/1000 * 1000) / 1000);
                $(this).parent().find('.debug .usage').text($(this).data('count'));
            }
        });
        
        //Reset button
        $('#reset').on('click',function(){
            //Set sliders to 0
            privateVars.sliders.slider( "option", "value", 0 );    
            //Set data count to 0
            privateVars.sliders.data('count',0);                                
            dataCalc();
            return false;
        });
        
    };//end self.initialize
    
    
    /**
     * Calculate the total data being set by the sliders, update sidebar slider
     * @returns {undefined}
     */
    var dataCalc = function(){
        //console.log('Processing');
        //privateVars.sliders
        self.publicVars.data = 0;
        //Loop through all the sliders
        $.each(privateVars.sliders,function(){
            //Get the current data useage in KB
            var me = $(this);
            //var quanity = me.data('count') * me.data('max') / 100;
            var dataMe = me.data('count') * me.data('value-kb');
            //Update master total
            self.publicVars.data += dataMe;
        });
        
        //Calculate the total data set by all the sliders in gigabytes
        var currentData = Math.round(self.publicVars.data/1000/1000 * 1000 * self.publicVars.daysInMonth) / 1000;
        
        //Make sure that the sidebar slider doesn't exceed the height of the container. Update sidebar slider to correct height
        if(currentData < self.publicVars.dataTotal){
            var myHeight = currentData * self.publicVars.maxHeight / 10;
            $('#db-data-actual').height(myHeight);
            $('#db-window').css('bottom', myHeight + Math.round(parseInt(self.publicVars.windowOffset)));
        } else {
            $('#db-data-actual').height(self.publicVars.maxHeight);
            $('#db-window').css('bottom', self.publicVars.maxHeight + Math.round(parseInt(self.publicVars.windowOffset)));
        }
        
        //Loop through the plans object
        $.each(privateVars.plansObj, function(index, value){
            //Check if the index value is greater than the current data total
            if(index > currentData){
                //Check if the plan is already visible
                if($('#'+value).not(':visible')){
                    //Hide all plans, show the correct plan
                    $('.db-window-plan').hide();
                    $('#'+value).show();
                }
                return false;//stop loop
            }
        });
        
        //Update the data values in the data window slider
        $('#mb-mo').text(Math.round(self.publicVars.data/1000 * 100 * self.publicVars.daysInMonth) / 100);
        $('#gb-mo').text(Math.round(self.publicVars.data/1000/1000 * 100 * self.publicVars.daysInMonth) / 100);
        
    };//end dataCalc
    
}