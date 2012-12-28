steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    'libs/org_arr.js',
    'docview/bootstrap/bootstrap.min.js'
).then(function($) {
    $.Controller('Docview.Ui.Orgui', {}, {
        init : function() {
	    //var orgs = this.options.orgs;
	    var orgs = orgArrayDictionary; 
	    console.log('==org_arr.js==');
	    console.log(orgArrayDictionary);
	    //console.log('==org==');
	    //console.log(orgs);
            this.element.html(this.view('init',{orgsDic : orgs}));

	    this.resetState();
	    var strjson = '{"';
	    strjson = strjson + "1000" + '" : "'+  "尚未选择关区" +'" , "';
	    for(var i = 0;i < orgs.length;i++){
		var org = orgs[i];
//		if (org.dic_num == 2200) {
//			org.dic_name = "所有关区";
//		}
		if (org.dic_num == 2200) {
		    strjson = strjson +'2200" : "所有关区';
		}else{
		    strjson = strjson + org.dic_num + '" : "'+  org.dic_name;
		}
		if (i+1 < orgs.length){
		    strjson = strjson + '" , "';
		}
	    } 
	    strjson = strjson + '"}';
	    console.log("orgs json is:",strjson);
	    this.labelMap =  eval('(' + strjson + ')');  
/*
	    this.labelMap = {
		'1000': '尚未选择关区',
		'2200': '所有关区',
		'2201': '浦江海关',
		'2202': '吴淞海关',
		'2225':'外港海关',
		'2233': '浦东机场海关',
		'2248': '洋山海关',
		'2210': '浦东海关',
		'2203': '虹桥机场海关',
		'2209': '浦江龙吴海关',
		'2218': '外高桥保税区',
		'2204': '经济技术开发区',
		'2212': '奉贤海关',
		'2213': '莘庄海关',
		'2217': '嘉定海关',
		'2220': '金山海关',
		'2221': '松江海关',
		'2241' : '现场业务一处',
		'2242': '现场业务二处',
		'2243' : '现场业务三处',
		'2206': '驻邮局办事处',
		'2205':'驻车站办事处',
		'2223': '驻南汇办事处',
		'2224': '驻崇明办事处'
	    };
*/

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

