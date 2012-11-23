steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/bootstrap/bootstrap.css'
).then(
    'libs/development-bundle/ui/jquery-ui-1.8.19.custom.js',
    'docview/docview.css',
    'docview/bootstrap/bootstrap.min.js',
    'docview/ui/comments',
    'docview/ui/errorcomment',
    'libs/iviewer/jquery.mousewheel.min.js'
).then (
    './views/viewer.ejs',
    './views/image.ejs',
    'libs/iviewer/jquery.iviewer.css',
    'libs/iviewer/jquery.iviewer.js'
).then(function($) {
    $.Controller('Docview.Ui.Details.Viewer',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('viewer',
					{doc_rights : this.options.clientState.attr('access').attr('manage_docs'), searchMode : this.options.clientState.attr("searchMode")}));
	    this.currentPageInfo = undefined;

	    this.courtMode = false;
            this.element.find('.document-page').html(
                this.view('image'));

	    this.element.find('div.image-viewer').bind("contextmenu", function(e){  
		return false;  
	    });

	    this.pluginCreated = false;
	    this.commentsController = undefined;
	    this.errorCommentController = undefined;

	    // this.element.find('.dropdown').hide();
        },

	createPlugin: function(imagePath) {
	    if (this.pluginCreated) {
		return;
	    }
	    this.pluginCreated = true;
	    this.element.find('div.image-viewer').iviewer({
		src : imagePath,
		zoom: "fit",
		zoom_delta : 1.05,
		zoom_max : 100,
		zoom_min : 50,
		update_on_resize: true
	    });
	},
/*
　　    "{document} keyup":function(el,e) {
	     e.preventDefault();
　　 　     var currKey=0,e=e||event;
　　 　     currKey=e.keyCode||e.which||e.charCode;
　 　 　    var keyName = String.fromCharCode(currKey);
            if (currKey == 39) {
	        var pageInfo = this.options.docManager.gotoNextPage();
                if (pageInfo) {
                    this.showImage(pageInfo.imagePath);
                }	
            } else if (currKey == 37) {
            var pageInfo = this.options.docManager.gotoPrevPage();
                if (pageInfo) {
                    this.showImage(pageInfo.imagePath);
                }
	    }
	    
　　    },
*/
        'li.next click': function(el, ev) {
            ev.preventDefault();
	    var pageInfo = this.options.docManager.gotoNextPage();
	    if (pageInfo) {
		this.showPage(pageInfo);
	    }
//
//	    this.options.details_controller.showNextPage();
        },

	updateComment : function(data) {
	    this.options.docManager.updateCommentData(data);
	    this.displayCommentsControl({code: data.subcode,
					 label : data.info});
	},
	'li.error-comments click' : function(el, ev) {
	    ev.preventDefault();
	    if (this.errorCommentController) {
		this.errorCommentController.setCommentsUI(this.currentPageInfo);
	    } else {
		$('#comments').docview_ui_errorcomment({pageInfo: this.currentPageInfo,
						    controller : this});
		this.errorCommentController = $('#comments').controller();
	    }
	},
	'li.comments click' : function(el, ev) {
	    ev.preventDefault();
	    if (this.commentsController) {
		this.commentsController.setCommentsUI(this.currentPageInfo);
	    } else {
		$('#comments').docview_ui_comments({pageInfo: this.currentPageInfo,
						    controller : this});
		this.commentsController = $('#comments').controller();
	    }
	},
        'li.previous click': function(el, ev) {
            ev.preventDefault();
	    var pageInfo = this.options.docManager.gotoPrevPage();
	    if (pageInfo) {
		this.showPage(pageInfo);
	    }
	    //this.options.details_controller.showPreviousPage();
        },  
	getPrintUrl: function(doc_id, tag) {
	    var url = "/docview/printdoc.html?" + doc_id;
	    if (this.courtMode) {
		var url = "/docview/courtdoc.html?" + doc_id;
	    }

	    if (tag != '') {
		url = url + "&tag=" + tag
	    }
	    return url;
	},

	displayCommentsControl : function(proposedPageType) {
	    if (this.currentPageInfo.nthPage == 1) {
		this.element.find('li.comments').hide();
	    } else if (proposedPageType != null) {
		
		this.element.find('li.comments').hide();

		$('#comments').html(this.view('comment', {proposedPageType : proposedPageType}));
	    } else {
		this.element.find('li.comments').show();
	    }
	},

	'.delete-comment submit' : function(el, ev) {
	    ev.preventDefault();
	    var pageInfo = this.currentPageInfo;
	    Docview.Models.File.deleteComment(pageInfo.doc.getDocId(),
					      pageInfo.nthPage, this.proxy('handleCommentDeleted'));
	},

	handleCommentDeleted: function(data) {
	    $('#comments').html('');
	    this.displayCommentsControl(null);
	    var pageInfo = this.currentPageInfo;
	    pageInfo.doc.deleteCommentData(
		pageInfo.nthPage);
	},
	// nthDoc is 0-based, and nthPage is 1-based.
	showPage : function (pageInfo) {
	    this.currentPageInfo = pageInfo;

	    $('#comments').html('');

	    this.displayCommentsControl(pageInfo.proposedPageType);

	    if (this.pluginCreated) {
		this.element.find('div.image-viewer').iviewer('loadImage', pageInfo.imagePath);
	    } else {
		this.createPlugin(pageInfo.imagePath);
	    }
	    $('#pageno').html('第 '+ pageInfo.nthPage +' 页');	    
	},

        '{clientState} document.current change': function(el, ev, attr, how, newVal, oldVal) {
            if (how === "set" || how === "add") {
		//console("this is document current change  ..." );
		    //this.showPage(0, 1);
	    }
        }
        // Have details.js control tree and viewer
        // viewer watches client state on docs to know what to cache
    });
});
