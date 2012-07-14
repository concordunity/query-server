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
    './views/init.ejs'
)

.then(function($) {

    /*
    * Breadcrumbs for search
    */
    $.Controller('Docview.Breadcrumbs',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('init', {}));
            this.element.hide();
        },
        '{clientState} alert change': function(el, ev, attr, how, newVal, oldVal) {
            this.element.html(this.view('alert', newVal));
        }
    });
});
