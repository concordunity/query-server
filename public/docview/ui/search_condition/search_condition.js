steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
    ).then(
    'docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'
    ).then(
    './views/init.ejs',
    'docview/ui/dictionary',
    'libs/org_arr.js',
    'libs/org_info_arr.js',
    'docview/ui/daterange'
    ).then(function($) {
    $.Controller('Docview.Ui.search_condition', {}, {
        init : function() {

	    //$("#dictionary-tag").docview_ui_dictionary();
	    //var dicController =  $("#dictionary-tag").controller();
	    //var orgsDic = dicController.getDictionary("org");
	    var orgsDic = orgArrayDictionary;
	    var orgInfoDic = org_infoArrayDictionary;
			
			this.element.html(this.view('init',{orgsDic : orgsDic, orgInfoDic: orgInfoDic}));
			this.element.find('div.daterange-holder-2').docview_ui_daterange({ dateOptions : { labelString: "" } });

	    var user = this.options.clientState.attr('user');
	    var orgs = user.group_org_infos.org;
	    var subjection_orgs = user.group_org_infos.subjection_org;

	    var dic_org = [];
	    for(var i=0;i<orgInfoDic.length;i++){
		var org = orgInfoDic[i];
		for(var j=0;j<orgs.length;j++){
		    if (orgs[j] == org.dic_name){
			dic_org.push(org);
			break;
		    }
		}
	    } 
	    if (orgs == "2200"){dic_org = orgInfoDic;} 

	    var dic_subjection_org = [];
			for(var i=0;i<orgsDic.length;i++){
				var org = orgsDic[i];
				for(var j=0;j<subjection_orgs.length;j++){
		    	if (subjection_orgs[j] == org.dic_num){
						dic_subjection_org.push(org);
						break;
		      }
				}
	    } 
	    if (subjection_orgs == "2200"){dic_subjection_org = orgsDic;} 

	    
	    this.element.find('div.org-container').html(this.view('//docview/ui/views/org.ejs', { label: '关区', name : 'org_info', orgsDic : dic_org}));
	    this.element.find('div.subjection-org-container').html(this.view('//docview/ui/views/org.ejs', { label: '业务点', name : 'org', orgsDic : dic_subjection_org}));

	    this.setHideLabel("init");
	    this.setDateRangeVisible(false);
            $("#frm_docType_years_select").html(this.view("frm_docType_years",{}));
        },
	setHideLabel : function(tag){
            this.setCheckOrgVisible(false);
	    //var el = $(".docview_ui_search_condition select[name='org']").closest('div.control-group');
	    //var org_info  = $(".docview_ui_search_condition select[name='org_info']").closest('div.control-group');
	    var el = $(".docview_ui_search_condition select[name='org']").closest('div.subjection-org-container');
	    var org_info  = $(".docview_ui_search_condition select[name='org_info']").closest('div.org-container');
	    if (tag == false){
		el.hide();
		org_info.show();
	    } else if (tag == true){
	    	el.show();
		org_info.hide();
	    } else {
	    	el.hide();
		org_info.hide();
	    }
	},
        setOrgVisible : function(toShow) {
	    //var el = $(".docview_ui_search_condition select[name='org']").closest('div.control-group');
	    //var org_info  = $(".docview_ui_search_condition select[name='org_info']").closest('div.control-group');
	    var el = $(".docview_ui_search_condition select[name='org']").closest('div.subjection-org-container');
	    var org_info  = $(".docview_ui_search_condition select[name='org_info']").closest('div.org-container');
	    el.hide();
	    org_info.hide();
            if (toShow) {
              el.show();
	      org_info.hide();
            } else if(toShow == false){
              el.hide();
	      org_info.show();
	    }else{
              el.hide();
	      org_info.hide();
            }
        },
        setDateRangeVisible : function(toShow) {
	    var el = $(".docview_ui_search_condition .daterange-holder-2");
            if (toShow) {
              el.show();
            } else {
              el.hide();
            }
        },
	setCheckOrgVisible : function(toShow) {
	    var el = $(".docview_ui_search_condition div.check_org");
            if (toShow) {
	      var cov = $(".docview_ui_search_condition div.check_org input[name='check_org']:checked").val(); 
	      if (cov == 0){
		      this.setHideLabel(false);
	      }else if (cov == 1){
		      this.setHideLabel(true);
	      } else{
		      this.setHideLabel("init");
	      }
              el.show();
            } else {
              el.hide();
            }

        },
	".docview_ui_search_condition select[name='groupby'] change" : function(el,ev){
	    var el_value = $(el).attr("value");
	    if (el_value == 0 || el_value == 1 || el_value == 5 || el_value == 4) {
	        this.setCheckOrgVisible(false);
		this.setHideLabel("init");
	    } else {
	        this.setCheckOrgVisible(true);
	    }
	},
	"input[name='check_org'] click" : function(el,ev){
		var org_value = $(el).attr("value");
		if(org_value == 0){
		    this.setOrgVisible(false); 
		}else if(org_value == 1){
		    this.setOrgVisible(true); 
		}else{
		    this.setOrgVisible(); 
		}

	},
	"input[name='timerange'] click" : function(el,ev){
		var timerange_value = $(el).attr("value");
		if(timerange_value == 0){
		    this.setDateRangeVisible(false); 
		}else{
		    this.setDateRangeVisible(true); 
		}

	},
/*
        'form.stats_stats submit' : function(el, ev) {
            ev.preventDefault();
            //this.removeFormErrors(el);
            var cntrl = this.element.find('div.daterange-holder-2').controller();
            var dates = cntrl.getInputs(el);
            //console.log(dates);
            if (dates === "") {
                return;
            }
            var from_date = dates.from;
            var to_date = dates.to;

            var r = el.find('input[name="timerange"]:checked').val();
            //console.log(r);
            if (r == 0) {
                from_date = "";
                to_date = "";
            }
            var select_hash = {};
            
            var org = el.find("select[name=org]").val();
            var doc_type = el.find("select[name=doc_type]").val();
            var years = el.find("select[name=years]").val();
            //console.log(org);
            //console.log(doc_type);
            //console.log(years);

            select_hash = {
                org:org,
                doc_type:doc_type,
                years:years
            };
            //console.log(select_hash);
            
            $.ajax({
                url : '/document_histories/dh_report',
                type : 'post',
                data : {
                    from_date : from_date,
                    to_date : to_date,
                    groupby : el.find('select[name="groupby"]').val(),
                    condition_value : select_hash
                },
                dataType : 'json',
                success : "",//this.proxy('show_stats'),
                error : ""//this.proxy('failure')
            });
        },
*/
        submit : function(){

        },
        show_stats :function (data) {
            var dmstable_params = "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";
            if (this.element.find('select[name="groupby"]').val() == '4') {

                dmstable_params = "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";
                this.element.find('div.stats_stats').html(this.view('stats_ty_month_init'));
                this.element.find('div.stats_total_list').html(this.view('stats_by_month', data));
                this.search_result = data;
            //this.element.find('div.stats_stats').html(this.view('stats_by_month', data));
            } else {
                this.element.find('div.stats_stats').html(this.view('stats_total', data));
            }
            this.element.find('div.stats_stats table').dataTable({
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
                    "sUrl" : "media/language/ch_ZN.txt"
                }
            });

        },
        failure : function(jqXHR, textStatus, errorThrown) {
            var handled = true;
            var t = 'error';
            var h = '错误提示：';
            var message = '需要用户认证，请重新登录系统。';

            switch(jqXHR.status) {
                case 401:
                    break;
                case 404:
                    type = 'info';
                    message = '系统中没有相关单证' + this.error_context;
                    break;
                case 500:
                    message = '系统内部错误';
                    break;
                case 403:
                    type = 'info';
                    message = this.error_context + '失败，权限不足。';
                    break;
                default:
                    break;
            }
            this.options.clientState.attr('alert', {
                type: t,
                heading: h,
                message : message
            });
        }
    });
});

