steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/queryDocs/docViewer')
.then('./views/init.ejs',
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs.BySingleBarcode', {
			 pluginName: "queryDocsBySingleBarcode",
			 listensTo : ['loadSingleBarcodeQuery']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			loadSingleBarcodeQuery : function() {
				this.element.html($.View('//stock_docs/modules/content/queryDocs/bySingleBarcode/views/init'));
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
	            $(":button").button();

				$('#dQueryDocsResult').queryDocsDocViewer().trigger('loadDocViewer');
			},
			'#btnSearchDocs click' : function(el, ev) {
				$('#dMsgBox').html('');
				$.route.attr('category', 'search');
				$.route.attr('id', $('#iBarcode').val());
			},
			'#btnFilter click' : function(el, ev) {
				$('#dFilterContainer').docQueryFilter().trigger('loadDocFilter');
			}

		})
});
