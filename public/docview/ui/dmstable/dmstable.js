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
	    this.modelData = {}
            var tableElement = this.element.find('thead tr')[0];

            var aoColumns = this.options.table_options.aoColumns;

            var index = 0;
            var that = this;
            $.each(aoColumns, function(index, v) {
                v.fnRender = that.createNthRenderer(index);
                $(tableElement).append("<th>" + v.mLabel + " </th>");
            });

            this.dataTable = this.element.find('table').dataTable({
                "sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
                //"sPaginationType": "bootstrap",
                "aaData": this.options.table_options.aaData,
                "aoColumns": this.options.table_options.aoColumns,
                "oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                }
            });
        },
        createNthRenderer : function(n) {
            var path = this.options.table_options.col_def_path;
            return function (data, val) {
                //console.log(data, val);
                return $.View(path + 'col_' + (n+1) + '.ejs', data.aData);
            }
        },
	clearData : function() {
	    this.dataTable.fnClearTable();
	},
        addData : function(data) {
            this.dataTable.fnAddData(data);
        },
        setData : function(data) {
	    this.clearData();
            this.addData(data);
        },

	// Only call this method if the data is a Model instance.
	// In our case, id attribute must be present.
	setModelData : function(data) {
	    this.clearData();
            this.addData(data);
	    if ($.isArray(data)) {
		var that = this;
		$.each(data, function(index, d) {
		    that.modelData[d.id] = d;
		});
	    }
	},
	// The el must be a TD, or a sub-element
	getRowDataFor : function (el) {
	    var el_tr = el.closest("tr")[0];
	    return { tr : $(el_tr), 
		     model : this.dataTable.fnGetData(el_tr) };
	},
	// The el must be a TD, or a sub-element
	getRowModelDataFor : function (el) {
	    var el_tr = el.closest("tr")[0];
	    var data = this.dataTable.fnGetData(el_tr);
	    
	    if (data.id && this.modelData[data.id] != undefined) {

		data = this.modelData[data.id];
		console.log("Getting the model .... ", data);
	    } else {
		console.log("Not finding the model by id " , data);
	    }
	    return { tr : $(el_tr), 
		     model : data };
	},

        saveToExcel : function() {
            var th_list = [];
            var title_list = [];
            $.each(this.options.table_options.aoColumns, function(index, v) {
                if(v.mDataProp != null){
                    th_list.push(v.mLabel);
                    title_list.push(v.mDataProp);
                }
            });
				
            $.ajax({
                url: '/generateExcel',
                data : {
                    tableFile: this.options.table_options.file_name,
                    tableData: JSON.stringify(this.dataTable.fnGetData()),
                    tableTitle: title_list,
                    tableHeader: th_list
                },
                type : 'post',
                datatype : "json",
                success : function(data) {
                    window.location.href=data;
                },
                error : function(error, textStatus, jqXHR) {
                }
            });
        }
    });
});

