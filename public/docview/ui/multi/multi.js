steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs')

.then(function($) {
  $.Controller('Docview.Ui.Multi', {},
    {
	init: function() {
            this.element.html(this.view('init'));
	    this.ids = [];
      },
	show: function() {
	    this.element.show();
	},
	setUIValue: function(ids) {
	    var ta = this.element.find('.query');

	    this.element.find('.query').val(ids);
	},
	getIds : function() {
            return this.ids;
        },
	validateInput: function(el) {
	    this.removeFormErrors(el);
	    var query = el.find('.query').val();
	    $.trim(query);
	    
	    if (!query) {
                this.displayTextareaError(
		    el, 'query', 
		    '输入内容不能为空');
		return false;
	    }
            var tokens = query.split(/\s+/);
	    this.ids = new Array();

            for (var i = 0; i < tokens.length; i++) {
                var docId = $.trim(tokens[i]);
                if (this.verifyDocId(docId)) {
                    this.ids.push(docId);
                } else {
                    var errorAt = docId;
                    break;
                }
	    }

	    if (this.ids.length > 50) {
                this.displayTextareaError(
		    el, 'query', 
		    '单证数不能超过 50');
		return false;
	    }
	    if (errorAt !== undefined) {
                this.displayTextareaError(
		    el, 'query', 
		    '输入错误，"' + errorAt + '"');
		return false;
            }

	    return true;
	},

	removeFormErrors: function(form) {
            form.find('.error .help-inline').remove();
            form.find('.error').removeClass('error');
        }, 
	displayTextareaError: function(form, name, message) {
            var inputField = form.find('textarea[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
	displayInputError: function(form, name, message) {
            var inputField = form.find('input[name="' + name + '"]');
            inputField.closest('.control-group').addClass('error');
            inputField.after('<span class="help-inline">' + message + '</span>');
        },
	// Verifies individual document ids
        verifyDocId: function(id) {
            return /^\d{18}$/.test(id);
        }
    });
});
