steal('jquery/model', 'jquery/lang/json').then(function($) {
	$.Model('Docview.Models.BusinessProcess', {
		createBusinessProcess : function(params, success, error) {
            return $.ajax({
                url : '/eir_business_process',
                type : 'post',
                data : params,
                success : success,
                error : error,
				dataType : 'json business_process.models'
            }); 
        },
		destroy : function(id, success, error) {
            return $.ajax({
            url : '/eir_business_process/' + id,
            type : 'DELETE',
            dataType : 'json',
            success : success,
            error : error
			});
		},
		findAllBusinessProcess : function(params, success, error) {
        	return $.ajax({
            	url : '/eir_business_process', 
				type : 'post',
				data : params,
				success : success,
				error : error
			});
		},
		downLoadBusinessProcess : function(params, success, error) {
        	return $.ajax({
            	url : '/eir_business_process', 
				type : 'post',
				data : params,
				success : success,
				error : error
			});
		},
		findOneBusinessProcess : function(params, success, error) {
        	return $.ajax({
            	url : '/eir_business_process', 
				type : 'post',
				data : params,
				success : success,
				error : error
			});
		},
		findBusinessProcess : function(params, success, error) {
        	return $.ajax({
            	url : '/interchange_receipt/list', 
				type : 'post',
				data : params,
				success : success,
				error : error
			});
		}
	},
	{});
});
