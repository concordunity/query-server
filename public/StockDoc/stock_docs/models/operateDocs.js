steal('jquery/model', function() {
	$.Model('StockDocs.Models.OperateDocs',
	/* @Static */
	{
		docAddInvolved : function(attrs, success, error) {
			$.ajax({
				url : '/inquire/add/' + attrs.doc_id,
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		docRemoveInvolved : function(attrs, success, error) {
			$.ajax({
				url : '/inquire/remove/' + attrs.doc_id,
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		docTestified : function(attrs, success, error) {
			$.ajax({
				url : '/docTestified/' + attrs.id,
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		docAddCheckout : function(attrs, success, error) {
			$.ajax({
				url : '/checkout/checkout/' + attrs.doc_id,
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		docRemoveCheckout : function(attrs, success, error) {
			$.ajax({
				url : '/checkout/checkin/' + attrs.doc_id,
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		findDocOperateHistory : function(attrs, success, error) {
			return $.ajax({
				url : '/document_histories/query/' + attrs.doc_id,
				type : 'get',
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