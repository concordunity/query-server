steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Details.Overview', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    //this.element.hide();
        },
	getHrefNoHash: function(el) {
            var shref = el.attr('href');
            var pos = shref.indexOf('#'); 
            if (pos < 0) {
                return shref;
            }

            return shref.substring(pos + 1);
        },
	'a.thumbnail click' : function(el, ev) {
	    ev.preventDefault();
	    var href = this.getHrefNoHash(el);
	    if (this.options.details_controller) {
		console.log("we will show page " + href);
		this.options.details_controller.showPage(el.data('doc-index'), +href);
	    }
	},
	/**
	 *   var currDoc = {
                label: label,
                pages: pages,
                directory: data.directory,
                metadata: metadata,
                groups: groups
            };
	 */
	showDoc : function(docIndex,docInfo, printString) {
	    $('.image-list').html(this.view("list", { doc_index : docIndex, images : docInfo.pages, print: printString } ));
	},

        show : function() {
        }
});
});

