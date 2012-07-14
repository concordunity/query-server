/**
 * @author Robert
 */
steal('jquery/model', function() {

	/**
	 * @class Cookbook.Models.Recipe
	 * @parent index
	 * @inherits jQuery.Model
	 * Wraps backend recipe services.
	 */
	$.Model('StockDocs.Models.Login',
	/* @Static */
	{
		logout : function(attrs, success, error) {
			$.ajax({
				url : '/users/logout',
				type : 'GET',
				// dataType : 'json',
				success : success,
				error : error
			});
		},
		getLinks : function(attrs, success, error) {
			$.ajax({
				url : '/accounts/get_links',
				type : 'GET',
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