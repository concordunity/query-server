steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    './views/tabs.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Paging', {}, {
        init : function() {
            this.element.html(this.view('init'));

	    this.numPerPage = 500;
	    if (this.options.pageConfig) {
		this.numPerPage = this.options.pageConfig.numPerPage;
	    }
	    this.element.hide();
        },

	// We assume that the data is 
	showPages : function(data) {
	    var total = data.total;

	    if (total <= this.numPerPage) {
		console.log("we do nto have enough pages");
		return;
	    }
	    
	    console.log("we do have enough pages");
	    //this.element.find('div.paging-header').html(this.view('tabs', { numPerPage: this.numPerPage, data: data}));
	    this.element.find('div.paging-header').html(this.view('tabs', { numPerPage: this.numPerPage, total: data.total}));
	    this.element.show();
	},

        show : function() {
        }
});
});

