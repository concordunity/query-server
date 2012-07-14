steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/operateDocs/docInvolved',
	'stock_docs/modules/content/operateDocs/docLended',
	'stock_docs/modules/content/operateDocs/docTestified',
	'stock_docs/modules/content/operateDocs/docOperateHistory'
).then( './operateDocs.css',
 	function($) {
		$.Controller('StockDocs.Content.OperateDocs', {
		},
		/** @Prototype */
		{
			init : function() {
			},
			
			'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
				var menu = $.route.attr('menu');
				if (!menu || menu != 'operateDocs') {
					return;
				}
				if (attr == 'nav') {
					switch(newVal) {
						case 'docInvolved':
							this.element.operateDocsInvolved().trigger('loadDocsInvolved');
							$('#dNavTitle').stock_docs_nav_title({title : '单证操作 - 添加/撤销涉案标志'}).trigger('loadNavTitle');
							break;
						case 'docLended' :
							this.element.operateDocsLended().trigger('loadDocsLended');
							$('#dNavTitle').stock_docs_nav_title({title : '单证操作 - 电子档案借阅/归还'}).trigger('loadNavTitle');
							break;
						case 'docTestified' :
							this.element.operateDocsTestified().trigger('loadDocsTestified');
							$('#dNavTitle').stock_docs_nav_title({title : '单证操作 - 出证处理'}).trigger('loadNavTitle');
							break;
						case 'docOperateHistory' :
							this.element.docOperateHistory().trigger('loadDocOperateHistory');
							$('#dNavTitle').stock_docs_nav_title({title : '单证操作 - 单证操作历史查询'}).trigger('loadNavTitle');
							break;
					}
				}
			}
		})
});