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
	'docview/ui/daterange',
	'docview/ui/pagingtable'
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
    './views/requisition_history.ejs',
//    './views/detial_form.ejs',
    './views/lending_statistics.ejs',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.requisition', {}, {
        init : function() {
			Docview.Models.User.getUserSelect({},this.proxy("userSelect"),this.proxy("failure"));
			this.roles = this.options.clientState.attr('user').roles;
		},
		userSelect : function(data){
			this.kz_users = data.kz_users;
			this.gld_users = data.gld_users;
			this.initFunction();
		},
		initFunction : function(){
			//this.element.find('.user-list').docview_ui_dmstable({table_options : table_options});
			//this.tableController = this.element.find('.user-list').controller();
		   this.filter_tag = undefined;
//		   this.kz_users = undefined;
//		   this.gld_users = undefined;
		   this.comment_dic = commentsArrayDictionary;
		   var requisition =  this.options.clientState.attr('access').attr('requisition_docs');
		   var subjection_org = this.options.clientState.attr('user').subjection_org;
		   this.element.html(this.view('requisition', requisition));
			
		   // Hide box until route conditions are met
		   this.element.hide();
		   // Hide search types until route conditions are met
		   this.mainTabOn = false;
		    this.element.find("div.application").html(this.view("application",{ subjection_org: subjection_org ,kz_users: this.kz_users}));	
		    this.element.find("div.approval").html(this.view("approval"));	
		    this.element.find("div.register").html(this.view("register"));	
		    this.element.find("div.write_off").html(this.view("write_off"));	
		    this.element.find("div.lending_statistics").html(this.view("lending_statistics"));	
		    this.element.find("div.requisition_history").html(this.view("requisition_history"));	
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
			//this.element.find('.application-list').docview_ui_dmstable({table_options : application_table_options});
			//this.applicationController = this.element.find('.application-list').controller();
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
			$('input[readonly]').tooltip();
	
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
			var requisition_history_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/requisition_history/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '日期'},
					{"mDataProp":"apply_staff", mLabel : '人员'},
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '单证号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};

			this.element.find('.requisition-history-list').docview_ui_dmstable({table_options : requisition_history_table_options});
			*/
			this.element.find('.requisition-history-list').docview_ui_pagingtable({
				tmpl_path: "/docview/ui/requisition/views/requisition_history/col_",
				columns:[
					{ id:'created_at',text:'日期' },
					{ id:'apply_staff',text:'人员' },
					{ id:'org',text:'关区' },
					{ id:'department_name',text:'科室名称' },
					{ id:'requisition_details',text:'单证号' },
					{ id:'status',text:'状态' },
					{ id: null,text:'操作' }
				],
				success:function(data){
					data = data.aaData;
					for(var i=0;i<data.requisitions.length;i++){
						data.requisitions[i].requisition_details = data.requisition_details[i];	
					}
					return data.requisitions;
				}
			});
			this.requisitionHistoryController = this.element.find('.requisition-history-list').controller();
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
					switch(newVal){
						case 'requisition_history':
							this.requisitionHistoryController.reload({
								url:'/requisitions',
								type:'get',
								data:{ type:'requisition_history_page' }
							});
							break;
						}
					if (newVal != 'single') {
						console.log("I don't know where is this action from");
							this.reshow();
							if (newVal == "lending_statistics"){	
									
							}else if (newVal == "application"){	
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
		//			this.applicationController.setModelData(data);	
		//			break;
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
				case "requisition_history":
					//this.requisitionHistoryController.setData(data);	
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
			var to_show_class = ["application","approval","register","write_off","lending_statistics","requisition_history"];
			$.each(to_show_class,function(index,value){
				if (to_show != value) {
					$("."+value).hide();
				}
			});
		},
		"#new-application-btn click" : function(el,ev){
			console.log(this.kz_users);
			$("#new-application").html(this.view("//docview/ui/requisition/views/application/new_application.ejs",{kz_users: this.kz_users}));
		},
		".new-requisition-details click" : function(el,ev){
			var tbody = $('.requisition-details-text-holder tbody');
			tbody.append(this.view("//docview/ui/requisition/views/application/new_requisition_details_row.ejs"));
			tbody.find('tr:last').hide().show('slow');
			$('.remove-requisition-details').show('fast');
		},
		".remove-requisition-details click" : function(el,ev){
			var table_row_count = $(el).closest("tbody").find("tr").length;
			if (table_row_count > 1){
				$(el).closest("tr").hide('slow',function(){ 
					$(this).remove();
				 });
				if(table_row_count == 2){
					$('.remove-requisition-details').hide('fast');
				}
			}
		},
		".filter-requisition-details click" : function(el,ev){
			var doc_id = $(el).closest("tr").find(".filter_docs").val();
			console.log('filter-requisition-details >> ',doc_id);
			this.filterRequisitionDetails(doc_id);
		},
		".filter_docs blur" : function(el,ev){
			var doc_id = el.val();
			var showTips = function(type,msg){
				var hash_type = {1:'info',2:'success',3:'important',4:'important'};
				var hash_msg = {1:'验证中..',2:'可以提交',3:'输入错误',4:'网络异常,请重试'};
				var tipsElement = el.closest('tr').find('.tips');
				$.each(hash_type,function(key,value){
					tipsElement.removeClass('label-' + value);
				});
				tipsElement.addClass('label-' + hash_type[type]);
				tipsElement.text(msg || hash_msg[type]);
				tipsElement.show('slow');
				el.data('validate_state',type);
			};
			if(this.validateInputOrEmpty(doc_id) || doc_id.length != 18){
				showTips(3);//Error
			}else{
				showTips(1);//ing ..
				Docview.Models.Requisition.filterDocs({ "doc_id" : doc_id },
					function(data){//ajax success .
						showTips(data.status ? 2:3);//,data.message);
					},
					function(err){//ajax error
						showTips(4,err);
					});
			}
		},
		"#new-application-form submit" : function(el,ev){
			ev.preventDefault();
			var requisition_details = []; 
			var department_name = el.find("input[name='department_name']").val();
			var application_originally  = el.find("input[name=application_originally]").val();
			var approving_officer = el.find("select[name=kz_user]").val();
			var lbl_wait = $('label.lbl-wait');
			var allow_return = false;
			el.find('input.filter_docs').each(function(key,item){
				var $wallper = jQuery($(item).closest('tr'));
				var validate_state = $(item).data('validate_state');
				switch(validate_state){
					case 1:
						allow_return = true;
						lbl_wait.text("正在验证单证号码,请稍候提交.").show('slow');
						return;//ing
					case 2:
						requisition_details.push({
							"single_card_number" 			: $wallper.find("input[name='single_card_number']").val(),
							"rationale_single_number"		: $wallper.find("input[name=rationale_single_number]").val()
						});
						console.log(requisition_details);
						break;//ok
					case 3://error
					case 4://unkonw
					default://		
						allow_return = true;
						lbl_wait.text("您输入的单证号码有误,请修改后提交.").show('slow');
						return;
				}
			});
			//has a error , return ..
			if(allow_return) {
				setTimeout(function(){
					lbl_wait.hide('slow');
				},5000);
				return;	
			}
			var requisition = {
				application_originally : application_originally,
				approving_officer:approving_officer ,
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
            if (data.status === 200) {
				this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功添加新申请表单 '// + data.message
				});
				this.reload();
			}else {
				this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '新申请表单添加失败 '// + data.message
				});
			}
		},
		reload : function(){
			this.reshow();
			var sub_cat = $.route.attr('subcategory');
			if (sub_cat != "application"){
				Docview.Models.Requisition.findRequisition({type: sub_cat},this.proxy("requisitionList"),{});
			}
		},
		failure : function(){},
		validateInputOrEmpty: function(val) {
		    return $.trim(val) == '';
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
		'.history-detial-row click':function(el,ev){
			ev.preventDefault();
			var that = this;
			var controller = this.requisitionHistoryController;
			var row =  controller.getRowFrom(el);
			var rowModel = row.model;
			var rowElement = row.element;
			var innerForm = this.view('//docview/ui/requisition/views/requisition_history/detial_form',{ ctx: this, model: rowModel });
			rowElement.hide();
			rowElement.after(innerForm);
			innerForm = rowElement.next();
			var kz_user = innerForm.find('select[name=kz_user]').hide();
			var gld_user = innerForm.find('select[name=gld_user]').hide();
			var data = { id:rowModel.id,from_action:'requisition_history',status:rowModel.status };
			var postData = function(data){
				$.ajax({
					url:'/requisitions/change_status',
					data: data,
					type:'POST',
					error:function(){
						
					},
					success:function(){
						innerForm.remove();
						rowElement.show('slow');
						controller.dataTable._fnAjaxUpdate();
					}
				});
			};
			innerForm.find('.btn-delete').click(function(ev){
				data.status = 20;
				postData(data);	
			});
			innerForm.find('.btn-revocation').click(function(ev){
				ev.preventDefault();
				if(!$(this).hasClass('approving_officer')){
					((rowModel.status == 10 || rowModel.status == 21) ?kz_user:gld_user).show('slow');
					$(this).addClass('approving_officer');
					return;	
				}
				switch(rowModel.status){
					case 10:
					case 21:
						data.status = ((data.approving_officer = kz_user.val()) == '') ? 21 : 10;
						break;
					case 11:
					case 22:
						data.status = ((data.two_approvers = gld_user.val()) == '') ? 22 : 11;
						break;
				}
				postData(data);
				//=============
			});
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
				case 'requisition_history':
					controller = this.requisitionHistoryController;
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
							//if(data.reject_text)
							//	rowModel.termination_instructions = data.reject_text;
							rowModel.save();
							//reload.
							that.reload();
							//controller.setModelData(rowModel);
							log("system" ,{ current_action: "requisition_docs." +  data.from_action , describe: scene_lent_paper_documentJsonDictionary[ data.status ] } );
						},
						error:that.proxy('failure')
					});
			};
			
			/*
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
			*/

			var $approval_officer = innerForm.find('select[name=gld_user]').hide();
			innerForm.find('.btn-accept').click(function(ev){
				ev.preventDefault();
				if($(this).hasClass('two-approval')){
					$approval_officer.show('slow');
					$(this).removeClass('two-approval').addClass('two-step').text('提交');
					return;
				}
				switch(action){
					case 'approval':
						if($(this).hasClass('two-step')){
							data.status = 11;
							data.two_approvers = $approval_officer.val();
						}else{
							data.status = 12;//1审批通过
						}
						break;
					case 'register':
						data.status = 13;//完成登记
						break;
					case 'write_off':
						data.status = 14;//正常完成
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

