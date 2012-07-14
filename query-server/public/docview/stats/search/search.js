steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/sou',
    'docview/ui/single',
    'docview/docgroup/dgselect',
    'docview/ui/history',
    'docview/ui/daterange',
    'docview/bootstrap/bootstrap.css'
)

// View templates
.then(
    './views/search_box.ejs'
)

.then(function($) {

    /*
    * Search box containing three types of doc history search:
    *   - document id
    *   - user id
    *   - advanced
    */
    Docview.Ui.Sou('Docview.Stats.Search',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('search_box', this.options.clientState
					.attr('access').attr('stats')));
	    this.mainTabOn = false;

            // Hide box until route conditions are met
            this.element.hide();
            // Hide search types until route conditions are met
            this.element.find('.stats_query').hide();
            this.element.find('.stats_stats').hide();
            this.element.find('.stats_usage').hide();

	    this.element.find('#qh_history').docview_ui_history({clientState: this.options.clientState,
							      th_options : { include_user : true } });
	    this.element.find('.dg_select_holder').docview_docgroup_dgselect({clientState: this.options.clientState});
	    this.element.find('.single_sou_holder').docview_ui_single({ no_help : true });
	    this.element.find('div.daterange-holder').docview_ui_daterange({dateOptions : { labelString: "日期"}});
	    this.element.find('div.daterange-holder-2').docview_ui_daterange({dateOptions : { labelString: ""}});
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {

            if (newVal === "stats") {
		this.mainTabOn = true;
                //this.element.find('.by_user').show();
                this.element.show();
            } else {
		this.mainTabOn = false;
                this.element.hide();
            }
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    // console.log("sstats/search", newVal, oldVal, this.mainTabOn);
	    var cat = $.route.attr('category');
	    
	    if (cat === 'stats') {
		this.mainTabOn = true;
	    }

	    if (!this.mainTabOn) {
		if (newVal == 'dh_report') {
                    this.element.find('.stats_query').show();
		}
		return;
	    }

            if (oldVal !== undefined) {
                this.element.find('.' + oldVal).hide();
            }
            if (newVal !== undefined) {
		//this.element.find('.stats_query').hide();

                this.element.find('.' + newVal).show();
            
		if (newVal == 'stats_stats') {
		    //this.reloadStats();
		} else if (newVal == 'stats_usage') {
		    this.reloadUsage();
		} else if (newVal == 'stats_query') {
		    this.element.find('.dg_select_holder').docview_docgroup_dgselect('reloadDocGroup');
		}
		if (newVal == 'create_group') {
		    this.element.hide();
		} else {
		    this.element.show();
		}
	    }
        },
	reloadStats : function() {
	    $.ajax({
		url : '/document_histories/dh_report',
		type : 'get',
		dataType : 'json',
		success : this.proxy('showStats'),
		error : this.proxy('failure')
	    });
	},
	reloadUsage : function() {
	    $.ajax({
		url : '/document_histories/dh_special',
		type : 'get',
		dataType : 'json',
		success : this.proxy('showUsage'),
		error : this.proxy('failure')
	    })    
	},
	showStats : function(data) {
	    this.element.find('.stats_stats').html($.View('//docview/stats/search/views/stats_table', {
		data : data
	    }));
	},
	showUsage : function(data) {
	    this.element.find('.stats_usage').html($.View('//docview/stats/search/views/usage_table', {
		data : data
	    }));
	},
	'form.stats_stats submit' : function(el, ev) {
	    ev.preventDefault();
            this.removeFormErrors(el);

	    var cntrl = this.element.find('div.daterange-holder-2').controller();

	    var dates = cntrl.getInputs(el);
            if (dates === "") {
		return;
	    }
	    var from_date = dates.from;
	    var to_date = dates.to;
	    
	    var r = el.find('input[name="timerange"]:checked').val();

	    if (r == 0) {
		from_date = "";
		to_date = "";
	    }
	    
	    $.ajax({
		url : '/document_histories/dh_report',
		type : 'post',
		data : {
		    from_date : from_date,
		    to_date : to_date,
		    groupby : el.find('select[name="groupby"]').val()
		},
		dataType : 'json',
		success : this.proxy('show_stats'),
		error : this.proxy('failure')
	    });
	},
	show_stats :function (data) {
	    if (this.element.find('select[name="groupby"]').val() == '4') {
		this.element.find('div.stats_stats').html(this.view('stats_by_month', data));
	    } else {
		this.element.find('div.stats_stats').html(this.view('stats_total', data));
	    }
	    this.element.find('div.stats_stats table').dataTable({
				"sDom": "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
		"oTableTools": {
		    "aButtons": [ 
			{
			    "sExtends": "copy",
			    "sButtonText": "复制"
			},
			{
			    "sExtends": "csv",
			    "sButtonText": "保存CSV"
			},
			{
			    "sExtends": "xls",
			    "sButtonText": "保存Excel"
			}]
		},
                //"sDom" : 'T<"clear">lfrtip',
		"sPaginationType": "bootstrap",
                "oLanguage" : {
                    "sUrl" : "media/language/ch_ZN.txt"
                }
	    });

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

	    var username = el.find('input[name="username"]').val();
	    var gid = el.find('select[name="gid"]').val();
	    var doc_type = el.find('select[name="doc_type"]').val();
	    var org = el.find('select[name="org"]').val();

	    var cntrl = this.element.find('div.daterange-holder').controller();

	    var dates = cntrl.getInputs(el);

            if (dates === "") {
		return;
	    }
	    var from_date = dates.from;
	    var to_date = dates.to;

	    this.element.find('#qh_history').docview_ui_history('query', {
		doc_id : doc_id,
		username : username,
		doc_type : doc_type,
		org : org,
		gid : gid,
		from_date : from_date,
		to_date : to_date
	    });
	},
        // Filters
        '.select-all click': function(el) {
            this.element.find('.filters .checkbox input').prop("checked", true);
        },
        
        '.deselect-all click': function(el) {
            this.element.find('.filters :checked').prop("checked", false);
        },
        
        // Verifies individual document ids
        verify: function(id) {
            return /^\d{18}$/.test(id);
        },
        
        // Form utility functions
        displayInputError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
        displayTextareaError: function(form, name, message) {
            var inputField = form.find('textarea[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
        removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
            form.find('.error').removeClass('error');
        },

	failure : function(jqXHR, textStatus, errorThrown) {
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
	}

    });
});
