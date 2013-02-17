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
//			this.showResult();
//        },
//		showResult : function(){
			this.dataTable = this.element.find('table').dataTable({
				bJQueryUI: true,
				bProcessing: true,
				bServerSide: true,
				"sAjaxSource" : this.options.tableOptions.dataSourceUrl,
				//"sServerMethod": "POST",
				"sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
				"sPaginationType" : "bootstrap",
				"bSort": true, 
		//		"oSearch": {doc_id : "20121250004811"},
				"aoColumns": this.options.tableOptions.aoColumns,	
				"oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                },
				"fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
					oSettings.jqXHR = $.ajax( {
						"dataType": 'json',
						"type": "get",
						"url": sSource,
						"error" : that.proxy("displayError"),
						"data": aoData,
						"success": fnCallback
					}); 
				},
				"fnServerParams": function ( aoData ) {
					var aod = that.options.tableOptions.aoData;
					//aoData.sendParams = aod;
					$.each(aod,function(n,value) {
						aoData.push(value);
					});
				}  
				});
//			this.findSource();
		},
		displayError : function(data){
			console.log(JSON.parse(data.responseText).error);
			console.log(data.status);
		},
		findSource : function(){
			this.dataTable.bProcessing =true;
			this.dataTable.bServerSide=true;
			this.dataTable.sAjaxSource=this.options.tableOptions.dataSourceUrl;
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

