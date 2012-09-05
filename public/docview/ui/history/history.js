steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/docgroup/newdg',
    'docview/ui/sou',
    'docview/bootstrap/bootstrap.css'
)

// View templates
.then(
    './views/history.ejs',
    './views/history_row.ejs'
) // External JS
.then(
    'docview/datatables/jquery.dataTables.js'
)
.then(
    'docview/datatables/bootstrap-pagination.js'
)

.then(function($) {
    Docview.Ui.Sou('Docview.Ui.History',
    /* @Static */
    {
    }, {
//	init: function(el, options) {//
//	    this._super(el, options);
	    
//	},
	init : function() {
	    this.oTable = undefined;
	    this.lastEl = undefined;
	},
	query : function(params) {
	    $.ajax({
		url: '/qh/query_search',
		type: 'post',
		data: params,
		success : this.proxy('showResult'),
		error : this.proxy('failure'),
		dataType: 'json'
	    });
	},
	querySelf : function(params) {
	    Docview.Models.History.findSelf(params, this.proxy('showResult'),
					    this.proxy('failure'));
	},
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    var cat = $.route.attr('category');
	    var sub_cat = $.route.attr('subcategory');
	    if ((cat == 'manage_docs' && sub_cat == 'dh_report') || (cat == 'stats' && sub_cat == 'stats_query')) {
		this.element.show();
	    } else  {
		this.element.hide();
	    }
	},
	queryDocHistory : function(params) {
	    $.ajax({
		url: '/dh/query_search',
		type: 'post',
		data: params,
		success : this.proxy('showResult'),
		error : this.proxy('failure'),
		dataType: 'json'
	    });
	},
	clearResults: function() {
	    if (this.oTable != undefined) {
		this.oTable.fnClearTable();
	    }
	},
	'.redo-multi click' : function(el, ev) {
	    ev.preventDefault();
	    var qhRow = el.closest('tr');
	    var qh = qhRow.model();
	    //console.log('qh ... .', qh);
	    $('#search-box').find('.multi_holder').docview_ui_multi('setUIValue', qh.bulkids);
	    $.route.attr('subcategory', 'multi');
	},
	'.save-docgroup click' : function(el, ev) {
	    ev.preventDefault();
	    var qhRow = el.closest('tr');
	    this.lastEl = qhRow;
	    var qh = qhRow.model();
	    //console.log(qh);
	    var el2 = qhRow.after(this.view('new_dg', {qh : qh}));
	    //console.log(el2);
	    this.element.find('tr.edit-history-' + qh.id + ' td' ).docview_docgroup_newdg({clientState: this.options.clientState, preseed : qh.bulkids, create_group_ok : this.proxy('newGroupOk')});

	    //console.log('qh ... .', qh);
            //$.route.attrs({category : "stats", subcategory :  'create_group'});
	},
	newGroupOk : function(data) {
	    //console.log("newGroup ok ...", this.lastEl.next('tr'));
	    this.lastEl.next('tr').remove();
	},
	showResult : function(data) {
	    this.element.html(this.view('history', { data : data, th_options : this.options.th_options } ));
	    this.oTable = this.element.find('table').dataTable({
                "sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
		"iDisplayLength": 100,
                "sPaginationType": "bootstrap",
                "oLanguage" : {
                    "sUrl" : "media/language/ch_ZN.txt"
                 }
            });
	},
	failure : function(jqXHR, textStatus, errorThrown) {
	    this.handleCommonFailure(jqXHR, textStatus, errorThrown, this.options);
	}
    });
});
