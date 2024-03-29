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
    'docview/stats/group',
    'docview/stats/search',
    './login.css'
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

	    this.element.find('.btn-primary').button('reset');
            // Store user info first
            this.options.clientState.attr('user', {
                username: user.email,
                fullname: user.fullname
            });
        
            Docview.Models.User.getAccessList(
                this.proxy('storeAccessList'), this.proxy('accessListError')
            );
        },
        accessListError: function(error) {
            this.options.clientState.attr('alert', {
                type: 'error',
                heading: '错误提示: ',
                message: '未能获得您的登录权限信息，请尝试重新登录。'
            });
            this.element.find('.btn-primary').button('reset');
        },
        storeAccessList: function(permissions) {
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
                case ("sys-setting"):
                    this.options.clientState.attr('access').attr('sys-setting', true);

                default:
                    break;
                }
            }

//            //console.log(this.options.clientState.attr('access'));
            
            // load app
            this.loadApp(permissions);
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
            
            $('#search-box').docview_search({clientState: this.options.clientState,
					     searchMode : this.options.searchMode});
            $('#search-results').docview_search_results({
		clientState: this.options.clientState,
		searchMode: this.options.searchMode
	    });
            
            $('#manage-users').docview_manage_accounts_users({clientState: this.options.clientState});
            $('#manage-roles').docview_manage_accounts_roles({clientState: this.options.clientState});
	    $('#manage-docs').docview_manage_docs({clientState: this.options.clientState,
						   searchMode: this.options.searchMode});
            
            // $('#search-results').docview_search_results({clientState: this.options.clientState});
            // $('#breadcrumbs').docview_breadcrumbs({clientState: this.options.clientState});
            $('#document-details').hide();
            $('#document-details').docview_ui_details({clientState: this.options.clientState,
						       searchMode: this.options.searchMode});
            $('#group-docs').docview_stats_group({clientState: this.options.clientState});

	    //console.log(" from login : " , this.options.searchMode);
	    $('#stats-search-box').docview_stats_search({clientState: this.options.clientState});
	    $('#settings').docview_settings({clientState: this.options.clientState});

	    var login_info = " 最近一次登录时间 "+ user_info.last_time + ", IP 地址 " + user_info.last_ip;
            this.options.clientState.attr('alert', {
                type: 'success',
                heading: $.i18n._('msg.welcome'),
                message: this.options.clientState.attr('user').attr('fullname') + login_info
            });
            
            // TODO: Reload the route so the right thing shows up.
        }
    });
});
