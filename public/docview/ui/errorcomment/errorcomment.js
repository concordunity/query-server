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
	    console.log(pageInfo);
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
		console.log(pageInfo);
		Docview.Models.File.addComments(pageInfo.doc.getDocId(),
						pageInfo.nthPage,
						subcode, 
						this.proxy('handleCommentsOk'));
	    }
	},
        show : function() {
        }
});
});

