steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/observe/delegate',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Showpdf', {}, {
	init: function() {
            this.element.html(this.view('init', this.options));
	    //{doc_id : this.options.doc_id,
	    //doc_type: this.options.doc_type,
//						 tag: this.options.tag} ));
            // this.element.html(this.view('opdf', {doc_id : this.options.doc_id} ));

	    this.element.show();
//	    $('form.showpdf').submit();
	}
//	'form.AAAshowpdf submit' : function (el, ev) {
	    //el.submit();
//	    console.log(this.element);

	    // console.log("window ", window.parent);

//	    console.log($(window.parent.document).find('#glass-inner-viewer-1'));

//	    $(window.parent.document).find('#glass-inner-viewer-1').show();
	    ///this.element.next().show();
//	}
    });
});
