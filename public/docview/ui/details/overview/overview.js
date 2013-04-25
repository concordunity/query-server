steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css',
    'docview/ui/details/document.js'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Details.Overview', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    this.element.hide();
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
		//console.log("we will show page " + href);
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
	reloadImage : function(ev) {
	    
	    setTimeout(function () {
		var timestamp = new Date().getTime();
		var el = $(ev.target);
		var imgSrc = el.attr('src');
		console.log(imgSrc);
		var pos = imgSrc.indexOf('?');
		if (pos != -1) {
		    imgSrc = imgSrc.substring(0, pos);
		}
		el.attr('src', imgSrc + '?' +timestamp);
	    }, 1000);
	},
	showDoc : function(docIndex, docInfo, printString) {
	    //console.log("show doc", docIndex, docInfo,printString);
	    //console.log("show doc", docIndex, docInfo, docInfo.getThumbnailPaths(), printString);
	    var thumb_paths = docInfo.getThumbnailPaths();
	    var comment_list = docInfo.getCommentList(docIndex, docInfo, thumb_paths); 
	    //console.log(comment_list);
		var is_print = this.options.clientState.attr('access').attr('manage_docs').attr('print');
		var is_test = this.options.clientState.attr('access').attr('manage_docs').attr('testify');
		console.log('===is print ?====',is_print);
	    $('.image-list').html(this.view("list", { doc_index : docIndex, images : thumb_paths, print: printString, comment_list: comment_list, is_print: is_print, is_test: is_test} ));
	    this.element.find('a.thumbnail img').error(this.proxy('reloadImage'));
	},

        show : function() {
        }
});
});

