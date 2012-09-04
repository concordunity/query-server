steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models', 
    'docview/ui/dmstable',  
    'docview/ui/orgui',
    'docview/bootstrap/bootstrap.css'
)

// View templates
.then(
    './views/init.ejs',
    './views/users_table.ejs',
    './views/user_row.ejs',
    './views/edit_user.ejs',
    './views/new_user.ejs',
    'docview/datatables/jquery.dataTables.js'
)
// External JS
.then(
    'docview/bootstrap/bootstrap-button.js',
    'docview/bootstrap/bootstrap-collapse.js',
    'docview/bootstrap/bootstrap-alert.js',
    'docview/datatables/bootstrap-pagination.js',
    'docview/docview.css'
).then(function($) {
    /*
    * Manage user accounts and roles
    */
    $.Controller('Docview.Manage.Accounts.Users',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('init', {}));

            var table_options = {
		aaData: [],

		col_def_path : "//docview/manage/accounts/users/views/",
		aoColumns: [
		    {"mDataProp":"username", mLabel : '用户名'},
		    {"mDataProp":"fullname", mLabel : '全名'},
		    {"mDataProp":"roles", mLabel : '角色'},
		    {"mDataProp":"orgs", mLabel : '关区'},
		    {"mDataProp":"doc_type", mLabel : '进出口类别'},
		    {"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
  		],
		file_name: "user_info"
	    };
	    this.element.find('.user-list').docview_ui_dmstable({table_options : table_options});
	    this.tableController = this.element.find('.user-list').controller();
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
            if (newVal !== "manage_accounts") {
                this.element.hide();
		this.mainTabOn = false;
            } else if ($.route.attr('subcategory') == 'users') {
		this.mainTabOn = true;
		this.element.show();
	    }
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal) {
	    if (this.mainTabOn || $.route.attr('category') == 'manage_accounts') {
		if (how === "add" || how === "set") {
                    if (newVal === "users") {
			this.reload();
			this.element.show();
                    } else {
			this.element.hide();
                    }
		}
	    }
        },        
        // Data queries
        reload: function() {
            Docview.Models.User.findAll({}, this.proxy('listUsers'), this.proxy('failure'));
            Docview.Models.Role.findAll({}, this.proxy('storeRoles'), this.proxy('failure'));
        },

	saveToExcel : function() {
	    var table = this.element.find('table').dataTable();
	    var data = table.fnGetData();
//	    console.log(data);
	},
        listUsers: function(users) {
	    this.tableController.setModelData(users);
        },
        "#export_data click" : function(el,ev){
            this.tableController.saveToExcel();
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
	      message = '用户名已存在，请选用新的名称。';
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
//            //console.log(this.roles);
        },
        getRoles: function() {
	    return this.roles;
	},
        // Creating a user
        '#new-user-btn click': function() {
            // Load up the creation form
            $('#new-user').html(this.view('new_user', {cntl : this}));
	    $('#new-user').find('div.org-selection-holder').docview_ui_orgui();

        },
        '#new-user-form submit': function(el, ev) {
            ev.preventDefault();
            var username = el.find('input[name="username"]').val();
            var fullname = el.find('input[name="fullname"]').val();
	    var doc_type = el.find('select[name="doc_type"]').val();
            var roles = el.find('select[name="roles"]').val();
            var email = el.find('input[name="email"]').val();

            var orgController = el.find('div.org-selection-holder').controller();


            var password = el.find('input[name="password"]').val();
            var confirmation = el.find('input[name="password-confirm"]').val();

            // Clear any previous error messages in the form
            this.removeFormErrors(el);
            
            // Scan for empty fields (jsmvc can actually do this in the model layer I believe)
            var error = false;
            if (username === "") {
                this.displayFormError(el, "username", "请输入用户名");
                error = true;
            }
            if (fullname === "") {
                this.displayFormError(el, "fullname", "请输入用户全名");
                error = true;
            }
            if (password === "") {
                this.displayFormError(el, "password", "请输入密码");
                error = true;
            }
            
            // Check that confirmation matches
            if (password !== confirmation) {
                this.displayFormError(el, "password-confirm", "输入的密码不匹配");
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
                var user = new Docview.Models.User({
                    role: roles,
                    user: {
                        username: username,
                        fullname: fullname,
                        orgs: orgController.getOrgs(),
                        password: password,
                        email: email,
			doc_type : doc_type
                    }
                });
                
                // Lock the save and cancel buttons
                el.find('.btn-primary').button('loading');
                el.find('.cancel-create').button('loading');
                
                user.save(this.proxy('addUserRow'));
            }
        },
        '.cancel-create click': function() {
            $('#new-user').collapse('hide');
        },
        addUserRow: function(user, response) {
            if (user.status === 200) {
		this.reload();
                // Remove a few unnecessary fields in user
                //delete user.status;
                //delete user.password;
                //delete user.user;
                
                //console.log(user, response);
                
                // Copy over the user id since we don't have that
                //user.id = response.user.id;
                
                //var newRow = $(this.view('user_row', user)).css('display', 'none');
               // this.element.find('tbody').prepend(newRow);
               // newRow.fadeIn('slow');
            }
            else {
                // Throw an alert
                this.options.clientState.attr('alert', {
                    type: "error",
                    heading: $.i18n._('msg.error'),
                    message: $.i18n._('msg.create_user_error')
                });
            }
	    
            $('#new-user-form .btn-primary').button('reset');
            $('#new-user-form .cancel-create').button('reset');
	    $('#new-user').collapse('hide');
        },
        
        // Editing a user
        '.edit-user click': function(el, ev) {
	    ev.preventDefault();
            // In place edit form
            //var userRow = el.closest('tr');

	    var userInfo = this.tableController.getRowModelDataFor(el);

            userRow = userInfo.tr;
            userRow.model(userInfo.model);
	    userRow.hide();
	    //console.log(userInfo.model);
            
	    var editHtml = this.view('edit_user', 
				     {cntl : this, user: userInfo.model});
	    userRow.after(editHtml);
	    userRow.next().find('div.edit-org-selection-holder').docview_ui_orgui();	
	    var ctrl =userRow.next().find('div.edit-org-selection-holder').controller();
	    ctrl.setOrgs(userInfo.model.orgs);

        },
        '.edit-user-form submit': function(el, ev) {
            ev.preventDefault();
            
            // Clear any previous error messages in the form
            this.removeFormErrors(el);
            
	    var password = el.find('input[name="password"]').val();
	    var confirmation = el.find('input[name="password-confirm"]').val();
	    var fullname = el.find('input[name="fullname"]').val();
            var orgController = el.find('div.edit-org-selection-holder').controller();

	    var doc_type = el.find('select[name="doc_type"]').val();
	    var roles = el.find('select[name="roles"]').val();

            if (password !== confirmation) {
                this.displayFormError(el,
				      "password-confirm",
				      "Please confirm your new password");
		return;
            }

            // Update model entry
            // The user model row is a hidden entry right above the edit row
            var user = el.closest('tr').prev().model();
            //user.attr('roles', el.find('select').val());
	    Docview.Models.User.update(
		user.id,
		{ role : roles,
                  user : {
		      orgs : orgController.getOrgs(),
		      fullname : fullname,
		      doc_type : doc_type,
		      password : password }
		},
		this.proxy('updateUserRow'),
		this.proxy('failure')
	    );
                
            // Lock the save and cancel buttons
            el.find('.btn-primary').button('loading');
            el.find('.cancel-edit').button('loading');
        },
        '.cancel-edit click': function(el, ev) {
            var editRow = el.closest('tr');
            editRow.prev().show();
            editRow.remove();
        },
        updateUserRow: function(user) {
	    this.reload();
        },        
        // Deleting a user
        '.delete-user click': function(el, ev) {
	    ev.preventDefault();
            el.button('loading');
            if (confirm($.i18n._('msg.confirm.delete_user'))) {
		var userInfo = this.tableController.getRowModelDataFor(el);
		userInfo.tr.model(userInfo.model);
		userInfo.model.destroy();
            }
            else {
                el.button('reset');
            }
        },
        '{Docview.Models.User} destroyed': function(User, ev, user) {
            user.elements(this.element).remove();
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
