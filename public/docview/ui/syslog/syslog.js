steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css',
    'docview/ui/daterange',
    'docview/ui/single',
    'docview/docgroup/dgselect',
    'docview/ui/dmstable',  
	'libs/org_arr.js'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Syslog', {}, {
        init : function() {
			this.element.html(this.view('init'));
			this.element.find(".single_sou_holder").docview_ui_single({no_help:true});
			this.element.find(".dg_select_holder").docview_docgroup_dgselect();
			//this.element.find(".dg_select_holder").docview_docgroup_dgselect({clientState:state});
			this.element.find("div.daterange-holder").docview_ui_daterange({
				dateOptions:{labelString:"日期"}
			});		


            var table_options = {
                aaData: [],
				col_def_path : "//docview/ui/syslog/views/",
                aoColumns: [
						{"mDataProp":"role_name", mLabel : '角色'},
						{"mDataProp":"email", mLabel : '全名'},
						{"mDataProp":"action", mLabel : '动作'},
						{"mDataProp":"created_at", mLabel : '创建日期'},
						{"mDataProp":"describe", mLabel : '描述'}
	            ],
                file_name: ""
            };
            this.element.find('#log_show_tables').docview_ui_dmstable({table_options : table_options});
            this.tableController = this.element.find('#log_show_tables').controller();
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
            var cat = $.route.attr('category');
            var sub_cat = $.route.attr('subcategory');
            if (cat == 'stats' && sub_cat == 'stats_query') {
                this.element.show();
            } else  {
                this.element.hide();
            }
        },
	    setData : function(data){
			console.log(data);
			this.tableController.setModelData(data.results);
		},
        show : function() {
        },
		'form.stats_query submit':function(el,ev){
				ev.preventDefault();
				var params = {};
                var ctrl = el.find('.single_sou_holder').controller();
                if (!ctrl.validateInputOrEmpty(el)) {
                    return;
                }
                var doc_id = ctrl.getId();
				var url = el.find("select[name=log_type]").val();
                var username = el.find('input[name="username"]').val();
                var rolename = el.find('input[name="rolename"]').val();
                var gid = el.find('select[name="gid"]').val();
                var doc_type = el.find('select[name="doc_type"]').val();
                var org = el.find('select[name="org"]').val();
                var cntrl = this.element.find('div.daterange-holder').controller();
				var dates = cntrl.getInputs(el);
                if (!!!dates) {
                    return;
                }
                var from_date = dates.from;
                var to_date = dates.to;
				var formdata = {url: url, doc_id: gid, org: org, rolename: rolename, username: username, from_date: from_date, to_date: to_date};
				Docview.Models.History.findLog(formdata,this.proxy("setData"),{});
			}
			/**
				//负责在系统日志模式下禁用 报关单号和理单关区
			
			'select[name=log_type] change':function(el,ev){
				var log_type = el.val();
				//console.log(log_type);
				var form = el.closest('form');
				var query = form.find('input[name=query]');
				var org = 	form.find('select[name=org]');
				switch(log_type){
					case 'system':
						query.attr('disabled','disabled');
						org.attr('disabled','disabled');
						break;
					default:	
						query.attr('disabled',null);
						org.attr('disabled',null);
						break;
				}
			}*/
});
});

