// map fixtures for this application

steal("jquery/dom/fixture", function() {
	
	$.fixture("/documents/multi_query", "fixtures/multiQueries.json");
	$.fixture("/documents/search_docs", "fixtures/multiQueries.json");
	$.fixture("/users", "fixtures/users.json");
	$.fixture("/roles", "fixtures/roles.json");
	
	
	$.fixture("GET /docs/{id}", function() {
		var response = {
			"doc_info" : {
				"checkedout" : false,
				"created_at" : "2012-03-11T05:15:23Z",
				"doc_id" : "222520121252001011",
				"doc_type" : "1234",
				"folder_id" : 1,
				"id" : 2,
				"inquired" : false,
				"label" : "",
				"modified" : false,
				"org" : "1234",
				"pages" : 6,
				"serial_number" : "1234455",
				"updated_at" : "2012-03-11T05:15:23Z"
			},
			"image_info" : {
				"T_blog" : [{
					"FN" : "pic000049.jpg",
					"T" : "单据首页",
					"V" : "222520121252011025",
					"BT" : ""
				}, {
					"FN" : "pic000050.jpg",
					"T" : "进口报关单",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000051.jpg",
					"T" : "出口报关单",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000052.jpg",
					"T" : "出口报关单",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000053.jpg",
					"T" : "",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000054.jpg",
					"T" : "合同",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000055.jpg",
					"T" : "",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000056.jpg",
					"T" : "发票",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000057.jpg",
					"T" : "出口报关单",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000058.jpg",
					"T" : "进口报关单",
					"V" : "",
					"BT" : ""
				}, {
					"FN" : "pic000059.jpg",
					"T" : "装箱单",
					"V" : "",
					"BT" : ""
				}]
			}
		}
		return response;
	})
})