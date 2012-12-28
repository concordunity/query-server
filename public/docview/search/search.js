steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/history',
    'docview/ui/dictionary',
    'docview/ui/print',
    'docview/ui/daterange'
//    'docview/bootstrap/bootstrap.css'
//    'libs/datepicker/css/datepicker.css'
)
.then(
    './views/advanced_form.css'
)
// View templates
.then(
    './views/search_box.ejs'
//  'libs/datepicker/js/bootstrap-datepicker.js'
)
// External JS
.then(
    'libs/comments_arr.js',
    'docview/bootstrap/bootstrap.min.js'
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
	    //$("#dictionary-tag").docview_ui_dictionary();
	    //var dicController =  $("#dictionary-tag").controller();
	    //this.orgsDic = dicController.getDictionary("comments");
	    this.comment_dic = commentsArrayDictionary;
	    var search =  this.options.clientState.attr('access').attr('search');
	    search.doc_type = this.comment_dic;
            this.element.html(this.view('search_box', search));

            // Hide box until route conditions are met
            this.element.hide();
            // Hide search types until route conditions are met
	    this.mainTabOn = false;
	    this.filters = [];

            //$('.input-date').datepicker($.datepicker.regional['zh-CN']);
	    this.element.find('div.daterange-holder').docview_ui_daterange(
		{dateOptions : {labelString: "日期"}});
	    this.element.find('div.daterange-holder-src').docview_ui_daterange(
		{dateOptions : {labelString: "理单日期"}});
	    this.element.find('div.single_holder').docview_ui_single({label: {labelString: "报关单号"}});
	    this.element.find('div.multi_holder').docview_ui_multi();
	    this.element.find('div.print_holder').docview_ui_multi();
	    this.element.find('div.self_history').docview_ui_history({clientState: this.options.clientState,
								   th_options : {include_user : false}});
	    this.element.find('div.upload_file').docview_ui_upload({clientState: this.options.clientState});
	    this.element.find('div.all-print-action').docview_ui_print({clientState: this.options.clientState});
            //this.element.find('div.search_condition').docview_ui_search_some_condition({clientState: this.options.clientState});
/*
	   $('form.multi,form.advanced,form.by_doc_source').submit(function() {
		var $form = $(this);
		var $btn = $form.find('button[data-toggle]');
		var $target = $($btn.attr('data-target'));
		if($target.hasClass('in')){
			$btn.click();
		}
	    });
*/
        },

	"button.button-option click" : function(el,ev){
	    var button_name = $(el).attr("name");
	    var button_value = $(el).attr("value");
	    this.element.find("button[name='"+button_name+"']").removeClass("button-option-onblure");    
	    $(el).addClass("button-option-onblure");    
	    if (button_name == "frm_total" && button_value == ""){
		this.element.find("input[name='"+button_name+"']").attr("value","");
		this.element.find("input[name='"+button_name+"']").attr("style","display:''");	
	    } else{
		this.element.find("input[name='"+button_name+"']").attr("style","display:none");
	    }
	    this.element.find("input[name='"+button_name+"']").attr("value",button_value);
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
/*
	    var to_show_class = ['single','multi','advanced','by_doc_source','personal_history','upload_file'];
	    $.each(to_show_class,function(index,value){
		if (to_show != value) {
		    this.element.find("."+value)).hide();
		}
	    });
*/
            if (to_show != 'single') {
		this.element.find('.single').hide();
	    }
	    if (to_show != 'multi') {
		this.element.find('.multi').hide();
	    }
	    if (to_show != 'all_print') {
		this.element.find('.all_print').hide();
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
	    if (to_show != 'upload_file') {
		this.element.find('.upload_file').hide();
	    }
	    if (to_show != 'search_condition') {
		$('#search-some-conditions').hide();
		$('#search-box').show();
		//this.element.find('.search_condition').hide();
	    } else {
		$('#search-box').hide();
		$('#search-some-conditions').show();
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
	    if (newVal == undefined) {
		return;
	    }
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
                this.element.find('li').removeClass('active');
                this.element.find('a[href="#advanced"]').closest('li').addClass('active');
                
                this.element.find('li.nav-pills').removeClass('active');
                this.element.find('li a[href="#'+newVal+'"]').closest('li').addClass('active');

                //this.options.clientState.attr('nav').attr(newVal, subcategory);
                //this.element.find('ul').html(this.view(newVal, this.options.clientState.attr('access').attr(newVal)));
                //this.element.find('li').removeClass('active');
	    }
        },
	verifyDocId : function(num) {
	    return /^\d+$/.test(num);
	},
        '.single submit': function(el, ev) {
            ev.preventDefault();
	    this.options.clientState.attr('searchMode', 'single');

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
                el.find('.filters :checked').prop("checked", false);
		//this.setFilters(el);
		//this.options.clientState.attr('search', { filters: this.filters});
		
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
	    this.options.clientState.attr('searchMode', 'multi');
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
		    el.find('.filters :checked').prop("checked", false);
		    //this.setFilters(el);
		    //this.options.clientState.attr('search', { filters: this.filters});
		}
            }
        },
	// print all docs
	".all_print submit" : function(el,ev) {
	    ev.preventDefault();	
	    console.log("all print");
	    var src=document.activeElement;
	    console.log(src.name);
	    console.log(src.value);
	    console.log($(el));
            var ctrl = $('.all_print div.print_holder').controller();
            if (ctrl.validateInput(el) ) {
	    //var search_doc = el.find("");
	    //Docview.Models.Print.findAll({docs: search_doc},this.proxy("showList"),this.proxy("faliure")); 
		var ids = ctrl.getIds();
                console.log(ids);
		if (src.value == 'search'){
		    this.options.clientState.attr('search', { doc_ids: ids});
		} else {
		    //print all docs
		    var controller = $(".all-print-action").controller();
		    controller.printAll({doc_ids: ids})
		}
	//	Docview.Models.Doc.findAllPrint(ids,this.proxy("showList"),this.proxy("failure"));
	    }
	},
	'.by_doc_source submit' : function(el, ev) {
            ev.preventDefault();
	    $('#search-results').docview_search_results('clearResults');
	    this.setFilters(el);
            this.options.clientState.attr('searchMode', 'by_doc_source');
	    $.createMask();
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
	    //loading ..`:wq

	},
        '.advanced submit': function(el, ev) {
            this.removeFormErrors(el);
            ev.preventDefault();
	    $('#search-results').docview_search_results('clearResults');
            this.options.clientState.attr('searchMode', 'advanced');

            this.setFilters(el);
	    
	    var cntrl = this.element.find('div.daterange-holder').controller();
	    var dates = cntrl.getInputs(el);
	    if (dates === "") {
		return;
	    }

	    var from_date = dates.from;
	    var to_date = dates.to;
	    var total = $("input[name='frm_total']").val();
            //$("input[name='org']:checked").val();
	    //var total = el.find('input[name="total"]').val();

	    if (this.verifyDocId(total) == false) {
		this.displayInputError(el, "frm_total", "随机的份数必须为数字");
                return true;
            }

	    var maxn = 50;
	    $.ajax({
		url: '/settings',
		type: 'GET',
		async: false,
		dataType : 'json',
		success : function (data) {
		    maxn = parseInt(data.maxn);
		},
		error : function() {
			$.closeMask();
		}
	    });

	    if (parseInt(total) > maxn) {
		active_button = $("button.button-option-onblure[name='frm_total']");
		total = maxn;
		if(active_button.attr("value") == ""){
		    this.displayInputError(el, "frm_total", "每次抽样总数不能超过 " + maxn);
		    return;
		}
	    }

	    var isTax = undefined;
	    var isMod = undefined;
            var isMod_or_isTax = el.find("input[name='frm_isMod_or_isTax']").val();

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
		org : el.find("input[name='org']").val(),
		org_applied : el.find('select[name="org_applied"]').val(),
		docType : el.find("input[name='frm_docType']").val(),
		years : el.find('select[name="years"]').val(),
		edcStartDate: from_date,
		edcEndDate : to_date,
		isTax: isTax,
		isMod : isMod,
                isMod_or_isTax : isMod_or_isTax,
                filters: this.filters
	    });
	    //el.find('.filters :checked').prop("checked", false);
	    //this.setFilters(el);
	    //this.options.clientState.attr('search', { filters: this.filters});
	    $.createMask();
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
				 {timerange : el.find('input[name="timerange"]:checked').val()});
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
        },
        /*
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            switch (newVal) {
                case "search":
                case "manage_docs":
                case "manage_accounts":
                case "stats":
                    this.element.find('ul').html(this.view(newVal, this.options.clientState.attr('access').attr(newVal)));

                    this.element.find('li').removeClass('active');

                    // If the user entered the page by manually entering the url with
                    // the subcategory, then it should be defined.
                    var subcategory = $.route.attr('subcategory');
                    if (subcategory !== undefined) {
                       // Restore subcategory state from $.route
                       this.element.find('a[href="#' + subcategory + '"]').closest('li').addClass('active');
                       this.options.clientState.attr('nav').attr(newVal, subcategory);
                    } else {
                        // Restore subcategory state from clientState

			subcategory = this.options.clientState.attr('nav').attr(newVal);

                       this.element.find('a[href="#' + subcategory + '"]')
                           .closest('li').addClass('active');
                       $.route.attr('subcategory', subcategory);
                    }

                    this.element.show();
                    break;
	    case "document":
		break;
            default:
                    this.element.hide();
            }
        },
        */
        getHrefNoHash: function(el) {
            var shref = el.attr('href');
            var pos = shref.indexOf('#');
            if (pos < 0) {
               return shref;
            }

            return shref.substring(pos + 1);
        },
        'a.button-title click': function(el, ev) {
            ev.preventDefault();
            // Simple way: clear all active and set the new one
            this.element.find('li').removeClass('active');
            el.closest('li').addClass('active');
	    
            // Update subcategory
            var subcategory = this.getHrefNoHash(el);
            $.route.attr('subcategory', subcategory);

	    $("ul.nav-pills a").closest('li').removeClass('active');
	    $("ul.nav-pills a[href='#"+subcategory+"']").closest('li').addClass('active');
            // Save subcategory state
            this.options.clientState.attr('nav').attr($.route.attr('category'), subcategory);

	    // Check for search sub tabs
	    if (subcategory == 'single' || subcategory == 'multi' || subcategory == 'advanced' || subcategory == 'personal_history' || subcategory == 'upload' || subcategory == 'search_some_condition') {
		$('#document-details').hide();
	    }
        }
    });
});
