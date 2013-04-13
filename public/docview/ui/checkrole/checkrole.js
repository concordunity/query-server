steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(
    'docview/bootstrap/bootstrap.min.js'
).then(function($) {
    $.Controller('Docview.Ui.checkrole', {}, {
        init : function() {
			this.form = this.options.form;
			console.log("====form :",this.form);
		},
		createView : function(data){
			console.log(" createView is now");
			this.roleDic = new Object();
		   for(var i=0;i<data.length;i++){
				this.roleDic[data[i].id] = data[i].name;   
			}
           this.element.html(this.view('init',{data: data, form: this.form}));
		   this.getRolesData();
        },
		failure : function(obj){},
		setUIFromState : function(){
			this.element.find("input.role-check").prop("checked", false);	
			for (var i=0; i<this.roles.length; i++) {
				this.element.find('input[name="role"][value="' + this.roles[i]+'"]').attr("checked",true);
			}
		},
		getRolesData : function(){
			this.resetState();
			this.roles = this.checkroles == undefined ? [] : this.checkroles.split(",");	
			this.setUIFromState();
			this.setSelectionValues();	
		},
		setRoles : function(roles){
			this.checkroles = roles;
			Docview.Models.Role.findAll({},this.proxy("createView"),this.proxy("failure"))
		},
		getRoles : function(){
			return this.roles;
		},
		resetState : function(){
			this.roles = [];
		},
		setSelectionValues : function(){
			this.roles = [];	
			that = this;
			console.log('this.roleDic = ',this.roleDic);
			this.element.find('form :checked').each(function() {
				var id = $(this).val();
				that.roles.push(parseInt(id));
			});
			console.log('this.roles = ',this.roles);
			$("form." +  this.form + " "  + "#role-selected").empty();
			if (this.roles.length == 0){
				$("form." +  this.form + " "  +  "#role-selected").append(this.view("role_label","尚未选择角色"));
			}
			for (var i=0;i<this.roles.length;i++){
				
				label = this.roleDic[this.roles[i]];
				$("form." +  this.form + " "  + "#role-selected").append(this.view("role_label",label));
			}
		},
		".role-check change" : function(el,ev){
			this.setSelectionValues();	
		},
        show : function() {
        }
});
});

