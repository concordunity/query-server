steal('jquery/model', function() {
	$.Model('StockDocs.Models.Profile',
	/* @Static */
	{
		changePassword : function(attrs, success, error) {
			return $.ajax({
				url : '/accounts/chpwd',
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