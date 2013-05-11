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
			var user = window.user;	
			$(document).ajaxStart(function() {
				$.ajax({
					url:'/get_user_info',
					error:function(){
						that.out_of_date(user);			
					},
					success:function(data){
						if(!(user.fullname == data.fullname))
						that.user_changed(user,data);
					}
				});
			});
        },
        user_changed: function(old_user,new_user) {
			this.element.html(this.view('init',{ 'old_user':old_user,'new_user':new_user  }));
			this.element.find('.modal').modal({ keyboard:false,backdrop:'static'  });
        },
		out_of_date:function(user){
			console.log('session out of date');
			this.element.html(this.view('out_of_date',user));
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

