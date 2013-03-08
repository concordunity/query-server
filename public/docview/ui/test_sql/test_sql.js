steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.test_sql', {}, {
        init : function() {
            this.element.html(this.view('init'));
		    //this.reload();
        },
		reload : function(){
			$.ajax({
                        url:'/documents/search_docs',
                        data: data,
                        type:'post',
                        success:function(){
                            console.log('post data success .');
                        },
                        error:function(err){
                            console.log('post data has a error:',err);
                        }
                    });
		},
        show : function() {
        }
});
});

