steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/queryDocs/bySingleBarcode',
	'stock_docs/modules/content/queryDocs/byMultiBarcodes',
	'stock_docs/modules/content/queryDocs/byAdvancedConditions',
	'stock_docs/modules/content/queryDocs/docFilter',
	'stock_docs/modules/nav_title'
).then( './views/init.ejs',
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs', {
		},
		/** @Prototype */
		{
			init : function() {
				this.initView();
			},
			
			initView : function() {
				this.element.html($.View('//stock_docs/modules/content/queryDocs/views/init'));
				$('#dQueryDocsConditionsContainer').wijexpander();
				$('#dQueryDocsResultContainer').wijexpander();
			},
			
			'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
				var menu = $.route.attr('menu');
				if (!menu || menu != 'queryDocs') {
					return;
				}
				if (attr == 'nav') {
					this.initView();
					switch(newVal) {
						case 'bySingleBarcode':
							$('#dQueryDocsConditions').queryDocsBySingleBarcode().trigger('loadSingleBarcodeQuery');
							$('#dNavTitle').stock_docs_nav_title({title : '单证查询 - 按报关单号单票查询'}).trigger('loadNavTitle');
							break;
						case 'byMultiBarcodes' :
							$('#dQueryDocsConditions').queryDocsByMultiBarcodes().trigger('loadMultiBarcodesQuery');
							$('#dNavTitle').stock_docs_nav_title({title : '单证查询 - 按报关单号批量查询'}).trigger('loadNavTitle');
							break;
						case 'byAdvancedConditions' :
							$('#dQueryDocsConditions').queryDocsByAdvancedConditions().trigger('loadAdvancedQuery');
							$('#dNavTitle').stock_docs_nav_title({title : '单证查询 - 特定条件组合查询'}).trigger('loadNavTitle');
							break;
					}
				}
			}

		})
});