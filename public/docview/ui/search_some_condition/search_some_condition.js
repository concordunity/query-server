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
			this.last_params = new Object;
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
      if (tag == 'zero_find_check_info'){
        title = "查获率为0的重点查验企业";
      } else if (tag == 'normal_import_price_less_record') {
				title = "一般贸易进口价格偏低报关单记录";
      } else if (tag == 'import_most_time_org_doc_info'){
				title = "进口通关时间超长报关单";
      } else if (tag == 'son_table'){
				title = "进行企业下单证查询";
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
    "#export_data click" : function(el,ev){
      //this.highRiskTableController.saveToExcel();
			if($(el).closest("#second_results").length > 0){
				this.subInfoController.saveToFile(this.last_params);
			}else{
      	this.highRiskTableController.saveToFile(this.last_params);
			}
    },
    ".high-risk click" : function(el,ev){
      ev.preventDefault();	

			var options = {tag : "high_risk",
		  panel_dom: '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button>',
			columns:[
	      {id: "hr_date", text: "日期" },
			  {id: "business_point", text: "业务点" },
				{id: "number_customs", text: "报关单编号" },
				{id: "business_units_encoding", text: "经营单位编码" },
				{id: "name_business_units", text: "经营单位名称" },
				{id: "commodity_number", text: "商品项号" },
				{id: "product_number", text: "商品编号" },
				{id: "product_name", text: "商品名称" },
				{id: "unit_price", text: "单价" },
				{id: "spatial_index_impact", text: "空间指数影响度" },
				{id: "actual_reference_price", text: "全国均价" },
				{id: null, text: "操作" }
      ]};
      $.createMask();
      this.createViewOption(el,options)
      //this.createView();
      this.options.clientState.attr('searchMode', 'high-risk');
      $("#search_results").hide();
      that = this;
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
	  {id: "number_customs", text: "报关单编号" },
	  {id: "business_units_encoding", text: "经营单位编码" },
	  {id: "name_business_units", text: "经营单位名称" },
	  {id: "commodity_number", text: "商品项号" },
	  {id: "product_number", text: "商品编号" },
	  {id: "product_name", text: "商品名称" },
	  {id: "unit_price", text: "单价" },
	  {id: "spatial_index_impact", text: "空间指数影响度" },
	  {id: "actual_reference_price", text: "全国均价" },
	  {id: null, text: "操作" }
	],
	file_name: "hirs_data",
	panel_dom: '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button>'
      }).controller();
      //this.loadData();
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
    "button click":function(el,ev){
      var text = el.closest('tr').find('.search-option').text();	
      $('#showTitle').addClass('alert alert-info').text(text);
    },
    ".find-zero-rate click" : function(el,ev){
      ev.preventDefault();
      $.createMask();
      this.options.clientState.attr('searchMode', 'high-risk');
      $("#search_results").hide();
      that = this;
			var options = {tag : "zero_find_check_info",
			panel_dom: '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button>',
			columns:[
				{id:"operating_name", text:"企业名称"},
			  {id:"count_number", text:"报关单数"},
				{id:"number_import_export_declarations", text:"报关查验单数"},
				{id:"number_import_export_inspection", text:"查获数"},
				{id:"import_export_inspection_rate", text:"查验率%"},
				{id: null, text:"报关单明细"}
	    ]};
      this.createViewOption(el,options)
      $("#search_results").show();
      $("#second_results").html("");
      $("#second_results").show();
    },
    ".normal-import-record click" : function(el,ev){
      this.options.clientState.attr('searchMode', 'high-risk');
      $("#search_results").hide();
      that = this;
      var options = {tag : "normal_import_price_less_record",
			panel_dom: '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button>',
      columns : [
        {id:"declarations_number",text:"报关单编号"},
        {id:"product_code",text:"商品编号"},
        {id:"product_number",text:"商品序号"},
        {id:"first_legal_quantity",text:"商品数量"},
        {id:"price",text:"商品单价"},
        {id:"national_average_price",text:"全国均价"},
        {id:null,text:"电子数据"}
      ]};
   
      $.createMask();	
      this.createViewOption(el,options)
      $("#search_results").show();
      $("#second_results").hide();
    },
  ".import-most-time click" : function(el,ev){
      ev.preventDefault();
      $.createMask();

      var options = {tag : "import_most_time_org_doc_info",
			panel_dom : '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button>',
      columns : [
        {id: "declarations_number" ,text: "报关单编号"},
        {id: "accept_declaration_time" ,text: "接受申报时间"},
				{id: "release_time" ,text: "放行时间"},
				{id: "overall_operating_hours_hours" ,text: "整体通关时间"},
        {id: null, text: "电子数据"}
      ]};
      this.createViewOption(el,options)
      this.options.clientState.attr('searchMode', 'high-risk');
      $("#search_results").hide();
      //this.importMostTimeController.reload();
      $("#search_results").show();
      $("#second_results").hide();
    },
    createViewOption : function(el,options) {
      var that = this;
			var is_son_table = options["tag"] == 'son_table';
			var tempController = this.element.find(is_son_table ? '#second_results' : '#search_results').controller();
			if(tempController != undefined){
				tempController.destroy();
		  }

		  var url = "/search_condition";
		  var is_all = false;
			var select_value =  $(el).closest("tr").find("select[name='select_org']").val(); 

			if(options.is_all != undefined){
				is_all = options.is_all;
			}

			var params = {
						"is_all": is_all,
						"search_condition": $(el).attr("data-value") , 
						"org_applied": $(el).closest("tr").find("select[name='select_org']").val()};

			if(options.url != undefined){
				url = options.url;
			}
			if(options.data != undefined){
				params = options.data;
				select_value = params.org_applied;
			}
			if( is_son_table ){
      	this.element.find('#second_results').show();
      	this.element.find('#search_results').hide();
			}else{
      	this.element.find('#second_results').hide();
      	this.element.find('#search_results').html("");
			}
			tempController = this.element.find(is_son_table ? '#second_results' : '#search_results').docview_ui_pagingtable({
        tmpl_path: "/docview/ui/search_some_condition/views/" + options["tag"] + "/col_",
				columns: options["columns"],
				file_name: options["tag"],
				panel_dom: options.panel_dom, 
        url: url,
        type:'get',
        data: params,
        error: function(){
          $.closeMask();
        },
        success: function(data){ 
          that.getMessage(options["tag"],select_value);
					that.last_params = data.last_params;
          $('#search_pages').docview_ui_paging('showPages',data.aaData);
          $.closeMask();
        }

      }).controller();
			if(is_son_table){
				this.subInfoController = tempController;
			}else{
      	this.highRiskTableController = tempController;
			}
      //this.loadData();
    },
    show_search_result : function(data){
    },
    find_zero_rate : function(data){
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
      Scroller.scrollTo('showTitle',800);
    },
    normal_import_record : function(data){
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
      //console.info("I'm in ..");
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

      Scroller.scrollTo('showTitle',800);
      $.closeMask();
    },
    import_most_time : function(data){
      for(var i = 0;i < data.length;i++){
	//$.each(data.data,function(index,d){
	d = data[i];
	var hours = d.overall_operating_hours_hours;
	var hours_value = Math.round(hours);
	var days_num = Math.floor(hours_value/24);
	var hours_num = hours_value - (days_num * 24);
	var message = days_num+"天" +hours_num + "小时";
	d.overall_operating_hours_hours = message;

	//console.log(d.accept_declaration_time);
	//2013-07-31T22:48:43+08:00
	var adt = UTCTOGMT(d.accept_declaration_time);
	var rt = UTCTOGMT(d.release_time);

	d.accept_declaration_time = adt;
	d.release_time = rt; 
	data[i]=d;
      }
      $("#search_results").html(this.view('import_most_time_org_doc_info',data));
      var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";
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
      Scroller.scrollTo('showTitle',800);
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
      var that = this;
      var btn_class = $(el).attr("class");
      switch(btn_class){
				case "son_table":
					this.options.clientState.attr('searchMode', 'high-risk');
				  var org = $("#search-some-conditions button.find-zero-rate").closest("tr").find("select[name=select_org]").val();
	  			var row = this.highRiskTableController.getRowFrom(el);
					var rowModel = row.model;
					var operating_name = rowModel.operating_name; 
					var options = {
						url: "/get_son_table",
						data: {
							operating_name: operating_name,
						  org_applied: org 
						},
						tag : "son_table",
						panel_dom: '<button type="button" id="export_data" class="btn btn-primary"><i class="icon-print icon-white"></i>Excel导出</button><button type="button" id="btn-go-back" class="btn btn-primary return-main"><i class="icon-exit icon-white"></i>返回</button>',
						columns:[
							{id: "declarations_number", text: "报关单编号" },
							{id: null, text: "操作" }
						]};
      		$.createMask();
					this.createViewOption(el,options)
	  			break;
				case "high_risk_btn":
	  			//var row = this.subInfoController.getRowFrom(el);
	  			var row = this.highRiskTableController.getRowFrom(el);
					var rowModel = row.model;
					declarations_number = rowModel.declarations_number; 
					if(declarations_number == undefined){
	  			  declarations_number = rowModel.number_customs;
					}
					$.route.attrs({category: 'document', id: declarations_number}, true);
					$('#document-details').docview_ui_details('queryDoc', declarations_number);
					$("#search-some-conditions").hide();
	  			break;
				default:
	  			break;
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
    ".return-main click" : function(el,ev){
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

