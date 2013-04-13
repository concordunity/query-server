steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models', 
    'docview/ui/dmstable',  
    'docview/ui/orgui',
    'docview/ui/checkrole',
    'docview/ui/dictionary',
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
    'docview/bootstrap/bootstrap.min.js',
    'libs/org_arr.js',
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
/*
            var table_options = {
		aaData: [],

		col_def_path : "//docview/manage/accounts/users/views/",
		aoColumns: [
		    {"mDataProp":"username", mLabel : '用户名'},
		    {"mDataProp":"fullname", mLabel : '全名'},
		    {"mDataProp":"roles", mLabel : '角色'},
		    {"mDataProp":"subjection_org", mLabel : '隶属关区'},
		    {"mDataProp":"orgs", mLabel : '查阅权限'},
		    {"mDataProp":"doc_type", mLabel : '进出口类别'},
		    {"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
  		],
		file_name: "user_info"
	    };
*/
	    //this.element.find('.user-list').docview_ui_dmstable({table_options : table_options});
	    this.element.find('.user-list').docview_ui_pagingtable({
			tmpl_path:"/docview/manage/accounts/users/views/col_",
			columns:[
				{ id:'username', 		text:'用户名'		},
				{ id:'fullname', 		text:'全名' 		},
				{ id:'roles', 			text:'角色' 		},
				{ id:'subjection_org', 	text:'业务点' 	},
				{ id:'orgs', 			text:'查阅权限' 	},
				{ id:'doc_type', 		text:'进出口类别' 	},
				{ id:null, 				text:'操作'	, style:'nolinkbreak',width:150}
			],
			file_name: "users",
			url:'/accounts',
			type:'GET',
			data:{},
			dataType:'json',
			error:function(){

			},
			success:function(data){
				return Docview.Models.User.models(data.aaData);
			}
		});
		
	    this.tableController = this.element.find('.user-list').controller();
            // By default we're hidden until the route conditions are met


	    //$("#dictionary-tag").docview_ui_dictionary();
	    //var dicController =  $("#dictionary-tag").controller();
	    //this.orgsDic = dicController.getDictionary("org");
	    this.orgsDic = orgArrayDictionary; 

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
            //Docview.Models.User.findAll({}, this.proxy('listUsers'), this.proxy('failure'));
			//console.log("=======22222=====");
            Docview.Models.Role.findAll({}, this.proxy('storeRoles'), this.proxy('failure'));
			var that = this;
			that.tableController.reload({
				success:function(data){
					var model = Docview.Models.User.models(data.aaData);
					//that.tableController.setData(model);
					//console.log(model);
					return model;
				}
			});
			
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
	  log('system',{current_action:'manage_account.users',describe:message});
	  return handled;
	},
	storeRoles: function(roles) {
    	// Keep a reference to the list of available roles.
        // This is useful when showing a list of available roles
        // that we can assign to a user.
        this.roles = roles;
		//console.log('-------------rrrrrr--------------');
		//console.log(this.roles);
	},
	getRoles: function() {
	    return this.roles;
	},
    // Creating a user
	'#new-user-btn click': function() {
		// Load up the creation form
		console.log('------new-user----');
	    //console.log(this.orgsDic);
		$('#new-user').html(this.view('new_user', {cntl : this}));
	    $('#new-user').find('div.org-selection-holder').docview_ui_orgui({orgs: this.orgsDic, form: "new-user-form"});
	    $('#new-user').find('div.role-selection-holder').docview_ui_checkrole({form: "new-user-form"});
	    $('#new-user').find('div.role-selection-holder').docview_ui_checkrole("setRoles");
	},
	'#new-user-form submit': function(el, ev) {
		ev.preventDefault();
        var username = el.find('input[name="username"]').val();
        var fullname = el.find('input[name="fullname"]').val();
		var doc_type = el.find('select[name="doc_type"]').val();
        var email = el.find('input[name="email"]').val();
		var subjection_org = el.find('select[name=subjection_org]').val();
        var orgController = el.find('div.org-selection-holder').controller();
        var roleController = el.find('div.role-selection-holder').controller();
		var password = el.find('input[name="password"]').val();
       	var confirmation = el.find('input[name="password-confirm"]').val();
        var roles = roleController.getRoles(); 
		// Clear any previous error messages in the form
        this.removeFormErrors(el);
        // Scan for empty fields (jsmvc can actually do this in the model layer I believe)
       	var error = false;
        if (username === "") {
            error = true;
        	this.displayFormError(el, "username", "请输入用户名");
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
						subjection_org:subjection_org,
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
		    this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功添加新用户 ' + user.user.username 
		    });
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
				log('system',{current_action:'manage_account.users',describe:'成功创建新用户:'+user.user.username});
            }
            else {
                // Throw an alert
                this.options.clientState.attr('alert', {
                    type: "error",
                    heading: $.i18n._('msg.error'),
                    message: $.i18n._('msg.create_user_error')
                });
				log('system',{current_action:'manage_account.users',describe:'创建新用户时错误:'+user.user.username});
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
/*
	    var userInfo = this.tableController.getRowModelDataFor(el);

		userRow = userInfo.tr;
		userRow.model(userInfo.model);
	    userRow.hide();
	    //console.log(userInfo.model);
  */
		var row = this.tableController.getRowFrom(el);
		var userRow = row.element;
		var userInfo = row.model;  
		console.log(userInfo);        
	    var editHtml = this.view('edit_user',  {cntl : this, user: userInfo });
	    userRow.after(editHtml);
	    //userRow.next().find('div.edit-org-selection-holder').docview_ui_orgui();	

	    //console.log('===init orgDic ====',this.orgsDic);
	    userRow.next().find('div.edit-org-selection-holder').docview_ui_orgui({orgs: this.orgsDic, form: "edit-user-form"});
	    var ctrl =userRow.next().find('div.edit-org-selection-holder').controller();
	    ctrl.setOrgs(userInfo.orgs);

	    userRow.next().find('div.edit-role-selection-holder').docview_ui_checkrole({form: "edit-user-form"});
	    var ctrl_role =userRow.next().find('div.edit-role-selection-holder').controller();
		console.log("===userInfo====",userInfo.roles);
		var roles = [];
		for(var i=0;i<userInfo.roles.length;i++){
			roles.push(userInfo.roles[i].id);	
		}
		console.log("===roleInfo====",roles.join(","));
	    ctrl_role.setRoles(roles.join(","));

        },
        '.edit-user-form submit': function(el, ev) {
            ev.preventDefault();
            
            // Clear any previous error messages in the form
			this.removeFormErrors(el);
            
			var password = el.find('input[name="password"]').val();
			var confirmation = el.find('input[name="password-confirm"]').val();
			var fullname = el.find('input[name="fullname"]').val();
			var orgController = el.find('div.edit-org-selection-holder').controller();
			var roleController = el.find('div.edit-role-selection-holder').controller();
			var subjection_org = el.find('select[name=subjection_org]').val();
			var doc_type = el.find('select[name="doc_type"]').val();
			var roles = el.find('select[name="roles"]').val();


			console.log('getRoles = ',roleController.getRoles());
            if (password !== confirmation) {
                this.displayFormError(el,
				      "password-confirm",
				      "Please confirm your new password");
				return;
            }

            // Update model entry
            // The user model row is a hidden entry right above the edit row
            var user = el.closest('tr').prev();
            //user.attr('roles', el.find('select').val());
			var row = this.tableController.getRowFrom(user);
			user = row.model;
			console.log(user);
			Docview.Models.User.update(
							user.id,
							{ role : roleController.getRoles(),
					user : {
		      orgs : orgController.getOrgs(),
			 subjection_org:subjection_org,
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
            var editRow = el.closest("table").closest('tr');
            editRow.prev().show();
            editRow.remove();
        },
        updateUserRow: function(user) {
		this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功更新用户 ' + user.user.username 
                });
	    	this.reload();
		
			log('system',{current_action:'manage_account.users',describe:'成功更新用户:'+user.user.username});
        },        
        // Deleting a user
        '.delete-user click': function(el, ev) {
			ev.preventDefault();
            el.button('loading');
	    	$('#alerts div.alert').alert('close');
            if (confirm($.i18n._('msg.confirm.delete_user'))) {
				var row = this.tableController.getRowFrom(el);
				var model = row.model;
				model.destroy();
				row.element.remove();
            }
            else {
                el.button('reset');
            }
        },
        '{Docview.Models.User} destroyed': function(User, ev, user) {
			//console.log(user,this.element);
            user.elements(this.element).remove();
			log('system',{current_action:'manage_account.users',describe:'用户注销:'+user.username});
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
        },
		"form.edit-user-form  select[name=subjection_org] change" : function(el,ev){
			ev.preventDefault();	
			var org = $(el).val();
			$("form.edit-user-form").find("#org-selection input[value=" + org + "]").attr("checked",true);

			var ctrl = $("form.edit-user-form").find('div.edit-org-selection-holder').controller();
			ctrl.setOrgs(org);
		},
		"#new-user-form  select[name=subjection_org] change" : function(el,ev){
			ev.preventDefault();	
			var org = $(el).val();
			$("form.new-user-form").find("#org-selection input[value=" + org + "]").attr("checked",true);
			var ctrl = $("#new-user-form").find('div.org-selection-holder').controller();
			ctrl.setOrgs(org);
		},
		"#export_data click" : function(){
	    	this.tableController.saveToExcel({type: "all"});
		}
    });
});
