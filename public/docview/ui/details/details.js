steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/details/tree',
    'docview/ui/details/viewer',
    'docview/ui/details/list',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    'docview/docview.css'
    'docview/ui/details/list/list.css'
).then(function($) {
    $.Controller('Docview.Ui.Details', {}, {
        init : function() {
            this.element.html(this.view('init'));
            this.documents = new Array();
            this.docIndex = 0;

            this.pageIndex = 1;
            this.element.find('#document-tree').docview_ui_details_tree(
            {
                clientState : this.options.clientState,
                details_controller : this
            });

            this.treeControl = this.element.find('#document-tree').controller();

            this.element.find('#document-viewer').docview_ui_details_viewer(
            {
                clientState : this.options.clientState,
                searchMode : this.options.searchMode,
                details_controller : this
            });
	    
            this.viewerControl = this.element.find('#document-viewer').controller();

            this.element.find('#document-list').docview_ui_details_list(
            {
                clientState : this.options.clientState,
                searchMode : this.options.searchMode,
                details_controller : this
            });
            this.listControl = this.element.find("#document-list").controller();
            this.listControl.list();

	    this.setViewingMode(0);

            this.to_show = false;
            //	    this.showing = false;
            this.hide();
        },
	
	// mode: 0 - in thumbnails 1 - in image viewer 
	setViewingMode: function(mode) {
	    if (mode == 0) {
		$("#document-list").show();
		$("#document-viewer").hide();
	    } else {
		$("#document-list").hide();
		$("#document-viewer").show();
	    }
	},
        hide : function() {
            this.element.hide();
        // this.showing = false;
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "document") {
                this.to_show = true; // this.element.show();
            } else {
                $('#downloadFrame').hide();
                this.to_show = false;
                this.hide();
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
        },

        show : function() {
            if (!this.to_show) {
                return;
            }
            this.viewerControl.setMode(this.options.searchMode.attr('mode'));
            $('#details-holder').show();
	    
            this.element.show();
        },

        // This will reset the documents data.
        queryDoc : function(docid) {
            this.element.find('#document-tree').docview_ui_details_tree('clearDocTree');
            this.documents = new Array();
            this.docIndex = 0;
            this.pageIndex = 1;
            this.addDoc(docid);
            this.to_show = true;
            this.viewerControl.switchOffPrintMenu();
        },

        addDoc : function(docid) {
            Docview.Models.File.findOne(docid, this.proxy('addDocumentData'),
                this.proxy('failure'));
        },

        addSpecialDoc : function(docid) {
            Docview.Models.File.findSpecialOne(docid, this.proxy('addDocumentData'),
                this.proxy('failure'));
        },
        getDoc : function(nth) {
            return this.documents[nth];
        },

        // Only for internal use. DO NOT call from outside of this class.
        showPageInternal : function(docIndex, nth) {
            this.docIndex = docIndex;
            this.pageIndex = nth;
            this.viewerControl.showPage(this.docIndex, this.pageIndex);
        },
        showPage : function(docIndex, nth) {
            // First do some input validation
            if (docIndex < this.documents.length) {

                var numPages = this.documents[docIndex].pages.length;
                if (nth > 0 && nth <= numPages) {
                    this.showPageInternal(docIndex, nth);
                    return;
                }

                // Now handle out of range for nth page.
                if (nth == numPages + 1) {
                    // Is there a next document??
                    if (this.docIndex != (this.documents.length - 1)) {
                        this.showPageInternal(docIndex + 1, 1);
                    }
                } else if (nth == 0) {
                    if (docIndex > 0) {
                        docIndex --;
                        var numPages = this.documents[docIndex].pages.length;
                        this.showPageInternal(docIndex, numPages);
                    }
                }
            }
        },
        showNextPage : function() {
            this.showPage(this.docIndex, this.pageIndex + 1);
        },

        showPreviousPage : function() {
            this.showPage(this.docIndex, this.pageIndex - 1);
        },
        addDocumentData : function(data) {
            this.show();
            // Load all data
            /*document: {
              pages: [] // Array of pages
              directory: "" // Location of image
              metadata: {} // metadata
              groups: [subgroup, subgroup, ...] // groups of images
	      }*/
	    
            var do_filter = false;
            var filter = this.options.clientState.attr('search').filters;
            if (filter != undefined && filter.length > 0 &&
		this.options.searchMode.attr('mode') != 'multi') {
                //console.log(filter);
                do_filter = true;
            }
            var metadata = data.doc_info;

            var groups = new Array();
            var subgroup = new Array();
            var pages = new Array();
            var images = data.image_info.T_blog;
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
                    groups.push({
                        type: prevType,
                        name: prevGroupName,
                        pages: subgroup
                    });
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
            groups.push({
                type: prevType,
                name: prevGroupName,
                pages: subgroup
            });

            var label = data.label;

            var currDoc = {
                label: label,
                pages: pages,
                directory: data.directory,
                metadata: metadata,
                groups: groups
            };

            var doc_index = this.documents.length;

            var s_mode = this.options.searchMode.attr('mode');

            if (s_mode == 'print' || s_mode == 'court' ||
		(s_mode == 'single' &&
		 this.options.clientState.attr('access').attr('manage_docs').print)) {
                if (doc_index == 1) {
                    this.viewerControl.switchOnPrintMenu();
                    this.viewerControl.addPrintMenu(this.documents[0].label, this.documents[0].label);
                }
                if (doc_index > 0) {
                    this.viewerControl.addPrintMenu('mod_' + this.documents[0].label, label);
                }
            }
            this.documents.push(currDoc);
            this.element.find('#document-tree').docview_ui_details_tree('addDocTree', currDoc, doc_index);
	    
            var docid = metadata.doc_id;
            if (this.documents.length == 1) {
                if (docid != undefined && docid != -1) {
                    var message = '以下为该单证电子档案扫描图像信息，原件共' + images.length + '页';
                    this.options.clientState.attr('alert', {
                        type: 'info',
                        heading: '报关单' + docid,
                        message : message
                    });
                }
            } else {
                var msgs = new Array();
                msgs.push('原件共' + this.documents[0].pages.length + '页');
                msgs.push( this.documents[1].label + ' 共'+ this.documents[1].pages.length + '页');

                $('#alerts').docview_alerts('showMessages', "success", '报关单 ' + docid,
                    '以下为该单证电子档案扫描图像信息', msgs);
            }
            // Start at page 1 by default
            //
            //暂时注释这段，改成List的功能
            this.showPage(0, 1);
            //console.log(currDoc);
            //this.listControl.listTest(currDoc);
            //this.options.clientState.attr('document').attr('current', 1);


            // Check for special doc
            var special = data.special_doc_info;
            if (special == undefined || !special) {
            // Do nothing
            } else {
                //this.addSpecialDoc('222520121250176875');
                this.addSpecialDoc(docid);
            }
        },
        ".one_pdf click" : function(el,ev){
            $("#document-list").hide();
            $("#document-viewer").show();
            var data_img = $(el).attr("data-img");
            this.showPage(0, data_img);
        },
        print_doc : function(doc_id, tag) {
            var dFrame = $('#downloadFrame');
            $('#details-holder').hide();

            dFrame.show();

            dFrame.attr('src', this.viewerControl.getPrintUrl(doc_id, tag));	    
        },
        // Need to work with IE7, where href attr is the whole URL.
        getHrefNoHash: function(el) {
            var shref = el.attr('href');
            var pos = shref.indexOf('#'); 
            if (pos < 0) {
                return shref;
            }

            return shref.substring(pos + 1);
        },
        'li.single-print .bprint click' : function(el, ev) {
            //console.log("bprint is clicked ....................", el, ev);
            this.print_doc($.route.attr('id'), '');

        },
	

        '.dropdown-menu li a click' : function(el, ev) {
            ev.preventDefault();
            var href = this.getHrefNoHash(el);
            if (!href) {
                return;
            }

            var mr = href.match(/mod_(\d{18})$/);
            if (mr) {
                this.print_doc(mr[1], 'mod');
                return;
            }
            mr = href.match(/tax_(\d{18})$/);
            if (mr) {
                this.print_doc(mr[1], 'mod');
                return;
            }

            mr = href.match(/^\d{18}$/);
            if (mr) {
                this.print_doc(mr[0], '');
            }
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