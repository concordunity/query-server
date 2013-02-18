steal('jquery/model', 'jquery/lang/json').then(function($) {
	$.Model('Docview.Models.Requisition', {
		models : function(data) {
		// Parse the data into something more usable for our views
		// We want to merge the roles array into the requisitionarray
		// Assume that the requisitions array is 1:1 with the roles array in size
			for (var i = 0; i < data.requisitions.length; i++) {
				data.requisitions[i].requisition_details= data.requisition_details[i];
			}
			return this._super(data.requisitions);
		},
    	findRequisition: function(params, success, error) {
        	return $.ajax({
            	url : '/requisitions', 
				type : 'get',
				data : params,
				success : success,
				error : error,
				async : false,
				dataType : 'json requisition.models'
			});
		},
		filterDocs: function(params, success, error) {
        	return $.ajax({
            	url : '/filter_docs', 
				type : 'get',
				data : params,
				success : success,
				error : error
			});
		},
		updateRequisition: function(params, success, error) {
        	return $.ajax({
            	url : '/requisitions', 
				type : 'post',
				data : params,
				success : success,
				error : error,
				async : false,
				dataType : 'json requisition.models'
			});
		}
	},
	{});
});
