steal('jquery/model', function() {

$.Model('Docview.Models.User',
/* @Static */
{
    models : function(data) {
        // Parse the data into something more usable for our views
        // We want to merge the roles array into the users array
        // Assume that the users array is 1:1 with the roles array in size
        for (var i = 0; i < data.users.length; i++) {
            data.users[i].roles = data.roles[i];
        }
        
        return this._super(data.users);
    },
    findAll : function(params, success, error) {
        return $.ajax({
            url : '/accounts',
            type : 'get',
            data : params,
            success : success,
            error : error,
            
            dataType : 'json user.models'
        })
    },

    getUserSelect : function(params, success, error) {
        return $.ajax({
            url : '/user_select',
            type : 'get',
            data : params,
			async : true,
            success : success,
            error : error
        })
    },
    getDialog : function(params, success, error) {
        return $.ajax({
            url: '/get_dialog',
            type: 'get',
            data : params,
            dataType: 'json',
            success: success,
			async : true,
            error: error
        });
    },
    setDialog : function(params, success, error) {
        return $.ajax({
            url: '/set_dialog',
            type: 'get',
            data : params,
            dataType: 'json',
			async : true,
            success: success,
            error: error
        });
    },
    findOne: function(id, success, error) {
        return $.ajax({
            url: '/accounts/' + id,
            type: 'get',
            dataType: 'json',
            success: success,
            error: error
        });
    },
    create : function(attrs, success, error) {
        return $.ajax({
            url : '/accounts',
            type : 'POST',
            data : attrs,
            dataType : 'json',
            success : success,
            error : error
        });
    },
    update : function(id, attrs, success, error) {
        return $.ajax({
            url : '/accounts/' + id,
            type : 'PUT',
	    contentType: 'application/json',
            data : $.toJSON(attrs),
            dataType : 'json',
            success : success,
            error : error
        });
    },
    destroy : function(id, success, error) {
        return $.ajax({
            url : '/accounts/' + id,
            type : 'DELETE',
            dataType : 'json',
            success : success,
            error : error
        });
    },
    getAccessList : function(success, error) {
        return $.ajax({
            url : '/accounts/get_links',
            type : 'GET',
            dataType : 'json',
            success : success,
            error : error
        });
    },
    login : function(params, success, error) {
        return $.ajax({
            url : '/users/login',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : success,
            error : error
        });
    },

    checkIfLocked : function(username, success, error) {
        return $.ajax({
            url : '/users/isLocked',
            type : 'POST',
            data : { username : username },
            dataType : 'json',
            success : success,
            error : error
        });
    },
    logout : function(success, error) {
        return $.ajax({
            url : '/users/logout',
            type : 'GET',
          //  dataType : 'json',
            success : success,
            error : error
        });
    },
    changePassword : function(attrs, success, error) {
	return $.ajax({
	    url : '/accounts/chpwd',
	    type : 'POST',
	    contentType : 'application/json',
	    data : $.toJSON(attrs),
	    dataType : 'json',
	    success : success,
	    error : error
	});
    },

    getSetting: function(success, error) {
	return $.ajax({
	    url: '/settings',
	    type: 'GET',
	    dataType : 'json',
	    success : success,
	    error : error
	});
    },

    setSetting: function(data, success, error) {
	return $.ajax({
	    url: '/settings/update',
	    type: 'POST',
	    data: data,
	    dataType : 'json',
	    success : success,
	    error : error
	});
    }

},
	/* @Prototype */
	{});
});         
