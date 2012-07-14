//js stockdocuments/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('stockdocuments/stockdocuments.html', {
		markdown : ['stockdocuments']
	});
});