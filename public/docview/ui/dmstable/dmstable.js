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
					"sLengthMenu": "每页显示 _MENU_ 条记录",
					"sZeroRecords": "对不起，查询不到任何相关数据",
					"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
					"sInfoEmtpy": "找不到相关数据",
					"sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
					"sProcessing": "正在加载中...",
					"sSearch": "搜索",
					"sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
					"oPaginate": {
						"sFirst":    "第一页",
						"sPrevious": " 上一页 ",
						"sNext":     " 下一页 ",
						"sLast":     " 最后一页 "
					}
				}
			});
		},
		addData : function(data) {
			this.dataTable.fnAddData(data);
			//$.each(data, function(index, row) {
				//	this.dataTable.fnAddData(row);
				//});
			},
			saveToExcel : function() {
				var th_list = [];
				var title_list = [];
				$.each(this.options.table_options.aoColumns, function(index, v) {
					th_list.push(v.mLabel);
					title_list.push(v.mDataProp);
				});
				
				//$.each(this.dataTable.fnGetData(),function(index,v){
				//	if(index < 2){
				//		console.log("数据：",v.created_at);
				//	}
				//});
				console.log("测试数据：",title_list.join("&"));
				
				$.ajax({
					url: '/generateExcel',
					data : {
						tableFile: this.options.table_options.file_name,
						tableData: JSON.stringify(this.dataTable.fnGetData()),
						tableTitle: title_list.join("&"),
						tableHeader: th_list
					},
					type : 'post',
					datatype : "json",
					success : function(data, textStatus, jqXHR) {
						//alert(data);
						window.location.href=data;
					},
					error : function(e) {
					}
				});
			}
		});
	});

