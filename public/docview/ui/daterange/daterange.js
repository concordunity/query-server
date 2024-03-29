steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'libs/development-bundle/ui/jquery.ui.core.js',
    'libs/development-bundle/themes/base/jquery.ui.theme.css',
    'libs/development-bundle/themes/base/jquery.ui.base.css',
    'libs/development-bundle/themes/base/jquery.ui.datepicker.css'
//    'libs/development-bundle/ui/jquery.ui.datepicker.js'
).then(
    'libs/development-bundle/ui/jquery-ui-1.8.19.custom.js'
).then(
    'libs/development-bundle/ui/jquery.ui.datepicker.js'
).then(
    'libs/development-bundle/ui/i18n/jquery.ui.datepicker-zh-CN.js'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Daterange', {}, {

        init : function() {
	    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	    this.element.html(this.view('init', this.options.dateOptions));
            this.element.find('.input-date').datepicker({ dateFormat: "yy-mm-dd" });	    
	    //monthNames: ['一月','二月','三月','四月','五月','六月',
	    //'七月','八月','九月','十月','十一月','十二月'],
	    //dayNames: ['星期日','星期一','星期二','星期三','星期四',
	    //'星期五','星期六'],
	    //dayNamesMin: ['日','一','二','三','四','五','六']});		
	},
	show : function() {
        },
	displayInputError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
	getInputs : function(form) {
	    var from_date = this.element.find('input[name="from_date"]').val();
	    var to_date = this.element.find('input[name="to_date"]').val();

	    var f = this.element.find('input[name="from_date"]').datepicker('getDate');
	    var t = this.element.find('input[name="to_date"]').datepicker('getDate');
	    if (t.getTime() < f.getTime()) {
		this.displayInputError(form, "to_date", "起始日期不能大于终止日期。");
		return "";
	    }
	    var obj = new Object();

	    obj.from = from_date;
	    obj.to = to_date;
	    return obj;
	}
});
});
