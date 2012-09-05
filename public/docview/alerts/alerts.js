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
    './views/alert.ejs'
)

// External JS
.then(
    'docview/bootstrap/bootstrap.min.js'
)

.then(function($) {

    /*
    * Manage user accounts and roles
    */
    $.Controller('Docview.Alerts',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function(options) {
            // Since this initializes with nothing in it we don't have to do anything.
        },
        '{clientState} alert change': function(el, ev, attr, how, newVal, oldVal) {
            this.element.html(this.view('alert', newVal));
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
	    $('#alerts div.alert').alert('close');
	},
	showMessages : function(type, title, p, messages) {
	    //console.log('showMessage ', type, title, messages);
            this.element.html(this.view('message_list', {
		type: type,
		title: title,
		p : p,
		messages : messages
	    }));
	}
    });
});
