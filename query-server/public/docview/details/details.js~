steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/details/tree',
    'docview/details/viewer',
    'docview/bootstrap/bootstrap.css'
)
// View templates
.then(
    './views/init.ejs'
)
.then(function($) {
    /*
    * Tree view for a selected document
    */
    $.Controller('Docview.Details',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('init', {}));
            
            // By default we're hidden until the route conditions are met
            this.element.hide();
	    this.to_show = false;

            this.element.find('#document-tree').docview_details_tree({clientState: this.options.clientState});
            this.element.find('#document-viewer').docview_details_viewer({clientState: this.options.clientState});            
	    $('#downloadFrame').hide();
	    if (this.options.clientState.attr('access')
                .attr('manage_docs').attr('print')) {
	    } else {
		this.element.find('.bprint').hide();
	    }
	    this.element.find('.bcourt').hide();

        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "document") {
                this.to_show = true; // this.element.show();
            } else {
		$('#downloadFrame').hide();
		this.to_show = false;
                this.element.hide();
            }
        },
        '{$.route} page change': function(el, ev, attr, how, newVal, oldVal) {
            // this will have problems when you refresh the page and the event is an add and we
            // don't have the data populated yet
            this.element.find('li').removeClass('active');
            var pageSelector = '.page-' + newVal;
            this.element.find(pageSelector).addClass('active');
        },
        '{$.route} id change': function(el, ev, attr, how, newVal, oldVal) {
            // TODO: If we set category and id values sequentually, are the events done in order?
            //       i.e. does:
            //       $.route.attrs({ "category": "document", "id": "103420121342000022" }, true);
            //       yield:
            //       category change event, followed by id change event?
            // //console.log(el, ev);
	    $('#downloadFrame').hide();
	    if (newVal == -1) {
		return;
	    }
	    var lastStatus = this.options.clientState.attr('status');
	    if (lastStatus == undefined || lastStatus == 200) {
		if ($.route.attr('category') === 'document') {
                    Docview.Models.File.findOne(newVal, this.proxy('setData'), this.proxy('failure'));
		}
	    }
        },
	displayDoc : function(id) {
	    var lastStatus = this.options.clientState.attr('status');
	    if (lastStatus == undefined || lastStatus == 200) {
                Docview.Models.File.findOne(id, this.proxy('setData'), this.proxy('failure'));
	    }
	},
        setData: function(file) {
            /*document: {
                    pages: [] // Array of pages
                    directory: "" // Location of image
                    metadata: {} // metadata
                    groups: [subgroup, subgroup, ...] // groups of images
            }*/
	    var s_mode = this.options.searchMode.attr('mode');

	    if (s_mode == 'single' || s_mode == 'print') {
		this.element.find('.bprint').show();
	    } else {
		this.element.find('.bprint').hide();
	    }

	    if (s_mode == 'court') {
		this.element.find('.bcourt').show();
	    } else {
		this.element.find('.bcourt').hide();
	    }

	    $('#details-holder').show();

	    this.element.show();

	    var do_filter = false;
	    var filter = this.options.clientState.attr('search').filters;
	    //console.log("filter is ", filter);
	    if (filter != undefined && filter.length > 0) {
		//console.log(filter);
		do_filter = true;
	    }
            var metadata = file.doc_info;
            var directory = "/docimages/";

            var groups = new Array();
            var subgroup = new Array();
            var pages = new Array();
            var images = file.image_info.T_blog;
            var prevType;
            var prevGroupName;

            for (var i = 0; i < images.length; i++) {
		var pt = images[i].TCode;
		
		if (do_filter && pt!=0 && $.inArray(pt, filter) < 0) {
		    //console.log("passing page ... ", pt);
		    continue;
		}
                if (pt !== prevType && prevType !== undefined) {
                    // Push previous subgroup and type into groups
                    groups.push({type: prevType, name: prevGroupName, pages: subgroup});
                    subgroup = new Array();
                }
                subgroup.push(images[i].FN);
                pages.push(images[i].FN);
                
                if (images[i].BT) {
                    subgroup.push(images[i].BT);
                    pages.push(images[i].BT);
                }
                prevType = pt;
                prevGroupName = images[i].T;
            }
            // Push our remaining subgroup into groups
            groups.push({type: prevType, name: prevGroupName, pages: subgroup});
            
            //console.log({
            //    pages: pages,
            //    directory: directory,
            //    metadata: metadata,
            //    groups: groups
            //});
            this.options.clientState.attr('document', {
                pages: pages,
                directory: directory,
                metadata: metadata,
                groups: groups
            });
            
            var docid = $.route.attr('id');
	    if (docid != undefined && docid != -1) {
	       var message = '以下为该单证电子档案扫描图像信息，原件共' + images.length + '页';

		this.options.clientState.attr('alert', {
		    type: 'info',
		    heading: '报关单' + docid,
		    message : message
		});
	    }
	    // Start at page 1 by default
	    this.options.clientState.attr('document').attr('current', 1);
        },
	'.bprint click' : function(el, ev) {
	    //console.log('about to print .... ');
	    var dFrame = $('#downloadFrame');
	    $('#details-holder').hide();

	    dFrame.show();
	    dFrame.attr('src', '/docview/printdoc.html?' + $.route.attr('id'));
	    //dFrame.attr('src', '/docview/printdoc.html?' + $.route.attr('id'));
	 //   window.open('/docview/printdoc.html?' + $.route.attr('id'), '_blank', 'width=460,height=430');
	    //window.open('/docview/printdoc.html?' + $.route.attr('id'), '_self');
	},
	'.bcourt click' : function(el, ev) {
	    //console.log('about to court');
	   // window.open('/docview/courtdoc.html?' + $.route.attr('id'), '_blank', 'width=460,height=430');
	    var dFrame = $('#downloadFrame');
	    $('#details-holder').hide();
	    dFrame.show();
	    //window.open('/docview/courtdoc.html?' + $.route.attr('id'), '_self');
	    //var dFrame = $('#downloadFrame');
	    //dFrame.attr('src', '/docs/testify/' + $.route.attr('id'));
	    dFrame.attr('src', '/docview/courtdoc.html?' + $.route.attr('id'));
	},
	hideAll: function() {
	    this.element.hide();
	    $('#downloadFrame').hide();

            this.element.find('#document-tree').docview_details_tree('hideAll');
	},
        failure: function(jqXHR, textStatus, errorThrown) {
	    var t = 'error';
	    var h = '错误提示：';
	    var message = '需要用户认证，请重新登录系统。';
            var docid = $.route.attr('id');

	    if (jqXHR.status == 404) {
               type = 'info';
	       message = '系统中没有单证' + docid + '档案信息';	
	    } else if (jqXHR.status == 403) {
               type = 'info';
               message = '无法查阅单证'+ docid + '，权限不足。';
            } else if (jqXHR.status == 500) {
               message = '系统内部错误';
            } else if (jqXHR.status == 400) {
	       message = '系统内部错误： 无法获取单证电子图像。';
	    }
	    this.options.clientState.attr('alert', {
		type: t,
		heading: h,
		message : message
	    });
            //console.log("[Error]", data);
        }
    });
});
