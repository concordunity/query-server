steal("jquery/dom/fixture", function() {
    $.fixture(
        "GET /roles", function() {
            var response = [{
                "created_at":"2012-03-25T21:39:50Z",
                "description":null,
                "display_name":"Admin1",
                "id":2,
                "name":"Admin1",
                "resource_id":null,
                "resource_type":null,
                "updated_at":"2012-03-25T21:39:50Z"
            }];
            return response;
        }
    );
});
