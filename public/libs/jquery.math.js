/*
	jQuery Math Libary

	//writed by lsong at 2013-01-31
*/
(function($){
	/*
		转换为千分位
		
		example:
			$.thousands(32000);  //32,000
			$.thousands(1250000);//1,250,000
	*/	
	$.thousands = function(num){
		var str = num.toString();
		var regex = /(-?\d+)(\d{3})/;
		while(regex.test(str)){
			str = str.replace(regex,"$1,$2");
		}
		return str;
	};

})(jQuery);
