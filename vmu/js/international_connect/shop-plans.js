
//Get the query string variables and load them into an object
var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

//Toggle the default open accordian based on the query string variable for 'plan'
switch(urlParams.plan){
    case 'mu': 
        setTimeout(function(){$('#details_mu').find('.accordion_bar a').trigger('click');}, 500);break;
    case 'amu':
        setTimeout(function(){$('#details_amu').find('.accordion_bar a').trigger('click');}, 500);break;
    case 'bmu': 
        setTimeout(function(){$('#details_bmu').find('.accordion_bar a').trigger('click');}, 500);break;
}



$(document).ready(function() {

	setupAccordions();
	
	if (document.location.hash) {
		setTimeout(function(){$('#details_' + document.location.hash.split('#')[1]).find('.accordion_bar a').trigger('click');}, 500)
	} 
	else if(document.location.search){
		setTimeout(function(){$('#details_' + document.location.search.split('#')[1]).find('.accordion_bar a').trigger('click');}, 500)
	} 
	else {
		setTimeout(function(){$('.accordion_bar a').eq(0).trigger('click');	}, 500)
	}
	
	$('.plan_slider_guide div').drag(function( ev, dd ){
																	
		//dd.offsetX = Math.min(174, Math.max(0, Math.round( dd.offsetX / 58 ) * 58))
		dd.offsetX = Math.min(174, Math.max(0,dd.offsetX/58)*58)
		$( this ).css({ left: dd.offsetX }).removeClass().addClass('price_'+Math.floor(dd.offsetX / 58) * 6 + 'mos');	
	
	},{ relative:true });
	
	/*$('.plan_slider_guide div').mouseup(function(){
		
		
		
		var NewLeft = Math.floor(dd.offsetX / 58) * 58 +'px'
		alert(NewLeft)
		$( this ).css({ left: NewLeft  }).removeClass().addClass('price_'+Math.floor(dd.offsetX / 58) * 6 + 'mos');			
		//alert("dd.offsetX")
		//$( this ).css({ left: dd.offsetX }).removeClass().addClass('price_'+dd.offsetX / 58 * 6 + 'mos');	Math.round(dd.offsetX/58)*58
		
		
	});*/

	$('.features').each(function() {
		var $features = $(this)
		$features.find('a').bind('click', function(event) {
			event.preventDefault();
			$features.find('a.active').removeClass('active')
			var activeID = $(this).addClass('active').attr('href');
			$features.find('.feature').hide();
			$(activeID).fadeIn();
		})
	})

});

function setupAccordions() {
	$('.accordion_bar a').bind('click', function(event) {
		event.preventDefault();
		if($(this).closest('.accordion_pane').hasClass('expanded') == 1){
			$(this).closest('.accordion_pane').removeClass('expanded').find('.accordion_body').slideUp();	
			}
		else{
			$(this).closest('.accordion_pane').addClass('expanded').find('.accordion_body').slideDown();
			$(this).closest('.accordion_pane').siblings().removeClass('expanded').find('.accordion_body').slideUp();
		}
	})
}
