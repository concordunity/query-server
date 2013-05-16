steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/index.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.index', {}, {
        init : function() {
           //this.element.html(this.view('init'));
	    this.createHtml();
	},
	hideHtml : function(){
	    $("#alerts").html("");
	},
	createHtml : function(){
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

            var requisition = false;
            var requisitionActions = this.options.clientState.attr('access').attr('requisition_docs');
            if (requisitionActions.attr('application') || requisitionActions.attr('approval')  || requisitionActions.attr('approval_guan') || requisitionActions.attr('register') || requisitionActions.attr('write_off') || requisitionActions.attr("lending_statistics")) {
                requisition = true;
            }

            var business_process = false;
            var business_processActions = this.options.clientState.attr('access').attr('business_process');
            if (business_processActions.attr('create_interchange_receipt') || business_processActions.attr('search_interchange_receipt') || business_processActions.attr('create_dishonored_bill') || business_processActions.attr('search_dishonored_bill') || business_processActions.attr('statistical_inquiry') ){ 
                business_process = true;
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
            var message = this.options.clientState.attr('login').attr('message');
	    //console.log(message);
            this.element.html(this.view('init', {
                user: this.options.clientState.attr('user'),
                search: search,
                stats: stats,
                requisition_docs: requisition,
                business_process: business_process,
                manage_docs: manage_docs,
                manage_accounts: manage_accounts,
		message: message
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
        '.img-welcome a click': function(el, ev) {
            ev.preventDefault();
	    this.lastActiveA = el;
	    $("#alerts").html("");
            // Change address bar to reflect link contents
            // This overwrites all other route attributes
            var newCategory = this.getHrefNoHash(el);
            if (newCategory !== $.route.attr('category')) {
                $.route.attrs({category: newCategory}, true);
            }
            $("ul.main-nav a").closest('li').removeClass('active');
            $("ul.main-nav a[href='#"+newCategory+"']").closest('li').addClass('active');
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            // Find corresponding nav icon and select it
	    this.element.find('ul.main-nav li').removeClass('active');
	    if (this.lastActiveA != undefined) {
		this.lastActiveA.closest('li').addClass('active');
	    }
            //$('a[href="#' + oldVal + '"]').closest('li').removeClass('active');
            //$('a[href="#' + newVal + '"]').closest('li').addClass('active');

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

