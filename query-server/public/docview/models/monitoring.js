steal('jquery/model', function() {

$.Model('Docview.Models.Monitoring',
/* @Static */
{
    getData : function(url, data, success, error) {
	$.ajax({
	    url: url,
	    type: 'post',
	    data: data,
	    dataType: 'json',
	    success: success, 
	    error: error,
	    cache: false
	});
    }
},
/* @Prototype */
{});

});