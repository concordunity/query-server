steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    'jquery/jquery.js',
    'docview/bootstrap/bootstrap.css',
    'libs/development-bundle/ui/jquery-ui-1.8.19.custom.js'
).then(
    //"./jquery-ui-1.8.12.custom.css"
).then(
//    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.dialog', {}, {
        init : function() {
 //          this.element.html(this.view('init'));
	   $(this.options.dialog_id).dialog({
		autoOpen: false,
		width: 538,
		modal: true
		});
        },
	closeDialog : function(el) {
	    $(el).dialog("close");
	},
	openDialog : function(el,text) {
            $(el).dialog("open");
            $(el).html(text);
	},
        show : function() {
        }
});
});

