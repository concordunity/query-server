steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/bootstrap/bootstrap.css'
)

// View templates
.then(
    './views/init.ejs',
    './views/pages.ejs'
)

// External JS
.then(
    'docview/bootstrap/bootstrap-collapse.js'
)

.then(function($) {

    /*
    * Tree view for a selected document
    */
    $.Controller('Docview.Details.Tree',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('init', {}));
        },
	hideAll: function() {
	    this.element.hide();
	},
	'a.edit-tree click' : function(el, ev) {
	    ev.preventDefault();
            this.element.find('.nav').html(this.view('edit_pages', this.options.clientState.attr('document').groups));
	},
        'li a click': function(el, ev) {
            var href = el.attr('href');
            var pos = href.indexOf('#')
            if (pos !=-1) {
		// Set page to href value without the leading '#'
		this.options.clientState.attr('document').attr('current', +href.substring(1+pos)); 
	    }
	    //       this.options.clientState.attr('document').attr('current', +'5');
            ev.preventDefault();
        },
        '{clientState} document.current change': function(el, ev, attr, how, newVal, oldVal) {
            if (how === "set" || how === "add") {
                this.element.find('li').removeClass('active');
                this.element.find('.page-' + newVal).addClass('active');
            }
        },
        
        // Waits for data to be set in this form:
        // document: {
        //    pages: [] // Array of pages
        //    directory: "" // Location of image
        //    metadata: {} // metadata
        //    groups: [subgroup, subgroup, ...] // groups of images
        // }
        '{clientState} document change': function(el, ev, attr, how, newVal, oldVal)  {
            //console.log("[Attr]", attr);
            //console.log("[How]", how);
            //console.log("[Old]", oldVal);
            //console.log("[New]", newVal);
            
            if (attr === "document" && (how === "set" || how === "add")) {
                this.element.find('.nav').html(this.view('pages', newVal.groups));
            }
        }
    });
});
