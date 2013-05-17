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
	'docview/ui/pagingtable',
	'docview/ui/user_select',
	'docview/ui/org'
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
    './views/init.ejs',
	'libs/jquery.single_card_number.js'
).then(function($) {
    $.Controller('Docview.Ui.requisition', {}, {
		init : function(){
			//this.element.find('.user-list').docview_ui_dmstable({table_options : table_options});
			//this.tableController = this.element.find('.user-list').controller();
		   this.filter_tag = undefined;
			this.roles = this.options.clientState.attr('user').roles;
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
		   var user = this.options.clientState.attr('user');
		   var orgs = (user.orgs == '2200') ? [ ] : user.orgs.split(',');
		   this.element.find('.org').docview_ui_org({ name:'org', include:orgs , default_text:orgs.length > 0 ? null: '不限' });
		   this.element.find('.user_select').docview_ui_user_select({ users:[ { username:'',fullname:'' },{ username:'',fullname:'暂不指定' } ] });
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
						var n = 0;	
						var m = 0;	
						for(var j=0;j<data.requisition_details[i].length;j++){
							!data.requisition_details[i][j].is_check && n++ 
							data.requisition_details[i][j].is_check && m++ 
						}
						data.requisitions[i].found_num = n;
						data.requisitions[i].not_found_num = m;
					}
					return data.requisitions;
				},
				columns:[
					{ id:'serial_number' , text:'流水号' },
					{ id:'created_at' , text:'申请日期' },
					{ id:'apply_staff' , text:'申请人员' },
					{ id:'org' , text:'业务点' },
					{ id:'department_name' , text:'科室名称' },
					{ id:'requisition_details' , text:'报关单号' },
					{ id:'storage_sites' , text:'存放地点' },
					{ id:'found_num', text:'借阅有/无' },
					{ id:'status' , text:'状态' },
					{ id:null , text:'操作' }
				],
				sort:[[1,"desc"]]
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


			$.extend($.parse_code_map,{
				'200':	'可以添加',
				'201':	'已电子化',
				'202':	'已申请',
				'203':	'无权限',
				'204':	'网络错误'
			});
	
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
			var element = el.closest('#new-application-form');
			var tbody = element.find('.requisition-details-text-holder tbody');
			tbody.append(this.view("//docview/ui/requisition/views/application/new_requisition_details_row.ejs"));
			tbody.find('tr:last').hide().show('');
			element.find('.remove-requisition-details').show('');
		},
		".remove-requisition-details click" : function(el,ev){
			var table_row_count = $(el).closest("tbody").find("tr").length;
			if (table_row_count > 1){
				$(el).closest("tr").hide('fast',function(){ 
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
		'.filter_docs blur':function(el,ev){
			
		},
		'.filter_docs keyup':function(el,ev){
			el.asyncVerifyCode(function(code){  
				var tipsElement = el.closest('tr').find('.tips');
				tipsElement.removeClass('label-success label-warning label-important');
				tipsElement.show();
				tipsElement.text($.parse_code_map[code]);
				if(code == 0){
					var hit = false;
					$('.filter_docs').each(function(key,item){
						if(item != el[0] &&  item.value == el.val()){
							hit = true;
							return;
						}
					});
					if(hit){
						tipsElement.text('重复记录');
						tipsElement.addClass('label-warning');
						return;
					}
					Docview.Models.Requisition.filterDocs({ "doc_id" : el.val() },
					//
					function(data){
						code = data.status || 204;
						el.data('validate_state',code);
						tipsElement.text($.parse_code_map[code]);
						tipsElement.addClass('label-' + ( code == 200 ? 'success' :'important'));
					},
					function(err){
						code = -1;	
						tipsElement.text($.parse_code_map[code]);
						tipsElement.addClass('label-important');
					});
				}
			});	
		},
		'.requisition_detail_form keydown':function(el,ev){
			if(ev.keyCode == 13){
				ev.preventDefault();
			}	
		},
		'.filter_docs keydown':function(el,ev){
			if(ev.keyCode == 13){
				el.closest('tr').find('input[name=rationale_single_number]').focus();	
				ev.preventDefault();
			}
		},
		'input[name=rationale_single_number] keydown':function(el,ev){
			if(ev.keyCode == 13){
				var next = el.closest('tr').next();	
				if(next.length && next.find('.filter_docs').focus()){
					//
				}else{
					el.closest('.create-application').find('.new-requisition-details').click();
					next = el.closest('tr').next();	
					next.find('.filter_docs').focus();
				}
			}
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
			var kz_user = el.find('select[name=kz_users]');
			if(!kz_user.find('option:eq(0)').text() && !kz_user.val()){
				$.alertMessage(that,{msg:'请确认审批人员'});
				return;
			}
			if(!application_originally){
				$.alertMessage(that,{msg:'抽单原由不能为空 ',title:'提示信息',type:'error'});
				return;
			}
			el.find('input.filter_docs').each(function(key,item){
				var $wallper = jQuery($(item).closest('tr'));
				var validate_state = $(item).data('validate_state');
				if(validate_state == 200){	
					requisition_details.push({
						"single_card_number" 			: $wallper.find("input[name='single_card_number']").val(),
						"rationale_single_number"		: $wallper.find("input[name=rationale_single_number]").val()
					});
				}
			});
			if(requisition_details.length == 0){
				$.alertMessage(that,{msg:'请输入抽单信息',title:'提示信息',type:'error'});
				return;
			}
			var requisition = {
				type: action,
				application_originally : application_originally,
				approving_officer: kz_user.val(),
				department_name: department_name,
				requisition_details: requisition_details
			};
			Docview.Models.Requisition.updateRequisition(requisition,function(data){
				if (data.status === 200) {
					$.alertMessage(that,{msg:'成功添加新申请表单 ',title:'提示信息',type:'success'});
					el[0].reset();
					while((el.find(".requisition_detail_form tr:eq(2)").remove()).size() > 0){ }
					el.find('.tips').hide();
					//$('.user_select').docview_ui_user_select();
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
			//$('.' + action + ' .create-application').show('slow');
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
			var tag = this.options.clientState.attr('access') .attr('requisition_docs').attr('register');
			rowElement.hide();

			var innerForm = this.view('//docview/ui/requisition/views/detial_form',{ ctx: this, model: rowModel ,action: action, tag: tag });
			rowElement.after(innerForm);
			innerForm = rowElement.next();
			innerForm.find('.user_select').docview_ui_user_select({ users:[ { username:'',fullname:'' } ] });
			if(action == 'approval')
				innerForm.find('.gld_user_select').docview_ui_user_select({ users:[ { username:'',fullname:'' } ] });

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
							if(data.reject_text)
								rowModel.termination_instructions = data.reject_text;
							
							that.tableController.reload({
								url:'/requisitions',
								data:{ type: action },
								type:'get'
							});
							//reload.
							//that.tableController.setModelData(rowModel);
							log("system" ,{ current_action: "requisition_docs." +  data.from_action , describe: scene_lent_paper_documentJsonDictionary[ data.status ] } );
							console.log(data);
						},
						error:that.proxy('failure')
					});
			};
			//拒绝
			innerForm.find('.btn-reject').popinput({
				callback:function(text){
					//console.log(arguments);
					//ev.preventDefault();
					data.reject_text = text;//$("#requisition-docs input[name=reject_text]").val();
					switch(action){
						case 'approval':
							data.status = 31;//
							break;
						case 'approval_guan':
							data.status = 32;
							break;
						case 'write_off':
							data.status = 33;
							break;
					}
					postData(data);
				}
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
				innerForm.find('input[type=checkbox]').each(function(key,item){
					data.ids[item.value] = item.checked;
				});
				switch(action){
					case 'approval':
						var gld_user = innerForm.find('select[name=gld_users]');
						if(!gld_user.find('option:eq(0)').text() && !gld_user.val()){
							$.alertMessage(that,{msg:'请确认审批人员'});
							return;
						}
						data.status = ((data.two_approvers = gld_user.val()) == '') ? 22 : 11;
						data.two_approvers = gld_user.val();
						break;
					case 'approval_guan':
						data.status = 12;//1审批通过
						break;
					case 'register':
						data.status = 13;//完成登记
						var print_form = "#print_detial_form_"+ rowModel.id;//数据ID
						$(print_form).find('input[type=checkbox]:checked').size() == $(print_form).find('input[type=checkbox]').size()  && (data.status = 34);
						//console.log($(print_form).find('input[type=checkbox]:checked').size() ,"== ?",$(print_form).find('input[type=checkbox]').size());
						//innerForm.find('input[type=checkbox]:checked').size() == innerForm.find('input[type=checkbox]').size()  && (data.status = 34); 
						break;
					case 'write_off':
						data.status = 14;//正常完成
						break;
				}
				console.log(data);
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
						var kz_user = innerForm.find('select[name=kz_users]');
						if(!kz_user.find('option:eq(0)').text() && !kz_user.val()){
							$.alertMessage(that,{msg:'请确认审批人员'});
							return;
						}
						data.status = ((data.approving_officer = kz_user.val()) == '') ? 21 : 10;
						break;
					case 11:
					case 22:
						var gld_user = innerForm.find('select[name=gld_users]');
						if(!gld_user.find('option:eq(0)').text() && !gld_user.val()){
							$.alertMessage(that,{msg:'请确认审批人员'});
							return;
						}
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
				//javascript:window.print();
				//javascript:printpreview();
				if (innerForm.find("input.print_all[type=checkbox]:checked").size() == 1){
					innerForm.find("tr.print_requisition_details").removeClass("noprint");
				} else {
					innerForm.find("tr.print_requisition_details").addClass("noprint");
				}
				var print_form = "print_detial_form_"+ rowModel.id;//数据ID
				that.printPage(print_form);
				/*
				Docview.Models.Requisition.printRequisition(data,function(url){
                    url = window.location.protocol + '//' + window.location.hostname  + '/' + url;
					window.location.href=url;
				},that.proxy('failure'));		
				*/
			});
			innerForm.find('.btn-cancel').click(function(ev){
				ev.preventDefault();
				$(this).closest('tr').prev().show('slow');
				$(this).closest('tr').remove();
			});
		},
		printPage : function(id){
			var needHTML = document.getElementById(id).innerHTML;
			//alert(needHTML);
			var OpenWindow = window.open("print.htm", "print", "");
			//var OpenWindow = window.open("print.htm", "abc", "height=600, width=750, top=0, left=0,toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, status=no");
			OpenWindow.document.write("<html>");
			OpenWindow.document.write("<head>");
			OpenWindow.document.write("<link href='/docview/docview.css' rel='stylesheet' type='text/css' />");
			OpenWindow.document.write("<link href='/docview/docview.css' rel='stylesheet' type='text/css' media='print' />");
			OpenWindow.document.write("<link href='/docview/subnav/subnav.css' rel='stylesheet' type='text/css' />");
			OpenWindow.document.write("<link href='/docview/bootstrap/bootstrap.css' rel='stylesheet' type='text/css' />");
			OpenWindow.document.write("<title>打印</title>");
			OpenWindow.document.write("</head>");
			OpenWindow.document.write("<body>");
			OpenWindow.document.write("<div>");
		   var subjection_org = this.options.clientState.attr('user').subjection_org;
			OpenWindow.document.write("<h1 style='text-align: center;'>"+ orgJsonDictionary[subjection_org] +"电子化申请单</h1>");
			OpenWindow.document.write("<hr />");
			OpenWindow.document.write("</div>");
			OpenWindow.document.write("<div class='print-requisition-page'>");
			OpenWindow.document.write(needHTML);
			OpenWindow.document.write("</div>");
			OpenWindow.document.write("</body>");
			OpenWindow.document.write("</html>");
			OpenWindow.document.close();
			OpenWindow.document.location.reload();
			OpenWindow.print();
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
		'.require_select focus':function(el,ev){
			var firstOption = el.find('option:eq(0)');
			if(!firstOption.text()  && !firstOption.val() ){
				firstOption.remove();   
			}
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

