steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.check_user', {}, {
        init : function() {
			var	that = this;
			$(document).ajaxStart(function() {
				$.get('/get_user_info',function(data){ 
					var user = window.user;	
					if(!(user.fullname == data.fullname))
						that.show(user,data);
				});
			});
        },

        show : function(old_user,new_user) {
			this.element.html(this.view('init',{ 'old_user':old_user,'new_user':new_user  }));
			this.element.find('.modal').modal({ keyboard:false,backdrop:'static'  });
        },
		'.btn-reload click':function(el,ev){
			window.location = '/';
		},
		'.btn-logout click':function(el,ev){
			window.location = "/users/logout";
		}
});
});

