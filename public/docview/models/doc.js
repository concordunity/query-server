steal('jquery/model', function() {

$.Model('Docview.Models.Doc',
/* @Static */
{
    findAll : function(params, success, error) {
	return $.ajax({
	    url : '/admin/show_docs',
	    type : 'get',
	    data : params,
	    success : success,
	    error : error,
	    dataType : 'json doc.models'
        });
    }
},
/* @Prototype */
{});

});
