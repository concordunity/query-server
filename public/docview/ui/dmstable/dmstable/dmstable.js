steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    'docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'	
).then(
    'docview/datatables/bootstrap-pagination.js'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Dmstable', {}, {

	// row_ejs file path
	// th_list
        init : function() {
	    this.lastData = "";
            this.element.html(this.view('init'));

	    var tableElement = this.element.find('thead tr')[0];
	    
	    console.log("table tr", tableElement);
	    // init table header
	    $.each(this.options.table_options.th_list, function(index, v) {
		console.log("adding header ", v);
		$(tableElement).append("<th>" + v + " </th>");
	    });

	    this.dataTable = this.element.find('table').dataTable({
		"sDom": "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
		"sPaginationType": "bootstrap",
                "oLanguage" : {
		    "sUrl" : "/docview/media/language/ch_ZN.txt"
//		    "oAria": {
//			"sSortAscending": " - click/return to sort ascending",
//			"sSortDescending": " - click/return to sort descending"
//			}
                }
	    });
        },

	saveToExcel : function() {
	    $.ajax({
		url: '/generateExcel',
		data : {
		    tableFile: this.options.table_options.file_name,
		    tableData: this.dataTable.fnGetData(),
		    tableHeader: this.options.table_options.th_list
		},
		type : 'post',
		success : function(data, textStatus, jqXHR) {
			//alert(data);
			window.location.href=data;
		},
		error : function(e) {
		}
	    });
	},

	setData : function(data) {
	    this.lastData= data;

	    for (var i = 0; i < data.length; i++) {

		var formatter = this.options.table_options.row_formatter;
		if (formatter) {
		    this.dataTable.fnAddData(formatter(data[i]));
		} else {
		    this.dataTable.fnAddData(data[i]);
		}
	    }
	},
        show : function() {
        }
       });
});

