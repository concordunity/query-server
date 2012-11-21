steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    'docview/ui/dmstable',
    'docview/models',
    'docview/ui/select_page',
    'docview/ui/queryform'
).then(function($) {
    $.Controller('Docview.Ui.Export_query', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    this.element.hide();
	    var formParams = {
		formClass: "stats_export",
		legend: "出口删改单借出清单",
		formFields: [ "org_applied" ],
		orgAppliedLabel : "关区",
		buttonLabel: "查看"
	    };
	    this.element.find('div.well').docview_ui_queryform({formParams: formParams});
	    this.tableController = undefined;
	   // $("#select-pages").docview_ui_select_page();
	   // this.selectPageController = $("#select-pages").controller();
        },

	'form.stats_export submit' : function(el, ev) {
	    ev.preventDefault();
	    if (this.tableController != undefined) {
		this.tableController.clearData();
	    }
	    Docview.Models.File.findPendingDocuments({org_applied : el.find('select[name="org_applied"]').val()}, this.proxy('handleData'),
						     this.proxy('handleError'));
	},
	handleData : function (data) {
	    if (this.tableController == undefined) {
	    //console.log(data.results);
		var table_options = {
		    file_name: "",
		    aaData: [],
		   bProcessing:true, 
		   // aaData: data.results,
		    col_def_path : "//docview/ui/export_query/views/",
		    aoColumns: [
			{"mDataProp" : "doc_id", mLabel : '单证号' },
			{"mDataProp" : "edc_date", mLabel : '借出日期' }
		    ],
		    col_width: [0,0,0]
		};
		
		this.element.find('.export_results').docview_ui_dmstable({ table_options: table_options });
		this.tableController = this.element.find('.export_results').controller();
	    } else {
	    
		this.tableController.setModelData(data.results);

	    }
	},
	handleError: function (jqstatus, error) {
	},
        show : function() {
        }
});
});

