var slideDist = 300;
var sliding = false;
var item, itemCount, itemPosX, totalWidth;
var boundsMin, boundsMax;

//$(window).load(function()
$(document).ready(function()
{	
	boundsMin = -600;
	boundsMax = $('#wcu-slider').width() + 300;
	$('#wcu-slider-controls .right').bind("click", function() { if( !sliding ) slideRight(); });
	$('#wcu-slider-controls .left').bind("click", function() { if( !sliding ) slideLeft(); });
	item = $("#wcu-slider").children(".sitem");		
	itemCount = item.length;
	itemPosX = new Array(itemCount);

	for (var i = 0; i < itemCount; i++)
	{
		totalWidth = 0;
		
		for (var n = 0; n < i; n++)
			totalWidth += $(item[n]).width();

		itemPosX[i] = totalWidth;
		$(item[i]).css("left" ,totalWidth);
	}

	$(item).show();
	
	
	$("#sticky-menu li").click(function() {
		$("ol#sticky-menu li").removeClass("active");
		$(this).addClass("active");
		var scrollId = $(this).attr("data-target-panel");
		$('html, body').animate({
			scrollTop: $("#panel"+scrollId).offset().top
		}, 200);
	});
	
	$("#return-top").click(function(){
    $('html, body').animate({
      scrollTop: $("#panel1").offset().top
    }, 200);
  });

	$(window).scroll(function() {
		if($(document).scrollTop() > ($(".panel-details").offset().top-10)){
			$("ol#sticky-menu li").addClass("small");
			$("ol#sticky-menu").attr("style","position: fixed;top: 20px");
		}
		else{
			$("ol#sticky-menu li").removeClass("small");
			$("ol#sticky-menu").removeAttr("style");
		}
		
		/*if($(document).scrollTop() <= $("#panel1").offset().top){
			//$("ol#sticky-menu li").removeClass("active");
		}
		else if($(document).scrollTop() >= $("#panel1").offset().top && $(document).scrollTop() < $("#panel2").offset().top ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav1").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel2").offset().top && $(document).scrollTop() < $("#panel3").offset().top ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav2").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel3").offset().top && $(document).scrollTop() < $("#panel4").offset().top ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav3").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel4").offset().top && $(document).scrollTop() < $("#panel5").offset().top ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav4").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel5").offset().top){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav5").addClass("active");
		}*/
		if($(document).scrollTop() <= $("#panel1").offset().top){
			//$("ol#sticky-menu li").removeClass("active");
		}
		else if($(document).scrollTop() >= $("#panel1").offset().top-150 && $(document).scrollTop() < $("#panel2").offset().top-150 ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav1").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel2").offset().top-150 && $(document).scrollTop() < $("#panel3").offset().top-150 ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav2").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel3").offset().top-150 && $(document).scrollTop() < $("#panel4").offset().top-150 ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav3").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel4").offset().top-150 && $(document).scrollTop() < $("#panel5").offset().top-150 ){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav4").addClass("active");
		}
		else if($(document).scrollTop() >= $("#panel5").offset().top-150){
			$("ol#sticky-menu li").removeClass("active");
			$("#nav5").addClass("active");
		}
	});
				
});

function slideLeft()
{
	sliding = true;
	
	for (var i = 0; i < itemCount; i++)
	{
		itemPosX[i] -= slideDist;

		if (itemPosX[i] <= boundsMin)
		{
			totalWidth = 0;
			
			for (var n = 0; n < itemCount; n++)
			{
				if (n != i)
					totalWidth += $(item[n]).width();
			}
			
			itemPosX[i] =  totalWidth + (itemPosX[i] + $(item[i]).width());
			$(item[i]).css("left", itemPosX[i] + 300);
		}
		
		$(item[i]).animate({left: itemPosX[i]}, "fast");
	}
	
	$(item).promise().done(function()
	{
		sliding = false;
	});
}

function slideRight()
{
	sliding = true;
	
	for (var i = itemCount - 1; i > -1; i--)
	{
		itemPosX[i] += slideDist;		

		if (itemPosX[i] >= boundsMax)
		{
			totalWidth = 0;
			
			for (var n = 0; n < itemCount; n++)
				totalWidth += $(item[n]).width();

			itemPosX[i] =  itemPosX[i] - totalWidth;
			$(item[i]).css("left", itemPosX[i] - 300);
		}
		
		$(item[i]).animate({left: itemPosX[i]}, "fast");
	}
	
	$(item).promise().done(function()
	{
		sliding = false;
	});
}