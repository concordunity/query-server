steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/manageAccounts/manageUsers',
	'stock_docs/modules/content/manageAccounts/manageRoles'
).then(
 	function($) {
		$.Controller('StockDocs.Content.ManageAccounts', {
		},
		/** @Prototype */
		{
			init : function() {
			},
			
			'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
				var menu = $.route.attr('menu');
				if (!menu || menu != 'manageAccounts') {
					return;
				}
				if (attr == 'nav') {
					switch(newVal) {
						case 'manageUsers':
							this.element.manageAccountsUsers().trigger('loadManageUsers');
							$('#dNavTitle').stock_docs_nav_title({title : '账户管理 - 用户管理'}).trigger('loadNavTitle');
							break;
						case 'manageRoles':
							this.element.manageAccountsRoles().trigger('loadManageRoles');
							$('#dNavTitle').stock_docs_nav_title({title : '账户管理 - 角色权限管理'}).trigger('loadNavTitle');
							break;
					}
				}
			}
		})
});