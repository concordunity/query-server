steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/observe/delegate',
    'docview/ui/multi',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Docgroup.Newdg', {}, {

	init : function() {
	    this.element.html(this.view('init'));
	    this.success = this.options.create_group_ok;
	    this.element.find('div.multi_holder').docview_ui_multi();
	    if (this.options.preseed) {
		this.element.find('div.multi_holder').docview_ui_multi('setUIValue',
								    this.options.preseed);
	    }
	},
	'form.create_dg submit' : function(el, ev) {
            ev.preventDefault();
	    $('#alerts div.alert').alert('close');
	    var ctrl = this.element.find('div.multi_holder').controller();
	    var name = el.find('input[name="name"]').val();

	    if (name.replace(/\s/g,"") == "") {
		ctrl.displayInputError(el, 'name', '名称不能为空');
		return;
	    }

	    if (name.indexOf('/') != -1) {
	   	ctrl.displayInputError(el, 'name', '名称不能包含 / 字符');
		return;
	    }
	    if (ctrl.validateInput(el)) {
		Docview.Models.DocGroup.create(
		    { name : name,
                      doc_ids : ctrl.getIds()
		    },
		    this.proxy('newGroupOk'),
		    this.proxy('newGroupFailed'));
            }
	    window.scrollTo(0, 0);
	},
	newGroupOk: function(dg, response) {
	    var d_name = dg.doc_group.name;
	    var pos = d_name.indexOf('/');
	    if (pos != -1) {
		d_name = d_name.substring(0, pos);
	    }
	    this.options.clientState.attr('alert', {
		type: 'info',
		heading: '提示信息：',
		message : '成功创建单证组 ' + d_name
	    });	

	    if (this.success) {
		this.success(dg);
	    }
	},
	newGroupFailed : function(jqXHR, textStatus, errorThrown) {
	    var message = '系统错误代码' + jqXHR.status + ' ' + errorThrown;
	    switch (jqXHR.status) {
	    case 422:
		message = '单证组名称已存在。';
		break;
	    case 401:
		message = '登录超时或失效，需要用户认证，请重新登录系统';
		break;
	    case 403:
		message = '失败，权限不足。';
		break;
	    default:
	    }
	    this.options.clientState.attr('alert', {
		type: 'error',
		heading: '创建失败：',
		message : message
	    });	
	}
    });
});