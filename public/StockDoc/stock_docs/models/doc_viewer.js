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
	$.Model('StockDocs.Models.DocViewer',
	/* @Static */
	{
		findOne : function(params, success, error) {
			$.ajax({
				url : "/docs/" + params.id,
				type : "GET",
				dataType : "json",
				success : success,
				error : error
			});
		}
		// print : function(params, success, error) {
			// $.ajax({
				// url : "/docs/print/" + params.id,
				// type : "GET",
				// success : success,
				// error : error
			// });
		// }
	},
	/* @Prototype */
	{
	});

})