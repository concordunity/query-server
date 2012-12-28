steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/models',
    'docview/bootstrap/bootstrap.min.js',
    'libs/comments_arr.js',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Comments', {}, {
        init : function() {
	    this.pageType = this.options.pageInfo ? this.options.pageInfo.pageType : -1;
	    this.viewerController = this.options.controller;
	    this.setCommentsUI(this.options.pageInfo);
	    
        },

	setCommentsUI : function(pageInfo) {
	    this.pageType = pageInfo.pageType;
	    this.element.html(this.view('init', {pageType : this.pageType}));
	    this.element.find(":radio[value=" + this.pageType +"]").attr('checked',true);
	    this.options.pageInfo = pageInfo;
	    console.log("setCommentsUI in comment.js, pageInfo is ",pageInfo);
        },
	clearContent: function() {
	    this.element.html('');
	},
	handleCommentsOk : function(data) {
	    this.clearContent();
	    //console.log(data);
	    this.viewerController.updateComment(data);
	},
	
	'.comments submit' : function(el, ev) {
	    ev.preventDefault();

	    var subcode = el.find('input[name="filter"]:checked').val();
	    //console.log("sub code ", subcode);

	    if (this.pageType != -1 && subcode == this.pageType) {
		alert ("选择的种类没有变化");
	    } else {
		var pageInfo = this.options.pageInfo;
		console.log("when submit for addComments,that pageInfo is :",pageInfo);
		Docview.Models.File.addComments(pageInfo.doc.getDocId(),
						pageInfo.nthPage,
						subcode, 
						pageInfo.folder_id,
						this.proxy('handleCommentsOk'));
	    }
	},
        show : function() {
        }
});
});

