steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/observe/delegate',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Single', {}, {
	init: function() {
            this.element.html(this.view('init', this.options.label));
	    this.id = '';
	},
	show: function() {
	    this.element.show();
	}, 
	getId : function() {
            return this.id;
        },
	validateInputOrEmpty: function(el) {
	    var docId = $.trim(el.find('.query').val());
	    if (docId =="") {
		this.id = '';
		return true;
	    }

	    return this.validateInput(el);
	},
	validateInput: function(el) {
	    this.removeFormErrors(el);
	    var docId = $.trim(el.find('.query').val());
	    if (this.verifyDocId(docId)) {
		this.id = docId;
		return true;
	    }

	    this.displayInputError(el, "query", "报关单号必须是18位数字。");
	},
	// Verifies individual document ids
        verifyDocId: function(id) {
            return /^\d{18}$/.test(id);
        },
	removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
            form.find('.error').removeClass('error');
        },
	displayInputError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        }
    });
});
