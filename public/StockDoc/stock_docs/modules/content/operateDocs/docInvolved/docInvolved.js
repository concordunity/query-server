steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then('./views/init.ejs', 
 	function($) {
		$.Controller('StockDocs.Content.OperateDocs.DocInvolved', {
			pluginName : "operateDocsInvolved",
			listensTo : ['loadDocsInvolved']
		},
		/** @Prototype */
		
		{ 
			init : function() {
	
			}, loadDocsInvolved : function() {
				this.element.html($.View('//stock_docs/modules/content/operateDocs/docInvolved/views/init'));
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
			},
	
			'#btnSaveInvolved click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docAddInvolved({
					'doc_id' : id
				}, this.callback('addInvolvedSuccess'), this.callback('addInvolvedError'));
			},
			'#btnCancelInvolved click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docRemoveInvolved({
					'doc_id' : id
				}, this.callback('removeInvolvedSuccess'), this.callback('removeInvolvedError'));
	
			},
			addInvolvedSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "添加涉案标志成功。"
				}).trigger('loadMessageBox');
			},
			addInvolvedError : function(data) {
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
			removeInvolvedSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "撤销涉案标志成功。"
				}).trigger('loadMessageBox');
			},
			removeInvolvedError : function(data) {
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
