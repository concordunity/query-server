steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'stock_docs/modules/content/queryDocs/showDocDetail',
	'stock_docs/modules/content/queryDocs/docViewer')
.then('./views/init.ejs',
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs.ByAdvancedConditions', {
			pluginName : "queryDocsByAdvancedConditions",
			listensTo : ['loadAdvancedQuery']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			
			loadAdvancedQuery : function() {
				this.element.html($.View('//stock_docs/modules/content/queryDocs/byAdvancedConditions/views/init'));
				
				$(":input[type='text']:not(.input-date),:input[type='password'],textarea").wijtextbox();
	
				$(":input[type='text'].input-date").wijinputdate({
					showTrigger : true,
					dateFormat: "yyyy-MM-dd"
				});

            	$("select").wijdropdown();
	            $(":button").button();
	            
	            $('#edcStartDate').val('');
				$('#edcEndDate').val('');
			},
			
			'#btnSearchDocs click' : function(el, ev) {
				$('#dMsgBox').html('');
				
				var formParams = $('#fAdvancedQuery').formParams();

				StockDocs.Models.Doc.advancedQuery(formParams, this.callback('showDocList'), this.callback('showDocListError'));
			},
			'#btnFilter click' : function(el, ev) {
				$('#dFilterContainer').docQueryFilter().trigger('loadDocFilter');
			},
			showDocList : function(data) {
				$('#dQueryDocsResultContainer').show();
				$('#dQueryDocsConditionsContainer').wijexpander('collapse');
				$('#dQueryDocsResultContainer').wijexpander('expand');
				$('#dQueryDocsResult').html($.View('//stock_docs/modules/content/queryDocs/byAdvancedConditions/views/docList', {data : data}));
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
					message = '系统中没有符合该组合查询条件的单证。';
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
