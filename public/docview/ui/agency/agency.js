steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'libs/jquery.alert.js',
    'libs/jquery.placeholder.js',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.agency', {}, {
        init : function() {
			this.subjection_org = this.options.clientState.attr('user').subjection_org;
			this.element.html(this.view('init',this));
			this.element.hide();
			this.tableController = this.element.find('.agency-list').docview_ui_pagingtable({
				tmpl_path:'/docview/ui/agency/views/col_',
				columns:[
					{ id:'org',text:'业务点' },
					{ id:'name',text:'机构名称' },
					{ id:null,text:'操作', style:'nolinebreak'}
				]	
			}).controller();
        },
		'{$.route} category change':function(){
			var category = $.route.attr('category');
			if(category == 'manage_accounts' ){
				this.mainTabOn = true;
				this.element.show();
			}else{
				this.mainTabOn = false;
				this.element.hide();
			}
		},
		'{$.route} subcategory change':function(){
			if(!this.mainTabOn) return;
			var subcategory = $.route.attr('subcategory');
			if(subcategory == 'business_agency_maintain'){
				this.element.show();
				this.loadData();
			}else{
				this.element.hide();
			}
		},
		loadData : function(){
			this.tableController.reload({
				url:'/agency_list',
				type:'get',
				data:{},
				success:function(data){
					//console.log(data);
				}
			});
		},
		'form[name=agency] submit':function(el,ev){
			ev.preventDefault();
			var that = this;
			var name = el.find('input[name=agency_name]').val();
			if(!$.trim(name)){
				$.alertMessage(this,{msg:'机构名称不能为空'});
				return;
			}
			$.ajax({
				url:'/agency_create',
				type:'post',
				data:{ agency:{ name: name ,org_name: orgJsonDictionary[that.subjection_org]} },
				error:function(err){
					console.log(err);
				},
				success:function(data){
					that.loadData();
					$.alertMessage(that,{msg:'机构添加成功',type:'success',scroll:'.agency-list'});
				}
			});
		},
		'form[name=edit-agency] submit':function(el,ev){
			ev.preventDefault();
			var that = this;
			var org = $('select[name=subjection_org]').val();
			var name = el.find('input[name=agency-name]').val();
			var id = el.find('input[name=agency-id]').val();
			if(!$.trim(name)){
				$.alertMessage(this,{msg:'机构名称不能为空'});
				return;
			}

			$.ajax({
				url:'/agency_update',
				data:{ agency:{ org:org,name:name ,id: id, org_name: orgJsonDictionary[that.subjection_org]} },
				type:'post',
				success:function(){
					that.loadData();
					$.alertMessage(that,{msg:'机构修改成功'});
				}
			});
		},
		'.btn-edit click':function(el,ev){
			ev.preventDefault();
			var row = this.tableController.getRowFrom(el);
			row.element.after( $.View('//docview/ui/agency/views/detial_form.ejs',row.model) );
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
				url:'/agency_delete',
				type:'delete',
				data:{ id: row.model.id  },
				error:function(){
					
				},
				success:function(){
					$.alertMessage(that,{msg:'机构删除成功'});
					that.loadData();
				}
			});
		}
});
});

