steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    // The rest of the application
    'docview/nav',
    'docview/settings',
    'docview/subnav',
    'docview/alerts',
    'docview/search',
    'docview/ui/requisition',
    'docview/ui/businessprocess',
    'docview/search/results',
    'docview/manage/accounts/users',
    'docview/manage/accounts/roles',
    'docview/manage/docs',
    'docview/ui/details',
    'docview/ui/syssetting',
    'docview/ui/agency',
    'docview/ui/export_query',
    'docview/stats/group',
    'docview/stats/search',
    'docview/ui/check_user',
    'docview/ui/upload_user',
    './login.css'
).then(
    'jquery/jquery.js',
    'libs/jquery.log.js',
    'libs/jquery.display.user.js',
    'docview/ui/upload',
    'docview/ui/index',
    'docview/ui/search_some_condition'
)

// View templates
.then (
    './views/login_menu.ejs'
)

.then(function($) {

    /*
    *   Gateway to the rest of the application. After a successful login,
    *   the rest of the application will be displayed.
    */
    $.Controller('Docview.Login',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function(options) {
	    	this.checkIfUserLoggedIn();
	    	this.uiCreated = false;
	},
	createFreshUI : function() {
	    this.uiCreated = true;
        this.element.html(this.view('login_menu', {}));
	    this.username = "";
	},
	'#login-form submit': function(el, ev) {
    	ev.preventDefault();
		var that = this;
		//window.location.href = '/users/logout'
        var username = el.find('input[name="username"]').val();
       	var password = el.find('input[name="password"]').val();
        if (username !== "" && password !== "") {
        	// Lock the login button
			this.username = username;
			el.find('.btn-primary').button('loading');
			var login = (function(){
				Docview.Models.User.login({ 
					commit: 'Sign in', 
					user : { 
							username : username, 
							password : password 
						} 
					},
					that.proxy('getAccessList'),
					that.proxy('loginError')
				);
			});
			Docview.Models.User.logout(login,login);
		}
	},
	checkIfUserLoggedIn : function () {
	    this.getAccessList(null);
	},
	loginLockedDone : function(data) {
	    //console.log(data);
	    if (data.locked == true) {
			this.options.clientState.attr('alert', {
        		type: 'error',
            	heading: $.i18n._('msg.error'),
           		message: '您到帐户被临时禁用，须由管理员重置密码。'
			});
			log("system",{login_user: this.username, current_action: "system.login", describe: "帐户被临时禁用，须由管理员重置密码。"});
			return;
	    }
	    this.showLoginErrorMessage();
	},
	showLoginErrorMessage : function() {
		this.options.clientState.attr('alert', {
                type: 'error',
                heading: $.i18n._('msg.error'),
                message: $.i18n._('msg.incorrect_login')
	    });
	    log("system",{login_user: this.username, current_action: "system.login", describe: $.i18n._('msg.incorrect_login')});
	},
	loginFinalError: function(jqXHR, textStatus, errorThrown) {
	    this.showLoginErrorMessage();
	},
	loginError: function(jqXHR, textStatus, errorThrown) {
	    var message = $.i18n._('msg.incorrect_login');
	    if (this.username) {
			Docview.Models.User.checkIfLocked(this.username,
				this.proxy("loginLockedDone"),
				this.proxy("loginFinalError"));
	    	// Check if a user is locked.
			this.element.find('.btn-primary').button('reset');
			return;
	    }
	    this.showLoginErrorMessage();
        this.element.find('.btn-primary').button('reset');
	},
    getAccessList: function(user) {
		if (user != null) {
			this.element.find('.btn-primary').button('reset');
			// Store user info first
			log("system",{login_user: this.username, current_action: "system.login", describe: "登录成功"});
			if (window.location.pathname == "/docview/admin.html"){
				window.location.href = "/admin";
			}
	    }
        Docview.Models.User.getAccessList(
            this.proxy('storeAccessList'),
			this.proxy('accessListError')
        );
	},
	accessListError: function(error) {
            if (this.uiCreated == false) {
					this.createFreshUI();
			} else {
					this.options.clientState.attr('alert', {
						type: 'error',
                    	heading: '错误提示: ',
                    	message: '未能获得您的登录权限信息，请尝试重新登录。'
					});
	    	}

            this.element.find('.btn-primary').button('reset');
        },
	storeAccessList: function(permissions) {
	    // Store user info first
	    this.options.clientState.attr('user', permissions );
		window.user = permissions;
	    $('#user-info-display').html("当前登录用户 : " + permissions.fullname);
            // Parse web_links
            for (var i = 0; i < permissions.web_links.length; i++) {
				console.log(permissions.web_links[i].action);
                switch (permissions.web_links[i].action) {
                    // Search
                case ("query"):
                    this.options.clientState.attr('access').attr('search').attr('single', true);
					this.setNavIfEmpty('search', 'single');
					break;
                case ("multi_query"):
                    this.options.clientState.attr('access').attr('search').attr('multi', true);
					this.setNavIfEmpty('search', 'multi');
                    break;
                case ("search_docs"):
                    this.options.clientState.attr('access').attr('search').attr('advanced', true);
					this.setNavIfEmpty('search', 'advanced');
                    break;
                case ("create_interchange_receipt"):
                    this.options.clientState.attr('access').attr('business_process').attr('create_interchange_receipt', true);
                    this.setNavIfEmpty('business_process', 'create_interchange_receipt');
                    break;                    
                case ("search_interchange_receipt"):
                    this.options.clientState.attr('access').attr('business_process').attr('search_interchange_receipt', true);
                    this.setNavIfEmpty('business_process', 'search_interchange_receipt');
                    break;                    
                case ("create_dishonored_bill"):
                    this.options.clientState.attr('access').attr('business_process').attr('create_dishonored_bill', true);
                    this.setNavIfEmpty('business_process', 'create_dishonored_bill');
                    break;                    
                case ("search_dishonored_bill"):
                    this.options.clientState.attr('access').attr('business_process').attr('search_dishonored_bill', true);
                    this.setNavIfEmpty('business_process', 'search_dishonored_bill');
                    break;                    
                case ("statistical_inquiry"):
                    this.options.clientState.attr('access').attr('business_process').attr('statistical_inquiry', true);
                    this.setNavIfEmpty('business_process', 'statistical_inquiry');
                    break;                    
				case ("requisition_history_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('requisition_history', true);
					this.setNavIfEmpty('requisition_docs', 'requisition_history');
					break;
				case ("application_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('application', true);
					this.setNavIfEmpty('requisition_docs', 'application');
					break;
				case ("application_nanhui_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('application_nanhui', true);
					this.setNavIfEmpty('requisition_docs', 'application_nanhui');
					break;
				case ("approval_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('approval', true);
					this.setNavIfEmpty('requisition_docs', 'approval');
					break;
				case ("approval_guan_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('approval_guan', true);
					this.setNavIfEmpty('requisition_docs', 'approval_guan');
					break;
				case ("register_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('register', true);
					this.setNavIfEmpty('requisition_docs', 'register');
					break;
				case ("write_off_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('write_off', true);
					this.setNavIfEmpty('requisition_docs', 'write_off');
					break;
				case ("lending_statistics_index"):
					this.options.clientState.attr('access') .attr('requisition_docs').attr('lending_statistics', true);
					this.setNavIfEmpty('requisition_docs', 'lending_statistics');
					break;
				case ("all_print"):
/*
		    
                    this.options.clientState.attr('access')
                        .attr('search').attr('all_print', true);
		    this.setNavIfEmpty('search', 'all_print');
*/
					this.options.clientState.attr('access') .attr('manage_docs').attr('all_print', true);
                    this.setNavIfEmpty('manage_docs', 'all_print');
                    break;
                case ("search_condition"):
                    this.options.clientState.attr('access').attr('search').attr('search_condition', true);
					this.setNavIfEmpty('search', 'search_condition');
                    break;
                case ("import_excel"):
                    this.options.clientState.attr('access').attr('search').attr('upload_file', true);
					this.setNavIfEmpty('search', 'upload_file');
                    break;
                case ("by_doc_source"):
					this.options.clientState.attr('access').attr('search').attr('by_doc_source', true);
					this.setNavIfEmpty('search', 'by_doc_source');
					break;
                        
                    // Stats
                case ("stats_query"):
                    this.options.clientState.attr('access').attr('stats').attr('stats_query', true);
					this.setNavIfEmpty('stats', 'stats_query');
                    break;
                case ("stats_stats"):
                    this.options.clientState.attr('access').attr('stats').attr('stats_stats', true);
					this.setNavIfEmpty('stats', 'stats_stats');
                    break;
                case ("stats_usage"):
                    this.options.clientState.attr('access').attr('stats').attr('stats_usage', true);
					this.setNavIfEmpty('stats', 'stats_usage');
                    break;
				case ("create_group"):
                    this.options.clientState.attr('access').attr('stats').attr('create_group', true);
					this.setNavIfEmpty('stats', 'create_group');
                    break;
				case ("stats_export"):
					this.options.clientState.attr('access').attr('stats').attr('stats_export', true);
					this.setNavIfEmpty('stats', 'stats_export');
					break;
				case ("advanced"):
					this.options.clientState.attr('access').attr('stats').attr('advanced', true);
					break;
                case ("inquire"):
                    this.options.clientState.attr('access').attr('manage_docs').attr('inquire', true);
                    this.setNavIfEmpty('manage_docs', 'inquire');
					break;
                case ("checkout"):
                    this.options.clientState.attr('access').attr('manage_docs').attr('check', true);
                    this.setNavIfEmpty('manage_docs', 'checkout');
                    break;
                case ("print"):
                    this.options.clientState.attr('access').attr('manage_docs').attr('print', true);
                    this.setNavIfEmpty('manage_docs', 'print_doc');
                    break;
                case ("testify"):
                    this.options.clientState.attr('access').attr('manage_docs').attr('testify', true);
                    this.setNavIfEmpty('manage_docs', 'court_doc');
                    break;
                case ("dh_report"):
                    this.options.clientState.attr('access').attr('manage_docs').attr('dh_report', true);
                    this.setNavIfEmpty('manage_docs', 'dh_report');
                    break;
                    // Manage users
                case ("manage_user"):
                    this.options.clientState.attr('access').attr('manage_accounts').attr('users', true);
                    this.setNavIfEmpty('manage_accounts', 'users');
                    break;
                case ("manage_role"):
                    this.options.clientState.attr('access').attr('manage_accounts').attr('roles', true);
                    this.setNavIfEmpty('manage_accounts', 'roles');
                    break;                    
                case ("business_agency_maintain_index"):
                    this.options.clientState.attr('access').attr('manage_accounts').attr('business_agency_maintain', true);
                    this.setNavIfEmpty('manage_accounts', 'business_agency_maintain');
                    break;  
                case ("system_upload"):
                    this.options.clientState.attr('access').attr('manage_accounts').attr('system_upload', true);
                    this.setNavIfEmpty('manage_accounts', 'system_upload');
                    break;                    
                case ("sys-setting"):
                    this.options.clientState.attr('access').attr('manage_accounts').attr('sys_setting', true);

                default:
                    break;
                }
            }

            console.log(this.options.clientState.attr('access'));
            
            // load app
            this.loadApp(permissions);
			$.route.attr('category',"init");
			$.route.attr('subcategory',"init");
        },
		setNavIfEmpty : function(cat, subcat) {
	    	var nav_subcat = this.options.clientState.attr('nav').attr(cat);
	   		if (!nav_subcat) {
				this.options.clientState.attr('nav').attr(cat, subcat);
	    	}
		},
        loadApp: function(user_info) {
            $('#login').hide();
			console.log(this.options.clientState);
			// Change background color
            $('body').removeClass('login-page');
        
        	$('#navigation-header').docview_nav({clientState: this.options.clientState});
            $('#subnavigation-header').docview_subnav({clientState: this.options.clientState});
            
            $('#search-box').docview_search({clientState: this.options.clientState});
            $('#search-results').docview_search_results({clientState: this.options.clientState});

            //$('#upload-file').docview_ui_upload({clientState: this.options.clientState});

            if (this.options.clientState.attr('access').attr('stats').attr('stats_export')) {
				$('#stats-export').docview_ui_export_query({clientState: this.options.clientState});
	    	}

            if (this.options.clientState.attr('access').attr('search').attr('search_condition') === true) {
				$('#search-some-conditions').docview_ui_search_some_condition({clientState: this.options.clientState}); 
	    	}

            $('#manage-users').docview_manage_accounts_users({clientState: this.options.clientState});
            $('#manage-roles').docview_manage_accounts_roles({clientState: this.options.clientState});
			$('#manage-docs').docview_manage_docs({clientState: this.options.clientState});
			$('#requisition-docs').docview_ui_requisition({clientState: this.options.clientState});
			$('#business-process').docview_ui_businessprocess({clientState: this.options.clientState});
            $('#sys-setting').docview_ui_syssetting({clientState: this.options.clientState});
            $('#manage-business-agency-maintain').docview_ui_agency({clientState: this.options.clientState});
            // $('#search-results').docview_search_results({clientState: this.options.clientState});
            // $('#breadcrumbs').docview_breadcrumbs({clientState: this.options.clientState});
            $('#document-details').docview_ui_details({clientState: this.options.clientState});

            $('#group-docs').docview_stats_group({clientState: this.options.clientState});

	    	$('#stats-search-box').docview_stats_search({clientState: this.options.clientState});
	    	$('#settings').docview_settings({clientState: this.options.clientState});
	    	$('#system-upload').docview_ui_upload_user({clientState: this.options.clientState});
			var login_info = " 最近一次登录时间 "+ $.date(user_info.last_time).format('yyyy-MM-dd hh:mm:ss') + ", IP 地址 " + user_info.last_ip;
			this.options.clientState.attr('login', {message: this.options.clientState.attr('user').attr('fullname') + login_info});
			this.options.clientState.attr('alert', {
				type: 'success',
				heading: $.i18n._('msg.welcome'),
				message: this.options.clientState.attr('user').attr('fullname') + login_info
			});
	    	$("#alerts").docview_ui_index({clientState: this.options.clientState, userInfo :  user_info });
			$('#check_user').docview_ui_check_user();
            
            // TODO: Reload the route so the right thing shows up.
        }
    });
});
