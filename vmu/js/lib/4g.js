$(document).ready(function(){
	$("#tabmenu-pane li").click(function() {
		$("ul#tabmenu-pane li").removeClass("active");
		$(this).addClass("active");
		var scrollId = $(this).attr("id");
		$('html, body').animate({
			scrollTop: $("#section-"+scrollId).offset().top
		}, 200);
	});
	
	$('a.gotoanswer').click(function(){
        strLink = $(this).attr('href');
        $.scrollTo(strLink,{duration:'slow', offsetTop : '50'});
        return false;
    });

	$('a.goto-top').click(function(){
        strLink = $(this).attr('href');
		$.scrollTo(strLink,{duration:'slow', offsetTop : '50'});
		return false;
    });

	$(window).scroll(function() {
		if($(document).scrollTop() > ($("#content-pane").offset().top)){
			$("ul#tabmenu-pane").attr("style","position: fixed;top: 0px; left: -483px; margin-left:50%");
		}
		else{
			$("ul#tabmenu-pane").removeAttr("style");
		}
		
		if($(document).scrollTop() <= $("#section-lte-devices").offset().top){
			//$("ol#sticky-menu li").removeClass("active");
		}
		else if($(document).scrollTop() >= $("#section-lte-devices").offset().top-80 && $(document).scrollTop() < $("#section-lte-plans").offset().top-80 ){
			$("ul#tabmenu-pane li").removeClass("active");
			$("#li-devices").addClass("active");
		}
		else if($(document).scrollTop() >= $("#section-lte-plans").offset().top-80 && $(document).scrollTop() < $("#section-lte-switch").offset().top-80 ){
			$("ul#tabmenu-pane li").removeClass("active");
			$("#li-plans").addClass("active");
		}
		else if($(document).scrollTop() >= $("#section-lte-switch").offset().top-80 && $(document).scrollTop() < $("#section-lte-faqs").offset().top-120 ){
			$("ul#tabmenu-pane li").removeClass("active");
			$("#li-switch").addClass("active");
		}
		else if($(document).scrollTop() >= $("#section-lte-faqs").offset().top-120){
			$("ul#tabmenu-pane li").removeClass("active");
			$("#li-faqs").addClass("active");
		}
		// Phones animation code
		if($(document).scrollTop() >= $('#device-gfx-gs5').offset().top-180){
			$('#device-gfx-gs5').attr("style","background-position: -446px 0px;");
		}else{
			$('#device-gfx-gs5').attr("style","background-position: 0px 0px;");
		}
		if($(document).scrollTop() >= $('#device-gfx-lumia').offset().top-180){
			$('#device-gfx-lumia').attr("style","background-position: -446px 0px;");
		}else{
			$('#device-gfx-lumia').attr("style","background-position: 0px 0px;");
		}
		if($(document).scrollTop() >= $('#device-gfx-tribute').offset().top-180){
			$('#device-gfx-tribute').attr("style","background-position: -446px 0px;");
		}else{
			$('#device-gfx-tribute').attr("style","background-position: 0px 0px;");
		}
		if($(document).scrollTop() >= $('#device-gfx-desire510').offset().top-180){
			$('#device-gfx-desire510').attr("style","background-position: -446px 0px;");
		}else{
			$('#device-gfx-desire510').attr("style","background-position: 0px 0px;");
		}
		// End Phones animation code
	});
	
	$("#switch-icons ul li").mouseover(function(){
	  $("#switch-icons ul li").removeClass("isover");
	  var selectedId = $(this).attr("id");
	  $(this).addClass("isover");
	  $("#switch-info div").hide();
	  $("#switch-info-"+ selectedId).fadeIn("fast");
	});
	
	$("#switch-icons").mouseleave(function(){
	  setTimeout(function(){
		$("#switch-icons ul li").removeClass("isover");
		$("#network").addClass("isover");
		$("#switch-info div").hide();
		$("#switch-info-network").fadeIn("fast");
	  },500);
	});
	
});