steal(
    './docview.css', 			// application CSS file
    './models/models.js',		// steals all your models
//    './fixtures/fixtures.js',	// sets up fixtures for your models
    'jquery',
//    'docview/nav',
//    'docview/subnav',
    'docview/alerts',
//    'docview/search',
//    'docview/manage/accounts/users',
//    'docview/ui/details',
    'docview/login'
).then(
    'libs/jquery.i18n.min.js'
).then(
    'docview/label_zh_CN.js'
).then(
	function(){
	    new LabelChinese().initLabelSettings();    
        // Client State
        var state = new $.Observe({
            alert: {
                type: "info",
                heading: "",
                message: ""
            },
            user: {
                username: "",
                fullname: ""
            },
            // Initial access list
            access: {
                search: {
                    single : false,
                    multi : false,
                    advanced : false,
		    by_doc_source : false,
		    upload_file : false,
		    search_condition : false
                },
                stats: {
                    stats_stats : false,
		    stats_query : false,
                    create_group : false,
                    stats_usage : false,
		    stats_export : false,
		    advanced : false
                },
                manage_docs: {
                    inquire: false,
                    check: false,
                    copy: false,
                    print: false,
                    testify: false
                },
                manage_accounts: {
                    users: false,
                    system_upload: false,
                    syssetting: false,
                    roles: false
                }
            },
            // Nav menu state
            nav: {
                search: "",
                stats: "", // "history",
                manage_docs: "", // "inquire",
                manage_accounts: ""   //"users"
            },
            // Search term state
            search: {
                ids: [],
                filters: []
            },
            // Document viewer state
            document: {
                pages: [],
                directory: ""
            },
	    searchMode: "single"
        });
            
            $('#alerts').docview_alerts({clientState: state});
            $('#login').docview_login({clientState: state});

        

        // The method below doesn't work because we don't have user info from the access list.
        // Try to get the access list
        // If this fails, then we know we're not logged in and we need to log in
        // 401 Unauthorized
        // {"error":"You need to sign in or sign up before continuing."}
	}    
)
