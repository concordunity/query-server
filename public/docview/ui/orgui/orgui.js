steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
  'docview/bootstrap/bootstrap-collapse.js'
).then(function($) {
    $.Controller('Docview.Ui.Orgui', {}, {
        init : function() {
            this.element.html(this.view('init'));

	    this.resetState();

	    this.labelMap = {
		'1000': '尚未选择关区',
		'2200': '所有关区',
		'2201': '浦江海关',
		'2202': '吴淞海关',
		'2225':'外港海关',
		'2233': '浦东机场海关',
		'2248': '洋山海关'
	    };

	    this.setSelectionValues();
	    //console.log(this.labelMap['2200']);
        },
	resetState : function() {
	    this.orgs = [];
	    
	    this.wildcard_selected = false;
	},
	setSelectionValues : function() {
	    this.wildcard_selected = false;
	    this.orgs = [];
	    var that = this;
	    this.element.find('form :checked').each(function() {
		var org = $(this).val();
		
		if (org === '2200') {
		    that.wildcard_selected = true;
		    return false;
		}
		that.orgs.push(org);
            });
	    var label = '';
	    if (this.wildcard_selected) {
		label = this.labelMap['2200'];
		$('#org-selected').html(this.view('org_label', label));
	    } else {
		$('#org-selected').empty();

		if (this.orgs.length == 0) {
		    label =  this.labelMap['1000'];
		    $('#org-selected').html(this.view('org_label', label));
		}

		for (var i=0; i<this.orgs.length; i++) {
		    label = this.labelMap[this.orgs[i]];
		    $('#org-selected').append(this.view('org_label', label));
		}
	    }
	},

	'.org-check change' : function(el, ev) {
	    //console.log("checkbox changed event ");
	    this.setSelectionValues();
	},

	setUIFromState: function() {
	    this.element.find("input.org-check").prop("checked", false);
	    if (this.wildcard_selected) {
		this.element.find('input[name="org"][value="2200"]').attr("checked",true);
	    } else {
		for (var i=0; i<this.orgs.length; i++) {
		    this.element.find('input[name="org"][value="' + this.orgs[i]+'"]').attr("checked",true);
		}
	    }
	},
	setOrgs: function(organizations) {
	    this.resetState();
	    if (organizations === '2200') {
		this.wildcard_selected = true;
	    } else {
		this.orgs = organizations.split(',');
	    }
	    this.setUIFromState();
	    this.setSelectionValues();
	},
	getOrgs : function() {
	    if (this.wildcard_selected) {
		return "2200";
	    }
	    return this.orgs.join(",");

	},
        show : function() {
        }
});
});

