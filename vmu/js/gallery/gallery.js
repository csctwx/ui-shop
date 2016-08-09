var $j = jQuery.noConflict();

var zIndexMax = 10;

$j(document).ready(function() {
	
	// Grab photo id from url if available
	try {
		var galleryID = getUrlVars()["show"];
		if( galleryID.length > 0 )
			galleryTransition("#"+galleryID);
	} catch(err){}

	$j('ul.galleryThumbs li').on('click', 'a:not(active)', function(evt){
		evt.preventDefault();
		var galleryID = $j(this).attr('rel');
		galleryTransition(galleryID);
	});
});

function galleryTransition( galleryID ) {
	// Switch Active Thumb
	$j('ul.galleryThumbs li.active').removeClass('active');
	$j('ul.galleryThumbs li#'+galleryID+"Thmb").addClass('active');
	
	// Switch Full View
	//$j('ul.galleryDisplay li.active').removeClass('active');
	//$j('ul.galleryDisplay li#'+galleryID).addClass('active');
	
	// fix for IE - using display:none/block while the 360 swf is loading makes it crap out while switching between the 360 and photo views
	$j('ul.galleryDisplay li#'+galleryID).css('z-index', ++zIndexMax);
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}