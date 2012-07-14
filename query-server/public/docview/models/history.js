steal('jquery/model', 'jquery/lang/json')
    .then(function($) {

$.Model('Docview.Models.History',
{
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