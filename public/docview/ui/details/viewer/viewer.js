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
	    //console.log('updateComment :',data);
	    this.options.docManager.updateCommentData(data);
	    this.displayCommentsControl({code: data.subcode,
					 label : data.info});
	},
	handleCommentsOk : function(data) {
	    this.errorCommentController.clearContent();
            //console.log('添加反馈信息后，返回的结果');
            this.updateComment(data); 
	},
	'li.error-comments click' : function(el, ev) {
	    ev.preventDefault();
            var subcode = "0"; 
            //console.log("sub code ", subcode);
	    if (this.errorCommentController == undefined) {
		$('#comments').docview_ui_errorcomment({pageInfo: this.currentPageInfo, controller : this});
		this.errorCommentController = $('#comments').controller();
	    }
	    this.errorCommentController.setCommentsUI(this.currentPageInfo);
	    if (this.pageType != -1 && subcode == this.pageType) {
		    alert ("选择的种类没有变化");
	    } else {
		    var pageInfo = this.currentPageInfo; 
		   // console.log('已经点击了反馈信息的选项,创建新的修改单证种类(addComments),当前pageInfo的内容如下：',pageInfo);
		    //console.log(pageInfo);
		    if (pageInfo.nthPage == pageInfo.doc.pageBT[pageInfo.nthPage-1]){
		        Docview.Models.File.addComments(pageInfo.doc.getDocId(),
                                                pageInfo.nthPage,
                                                subcode,
                                                pageInfo.folder_id,
                                                this.proxy('handleCommentsOk'),
                                                this.proxy('failure'));

		    }else {
			alert("此面为反面");
		    }
	    }
	    //console.log("when you click error-comments,that pageInfo is");
	    //console.log(this.currentPageInfo);	
	},
	'button.comments click' : function(el, ev) {
	    ev.preventDefault();
	    //console.log('进行反馈意见的确认时，当前单证的信息：',this.currentPageInfo);
	    if (this.commentsController) {
		this.commentsController.setCommentsUI(this.currentPageInfo);
	    } else {
		$('#comments').docview_ui_comments({pageInfo: this.currentPageInfo,
						    controller : this});
		this.commentsController = $('#comments').controller();
	    }
	},
	'li.comments click' : function(el, ev) {
	    ev.preventDefault();
	    if (this.commentsController) {
		this.commentsController.setCommentsUI(this.currentPageInfo);
	    } else {
		    //console.log('进行反馈意见的确认时，当前单证的信息：',this.currentPageInfo);
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
		this.element.find('li.error-comments').hide();
	    } else if (proposedPageType != null) {
		
		this.element.find('li.comments').hide();
		this.element.find('li.error-comments').hide();
		//console.log('2、===currentPageInfo  in displayCommentsControl :',this.currentPageInfo);
		//console.log('3、===proposedPageType  in displayCommentsControl :',proposedPageType);
		$('#comments').html(this.view('comment', {proposedPageType : proposedPageType, searchMode : this.options.clientState.attr("searchMode")}));
	    } else {
		this.element.find('li.comments').show();
		this.element.find('li.error-comments').show();
	    }
	},
	'.delete-comment submit' : function(el, ev) {
	    ev.preventDefault();
	    var pageInfo = this.currentPageInfo;
	    Docview.Models.File.deleteComment(pageInfo.doc.getDocId(),
						pageInfo.folder_id,
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
	    //console.log('1、====pageInfo in showPage ',pageInfo);
	    //console.log(pageInfo);
	    //console.log(pageInfo.doc);
	    //console.log(pageInfo.doc.comments);
	    //console.log(pageInfo.proposedPageType);
	    this.displayCommentsControl(pageInfo.proposedPageType);

	    if (this.pluginCreated) {
		this.element.find('div.image-viewer').iviewer('loadImage', pageInfo.imagePath);
	    } else {
		this.createPlugin(pageInfo.imagePath);
	    }
	    $('#pageno').html('第 '+ pageInfo.nthPage +' 页');	    
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
            } else if (jqXHR.status == 407) {
                message = '系统安全子系统未初始化，请联系管理员。';
            } else if (jqXHR.status == 400) {
                message = '系统内部错误： 无法获取单证电子图像。';
            } else if (jqXHR.status == 401) {
                message = '系统内部错误： 系统繁忙，请稍后再试。';
            } else if (jqXHR.status == 201) {
                message = '此单证已经反馈，请重新刷新查阅。';
            }
            this.options.clientState.attr('alert', {
                type: t,
                heading: h,
                message : message
            });
        //console.log("[Error]", data);
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
