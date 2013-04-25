steal(
    'jquery/controller',
    'jquery/view/ejs',
    'docview/models',
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
    'libs/business_process_json.js',
    'libs/jquery.scroller.js',
    'docview/datatables/bootstrap-pagination.js'
).then(
    './views/create_interchange_receipt.ejs',
    './views/search_interchange_receipt.ejs',
    './views/create_dishonored_bill.ejs',
    './views/search_dishonored_bill.ejs',
    './views/statistical_inquiry.ejs',
    './views/business_process.ejs'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Businessprocess', {}, {
        init : function() {
           //this.element.html(this.view('init'));
		   this.lastEl = undefined;
           this.comment_dic = commentsArrayDictionary;
           var business_process =  this.options.clientState.attr('access').attr('business_process');
		   this.subjection_org =  this.options.clientState.attr('user').attr('subjection_org');

           this.element.html(this.view('business_process', business_process));

			           // Hide box until route conditions are met
           this.element.hide();
           // Hide search types until route conditions are met
           this.mainTabOn = false;
		   this.element.find("div.create_interchange_receipt").html(this.view("create_interchange_receipt",{subjection_org: this.subjection_org}));
		   this.element.find("div.search_interchange_receipt").html(this.view("search_interchange_receipt"));
		   this.element.find("div.create_dishonored_bill").html(this.view("create_dishonored_bill"));
		   this.element.find("div.search_dishonored_bill").html(this.view("search_dishonored_bill"));
		   this.element.find("div.statistical_inquiry").html(this.view("statistical_inquiry"));
		   this.element.find("input[name=date]").my_datepicker();
		   this.element.find("input[name=begin_date]").my_datepicker({ offset_month:-1 });
		   this.element.find("input[name=end_date]").my_datepicker();
		   this.element.find("input[name=interchange-receipt-date]").my_datepicker();
		   this.element.find('div.lending-date').docview_ui_daterange({
				dateOptions : {
                        labelString: "日期"
                    }
			});
		   var orgs = this.options.clientState.attr('user').orgs;
		   this.element.find('.new-dishonored .org').docview_ui_org({ name:'org', default_text:null });
		   this.element.find('.statistical_inquiry .org').docview_ui_org({ name:'org', default_text: orgs == '2200' ? '不限':null });
			$("div.search_interchange_receipt .show-detail").hide();
			var create_interchange_receipt_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/create_interchange_receipt/",
				aoColumns: [
					{"mDataProp":"org", mLabel : '关区'},
					{"mDataProp":"ir_date", mLabel : '日期'},
					{"mDataProp":"doc_type", mLabel : '单证种类'},
					{"mDataProp":"doc_start", mLabel : '开始理单号'},
					{"mDataProp":"doc_end", mLabel : '结束理单号'},
					{"mDataProp":"number_copies", mLabel : '送单份数'},
					{"mDataProp":"package", mLabel : '包数'},
					{"mDataProp":"ir_status", mLabel : '状态'}
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.create-interchange-receipt-list').docview_ui_dmstable({table_options : create_interchange_receipt_table_options});
			this.createInterchangeReceiptController = this.element.find('.create-interchange-receipt-list').controller();

			var detail_interchange_receipt_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/detail_interchange_receipt/",
				aoColumns: [
					{"mDataProp":"doc_type", mLabel : '项目'},
					{"mDataProp":"doc_start", mLabel : '开始理单号'},
					{"mDataProp":"doc_end", mLabel : '结束理单号'},
					{"mDataProp":"number_copies", mLabel : '送单份数'},
					{"mDataProp":"package", mLabel : '包数'}
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.search-interchange-receipt-detail').docview_ui_dmstable({table_options : detail_interchange_receipt_table_options});
			this.detailInterchangeReceiptController = this.element.find('.search-interchange-receipt-detail').controller();


			var search_interchange_receipt_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/search_interchange_receipt/",
				aoColumns: [
                    {"mDataProp":"org", mLabel : '关区'},
                    {"mDataProp":"created_at", mLabel : '交接单生成时间'},
                    {"mDataProp":"accept_date", mLabel : '接收时间'},
                    {"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.search-interchange-receipt-list').docview_ui_dmstable({table_options : search_interchange_receipt_table_options});
			this.searchInterchangeReceiptController = this.element.find('.search-interchange-receipt-list').controller();

			var create_dishonored_bill_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/create_dishonored_bill/",
				aoColumns: [
					{"mDataProp":"org", mLabel : '关区'},
					//{"mDataProp":"db_date", mLabel : '日期'},
					{"mDataProp":"reason", mLabel : '原因'},
					{"mDataProp":"explain", mLabel : '备注'},
					{"mDataProp":"created_at", mLabel : '创建时间'},
					{"mDataProp": null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.create-dishonored-bill-list').docview_ui_dmstable({table_options : create_dishonored_bill_table_options});
			this.createDishonoredBillController = this.element.find('.create-dishonored-bill-list').controller();
			
			var search_dishonored_bill_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/search_dishonored_bill/",
				aoColumns: [
					{"mDataProp":"org", mLabel : '关区'},
					//{"mDataProp":"db_date", mLabel : '日期'},
					{"mDataProp":"reason", mLabel : '原因'},
					{"mDataProp":"explain", mLabel : '备注'},
					{"mDataProp":"created_at", mLabel : '创建时间'}
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			
			this.element.find('.search-dishonored-bill-list').docview_ui_dmstable({table_options : search_dishonored_bill_table_options});
			/*this.element.find('.search-dishonored-bill-list').docview_ui_pagingtable({
				columns: [
					{ 'id':'org' },
				],
				url: '',
				data: {}
			});
			*/
			this.searchDishonoredBillController = this.element.find('.search-dishonored-bill-list').controller();

			var statistical_inquiry_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/statistical_inquiry/",
				aoColumns: [
					{"mDataProp":"", mLabel : ''},
					{"mDataProp":"", mLabel : ''},
					{"mDataProp":"", mLabel : ''},
					{"mDataProp":"", mLabel : ''},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.statistical-inquiry-list').docview_ui_pagingtable({
				tmpl_path:'/docview/ui/businessprocess/views/statistical_inquiry/col_',
				columns:[
					{ id:'org',text:'关区' },
					{ id:'doc_type',text:'单证种类' },
					{ id:'package',text:'包' },
					{ id:'folder',text:'册' }
				]
			});
			this.statisticalInquiryController = this.element.find('.statistical-inquiry-list').controller();
			

			var org = this.options.clientState.attr('user').subjection_org;
			this.element.find('.search-dishonored-bill input[name=org]').val( org );
			this.element.find('.search-dishonored-bill input[name=org_text]').val( orgJsonDictionary[org] + "(" + org + ")" );
			
			$('input[readonly]').tooltip({ placement: 'right'  });
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "business_process") {	
				this.mainTabOn = true;
				this.element.show();
				$([
						"create_interchange_receipt",
						"search_interchange_receipt",
						"create_dishonored_bill",
						"search_dishonored_bill",
						"statistical_inquiry" 
				]).each(function(key,value){
					$('.' + value).hide();	
				});
				var subcategory = $.route.attr('subcategory');
				this.element.find('.' + subcategory).show('fast');
			} else {
				this.element.hide();
				this.mainTabOn = false;
			}
		},
		'{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
			if (!this.mainTabOn)return;
			var category = $.route.attr('category');
			var subcategory = $.route.attr('subcategory');
			newVal = subcategory;
			oldVal && this.element.find('.' + oldVal).hide();

			$('.' + oldVal).hide();
			$('.' + newVal).show('fast');
			//$('ul.nav-pills li').removeClass('active');
			//$('li a[href="#'+newVal+'"]').closest('li').addClass('active');
			switch(newVal){
				case 'create_interchange_receipt':
					$("#view-interchange-receipt form").submit();
				break;
				case 'search_interchange_receipt':
					$(".search-interchange-receipt form").submit();
				break;
				case 'search_dishonored_bill':
					$('.search-dishonored form').submit();
				break;
				case 'create_dishonored_bill':
					$('.search-dishonored form').submit();
				break;
			}    
        },
        addDataRow : function(data){
			var msg = "提交时发生错误,请重新尝试";
			var type = 'error';
			switch(data.status){
				case 200: 
					type =  'success';
					msg = "成功添加新交接单" ;
					var ir_date = $("#view-interchange-receipt input[name=date]");
					var date = ir_date.val();
					ir_date.val($.date(new Date).format('yyyy-MM-dd'));
					$("#view-interchange-receipt form").submit();
					ir_date.val(date);
					$.scrollTo($('.create-interchange-receipt-list')[0],1200);
					break;
				case 400:
					type = 'warn';
					msg = "开始理单号和结束理单号已经存在";
					break;
				case 401:
					type = 'warn';
					msg = "开始理单号不能大于结束理单号";
					break;
				case 403:
					type = 'error';
					msg = "理单份数不对";
					break;
				case 406:
					type = 'error';
					msg = "创建失败,交接单已经被接收";
					break;
				case 407:
					type = 'error';
					msg = "创建失败,同一关区，同一天内，同一种类只能填写一次，如需修改，请先删除再进行添加";
					break;

			}
        	this.options.clientState.attr('alert', {
            	type: type,
                heading: '交接单录入',
                message : msg 
            });
        //    $("#new-application").collapse("hide");
        },
        businessProcessList : function(data){
            var sub_cat = $.route.attr('subcategory');
            switch(sub_cat) {
                case "create_interchange_receipt":
                    this.createInterchangeReceiptController.setModelData(data.business_process);
                    break;
                case "search_interchange_receipt":
                    this.searchInterchangeReceiptController.setModelData(data.business_process);
                    break;
            }
        },
        irDestroyed: function(data) {
            this.lastEl.button('reset');    
            this.lastEl.closest('tr').remove();
			var ir_date = $("#view-interchange-receipt input[name=date]");
			var date = ir_date.val();
			ir_date.val($.date(new Date).format('yyyy-MM-dd'));
			$("#view-interchange-receipt form").submit();
			ir_date.val(date);
        },
        irDestroyFailed : function(jqXHR, textStatus, errorThrown) {
                var t = 'error';
                var h = '错误提示：';
                var message = '需要用户认证，请重新登录系统。';

                this.lastEl.button('reset');
                switch(jqXHR.status) {
                    case 401:
                        break;
                    case 404:
                        type = 'info';
                        message = '系统中没有相关角色';
                        break;
                    case 500:
                        message = '系统内部错误';
                        break;
                    case 403:
                        type = 'info';
                        message = '失败，权限不足。';
                        break;
                    case 400:
                        type = 'error';
                        message = '交接单不能被删除，系统有相应的用户。';
                        break;
                    default:
                        break;
                }
                this.options.clientState.attr('alert', {
                    type: t,
                    heading: h,
                    message : message
                });

                //log('system',{current_action:'manage_account.roles',describe:message});
                //$('#new-role-form .btn-primary').button('reset');
                //$('#new-role-form .cancel-create').button('reset');
                if (this.lastEl) {
                    this.lastEl.button('reset');
                }
        },
		showAlertMessage:function(msg){
			this.options.clientState.attr('alert',{ type:'warn',heading:'',message:msg });
		},
        "#new-interchange-receipt select[name=doc_type] change" : function(el,ev){
			ev.preventDefault();
			var doc_type = $(el).val();
			
			if (doc_type > 6) {
				$("input[name=doc_start]").attr("readOnly",true);
				$("input[name=doc_start]").val("");

				$("input[name=doc_end]").attr("readOnly",true);
				$("input[name=doc_end]").val("");
			}
		},
		'input.doc-group blur':function(el,ev){
			var tr = el.closest('tr');
			var begin	= tr.find('input[name=begin]');
			var end		= tr.find('input[name=end]');
			var package = tr.find('input[name=package]');
			var span	= tr.find('.verify-tips span');
			var icon	= tr.find('.verify-tips i');
			var doc_start = $.trim(begin.val()),doc_end = $.trim(end.val()),doc_package = $.trim(package.val());
				
			var showTips = function(flag){
				if(flag !== undefined && span.hasClass('label')){
					if(span.hasClass('label-success') && flag)return;
					if(span.hasClass('label-important') && !flag) return;
				}
				span.hide('fast',function(){
					span.removeClass('label').removeClass('label-success').removeClass('label-important');
					icon.removeClass('icon-ok').removeClass('icon-remove');
					if(flag == undefined)return;
					span.addClass('label').addClass('label-' + (flag ? 'success':'important'));
					icon.addClass('icon-' + (flag ? 'ok' : 'remove')).addClass('icon-white');
					span.show('slow');
				});
			}; 

			if(doc_start || doc_end || doc_package){
				if(doc_start && doc_end && doc_package){
					if(/\d+/.test(doc_start) && /\d+/.test(doc_end) && /\d+/.test(doc_package)){
						if(parseInt(doc_start) < parseInt(doc_end)){
							showTips(true);	
							return;
						}
					}
				}
				showTips(false);	
			}else{
				showTips();	
			}
		},
		/**
			create interchange receipt 
		*/
        "#new-interchange-receipt form submit" : function(el,ev){
            ev.preventDefault();

			var that = this;
            var sub_cat = $.route.attr('subcategory');

            var org = this.subjection_org;
			var data = [ ];
			for(var i=1;i<=9;i++){
				var tr = el.find('tr.doc-type-' + i );
			
				var begin	= tr.find('input[name=begin]');
				var end		= tr.find('input[name=end]');
				var package = tr.find('input[name=package]');
				
				var doc_type = i,doc_start = begin.val(),doc_end = end.val(),doc_package = package.val();
				if((doc_start && doc_end && doc_package) || ((i==7 || i==8 || i==9) && doc_package)){
					data.push({ 'doc_type': doc_type ,'doc_start':doc_start, 'doc_end': doc_end, 'package': doc_package });
				}
			}
			if(data.length < 1)return;
            Docview.Models.BusinessProcess.createBusinessProcess({type: sub_cat,datas : data},function(data){
				
				that.addDataRow(data);
				if(data.status == 200){
					el[0].reset();
					el.find("input").focus();
				}
			
			},function(err){
				$.alertMessage(that,{msg:'新申请表单添加失败 '});
			});
        },
		/**
			print interchange list in create interchange receipt page
		*/
		'#new-interchange-receipt .btn-print click':function(el,ev){
			ev.preventDefault();
			that = this;
			$.ajax({
				url : '/eir_business_process',
				type : 'post',
				data : {type: "print"},
				success : function(data){that.download(data);},
				error : "" 
			}); 
			//this.createInterchangeReceiptController.saveToExcel();
		},
		download : function(data){
			console.log(data);		
			window.location.href=data.text;
		},
		/**
			view interchange receipt in create interchange receipt page 
		*/
		'#view-interchange-receipt form submit':function(el,ev){
			ev.preventDefault();
            var org = el.find("input[name=subjection_org]").val();
            var date = el.find("input[name=date]").val();
            Docview.Models.BusinessProcess.findBusinessProcess({
				type: 'create_interchange_receipt',
				list: {org: org, ir_date: date}
			},this.proxy("businessProcessList"),{});
		},
		/**
			delete intercahnge receipt in create interchange receipt page
		*/
        ".delete-interchange-receipt click" : function(el,ev){
            ev.preventDefault();
            //$('#alerts div.alert').alert('close');
            if (confirm('是否删除此交接单')) {
				this.lastEl = el;
                var ir = this.createInterchangeReceiptController.getRowModelDataFor(el);
                ir.tr.model(ir.model);
				el.button('loading');
                Docview.Models.BusinessProcess.destroy(ir.model.id, this.proxy('irDestroyed'), this.proxy('irDestroyFailed'));
            }
        },
		/**
			search interchange receipt	
		*/
        ".search-interchange-receipt form submit" : function(el,ev){
            ev.preventDefault();
			var date = el.find('input[name=date]').val();
			Docview.Models.BusinessProcess.findAllBusinessProcess(
				{type: "create_ir",ir_date: date},
				this.proxy("businessProcessList"),
				{});
        },
		/**
			show interchange receipt detial and change status  ..
		*/
	    ".detial-row click" : function(el,ev){
			ev.preventDefault();
			var ir = this.searchInterchangeReceiptController.getRowModelDataFor(el);
			var rowElement = ir.tr;
			ir.tr.model(ir.model);
			Docview.Models.BusinessProcess.findOneBusinessProcess(
				{ type: "find_one",org: ir.model.org,ir_date: ir.model.ir_date },
				function(data){
					rowElement.hide();
					rowElement.after($.View('//docview/ui/businessprocess/views/search_interchange_receipt/detail_form.ejs',data));
					var innerForm = rowElement.next();					
					innerForm.find('.btn-cancel').click(function(ev){
						innerForm.remove();
						rowElement.show('slow');
					});
					innerForm.find('.btn-print').click(function(ev){
						ir.model.type = 'print';
						ir.model.date = $.date(ir.model.date).format('yyyy-MM-dd');
						$.ajax({
							url:'/eir_business_process',
							type:'POST',
							data: ir.model,
							dataType:'json',
							error:function(err){
								console.log('print error:',err);
							},
							success:function(data){
								window.location =  data.text;
							}
						});
					});

					innerForm.find('.btn-primary').click(function(ev){
						ev.preventDefault();
						var arr = [];
						 $.each(data.business_process,function(key,val){
							arr.push( val.id );
						});
						
						console.log(arr);
						$.ajax({
							url:'/eir_business_process',
							type:'POST',
							data: { type:'change_status', ids :arr },
							dataType:'json',
							error:function(err){
								console.log('print error:',err);
							},
							success:function(data){
								$('.search-interchange-receipt form').submit();
							}
						});
					});
				}, 
				function(err){
					console.log(err)
				});

		},
		/**
		Out of Date for this method , can be remove .
		*/
		showDetail : function(data){
            //$(".search-interchange-receipt-detail").html(this.view('//docview/ui/businessprocess/views/search_interchange_receipt/detail_form.ejs',data));
			//$(".search-interchange-receipt-list").hide();
			$(".show-detail").show();
			this.detailInterchangeReceiptController.setModelData(data.business_process);
			
		},
		showDetailFailed : function(data){},
        show : function() {
        
		},
		/**
			search dishonored
		*/
		search_dishonored_bill:function(data,success,error){
			var that = this;	
			$.ajax({
				url:'/eir_business_process',
				data:data,
				type:'POST',
				dataType:'json',
				error: error,
				success:function(data){
					that.createDishonoredBillController.setModelData(data);
					success.apply(this,data)
				}	
			});
		},
		/**
			search dishonored
		*/
		'.search-dishonored form submit':function(el,ev){
			ev.preventDefault();
			var that = this;
			var btn = el.find('button[type=submit]');	
			var org = el.find('select[name=org]').val();
			//var date = el.find('input[name=date]').val();
		
			var data = { 'type':'search_dishonored_bill', 'org':org /*, 'date':date*/ };
			
			btn.button('loading');	
			this.search_dishonored_bill(data,
			function(data){
				btn.button('reset');
			},
			function(err){
				btn.button('reset');
			});
		},
		/**
			create dishonored 
		*/
		'#new-dishonored form submit':function(el,ev){
			ev.preventDefault();
			
			var that = this;	
			var btn = el.find('button[type=submit]');	
			
			var org = el.find('select[name=org]').val();
			//var date = el.find('input[name=date]').val();
			var reason = el.find('select[name=reason]').val();
			var explain = el.find('input[name=explain]').val();
			if(explain == ''){
				this.options.clientState.attr('alert',{ type:'warn',heading:'',message:'备注信息不能为空' });
				return;
			}	
			var data = { 'type':'create_dishonored_bill','org':org,/* 'date':date,*/'reason':reason, 'explain':explain };
			btn.button('loading');
			$.ajax({
				url:'/eir_business_process',
				data: data,
				type:'POST',
				dataType:'json',
				error:function(err){
					btn.button('reset');
					that.options.clientState.attr('alert',{
							'type':'error',
							'heading': '创建退单',
							'message': '失败 ' + err
							});
				},
				success:function(data){
					btn.button('reset');
					el.find('input[name=explain]').val('');
					that.options.clientState.attr('alert',{
							'type':'info',
							'heading':'创建退单',
							'message':'成功'
							});
					that.search_dishonored_bill({'type':'search_dishonored_bill',org:''/* ,date: $.date(new Date).format('yyyy-MM-dd')*/},function(data){
						//el.closest('#new-dishonored').collapse('hide');
						$.scrollTo($('.create-dishonored-bill-list')[0],1200);
					},function(){});
				}
			});	
		},
		/**
		can be remove ..
		*/
		'#new-dishonored .btn-cancel click':function(el,ev){
			ev.preventDefault();
			el.closest('#new-dishonored').collapse('hide');
		},
		/**
			@category
			@subcategory: 退单录入
			@method 	: 删除退单
		*/
		'.create-dishonored-bill-list .btn-delete click':function(el,ev){
			ev.preventDefault();
			var that = this;
			var rowModel = this.createDishonoredBillController.getRowModelDataFor(el);
			var rowElement = rowModel.tr;
			var data = { 'type':'delete_dishonored_bill','id':rowModel.model.id  };
			$.ajax({
				url:'/eir_business_process',
				data: data,
				type: 'POST',
				dataType: 'json',
				error:function(err){
					that.options.clientState.attr('alert',{
							'type':'info',
							'heading':'删除退单',
							'message':'失败 ' + err
							});
					
				},
				success:function(){
					rowElement.hide('slow');
					rowElement.remove();
				}
			});
		},
		/**
			@category
			@subcategory: 退单录入
			@method 	: 查看退单
		*/
		'.search-dishonored-bill form submit':function(el,ev){
			ev.preventDefault();
			var that = this;
			var org = el.find('input[name=org]').val();
			var date = el.find('input[name=date]').val();
			var data = { 'type':'search_dishonored_bill', 'org':org };
			if(el.find('input[type=checkbox]').attr('checked')){
				data.date = date;
			}
			$.ajax({
				url:'/eir_business_process',
				data:data,
				type:'POST',
				dataType:'json',
				error: function(err){

				},
				success:function(data){
					that.searchDishonoredBillController.setModelData(data);
				}	
			});
		},
		'.statistical_inquiry form submit':function(el,ev){
			ev.preventDefault();
			var org = el.find('select[name=org]').val();
			var query_type = el.find('select[name=query_type]').val();
			var begin_date = el.find('input[name=begin_date]').val();
			var end_date = el.find('input[name=end_date]').val();
			
			var data = { type:'statistical_inquiry', 'org':org,'query_type':query_type,'begin_date':begin_date,'end_date':end_date  };


			console.log(data);
			this.statisticalInquiryController.reload({
				url:'/eir_business_process',
				type:'post',
				data:data
			});


		}
});
});

