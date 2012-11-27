steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/models',
    'docview/bootstrap/bootstrap.min.js',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Errorcomment', {}, {
        init : function() {
	    this.pageType = this.options.pageInfo ? this.options.pageInfo.pageType : -1;
	    this.viewerController = this.options.controller;
	    this.setCommentsUI(this.options.pageInfo);
	    
        },

	setCommentsUI : function(pageInfo) {
	    this.pageType = pageInfo.pageType;
	    this.element.html(this.view('init', {pageType : this.pageType, nthPage : this.nthPage}));
	    
	    this.element.find(":radio[value=" + this.pageType +"]").attr('checked',true);
	    this.options.pageInfo = pageInfo;
        },
	clearContent: function() {
	    this.element.html('');
	},
	handleCommentsOk : function(data) {
	    this.clearContent();
	    this.viewerController.updateComment(data);
	},
	
	'input[name="error_type"] click' : function(el, ev) {
	    ev.preventDefault();
	    var subcode = $('input[name="error_type"]:checked').val();
	    //console.log("sub code ", subcode);

	    if (this.pageType != -1 && subcode == this.pageType) {
		alert ("选择的种类没有变化");
	    } else {
		var pageInfo = this.options.pageInfo;
		Docview.Models.File.addComments(pageInfo.doc.getDocId(),
						pageInfo.nthPage,
						subcode, 
						this.proxy('handleCommentsOk'),
						this.proxy('failure'));
	    }
	},
        show : function() {
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
        }
});
});

