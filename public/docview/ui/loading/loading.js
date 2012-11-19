steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/bootstrap/bootstrap-button.js',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.loading', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },
	".btn-primary click" : function(el,ev) {
	   ev.preventDefault();
	   $(el).button("loading");
	   window.setTimeout(function(){
		console.log(' =====1');
		$(el).button("reset");	
		},3000);
	   console.log("====2");
	   
	},
        show : function() {
        }
});
});

