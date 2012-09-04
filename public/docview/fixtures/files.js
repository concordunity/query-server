steal("jquery/dom/fixture", function() {
	// Static fixture for document details
    $.fixture(
        "GET /docs/{id}", function() {
        
         var response = {"doc_info":
            {"checkedout":true,
             "created_at":"2012-03-21T13:19:34+08:00",
             "doc_id":"220120121012010018",
             "doc_source":null,"doc_type":null,"edc_date":"2012-03-21",
             "folder_id":3,"id":13,"inquired":false,"label":null,
             "modified":null,"org":"2218","org_applied":null,"pages":5,
             "phase":null,"serial_number":null,
             "updated_at":"2012-07-02T18:16:14+08:00","access_info":null},

             "directory":"/docimages","label":"220120121012010018",
             "special_doc_info": "",

              "image_info":{
                "T_blog":[{"FN":"pic000000.jpg","TCode":"0","T":"\u5355\u636e\u9996\u9875","V":"220120121012010018","BT":""},{"FN":"pic000001.jpg","TCode":"6","T":"\u51fa\u53e3\u62a5\u5173\u5355","V":"","BT":""},{"FN":"pic000002.jpg","TCode":"6","T":"\u51fa\u53e3\u62a5\u5173\u5355","V":"","BT":""},{"FN":"pic000003.jpg","TCode":"6","T":"\u51fa\u53e3\u62a5\u5173\u5355","V":"","BT":""},{"FN":"pic000004.jpg","TCode":"6","T":"\u51fa\u53e3\u62a5\u5173\u5355","V":"","BT":""},{"FN":"pic000005.jpg","TCode":"2","T":"\u53d1\u7968","V":"","BT":""}]}
			};
     
            return response;
    });
    
    $.fixture(
        "POST /documents/multi_query", function() {
            /*var response = { results: [
                {
                    "checkedout": false,
                    "created_at": "2012-03-21T05:19:34Z",
                    "doc_id": "220120121012010018",
                    "doc_type": null,
                    "edc_date": "2012-03-21",
                    "folder_id": 3,
                    "id": 13,
                    "inquired": true,
                    "label": null,
                    "modified": null,
                    "org": null,
                    "org_applied": null,
                    "pages": 5,
                    "serial_number": null,
                    "updated_at": "2012-03-25T07:50:47Z"
                }
            ]};*/
            
            var results = [];
            for (var i = 0; i < 100; i++) {
                results.push({
                    "checkedout": false,
                    "created_at": "2012-03-21T05:19:34Z",
                    "doc_id": i,
                    "doc_type": null,
                    "edc_date": "2012-03-21",
                    "folder_id": 3,
                    "id": i,
                    "inquired": true,
                    "pages": Math.floor(Math.random()*25),
                    "serial_number": Math.floor(Math.random()*50)
                });
            }
            return { results: results };
	});
});