steal('jquery/model', 'jquery/lang/json')
    .then(function($) {

$.Model('Docview.Models.History',
{
    
    findLog: function(params, success, error) {
        return $.ajax({
            url : '/find_log', 
            type : 'post',
            data : params,
            success : success,
            error : error,
			async : false,
            dataType : 'json history.models'
        });
    },

    findSelf : function(params, success, error) {
	$.ajax({
	    url: '/qh/u',
	    type: 'post',
	    data: params,
	    success : success, 
	    error : error,
	    dataType: 'json history.models'
	});
    }
},
	{});
    });
