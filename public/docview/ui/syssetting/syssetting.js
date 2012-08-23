steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/models'
    ).then(
    'docview/bootstrap/bootstrap-alert.js',
    './views/init.ejs',
    'docview/bootstrap/bootstrap.css'
    ).then(function($) {
    $.Controller('Docview.Ui.Syssetting', {}, {
        init : function() {
            this.element.html(this.view('init'));
            //$('.alert').alert();
            $('.alert').alert('close');
        },

        loadData : function() {
            Docview.Models.User.getSetting(this.proxy('setData'), this.proxy('failure'));
        },
        failure : function(a, b, c) {
        },
        setDataOk : function(data) {
            this.element.find('div.info-box').html(this.view("alert", {
                type: "success",
                heading: "系统信息",
                message: "成功保存系统参数"
            }));
        },
        setData : function(data) {
            //console.log(data);
            this.element.find('input[name="maxn"]').val(data.maxn);
            this.element.find('input[name="checkout_period"]').val(data.checkout_period);
            this.element.find('input[name="max_queries_per_month"]').val(data.max_queries_per_month);
        },
        show : function() {
        },
        'form.system-setting submit' : function(el,ev) {
            this.removeFormErrors(el);
            var form_tag = $(el).closest('.system-setting');
            ev.preventDefault();

	    var that = this;
            $.each(this.element.find("input.number"),function(index,value){
                var el_text = $(value);
                var docId = el_text.attr("value");
     
                if (!/^\d+$/.test(docId)) {
                    that.displayInputError(el, el_text, "只能是数字");
                  return false;
                }
            });
	    
            Docview.Models.User.setSetting(
		{maxn : el.find('input[name="maxn"]').val(),
		 checkout_period : el.find('input[name="checkout_period"]').val(),
		 max_queries_per_month : el.find('input[name="max_queries_per_month"]').val()},
		this.proxy('setDataOk'),
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

