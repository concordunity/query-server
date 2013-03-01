steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'
).then(
    'docview/bootstrap/bootstrap-tooltip.js',
    'docview/bootstrap/bootstrap-popover.js',
    'docview/bootstrap/bootstrap-popinput.js',
	'docview/ui/dmstable',
	'docview/ui/daterange'
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
//    './views/detial_form.ejs',
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
			this.element.find('div.lending-date').docview_ui_daterange({
				dateOptions : {
                        labelString: "日期"
                    }
			});

			var application_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/application/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"org", mLabel : '关区'},
					//{"mDataProp":"single_card_number", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.application-list').docview_ui_dmstable({table_options : application_table_options});
			this.applicationController = this.element.find('.application-list').controller();
			var approval_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/approval/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"apply_staff", mLabel : '申请人员'},
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			this.element.find('.approval-list').docview_ui_dmstable({table_options : approval_table_options});
			this.approvalController = this.element.find('.approval-list').controller();
			
			var register_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/register/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"approving_officer", mLabel : '审批人员'},
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			this.element.find('.register-list').docview_ui_dmstable({table_options : register_table_options});
			this.registerController = this.element.find('.register-list').controller();
			var write_off_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/write_off/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"registration_staff", mLabel : '核销人员'},
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			this.element.find('.write-off-list').docview_ui_dmstable({table_options : write_off_table_options});
			this.writeOffController = this.element.find('.write-off-list').controller();
			

			$('.input-date').datepicker();
			

			var lending_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/lending_statistics/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '日期'},
					{"mDataProp":"apply_staff", mLabel : '人员'},
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.lending-list').docview_ui_dmstable({table_options : lending_table_options});
			this.lendingStatisticsController = this.element.find('.lending-list').controller();
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
				this.reload();
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
						console.log("I don't know where is this action from");
							this.reshow();
							if (newVal == "lending_statistics"){	
									
							}else{
								Docview.Models.Requisition.findRequisition({type: newVal},this.proxy("requisitionList"),{});
							}
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
			console.log(' ==== blur ====');
			console.log(doc_id,org);
			this.filterRequisitionDetails(doc_id,org);
		},
		filterRequisitionDetails : function(doc_id,org){
			var result = this.validateInputOrEmpty(doc_id);
			that = this;
			var tag = true;
			if (result){
				Docview.Models.Requisition.filterDocs({"org":org,"doc_id":doc_id},
					//this.proxy("alertTitle"),
					function(data){
						tag = data.status;
						that.alertTitle(data);
					},
					this.proxy("failure"));
			}else{
				tag = false;
			}
			return tag; 
		},
		alertTitle : function(data){
			var message = data.message;
			var show_message = "";
			console.log(message);
			$("#new-application-form div.display-message").html();
			if(data.status){
				show_message = "<span class='label label-success' >" + message  + "</span>";
			} else {
				show_message = "<span class='label label-important' >" + message + "</span>";
			}
			$("#new-application-form div.display-message").html(show_message);
			setTimeout(function(){
				$("#new-application-form div.display-message").html();
			},4000);
		},
		"#new-application-form submit" : function(el,ev){
			ev.preventDefault();
			var requisition_details = new Array(); 
			var tel = el.find("input[name='tel']").val();
			var org = el.find("select[name='org']").val();
			var department_name = el.find("input[name='department_name']").val();
			var tag = true;
			$.each(el.find("tbody").find("tr"),function(index,item){
				var single_card_number = $(item).find("input[name='single_card_number']").val();
				var modify_accompanying_documents = $(item).find("input[name='modify_accompanying_documents']").val();
				var where_page = $(item).find("input[name='where_page']").val();
				var lent_reasons = $(item).find("input[name='lent_reasons']").val();
				console.log("====== submit ===== ");
				console.log(" doc_id = ",single_card_number);
				var result = that.validateInputOrEmpty(single_card_number);
				if (result == false){
					tag = false;
				}

				console.log(" tag = ",tag);
				var result = that.validateInputOrEmpty(single_card_number);
				requisition_details.push({"single_card_number" : single_card_number, "modify_accompanying_documents" : modify_accompanying_documents, "where_page" : where_page, "lent_reasons": lent_reasons});
			});
			var requisition = {
				tel: tel,
				org: org,
				department_name: department_name,
				requisition_details: requisition_details
			};
			if (tag){
				var frd_tag = true;
				$.each(requisition_details,function(i,v){
					console.log("for requisition_detail ,current doc_id = ",v.single_card_number);
					var frd_tag = that.filterRequisitionDetails(v.single_card_number,org);
					if (frd_tag == false){
						return;
					}
				});
				if (frd_tag){
					Docview.Models.Requisition.updateRequisition(requisition,this.proxy("addDataRow"),this.proxy("failure"));
				}
			}
		},
		".cancel-create click" : function(el,ev){
			$("#new-application").collapse("hide");
		},
		addDataRow : function(data){
						console.log(data);
			$("#new-application").collapse("hide");
            if (data.status === 200) {
				this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功添加新申请表单 ' + data.message
				});
				this.reload();
			}else {
				this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '新申请表单添加失败 ' + data.message
				});
			}
		},
		reload : function(){
			this.reshow();
			var sub_cat = $.route.attr('subcategory');
			Docview.Models.Requisition.findRequisition({type: sub_cat},this.proxy("requisitionList"),{});
		},
		failure : function(){},
		validateInputOrEmpty: function(el) {
		    var docId = $.trim(el);
			console.log("=====  validateInputOrEmpty:  =====");
			console.log(docId);
			if (docId === "") {
				this.alertTitle({status: false, message: "报关单号不能为空."})
				return false;
			}else{
				return this.validateInput(el);
			}
		},
		validateInput: function(el) {
			//this.removeFormErrors(el);
			var docId = parseInt($.trim(el));
			var message = "";
			if (this.verifyDocId(docId)) {
				return true;
			}else{
				this.alertTitle({status: false, message: "报关单号必须是18位数字."})
				return false;
			}
		},
	   // Verifies individual document ids
		verifyDocId: function(id) {
			return /^\d{18}$/.test(id);
		},
        show : function() {
        },
		'.detial-row click':function(el,ev){
			ev.preventDefault();

			var that = this;
			var controller = null;
			var action = el.attr('id');
			switch(action){
				case 'application':
					controller = this.applicationController;
					break;
				case 'approval':
					controller = this.approvalController;
					break;
				case 'register':
					controller = this.registerController;
					break;
				case 'write_off':
					controller = this.writeOffController;
					break;
				case 'lending_statistics':
					controller = this.lendingStatisticsController;
					break;
			}
			
			var rowModelData = controller.getRowModelDataFor(el);
			var rowElement = rowModelData.tr;
			var rowModel =  rowModelData.model;
			rowElement.model(rowModel);
			rowElement.hide();

//			rowElement.after(this.view('detial_form',{ ctx: this, model: rowModel ,action: action}));
			var innerForm = this.view('//docview/ui/requisition/views/detial_form',{ ctx: this, model: rowModel ,action: action});
			rowElement.after(innerForm);
			innerForm = rowElement.next();
			var data = {
				id:rowModel.id,//数据ID
				from_action:action,
				status: rowModel.status//状态	
			};
			
			var postData = function(data){
					$.ajax({
						url:'/requisitions/change_status',
						data: data,
						type:'post',
						success:function(){
							innerForm.prev().show('slow');
							innerForm.remove();
							//
							rowModel.status = data.status;
							if(data.reject_text)
								rowModel.termination_instructions = data.reject_text;
							rowModel.save();
							//reload.
							that.reload();
							//controller.setModelData(rowModel);
							log("system" ,{ current_action: "requisition_docs." +  data.from_action , describe: scene_lent_paper_documentJsonDictionary[ data.status ] } );
						},
						error:that.proxy('failure')
					});
			};
			
			//
		
			innerForm.find('.btn-reject').popinput({ 
				callback:function(text){
					switch(action){
						case 'approval':
							data.status = 11;//审批不通过
							break;
						case 'register':
							data.status = 12;//登记不通过
							break;
						case 'write_off':
							data.status = 13;//核销不通过
							break;
					}
					data.reject_text = text;//拒绝理由
					postData(data);
				}
			});

			//innerForm.find('.btn-cancel')
			innerForm.find('.btn-accept').click(function(ev){
				ev.preventDefault();
				switch(action){
					case 'approval':
						data.status = 2;//审批通过
						break;
					case 'register':
						data.status = 3;//完成登记
						break;
					case 'write_off':
						data.status = 20;//正常完成
						break;
				}
				postData(data);
			});

			innerForm.find('.btn-revocation').click(function(ev){
				ev.preventDefault();
				data.status = 21;//
				postData(data);
			});

			innerForm.find('.btn-print').click(function(ev){
				ev.preventDefault();
				Docview.Models.Requisition.printRequisition(data,function(url){
                    url = window.location.protocol + '//' + window.location.hostname  + '/' + url;
					window.location.href=url;
				},that.proxy('failure'));		
			});
		},
		'.btn-cancel click':function(el,ev){
			var innerForm  = el.closest('tr');
			innerForm.prev().show('slow');
			innerForm.remove();
		},
		'form.lending_statistics submit':function(el,ev){
			ev.preventDefault();
			var org = el.find('select[name=org]').val();
			var begin_date = el.find('input[name=from_date]').val();		
			var end_date = el.find('input[name=to_date]').val();	
			var org_user_type = el.find('select[name=org_user_type]').val();
			var org_user = el.find('input[name=org_user]').val();	
			
			var data = {
				type: org_user_type,
				start_date: begin_date,
				end_date: end_date,
				username: org_user,
				org: org
			};
			var that = this;
			Docview.Models.Requisition.lendingStatisticsList(data,function(list){
				that.lendingStatisticsController.setModelData(list);	
			},that.proxy('failure'));		
		},
		failure:function(jqXHR, textStatus, errorThrown){
			var type,msg;
			switch(jqXHR.status){
				case 403:
					type = 'info';
					msg = "权限不足";
					break;
				case 404:
					type = 'warn';
					msg = "无法找到该页面";
					break;
				case 500:
					type = 'error';
					msg = "服务器内部错误";
					break;
			}
			this.options.clientState.attr('alert',{
				type:type,
				heading:type.toUpperCase() + ':',
				message: msg
			});	
		}
});
});

