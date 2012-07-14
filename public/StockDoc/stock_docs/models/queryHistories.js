steal('jquery/model', function() {
	$.Model('StockDocs.Models.QueryHistories',
	/* @Static */
	{
		
	},
	/* @Prototype */
	{
		findAllByUser : function(attrs, success, error) {
			return $.ajax({
				url : '/qh/u/' + attrs.id,
				type : 'get',
				dataType : 'json',
				success : success,
				error : error
			})
		},
		findAllByDoc : function(attrs, success, error) {
			return $.ajax({
				url : '/qh/d/' + attrs.id,
				type : 'get',
				dataType : 'json',
				success : success,
				error : error
			})
		},
		findUsabilityStatis : function(success, error) {
			return $.ajax({
				url : '/document_histories/dh_report',
				type : 'get',
				dataType : 'json',
				success : success,
				error : error
			})
		},
		findPerformanceStatis : function(success, error) {
			return $.ajax({
				url : '/document_histories/dh_report',
				type : 'get',
				dataType : 'json',
				success : success,
				error : error
			})
		}
	});

})