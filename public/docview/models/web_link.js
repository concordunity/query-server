steal('jquery/model', 'jquery/lang/json').then(function($) {

$.Model('Docview.Models.WebLink',
/* @Static */
{
    findAll : function(params, success, error) {
        return $.ajax({
            url : '/web_links',
            type : 'get',
            data : params,
            success : success,
            error : error,
            
            dataType : 'json web_link.models'
        })
    },
    create : function(attrs, success, error) {
        return $.ajax({
            url : '/web_links',
            type : 'POST',
            contentType : 'application/json',
            data : $.toJSON(attrs),
            dataType : 'json',
            success : success,
            error : error
        });
    },


    update : function(id, attrs, success, error) {
        return $.ajax({
            url : '/web_links/' + id,
            type : 'PUT',
            contentType : 'application/json',
            data : $.toJSON(attrs),
            dataType : 'json',
            success : success,
            error : error
        });
    },
    destroy : function(id, success, error) {
        return $.ajax({
            url : '/web_links/' + id,
            type : 'DELETE',
            dataType : 'json',
            success : success,
            error : error
        });
    }

},
/* @Prototype */
{});

});
