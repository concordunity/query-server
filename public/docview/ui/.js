steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },

        show : function() {
        }
});
});

