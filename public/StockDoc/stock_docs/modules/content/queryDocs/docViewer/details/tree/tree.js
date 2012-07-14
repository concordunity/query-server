steal(
	'jquery/controller',
	'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate'
)

// View templates
.then(
    './views/init.ejs',
    './views/pages.ejs'
)

.then(function($) {

    /*
    * Tree view for a selected document
    */
    // TODO: RESTORE ROUTE ATTRS WHEN SWITCHING BETWEEN TABS
    $.Controller('Docview.Details.Tree',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html($.View('//stock_docs/modules/content/queryDocs/docViewer/details/tree/views/init'));
            
            // By default we're hidden until the route conditions are met
            this.element.hide();
        },
        'li a click': function(el, ev) {
            // Set page to href value without the leading '#'
            $.route.attr('page', el.attr('href').substring(1));
            ev.preventDefault();
        },
        '{$.route} change': function(el, ev, attr, how, newVal, oldVal)  {
            //console.log("[Route changed]", "Attribute:", attr, "Event:", how, newVal, oldVal);
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal === "document" || newVal === "search") {
                this.element.show();
            }
            else {
                this.element.hide();
            }
        },
        '{$.route} page change': function(el, ev, attr, how, newVal, oldVal) {
            // this will have problems when you refresh the page and the event is an add and we
            // don't have the data populated yet
            this.element.find('li').removeClass('active');
            var pageSelector = '.page-' + newVal;
            this.element.find(pageSelector).addClass('active');
        },
        '{$.route} id change': function(el, ev, attr, how, newVal, oldVal) {
            // TODO: If we set category and id values sequentually, are the events done in order?
            //       i.e. does:
            //       $.route.attrs({ "category": "document", "id": "103420121342000022" }, true);
            //       yield:
            //       category change event, followed by id change event?
            if ($.route.attr('category') === 'search') {
            	var filter = $.route.attr('filter');
            	var aryFilter = [];
            	if (filter != undefined) {
	            	$.each(filter, function(n, item) {
						aryFilter.push(item);
					});
				}
                Docview.Models.File.findOne(newVal, {'filter' : aryFilter}, this.proxy('success'), this.proxy('failure'));
            }
        },
        success: function(data) {
            // console.log(data);
            
            // Cluster the page info by type
            // Assume there's at least 1 page in a document
            var pages = data.image_info.T_blog;
            var prevType = "";
            var groups = new Array();
            var subgroup = new Array();
            var pageArray = new Array(); // all pages in a single array
            
            var filter = $.route.attr('filter');
            var aryFilter = [];
        	if (filter != undefined) {
            	$.each(filter, function(n, item) {
					aryFilter.push(item);
				});
			}
            
            for (var i = 0; i < pages.length; i++) {
            	var pageType = pages[i].TCode;
            	if (aryFilter.length > 0) {
            		if (pageType != 0 && ($.inArray(pageType, aryFilter) == -1) ) {
            			continue;
            		}
            	}
                if (pages[i].T !== prevType) {
                    // Push previous subgroup and type into groups
                    if (prevType !== "") {
                        groups.push({"type": prevType, "pages": subgroup});
                    }
                    // Start a new subgroup
                    subgroup = new Array();
                }
                subgroup.push(pages[i].FN);
                pageArray.push(pages[i].FN);
                if (pages[i].BT) {
                    subgroup.push(pages[i].BT);
                    pageArray.push(pages[i].BT);
                }
                prevType = pages[i].T;
            }
            // Push our remaining subgroup into groups
            groups.push({"type": prevType, "pages": subgroup});
            
            // Update client state
            this.options.clientState.attr('document').attrs({
                pageCount: data.doc_info.pages,
                directory: data.image_info['tmp-dir'],
                pages: pageArray
            });
            
            // Render
            this.element.find('.nav').html($.View('//stock_docs/modules/content/queryDocs/docViewer/details/tree/views/pages', groups));
            $.route.attr('page', 1);
            //console.log(groups);
        },
        failure: function(data) {
        	var message;
				var messageType;
				if(data.status == 404) {
					message = '系统中没有该单证的信息。';
					messageType = 'warning';
				} else if(data.status == 500) {
					message = '系统内部错误，请与维护人员联系。';
					messageType = 'error';
				}
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : messageType,
					"message" : message
				}).trigger('loadMessageBox');
        },
        '{clientState} change': function(el, ev, attr, how, newVal, oldVal)  {
            // console.log("[State changed]", "Attribute:", attr, "Event:", how, newVal, oldVal);
        }
    });
});
