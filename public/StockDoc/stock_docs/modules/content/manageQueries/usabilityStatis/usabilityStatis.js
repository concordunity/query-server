steal('jquery/controller', 'jquery/view/ejs', 'jquery/dom/form_params', 'jquery/controller/view')
.then('./views/init.ejs',
	function($) {
	$.Controller('StockDocs.Content.OperateDocs.UsabilityStatis', {
		pluginName : "usabilityStatis",
		listensTo : ['loadUsabilityStatis']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadUsabilityStatis : function() {
			$('#dMsgBox').html('');
			new StockDocs.Models.QueryHistories().findUsabilityStatis(this.callback('showUsabilityStatis'), this.callback('showUsabilityStatisError'));
		},
		showUsabilityStatis : function(data) {
			this.element.html($.View('//stock_docs/modules/content/manageQueries/usabilityStatis/views/init', {
				data : data
			}));
			$("#tbUsabilityStatis").wijgrid({
				allowSorting : true,
				allowPaging : true,
				pageSize : 15,
			});
		},
		showUsabilityStatisError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有该文档的操作记录。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
		},
	})
});
