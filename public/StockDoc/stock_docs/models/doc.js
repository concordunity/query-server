steal('jquery/model', function() {
	$.Model('StockDocs.Models.Doc',
	/* @Static */
	{
		multiQuery : function(attrs, success, error) {
			return $.ajax({
				url : '/documents/multi_query',
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			})
		},
		advancedQuery : function(attrs, success, error) {
			return $.ajax({
				url : '/documents/search_docs',
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			})
		}
	},
	/* @Prototype */
	{
		
	});

})