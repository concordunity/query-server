steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/controller/view')
.then('./views/title.ejs',
 	function($) {
		$.Controller('StockDocs.NavTitle', {
			defaults : {
				title : ''
			},
			listensTo : ['loadNavTitle']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			loadNavTitle : function() {
				this.element.html($.View('//stock_docs/modules/nav_title/views/title', {title : this.options.title}));
			}

		})
});
