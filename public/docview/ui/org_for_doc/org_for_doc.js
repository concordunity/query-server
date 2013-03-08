steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
	'docview/ui/dmstable'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.org_for_doc', {}, {
        init : function() {
		   this.createView();
        },
	createView : function(){
           this.element.html(this.view('init'));
			//var div_tag = this.element.options.div_tag;	
            var table_options = {
                aaData: [],

                col_def_path : "//docview/ui/org_for_doc/views/",
                aoColumns: [
                    {"mDataProp":"org_number", mLabel : '识别号'},
                    {"mDataProp":"org_name", mLabel : '名称'},
                    {"mDataProp":"org", mLabel : '关区号'}
//                    {"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
                ],
                file_name: ""
            };
			
            this.element.find('.org-for-doc-list').docview_ui_dmstable({table_options : table_options});
            this.tableController = this.element.find('.org-for-doc-list').controller();

        },
	exportToExcel : function(el,ev){
		this.tableController.saveToExcel();
	},
	setView : function(data,doc_type,format_type){
	    this.tableController.setModelData(data);	    	    	    	
	},
	getOrgForDoc: function(data){
	    var labelMap = []; 
	    Docview.Models.File.getOrgForDoc({dic_type: data},function(data){
		    labelMap = data; 
		    },{});
	    return labelMap; 
	},
	show : function() {
			   Docview.Models.File.getOrgForDoc({asy: true, doc_type: ""},this.proxy("setView"), {})
    }
});
});

