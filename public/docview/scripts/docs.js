//js docview/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('docview/docview.html', {
		markdown : ['docview']
	});
});