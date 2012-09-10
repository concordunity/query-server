steal(
	'jquery/controller',
	'jquery/view/ejs',
	'jquery/controller/view'
).then(
	'libs/jquery.i18n.min.js',
	'./views/init.ejs'
).then(
	'docview/label_zh_CN.js',
	'./views/import_most_time_org_doc_info.ejs',
	'./views/normal_import_price_less_record.ejs',
	'./views/zero_find_check_info.ejs',
	'./views/son_table.ejs',
	'./views/search_result.ejs'
).then(
	'docview/ui/details',
	'docview/ui/paging',
	'docview/ui/dmstable'
).then(
	'docview/bootstrap/bootstrap.css',
	'docview/ui/search_some_condition/views/search_some_condition.css' 
).then(function($) {
	$.Controller('Docview.Ui.search_some_condition', {}, {
		init : function() {
			new LabelChinese().initLabelSettings();

			this.element.html(this.view('init'));
			this.element.hide();
			$('#search_pages').docview_ui_paging();
		},
		'{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
			if (newVal !== "search") {
				this.element.hide();
				this.mainTabOn = false;
			} else if ($.route.attr('subcategory') == 'search_condition') {
				this.mainTabOn = true;
				this.element.show();
			}
		},
		'{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal) {
			if (this.mainTabOn || $.route.attr('category') == 'search') {
				if (how === "add" || how === "set") {
					if (newVal === "search_condition") {
						this.element.show();
					} else {
						this.element.hide();
					}
				}
			}
		},
		".find-zero-rate click" : function(el,ev){
			this.options.clientState.attr('searchMode', 'high-risk');

			$("#search_results").hide();
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"zero_find_check_info","org_applied":$("select[name='zero_org_applied']").val()},
			this.proxy("find_zero_rate"),
			{});
			$("#search_results").show();
			$("#second_results").html("");
			$("#second_results").show();
		},
		".normal-import-record click" : function(el,ev){
			this.options.clientState.attr('searchMode', 'high-risk');
			$("#search_results").hide();
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"normal_import_price_less_record","org_applied":$("select[name='normal_org_applied']").val()},
			this.proxy("normal_import_record"),
			{});
			$("#search_results").show();
			$("#second_results").hide();
		},

		".import-most-time click" : function(el,ev){
			this.options.clientState.attr('searchMode', 'high-risk');
			$("#search_results").hide();
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"import_most_time_org_doc_info","org_applied":$("select[name='import_org_applied']").val()},
			this.proxy("import_most_time"),
			{});
			$("#search_results").show();
			$("#second_results").hide();
		},
		show_search_result : function(data){
		},
		find_zero_rate : function(data){
		/*
		var aaData=[];
		var table_options = {
		aaData: aaData,
		col_def_path : "//docview/ui/search_some_result/views/zero_find_check_info/",
		aoColumns: [
		{"mDataProp":"operating_name", mLabel : '企业名称'},
		{"mDataProp":"number_import_export_declarations", mLabel : '报关单数'},
		{"mDataProp":"number_import_export_inspection", mLabel : '查验数'},
		{"mDataProp":"import_export_inspection_rate", mLabel : '查验率%'},
		{"mDataProp":null, mLabel : '报关单明细'}
		],
		file_name: ""
		};
		this.element.find('#search_results').docview_ui_dmstable({
		table_options : table_options
		});	    
		//console.log(data);
		var controller = $('#search_results').controller();
		controller.setModelData(data);	   
		*/

		$("#search_results").html(this.view('zero_find_check_info',data));
		var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

		this.element.find('div#search_results table').dataTable({
			"sDom": dmstable_params,
			"oTableTools": {
				"aButtons": [
				{
					"sExtends": "copy",
					"sButtonText": "复制"
				},
				{
					"sExtends": "csv",
					"sButtonText": "保存CSV"
				},
				{
					"sExtends": "xls",
					"sButtonText": "保存Excel"
					}]
				},
				//"sDom" : 'T<"clear">lfrtip',
				"sPaginationType": "bootstrap",
				"oLanguage" : {
					"sUrl" : "/docview/media/language/ch_ZN.txt"
				}
			});
			$('#search_pages').docview_ui_paging('showPages',data); 
			this.setTagVal("zero_find_check_info"); 
		},
		normal_import_record : function(data){
		/*
		var aaData=[];
		var table_options = {
		aaData: aaData,
		col_def_path : "//docview/ui/search_some_result/views/normal_import_price_less_record/",
		aoColumns: [
		{"mDataProp":"declarations_number", mLabel : '报关单编号'},
		{"mDataProp":"product_code", mLabel : '商品编号'},
		{"mDataProp":"product_number", mLabel : '商品序号'},
		{"mDataProp":"first_legal_quantity", mLabel : '商品数量'},
		{"mDataProp":"price", mLabel : '商品单价'},
		{"mDataProp":"national_average_price", mLabel : '全国均价'},
		{"mDataProp":null, mLabel : '电子数据'}
		],
		file_name: ""
		};
		this.element.find('#search_results').docview_ui_dmstable({
		table_options : table_options
		});
		//console.log(data);
		var controller = this.element.find('#search_results').controller();
		controller.setModelData(data);
		*/

		for(var i=0;i<data.length;i++ ){
			d = data[i];
			var d_price = parseInt(d.price);
			var d_national_average_price = parseInt(d.national_average_price);
			if(d_price == 0){
				d.price = Math.round(d.price*1000)/1000;
			}else{
				d.price = Math.round(d.price*100)/100;
			}
			if(d_national_average_price == 0){
				d.national_average_price = Math.round(d.national_average_price*1000)/1000;
			}else{
				d.national_average_price = Math.round(d.national_average_price*100)/100;
			}
			data[i]=d;
		};
		$("#search_results").html(this.view('normal_import_price_less_record',data));
		var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

		this.element.find('div#search_results table').dataTable({
			"sDom": dmstable_params,
			"oTableTools": {
				"aButtons": [
				{
					"sExtends": "copy",
					"sButtonText": "复制"
				},
				{
					"sExtends": "csv",
					"sButtonText": "保存CSV"
				},
				{
					"sExtends": "xls",
					"sButtonText": "保存Excel"
					}]
				},
				//"sDom" : 'T<"clear">lfrtip',
				"sPaginationType": "bootstrap",
				"oLanguage" : {
					"sUrl" : "/docview/media/language/ch_ZN.txt"
				}
			});
			$('#search_pages').docview_ui_paging('showPages',data); 
			this.setTagVal("normal_import_price_less_record"); 
		},
		import_most_time : function(data){
		/*
		var aaData=[];
		var table_options = {
		aaData: aaData,
		col_def_path : "//docview/ui/search_some_result/views/import_most_time_org_doc_info/",
		aoColumns: [
		{"mDataProp":"declarations_number", mLabel : '报关单编号'},
		{"mDataProp":"release_time", mLabel : '接受申报时间'},
		{"mDataProp":"accept_declaration_time", mLabel : '放行时间'},
		{"mDataProp":"overall_operating_hours_hours", mLabel : '整体通关时间'},
		{"mDataProp":null, mLabel : '电子数据'}
		],
		file_name: ""
		};
		this.element.find('#search_results').docview_ui_dmstable({
		table_options : table_options
		});
		//console.log(data);
		var controller = this.element.find('#search_results').controller();
		controller.setModelData(data);
		*/
		for(var i = 0;i < data.length;i++){
			//$.each(data.data,function(index,d){
				d = data[i];
				var hours = d.overall_operating_hours_hours;
				var hours_value = Math.round(hours);
				var days_num = Math.floor(hours_value/24);
				var hours_num = hours_value - (days_num * 24);
				var message = days_num+"天" +hours_num + "小时";
				d.overall_operating_hours_hours = message;

				tmp_adt = d.accept_declaration_time.replace("T"," ")
				tmp_rt = d.release_time.replace("T"," ")

				d.accept_declaration_time = tmp_adt.split("+")[0];
				d.release_time = tmp_rt.split("+")[0];
				data[i]=d;
			}
			$("#search_results").html(this.view('import_most_time_org_doc_info',data));
			var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

			this.element.find('div#search_results table').dataTable({
				"sDom": dmstable_params,
				"oTableTools": {
					"aButtons": [
					{
						"sExtends": "copy",
						"sButtonText": "复制"
					},
					{
						"sExtends": "csv",
						"sButtonText": "保存CSV"
					},
					{
						"sExtends": "xls",
						"sButtonText": "保存Excel"
						}]
					},
					//"sDom" : 'T<"clear">lfrtip',
					"sPaginationType": "bootstrap",
					"oLanguage" : {
						"sUrl" : "/docview/media/language/ch_ZN.txt"
					}
				});

				$('#search_pages').docview_ui_paging('showPages',data); 
				this.setTagVal("import_most_time_org_doc_info"); 
			},
			'li a.docview-paging click' : function(el,ev) { 
				ev.preventDefault();
				$(el).closest('li').addClass('active');
				var start = $(el).attr("data-start-index");
				var end = $(el).attr("data-end-index");
				$(".paging-header-start-end input[name='paging-header-start']").attr("value",start);
				$(".paging-header-start-end input[name='paging-header-end']").attr("value",end);
				//var tag_val = $('#search_pages').docview_ui_paging('getTagVal');
				var tag_val = $("input[name='hidden-paging-header-type']").attr("value");

				if (tag_val == "zero_find_check_info") {
					Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},
					{"search_condition":tag_val,"count":end,"start_index":start,"org_applied":$("select[name='zero_org_applied']").val()},
					this.proxy("find_zero_rate"),{});
				} else if (tag_val == "normal_import_price_less_record") {
					Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},
					{"search_condition":tag_val,"count":end,"start_index":start,"org_applied":$("select[name='normal_org_applied']").val()},
					this.proxy("normal_import_record"),{});
				} else if (tag_val == "import_most_time_org_doc_info") {
					Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},
					{"search_condition":tag_val,"count":end,"start_index":start,"org_applied":$("select[name='import_org_applied']").val()},
					this.proxy("import_most_time"),{});
				}   
			},
			'td a click': function(el, ev) {
				ev.preventDefault();
				var son_table = $(el).attr("class");
				//console.log(son_table);
				var document = el.closest('tr').model();
				if(son_table == "son_table"){
					this.options.clientState.attr('searchMode', 'high-risk');
					Docview.Models.Monitoring.getSearchData({"urlValue":"/get_son_table","typeValue":"get"},{"operating_name":document.operating_name,"org_applied": document.org_applied},
					this.proxy("setSonTable"),
					{});

				}else{
					//console.log(document.declarations_number);
					$.route.attrs({category: 'document', id: document.declarations_number}, true);
					$('#document-details').docview_ui_details('queryDoc', document.declarations_number);
					$('#search-box').hide();
				}
			},
			setSonTable : function(data){
				$("#search_results").hide();
				$("#second_results").show();	    
				$("#second_results").html(this.view('son_table',data));
				var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

				this.element.find('div#second_results table').dataTable({
					"sDom": dmstable_params,
					"oTableTools": {
						"aButtons": [
						{
							"sExtends": "copy",
							"sButtonText": "复制"
						},
						{
							"sExtends": "csv",
							"sButtonText": "保存CSV"
						},
						{
							"sExtends": "xls",
							"sButtonText": "保存Excel"
							}]
						},
						//"sDom" : 'T<"clear">lfrtip',
						"sPaginationType": "bootstrap",
						"oLanguage" : {
							"sUrl" : "/docview/media/language/ch_ZN.txt"
						}
					});	    
				},
				".return_main click" : function(el,ev){
					$("#search_results").show();
					$("#second_results").hide();	    
				},
				setTagVal : function(data) {
					$("input[name='hidden-paging-header-type']").attr("value",data);
				},
				getTagVal : function() {
					var data = $("input[name='hidden-paging-header-type']").attr("value");
					return data;
				},
				show : function() {
					this.element.show();
				}
			});
		});

