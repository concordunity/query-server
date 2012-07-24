steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',    
    'docview/manage/accounts/roles/edit',
    'docview/ui/dmstable',
    'docview/bootstrap/bootstrap.css'
    )

// View templates
.then(
    './views/init.ejs',
    './views/roles_table.ejs',
    './views/role_row.ejs',
    './views/edit_role.ejs',
    './views/new_role.ejs'
    )

// External JS
.then(
    'docview/bootstrap/bootstrap-button.js',
    'docview/bootstrap/bootstrap-collapse.js',
    'docview/bootstrap/bootstrap-alert.js'
    )

.then(function($) {

    /*
    * Manage user accounts and roles
    */
    $.Controller('Docview.Manage.Accounts.Roles',
    /* @Static */
    {
        },
        /* @Prototype */
        {
            init: function() {
                this.element.html(this.view('init'));
                this.lastEl = undefined;

                var table_options = {
                    aaData: [],

                    col_def_path : "//docview/manage/accounts/roles/views/",
                    aoColumns: [
                    {
                        "mDataProp":"name",
                        mLabel : '角色名'
                    },

                    {
                        "mDataProp":"display_name",
                        mLabel : '权限设置'
                    },
                    {
                        "mDataProp":null,
                        mLabel : '操作'
                    }
                    ],
                    file_name: "role_info"
                };
                this.element.find('.role-list').docview_ui_dmstable({
                    table_options : table_options
                });
                this.tableController = this.element.find('.role-list').controller();
                // By default we're hidden until the route conditions are met
                this.element.hide();
                this.mainTabOn = false;
            },

            // Showing/hiding of this controller
            '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
                // Category and subcategory are edited in a 2 stage process, and if
                // order can't be guaranteed, then it's possible that the
                // subcategory show() comes before this hide(), which results in
                // unexpected behavior.
            
                /*if (newVal !== "manage_accounts") {
                this.element.hide();
            }*/
                if (newVal !== "manage_accounts") {
                    this.element.hide();
                    this.mainTabOn = false;
                } else if ($.route.attr('subcategory') == 'roles') {
                    this.mainTabOn = true;
                    this.element.show();
                }

            },
            '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal) {
                if (how === "add" || how === "set") {
                    if (newVal === "roles") {
                        this.reload();
                        this.element.show();
                    } else {
                        this.element.hide();
                    }
                }
            },
        
            // Data queries
            reload: function() {
                //Docview.Models.User.findAll({}, this.proxy('listUsers'), this.proxy('failure'));
                Docview.Models.Role.findAll({}, this.proxy('listRoles'), this.proxy('failure'));
            },
            listRoles: function(roles) {
                this.tableController.setModelData(roles);
            },

            failure: function(jqXHR, textStatus, errorThrown) {
                var handled = true;
                var t = 'error';
                var h = '错误提示：';
                var message = '登录超时或失效，需要用户认证，请重新登录系统。';
                switch(jqXHR.status) {
                    case 401:
                        break;
                    case 404:
                        type = 'info';
                        message = '系统中没有相关信息';
                        break;
                    case 500:
                        message = '系统内部错误';
                        break;
                    case 403:
                        type = 'info';
                        message = '失败，权限不足。';
                        break;
                    case 400:
                        message = '系统内部错误： 服务请求有误。';
                        break;
                    case 422:
                        message = '角色名已存在，请选用新的名称。';
                        break;
                    default:
                        message = '系统内部错误: 代码' + jqXHR.status;
                        handled = true;
                }
                if (handled) {
                    this.options.clientState.attr('alert', {
                        type: t,
                        heading: h,
                        message : message
                    });
                }
                return handled;
            },
            storeRoles: function(roles) {
                // Keep a reference to the list of available roles.
                // This is useful when showing a list of available roles
                // that we can assign to a user.
                this.roles = roles;
            //  //console.log(this.roles);
            },
        
            // Creating a user
            '#new-role-btn click': function() {
                $('#alerts div.alert').alert('close');
                // Load up the creation form
                $('#new-role').html(this.view('new_role'));// {roles: [this.roles]}));
            },
            '#new-role-form submit': function(el, ev) {
                ev.preventDefault();
                $('#alerts div.alert').alert('close');

                var jsonObject = new Object();
                var name = el.find('input[name="name"]').val();
                var desc = el.find('input[name="description"]').val();
                jsonObject.roleName = name;
                jsonObject.description = desc;

                //console.log(el);
                var formParams = el.find('input[type="checkbox"]');
                var rolePermissions = new Array();
                $.each(formParams, function(key, value) {
                    if (value.checked) {
                        rolePermissions.push(value.name);
                    }
                //		//console.log(value.name, + ", " + value.val() + " checked ==" + value.checked);
                //	        rolePermissions.push(key);
                });

                jsonObject.rolePermissions = rolePermissions;

                // Clear any previous error messages in the form
                this.removeFormErrors(el);
            
                // Scan for empty fields (jsmvc can actually do this in the model layer I believe)
                var error = false;
                if (name === "") {
                    this.displayFormError(el, "name", "请输入角色名");
                    error = true;
                } else {
                // //console.log("role name is ====== " + name);
                }

                if (rolePermissions.length < 1) {
                    this.displayFormError(el, "name", "新角色须至少有一个权限");
                    error = true;
                }
            
                if (!error) {
                    /*var user = new Docview.Models.User({
                    username: username,
                    fullname: fullname,
                    roles: [roles],
                    orgs: organizations,
                    password: password,
                    email: email
                });*/
                    var role = new Docview.Models.Role(jsonObject);

                
                    // Lock the save and cancel buttons
                    el.find('.btn-primary').button('loading');
                    el.find('.cancel-create').button('loading');
                
                    role.save(this.proxy('addRoleRow'), this.proxy('failure'));
                }
            },
            '.edit-role-form submit': function(el, ev) {
                ev.preventDefault();
                $('#alerts div.alert').alert('close');


                // Clear any previous error messages in the form
                this.removeFormErrors(el);
                // double check the permission list.

                //    var jsonObject = new Object();
                var formParams = el.find('input[type="checkbox"]');
                var rolePermissions = new Array();
                var roleDescriptions = new Array();
                $.each(formParams, function(key, value) {

                    if (value.checked) {
                        //console.log(key, value);
                        rolePermissions.push(value.name);

                        roleDescriptions.push($('input[name='+value.name +']').closest('li').text());
                    }
                //		//console.log(value.name, + ", " + value.val() + " checked ==" + value.checked);
                //	        rolePermissions.push(key);
                });
                //console.log(rolePermissions);
                //console.log(roleDescriptions);
                var role = el.closest('tr').prev().model();
                //var role_id = $(".edit-role-form").attr("id");

                //console.log(role);
                role.attr('rolePermissions', rolePermissions);
                role.attr('display_name', roleDescriptions.join(', '));
                Docview.Models.Role.updateRole(role.id, {
                    rolePermissions : rolePermissions,
                    display_name : roleDescriptions.join(', ')
                },
                this.proxy('updateRoleRow'),
                    this.proxy('failure')
                    );
                
                el.find('.btn-primary').button('loading');
                el.find('.cancel-edit').button('loading');
            // Save
            //user.save(this.proxy('updateUserRow'));
            },
            '.cancel-create click': function() {
                $('#new-role').collapse('hide');
            },
            addRoleRow: function(role, response) {
                //console.log('[Role]', role);
                //console.log('[Response]', response);
                if (role.id) {
                    // Remove a few unnecessary fields in user
                    //delete user.status;
                    //delete user.password;
                    //delete user.user;
                
                    //                //console.log(user, response);
                
                    // Copy over the user id since we don't have that
                
                    this.options.clientState.attr('alert', {
                        type: 'info',
                        heading: '提示信息',
                        message : '成功创建新角色' + role.name
                    });
                    var newRow = $(this.view('role_row', role)).css('display', 'none');
                    this.element.find('tbody').prepend(newRow);
                    newRow.fadeIn('slow');
                } else {
                    // Throw an alert
                    this.options.clientState.attr('alert', {
                        type: "error",
                        heading: "Error!",
                        message: "There was an error while trying to create this role."
                    });
                }
                $('#new-role').collapse('hide');
                $('#new-role-form .btn-primary').button('reset');
                $('#new-role-form .cancel-create').button('reset');
            },
        
            // Editing a role
            '.edit-role click': function(el, ev) {
                

                ev.preventDefault();
                // In place edit form
                //var roleRow = el.closest('tr');

                var roleInfo = this.tableController.getRowModelDataFor(el);

                roleRow = roleInfo.tr;
                roleRow.model(roleInfo.model);
                roleRow.hide();
                //console.log(roleInfo.model);

                roleRow.after(this.view('edit_role',
                {
                    cntl : this,
                    role: roleInfo.model
                }));
                var permissions = roleInfo.model.permissions.split(',');
                $.each(permissions, function(index, value) {
                    //console.log("about to set " + value + " to checked.");
                    $('input[name='+value +']').attr('checked', 'checked');
                });

            },

            '.cancel-edit click': function(el, ev) {
                ev.preventDefault();
                var editRow = el.closest('tr');
                editRow.prev().show();
                editRow.remove();
            },
            updateRoleRow: function(role) {
                //console.log(role);

                //	    console.log("updating a role ", role);
                //          var oldRow = role.elements(this.element);
                //        // Close edit box
                //      oldRow.next().remove();
                // Need to change display name
                //    var newRow = $(this.view('role_row', role)).css('display', 'none');
                //  oldRow.replaceWith(newRow);
                //newRow.fadeIn('slow');
                //
                this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功更新角色 ' + role.name
                });
                this.reload();
            },
        
            // Deleting a role
            '.delete-role click': function(el, ev) {                
                $('#alerts div.alert').alert('close');
                ev.preventDefault();

                el.button('loading');
                this.lastEl = el;
                if (confirm($.i18n._('msg.confirm.delete_role'))) {
                    var roleInfo = this.tableController.getRowModelDataFor(el);
                    //roleInfo.tr.model(roleInfo.model);
                    //roleInfo.model.destroy();

               
                    Docview.Models.Role.destroy(roleInfo.model.id,
                        this.proxy('roleDestroyed'),
                        this.proxy('roleDestroyFailed'));
                        this.reload();
                //el.closest('.role').model().destroy();

                }
                else {
                    el.button('reset');
                }
            },
            //'{Docview.Models.Role} destroyed': function(User, ev, role) {
            roleDestroyed: function(data) {
                this.lastEl.closest('.role').remove();
            //console.log('role destroyed ...', data);
            //role.elements(this.element).remove();
            },
            roleDestroyFailed : function(jqXHR, textStatus, errorThrown) {
                var t = 'error';
                var h = '错误提示：';
                var message = '需要用户认证，请重新登录系统。';
	
                this.lastEl.button('reset');
                switch(jqXHR.status) {
                    case 401:
                        break;
                    case 404:
                        type = 'info';
                        message = '系统中没有相关角色';
                        break;
                    case 500:
                        message = '系统内部错误';
                        break;
                    case 403:
                        type = 'info';
                        message = '失败，权限不足。';
                        break;
                    case 400:
                        type = 'error';
                        message = '角色不能被删除，系统有相应的用户。';
                        break;
                    default:
                        break;
                }
                this.options.clientState.attr('alert', {
                    type: t,
                    heading: h,
                    message : message
                });

                $('#new-role-form .btn-primary').button('reset');
                $('#new-role-form .cancel-create').button('reset');
                if (this.lastEl) {
                    this.lastEl.button('reset');
                }
            },
            "#export_data click" : function(el,ev){
                this.tableController.saveToExcel();
            },
            // Form utility functions
            displayFormError: function(form, name, message) {
                var inputField = form.find('input[name="' + name + '"]');
                inputField.closest('.control-group').addClass('error');
                inputField.after('<span class="help-inline">' + message + '</span>');
            },
            removeFormErrors: function(form) {
                form.find('.error > .help-inline').remove();
                form.find('.error').removeClass('error');
            }
        });
});
