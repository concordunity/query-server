steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/syssetting',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs')
.then(function($) {
  $.Controller('Docview.Settings', {},
  {
      init: function() {
	  this.element.html(this.view('init'));
	  this.element.hide();

	  this.sys_controller = undefined;
	  if (this.options.clientState.attr('access').attr('sys-setting')) {
	      this.element.find('div.system-setting').docview_ui_syssetting();
	      this.sys_controller = this.element.find('div.system-setting').controller();
	  }
      },
      displayFormError: function(form, name, message) {
          var inputField = form.find('input[name="' + name + '"]');
          inputField.closest('.control-group').addClass('error');
          inputField.after('<span class="help-inline">' + message + '</span>');
      },
      'form.update-password submit' : function(el, ev) {
	  ev.preventDefault();
	  var pwd = el.find('input[name="password"]').val();
	  var pwd_cfm = el.find('input[name="password-confirm"]').val();
	  if (pwd.length < 6) {
	      this.displayFormError(el, 'password', '密码须至少6位字符。');
	  } else if (pwd != pwd_cfm) {
	      this.displayFormError(el, 'password-confirm', '两次输入的密码不一致。');
	      return false;
	  }
	  Docview.Models.User.changePassword(
	      {	'password' : pwd },
	      this.proxy('savePasswordSuccess'),
	      this.callback('savePasswordError'));
      },
      savePasswordSuccess : function(data) {
	  alert('密码修改成功，您需要重新登录。');
	  Docview.Models.User.logout(this.proxy('toLoginPage'));
      },
      toLoginPage : function() {
	  sessionStorage.clear();
	  window.location = "docview.html";
      },
      savePasswordError : function(data) {
	  $('#dMsgBox').stock_docs_message_box({
	      "messageType" : 'warning',
	      "message" : '密码' + data.responseText
			}).trigger('loadMessageBox');
      },
      '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
          if (newVal === "settings") {
	      
	      this.element.show();
	      if (this.sys_controller) {
		  this.sys_controller.loadData();
	      }
	      $.route.attr('subcategory', 'password');
	  } else {
	      this.element.hide();
	  }
      }
    });
});