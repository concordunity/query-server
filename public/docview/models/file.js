steal('jquery/model', function() {

$.Model('Docview.Models.File',
/* @Static */
{
//    models : function(data) {
//	//        //console.log(data);
//	return this._super(data.results);
//    },

    findAll : function(params, success, error) {
        //console.log(params);
	$.route.attr("id", -1);
        if ("doc_ids" in params) {
	    return $.ajax({
		url : '/documents/multi_query',
		type : 'post',
		data : params,
		success : success,
		error : error,
		
		dataType : 'json'
            });
	} else {
	    return $.ajax({
		url : '/documents/search_docs',
		type : 'post',
		data : params,
		success : success,
		error : error,
		
		dataType : 'json file.models'
            });
	}
    },
    by_doc_source : function(params, success, error) {
	return $.ajax({
	    url : '/documents/by_doc_source',
	    type : 'post',
	    data : params,
	    success : success,
	    error : error,
	    
	    dataType : 'json file.models'
        });
    },

    findSpecialOne : function(id, success, error) {
	$.ajax({
            url: '/special_docs/' + id,
            type: 'get',
            success: success,
            error: error,
            dataType: 'json file.model'
        });
    },

    findOne: function(id, success, error) {
        if (id.charAt(0) == '#') {
	    return $.ajax({
		url: '/api/docs/' + id.substring(1),
		type: 'get',
		success: success,
		error: error,
		dataType: 'json file.model'
            });
	}
        return $.ajax({
            url: '/docs/' + id,
            type: 'get',
            success: success,
            error: error,
            dataType: 'json file.model'
        });
    },

    createGroup: function(params, success, error) {
	return $.ajax({
            url: '/documents/create_group',
            type: 'post',
            data: {doc_id: docIds},
            success: success,
            error: error
	});
    }
},
/* @Prototype */
{});

});