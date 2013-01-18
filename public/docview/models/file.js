steal('jquery/model', function() {

$.Model('Docview.Models.File',
/* @Static */
{
//    models : function(data) {
//	//        //console.log(data);
//	return this._super(data.results);
//    },
	newTable: function(params, success, error) {
        return $.ajax({
            url : '/newtable',
            type : 'get',
            data : params,
            success : success,
            error : error,
            dataType : 'json file.models'
        });
    },
    
    updateDictionary : function(params, success, error) {
        return $.ajax({
            url : '/dictionary_info/update_dictionary',
            type : 'get',
            data : params,
            success : success,
            error : error,
	    async : false,
            dataType : 'json file.models'
        });
    },
    getDictionary : function(params, success, error) {
        return $.ajax({
            url : '/dictionary_info/get_dictionary',
            type : 'get',
            data : params,
            success : success,
            error : error,
	    async : true,
            dataType : 'json file.models'
        });
    },
    findDocComments : function(params, success, error) {
        return $.ajax({
            url : '/find_doc_comments',
            type : 'get',
            data : params,
            success : success,
            error : error,
	    async : false,

            dataType : 'json file.models'
        });
    },
    uploadFile : function(params, success, error) {
        return $.ajax({
            url : '/upload_file',
            type : 'post',
            data : params,
            success : success,
            error : error,

            dataType : 'json file.models'
	});
    },
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

    findPendingDocuments : function(queryParams, success, error) {
	$.ajax({
	    url: '/documents/pending_modified',
	    type: 'post',
	    data: queryParams,
	    success : success,
	    error: error,
	    dataType: 'json'
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
    },

    addComments : function(doc_id, page, subcode, folder_id, success, error) {
	return $.ajax({
	    url: '/comments/pagetype',
	    type : 'post',
	    data: {doc_id : doc_id,
		   page : page,
		   code : 1,
		   subcode : subcode,
		   folder_id : folder_id},
	    dataType: 'json',
	    success : success,
	    error : error
	});
    },
    deleteComment : function(docid, folder_id, nthPage, success, error) {
	return $.ajax({
	    url: '/comments/delete_pagetype',
	    type: 'post',
	    data : {doc_id : docid,
	    	    folder_id : folder_id,
		    page: nthPage},
	    dataType: 'json',
	    success : success,
	    error : error
	});
    },
    commitComments : function (params, success, error) {
	return $.ajax({
            url: '/comments/commit',
            type: 'post',
            data: params, 
            success: success,
            error: error});	
    },
    getComments : function(docid, success, error) {
	return $.ajax({
            url: '/comments/get',
            type: 'post',
            data: {doc_id: docid},
            success: success,
            error: error
	});   
    }

},
/* @Prototype */
{});

});
