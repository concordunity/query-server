steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then('./views/init.ejs', 
 	function($) {
		$.Controller('StockDocs.Content.OperateDocs.DocLended', {
			pluginName : "operateDocsLended",
			listensTo : ["loadDocsLended"]
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			
			loadDocsLended : function() {
				this.element.html($.View('//stock_docs/modules/content/operateDocs/docLended/views/init'));
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
			},
			
			'#btnSaveLended click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docAddCheckout({
					'doc_id' : id
				}, this.callback('addCheckoutSuccess'), this.callback('addCheckoutError'));
			},
			'#btnCancelLended click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docRemoveCheckout({
					'doc_id' : id
				}, this.callback('removeCheckoutSuccess'), this.callback('removeCheckoutError'));
	
			},
			addCheckoutSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "电子档案借阅操作成功。"
				}).trigger('loadMessageBox');
			},
			addCheckoutError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有找到待操作的单证。';
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
			removeCheckoutSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "电子档案归还操作成功。"
				}).trigger('loadMessageBox');
			},
			removeCheckoutError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有找到待操作的单证。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			}
		})
});
