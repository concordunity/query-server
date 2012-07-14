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

// External JS
.then(
    'docview/bootstrap/bootstrap-button.js',
    'docview/bootstrap/bootstrap-alert.js'
)

.then(function($) {
    /*
    * Manage user accounts and roles
    */
    $.Controller('Docview.Manage.Accounts.Roles.Edit',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
	    this.element.html(this.view('init', this.options));
	    var role_hack = this.options.role.display_name;
	    
	    var permissions = this.options.role.permissions.split(',');
	    $.each(permissions, function(index, value) {
		//console.log("about to set " + value + " to checked.");
		$('input[name='+value +']').attr('checked', 'checked');
	    });
	},

        '.edit-role-form submit': function(el, ev) {
            ev.preventDefault();
	    $('#alerts div.alert').alert('close');

            
            // Clear any previous error messages in the form
            this.removeFormErrors(el);
            // double check the permission list.
	    
	//    var jsonObject = new Object();                
	    var formParams = el.find('input[type="checkbox"]');
            var rolePermissions = new Array();
	    var roleDescriptions = new Array();
            $.each(formParams, function(key, value) {

		if (value.checked) {
		    //console.log(key, value);
		    rolePermissions.push(value.name);

		    roleDescriptions.push($('#' + value.id).closest('li').text());
		}
//		//console.log(value.name, + ", " + value.val() + " checked ==" + value.checked);
//	        rolePermissions.push(key);
	    });

	    var role = el.closest('tr').prev().model();
            role.attr('rolePermissions', rolePermissions);
	    role.attr('display_name', roleDescriptions.join(', '));
	    Docview.Models.Role.updateRole(role.id, { rolePermissions : rolePermissions,
						  display_name : roleDescriptions.join(', ') },
				       this.options.success, this.options.error);
	    //proxy('updateRoleRow'), this.proxy('failure'));
                // Lock the save and cancel buttons
               
                
//	    $.ajax({
//		url : "/roles/" + role.id,
//		type : 'PUT',
//		data : { 'rolePermissions' : rolePermissions },
//		dataType: 'json',
//		success : this.proxy('updateRoleRow'),
//		error : this.proxy('failure') 
//	    });
		   el.find('.btn-primary').button('loading');
                   el.find('.cancel-edit').button('loading');
                // Save
            //user.save(this.proxy('updateUserRow'));
        },
        // Form utility functions
        displayFormError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
        removeFormErrors: function(form) {
            form.find('.error > .help-inline').remove();
            form.find('.error').removeClass('error');
        }
    });
});