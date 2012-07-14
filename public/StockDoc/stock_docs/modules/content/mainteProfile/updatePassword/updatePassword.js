steal('jquery/controller', 'jquery/view/ejs', 'jquery/dom/form_params', 'jquery/controller/view')
.then('./views/init.ejs', function($) {
	$.Controller('StockDocs.Content.MainteProfile.UpdatePassword', {
		pluginName : "updatePassword",
		listensTo : ['loadUpdatePassword']
	},
	/** @Prototype */
	{
		init : function() {

		},
		loadUpdatePassword : function() {
			this.element.html($.View('//stock_docs/modules/content/mainteProfile/updatePassword/views/init'));

			$(":input[type='text']:not(.input-date),:input[type='password'],textarea").wijtextbox();
			$('#btnSave').button();
		},
		'#btnSave click' : function(el, ev) {
			$('#dMsgBox').html('');

			var pwd = $('#password').val();
			var pwd_cfm = $('#password_confirm').val();

			if(pwd != pwd_cfm) {
				alert('两次输入的密码不一致。');
				return false;
			}

			StockDocs.Models.Profile.changePassword({
				'password' : pwd
			}, this.callback('savePasswordSuccess'), this.callback('savePasswordError'));
		},
		savePasswordSuccess : function(data) {
			// $('#dMsgBox').stock_docs_message_box({
				// "messageType" : 'success',
				// "message" : '修改新密码成功。'
			// }).trigger('loadMessageBox');
			alert('密码修改成功，您需要重新登录。');
			StockDocs.Models.Login.logout({}, this.callback('toLoginPage'));
		},
		toLoginPage : function() {
			sessionStorage.clear();
			window.location = "login.html";
		},
		savePasswordError : function(data) {
			$('#dMsgBox').stock_docs_message_box({
				"messageType" : 'warning',
				"message" : '密码' + data.responseText
			}).trigger('loadMessageBox');
		}
	})
});
