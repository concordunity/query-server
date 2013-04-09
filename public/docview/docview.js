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
    'docview/bootstrap/bootstrap-button.js',
    'libs/jquery.i18n.min.js',
    'libs/jquery.mask.js'
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
	    login: {
		message: ""
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
                requisition_docs: {
					application : false,
					application_nanhui : false,
					approval: false,
					approval_guan: false,
					register : false,
					write_off :false,
					lending_statistics : false,
					requisition_history: false
				}, 
				business_process: {
					create_interchange_receipt: false,
					search_interchange_receipt: false,
					create_dishonored_bill: false,
					search_dishonored_bill: false,
					statistical_inquiry: false
				},
                manage_docs: {
                    inquire: false,
                    check: false,
                    copy: false,
                    print: false,
					all_print : false,
                    testify: false
                },
                manage_accounts: {
                    users: false,
                    system_upload: false,
                    syssetting: false,
                    business_agency_maintains: false,
                    roles: false
                }
            },
            // Nav menu state
            nav: {
                search: "",
                stats: "", // "history",
                requisition_docs: "", // "application",
				business_process: "", //business_process
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

            $('#footer-banner').html($.View("//docview/ui/views/version.ejs"));

        // The method below doesn't work because we don't have user info from the access list.
        // Try to get the access list
        // If this fails, then we know we're not logged in and we need to log in
        // 401 Unauthorized
        // {"error":"You need to sign in or sign up before continuing."}
	}    
)
