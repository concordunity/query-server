steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs'
).then(
    './views/import_most_time_org_doc_info.ejs',
    './views/normal_import_price_less_record.ejs',
    './views/zero_find_check_info.ejs',
    './views/son_table.ejs'
).then(
    'docview/ui/details',
    'docview/ui/dmstable'
).then(
    'docview/bootstrap/bootstrap.css'    
).then(function($) {
    $.Controller('Docview.Ui.search_some_condition', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },
	".find-zero-rate click" : function(el,ev){
		$("#search_result").show();
                $("#second_result").show();
		console.log("find-zero-rate");
		Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"zero_find_check_info"},
		    this.proxy("find_zero_rate"),
		{});
	},
	".normal-import-record click" : function(el,ev){
		$("#search_result").show();
                $("#second_result").hide();
		console.log("normal-import-record");
		Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"normal_import_price_less_record"},
		    this.proxy("normal_import_record"),
		{});
	},

	".import-most-time click" : function(el,ev){
		$("#search_result").show();
                $("#second_result").hide();
		console.log("import-most-time");
		Docview.Models.Monitoring.getSearchData({"urlValue":"/search_condition","typeValue":"get"},{"search_condition":"import_most_time_org_doc_info"},
		    this.proxy("import_most_time"),
		{});
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
	    this.element.find('#search_result').docview_ui_dmstable({
                    table_options : table_options
                });	    
	    console.log(data);
	    var controller = $('#search_result').controller();
	    controller.setModelData(data);	   
*/
                $("#search_result").html(this.view('zero_find_check_info',data));
                var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

                this.element.find('div#search_result table').dataTable({
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
            this.element.find('#search_result').docview_ui_dmstable({
                    table_options : table_options
                });
            console.log(data);
            var controller = this.element.find('#search_result').controller();
          controller.setModelData(data);
*/
                $("#search_result").html(this.view('normal_import_price_less_record',data));
                var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

                this.element.find('div#search_result table').dataTable({
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
            this.element.find('#search_result').docview_ui_dmstable({
                    table_options : table_options
                });
            console.log(data);
            var controller = this.element.find('#search_result').controller();
          controller.setModelData(data);
*/
                $("#search_result").html(this.view('import_most_time_org_doc_info',data));
                var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

                this.element.find('div#search_result table').dataTable({
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
        'td a click': function(el, ev) {
            ev.preventDefault();
	    var son_table = $(el).attr("class");
	    console.log(son_table);
	    var document = el.closest('tr').model();
	    if(son_table == "son_table"){
		
                Docview.Models.Monitoring.getSearchData({"urlValue":"/get_son_table","typeValue":"get"},{"operating_name":document.operating_name},
                    this.proxy("setSonTable"),
                {});
        	      
	    }else{
              $.route.attrs({category: 'document', id: document.declarations_number}, true);
              $('#document-details').docview_ui_details('queryDoc', document.doc_id);
              $('#search-box').hide();
	    }
        },
	setSonTable : function(data){
		$("#search_result").hide();
                $("#second_result").show();	    
                $("#second_result").html(this.view('son_table',data));
                var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";

                this.element.find('div#second_result table').dataTable({
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
                $("#search_result").show();
                $("#second_result").hide();	    
	},
        show : function() {
	   
        }
});
});

