steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',    
    'docview/bootstrap/bootstrap.css',
    './results.css'
)
// View templates
.then(
    './views/results_table.ejs',
    './views/result.ejs'
)
// External JS
.then(
    'docview/datatables/jquery.dataTables.js'
)
.then(
    'docview/datatables/bootstrap-pagination.js'
)
.then(function($) {

    /*
    * Search results for multi-doc and advanced searches
    */
    $.Controller('Docview.Search.Results',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            // We'll show ourselves during multi or advanced search
            this.element.hide();
            this.oTable = undefined;
	    /* Modify default datatables class to work with bootstrap better */
	    $.extend( $.fn.dataTableExt.oStdClasses, {
		"sSortAsc": "header headerSortDown",
		"sSortDesc": "header headerSortUp",
		"sSortable": "header"
	    } );
        },
        '{clientState} search change': function(el, ev, attr, how, newVal, oldVal) {
	    var mode = $.route.attr('subcategory');
            if (how === "set" || how === "add") {
		if (mode == 'multi' || mode == 'advanced') {
                    this.element.html("Searching...");
                    this.element.show();
                    Docview.Models.File.findAll(
			newVal, //{doc_ids: newVal.ids},
			this.proxy('showResults'),
			this.proxy('failure')
                    );
		} else if (mode == 'by_doc_source') {
                    this.element.html("Searching...");
                    this.element.show();
                    Docview.Models.File.by_doc_source(
			newVal, //{doc_ids: newVal.ids},
			this.proxy('showResults'),
			this.proxy('failure')
                    );
		}
            }
        },
	clearResults: function() {
	    if (this.oTable != undefined) {
		this.oTable.fnClearTable();
	    }
	},
        showResults: function(data) {
	    var not_found = data.not_found;
	    if (not_found != undefined && not_found.length > 0) {
		this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示：',
                    message : '系统没有以下单证电子档案扫描图像信息: ' + not_found.join()
		});
	    }
	    
            this.element.html(this.view('results_table', data.results));
            this.oTable = this.element.find('table').dataTable({
                "sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
                "sPaginationType": "bootstrap",
                 "oLanguage" : {
                     "sUrl" : "media/language/ch_ZN.txt"
                 }
            });
	    $('.advanced button[type=submit]').button('reset');
	    $.closeMask();
        },
        'td a click': function(el, ev) {
            ev.preventDefault();
            var document = el.closest('tr').model();
            $.route.attrs({category: 'document', id: document.doc_id}, true);
	    $('#document-details').docview_ui_details('queryDoc', document.doc_id);
	    $('#search-box').hide();
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal !== "search" && newVal !== 'document') {
                this.element.hide();
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
        },

        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "multi" && oldVal != "advanced") {
                this.element.show();
		if ('multi' != this.options.clientState.attr('searchMode')) {
		    this.clearResults();
		}
            } else if ( newVal === "advanced" && oldVal != "multi") {

		this.element.show();

		if ('advanced' != this.options.clientState.attr('searchMode')) {
		    this.clearResults();
		}
	    } else {
                this.element.hide();
            }
        }
    });
});
