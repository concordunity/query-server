steal('jquery/controller', 'jquery/view/ejs', 'jquery/dom/form_params', 'jquery/controller/view')
.then('./views/init.ejs', './views/docOperateHistory.ejs',
	function($) {
	$.Controller('StockDocs.Content.OperateDocs.DocOperateHistory', {
		pluginName : "docOperateHistory",
		listensTo : ['loadDocOperateHistory']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadDocOperateHistory : function() {
			this.element.html($.View('//stock_docs/modules/content/operateDocs/docOperateHistory/views/init'));

			$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
			$('button').button();
		},
		'#btnSearchDocOperateHistory click' : function(el, ev) {
			ev.preventDefault();
			
			$('#dMsgBox').html('');
			
			var docId = $('#iBarcode').val();
			StockDocs.Models.OperateDocs.findDocOperateHistory({'doc_id' : docId}, this.callback('showDocOperateHistory'), this.callback('showDocOperateHistoryError'));
		},
		showDocOperateHistory : function(data) {
			$('#docOperateHistoryResult').html($.View('//stock_docs/modules/content/operateDocs/docOperateHistory/views/docOperateHistory', {
				data : data
			}));
			$("#tbDocOperateHistory").wijgrid({
				allowSorting : true,
				allowPaging : true,
				pageSize : 15,
			});
		},
		showDocOperateHistoryError : function(data) {
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
