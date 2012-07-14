// load('stockdocuments/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("stockdocuments/stockdocuments.html","stockdocuments/out")
});
