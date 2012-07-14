steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/queryDocs/showDocDetail',
	'stock_docs/modules/content/queryDocs/docViewer'
	)
.then('./views/init.ejs',
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs.ByMultiBarcodes', {
			 pluginName: "queryDocsByMultiBarcodes",
			 listensTo : ['loadMultiBarcodesQuery']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			loadMultiBarcodesQuery : function() {
				this.element.html($.View('//stock_docs/modules/content/queryDocs/byMultiBarcodes/views/init'));
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
	            $(":button").button();
			},
			'#btnSearchDocs click' : function(el, ev) {
				$('#dMsgBox').html('');
				
				var attrs = new Object();
				
				var docIds = new Array();
				var $input = $('input:text.iBarcode');
				$.each($input, function() {
					if($(this).val()) {
						docIds.push($(this).val());
					}
				});
				attrs.doc_id = docIds;

				StockDocs.Models.Doc.multiQuery(attrs, this.callback('showDocList'), this.callback('showDocListError'));
			},
			'#btnFilter click' : function(el, ev) {
				$('#dFilterContainer').docQueryFilter().trigger('loadDocFilter');
			},
			showDocList : function(data) {
				$('#dQueryDocsResultContainer').show();
				$('#dQueryDocsConditionsContainer').wijexpander('collapse');
				$('#dQueryDocsResultContainer').wijexpander('expand');
				$('#dQueryDocsResult').html($.View('//stock_docs/modules/content/queryDocs/byMultiBarcodes/views/docList', {data : data}));
				$("#tbDocQueryList").wijgrid({
					allowSorting : true,
					allowPaging : true,
					pageSize : 10
				});
				$('#dShowDocDetail').queryDocsDocViewer().trigger('loadDocViewer');
				$("#dQueryDocsResult").queryDocsShowDocDetail();
			},
			showDocListError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有该批量单证的任何信息。';
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
