steal('jquery/model', function() {
	$.Model('StockDocs.Models.Role',
	/* @Static */
	{
		findAll : function(params, success, error) {
			return $.ajax({
				url : '/roles',
				type : 'get',
				dataType : 'json',
				data : params,
				success : success,
				error : error
			})
		},
		findOne : function(params, success, error) {
			var self = this, id = params.id;
			delete params.id;
			return $.ajax({
				url : '/roles/' + id,
				type : 'get',
				dataType : 'json',
				data : params,
				success : success,
				error : error
			})
		},
		create : function(attrs, success, error) {
			$.ajax({
				url : '/roles',
				type : 'POST',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		update : function(id, attrs, success, error) {
			$.ajax({
				url : '/roles/' + id,
				type : 'PUT',
				contentType : 'application/json',
				data : $.toJSON(attrs),
				dataType : 'json',
				success : success,
				error : error
			});
		},
		destroy : function(id, success, error) {
			$.ajax({
				url : '/roles/' + id,
				type : 'DELETE',
				dataType : 'json',
				success : success,
				error : error
			});
		}
	},
	/* @Prototype */
	{
	});

})