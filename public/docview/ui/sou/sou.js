steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate'
).then(function($) {
    $.Controller('Docview.Ui.Sou', {}, {
	init: function(el, options) {
	    this.error_context = '';
	},
	
	closeAlert: function() {
	    $('#alerts div.alert').alert('close');
	},

	// Returns true if we have handled the error, in which case the
	// caller need not do anything further.
	handleCommonFailure: function(jqXHR, textStatus, errorThrown) {
	    var handled = true;
	    var t = 'error';
	    var h = '错误提示：';
	    var message = '需要用户认证，请重新登录系统。';
	    switch(jqXHR.status) {
	    case 401:
		break;
	    case 404:
		type = 'info';
		message = '系统中没有相关信息';// + this.error_context;
		break;
	    case 500:
		message = '系统内部错误';
		break;
	    case 403:
		type = 'info';
		message = this.error_context + '失败，权限不足。';
		break;
            case 400:
		message = '系统内部错误： 无法获取单证电子图像。';
		break;
	    default:
		handled = false;
	    }
	    if (handled) {
		this.options.clientState.attr('alert', {
		    type: t,
		    heading: h,
		  message : message
		});
	    }
	    return handled;
      }
    });
});		 
