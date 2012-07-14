steal('jquery/controller', 'jquery/view/ejs', 'jquery/dom/form_params', 'jquery/controller/view')
.then('./views/init.ejs',
	function($) {
	$.Controller('StockDocs.Content.OperateDocs.PerformanceStatis', {
		pluginName : "performanceStatis",
		listensTo : ['loadPerformanceStatis']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadPerformanceStatis : function() {
			$('#dMsgBox').html('');
			new StockDocs.Models.QueryHistories().findPerformanceStatis(this.callback('showPerformanceStatis'), this.callback('showPerformanceStatisError'));
		},
		showPerformanceStatis : function(data) {
			this.element.html($.View('//stock_docs/modules/content/manageQueries/performanceStatis/views/init', {
				data : data
			}));
			$("#tbPerformanceStatis").wijgrid({
				allowSorting : true,
				allowPaging : true,
				pageSize : 15,
			});
		},
		showPerformanceStatisError : function(data) {
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
