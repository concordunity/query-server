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

            $('.alert').alert();
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
        },
        show : function() {
        },
        'form.system-setting submit' : function(el,ev) {
            this.removeFormErrors(el);
            var form_tag = $(el).closest('.system-setting');
            ev.preventDefault();
            var docId = $.trim(el.find('.query').val());
            $.each(this.element.find("input.number"),function(index,value){
                var el_text = $(value);
                var docId = el_text.attr("value");
     
                if (!/^\d+$/.test(docId)) {
                  this.displayInputError(el,el_text.attr("name"),"只能是数字");
                  //el_text.closest('.control-group').addClass('error');
                  //el_text.after('<span class="help-inline"> test</span>');

                  return false;
                }
            });

            if(false){
                
                ev.preventDefault();
                Docview.Models.User.setSetting({},
                    this.proxy('setDataOk'), this.proxy('failure'));
            }
        },
        displayInputError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
        removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
            form.find('.error').removeClass('error');
        }
    });
});

