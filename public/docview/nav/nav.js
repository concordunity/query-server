steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/bootstrap/bootstrap.css'
)
// View templates
.then(
    'libs/jquery.i18n.min.js',
    './views/menu_bar.ejs'
)
.then(function($) {

    /*
    * Navigation controller for the top menu bar found on every page
    * Controls route changes caused by nav button clicks.
    * Also updates state for key information.
    */
    $.Controller('Docview.Nav',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            // If any subnav item is allowed, then we have to show the nav item
            var search = false;
	    this.lastActiveA = undefined;
            var searchActions = this.options.clientState.attr('access').attr('search');
            if (searchActions.attr('single') || searchActions.attr('multi') || searchActions.attr('advanced') || searchActions.attr('by_doc_source')) {
                search = true;
            }
            
            var stats = false;
            var statsActions = this.options.clientState.attr('access').attr('stats');
            if (statsActions.attr('stats_stats') || statsActions.attr('stats_usage') || statsActions.attr('stats_query') || statsActions.attr('create_group')) {
                stats = true;
            }
            
            var manage_docs = false;
            var docActions = this.options.clientState.attr('access').attr('manage_docs');
            if (docActions.attr('print') || docActions.attr('testify') || docActions.attr('inquire') || docActions.attr('check') || docActions.attr('dh_report')) {
                manage_docs = true;
            }
            
            var manage_accounts = false;
            var accountActions = this.options.clientState.attr('access').attr('manage_accounts');
            if (accountActions.attr('users') || accountActions.attr('roles')) {
                manage_accounts = true;
            }
            
            this.element.html(this.view('menu_bar', {
                user: this.options.clientState.attr('user'),
                search: search,
                stats: stats,
                manage_docs: manage_docs,
                manage_accounts: manage_accounts
            }));
        },
        getHrefNoHash: function(el) {
            var shref = el.attr('href');
            var pos = shref.indexOf('#'); 
            if (pos < 0) {
               return shref;
            }

            return shref.substring(pos + 1);
        },
        '.main-nav a click': function(el, ev) {
            ev.preventDefault();
	    this.lastActiveA = el;
	    $("#alerts").html("");
            // Change address bar to reflect link contents
            // This overwrites all other route attributes
            var newCategory = this.getHrefNoHash(el);
            if (newCategory !== $.route.attr('category')) {
                $.route.attrs({category: newCategory}, true);
            }
        },
        '.user-info a click': function(el, ev) {
            ev.preventDefault();
            // Change address bar to reflect link contents
            // This overwrites all other route attributes
            var newCategory = this.getHrefNoHash(el);
            if (newCategory !== $.route.attr('category')) {
                $.route.attrs({category: newCategory}, true);
            }
        },
        '.logout a click': function(el, ev) {
            ev.preventDefault();
	    if (confirm("您确定要退出登录吗？")) {
		Docview.Models.User.logout(
                    function() {
			window.location = "/docview/docview.html";
                    },
                    function() {
			//console.log('Error');
                    }
		);
	    }
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            // Find corresponding nav icon and select it
	    this.element.find('ul.main-nav li').removeClass('active');
	    if (this.lastActiveA != undefined) {
		this.lastActiveA.closest('li').addClass('active');
	    }
            //$('a[href="#' + oldVal + '"]').closest('li').removeClass('active');
            //$('a[href="#' + newVal + '"]').closest('li').addClass('active');

            if (newVal != 'manage_accounts') {
		$('#sys-setting').hide();
	    } else {
		var subcategory = $.route.attr('subcategory');
		if (subcategory === 'sys-setting') {
		    $('#sys-setting').show();
		    $('#sys-setting').docview_ui_syssetting('loadData');
		} else {
		    $('#sys-setting').hide();
		}
	    }
            if (newVal === "search") {
                /*
                // Save the search so when we come back it's shown immediately.
                if (this.options.clientState.attr('id') !== "") {
                    $.route.attr('id', this.options.clientState.attr('id'));                
                }
                if (this.options.clientState.attr('page') !== "") {
                    $.route.attr('page', this.options.clientState.attr('page'));
                }*/
            }
        },
        '{$.route} id change': function(el, ev, attr, how, newVal, oldVal) {
            if (newVal !== undefined) {
                this.options.clientState.attr('id', newVal);
            }
        },
        '{$.route} page change': function(el, ev, attr, how, newVal, oldVal) {
            if (newVal !== undefined) {
                this.options.clientState.attr('page', newVal);
            }
        }
    });
});
