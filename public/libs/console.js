(function(window){
	if(!('console' in window)){
		window['console'] = {};
		var log = ['log','info'];
		for(var i=0;i<log.length;i++){
			window['console'][log[i]] = function(msg){
			};
		}
	}	
})(window);
