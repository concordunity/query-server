steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view',
	'./manageRoles.css')
.then('./views/init.ejs', 
 	function($) {
		$.Controller('StockDocs.Content.ManageAccounts.ManageRoles', {
			pluginName : "manageAccountsRoles",
			listensTo : ['loadManageRoles']
		},
		/** @Prototype */
		{
			init : function() {
				
			},
			loadManageRoles : function() {
				StockDocs.Models.Role.findAll({}, this.callback('initView'), this.callback('listRolesError'));
			},
			initView : function(roles) {
				$('#dMsgBox').html('');
				this.element.html($.View('//stock_docs/modules/content/manageAccounts/manageRoles/views/init', {roles : roles}));
				// this.renderGrid();
				$('div.expander').wijexpander();
				$('#sRoleSelector').wijdropdown();
				$(":input[type='text'],:input[type='password'],textarea").wijtextbox();
				$("button").button();
				
				$('#sRoleSelector').trigger('change');
			},
			'#sRoleSelector change' : function(el, ev) {
				$('#dMsgBox').html('');
				StockDocs.Models.Role.findOne({'id' : el.val()}, this.callback('showPermissions'));
			},
			showPermissions : function(permissions) {
				var $permissionItems = $('#fPermission :checkbox:enabled');
				$.each( $permissionItems, function() {
					$(this).removeAttr('checked');
				});
				
				$.each( permissions, function(index, value) {
					$('input[name=' + value.name + ']').attr('checked', 'checked');
				});
			},
			'#btnCreateRole click' : function(el ,ev) {
				$('#dMsgBox').html('');
				var roleName = $('#iRoleName').val();
				if (!roleName) {
					alert('请您输入新增角色的名称。');
					return;
				}
				
				var formParams = $('form#fPermission').formParams();
				var jsonObject = new Object();
				jsonObject.roleName = roleName;
				
				var rolePermissions = new Array();
				$.each(formParams, function(key, value) {
					if (value) {
						rolePermissions.push(key);
					}
				});
				jsonObject.rolePermissions = rolePermissions;
				
				StockDocs.Models.Role.create(jsonObject, this.callback('addRoleSuccess'), this.callback('addRoleError'));
			},
			'#btnUpdateRole click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#sRoleSelector').val();
				
				var formParams = $('form#fPermission').formParams();
				var jsonObject = new Object();
				
				var rolePermissions = new Array();
				$.each(formParams, function(key, value) {
					if (value) {
						rolePermissions.push(key);
					}
				});
				jsonObject.rolePermissions = rolePermissions;
				
				StockDocs.Models.Role.update(id, jsonObject, this.callback('updateRoleSuccess'), this.callback('updateRoleError'));
			},
			'#btnDeleteRole click' : function(el, ev) {
				$('#dMsgBox').html('');
				var id = $('#sRoleSelector').val();
				
				StockDocs.Models.Role.destroy(id , this.callback('deleteRoleSuccess'), this.callback('deleteRoleError'));
			},
			addRoleSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "添加新角色成功。"
				}).trigger('loadMessageBox');
				this.element.trigger('loadManageRoles');
			},
			addRoleError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '添加新角色失败。';
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
			deleteRoleSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "删除角色成功。"
				}).trigger('loadMessageBox');
				this.element.trigger('loadManageRoles');
			},
			deleteRoleError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '删除角色失败。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				} else {
					message = '删除角色失败，系统中有用户与该角色关联。';
					messageType = 'warning';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
			},
			updateRoleSuccess : function(data) {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "success",
					"message" : "更新角色成功。"
				}).trigger('loadMessageBox');
				this.element.trigger('loadManageRoles');
			},
			updateRoleError : function(data) {
				var message;
				var messageType;
				if(data.status == 404) {
					message = '更新角色失败。';
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
			listRolesSuccess : function(data) {
				// $('#dMsgBox').stock_docs_message_box({
					// "messageType" : "success",
					// "message" : "查找角色列表成功。"
				// }).trigger('loadMessageBox');
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
