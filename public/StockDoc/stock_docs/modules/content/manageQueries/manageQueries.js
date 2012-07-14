steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/manageQueries/queriesHistory',
	'stock_docs/modules/content/manageQueries/usabilityStatis',
	'stock_docs/modules/content/manageQueries/performanceStatis'
).then( 
 	function($) {
		$.Controller('StockDocs.Content.ManageQueries', {
		},
		/** @Prototype */
		{
			init : function() {
			},
			
			'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
				var menu = $.route.attr('menu');
				if (!menu || menu != 'manageQueries') {
					return;
				}
				if (attr == 'nav') {
					switch(newVal) {
						case 'queriesHistory':
							this.element.docQueriesHistory().trigger('loadQueryHistories');
							$('#dNavTitle').stock_docs_nav_title({title : '查阅管理 - 查看单证浏览历史'}).trigger('loadNavTitle');
							break;
						case 'performanceStatis':
							this.element.performanceStatis().trigger('loadPerformanceStatis');
							$('#dNavTitle').stock_docs_nav_title({title : '查阅管理 - 绩效统计'}).trigger('loadNavTitle');
							break;
						case 'usabilityStatis':
							this.element.usabilityStatis().trigger('loadUsabilityStatis');
							$('#dNavTitle').stock_docs_nav_title({title : '查阅管理 - 使用统计'}).trigger('loadNavTitle');
							break;
					}
				}
			}
		})
});