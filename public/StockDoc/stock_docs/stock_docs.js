steal(	'jquery', 'jquery/dom/cookie' ,'libs/wijmo')
.then(
		'./stock_docs.css',
		// './fixtures/fixtures.js',
		'./models/models.js',
		'stock_docs/modules/message_box'
)
.then(
		'stock_docs/modules/layout',
	function(){					// configure your application
		$('#dLayout').stock_docs_layout();
})