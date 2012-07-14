steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view', 
	'stock_docs/modules/content/queryDocs/docViewer/details/tree', 
	'stock_docs/modules/content/queryDocs/docViewer/details/viewer')
.then('./views/init.ejs', function($) {
	$.Controller('StockDocs.Content.QueryDocs.DocViewer', {
		pluginName : "queryDocsDocViewer",
		listensTo : ['loadDocViewer']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadDocViewer : function() {
			this.element.html($.View('//stock_docs/modules/content/queryDocs/docViewer/views/init'));
			// Client State
			var state = new $.Observe({
				category : "",
				id : "",
				page : "",
				document : {
					pageCount : 0,
					pages : [],
					currentPage : 0,
					directory : ""
				}
			});

			$('#document-tree').docview_details_tree({
				clientState : state
			});
			$('#document-viewer').docview_details_viewer({
				clientState : state
			});

			state.attr('category', "trololol");
		}
	})
});
