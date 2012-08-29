steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/index.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.index', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },

        show : function() {
        }
});
});

