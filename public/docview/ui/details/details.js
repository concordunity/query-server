steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/details/tree',
    'docview/ui/details/viewer',
    'docview/ui/details/overview',
    'docview/bootstrap/bootstrap.css'
).then(
    './doc_manager.js',
    './document.js',
    './views/init.ejs',
    'docview/docview.css'
).then(function($) {
    $.Controller('Docview.Ui.Details', {}, {
        init : function() {
            this.element.html(this.view('init'));
            this.docManager = new DocManager();

            this.element.find('#document-tree').docview_ui_details_tree(
            {
                clientState : this.options.clientState,
                docManager: this.docManager,
		details_controller: this
            });

            this.treeControl = this.element.find('#document-tree').controller();

            this.element.find('#document-viewer').docview_ui_details_viewer(
            {
                clientState : this.options.clientState,
                docManager: this.docManager
            });
	    
            this.viewerControl = this.element.find('#document-viewer').controller();

            this.element.find('#document-overview').docview_ui_details_overview(
            {
                clientState : this.options.clientState,
                docManager: this.docManager,
		details_controller: this
            });
            this.overview = this.element.find('#document-overview').controller();

            this.to_show = false;
            this.hide();
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
            this.viewerControl.setMode(this.options.clientState.attr('searchMode'));
            $('#details-holder').show();
	    
            this.element.show();
        },
	getPrintString: function() {
	    var mode = this.options.clientState.attr('searchMode');
	    if (mode == 'print' || (mode == 'single' &&
				    this.options.clientState.attr('access').attr('manage_docs').print)) {
		return 'print';
	    }

	    if (mode == 'court') {
		return 'court'
	    }

	    return '';
	},
	showOverview : function(docIndex) {
	    var docInfo = this.docManager.getNthDoc(docIndex);
	    
	    if (docInfo) {
		$('#document-viewer').hide();
		$('#document-overview').show();
		//console.log("SHOW?ING OVERVIEW ", docIndex);
		this.overview.showDoc(docIndex, docInfo, this.getPrintString());
	    }
	},
	showPage : function(index, page) {
	    //console.log("show page ", page, " doc index ", index);
	    var pageInfo = this.docManager.gotoPage(index, page);
            $("#document-overview").hide();
            $("#document-viewer").show();
	    if (pageInfo) {
		this.viewerControl.showImage(pageInfo.imagePath);
	    }
	},
	'.print-all click' :function (el, ev) {
	    var doc = this.docManager.getNthDoc(el.data('doc-index'));
	    if (doc) {
		this.print_doc(doc, '');
	    }
	},
	'.print-selected click' :function (el, ev) {
	    var page_arr = [];
	    $.each($(".select_checkbox_print"),function(index,value){
                if(value.checked==true){
                    value.checked = false;
                    page_arr.push(value.value);
                }
            });
	    if (page_arr.length < 1) {
		alert('请至少选择一页打印');
		return;
	    }
		
	    var doc = this.docManager.getNthDoc(el.data('doc-index'));
	    if (doc) {
		this.print_doc(doc, page_arr);
	    }
	},
        // This will reset the documents data.
        queryDoc : function(docid) {
            this.treeControl.clearDocTree();
	    this.docManager.clear();

            this.addDoc(docid);
            this.to_show = true;
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
        addDocumentData : function(data) {
            this.show();

	    

            // Load all data
            /*document: {
              pages: [] // Array of pages
              directory: "" // Location of image
              metadata: {} // metadata
              groups: [subgroup, subgroup, ...] // groups of images
	      }*/
	    
	    var filters = "";

            var filter = this.options.clientState.attr('search').filters;
            if (filter != undefined && filter.length > 0 &&
		this.options.clientState.attr('searchMode') != 'high-risk' &&
		this.options.clientState.attr('searchMode') != 'advanced') {
                filters = filter;
            }
	    var docIndex = this.docManager.getNumDocs();

	    var doc = new Document(data, filters);
	    this.docManager.addDocument(doc);
	    if (doc.hasSpecialDoc()) {
		this.addSpecialDoc(doc.getDocId());
	    }

	    // Add tree.
	    // TODO(weidong)
	    this.treeControl.addDocTree(doc, docIndex);
           // this.showPage(0, 1);
            this.showOverview(0);


        },
        print_doc : function(doc, pageSelection) {
            var dFrame = $('#downloadFrame');
            $('#details-holder').hide();

            dFrame.show();
	    var p = this.getPrintString();

	    var base = "/docs/print";
	    if (p === 'court') {
		base = "/docs/testify";
	    }

	    var url = doc.getPrintUrl(base, pageSelection);
	    //console.log("Print URL is ", url);
	    dFrame[0].contentWindow.loadPDF(url);
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
