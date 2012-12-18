steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'libs/jquery.print.js',
    './views/init.ejs',
    './print_model.js'
).then(
    'docview/ui/multi',
    './fixtrues.js'
).then(function($) {
    $.Controller('Docview.Ui.print', {}, {
        init : function() {
	   new LabelChinese().initLabelSettings();
	
           this.element.html(this.view('init'));
           //$(".all_print").html(this.view('init'));
	   $('div.print_holder').docview_ui_multi();
	   this.element.hide();
        },
        show : function() {
	   console.log("====");
	   this.element.show();
        },
	printAll : function(data) {
	    console.log("will print doc_ids is ",data);
	},
	showList : function(data) {
	    $('div.print-list').html(this.view('list',data));
	},
	'.print.btn click':function(el){
		var checkedFiles =  $(el).parent().find('input[type=checkbox]:checked');
		var basePath = 'http://static.lsong.org/';
		var files = [];
		$(checkedFiles).each(function(i,item){
			files.push(basePath + item.value);
		});
		//print files ..
		$.print(files);
	},
        failure: function(jqXHR, textStatus, errorThrown) {
            var t = 'error';
            var h = '错误提示：';
            var message = '需要用户认证，请重新登录系统。';
            var docid = $.route.attr('id');

            if (jqXHR.status == 404) {
                type = 'info';
                message = '系统中没有单证' + docid + '档案信息';
            } else if (jqXHR.status == 204) {
                type = 'info';
                message = '单证标签种类失败';
            } else if (jqXHR.status == 403) {
                type = 'info';
                message = '无法查阅单证'+ docid + '，权限不足。';
            } else if (jqXHR.status == 500) {
                message = '系统内部错误';
            } else if (jqXHR.status == 407) {
                message = '系统安全子系统未初始化，请联系管理员。';
            } else if (jqXHR.status == 400) {
                message = '系统内部错误： 无法获取单证电子图像。';
            } else if (jqXHR.status == 401) {
                message = '系统内部错误： 系统繁忙，请稍后再试。';
            }
            this.options.clientState.attr('alert', {
                type: t,
                heading: h,
                message : message
            });
        //console.log("[Error]", data);
        }

});
});

