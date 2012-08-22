steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/history',
    'docview/ui/daterange'
//    'docview/bootstrap/bootstrap.css'
//    'libs/datepicker/css/datepicker.css'
)

// View templates
.then(
    './views/search_box.ejs'
//  'libs/datepicker/js/bootstrap-datepicker.js'
)
// External JS
.then(
    'docview/bootstrap/bootstrap-collapse.js'
//    'libs/datepicker/js/locales/bootstrap-datepicker.zh-CN.js'
)
.then(function($) {
    /*
    * Search box containing three types of search:
    *   - document id
    *   - multiple document ids
    *   - advanced search
    */
    $.Controller('Docview.Search',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('search_box', this.options.clientState.attr(
		'access').attr('search')));

            // Hide box until route conditions are met
            this.element.hide();
            // Hide search types until route conditions are met
	    this.mainTabOn = false;
	    this.filters = [];
            //$('.input-date').datepicker($.datepicker.regional['zh-CN']);
	    this.element.find('div.daterange-holder').docview_ui_daterange(
		{dateOptions : { labelString: "理单日期"}});
	    this.element.find('div.daterange-holder-src').docview_ui_daterange(
		{dateOptions : { labelString: "理单日期"}});
	    this.element.find('div.single_holder').docview_ui_single();
	    this.element.find('div.multi_holder').docview_ui_multi();
	    this.element.find('div.self_history').docview_ui_history({clientState: this.options.clientState,
								   th_options : { include_user : false }});
        },
        clearFilters: function() {
	    this.element.find(".filters :checkbox").attr('checked', false);
	},
	setFilters: function(el) {
            var t_filters = [];

            el.find('.filters :checked').each(function() {
                t_filters.push($(this).val());
		
            });
	    this.filters = t_filters;
	},
	reloadESH : function() {
	    $.ajax({
		url : '/doc_source/all',
		type : 'GET',
		dataType : 'json',
		success :  this.proxy('populateESH'),
		error : this.proxy('failure')
	    });
	},
	populateESH: function (data) {
	    var el = this.element.find('div.org_holder');
	    if (el == undefined) {
		return;
	    }
	    el.html(this.view('doc_source_select', data));
	},
	failure : function(data) {
	},
	reshow : function() {
	    this.element.show();

	    var sub_cat = $.route.attr('subcategory');
	    var to_show = sub_cat;

	    if (!sub_cat) {
		to_show = this.element.find("form")[0].className;
	    }
	    this.element.find('.' + to_show).show();
	    if (sub_cat == 'by_doc_source') {
		this.reloadESH();
	    }	    
            if (to_show != 'single') {
		this.element.find('.single').hide();
	    }
	    if (to_show != 'multi') {
		this.element.find('.multi').hide();
	    }
	    if (to_show != 'advanced') {
		this.element.find('.advanced').hide();
	    }
	    if (to_show != 'by_doc_source') {
		this.element.find('.by_doc_source').hide();
	    }
	    if (to_show != 'personal_history') {
		this.element.find('.personal_history').hide();
	    }
	},
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "search") {	
		this.mainTabOn = true;
		this.reshow();
            } else {
                this.element.hide();
		if (newVal != "document") {
		    this.mainTabOn = false;
		}
            }
	    // we need to reset filters
	    this.clearFilters();
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    if (this.mainTabOn) {
		//$('#search-results').docview_search_results('clearResults');		
		//$('#alerts div.alert').alert('close');
		if (newVal == undefined && oldVal == "single" && $.route.attr('category') === 'document') {
		    return;
		}

		if (newVal == undefined && oldVal == "multi") {
		    this.element.hide();
		    return;
		}

		if (oldVal !== undefined) {
                    this.element.find('.' + oldVal).hide();
		}
		if (newVal !== undefined) {
		    this.reshow();
		    $.route.attr('id', -1);
		    if (newVal != 'single') {
			$('#document-details').hide();
		    } 
		} 
	    }
        },
        '.single submit': function(el, ev) {
            ev.preventDefault();
	    this.options.searchMode.attr('mode', 'single');

	    var ctrl = $('form.single div.single_holder').controller();
	    
            if (ctrl.validateInput(el)) {
	        // Set clientState's filters and search query
                this.setFilters(el);
                var docId = ctrl.getId();
                this.options.clientState.attr('search', {
                    ids: [docId],
                    filters: this.filters
                });

		this.searchSingleDoc(docId);
	    }
        },
	// Internal function only. Show a single document ID.
	searchSingleDoc : function(docId) {
	    $.route.attrs({category: 'document', id: docId}, true);
	    
	    this.element.hide();
	    $('#document-details').docview_ui_details('queryDoc', docId);
	},
        '.multi submit': function(el, ev) {
            ev.preventDefault();
	    this.options.searchMode.attr('mode', 'multi');
	    $('#search-results').docview_search_results('clearResults');

	    var self = this;
	    this.setFilters(el);
	    var ctrl = $('form.multi div.multi_holder').controller();
            if (ctrl.validateInput(el) ) {
		var ids = ctrl.getIds();

		if (ids.length == 1) {
		    this.searchSingleDoc(ids[0]);
		} else {
                    this.options.clientState.attr('search', {
			doc_ids: ids,
			filters: this.filters
                    });
		}
            }
        },
	'.by_doc_source submit' : function(el, ev) {
            ev.preventDefault();
	    $('#search-results').docview_search_results('clearResults');
	    this.setFilters(el);
            this.options.searchMode.attr('mode', 'by_doc_source');

	    var cntrl = this.element.find('div.daterange-holder-src').controller();
	    var dates = cntrl.getInputs(el);
	    if (dates === "") {
		return;
	    }
	    var from_date = dates.from;
	    var to_date = dates.to;

	    this.options.clientState.attr('search', {
		source : el.find('select[name="source"]').val(),
		from_date : from_date,
		to_date : to_date,
		docType : el.find('select[name="doc_type"]').val(),
		years : el.find('select[name="years"]').val(),
		filters: this.filters
	    });
	},
        '.advanced submit': function(el, ev) {
            ev.preventDefault();
	    $('#search-results').docview_search_results('clearResults');
            this.options.searchMode.attr('mode', 'advanced');
            this.removeFormErrors(el);

            this.setFilters(el);
	    
	    var cntrl = this.element.find('div.daterange-holder').controller();
	    var dates = cntrl.getInputs(el);
	    if (dates === "") {
		return;
	    }

	    var from_date = dates.from;
	    var to_date = dates.to;
	    
	    var total = el.find('input[name="total"]').val();
	    
	    if (total > 50) {
		this.displayInputError(el, "total", "每次抽样总数不能超过 50");
		return;
	    }

	    var isTax = undefined;
	    var isMod = undefined;
            var isMod_or_isTax = el.find('select[name="isMod_or_isTax"]').val();

	    if (isMod_or_isTax == "isTax") {
		isTax = "1";
	    }
	    if (isMod_or_isTax == "isMod") {
		isMod = "1";
	    }
            /*
	    if (el.find('input[name="isTax"]')[0].checked) {
		isTax = "1";
	    }
	    if (el.find('input[name="isMod"]')[0].checked) {
		isMod = "1";
	    }
            */

	    this.options.clientState.attr('search', {
		total : total,
		org : el.find('select[name="org"]').val(),
		org_applied : el.find('select[name="org_applied"]').val(),
		docType : el.find('select[name="doc_type"]').val(),
		years : el.find('select[name="years"]').val(),
		edcStartDate: from_date,
		edcEndDate : to_date,
		isTax: isTax,
		isMod : isMod,
                isMod_or_isTax : isMod_or_isTax,
                filters: this.filters
	    });
        },
	
	'div.well div.personal_history form submit' : function(el, ev) {
	    ev.preventDefault();
	    this.removeFormErrors(el);
	    var r = el.find('input[name="timerange"]:checked');


	    if (!r || r.length < 1) {
		this.displayInputError(el, "error", "请选择时间段");
		//this.displayFormError(el, "请选择时间段");
		return;
	    }
	    var hdiv = this.element.find(".self_history");
	    hdiv.show();

	    
	    hdiv.docview_ui_history('clearResults');
	    hdiv.docview_ui_history('querySelf',
				 { timerange : el.find('input[name="timerange"]:checked').val() });
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
	    if (inputField instanceof Array) {
		inputfield = inputField[0];
	    }
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
        }
    });
});
