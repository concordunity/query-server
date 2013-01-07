steal('jquery/model', function() {

$.Model('Docview.Models.Doc',
/* @Static */
{
    allPrintDoc : function(params, success, error) {
	return $.ajax({
	    url : '/documents/all_print_doc',
	    type : 'post',
	    data : params,
	    success : success,
	    error : error,
	    dataType : 'json doc.models'
        });
    },
    findAllPrint : function(params, success, error) {
	return $.ajax({
	    url : '/documents/all_print',
	    type : 'post',
	    data : params,
	    success : success,
	    error : error,
	    dataType : 'json doc.models'
        });
    },
    findAll : function(params, success, error) {
	return $.ajax({
	    url : '/comments/get',
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
