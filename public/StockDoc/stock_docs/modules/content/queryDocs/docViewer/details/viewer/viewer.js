steal(
	'jquery/controller',
	'jquery/view/ejs',
    'jquery/dom/route',
    'jquery/lang/observe/delegate'
)

// View templates
.then (
    './views/viewer.ejs',
    './views/image.ejs'
)

.then(function($) {

    $.Controller('Docview.Details.Viewer',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html($.View('//stock_docs/modules/content/queryDocs/docViewer/details/viewer/views/viewer'));
            $('#btnPrint').button();
            // Hide box until route conditions are met
            this.element.hide();
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "document" || newVal === "search") {
                this.element.show();
            }
            else {
                this.element.hide();
            }
        },
        '.next click': function(el, ev) {
            ev.preventDefault();
            var currentPage = $.route.attr('page');
            if (currentPage <= this.options.clientState.document.pageCount) {
                $.route.attr('page', (+currentPage) + 1);
            }
        },
        '.previous click': function(el, ev) {
            ev.preventDefault();
            var currentPage = $.route.attr('page');
            if (currentPage > 1) {
                $.route.attr('page', (+currentPage) - 1);
            }
        },
        '{$.route} page set': function(el, ev, newVal, oldVal) {
        	$('#dQueryDocsResultContainer').show();
            // When the site is refreshed, we may not have doc info
            if (this.options.clientState.document.pageCount > 0) {
                var dir = this.options.clientState.document.directory + '/';
                // TODO: get the doc id from clientState instead?
                var docId = $.route.attr('id');
                var filename = this.options.clientState.document.pages[newVal - 1];
                // this.element.find('#document-page').html(this.view('image', {src: dir + docId + '/' + filename }));
                var src = '/root/docimages/' + docId + '/' + docId + '/' + filename;
                this.element.find('#document-page').html(
                	$.View('//stock_docs/modules/content/queryDocs/docViewer/details/viewer/views/image',
                		{src: src}));
            }
        },
        '{$.route} change': function(el, ev, attr, how, newVal, oldVal)  {
        },
        'a.testify click' : function (el, ev) {
          	ev.preventDefault();
          	this.testifyFile();
        },
        'a.print click' : function (el, ev) {
          	ev.preventDefault();
          	this.printFile();
        },
        testifyFile:function()
		{
			var dFrame = $('#downloadFrame');
			dFrame.attr('src', '/docs/testify/' + $.route.attr('id'));
		},
        printFile:function()
		{
			var dFrame = $('#downloadFrame');
			dFrame.attr('src', '/docs/print/' + $.route.attr('id'));
		}

    });
});
