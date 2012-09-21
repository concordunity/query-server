steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    'docview/ui/dmstable',
    'docview/models',
    'docview/ui/queryform'
).then(function($) {
    $.Controller('Docview.Ui.Export_query', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    this.element.hide();
	    var formParams = {
		formClass: "stats_export",
		legend: "出口删改单借出清单",
		formFields: [ "org" ],
		buttonLabel: "查看"
	    };
	    this.element.find('div.well').docview_ui_queryform({formParams: formParams});
        },

	'form.stats_export submit' : function(el, ev) {
	    ev.preventDefault();
	    Docview.Models.File.findPendingDocuments({org: "2200"}, this.proxy('handleData'),
						     this.proxy('handleError'));
	},
	handleData : function (data) {

	    var table_options = {
		file_name: "",
		aaData: data.results,
		col_def_path : "//docview/ui/export_query/views/",
		aoColumns: [
		    {"mDataProp" : "doc_id", mLabel : '单证号' },
		    {"mDataProp" : "edc_date", mLabel : '借出日期' }
		],
		col_width: [0,0,0]
	    };

	    this.element.find('.export_results').docview_ui_dmstable({ table_options: table_options });
	},
	handleError: function (jqstatus, error) {
	},
        show : function() {
        }
});
});

