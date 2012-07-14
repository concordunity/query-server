steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view')
.then('./views/init.ejs',
 	function($) {
		$.Controller('StockDocs.Content.ManageAccounts.ManageUsers', {
			pluginName : "manageAccountsUsers",
			listensTo : ['loadManageUsers']
		},
		/** @Prototype */
		{
			init : function() {
				save : '';
			},
			
			loadManageUsers : function() {
				// $("#dialogUserDetail").wijdialog('destroy');
				// $("#dialogUserDetail").remove();
				StockDocs.Models.User.findAll({}, this.callback('initView'), this.callback('listUsersError'));
			},
			
			initView : function(data) {
				this.element.html($.View('//stock_docs/modules/content/manageAccounts/manageUsers/views/init', {data : data}));
				
				// this.renderGrid();
				$("#tbUsers").wijgrid({
					allowSorting : true,
					allowPaging : true,
					pageSize : 10
					// columns : [{
						// visible : false
					// }, {
						// visible : false
					// }]

				});

				$('button').button();
				
				StockDocs.Models.Role.findAll({}, this.callback('initEditForm'), this.callback('listRolesError'));
			},
			
			initEditForm : function(roles) {
				$("#dialogUserDetail").html($.View('//stock_docs/modules/content/manageAccounts/manageUsers/views/edit', {roles : roles}));
				var self = this;
				$("#dialogUserDetail").wijdialog({
					autoOpen : false,
					resizable : true,
					width : 600,
					height : 400,
					modal : true,
					buttons : {
						"確定" : function() {
							var formParams = $('#fEditUser').formParams();
							if (self.options.save == 'create')	{
								delete formParams.id;
								StockDocs.Models.User.create(formParams, self.callback('addUserSuccess'), self.callback('addUserError'));
							} else if (self.options.save == 'update') {
								StockDocs.Models.User.update(formParams.id, formParams, self.callback('updateUserSuccess'), self.callback('updateUserError'));
							}
							$(this).wijdialog("close");
						},
						"取消" : function() {
							$(this).wijdialog("close");
						}
					}
				});
				$('#sRoleSelector').wijdropdown();
			},

			// 'a.user-list-item click' : function (el, ev) {
				// $('#dMsgBox').html('');
				// $('#dialogUserDetail').wijdialog('open');
// 				
				// $(":input[type='text'],:input[type='password'],textarea").wijtextbox();
				// $('#sRoleSelector').wijdropdown();
			// },
			
			'#btnCreateUser click' : function (el, ev) {
				$('#dMsgBox').html('');
				this.options.save = 'create';
				
				$('#iId').val('');
				$('#sRoleSelector').val('');
				$('#password').val('');
				$('#user').val('');
				
				this.renderEditForm();
			},
			'a.updateUser click' : function(el, ev) {
				$('#dMsgBox').html('');
				this.options.save = 'update';
				
				var userId = el.closest('div').find('span.user-id').text();
				var roleId = el.closest('div').find('span.role-id').text();
				var user = el.closest('div').find('span.user').text();
				
				$('#iId').val(userId);
				$('#sRoleSelector').val(roleId);
				$('#password').val('');
				$('#user').val(user);
				
				this.renderEditForm();
			},
			'a.deleteUser click' : function(el, ev) {
				if (!confirm('确定要删除该用户吗？')) {
					return false;
				}
				
				$('#dMsgBox').html('');
				
				var userId = el.closest('div').find('span.user-id').text();
				
				StockDocs.Models.User.destroy(userId, this.callback('deleteUserSuccess'), this.callback('deleteUserError'))
			},
			// setEditForm : function (data) {
// 				
			// },
			// findUserError ： function (data) {
				// // 
			// },
			renderEditForm : function() {
				$('#dialogUserDetail').wijdialog('open');
				$('#dialogUserDetail').wijdialog('refresh');
				
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
				$('#sRoleSelector').wijdropdown('refresh');
			},
			addUserSuccess : function(data) {
				var status = data.status;
				if (status == 200) {
					$('#dMsgBox').stock_docs_message_box({
						"messageType" : "success",
						"message" : "添加新用户成功。"
					}).trigger('loadMessageBox');
					this.loadManageUsers();
				} else {
					var emailError = data.email;
					var pwdError = data.password;
					var errorMsg = '';
					if (emailError) {
						errorMsg += ',用户名' + emailError;
					}
					if (pwdError) {
						errorMsg += ',密码' + pwdError;
					}
					
					if (errorMsg.length > 0) {
						errorMsg = errorMsg.substring(1);
					}
					
					$('#dMsgBox').stock_docs_message_box({
						"messageType" : 'warning',
						"message" : errorMsg
					}).trigger('loadMessageBox');
				}
			},
			addUserError : function(data) {
				var message;
				var messageType;
				if(data.status == 422) {
					message = data.responseText;
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			},
			deleteUserSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "删除用户成功。"
				}).trigger('loadMessageBox');
				this.loadManageUsers();
			},
			deleteUserError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '删除用户失败。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			},
			updateUserSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "更新用户成功。"
				}).trigger('loadMessageBox');
				this.loadManageUsers();
			},
			updateUserError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '更新用户失败。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			},
			listUsersSuccess : function(data) {
				// $('#dMsgBox').stock_docs_message_box({
					// "messageType" : "success",
					// "message" : "查找用户列表成功。"
				// }).trigger('loadMessageBox');
			},
			listUsersError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '查找用户列表失败。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			},
			listRolesError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '查找角色列表失败。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			}
		})
});
