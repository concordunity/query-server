steal("funcunit", function(){
	module("stockdocuments test", { 
		setup: function(){
			S.open("//stockdocuments/stockdocuments.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})