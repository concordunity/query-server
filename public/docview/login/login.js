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
    'docview/search/results',
    'docview/manage/accounts/users',
    'docview/manage/accounts/roles',
    'docview/manage/docs',
    'docview/ui/details',
    'docview/ui/syssetting',
    'docview/ui/export_query',
    'docview/stats/group',
    'docview/stats/search',
    'docview/ui/upload_user',
    './login.css'
).then(
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
            var username = el.find('input[name="username"]').val();
            var password = el.find('input[name="password"]').val();
            
            if (username !== "" && password !== "") {
                // Lock the login button
		this.username = username;
                el.find('.btn-primary').button('loading');
                Docview.Models.User.login(
                    { commit: 'Sign in', user : { username : username, password : password } },
                    this.proxy('getAccessList'), this.proxy('loginError')
                );
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
		this.options.clientState.attr('user', {
                    username: user.email,
                    fullname: user.fullname
		});

		if (window.location.pathname == "/docview/admin.html"){
			window.location.href = "/admin";
		}
	    }
        
            Docview.Models.User.getAccessList(
                this.proxy('storeAccessList'), this.proxy('accessListError')
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
	    this.options.clientState.attr('user', {
                username: permissions.email,
                fullname: permissions.fullname
	    });
	    $('#user-info-display').html("当前登录用户 : " + permissions.fullname);
            // Parse web_links
            for (var i = 0; i < permissions.web_links.length; i++) {
                switch (permissions.web_links[i].action) {
                    // Search
                case ("query"):
                    this.options.clientState.attr('access')
                        .attr('search').attr('single', true);
		    this.setNavIfEmpty('search', 'single');
		    break;
                case ("multi_query"):
                    this.options.clientState.attr('access')
                        .attr('search').attr('multi', true);
		    this.setNavIfEmpty('search', 'multi');
                    break;
                case ("search_docs"):
                    this.options.clientState.attr('access')
                        .attr('search').attr('advanced', true);
		    this.setNavIfEmpty('search', 'advanced');
                    break;
                case ("search_condition"):
                    this.options.clientState.attr('access')
                        .attr('search').attr('search_condition', true);
		    this.setNavIfEmpty('search', 'search_condition');
                    break;
                case ("import_excel"):
                    this.options.clientState.attr('access')
                        .attr('search').attr('upload_file', true);
		    this.setNavIfEmpty('search', 'upload_file');
                    break;
                case ("by_doc_source"):
		    this.options.clientState.attr('access')
			.attr('search').attr('by_doc_source', true);
		    this.setNavIfEmpty('search', 'by_doc_source');
		    break;
                        
                    // Stats
                case ("stats_query"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('stats_query', true);
		    this.setNavIfEmpty('stats', 'stats_query');
                    break;
                case ("stats_stats"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('stats_stats', true);
		    this.setNavIfEmpty('stats', 'stats_stats');
                    break;
                case ("stats_usage"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('stats_usage', true);
		    this.setNavIfEmpty('stats', 'stats_usage');
                    break;
		case ("create_group"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('create_group', true);
		    this.setNavIfEmpty('stats', 'create_group');
                    break;

		case ("stats_export"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('stats_export', true);
		    this.setNavIfEmpty('stats', 'stats_export');
                    break;
		    
                case ("advanced"):
                    this.options.clientState.attr('access')
                        .attr('stats').attr('advanced', true);
                    break;
		    
                case ("inquire"):
                    this.options.clientState.attr('access')
                        .attr('manage_docs').attr('inquire', true);
                    this.setNavIfEmpty('manage_docs', 'inquire');
		    break;
                case ("checkout"):
                    this.options.clientState.attr('access')
                        .attr('manage_docs').attr('check', true);
                    this.setNavIfEmpty('manage_docs', 'checkout');
                    break;
                case ("print"):
                    this.options.clientState.attr('access')
                        .attr('manage_docs').attr('print', true);
                    this.setNavIfEmpty('manage_docs', 'print_doc');
                    break;
                case ("testify"):
                    this.options.clientState.attr('access')
                        .attr('manage_docs').attr('testify', true);
                    this.setNavIfEmpty('manage_docs', 'court_doc');
                    break;
                case ("dh_report"):
                    this.options.clientState.attr('access')
                        .attr('manage_docs').attr('dh_report', true);
                    this.setNavIfEmpty('manage_docs', 'dh_report');
                    break;
                    // Manage users
                case ("manage_user"):
                    this.options.clientState.attr('access')
                        .attr('manage_accounts').attr('users', true);
                    this.setNavIfEmpty('manage_accounts', 'users');
                    break;
                case ("manage_role"):
                    this.options.clientState.attr('access')
                        .attr('manage_accounts').attr('roles', true);
                    this.setNavIfEmpty('manage_accounts', 'roles');
                    break;                    
                case ("system_upload"):
                    this.options.clientState.attr('access')
                        .attr('manage_accounts').attr('system_upload', true);
                    this.setNavIfEmpty('manage_accounts', 'system_upload');
                    break;                    
                case ("sys-setting"):
                    this.options.clientState.attr('access')
			.attr('manage_accounts').attr('sys_setting', true);

                default:
                    break;
                }
            }

//            //console.log(this.options.clientState.attr('access'));
            
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
            
            // Change background color
            $('body').removeClass('login-page');
        
        	$('#navigation-header').docview_nav({clientState: this.options.clientState});
            $('#subnavigation-header').docview_subnav({clientState: this.options.clientState});
            
            $('#search-box').docview_search({clientState: this.options.clientState});
            $('#search-results').docview_search_results({clientState: this.options.clientState});

            //$('#upload-file').docview_ui_upload({clientState: this.options.clientState});

            if (this.options.clientState.attr('access')
		.attr('stats').attr('stats_export')) {
		$('#stats-export').docview_ui_export_query({clientState: this.options.clientState});
	    }

            if (this.options.clientState.attr('access')
                .attr('search').attr('search_condition') === true) {

		$('#search-some-conditions').docview_ui_search_some_condition({clientState: this.options.clientState}); 
	    }

            $('#manage-users').docview_manage_accounts_users({clientState: this.options.clientState});
            $('#manage-roles').docview_manage_accounts_roles({clientState: this.options.clientState});
	    $('#manage-docs').docview_manage_docs({clientState: this.options.clientState});
            $('#sys-setting').docview_ui_syssetting({clientState: this.options.clientState});
            // $('#search-results').docview_search_results({clientState: this.options.clientState});
            // $('#breadcrumbs').docview_breadcrumbs({clientState: this.options.clientState});
            $('#document-details').docview_ui_details({clientState: this.options.clientState});

            $('#group-docs').docview_stats_group({clientState: this.options.clientState});

	    $('#stats-search-box').docview_stats_search({clientState: this.options.clientState});
	    $('#settings').docview_settings({clientState: this.options.clientState});
	    $('#system-upload').docview_ui_upload_user({clientState: this.options.clientState});
	    var login_info = " 最近一次登录时间 "+ user_info.last_time + ", IP 地址 " + user_info.last_ip;
            this.options.clientState.attr('login', {message: this.options.clientState.attr('user').attr('fullname') + login_info});
            this.options.clientState.attr('alert', {
                type: 'success',
                heading: $.i18n._('msg.welcome'),
                message: this.options.clientState.attr('user').attr('fullname') + login_info
            });
	    $("#alerts").docview_ui_index({clientState: this.options.clientState, userInfo :  user_info });
            
            // TODO: Reload the route so the right thing shows up.
        }
    });
});
