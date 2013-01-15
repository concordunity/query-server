/**
	System Logger for jQuery
	//
	@example -> 

	log('system',{ 
		current_action:'manage_account.users',
		describe:'用户管理'
	 });
	
	@by zhou zhen<zhouzhen@concordunity.com>
	@create at 2013-01-09
*/
(function($){
	    
    var appendLog = function(url,params) {
        $.ajax({
            url : '/' + url + "_log",
            type : 'post',
            data : params,
            success : function(){
				//development log , can be remove ..
				console.log('log:',url,params);
			},
            error : '',
	    async : true,
            dataType : '' 
        });
    }
	
    window.log = appendLog;
})(jQuery)



/*
(function(win,$,undefined){


})(window,jQuery)
*/
