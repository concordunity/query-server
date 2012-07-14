steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then('./views/init.ejs', './docFilter.css',
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs.DocFilter', {
			 pluginName: "docQueryFilter",
			 listensTo : ['loadDocFilter']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			loadDocFilter : function() {
				this.element.html($.View('//stock_docs/modules/content/queryDocs/docFilter/views/init'));
				var self = this;
				$("#dDocFilter").wijdialog({
					autoOpen : false,
					resizable : true,
					width : 765,
					height : 325,
					modal : true,
					buttons : {
						"確定" : function() {
							var formParams = $('#fDocFilter').formParams();
							// if (self.options.save == 'create')	{
								// delete formParams.id;
								// StockDocs.Models.User.create(formParams, self.callback('addUserSuccess'), self.callback('addUserError'));
							// } else if (self.options.save == 'update') {
								// StockDocs.Models.User.update(formParams.id, formParams, self.callback('updateUserSuccess'), self.callback('updateUserError'));
							// }
							$.route.attr('filter', self.getFilterValue());
							$(this).wijdialog("close");
						},
						"取消" : function() {
							$(this).wijdialog("close");
						}
					}
				});
				$("#dDocFilter").wijdialog('open');
				// $(':checkbox').wijcheckbox();
			},
			getFilterValue : function() {
				var result = [];
				var $filterItems = $('#fDocFilter').find(':checkbox');
				$.each($filterItems, function() {
				  	if ($(this).is(':checked')) {
				  		result.push($(this).attr('value'));
				  	}
				});
				return result;
			}
		})
});
