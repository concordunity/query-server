(function($){
	    
    var appendLog = function(url,params) {
        $.ajax({
            url : '/' + url + "_log",
            type : 'post',
            data : params,
            success : '',
            error : '',
	//    async : true,
            dataType : '' 
        });
    }
	
    window.log = appendLog;
})(jQuery)



/*
(function(win,$,undefined){


})(window,jQuery)
*/
