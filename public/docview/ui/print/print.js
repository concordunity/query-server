steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'libs/jquery.print.js',
    './views/init.ejs',
    './print_model.js'
).then(
    'docview/ui/multi',
    './fixtrues.js'
).then(function($) {
    $.Controller('Docview.Ui.print', {}, {
        init : function() {
	   new LabelChinese().initLabelSettings();
           $(".all_print").html(this.view('init'));
	   $('.all_print div.print_holder').docview_ui_multi();
	   this.element.hide();
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal !== "search") {
                this.element.hide();
                this.mainTabOn = false;
            } else if ($.route.attr('subcategory') == 'all_print') {
                this.mainTabOn = true;
                this.element.show();
            }
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal) {
            if (this.mainTabOn || $.route.attr('category') == 'search') {
                if (how === "add" || how === "set") {
                    if (newVal === "all_print") {
                        this.element.show();
                    } else {
                        this.element.hide();
                    }
                }
            }
        },
        show : function() {
	   this.element.show();
        },
	"form.all_print submit" : function(el,ev) {
	    ev.preventDefault();	
            var ctrl = $('.all_print div.print_holder').controller();
            if (ctrl.validateInput(el) ) {
	    //var search_doc = el.find("");
	    //Docview.Models.Print.findAll({docs: search_doc},this.proxy("showList"),this.proxy("faliure")); 
		var ids = ctrl.getIds();
                console.log(ids);
	    }
	},
	showList : function(data) {
	    $('div.print-list').html(this.view('list',data));
	},
	'.print.btn click':function(el){
		var checkedFiles =  $(el).parent().find('input[type=checkbox]:checked');
		var basePath = 'http://static.lsong.org/';
		var files = [];
		$(checkedFiles).each(function(i,item){
			files.push(basePath + item.value);
		});
		//print files ..
		$.print(files);
	}
});
});

