steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.user_select', {}, {
        init : function() {
			var that = this;
			options = $.extend({
				type: this.element.attr('data-type') || 'kz_users',
				name: this.element.attr('data-type') || 'kz_users',
				users:[]
			},this.options);
			$.get('/user_select',{},
				function(data){
					$.each(data[options.type],function(index,user){
						if(!options.loaded)
							options.users.push({ username:user.username,fullname:user.fullname });
					});
					options.loaded = true;
					that.element.html(that.view('init',options));
				}
			);

        }
});
});

