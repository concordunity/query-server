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
    './views/application_nanhui.ejs',
    './views/approval.ejs',
    './views/approval_guan.ejs',
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
		    this.element.find("div.application_nanhui").html(this.view("application_nanhui",{ subjection_org: subjection_org ,kz_users: this.kz_users}));	
		    this.element.find("div.approval").html(this.view("approval"));	
		    this.element.find("div.approval_guan").html(this.view("approval_guan"));	
		    this.element.find("div.register").html(this.view("register"));	
		    this.element.find("div.write_off").html(this.view("write_off"));	
		    this.element.find("div.lending_statistics").html(this.view("lending_statistics"));	
		    this.element.find("div.requisition_history").html(this.view("requisition_history"));	
			this.element.find('div.lending-date').docview_ui_daterange({
				dateOptions : {
                        labelString: "日期"
                    }
			});
			/*
			var application_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/application/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"requisition_details", mLabel : '报关单号'},
					{"mDataProp":"org", mLabel : '业务点 '},
					//{"mDataProp":"single_card_number", mLabel : '报关单号'},
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
					{"mDataProp":"org", mLabel : '业务点'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '报关单号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			//this.element.find('.approval-list').docview_ui_dmstable({table_options : approval_table_options});
			//this.approvalController = this.element.find('.approval-list').controller();
			*/
			this.tableController =  this.element.find('.approval-guan-list').docview_ui_pagingtable({
				tmpl_path: "/docview/ui/requisition/views/col_",
				success:function(data){
					data = data.aaData;
					for(var i=0;i<data.requisitions.length;i++){
						data.requisitions[i].requisition_details = data.requisition_details[i];	
					}
					return data.requisitions;
				},
				columns:[
					{ id:'created_at' , text:'申请日期' },
					{ id:'apply_staff' , text:'申请人员' },
					{ id:'org' , text:'业务点' },
					{ id:'department_name' , text:'科室名称' },
					{ id:'requisition_details' , text:'报关单号' },
					{ id:'storage_sites' , text:'存放地点' },
					{ id:'status' , text:'状态' },
					{ id:null , text:'操作' }
				],
				sort:[[0,"desc"]]
			}).controller();	

		/*	
			
			var register_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/register/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"approving_officer", mLabel : '审批人员'},
					{"mDataProp":"org", mLabel : '业务点'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '报关单号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			//this.element.find('.register-list').docview_ui_dmstable({table_options : register_table_options});
			//this.registerController = this.element.find('.register-list').controller();
			var write_off_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/write_off/",
				aoColumns: [
					{"mDataProp":"created_at", mLabel : '申请日期'},
					{"mDataProp":"registration_staff", mLabel : '核销人员'},
					{"mDataProp":"org", mLabel : '业务点'},
					{"mDataProp":"department_name", mLabel : '科室名称'},
					{"mDataProp":"requisition_details", mLabel : '报关单号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"asc"]],
				file_name: ""
			};
			//this.element.find('.write-off-list').docview_ui_dmstable({table_options : write_off_table_options});
			//this.writeOffController = this.element.find('.write-off-list').controller();
			
*/
			$('.input-date').datepicker();
			$('input[readonly]').tooltip();
	
			var lending_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/requisition/views/lending_statistics/",
				aoColumns: [
					{"mDataProp":"org", mLabel : '业务点'},
					{"mDataProp":"count", mLabel : '申请单数量'},
					{"mDataProp":"rd_count", mLabel : '报关单数量'},
					{"mDataProp":"rd_count_false", mLabel : '未果数量'}
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
					{"mDataProp":"requisition_details", mLabel : '报关单号'},
					{"mDataProp":"status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};

			this.element.find('.requisition-history-list').docview_ui_dmstable({table_options : requisition_history_table_options});
			*/
			/*
			this.element.find('.requisition-history-list').docview_ui_pagingtable({
				tmpl_path: "/docview/ui/requisition/views/requisition_history/col_",
				columns:[
					{ id:'created_at',text:'日期' },
					{ id:'apply_staff',text:'申请人员' },
					{ id:'org',text:'业务点' },
					{ id:'department_name',text:'科室名称' },
					{ id:'requisition_details',text:'报关单号' },
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
			*/
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
				this.element.show();
				//this.reload();
				$.each(["application",'application_nanhui',"approval",'approval_guan',"register","write_off","lending_statistics","requisition_history"],function(key,value){
					$('.' + value ).hide();
				});
				var subcategory = $.route.attr('subcategory');
				this.element.find('.' + subcategory).show('fast');

			} else {
				this.mainTabOn = false;
				this.element.hide();
			}
		},
		'{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
			if (!this.mainTabOn) return;
			oldVal && this.element.find('.' + oldVal).hide();
			var category = $.route.attr('category');
			var subcategory = $.route.attr('subcategory');
			newVal = subcategory;
			//console.log(newVal,oldVal);
			this.element.find('.' + newVal).show('fast');
			var table = this.element.find('.approval-guan-list');
			switch(newVal){
				case 'approval':
				case 'approval_guan':
				case 'register':
				case 'write_off':
				case 'requisition_history':
				this.element.find('.' + newVal).append(table);
				var controller =  table.controller();
				controller.reload({
					url:'/requisitions',
					data:{ type: newVal },
					type:'get'
				});
				break;
				default:
				//Docview.Models.Requisition.findRequisition({type: newVal},this.proxy("requisitionList"),{});
				break;
			}
        },
		requisitionList : function(data){
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
		"#new-application-btn click" : function(el,ev){
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
			this.filterRequisitionDetails(doc_id);
		},
		".filter_docs blur" : function(el,ev){
			var doc_id = el.val();
			var msg_map = {
				0:{
					cls:'important',
					text:'网络错误'
				},
				1:{
					cls:'info',
					text:'验证中..'
				},
				2:{
					cls:'warning',
					text:'不能为空'
				},
				3:{
					cls:'warning',
					text:'长度错误'
				},
				4:{
					cls:'warning',
					text:'必须数字'
				},
				200:{
					cls:'success',
					text:'可以添加'
				},
				201:{
					cls:'warning',
					text:'已电子化'
				},
				202:{
					cls:'warning',
					text:'已申请'
				},
				203:{
					cls:'important',
					text:'没有权限'
				},
				204:{
					cls:'important',
					text:'未知错误'
				}
			};
			var showTips = function(type){
				var tipsElement = el.closest('tr').find('.tips');
				$.each(msg_map,function(key,value){
					tipsElement.removeClass('label-' + value.cls);
				});
				var msg = msg_map[type];
				tipsElement.addClass('label-' + msg.cls );
				tipsElement.text(msg.text);
				tipsElement.show('slow');
				el.data('validate_state',type);
			};
			if(!$.trim(doc_id)){
				showTips(2);
				return;
			}
			if(doc_id.length != 18){
				showTips(3);
				return;
			}
			if(!/^\d{18}$/.test(doc_id)){
				showTips(4);
				return;	
			}

			showTips(1);//ing ..
			Docview.Models.Requisition.filterDocs({ "doc_id" : doc_id },
				function(data){//ajax success .
					showTips(data.status || 204);
				},
				function(err){//ajax error
					showTips(0);
				});
		},
		".create-application form submit" : function(el,ev){
			ev.preventDefault();
			var that = this;
			var action = $.route.attr('subcategory');
			var btn = el.find('button[type=submit]');
			/*
			if(!btn.hasClass('two-step')){
				btn.addClass('two-step');
				el.find('select[name=kz_user]').show('slow');
				return;
			}
			*/
			var requisition_details = []; 
			var department_name = el.find("select[name=department]").val();
			var application_originally  = el.find("input[name=application_originally]").val();
			var approving_officer = '';// el.find("select[name=kz_user]").val();
			var lbl_wait = el.find('label.lbl-wait');
			var allow_return = false;
			el.find('input.filter_docs').each(function(key,item){
				var $wallper = jQuery($(item).closest('tr'));
				var validate_state = $(item).data('validate_state');
				switch(validate_state){
					case 1:
						allow_return = true;
						lbl_wait.text("正在验证报关单号码,请稍候提交.").show('slow');
						return;//ing
					case 200:
						if(!$.trim($wallper.find("input[name=rationale_single_number]").val())){
							$wallper.find("input[name=rationale_single_number]").focus();
							lbl_wait.text("理单号不能为空.").show('slow');
							allow_return = true;
							return;
						}
						requisition_details.push({
							"single_card_number" 			: $wallper.find("input[name='single_card_number']").val(),
							"rationale_single_number"		: $wallper.find("input[name=rationale_single_number]").val()
						});
						break;//ok
					default://		
						allow_return = true;
						lbl_wait.text("您输入的报关单号码有误,请修改后提交.").show('slow');
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
				type: action,
				application_originally : application_originally,
				approving_officer:approving_officer ,
				department_name: department_name,
				requisition_details: requisition_details
			};
			Docview.Models.Requisition.updateRequisition(requisition,function(data){
				if (data.status === 200) {
					el.closest('.create-application').hide('fast');
					$('.' + action + ' .select-approval').show('slow').find('form').data('lastID',data.requisition.id);
					$.alertMessage(that,{msg:'成功添加新申请表单 ',title:'提示信息',type:'success'});
				}else {
					$.alertMessage(that,{msg:'申请单添加失败',title:'提示信息',type:'error'});
				}
			},this.proxy("failure"));
		},
		failure : function(err){
			//error
			console.log('error:',err);
		},
		'.btn-cancel-select-approval click':function(el,ev){
			ev.preventDefault();
			var action = $.route.attr('subcategory');
			$('.' + action + ' .create-application').show('slow');
			$('.' + action + ' .select-approval').hide('fast');
		},
		'.select-approval form submit':function(el,ev){
			ev.preventDefault();
			var that = this;
			var id = el.data('lastID');
			var action = $.route.attr('subcategory');
			var approval = el.find("select[name=kz_user]").val();
			var status = 10;
			if(approval == ''){
				status = 21;	
			}
			var data = { id: id , from_action: action , approving_officer : approval ,status: status };
			$.ajax({
				url:'/requisitions/change_status',
				data: data,
				type:'post',
				error:function(){
				},
				success:function(){
					$('.btn-cancel-select-approval').click();
					$.alertMessage(that,{msg:'成功指定审批人员',title:'提示信息',type:'success',time:5000})
				}
			});
		},
		'.detial-row click':function(el,ev){
			ev.preventDefault();

			var that = this;
			var controller = this.tableController;
			var action = $.route.attr('subcategory');
			
			var row = controller.getRowFrom(el);
			var rowElement = row.element;
			var rowModel = row.model;
			//hide this row
			rowElement.hide();

			var innerForm = this.view('//docview/ui/requisition/views/detial_form',{ ctx: this, model: rowModel ,action: action});
			rowElement.after(innerForm);
			innerForm = rowElement.next();

			var kz_user = innerForm.find('select[name=kz_user]');
			var gld_user = innerForm.find('select[name=gld_user]');

			var data = {
				id:rowModel.id,//数据ID
				from_action:action,
				status: rowModel.status,//状态
				ids:{}
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
							console.log(data);
							//if(data.reject_text)
							//	rowModel.termination_instructions = data.reject_text;
							
							that.tableController.reload({
								url:'/requisitions',
								data:{ type: action },
								type:'get'
							});
							//reload.
							//controller.setModelData(rowModel);
							log("system" ,{ current_action: "requisition_docs." +  data.from_action , describe: scene_lent_paper_documentJsonDictionary[ data.status ] } );
						},
						error:that.proxy('failure')
					});
			};
			//拒绝
			innerForm.find('.btn-reject').click(function(ev){
				ev.preventDefault();
				switch(action){
					case 'approval':
						data.status = 31;//
						break;
					case 'approval_guan':
						data.status = 32;
						break;
				}
				postData(data);
			});
			//同意
			innerForm.find('.btn-accept').click(function(ev){
				ev.preventDefault();
				/*if(action =='approval' && !$(this).hasClass('two-step')){
					$approval_officer.show('slow');
					$(this).addClass('two-step').text('提交');
					return;
				}
				*/
				switch(action){
					case 'approval':
						data.status = 11;
						data.two_approvers = gld_user.val();
						break;
					case 'approval_guan':
						data.status = 12;//1审批通过
						break;
					case 'register':
						data.status = 13;//完成登记
						break;
					case 'write_off':
						data.status = 14;//正常完成
						break;
				}
				innerForm.find('input[type=checkbox]').each(function(key,item){
					data.ids[item.value] = item.checked;
				});
				postData(data);
			});
			//撤销
			innerForm.find('.btn-revocation').click(function(ev){
				ev.preventDefault();
				/*
				if(!$(this).hasClass('approving_officer')){
					((rowModel.status == 10 || rowModel.status == 21) ?kz_user:gld_user).show('slow');
					$(this).addClass('approving_officer');
					return;	
				}
				*/
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
			});
			//删除
			innerForm.find('.btn-delete').click(function(ev){
				data.status = 20;
				postData(data);	
			});
			//打印
			innerForm.find('.btn-print').click(function(ev){
				ev.preventDefault();
				Docview.Models.Requisition.printRequisition(data,function(url){
                    url = window.location.protocol + '//' + window.location.hostname  + '/' + url;
					window.location.href=url;
				},that.proxy('failure'));		
			});
			innerForm.find('.btn-cancel').click(function(ev){
				ev.preventDefault();
				$(this).closest('tr').prev().show('slow');
				$(this).closest('tr').remove();
			});
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
				console.log('  =---  success lending ----');
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

