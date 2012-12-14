// map fixtures for this application

steal("jquery/dom/fixture", function(){
    
    $.fixture.make("print", 5, function(i, print){
        return {
            file:"test"+ (i + 1) + ".pdf"
        }
    })
})
