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
  $.Controller('Docview.Docgroup.Dgselect', {},
    {
	init: function() {
            this.element.html(this.view('init'));
	},
	reloadDocGroup : function () {
	    this.element.find('.dg_select option').remove();
	    Docview.Models.DocGroup.findAll(this.proxy('listGroups'), this.proxy('failure'));
	},
	listGroups : function(data) {
	    this.element.find('.dg_select').append(this.view('options', data));
	},
	failure : function(error) {
	}
    });
});