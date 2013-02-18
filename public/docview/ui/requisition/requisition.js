steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'
).then(
	'docview/ui/dmstable'
).then(
    'libs/json2.js',
    'libs/org_json.js',
	'libs/scene_lent_paper_document_json.js',
    'docview/datatables/bootstrap-pagination.js'
).then(
    './views/requisition.ejs',
    './views/application.ejs',
    './views/approval.ejs',
    './views/register.ejs',
    './views/write_off.ejs',
    './views/lending_statistics.ejs',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.requisition', {}, {
        init : function() {


			//this.element.find('.user-list').docview_ui_dmstable({table_options : table_options});
			//this.tableController = this.element.find('.user-list').controller();

		   this.comment_dic = commentsArrayDictionary;
		   var requisition =  this.options.clientState.attr('access').attr('requisition_docs');
		   this.element.html(this.view('requisition', requisition));

		   // Hide box until route conditions are met
		   this.element.hide();
		   // Hide search types until route conditions are met
		   this.mainTabOn = false;
		    this.element.find("div.application").html(this.view("application"));	
		    this.element.find("div.approval").html(this.view("approval"));	
		    this.element.find("div.register").html(this.view("register"));	
		    this.element.find("div.write_off").html(this.view("write_off"));	
		    this.element.find("div.lending_statistics").html(this.view("lending_statistics"));	


			var application_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/application/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					//{"mDataProp":"single_card_number", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				file_name: "application"
			};
			this.element.find('.application-list').docview_ui_dmstable({table_options : application_table_options});
			this.applicationController = this.element.find('.application-list').controller();
			var approval_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/approval/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"apply_staff", mLabel : '申请人员'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				file_name: "approval"
			};
			this.element.find('.approval-list').docview_ui_dmstable({table_options : approval_table_options});
			this.approvalController = this.element.find('.approval-list').controller();
			
			var register_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/register/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"approving_officer", mLabel : '审批人员'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				file_name: "register"
			};
			this.element.find('.register-list').docview_ui_dmstable({table_options : register_table_options});
			this.registerController = this.element.find('.register-list').controller();
			var write_off_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/write_off/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"approving_officer", mLabel : '核销人员'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				file_name: "write_off"
			};
			this.element.find('.write-off-list').docview_ui_dmstable({table_options : write_off_table_options});
			this.writeOffController = this.element.find('.write-off-list').controller();
/*
		   //$('.input-date').datepicker($.datepicker.regional['zh-CN']);
		   this.element.find('div.daterange-holder').docview_ui_daterange( {dateOptions : {labelString: "日期"}});
		   this.element.find('div.daterange-holder-src').docview_ui_daterange( {dateOptions : {labelString: "理单日期"}});
		   this.element.find('div.single_holder').docview_ui_single({label: {labelString: "报关单号"}});
*/
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "requisition_docs") {	
				this.mainTabOn = true;
				this.reshow();
			} else {
				this.element.hide();
			}
			// we need to reset filters
			//this.clearFilters();
		},
		'{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
			if (newVal == undefined) {
				return;
			}
			if (this.mainTabOn) {
				if (oldVal !== undefined) {
					this.element.find('.' + oldVal).hide();
				}
			    
				var category = $.route.attr('category');
				if (category !== undefined && category === "requisition_docs") {
		//			this.element.find('div.requisition-list').docview_ui_dmstable();
					if (newVal != 'single') {
							this.reshow();
							Docview.Models.Requisition.findRequisition({type: newVal},this.proxy("requisitionList"),{});
							$.route.attr('id', -1);
							if (newVal != 'single') {
									$('#document-details').hide();
							} 
					} 
					//this.element.find('.' + newVal).show();
					this.element.find('li.nav-pills').removeClass('active');
					this.element.find('li a[href="#'+newVal+'"]').closest('li').addClass('active');
				}
			}
        },
		requisitionList : function(data){
			console.log("result = ",data);
			var sub_cat = $.route.attr('subcategory');
		    switch(sub_cat) {
				case "application":
					this.applicationController.setModelData(data);	
					break;
				case "approval":
					this.approvalController.setModelData(data);	
					break;
				case "register":
					this.registerController.setModelData(data);	
					break;
				case "write_off":
					this.writeOffController.setModelData(data);	
					break;
				case "lending_statistics":
					this.lendingStatisticsController.setModelData(data);	
					break;
			}	
						
		},
		reshow : function() {
			this.element.show();
			var sub_cat = $.route.attr('subcategory');
			var to_show = sub_cat;

			if (!sub_cat) {
					to_show = this.element.find("form")[0].className;
			}
			this.element.find('.' + to_show).show();
			if (sub_cat == 'by_doc_source') {
					this.reloadESH();
			}	    
			var to_show_class = ["application","approval","register","write_off","lending_statistics"];
			$.each(to_show_class,function(index,value){
				if (to_show != value) {
					$("."+value).hide();
				}
			});
		},
		"#new-application-btn click" : function(el,ev){
			console.log("===click===");
			$("#new-application").html(this.view("//docview/ui/requisition/views/application/new_application.ejs"));
//			this.element.find('#new-application .requisition_detail_form  .requisition_detail_doc').docview_ui_single({label: {labelString: ""}});
		},
		".new-requisition-details click" : function(el,ev){
			var index = $(el).closest("tbody").find("tr").length;
			if (index < 3){
				$(el).closest("tr").closest("tbody").append(this.view("//docview/ui/requisition/views/application/new_requisition_details_row.ejs",{"index":index}));
			//	this.element.find('#new-application .requisition_detail_form  .requisition_detail_doc').docview_ui_single({label: {labelString: ""}});
			}
		},
		".remove-requisition-details click" : function(el,ev){
			var index = $(el).closest("tbody").find("tr").length;
			console.log("data-index = ",index);
			if (index > 1){
				$(el).closest("tr").remove();
			}
		},
		".filter-requisition-details click" : function(el,ev){
			var doc_id = $(el).closest("tr").find(".filter_docs").val();
			var org = $("#new-application-form select[name='org']").val();
			console.log(doc_id,org);
			this.filterRequisitionDetails(doc_id,org);
		},
		".filter_docs blur" : function(el,ev){
			var doc_id = $(el).val();
			var org = $("#new-application-form select[name='org']").val();
			console.log(doc_id,org);
			this.filterRequisitionDetails(doc_id,org);
		},
		filterRequisitionDetails : function(doc_id,org){
			Docview.Models.Requisition.filterDocs({"org":org,"doc_id":doc_id},this.proxy("alertTitle"),this.proxy("failure"));
		},
		alertTitle : function(data){
			var message = "";
			$("#new-application-form span.display-info").removeClass("label-success");
			$("#new-application-form span.display-info").removeClass("label-important");
			if(data){
				message = "It doesn't has in system";
				$("#new-application-form span.display-info").addClass("label-success");
			} else {
				message = "It has doc in system";
				$("#new-application-form span.display-info").addClass("label-important");
			}
			console.log(message);
			$("#new-application-form span.display-info").html(message);
		},
		"#new-application-form submit" : function(el,ev){
			ev.preventDefault();
			var requisition_details = new Array(); 
			var tel = el.find("input[name='tel']").val();
			var org = el.find("input[name='org']").val();
			var department_name = el.find("input[name='department_name']").val();
			
			$.each(el.find("tr"),function(index,item){
				var single_card_number = $(item).find("input[name='single_card_number']").val();
				var modify_accompanying_documents = $(item).find("input[name='modify_accompanying_documents']").val();
				var where_page = $(item).find("input[name='where_page']").val();
				var lent_reasons = $(item).find("input[name='lent_reasons']").val();
				requisition_details.push({"single_card_number" : single_card_number, "modify_accompanying_documents" : modify_accompanying_documents, "where_page" : where_page, "lent_reasons": lent_reasons});
			});
			var requisition = {
				tel: tel,
				org: org,
				department_name: department_name,
				requisition_details: requisition_details
			};
			Docview.Models.Requisition.updateRequisition(requisition,this.proxy("addDataRow"),this.proxy("failure"));
		},
		".cancel-create click" : function(el,ev){
			$("#new-application").collapse("hide");
		},
		addDataRow : function(data){
			console.log(data);
			$("#new-application").collapse("hide");
			this.reload();
		},
        addUserRow: function(user, response) {
            if (user.status === 200) {
            this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功添加新用户 ' + user.user.username 
            });
			this.reload();
			}else {}
		},
		reload : function(){
			this.reshow();
			var sub_cat = $.route.attr('subcategory');
			Docview.Models.Requisition.findRequisition({type: sub_cat},this.proxy("requisitionList"),{});
		},
		failure : function(){},
        show : function() {
        }
});
});
