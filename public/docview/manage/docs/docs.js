steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/multi',
    'docview/docgroup/dgselect',
    'docview/ui/single',
    'docview/bootstrap/bootstrap.css'
)
// View templates
.then(
    './views/init.ejs'
)
// External JS
.then(
    'docview/ui/dictionary',
    'libs/org_arr.js',
    'docview/bootstrap/bootstrap.min.js'
)
.then(function($) {
    /*
    * Search box containing three types of search:
    *   - document id
    *   - multiple document ids
    *   - advanced search
    */
    $.Controller('Docview.Manage.Docs',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
	    //var manage_docs =  this.options.clientState.attr('access').attr('manage_docs');
	    //$("#dictionary-tag").docview_ui_dictionary();
	    //var dicController =  $("#dictionary-tag").controller();
	    //this.orgsDic = dicController.getDictionary("org");
	    this.orgsDic = orgArrayDictionary; 
	    //manage_docs.orgsDic = this.orgsDic;
            this.element.html(this.view('init', this.options.clientState.attr('access').attr('manage_docs')));
	    this.error_context = '';
            // Hide box until route conditions are met
            this.element.hide();
	    // attach controller.
	    this.element.find('.inquire').hide();
            this.element.find('.checkout').hide();
            this.element.find('.print_doc').hide();
            this.element.find('.court_doc').hide();
            this.element.find('.dh_report').hide();
            this.element.find('.all_print').hide();
	    $('#downloadFrame').hide();

	    $('#manage-docs-container div form div.multi_holder').docview_ui_multi();
	    $('#manage-docs-container div form div.print_holder').docview_ui_multi();
	    $('#manage-docs-container div form div.single_holder').docview_ui_single({label: {labelString: "报关单号"}});
	    $('#manage-docs-container div form div.single_sou_holder').docview_ui_single({no_help : true,label: {labelString: "报关单号"}});

	    this.element.find('.dg_select_holder').docview_docgroup_dgselect({clientState: this.options.clientState});
	    this.element.find('#docs_history').docview_ui_history({clientState: this.options.clientState,
								th_options: { include_user : true } });
//	    this.element.find('.input-date').datepicker();
	    this.element.find('div.daterange-holder').docview_ui_daterange({dateOptions : { labelString: "日期"}});
//all print
	    this.element.find('#all-print-list').docview_ui_print({clientState: this.options.clientState});
            this.mainTabOn = false;
        },
	removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
	    form.find('.error').removeClass('error');
	},
        '.stats_query submit': function(el, ev) {
            ev.preventDefault();
            this.removeFormErrors(el);            
	    var params = {};
	    var ctrl = el.find('.single_sou_holder').controller();

	    if (!ctrl.validateInputOrEmpty(el)) {
		return;
	    }
	    var doc_id = ctrl.getId();
	    var gid = el.find('select[name="gid"]').val();
	    var username = el.find('input[name="username"]').val();
            var org = el.find('select[name="org"]').val();

	    var cntl = this.element.find('div.daterange-holder').controller();
	    var dates = cntl.getInputs(el);
            if (dates === "") {
		return;
	    }
	    var from_date = dates.from;
	    var to_date = dates.to;

	    this.element.find('#docs_history').docview_ui_history('queryDocHistory', {
		doc_id : doc_id,
		username : username,
		gid : gid,
		org : org,
		from_date : from_date,
		to_date : to_date
	    });
	},
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
	    var mode = this.options.clientState.attr('searchMode');

	    //console.log("docs cat change", newVal, oldVal, mode);
            if (newVal === "manage_docs") {
		this.mainTabOn = true;
	        // check subthis.element.find('.inquire').show();
		var sub_cat = $.route.attr('subcategory');
		var to_show = sub_cat;
		if (!sub_cat) {
		    to_show =  this.element.find("form")[0].className;
		}
		if (sub_cat == 'dh_report') {
		    this.element.find('.stats_query').show();
		}
		this.element.find('.'+ to_show).show();

		this.element.show();
	
            } else if (newVal == 'document' && ('court' == mode || 'print' == mode)) {
		this.hideDocsHistory();
		//this.element.show();
		this.element.find('.stats_query').hide();
		this.mainTabOn = true;
	    } else {
		this.hideDocsHistory();

                this.element.hide();
		this.element.find('.stats_query').hide();
		this.mainTabOn = false;
            }
        },
	hideDocsHistory : function() {
	    this.element.find('#docs_history').hide();
	    this.element.find('#docs_history').docview_ui_history('clearResults');
	},
	hideAllPrint : function() {
	    this.element.find('#all-print-list').hide();
	    this.element.find('#all-print-list').docview_ui_print('clearResults');
	},
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    // console.log("docs sub change", this.mainTabOn, newVal, oldVal);
/*
            if (newVal == undefined) {
               return;
            }
*/
	    if (this.mainTabOn) {
		this.element.find('#docs_history').docview_ui_history('clearResults');
		//this.element.find('#all-print-list').docview_ui_history('clearResults');
		this.element.show();
		if (oldVal !== undefined) {
                    this.element.find('.' + oldVal).hide();

		    //if (oldVal == 'print_doc' || oldVal == 'court_doc') {
		//	$.route.attr('id', -1);
		  //  }
		}
		if (newVal !== undefined) {
		    console.log(newVal);
		    $('#downloadFrame').hide();
	            this.element.find('.inquire').hide();
		    if (newVal == 'dh_report') {
			this.element.find('#docs_history').show();
			this.element.find('#all-print-list').hide();
			this.element.find('.stats_query').show();
			this.element.find('.dg_select_holder').docview_docgroup_dgselect('reloadDocGroup');
		    } else if (newVal == 'all_print'){
			this.element.find('#all-print-list').show();
		    } else {
			this.hideDocsHistory();
			this.hideAllPrint();
		    }
		    console.log('==== subcate=',newVal);
		    $('#document-details').hide();
		    $("#all-print-list").hide(); 
                    this.element.find('.' + newVal).show();
		}
	    }
        },
	'.inquire submit' : function(el, ev) {
	    ev.preventDefault();
	    var ctrl = $('#manage-docs-container div form.inquire div.multi_holder').controller();
	    if (ctrl.validateInput(el)) {
		var ids = ctrl.getIds();
		
		$.ajax({
		    url : '/documents/inquire',
		    type : 'POST',
		    data: { doc_ids : ids,
			    caction : "add"
			  },
		    dataType : 'json',
		    success : this.proxy('inquireOk'),
		    error : this.proxy('inquireFailed')
		});
	    }
	},
	inquireOk : function(data) {
	    if (data.status && data.status == 400) {
		this.options.clientState.attr('alert', {
		    type: 'error',
		    heading: '错误提示：',
		    message : data.message
		});
		return;
	    }

	    this.options.clientState.attr('alert', {
		type: 'info',
		heading: '操作成功：',
		message : '单证已增加涉案标记'
	    });
	},
	checkoutOk : function(data) {
	    if (data.status && data.status == 400) {
		this.options.clientState.attr('alert', {
		    type: 'error',
		    heading: '错误提示：',
		    message : data.message
		});
		return;
	    }

	    this.options.clientState.attr('alert', {
		type: 'info',
		heading: '操作成功：',
		message : '单证已增加借出标记'
	    });
	},
	checkinOk : function(data) {
	    if (data.status && data.status == 400) {
		this.options.clientState.attr('alert', {
		    type: 'error',
		    heading: '错误提示：',
		    message : data.message
		});
		return;
	    }

	    this.options.clientState.attr('alert', {
		type: 'info',
		heading: '操作成功：',
		message : '单证已解除借出标记'
	    });
	},
	inquireRemoveOk : function(data) {
	    if (data.status && data.status == 400) {
		this.options.clientState.attr('alert', {
		    type: 'error',
		    heading: '错误提示：',
		    message : data.message
		});
		return;
	    }

	    this.options.clientState.attr('alert', {
		type: 'info',
		heading: '操作成功：',
		message : '单证已解除涉案标记'
	    });
	},
	inquireFailed : function(jqXHR, textStatus, errorThrown) {
            var handled = true;
            var t = 'error';
            var h = '错误提示：';
            var message = '需要用户认证，请重新登录系统。';
	
            switch(jqXHR.status) {
            case 401:
		break;
            case 404:
		type = 'info';
		message = '系统中没有相关单证' + this.error_context;
		break;
	    case 500:
		message = '系统内部错误';	    
		break;
            case 403:
		type = 'info';
		message = this.error_context + '失败，权限不足。';
		break;
	    default:
		break;
	    }
	    this.options.clientState.attr('alert', {
		type: t,
		heading: h,
		message : message
	    });
	},
	'.checkout submit' : function(el, ev) {
	    ev.preventDefault();
	    var ctrl = $('#manage-docs-container div form.checkout div.multi_holder').controller();
	    if (ctrl.validateInput(el)) {
		var ids = ctrl.getIds();
	    
		$.ajax({
		    url : '/documents/checkout',
		    type : 'POST',
		    data: { doc_ids : ids,
			    caction : "checkout"
			  },
		    dataType : 'json',
		    success : this.proxy('checkoutOk'),
		    error : this.proxy('inquireFailed')
		});
	    }
	},
	'#removeCheckout click' : function(el, ev) {
	    var frm = $('#manage-docs-container div form.checkout');
	    ev.preventDefault();
	    var ctrl = $('#manage-docs-container div form.checkout div.multi_holder').controller();
	    

	    if (ctrl.validateInput(frm)) {
		var ids = ctrl.getIds();
		$.ajax({
		    url : '/documents/checkout',
		    type : 'POST',
		    data: { doc_ids : ids,
			    caction : "checkin"
			  },
		    dataType : 'json',
		    success : this.proxy('checkinOk'),
		    error : this.proxy('inquireFailed')
		});
	    } else {

	    }
	},
	'#removeInquire click' : function(el, ev) {
	    ev.preventDefault();
	    var frm = $('#manage-docs-container div form.inquire');
	    var ctrl = $('#manage-docs-container div form.inquire div.multi_holder').controller();
	    

	    if (ctrl.validateInput(frm)) {
		var ids = ctrl.getIds();
		$.ajax({
		    url : '/documents/inquire',
		    type : 'POST',
		    data: { doc_ids : ids,
			    caction : "remove"
			  },
		    dataType : 'json',
		    success : this.proxy('inquireRemoveOk'),
		    error : this.proxy('inquireFailed')
		});
	    } else {

	    }
	},
	'.court_doc submit' : function(el, ev) {
	    ev.preventDefault();
	    $.route.attr('id', -1);
	    this.options.clientState.attr('searchMode', 'court');
	    var ctrl = $('#manage-docs-container div form.court_doc div.single_holder').controller();

	    if (ctrl.validateInput(el)) {
		var docId = ctrl.getId();
		$.route.attrs({category: 'document', id: docId}, true);
		$('#document-details').docview_ui_details('queryDoc', docId);
		this.element.hide();
	    }	    
	},
	// print all docs
	"form.all_print submit" : function(el,ev) {
	    ev.preventDefault();	
	    //console.log("all print");
	    var src=document.activeElement;
		//console.log(src);
	    //console.log(src.name);
	    //console.log(src.value);
	    //console.log($(el));
        var ctrl = $('.all_print div.print_holder').controller();
        if (ctrl.validateInput(el) ) {
	    //var search_doc = el.find("");
	    //Docview.Models.Print.findAll({docs: search_doc},this.proxy("showList"),this.proxy("faliure")); 
		var ids = ctrl.getIds();
       //console.log(ids);
		var controllerAllPrint = $("#all-print-list").controller();
		if (src.value == 'search'){// || (myAction && myAction == 'search') ){
		    controllerAllPrint.printAll({doc_ids: ids})
		    //this.options.clientState.attr('manage_docs', { doc_ids: ids});
		} else if(src.value == 'print'){// || (myAction && myAction == 'print')) {
		    //print all docs
		    //ids have checked
		   var print_files_codes = [];
			$('#all-print-list input:checked').closest('tr').each(function(i,item){
				var model = $(item).model();
				print_files_codes.push(model.doc_id);
			}); 
		//	console.log(print_files_codes);
		   controllerAllPrint.printAllDoc(print_files_codes);
		}
	//	Docview.Models.Doc.findAllPrint(ids,this.proxy("showList"),this.proxy("failure"));
	    }
	},
	'.print_doc submit' : function(el, ev) {
	    ev.preventDefault();
	    $.route.attr('id', -1);
	    this.options.clientState.attr('searchMode', 'print');
	    var ctrl = $('#manage-docs-container div form.print_doc div.single_holder').controller();
	    if (ctrl.validateInput(el)) {
		var docId = ctrl.getId();
                $.route.attrs({category: 'document', id: docId}, true);

		$('#document-details').docview_ui_details('queryDoc', docId);
		this.element.hide();
	    }
	}
    });
});
