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
    'docview/bootstrap/bootstrap-dropdown.js'
).then(
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
            this.element.html(this.view('viewer', {doc_rights : this.options.clientState.attr('access').attr('manage_docs')}));

	    this.courtMode = false;
            this.element.find('.document-page').html(
                this.view('image'));



	    this.element.find('div.image-viewer').bind("contextmenu", function(e){  
		return false;  
	    });

	    this.switchOffPrintMenu();
	    this.pluginCreated = false;
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

	setMode : function(s_mode) {
	    //this.showing = true;
	    //var xxx = 		this.element.find('li.dropdown a');

	    if (s_mode == 'print' ||(s_mode=='single' &&
				     this.options.clientState.attr('access').attr('manage_docs').print)) {
		this.courtMode = false;
                this.element.find('.single-print').show();
		this.element.find('.single-print .bprint').html("打 印");
		//		this.element.find('li.dropdown a.dropdown-toggle').text("打 印");
		$('#hackxxx a').text("打 印");
		return;
	    }
	    
	    if (s_mode == 'court') {

		this.courtMode = true;
                this.element.find('.single-print').show();
		this.element.find('.single-print .bprint').html("出 证");
		$('#hackxxx a').text("出 证");
	//	this.element.find('li.dropdown a.dropdown-toggle').text("出 证");
		return;
	    }
	    
            this.element.find('.single-print').hide();
	    this.element.find('.dropdown').remove();
	},

        '.next click': function(el, ev) {
            ev.preventDefault();
	    var pageInfo = this.options.docManager.gotoNextPage();
	    if (pageInfo) {
		this.showImage(pageInfo.imagePath);
	    }
//
//	    this.options.details_controller.showNextPage();
        },

        '.previous click': function(el, ev) {
            ev.preventDefault();
	    var pageInfo = this.options.docManager.gotoPrevPage();
	    if (pageInfo) {
		this.showImage(pageInfo.imagePath);
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
	switchOnPrintMenu : function() {
	    this.element.find('li.single-print').after(
		this.view('print_dropdown_menu'));
	    this.element.find('.dropdown-toggle').dropdown();

	    if (this.courtMode) {
		$('#hackxxx a').text("出 证");
	    }
	    this.element.find('.single-print').hide();
	    this.element.find('.dropdown').show();
	},
	switchOffPrintMenu : function() {
	    this.element.find('.single-print').show();
	    this.element.find('.dropdown').remove();
	},	
	addPrintMenu : function(href, label) {
	    this.element.find('ul.dropdown-menu').append('<li><a href="#'+ href + '">' + label +"</a></li>");
	},
//	'.dropdown-menu li a click' : function(el, ev) {

//	    console.log("we clicked ", el);
//	    ev.preventDefault();
//	},
	// nthDoc is 0-based, and nthPage is 1-based.
	showImage : function (imagePath) {
	    if (this.pluginCreated) {
		this.element.find('div.image-viewer').iviewer('loadImage', imagePath);
	    } else {
		this.createPlugin(imagePath);
	    }
	},
/*	showPage: function(nthDoc, nthPage) {
	    $('#pageno').html('第 '+nthPage+' 页');
	    var docInfo = this.options.details_controller.getDoc(nthDoc);
	    
            var dir = docInfo.directory;
            var docId = docInfo.metadata.doc_id;
            var file = docInfo.pages[nthPage - 1];

	    var imagePath = dir + "/" + docId + '/' + docId + '/' + file;	 

	    //this.iviewerControl.loadImage(imagePath);

	    //this.iviewerControl.fit();

	    this.element.find('div.image-viewer').iviewer('loadImage', imagePath);
	    this.element.find('div.image-viewer').iviewer('center');//loadImage', imagePath);
	},*/
        // document: {
        //    pages: [] // Array of pages
        //    directory: "" // Location of image
        //    metadata: {} // metadata
        //    groups: [subgroup, subgroup, ...] // groups of images
        // }
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
