steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/datatables/jquery.dataTables.js',
    './views/init.ejs'
).then(
    'docview/datatables/bootstrap-pagination.js'
).then(function($) {
    $.Controller('Docview.Ui.Pagingtable', {}, {
        init : function() {

            this.lastData = "";
            this.element.html(this.view('init'));
            //this.element.html(this.view('init',{ file_name:this.options.table_options.file_name }));
			this.modelData = {};
            var tableElement = this.element.find('thead tr')[0];

            var aoColumns = this.options.tableOptions.aoColumns;
			var col_width = this.options.tableOptions.col_width;

            var index = 0;
            var that = this;
            $.each(aoColumns, function(index, v) {
               // v.fnRender = that.createNthRenderer(index);
				console.log(v.mLabel);		
				if (col_width){
                    $(tableElement).append("<th style='width: " + (col_width[index]|0) + "px;'>" + v.mLabel + " </th>");
				} else {
                    $(tableElement).append("<th>" + v.mLabel + " </th>");
				}
            });
			this.showResult();
        },
		showResult : function(){
			this.dataTable = this.element.find('table').dataTable({
				bJQueryUI: true,
				bProcessing: true,
				bServerSide: true,
				//"sServerMethod": "POST",
				"sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
				"sPaginationType" : "bootstrap",
				"bSort": true, 
				"oSearch": {doc_id : "20121250004811"},
				"aoColumns": this.options.tableOptions.aoColumns,	
				"oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                },
				"sAjaxSource" : this.options.tableOptions.dataSourceUrl,
				"fnServerParams": function ( aoData ) {
					aoData.push( 
						{ "name": "more_data", "value": "my_value" },
						{ "name": "doc_id", "value": "222520121250004811" },
						{ "name": "org", "value": "2225" },
						{ "name": "username", "value": "zhouzhen" }
					 );
				}  
				});

		},
		getDocs : function(el,ev){
            ev.preventDefault();
			console.log("======");
			this.showResult();
/*
		    $.ajax({
				url : '/documents',
				type : 'GET',
				dataType : 'json',
				success :  this.proxy('addData'),
				error : this.proxy('failure')
			});
*/
		},
		addData : function(data){
            this.dataTable.fnAddData(data);
		},
		createNthRenderer : function(n) {
            var path = this.options.table_options.col_def_path;
            return function (data, val) {
                //console.log(data, val);
                return $.View(path + 'col_' + (n+1) + '.ejs', data.aData);
            }
        },
        show : function() {
        }
});
});

