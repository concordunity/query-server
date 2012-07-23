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
	    this.element.find('div.info-box').html(this.view("alert", { type: "success",
						     heading: "系统信息",
						     message: "成功保存系统参数" }));
	},
	setData : function(data) {
	    console.log(data);
	    this.element.find('input[name="maxn"]').val(data.maxn);
	    this.element.find('input[name="checkout_period"]').val(data.checkout_period);
	},
        show : function() {
        },
	'form.system-setting submit' : function(el,ev) {
	    ev.preventDefault();
	    Docview.Models.User.setSetting({},
					   this.proxy('setDataOk'), this.proxy('failure'));
	}
});
});

