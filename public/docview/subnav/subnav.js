steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/bootstrap/bootstrap.css',
    'docview/docview.css',
    './subnav.css'
)

// View templates
.then(
    'docview/ui/syssetting',
    './views/manage_docs.ejs',
    './views/requisition_docs.ejs',
    './views/manage_accounts.ejs',
    './views/stats.ejs'
)

.then(function($) {

    /*
    * Sub-navigation bar (sits under the main nav)
    */
    $.Controller('Docview.Subnav',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('subnav_init', {}));
            
            // Hide box until route conditions are met
            this.element.hide();
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    this.options.clientState.attr('menu').attr("subcategory", oldVal);
	    var category = $.route.attr('category');
	    var subcategory = $.route.attr('subcategory');
	    var log = '导航事件:=>一级导航:' + category + ';二级导航:' + subcategory;
	    if(oldVal && newVal){
	        log += ';（' + oldVal +' => ' + newVal +')';
	    }
	    //console.log(log);
	},
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
	    this.options.clientState.attr('menu').attr("category", oldVal);
            switch (newVal) {
                case "search":
                case "manage_docs":
                case "requisition_docs":
                case "business_process":
                case "manage_accounts":
		case "stats":
		    this.element.find('ul').html(this.view(newVal, this.options.clientState.attr('access').attr(newVal)));
		    this.element.find('li').removeClass('active');

		    // If the user entered the page by manually entering the url with
		    // the subcategory, then it should be defined.
		    var subcategory = $.route.attr('subcategory');

		    if (subcategory === 'sys-setting') {
			    $('#sys-setting').show();
		    }
		    if (subcategory === 'system-upload') {
			    //$('#system-upload').show();
		    }
		    if (subcategory !== undefined) {
			    // Restore subcategory state from $.route
			    this.element.find('a[href="#' + subcategory + '"]').closest('li').addClass('active');
			    this.options.clientState.attr('nav').attr(newVal, subcategory);
		    } else {
		        // Restore subcategory state from clientState
			    subcategory = this.options.clientState.attr('nav').attr(newVal);
			    if (subcategory === 'sys-setting') {
				    $('#sys-setting').show();
			    }	
			    if (subcategory === 'stats_export') {
				    $('#stats-export').show();
			    }	
			    if (subcategory === 'system_upload') {
				    $('#system-upload').show();
			    }	
			    this.element.find('a[href="#' + subcategory + '"]').closest('li').addClass('active');
			    $.route.attr('subcategory', subcategory);
		    }

		    this.element.show();
		    break;
		case "document":
		    break;
		default:
		    this.element.hide();
            }
        },
        getHrefNoHash: function(el) {
            var shref = el.attr('href');
            var pos = shref.indexOf('#'); 
            if (pos < 0) {
               return shref;
            }

            return shref.substring(pos + 1);
        },
        'a click': function(el, ev) {
            ev.preventDefault();
            // Simple way: clear all active and set the new one
            this.element.find('li').removeClass('active');
            el.closest('li').addClass('active');
            
            // Update subcategory
            var subcategory = this.getHrefNoHash(el);
            $.route.attr('subcategory', subcategory);
            
            // Save subcategory state
            this.options.clientState.attr('nav').attr($.route.attr('category'), subcategory);


	    if (subcategory === 'sys-setting') {
		$('#sys-setting').show();
		$('#sys-setting').docview_ui_syssetting('loadData');

	    } else {
		$('#sys-setting').hide();
	    }
			if (subcategory === 'business_agency_maintain') {
				//$('#manage-business-agency-maintain').show();
				//$('#manage-business-agency-maintain').docview_ui_agency('loadData');

			} else {
				//$('#manage-business-agency-maintain').hide();
			}
	    if (subcategory === 'system_upload') {
		$('#system-upload').show();
	    } else {
		$('#system-upload').hide();
	    }

	    if (subcategory === 'stats_export') {
		$('#stats-export').show();
	    } else {
		$('#stats-export').hide();
	    }

	    // Check for search sub tabs
	    if (subcategory == 'single' || subcategory == 'multi' || subcategory == 'advanced' || subcategory == 'personal_history' || subcategory == 'upload' || subcategory == 'search_some_condition' || subcategory == 'all_print') {
		$('#document-details').hide();
	    }
        }
    });
});
