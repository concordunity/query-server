steal('jquery/model', function() {
    
$.Model('Docview.Models.DocGroup', {
  
  findAll : function(success, error) {
    return $.ajax({
	url: '/doc_groups',
	type: 'get',
	dataType: 'json doc_group.models',
        success : success,
        error : error
    });
  },

  findOne: function(id, success, error) {
        return $.ajax({
            url: '/doc_groups/' + id,
            type: 'get',
            dataType: 'json',
            success: success,
            error: error
        });
  },

    create : function(attrs, success, error) {
        return $.ajax({
            url : '/doc_groups',
            type : 'POST',
            data : attrs,
            dataType : 'json',
            success : success,
            error : error
        });
    },
  update : function(id, attrs, success, error) {
        return $.ajax({
            url : '/doc_groups/' + id,
            type : 'PUT',
            data : attrs,
            dataType : 'json',
            success : success,
            error : error
        });
    }, 

    destroy : function(id, success, error) {
        return $.ajax({
            url : '/doc_groups/' + id,
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