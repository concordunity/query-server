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
    'docview/ui/details',
    './fixtrues.js'
).then(function($) {
    $.Controller('Docview.Ui.print', {}, {
        init : function() {
	   new LabelChinese().initLabelSettings();
	
	   this.element.hide();
        },
	createHtml : function(){
           this.element.html(this.view('init'));
           //$(".all_print").html(this.view('init'));
	   $('div.print_holder').docview_ui_multi();
	},
        show : function() {
	   this.createHtml();
	   console.log("====");
	   this.element.show();
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {
            var cat = $.route.attr('category');
            var sub_cat = $.route.attr('subcategory');
            if (cat == 'manage_docs' && sub_cat == 'all-print') {
                this.element.show();
            } else  {
                this.element.hide();
            }
        },
        'td a click': function(el, ev) {
            ev.preventDefault();
            var document = el.closest('tr').model();
            $.route.attrs({category: 'document', id: document.doc_id}, true);
            $('#document-details').docview_ui_details('queryDoc', document.doc_id);
            $('#search-box').hide();
        },
        clearResults: function() {
            if (this.oTable != undefined) {
                this.oTable.fnClearTable();
            }
	    console.log("=====clearResults=====");
	    $('div#all-print-list').html("");
        },
	".all_print submit" : function(el,ev){
            ev.preventDefault();
	    console.log("=====print-all=====");
	    this.printAll({doc_ids : ['222520121250004811']})
	},
	printAllDoc : function(files) {
	   //console.log(data.doc_ids);
	   var file_path = [];
	   var host = window.location.host;
	   Docview.Models.Doc.allPrintDoc({doc_ids:files},function(data){
		console.log(data);
		for(var i = 0;i< data.path.length;i++){
		    var tmp = data.path[i];
			//protocol
		    file_path.push(window.location.protocol + '//' + host + tmp); 
		}
		//console.log(file_path);
		$.print(file_path); 
  	   },this.proxy("failure")); 
	},
	printAll : function(data) {
	    console.log("will print doc_ids is ",data);
	    Docview.Models.Doc.findAllPrint({doc_ids: data.doc_ids},this.proxy("showList"),this.proxy("failure")); 
	},
	showList : function(data) {
	    //$('div#all-print-list').html(this.view('list',data));
	    $("div#all-print-list").show();
	    $('div#all-print-list').html(this.view('list',data));
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
	},
        failure: function(jqXHR, textStatus, errorThrown) {
            var t = 'error';
            var h = '错误提示：';
            var message = '需要用户认证，请重新登录系统。';
            var docid = $.route.attr('id');

            if (jqXHR.status == 404) {
                type = 'info';
                message = '系统中没有单证' + docid + '档案信息';
            } else if (jqXHR.status == 204) {
                type = 'info';
                message = '单证标签种类失败';
            } else if (jqXHR.status == 403) {
                type = 'info';
                message = '无法查阅单证'+ docid + '，权限不足。';
            } else if (jqXHR.status == 500) {
                message = '系统内部错误';
            } else if (jqXHR.status == 407) {
                message = '系统安全子系统未初始化，请联系管理员。';
            } else if (jqXHR.status == 400) {
                message = '系统内部错误： 无法获取单证电子图像。';
            } else if (jqXHR.status == 401) {
                message = '系统内部错误： 系统繁忙，请稍后再试。';
            }
            this.options.clientState.attr('alert', {
                type: t,
                heading: h,
                message : message
            });
        //console.log("[Error]", data);
        }

});
});

