steal('jquery/model', function() {

$.Model('Docview.Models.File',
/* @Static */
{/*
	findAll: "/recipes.json",
  	findOne : "/recipes/{id}.json", 
  	create : "/recipes.json",
 	update : "/recipes/{id}.json",
  	destroy : "/recipes/{id}.json"*/
    //findOne: "/documents/{id}.json"
    findOne: function(id, attrs, success, error) {
        return $.ajax({
            url: '/docs/' + id,
            type: 'post',
            contentType : 'application/json',
            data: $.toJSON(attrs),
            dataType: 'json',
            success: success,
            error: error
        });
    }
},
/* @Prototype */
{});

});