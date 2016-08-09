
function preload(){
	if(document.images){
		for (var i = 0; i< arguments.length; i++){
			//alert(arguments[i] + '_over');
			self[arguments[i] + '_over'] = new Image();
			self[arguments[i] + '_over'].src = '/images/' + arguments[i] + '_over.gif';
			self[arguments[i] + '_off'] = new Image();
			self[arguments[i] + '_off'].src = '/images/' + arguments[i] + '.gif';
		}
	}
}

function rollover(src, state){
	if (document.images && self[src + '_' + state]){
		document.images[src].src = self[src + '_' + state].src;
	}
}

function pageNotImplemented(){
	alert("This linked page is not being developed by JUXT.");
	return false;
}
