steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
	'docview/ui/pagingtable',
	'libs/org_json.js',
	'libs/org_arr.js',
	'libs/jquery.alert.js',
	'libs/jquery.placeholder.js'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.orginfo', {}, {
        init : function() {
		   //this.element.hide();
           this.element.html(this.view('init'));
		   this.tableController = this.element.find('.orginfo-list').docview_ui_pagingtable({
			   tmpl_path: "/docview/ui/orginfo/views/col_",
			   columns:[
					{id: "org", text: "关区" },
					{id: "subjection_org", text: "业务点" },
					{id: null, text: "操作" , styly: "nolinebreak"}
			   ]
			   }).controller();
				this.loadData();
        },
		loadData : function(){
			console.log(" this is reload.....");
			this.tableController.reload({
				url:"/org_info",
				type:"get",
				data:{},
				success:function(data){}
				});	
		},
		"form[name=orginfo] submit" : function(el,ev){
			ev.preventDefault();
			var that = this;
			var org = $("input[name=org]").val();
			var subjection_org = $("select[name=subjection_org]").val();
			$.ajax({
				url: "/org_info/create",
				data: {org_info:{org: org ,subjection_org: subjection_org}},
				type: "post",
				success: function(){
						that.loadData();
						$.alterMessage(that,{msg:"关区业务点对应记录创建成功"});
					}
				});
		},
		"form[name=edit-orginfo] submit" : function(el,ev){
			ev.preventDefault();
			var that = this;
			var org = $("input[name=org]").val();
			var subjection_org = $("select[name=subjection_org]").val();
			$.ajax({
				url: "/org_info/update",
				data: {org_info:{org: org ,subjection_org: subjection_org}},
				type: "put",
				success: function(){
						that.loadData();
						$.alterMessage(that,{msg:"关区业务点对应记录创建成功"});
					}
				});
		},
        '.btn-edit click':function(el,ev){
			ev.preventDefault();
			var row = this.tableController.getRowFrom(el);
			row.element.after( $.View('//docview/ui/orginfo/views/detial_form.ejs',row.model) );
			row.element.hide();
			var detial_form = row.element.next();
			detial_form.find('.btn-cancel').click(function(ev){
					ev.preventDefault();
					detial_form.remove();
					row.element.show('slow');
					});
		},
		'.btn-delete click':function(el,ev){
			var that = this;
			var row = this.tableController.getRowFrom(el);
			$.ajax({
				url:'/org_info/delete',
				type:'delete',
				data:{ id: row.model.id  },
				error:function(){

				},
				success:function(){
					$.alertMessage(that,{msg:'关区业务点对应记录删除成功'});
					that.loadData();
				}
			});
		},
		show : function() {
	    }
});
});

