(function($){
	$.parseCode = function(code){
		if(code == '')						return -1;
		if(!/^\d+$/.test(code))				return -2;

		var s1 = code.substring(0,2);//22
		var s2 = code.substring(2,4);//3,4=10,11
		var s3 = code.substring(4,8);//4,8=2012
		var s4 = code.substring(8,9);//9=0,1
		var s5 = code.substring(9,11);//10,11 > 50 - 50
		
		var year = (new Date()).getFullYear();

		if(s1 == '')						return -3;
		if(!(s1 == '22')) 					return -4;
		if(s2 == '')						return -5;
		if(!/^\d{2}$/.test(s2))				return -6;
		if(s3 == '')						return -7;
		if(!/^\d{4}$/.test(s3))				return -8;
		if(!(s3 <= year))					return -9;
		if(s4 == '')						return -10;
		if(s5 == '')						return -11;
		if(!/^\d{2}$/.test(s5))				return -12;

		//var i2 = parseInt(s2);
		//var i4 = parseInt(s4);
		//var i5 = parseInt(s5);
		var i2 = parseInt(s2*1);
		var i4 = parseInt(s4*1);
		var i5 = parseInt(s5*1);
		
		if(i5 > 50 && !(i4 == 0))			return -13;
		if(i5 < 50 && !(i4 == 1))			return -14;
		if(i4 == 1 && !(i5 == i2 )) 		return -15;
		if(i4 == 0 && !((i5 - 50) == i2 )) 	return -16;
		if(!(/^\d{18}$/.test(code)))		return -17;
		return 0;
	};

/*
	$.parse_code_map = {
		'-1':'不能为空',
		'-2':'必须数字',
		'-3':'前缀为空',
		'-4':'格式错误',
		'-5':'关区为空',
		'-6':'关区长度错误',
		'-7':'年份为空',
		'-8':'年份长度错误',
		'-9':'年份错误',
		'-10':'标识位为空',
		'-11':'校验位为空',
		'-12':'校验位长度错误',
		'-13':'标识位或校验位错误(0)',
		'-14':'标识位或校验位错误(1)',
		'-15':'关区或校验位错误(0)',
		'-16':'关区或校验位错误(1)',
		'-17':'长度错误',
		'0':'OK',
		'1':'权限错误',
		'99':'验证中'
	};
*/
	
	$.parse_code_map = {
		'-1':'报关单号非法(-1)',
		'-2':'报关单号非法(-2)',
		'-3':'报关单号非法(-3)',
		'-4':'报关单号非法(-4)',
		'-5':'报关单号非法(-5)',
		'-6':'报关单号非法(-6)',
		'-7':'报关单号非法(-7)',
		'-8':'报关单号非法(-8)',
		'-9':'报关单号非法(-9)',
		'-10':'报关单号非法(-10)',
		'-11':'报关单号非法(-11)',
		'-12':'报关单号非法(-12)',
		'-13':'报关单号非法(-13)',
		'-14':'报关单号非法(-14)',
		'-15':'报关单号非法(-15)',
		'-16':'报关单号非法(-16)',
		'-17':'报关单号非法(-17)',
		'0':'可以添加',
		'1':'权限错误(1)',
		'99':'验证中'
	};

		
	$.fn.asyncVerifyCode = function(callback){
		var $this = $(this);
		var code = $this.val();
		var resultCode = $.parseCode(code);
		var orgCode = code.substring(9,12);
		if(orgCode.length == 3 && orgCode != $this.data('lastCode')){
			callback(99);
			$this.data('lastCode',orgCode);
			var xhr = $.get('/filter_org',{ doc_id: orgCode },function(data){
				callback(-100);
				var r = (data.length > 0) ? 0 : 1;
				$this.data('lastResult',r);
				if(r > 0){
					callback(r);
				}else{
					callback(resultCode);
				}
			});
			return;
		}else if(orgCode && $this.data('lastResult')){
			callback($this.data('lastResult'));		
			return;
		}
		callback(resultCode);
	};
	
})(jQuery);
