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
    'docview/ui/index',
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
	    this.lastActiveA = undefined;

	    var init_options = {
		search : ["single","multi","all_print","advanced","by_doc_source","search_condition","upload_file"],
		stats : ["stats_stats","stats_usage","stats_query","create_group"],
		requisition_docs : [ "application","application_nanhui" , "approval", "approval_guan", "register", "write_off", "lending_statistics", "requisition_history" ],
		business_process : ["create_interchange_receipt","search_interchange_receipt","create_dishonored_bill","search_dishonored_bill","statistical_inquiry"],
		manage_docs : ["print","testify","inquire","check","dh_report"],
		manage_accounts : ["users","roles","system_upload"]
	    };
		var that = this;
	    var init_option_result = {};
	    $.each(init_options,function(key,value){ 
	        var init_nav = false;
			var initActions = that.options.clientState.attr('access').attr(key);
			$.each(value,function(index,subnav){
				if (initActions.attr(subnav)) {
			    	init_nav = true;
				}
			});
			init_option_result[key] = init_nav;
	    })
	    
		this.element.html(this.view('menu_bar', {
                user: this.options.clientState.attr('user'),
                search: init_option_result.search,
                stats: init_option_result.stats,
                requisition_docs: init_option_result.requisition_docs,
				business_process: init_option_result.business_process,
                manage_docs: init_option_result.manage_docs,
                manage_accounts: init_option_result.manage_accounts
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
/*
	'a.brand[href="#"] img click' : function(el,ev) {
	    alert('====ie 9 ====');
	    //ev.preventDefault();
	    $("#alerts").docview_ui_index("createHtml");
	},
*/
	'#navigation-header .brand click' : function(el,ev) {
	    //alert('====ie 7 ====');
	    //ev.preventDefault();
	    $("#alerts").docview_ui_index("createHtml");
	},
        '.main-nav a click': function(el, ev) {
            ev.preventDefault();
	    this.lastActiveA = el;
	    $("#alerts").docview_ui_index("hideHtml");	
            // Change address bar to reflect link contents
            // This overwrites all other route attributes
            var newCategory = this.getHrefNoHash(el);
            if (newCategory !== $.route.attr('category')) {
                $.route.attrs({category: newCategory}, true);
            }
        },
        '.user-info a click': function(el, ev) {
            ev.preventDefault();
	     $("#alerts").docview_ui_index("hideHtml");
            // Change address bar to reflect link contents
            // This overwrites all other route attributes
            var newCategory = this.getHrefNoHash(el);
            if (newCategory !== $.route.attr('category')) {
                $.route.attrs({category: newCategory}, true);
            }
        },
        '.logout a click': function(el, ev) {
			if (confirm("您确定要退出登录吗？")) {
				Docview.Models.User.logout(
					function() {
				//		log("system",{current_action: "system.logout", describe: "成功退出系统。"});
						console.log('logout');
						window.location = "/";
                    },
					function() {
						window.location = "/";
						console.log('out of date ?');
                    }
				);
			}else{
				ev.preventDefault();
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
				$("#system-upload").hide();
				//$("#manage-business-agency-maintain").hide();
			} else {
				var subcategory = $.route.attr('subcategory');
				//console.log("cat and sub",newVal,subcategory);

				if (subcategory === 'business_agency_maintain') {
				//	alert("======");
				//	$("#manage-business-agency-maintain").show();
				//	$('#sys-setting').docview_ui_agency('loadData');
				} else {
				//	$("#manage-business-agency-maintain").hide();
				}
				if (subcategory === 'sys-setting') {
					$('#sys-setting').show();
					$('#sys-setting').docview_ui_syssetting('loadData');
				} else {
					$('#sys-setting').hide();
				}
				if (subcategory === 'system_upload') {
					$("#system-upload").show();
				} else {
					$("#system-upload").hide();
				}
			}


			if (newVal != 'stats') {
				$('#stats-export').hide();
				$('#group-docs').hide();
			} else {
				var subcategory = $.route.attr('subcategory');
				if (subcategory === 'stats_export') {
					$('#stats-export').show();
				} else {
					$('#stats-export').hide();
				}
				if (subcategory === 'create_group') {
					$('#group-docs').show();
				} else {
					$('#group-docs').hide();
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
