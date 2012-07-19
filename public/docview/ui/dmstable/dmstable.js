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

        createNthRenderer : function(n) {
            var path = this.options.table_options.col_def_path;
            return function (data, val) {
                //console.log(data, val);
                return $.View(path + 'col_' + (n+1) + '.ejs', data.aData);
            }
        },
        // row_ejs file path
        // th_list
        init : function() {
            this.lastData = "";
            this.element.html(this.view('init'));

            var tableElement = this.element.find('thead tr')[0];

            //console.log("table tr", tableElement);
            // init table header

            var aoColumns = this.options.table_options.aoColumns;

            var index = 0;
            var that = this;
            $.each(aoColumns, function(index, v) {
                v.fnRender = that.createNthRenderer(index);
                $(tableElement).append("<th>" + v.mLabel + " </th>");
            });

            this.dataTable = this.element.find('table').dataTable({
                "sDom": "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
                //"sPaginationType": "bootstrap",
                "aaData": this.options.table_options.aaData,
                "aoColumns": this.options.table_options.aoColumns,
                "oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                }
            });
        },
        addData : function(data) {
            this.dataTable.fnAddData(data);
        },
        saveToExcel : function() {
            var th_list = [];
            var title_list = [];
            $.each(this.options.table_options.aoColumns, function(index, v) {
                if(v.mDataProp!=null){
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
                success : function(data, textStatus, jqXHR) {
                    window.location.href=data;
                },
                error : function(e) {
                }
            });
        }
    });
});

