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
    'libs/comments_arr.js',
    'docview/docview.css'
).then(function($) {
    $.Controller('Docview.Ui.Details', {}, {
        init : function() {
            this.element.html(this.view('init',this.options.clientState));
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
            //this.viewerControl.setMode(this.options.clientState.attr('searchMode'));
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
	    if (mode == 'multi') {
		return 'multi'
	    }
	    if (mode == 'show_doc') {
		return 'show_doc'
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
	    //console.log("when showPage way,this pageInfo is :",pageInfo);
            $("#document-overview").hide();
            $("#document-viewer").show();
	    if (pageInfo) {
		this.viewerControl.showPage(pageInfo);
	    }
	},

/*	'.comment-confirm click' : function(el,ev) {
	    var doc = this.docManager.getNthDoc(el.data('doc-index'));
	    if (doc) {
		this.commitDocComments();
	    }
	},
*/
	'.commit-comments click' : function(el, ev) {
	    ev.preventDefault();
	    var doc = this.docManager.getNthDoc(el.data('doc-index'));
	    if (doc) {
	        var status = true;
		Docview.Models.File.findDocComments({doc_id : doc.docId, folder_id : doc.folder_id},function(data){
		    status = data.status;
		    //console.log(status);
		},{});

		console.log("current status is ",status);

		if (status == true) {
			console.log("current doc is ",doc);
			Docview.Models.File.commitComments({doc_id : doc.getDocId(), json_text : doc.getJsonString(), folder_id : doc.folder_id, is_mod : doc.isSpecialDoc},
						   this.proxy("commitOk"),this.proxy("failure"));
		}else{
		    this.commitError();
		}
	    }
	},
	commitOk : function(data) {
	    var t = 'info';
            var h = '提示信息：';
            var message = '成功修改单证标签种类。';
            var docid = $.route.attr('id');

	    console.log("=====commitOk");
	    console.log(data);
            if (data.status == 204) {
                type = 'error';
                message = '单证标签种类失败';
	    }
	    this.options.clientState.attr('alert', { type: t, heading: h, message : message });
	},
	commitError : function() {
	   console.log("=====commitError");
	  
	   this.options.clientState.attr('alert', { type: "info", heading: "提示信息：", message : "单证标签种类失败"}); 
	},
	'.print-all click' :function (el, ev) {
	    var doc = this.docManager.getNthDoc(el.data('doc-index'));
	    //console.log(doc);
	    if (doc) {
		this.print_doc(doc, '');
	    }
	},
	'.print-selected click' : function (el, ev) {
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
        queryDoc : function(docid,folderid) {
            this.treeControl.clearDocTree();
	    this.docManager.clear();

            this.addDoc(docid);

	    var docIndex = 0;
	    this.showOverview(docIndex);
	    console.log("folderid is ",folderid);
	    if (folderid != undefined) {
		docIndex = $("div.folder-id-"+folderid).attr("data-index");
		console.log("div.folder-id-"+folderid);
		console.log($("div.folder-id-"+folderid));
		console.log("docIndex is ",docIndex);
		if (docIndex != undefined && docIndex != null){
		    this.showOverview(docIndex);
		}
	    }
            this.to_show = true;
        },


        addDoc : function(docid) {
	    that = this;
            Docview.Models.File.findOne(docid, function(data){
							var filters = that.options.clientState.attr('search').filters;
							var filter_arr = [];
							console.log(filters);
							$.each(filters,function(index,value){
								filter_arr.push(value);
							});
							console.log(filter_arr);
							log("query",{current_action: "search.search", describe: "成功查阅单证。", doc_id: docid, filters: filter_arr});    
		    that.addDocumentData(data);	
		},
		//this.proxy('addDocumentData'),
                this.proxy('failure'));
        },

	displayDoc: function(docid) {
	    this.treeControl.clearDocTree();
	    this.docManager.clear();
	    this.to_show = true;
	    Docview.Models.File.findOne(docid, this.proxy('addDocumentData'),
					this.proxy('failure'));
	},

        addSpecialDoc : function(docid) {
            Docview.Models.File.findSpecialOne(docid, this.proxy('addSpecialDocumentData'), this.proxy('failure'));
	//note: special doc
            //Docview.Models.File.findSpecialOne(docid, this.proxy('addDocumentData'), this.proxy('failure'));
        },
	addSpecialDocumentData : function(data) {
	    var that = this;
	    $.each(data["result"],function(i){
		//console.log("===1====");
		//console.log(i);
		//console.log(data["result"][i]);
		that.addDocumentData(data["result"][i]);
	    })
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
	    //console.log("=======1");
            var filter = this.options.clientState.attr('search').filters;
            if (filter != undefined && filter.length > 0 &&
		this.options.clientState.attr('searchMode') != 'high-risk' &&
		this.options.clientState.attr('searchMode') != 'advanced') {
                filters = filter;
            }
	    //console.log("=======2");
	    var docIndex = this.docManager.getNumDocs();

	    //console.log("=======3");
	    //console.log(data);
	    var doc = new Document(data, filters);
	    //console.log("=======4");
	    //console.log(doc);
	    this.docManager.addDocument(doc);
	    //console.log("=======5");
	    if (doc.hasSpecialDoc()) {
		this.addSpecialDoc(doc.getDocId());
	    }

	    //console.log("=======6");
	    // Add tree.
	    // TODO(weidong)
	    this.treeControl.addDocTree(doc, docIndex);
	    //console.log("=======7");
           // this.showPage(0, 1);
            this.showOverview(0);


        },
        print_doc : function(doc, pageSelection) {
            var dFrame = $('#downloadFrame');
            $('#details-holder').hide();

            dFrame.show();
			var p = this.getPrintString();
			var message = {current_action: "manage_docs.print_doc", describe: "进行了单证打印操作。", doc_id: doc.docId};
			var base = "/docs/print";
			if (p === 'court') {
					base = "/docs/testify";
					message = {current_action: "manage_docs.court_doc", describe: "进行了单证出证操作。", doc_id: doc.docId};
			}
			log("document",message);
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
            } else if (jqXHR.status == 204) {
                type = 'info';
                message = '单证标签种类失败';
            } else if (jqXHR.status == 403.1) {
                type = 'info';
                message = '无法查阅单证'+ docid + '，权限不足。';
            } else if (jqXHR.status == 403) {
                type = 'info';
                message = '无法查阅单证'+ docid + '，权限不足。';
            } else if (jqXHR.status == 500) {
                message = '系统内部错误';
            } else if (jqXHR.status == 407) {
					message = '系统安全子系统未初始化，请联系管理员。';
			} else if (jqXHR.status == 400) {
					message = '系统内部错误： 无法获取单证电子图像。';
			} else if (jqXHR.status == 401) {
					message = '系统内部错误： 系统繁忙，请稍后再试。';
            }
            this.options.clientState.attr('alert', {
                type: t,
                heading: h,
                message : message
            });
			
            if (jqXHR.status == 403.1) {
                	var message_var = '无法查阅单证'+ docid + '，此单证已经被涉案。';
					log("query",{current_action: "search.search", describe: message_var, doc_id: docid, current_status: false});    
			} else {
					log("query",{current_action: "search.search", describe: message, doc_id: docid});    
			}
        //console.log("[Error]", data);
        }
    });
});
