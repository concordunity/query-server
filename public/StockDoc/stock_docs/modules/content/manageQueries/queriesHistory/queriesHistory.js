steal('jquery/controller', 'jquery/view/ejs', 'jquery/dom/form_params', 'jquery/controller/view')
.then('./views/init.ejs', './views/docQueriesHistoryResult.ejs', './views/userQueriesHistoryResult.ejs', function($) {
	$.Controller('StockDocs.Content.ManageQueries.QueriesHistory', {
		pluginName : "docQueriesHistory",
		listensTo : ['loadQueryHistories']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadQueryHistories : function() {
			this.element.html($.View('//stock_docs/modules/content/manageQueries/queriesHistory/views/init'));

			$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
			$('button').button();
			$("#tabs").wijtabs();
		},
		'#btnSearchUserViewHistory click' : function(el, ev) {
			ev.preventDefault();
			
			$('#dMsgBox').html('');
			
			var userId = $('#iUser').val();
			new StockDocs.Models.QueryHistories().findAllByUser({'id' : userId}, this.callback('showUserViewHistory'), this.callback('showUserViewHistoryError'));
		},
		showUserViewHistory : function(data) {
			$('#userViewHistoryResult').html($.View('//stock_docs/modules/content/manageQueries/queriesHistory/views/userQueriesHistoryResult', {
				data : data
			}));
			$("#tbUserQueryHistory").wijgrid({
				allowSorting : true,
				allowPaging : true,
				pageSize : 10,
			});
		},
		'#btnSearchDocViewHistory click' : function(el, ev) {
			ev.preventDefault();
			
			$('#dMsgBox').html('');
			
			var docId = $('#iBarcode').val();
			new StockDocs.Models.QueryHistories().findAllByDoc({'id' : docId}, this.callback('showDocViewHistory'), this.callback('showDocViewHistoryError'));
		},
		showDocViewHistory : function(data) {
			$('#docViewHistoryResult').html($.View('//stock_docs/modules/content/manageQueries/queriesHistory/views/docQueriesHistoryResult', {
				data : data
			}));
			$("#tbDocQueryHistory").wijgrid({
				allowSorting : true,
				allowPaging : true,
				pageSize : 10,
			});
		},
		showDocViewHistoryError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有该文档的历史查阅记录。';
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
		showUserViewHistoryError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有该用户的文档查阅记录。';
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
