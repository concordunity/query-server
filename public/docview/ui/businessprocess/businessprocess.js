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
    $.Controller('Docview.Ui.businessprocess', {}, {
        init : function() {
           //this.element.html(this.view('init'));
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
		   this.element.find("input[name=interchange-receipt-date]").my_datepicker();
		   this.element.find('div.lending-date').docview_ui_daterange({
				dateOptions : {
                        labelString: "日期"
                    }
			});

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
					{"mDataProp":"ir_status", mLabel : '状态'},
					{"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
				],
				aaSorting:[[0,"desc"]],
				file_name: ""
			};
			this.element.find('.create-interchange-receipt-list').docview_ui_dmstable({table_options : create_interchange_receipt_table_options});
			this.createInterchangeReceiptController = this.element.find('.create-interchange-receipt-list').controller();

			var search_interchange_receipt_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/search_interchange_receipt/",
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
			this.element.find('.search-interchange-receipt-list').docview_ui_dmstable({table_options : search_interchange_receipt_table_options});
			this.searchInterchangeReceiptController = this.element.find('.search-interchange-receipt-list').controller();

			var create_dishonored_bill_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/create_dishonored_bill/",
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
			this.element.find('.create-dishonored-bill-list').docview_ui_dmstable({table_options : create_dishonored_bill_table_options});
			this.createDishonoredBillController = this.element.find('.create-dishonored-bill-list').controller();

			var search_dishonored_bill_table_options = {
				aaData: [],
				col_def_path : "//docview/ui/businessprocess/views/search_dishonored_bill/",
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
			this.element.find('.search-dishonored-bill-list').docview_ui_dmstable({table_options : create_dishonored_bill_table_options});
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
			this.element.find('.statistical-inquiry-list').docview_ui_dmstable({table_options : statistical_inquiry_table_options});
			this.statisticalInquiryController = this.element.find('.statistical-inquiry-list').controller();
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
			console.log(newVal);
            if (newVal === "business_process") {	
				this.mainTabOn = true;
				this.reload();
			} else {
				this.element.hide();
			}
			// we need to reset filters
			//this.clearFilters();
		},
		'{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
			console.log(newVal);
			if (newVal == undefined) {
				return;
			}
			if (this.mainTabOn) {
				if (oldVal !== undefined) {
					this.element.find('.' + oldVal).hide();
				}
			    
				var category = $.route.attr('category');
				if (category !== undefined && category === "business_process") {
		//			this.element.find('div.requisition-list').docview_ui_dmstable();
					if (newVal != 'single') {
						console.log("I don't know where is this action from");
							this.reshow();
							if (newVal == "lending_statistics"){	
									
							}else if (newVal == "application"){	

							}else{
							//	Docview.Models.Requisition.findRequisition({type: newVal},this.proxy(""),{});
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
		reshow : function() {
			this.element.show();
			var sub_cat = $.route.attr('subcategory');
			var to_show = sub_cat;

			if (!sub_cat) {
					to_show = this.element.find("form")[0].className;
			}
			this.element.find('.' + to_show).show();
			var to_show_class = ["create_interchange_receipt", "search_interchange_receipt","create_dishonored_bill","search_dishonored_bill","statistical_inquiry"];
			$.each(to_show_class,function(index,value){
				if (to_show != value) {
					$("."+value).hide();
				}
			});
		},
		reload : function(){
			this.reshow();
			var sub_cat = $.route.attr('subcategory');
			if (sub_cat != "application"){
				//Docview.Models.Requisition.findRequisition({type: sub_cat},this.proxy("requisitionList"),{});
			}
		},
        show : function() {
        
		},
		'.search-dishonored form submit':function(el,ev){
			ev.preventDefault();
			var btn = el.find('button[type=submit]');	
			var org = el.find('select[name=org]').val();
			var date = el.find('input[name=date]').val();
		
			var data = { 'type':'search_dishonored_bill', 'org':org, 'date':date };
			
			btn.button('loading');	
			
			$.ajax({
				url:'/eir_business_process',
				data:data,
				type:'POST',
				dataType:'json',
				error:function(err){
					console.log(err);
					btn.button('reset');
				},
				success:function(data){
					console.log(data);
					btn.button('reset');
				}	
			});
		},
		'#new-dishonored form submit':function(el,ev){
			ev.preventDefault();
			
			var btn = el.find('button[type=submit]');	
			
			var org = el.find('select[name=org]').val();
			var date = el.find('input[name=date]').val();
			var reason = el.find('select[name=reason]').val();
			var explain = el.find('input[name=explain]').val();
			var data = { 'type':'create_dishonored_bill','org':org, 'date':date,'reason':reason, 'explain':explain };
			console.log(data)	
			btn.button('loading');
			
			$.ajax({
				url:'/eir_business_process',
				data: data,
				type:'POST',
				dataType:'json',
				error:function(err){
					btn.button('reset');
					console.log(err);
				},
				success:function(data){
					btn.button('reset');
					console.log(data);
				}
			});	
		},
		'#new-dishonored .btn-cancel click':function(el,ev){
			ev.preventDefault();
			el.closest('#new-dishonored').collapse('hide');
		}
});
});

