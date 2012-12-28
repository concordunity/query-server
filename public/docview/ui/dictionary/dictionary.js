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
    $.Controller('Docview.Ui.dictionary', {}, {
        init : function() {
	},
	createView : function(){
           this.element.html(this.view('init'));

            var table_options = {
                aaData: [],

                col_def_path : "//docview/ui/dictionary/views/",
                aoColumns: [
                    {"mDataProp":"dic_type", mLabel : '类别'},
                    {"mDataProp":"dic_name", mLabel : '名称'},
                    {"mDataProp":"dic_num", mLabel : '值'}
//                    {"mDataProp":null, mLabel : '操作', sClass: 'nolinebreak' }
                ],
                file_name: ""
            };
            this.element.find('.dictionary-list').docview_ui_dmstable({table_options : table_options});
            this.tableController = this.element.find('.dictionary-list').controller();

        },
	exportToExcel : function(el,ev){
		this.tableController.saveToExcel();
	},
	setView : function(data,doc_type,format_type){
	    this.tableController.setModelData(data);	    	    	    	
	},
	getDictionary : function(data){
	    var labelMap = []; 
	    Docview.Models.File.getDictionary({dic_type: data},function(data){
		    labelMap = data; 
		    },{});
	    return labelMap; 
	},
	updateDictionary: function(){
	    Docview.Models.File.updateDictionary({},{ },{});
	},
        show : function() {
        }
});
});

