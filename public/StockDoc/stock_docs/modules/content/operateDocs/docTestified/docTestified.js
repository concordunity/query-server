steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then('./views/init.ejs', 
 	function($) {
		$.Controller('StockDocs.Content.OperateDocs.DocTestified', {
			pluginName : "operateDocsTestified",
			listensTo : ['loadDocsTestified']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			
			loadDocsTestified : function() {
				this.element.html($.View('//stock_docs/modules/content/operateDocs/docTestified/views/init'));
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
			},
			
			'#btnSave click' : function(el, ev) {
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docTestified({'id' : id});
			},
			
			'#btnCancel click' : function(el, ev) {
				var id = $('#iBarcode').val();
				StockDocs.Models.OperateDocs.docTestified({'id' : id});
			},
			
			doSuccess : function() {
				alert('操作成功');
			},
			
			doFailed : function() {
				alert('操作失败');
			}
		})
});
