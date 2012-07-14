steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/mainteProfile/updatePassword'
).then(
 	function($) {
		$.Controller('StockDocs.Content.MainteProfile', {
		},
		/** @Prototype */
		{
			init : function() {
			},
			
			'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
				var menu = $.route.attr('menu');
				if (!menu || menu != 'mainteProfile') {
					return;
				}
				if (attr == 'nav') {
					switch(newVal) {
						case 'updatePassword':
							this.element.updatePassword().trigger('loadUpdatePassword');
							$('#dNavTitle').stock_docs_nav_title({title : '个人设置 - 修改密码'}).trigger('loadNavTitle');
							break;
					}
				}
			}
		})
});