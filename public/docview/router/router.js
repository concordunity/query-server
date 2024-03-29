steal('jquery')

.then(
	'jquery/controller',
	'jquery/view/ejs',
    'jquery/dom/route'
)

.then(function($) {

    /*
    * Controls pretty routes and triggering the correct page loads
    */
    $.Controller('Docview.Router',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            // Delay the setting of $.route.data
            $.route.ready(false);
            $.route(":category/:page", { "category":"", "page":"" });
            
            $.route.ready(true);
            
            // Set default page
            if ($.isEmptyObject($.route.attrs())) {
                $.route.attrs({ "category": "admin", "page": "roles" }, true);
            }
        },
        ":category/:page change": function(routeData) {
            //console.log(routeData);
        }
        
        ,
        '{$.route} change': function(el, ev, attr, how, newVal, oldVal) {
            //console.log("[Route changed]", "Attribute:", attr, "Event:", how, newVal, oldVal);
        }
    });
});
