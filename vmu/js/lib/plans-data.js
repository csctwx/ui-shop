var minutes = [
    {"minutes":"20", "price":"0.00"},
    {"minutes":"250", "price":"3.00"},
    {"minutes":"500","price": "6.00"},
    {"minutes":"750","price": "8.00"},
    {"minutes":"1000","price": "9.50"},
    {"minutes":"1250","price": "11.50"},
    {"minutes":"1500","price": "13.00"},
    {"minutes":"1750","price": "14.50"},
    {"minutes":"2000","price": "15.00"},
    {"minutes":"2250","price": "16.00"},
    {"minutes":"2500","price": "17.50"},
    {"minutes":"2750","price": "19.00"},
    {"minutes":"3000","price": "21.00"},
    {"minutes":"3500","price": "24.50"},
    {"minutes":"4000","price": "28.00"},
    {"minutes":"4500","price": "31.50"},
    {"minutes":"5000","price": "35.00"}
];

var sms = [
    {"texts":"20", "price":"0.00"},
    {"texts":"250", "price":"2.50"},
    {"texts":"500", "price":"4.50"},
    {"texts":"750", "price":"6.50"},
    {"texts":"1000", "price":"8.00"},
    {"texts":"1250", "price":"9.00"},
    {"texts":"1500", "price":"10.00"},
    {"texts":"1750", "price":"11.00"},
    {"texts":"2000", "price":"12.00"},
    {"texts":"2250", "price":"13.00"},
    {"texts":"2500", "price":"13.50"},
    {"texts":"2750", "price":"14.00"},
    {"texts":"3000", "price":"15.00"},
    {"texts":"3500", "price":"17.00"},
    {"texts":"4000", "price":"19.00"},
    {"texts":"4500", "price":"21.00"},
    {"texts":"5000", "price":"23.00"}
];

var mbData = [
    {"mb":"0", "price":"0.00"},
	{"mb":"20", "price":"1.40"},
	{"mb":"250", "price":"8.00"},
	{"mb":"500", "price":"13.50"},
	{"mb":"750", "price":"16.00"},
	{"mb":"1024", "price":"18.50"},
	{"mb":"1536", "price":"24.00"},
	{"mb":"2048", "price":"28.00"},
	{"mb":"2560", "price":"31.50"},
	{"mb":"3072", "price":"34.00"},
	{"mb":"3584", "price":"37.50"},
	{"mb":"4096", "price":"41.00"},
	{"mb":"4608", "price":"43.50"},
	{"mb":"5120", "price":"46.00"},
	{"mb":"5632", "price":"48.00"},
	{"mb":"6144", "price":"52.50"}
];


$(document).ready(function(){
	resetCounter();
	$(".people_box").click(function(){
		$(".people_box").removeClass("selected");
		$(this).addClass("selected");
		var people = parseInt($(this).attr("people"));
		selectPeople(people);
		updatePrice();
	});
	$(".jcarousel-button-prev").click(function(){
		prevData($(this).attr("value"));
	});
	$(".jcarousel-button-next").click(function(){
		nextData($(this).attr("value"));
	});
});

function selectPeople(people){
	switch(people){
		case 1: 
			$("#people").removeAttr("class").addClass("people1");
			resetCounter();
		break;
		case 2: 
			$("#people").removeAttr("class").addClass("people2");
			$("#m-minutes-prev").html(minutes[0].minutes + " Mins");
			$("#m-price-prev").html("$"+minutes[0].price);	
			$("#m-minutes-current, #small_mins").html(minutes[1].minutes + " Mins");
			$("#m-price-current").html("$"+minutes[1].price).attr("data-value", minutes[1].price);
			$("#m-minutes-next").html(minutes[2].minutes + " Mins");
			$("#m-price-next").html("$"+minutes[2].price);
			$("#talk-list").attr("data-current-value",1);
			$("#talk div.jcarousel-control-prev").removeClass("inactive");
			
			$("#t-texts-prev").html(sms[0].texts + " Texts");
			$("#t-price-prev").html("$"+sms[0].price);	
			$("#t-texts-current, #small_texts").html(sms[1].texts + " Texts");
			$("#t-price-current").html("$"+sms[1].price).attr("data-value", sms[1].price);
			$("#t-texts-next").html(sms[2].texts + " Texts");
			$("#t-price-next").html("$"+sms[2].price);
			$("#text-list").attr("data-current-value",1);
			$("#text div.jcarousel-control-prev").removeClass("inactive");
			
			$("#d-data-prev").html(mbData[1].mb + " MB");
			$("#d-price-prev").html("$"+mbData[1].price);	
			$("#d-data-current").html(mbData[2].mb + " MB");
			$("#small_data").html(mbData[2].mb + " MB Data");
			$("#d-price-current").html("$"+mbData[2].price).attr("data-value", mbData[2].price);
			$("#d-data-next").html(mbData[3].mb + " Texts");
			$("#d-price-next").html("$"+mbData[3].price);
			$("#data-list").attr("data-current-value",2);
			$("#data div.jcarousel-control-prev").removeClass("inactive");
		break;
		case 3: 
			$("#people").removeAttr("class").addClass("people3");
			$("#m-minutes-prev").html(minutes[2].minutes + " Mins");
			$("#m-price-prev").html("$"+minutes[2].price);	
			$("#m-minutes-current, #small_mins").html(minutes[3].minutes + " Mins");
			$("#m-price-current").html("$"+minutes[3].price).attr("data-value", minutes[3].price);
			$("#m-minutes-next").html(minutes[4].minutes + " Mins");
			$("#m-price-next").html("$"+minutes[4].price);
			$("#talk-list").attr("data-current-value",3);
			$("#talk div.jcarousel-control-prev").removeClass("inactive");
			
			$("#t-texts-prev").html(sms[1].texts + " Texts");
			$("#t-price-prev").html("$"+sms[1].price);	
			$("#t-texts-current, #small_texts").html(sms[2].texts + " Texts");
			$("#t-price-current").html("$"+sms[2].price).attr("data-value", sms[2].price);
			$("#t-texts-next").html(sms[3].texts + " Texts");
			$("#t-price-next").html("$"+sms[3].price);
			$("#text-list").attr("data-current-value",3);
			$("#text div.jcarousel-control-prev").removeClass("inactive");
			
			$("#d-data-prev").html(mbData[2].mb + " MB");
			$("#d-price-prev").html("$"+mbData[2].price);	
			$("#d-data-current").html(mbData[3].mb + " MB");
			$("#small_data").html(mbData[3].mb + " MB Data");
			$("#d-price-current").html("$"+mbData[3].price).attr("data-value", mbData[3].price);
			$("#d-data-next").html(mbData[4].mb + " Texts");
			$("#d-price-next").html("$"+mbData[4].price);
			$("#data-list").attr("data-current-value",3);
			$("#data div.jcarousel-control-prev").removeClass("inactive");
		break;
		case 4: 
			$("#people").removeAttr("class").addClass("people4");
			$("#m-minutes-prev").html(minutes[2].minutes + " Mins");
			$("#m-price-prev").html("$"+minutes[2].price);	
			$("#m-minutes-current, #small_mins").html(minutes[3].minutes + " Mins");
			$("#m-price-current").html("$"+minutes[3].price).attr("data-value", minutes[3].price);
			$("#m-minutes-next").html(minutes[4].minutes + " Mins");
			$("#m-price-next").html("$"+minutes[4].price);
			$("#talk-list").attr("data-current-value",3);
			$("#talk div.jcarousel-control-prev").removeClass("inactive");
			
			$("#t-texts-prev").html(sms[5].texts + " Texts");
			$("#t-price-prev").html("$"+sms[5].price);	
			$("#t-texts-current, #small_texts").html(sms[6].texts + " Texts");
			$("#t-price-current").html("$"+sms[6].price).attr("data-value", sms[6].price);
			$("#t-texts-next").html(sms[7].texts + " Texts");
			$("#t-price-next").html("$"+sms[7].price);
			$("#text-list").attr("data-current-value",6);
			$("#text div.jcarousel-control-prev").removeClass("inactive");
			
			$("#d-data-prev").html(mbData[4].mb + " MB");
			$("#d-price-prev").html("$"+mbData[4].price);	
			$("#d-data-current").html(mbData[5].mb + " MB");
			$("#small_data").html(mbData[5].mb + " MB Data");
			$("#d-price-current").html("$"+mbData[5].price).attr("data-value", mbData[5].price);
			$("#d-data-next").html(mbData[6].mb + " Texts");
			$("#d-price-next").html("$"+mbData[6].price);
			$("#data-list").attr("data-current-value",5);
			$("#data div.jcarousel-control-prev").removeClass("inactive");
		break;
		case 5: 
			$("#people").removeAttr("class").addClass("people5");
			$("#m-minutes-prev").html(minutes[4].minutes + " Mins");
			$("#m-price-prev").html("$"+minutes[4].price);	
			$("#m-minutes-current, #small_mins").html(minutes[5].minutes + " Mins");
			$("#m-price-current").html("$"+minutes[5].price).attr("data-value", minutes[5].price);
			$("#m-minutes-next").html(minutes[6].minutes + " Mins");
			$("#m-price-next").html("$"+minutes[6].price);
			$("#talk-list").attr("data-current-value",5);
			$("#talk div.jcarousel-control-prev").removeClass("inactive");
			
			$("#t-texts-prev").html(sms[9].texts + " Texts");
			$("#t-price-prev").html("$"+sms[9].price);	
			$("#t-texts-current, #small_texts").html(sms[10].texts + " Texts");
			$("#t-price-current").html("$"+sms[10].price).attr("data-value", sms[10].price);
			$("#t-texts-next").html(sms[11].texts + " Texts");
			$("#t-price-next").html("$"+sms[11].price);
			$("#text-list").attr("data-current-value",10);
			$("#text div.jcarousel-control-prev").removeClass("inactive");
			
			$("#d-data-prev").html(mbData[5].mb + " MB");
			$("#d-price-prev").html("$"+mbData[5].price);	
			$("#d-data-current").html(mbData[6].mb + " MB");
			$("#small_data").html(mbData[6].mb + " MB Data");
			$("#d-price-current").html("$"+mbData[6].price).attr("data-value", mbData[6].price);
			$("#d-data-next").html(mbData[7].mb + " Texts");
			$("#d-price-next").html("$"+mbData[7].price);
			$("#data-list").attr("data-current-value",6);
			$("#data div.jcarousel-control-prev").removeClass("inactive");
		break;
	}
	$("#talk div.jcarousel-control-next").removeClass("inactive");
	$("#text div.jcarousel-control-next").removeClass("inactive");
	$("#data div.jcarousel-control-next").removeClass("inactive");
}


/***********This function start the 3 carousel on 0***********/
function resetCounter(){
	$("#small_mins").html(minutes[0].minutes + " Mins");
	$("#small_texts").html(sms[0].texts + " Texts");
	$("#small_data").html(mbData[0].mb + " MB Data");
	$("#talk-list, #text-list, #data-list").attr("data-current-value","0");
	$("#m-minutes-current").html(minutes[0].minutes + " Mins");
	$("#m-price-current").html("$"+minutes[0].price).attr("data-value", minutes[0].price);
	$("#m-minutes-next").html(minutes[1].minutes + " Mins");
	$("#m-price-next").html("$"+minutes[1].price);
	
	$("#t-texts-current").html(sms[0].texts + " Texts");
	$("#t-price-current").html("$"+sms[0].price).attr("data-value", sms[0].price);
	$("#t-texts-next").html(sms[1].texts + " Texts");
	$("#t-price-next").html("$"+sms[1].price);
	
	$("#d-data-current").html(mbData[0].mb + " MB");
	$("#d-price-current").html("$"+mbData[0].price).attr("data-value", mbData[0].price);
	$("#d-data-next").html(mbData[1].mb + " MB");
	$("#d-price-next").html("$"+mbData[1].price);
	$("#talk div.jcarousel-control-prev").addClass("inactive");
	$("#text div.jcarousel-control-prev").addClass("inactive");
	$("#data div.jcarousel-control-prev").addClass("inactive");
	updatePrice();
}

/*type: minutes=0, texts=1 and mbData=2 */
/*****************This function controls all prev Button for carousel***********************/
function prevData(type){
	type = parseInt(type);
	switch(type){
		case 0: 
			var currentData = $("#talk-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData > 0){
				if((currentData-1) <= 0){
					$("#talk div.jcarousel-control-prev").addClass("inactive");
					$("#talk-list").attr("data-current-value", "0");
				}
				else{		
					$("#m-minutes-prev").html(minutes[currentData-2].minutes + " Mins");
					$("#m-price-prev").html("$"+minutes[currentData-2].price);
					$("#talk-list").attr("data-current-value",currentData-1);
				}
				$("#m-minutes-current, #small_mins").html(minutes[currentData-1].minutes + " Mins");
				$("#m-price-current").html("$"+minutes[currentData-1].price).attr("data-value", minutes[currentData-1].price);
				$("#m-minutes-next").html(minutes[currentData].minutes + " Mins");
				$("#m-price-next").html("$"+minutes[currentData].price);
				$("#talk-list").attr("data-current-value",currentData-1);
				$("#talk div.jcarousel-control-next").removeClass("inactive");
			}
		break;
		
		case 1: 
			var currentData = $("#text-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData > 0){
				if((currentData-1) <= 0){
					$("#text div.jcarousel-control-prev").addClass("inactive");
					$("#text-list").attr("data-current-value", "0");
				}
				else{		
					$("#t-texts-prev").html(sms[currentData-2].texts + " Texts");
					$("#t-price-prev").html("$"+sms[currentData-2].price);
					$("#text-list").attr("data-current-value",currentData-1);
				}
				$("#t-texts-current, #small_texts").html(sms[currentData-1].texts + " Texts");
				$("#t-price-current").html("$"+sms[currentData-1].price).attr("data-value", sms[currentData-1].price);
				$("#t-texts-next").html(sms[currentData].texts + " Texts");
				$("#t-price-next").html("$"+sms[currentData].price);
				$("#text-list").attr("data-current-value",currentData-1);
				$("#text div.jcarousel-control-next").removeClass("inactive");
			}
		break;
		
		case 2: 
			var currentData = $("#data-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData > 0){
				if((currentData-1) <= 0){
					$("#data div.jcarousel-control-prev").addClass("inactive");
					$("#data-list").attr("data-current-value", "0");
				}
				else{		
					$("#d-data-prev").html(mbData[currentData-2].mb + " MB");
					$("#d-price-prev").html("$"+mbData[currentData-2].price);
					$("#data-list").attr("data-current-value",currentData-1);
				}
				$("#d-data-current").html(mbData[currentData-1].mb + " MB");
				$("#small_data").html(mbData[currentData+1].mb + " MB Data");
				$("#d-price-current").html("$"+mbData[currentData-1].price).attr("data-value", mbData[currentData-1].price);
				$("#d-data-next").html(mbData[currentData].mb + " MB");
				$("#d-price-next").html("$"+mbData[currentData].price);
				$("#data-list").attr("data-current-value",currentData-1);
				$("#data div.jcarousel-control-next").removeClass("inactive");
			}
		break;
	}
	updatePrice();
}

/*type: minutes=0, texts=1 and mbData=2 */
/*****************This function controls all next Button for carousel***********************/
function nextData(type){
	type = parseInt(type);
	switch(type){
		case 0: 
			var currentData = $("#talk-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData < (minutes.length-1)){
				console.log((currentData+1)+" : "+(minutes.length-1));
				if((currentData+1) >= (minutes.length-1)){				
					$("#talk div.jcarousel-control-next").addClass("inactive");
					$("#talk-list").attr("data-current-value", "0");
				}
				else{
					$("#talk div.jcarousel-control-prev, #talk div.jcarousel-control-next").removeClass("inactive");
					$("#m-minutes-next").html(minutes[currentData+2].minutes + " Mins");
					$("#m-price-next").html("$"+minutes[currentData+2].price);
					
				}
				$("#m-minutes-prev").html(minutes[currentData].minutes + " Mins");
				$("#m-price-prev").html("$"+minutes[currentData].price);
				$("#m-minutes-current, #small_mins").html(minutes[currentData+1].minutes + " Mins");
				$("#m-price-current").html("$"+minutes[currentData+1].price).attr("data-value", minutes[currentData+1].price);
				$("#talk-list").attr("data-current-value",currentData+1);
			}
		break;
		
		case 1: 
			var currentData = $("#text-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData < (sms.length-1)){
				console.log((currentData+1)+" : "+(sms.length-1));
				if((currentData+1) >= (sms.length-1)){				
					$("#text div.jcarousel-control-next").addClass("inactive");
					$("#text-list").attr("data-current-value", "0");
				}
				else{
					$("#text div.jcarousel-control-prev, #text div.jcarousel-control-next").removeClass("inactive");
					$("#t-texts-next").html(sms[currentData+2].texts + " Texts");
					$("#t-price-next").html("$"+sms[currentData+2].price);
					
				}
				$("#t-texts-prev").html(sms[currentData].texts + " Texts");
				$("#t-price-prev").html("$"+sms[currentData].price);
				$("#t-texts-current, #small_texts").html(sms[currentData+1].texts + " Texts");
				$("#t-price-current").html("$"+sms[currentData+1].price).attr("data-value", sms[currentData+1].price);
				$("#text-list").attr("data-current-value",currentData+1);
			}
		break;
		
		case 2: 
			var currentData = $("#data-list").attr("data-current-value");
			currentData = parseInt(currentData);
			if(currentData < (mbData.length-1)){
				console.log((currentData+1)+" : "+(mbData.length-1));
				if((currentData+1) >= (mbData.length-1)){				
					$("#data div.jcarousel-control-next").addClass("inactive");
					$("#data-list").attr("data-current-value", "0");
				}
				else{
					$("#data div.jcarousel-control-prev, #data div.jcarousel-control-next").removeClass("inactive");
					$("#d-data-next").html(mbData[currentData+2].mb + " MB");
					$("#d-price-next").html("$"+mbData[currentData+2].price);
					
				}
				$("#d-data-prev").html(mbData[currentData].mb + " MB");
				$("#d-price-prev").html("$"+mbData[currentData].price);
				$("#d-data-current").html(mbData[currentData+1].mb + " MB");
				$("#small_data").html(mbData[currentData+1].mb + " MB Data");
				$("#d-price-current").html("$"+mbData[currentData+1].price).attr("data-value", mbData[currentData+1].price);
				$("#data-list").attr("data-current-value",currentData+1);
			}
		break;
	}
	updatePrice();
}

function updatePrice(){
	var mins_price = parseFloat($("#m-price-current").attr("data-value"));
	var texts_price = parseFloat($("#t-price-current").attr("data-value"));
	var data_price = parseFloat($("#d-price-current").attr("data-value"));
	var lines = parseInt($(".people_box.selected").text()) * 6.98;
	var total = mins_price + texts_price + data_price + lines;
	console.log(total);
	$("#monthly_price").html("$"+total.toFixed(2));
}