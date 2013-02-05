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
    'docview/ui/daterange'
    ).then(function($) {
    $.Controller('Docview.Ui.search_condition', {}, {
        init : function() {

	    //$("#dictionary-tag").docview_ui_dictionary();
	    //var dicController =  $("#dictionary-tag").controller();
	    //var orgsDic = dicController.getDictionary("org");
	    var orgsDic = orgArrayDictionary;
            this.element.html(this.view('init',{orgsDic : orgsDic}));
            this.element.find('div.daterange-holder-2').docview_ui_daterange({
                dateOptions : {
                    labelString: ""
                }
            });
            this.setOrgVisible(false);
            this.setDateRangeVisible(false);
            $("#frm_docType_years_select").html(this.view("frm_docType_years",{}));
        },
        setOrgVisible : function(toShow) {
	    var el = $(".docview_ui_search_condition select[name='org']").closest('div.control-group');
            if (toShow) {
              el.show();
            } else {
              el.hide();
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
	".docview_ui_search_condition select[name='groupby'] change" : function(el,ev){
	    var el_value = $(el).attr("value");
	    if (el_value == 0 || el_value == 1) {
	        this.setOrgVisible(false);
	    } else {
	        this.setOrgVisible(true);
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

