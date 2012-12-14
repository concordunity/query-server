steal('jquery/model', function(){

/** 
 * @class PrintProject.Models.Print
 * @parent index
 * @inherits jQuery.Model  
 * Wraps backend print services.  
 */
$.Model('Docview.Models.Print',
/* @Static */
{
        findAll: "/prints.json",
        findOne : "/prints/{id}.json", 
        create : "/prints.json",
        update : "/prints/{id}.json",
        destroy : "/prints/{id}.json"
},
/* @Prototype */
{});

})

