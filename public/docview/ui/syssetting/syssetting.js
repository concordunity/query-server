steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/models'
).then(
    'docview/bootstrap/bootstrap.min.js',
    './views/init.ejs',
    'docview/bootstrap/bootstrap.css'
).then(function($) {
    $.Controller('Docview.Ui.Syssetting', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    this.element.hide();
        },

        loadData : function() {
            Docview.Models.User.getSetting(this.proxy('setData'), this.proxy('failure'));
        },
        failure : function(savedData) {
			
			log('system',{current_action:'manage_accont.sys-setting',describe:'系统参数保存失败'},savedData);
        },
        setDataOk : function(data) {
            this.element.find('div.info-box').html(this.view("alert", {
                type: "success",
                heading: "系统信息",
                message: "成功保存系统参数"
            }));
			log('system',{current_action:'manage_account.sys-setting',describe:'成功保存系统参数'});
        },
        setData : function(data) {
            //console.log(data);
            this.element.find('input[name="maxn"]').val(data.maxn);
            this.element.find('input[name="checkout_period"]').val(data.checkout_period);
            this.element.find('input[name="max_queries_per_month"]').val(data.max_queries_per_month);
            this.element.find('input[name="timeout_value"]').val(data.timeout_value);
        },
        show : function() {
        },
        'form.system-setting submit' : function(el,ev) {
            ev.preventDefault();
            this.removeFormErrors(el);

	    $('.alert').alert('close');
            var form_tag = $(el).closest('.system-setting');


	    var that = this;
	    var hasError = false;
            $.each(this.element.find("input.number"),function(index,value){
                var el_text = $(value);
                var docId = el_text.attr("value");
     
                if (!/^\d+$/.test(docId)) {
                    that.displayInputError(el, el_text, "只能是数字");
		    hasError = true;
                    return false;
                }
            });
	    if (hasError) {
		return false;
	    }
	    var maxn = el.find('input[name="maxn"]').val();
	    var period = el.find('input[name="checkout_period"]').val();
	    var max_queries = el.find('input[name="max_queries_per_month"]').val();
	    var timeout_value = el.find('input[name="timeout_value"]').val();

	    var maxn_i = parseInt(maxn);
	    var period_i = parseInt(period);
	    var max_queries_i = parseInt(max_queries);

	    if (maxn_i < 10 || maxn_i > 200) {
		this.displayInputError(el, el.find('input[name="maxn"]'), "最大抽样数目必须在 10 和 200之间。");
		return false;
	    }

	    if (period_i < 5 || period_i > 60) {
		this.displayInputError(el, el.find('input[name="checkout_period"]'), "单证借阅期限必须在 5 和 60 之间");
		return false;
	    }

	    if (max_queries_i < 50 || max_queries_i > 2000) {
		this.displayInputError(el, el.find('input[name="max_queries_per_month"]'), "每月查阅总数警戒线必须在 50 和 2000 之间。");
		return false;
	    }

	    if (timeout_value < 600 || timeout_value > 1800) {
		this.displayInputError(el, el.find('input[name="timeout_value"]'), "系统超时设置参数必须在 600 和 1800 之间。");
		return false;
	    }

            Docview.Models.User.setSetting(
		{maxn : maxn,
		 checkout_period : period,
		 timeout_value : timeout_value,
		 max_queries_per_month : max_queries},
		this.proxy('setDataOk',{ check_period : period,timeout_value : timeout_value,max_queries_per_month : max_queries }),
		this.proxy('failure'));
        },
        displayInputError: function(form, inputField, message) {
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
        removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
            form.find('.error').removeClass('error');
        }
    });
});

