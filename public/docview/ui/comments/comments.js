steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/bootstrap/bootstrap.min.js',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Comments', {}, {
        init : function() {
	    var pageType = this.options.pageInfo ? this.options.pageInfo.pageType : -1;

            this.element.html(this.view('init', {pageType : pageType}));

	    //console.log("we set type to " + pageType);
	    this.element.find(":radio[value=" + pageType +"]").attr('checked',true);

        },

        show : function() {
        }
});
});

