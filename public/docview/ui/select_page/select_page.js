steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/select.ejs',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Select_page', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },
        showSelect :function(data) {
           var total = data.length;
           var option = [];
           var count = 10;
           //var count = 500;
           var z = parseInt(total/count);
           var c = total/count;

           if (total > count){
                if (z != c ){
                   z += 1;
                }
                for(var i = 0;i < z;i++){
                    option.push([count*i,count*(i+1)]);
                }
                $(".select_pages").html(this.view("select",option));
            }
        },
	clearSelect : function() {
		$(".select_pages").html();
	},
        show : function() {
        }
});
});

