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
	'docview/ui/dictionary',
	'libs/org_arr.js',
	'docview/ui/pagingtable',
	'docview/ui/dmstable',
	'docview/ui/org'
).then(
	'docview/bootstrap/bootstrap.css',
	'docview/ui/search_some_condition/views/search_some_condition.css' 
).then(
	'docview/ui/search_some_condition/thinkaway.scroller.js',
	'./thinkaway.scroller.js'
).then(function($) {
	$.Controller('Docview.Ui.search_some_condition', {}, {
		init : function() {
			//console.log("   intit    =====");
			new LabelChinese().initLabelSettings();
			//$("#dictionary-tag").docview_ui_dictionary();
			//var dicController =  $("#dictionary-tag").controller();
			//var orgsDic = dicController.getDictionary("org");
			var orgsDic = orgArrayDictionary;
			this.element.html(this.view('init',{orgsDic: orgsDic}));
			this.element.hide();
			$('#search_pages').docview_ui_paging();
			var user = this.options.clientState.attr('user');
			var orgs = user.orgs;
			if(orgs == '2200'){
				orgs = [];
			}else{
				orgs = orgs.split(',');
			}
			this.element.find('.zero_org_applied').docview_ui_org({ name:'zero_org_applied', include: orgs,default_text:orgs.length > 0 ? null: '不限' });
			this.element.find('.normal_org_applied').docview_ui_org({ name:'normal_org_applied', include: orgs,default_text:orgs.length > 0 ? null: '不限' });
			this.element.find('.import_org_applied').docview_ui_org({ name:'import_org_applied', include: orgs,default_text:orgs.length > 0 ? null: '不限'});
			this.element.find('.select_org').docview_ui_org({ name:'select_org', include: orgs,default_text:orgs.length > 0 ? null: '不限'});
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
		getMessage : function(tag,select_value){
		    var message = ",查询的关区条件为:";
		    var title = ""
		    if (tag == 'zero'){
			title = "查获率为0的重点查验企业";
		    } else if (tag == 'normal') {
			title = "一般贸易进口价格偏低报关单记录";
		    } else if (tag == 'import'){
			title = "进口通关时间超长报关单";
		    }
		    message = title + message;
		    if (select_value == "") {
			    message = message + "不限";
		    } else {
			    message = message + select_value;
		    }
		    log("system",{current_action: "search.search_condition", describe: message});
		    return;
		},
		".high-risk click" : function(el,ev){
			ev.preventDefault();	
			this.createView();
			$.createMask();
			this.options.clientState.attr('searchMode', 'high-risk');
			$("#search_results").hide();
			that = this;
			this.highRiskTableController.reload({
				url:'/search_condition',
				type:'get',
				data: {"search_condition":$(el).attr("data-value") , "org_applied":$(el).closest("tr").find("select[name='select_org']").val()},
				error: function(){
					$.closeMask();		
				},
				success: function(){
						var select_value = $(el).closest("tr").find("select[name='select_org']").val();
						that.getMessage("high_risk_" + $(el).attr("data-value"),select_value);
						$.closeMask();		
				}
			});
			$("#search_results").show();
			$("#second_results").hide();
		},
        createView : function() {
		   this.element.find('#search_results').html("");
		   this.highRiskTableController = this.element.find('#search_results').docview_ui_pagingtable({
			   tmpl_path: "/docview/ui/search_some_condition/views/high_risk/col_",
			   columns:[
					{id: "hr_date", text: "日期" },
					{id: "business_point", text: "业务点" },
					{id: "number_customs", text: "海关编号" },
					{id: "commodity_number", text: "商品项号" },
					{id: "product_number", text: "商品编号" },
					{id: "unit_price", text: "单价" },
					{id: "spatial_index_impact", text: "空间指数影响度" },
					{id: "actual_reference_price", text: "实际参考价格" }
			   ]
			   }).controller();
			//	this.loadData();
        },
		loadData : function(){
			console.log(" this is reload.....");
			this.tableController.reload({
				url:"/org_info",
				type:"get",
				data:{},
				success:function(data){}
				});	
		},
		".find-zero-rate click" : function(el,ev){
			ev.preventDefault();	
			this.options.clientState.attr('searchMode', 'high-risk');
			$(el).find('.btn-primary').button('loading');
			$("#search_results").hide();
			that = this;
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"zero_find_check_info","org_applied":$("select[name='zero_org_applied']").val()},
			function(data){
			    var select_value = $("select[name='zero_org_applied']").val();
			    that.getMessage("zero",select_value);
			    that.find_zero_rate(data);
			},
			//this.proxy("find_zero_rate"),
			function(){
				$.closeMask();
			});
			$("#search_results").show();
			$("#second_results").html("");
			$("#second_results").show();
			//loading ..
			$.createMask();
		},
		".normal-import-record click" : function(el,ev){
			this.options.clientState.attr('searchMode', 'high-risk');
			$("#search_results").hide();
			that = this;
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"normal_import_price_less_record","org_applied":$("select[name='normal_org_applied']").val()},
			//this.proxy("normal_import_record"),
			function(data){
			    var select_value = $("select[name='normal_org_applied']").val();
			    that.getMessage("normal",select_value);
			    that.normal_import_record(data);
			},
			function(){
				$.closeMask();
			});
			$("#search_results").show();
			$("#second_results").hide();
			
			$.createMask();	
		},

		".import-most-time click" : function(el,ev){
			this.options.clientState.attr('searchMode', 'high-risk');
			$("#search_results").hide();
			that = this;
			Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"import_most_time_org_doc_info","org_applied":$("select[name='import_org_applied']").val()},
			//this.proxy("import_most_time"),
			function(data){
                            var select_value = $("select[name='import_org_applied']").val();
                            that.getMessage("import",select_value);
                            that.import_most_time(data);
                        },
			function(){
				$.closeMask();
			});
			$("#search_results").show();
			$("#second_results").hide();
			$.createMask();
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
	        //alert("----");	
		//console.log("===========");
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
			$('.find-zero-rate').button('reset');
			//unmask , loading success .
			$.closeMask();
			//scroll to view ..	
			Scroller.scrollTo('search_results',800);
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
		
		//
		//console.info("I'm in ..");
		//

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
			 
			Scroller.scrollTo('search_results',800);
			$.closeMask();
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
			
			//console.info('OK');

			this.element.find('div#search_results table').dataTable({
				"sDom": dmstable_params,
				"aaSorting" : [[2,"desc"]],
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
				Scroller.scrollTo('search_results',800);
				$.closeMask();
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
					that = this;
					this.options.clientState.attr('searchMode', 'high-risk');
					Docview.Models.Monitoring.getSearchData({"urlValue":"/get_son_table","typeValue":"get"},{"operating_name":document.operating_name,"org_applied": $("select[name='zero_org_applied']").val()},
					//this.proxy("setSonTable"),
					function(data){
					    var sv =  $("select[name='zero_org_applied']").val();	
					    var message = "查阅公司为"+ document.operating_name + ",搜索关区";	
					    if (sv == ""){
						message = message + "不限"; 	
					    }else {

						message = message + sv; 	
					    } 
					    log("system",{current_action: "search.search_condition", describe: message});
					    that.setSonTable(data);
					},
					{});

				}else{
					console.log(document.declarations_number);
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

