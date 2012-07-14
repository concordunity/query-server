steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then(
 	function($) {
		$.Controller('StockDocs.Content.QueryDocs.ShowDocDetail', {
			 pluginName: "queryDocsShowDocDetail"
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			
			'a.showDocDetail click' : function(el, ev) {
				ev.preventDefault();
				$('#dDocList').hide();
				$('#dDocDetail').show();
				$('#btnBack2List').button();
				$.route.attr('category', 'search');
				$.route.attr('id', el.attr('href').substring(1));
			},
			
			'#btnBack2List click' : function(el, ev) {
				$('#dDocDetail').hide();
				$('#dDocList').show();
			}

		})
});
