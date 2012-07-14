steal('jquery/model', 'jquery/lang/json')

    .then(function($) {

$.Model('Docview.Models.Role',
/* @Static */
{
    /*models : function(data) {
        //console.log("[Models]", data);
        
        // Parse the data into something more usable for our views
        // We want to merge the roles array into the users array
        // Assume that the users array is 1:1 with the roles array in size
        for (var i = 0; i < data.users.length; i++) {
            data.users[i].roles = data.roles[i];
        }
        
        return this._super(data.users);
    },*/
    findAll : function(params, success, error) {
        return $.ajax({
            url : '/roles',
            type : 'get',
            data : params,
            success : success,
            error : error,
            
            dataType : 'json role.models'
        })
    },
    findOne: function(id, success, error) {
        return $.ajax({
            url: '/roles/' + id,
            type: 'get',
            dataType: 'json',
            success: success,
            error: error
        });
    },
    create : function(attrs, success, error) {
        return $.ajax({
            url : '/roles',
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
            url : '/roles/' + id,
            type : 'PUT',
            contentType : 'application/json',
            data : $.toJSON(attrs),
            dataType : 'json',
            success : success,
            error : error
        });
    },

    updateRole : function(id, attrs, success, error) {
        return $.ajax({
            url : '/accounts/roles/edit/' + id,
            type : 'POST',
            contentType : 'application/json',
            data : $.toJSON(attrs),
            dataType : 'json',
            success : success,
            error : error
        });
    },

    destroy : function(id, success, error) {
        return $.ajax({
            url : '/roles/' + id,
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