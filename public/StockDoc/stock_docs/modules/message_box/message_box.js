steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/controller/view')
.then('./views/message.ejs',
 	function($) {
		$.Controller('StockDocs.MessageBox', {
			defaults : {
				messageType : '',
				message : ''
			},
			listensTo : ['loadMessageBox']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			
			loadMessageBox : function() {
				this.element.html($.View('//stock_docs/modules/message_box/views/message', {
					messageType : this.options.messageType,
					message : this.options.message
				}));
			}
		})
});
