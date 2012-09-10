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
		var start = $(".paging-header-start-end input[name='paging-header-start']").attr("value");
		var end = $(".paging-header-start-end input[name='paging-header-end']").attr("value");
	    if (total <= this.numPerPage) {
		//console.log("we do nto have enough pages");
		//return;
                this.element.find('div.paging-header').html("");
                this.element.hide();
	    } else {
                this.element.find('div.paging-header').html(this.view('tabs', { numPerPage: this.numPerPage, total: data.total, start: start, end: end}));
                this.element.show();
	    }
	    
	    //console.log("we do have enough pages");
	    //this.element.find('div.paging-header').html(this.view('tabs', { numPerPage: this.numPerPage, data: data}));
	    //this.element.find('div.paging-header').html(this.view('tabs', { numPerPage: this.numPerPage, total: data.total}));
	    //this.element.show();
	},
    show : function() {
    }
});
});

