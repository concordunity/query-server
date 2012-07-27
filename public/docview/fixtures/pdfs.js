steal("jquery/dom/fixture", function() {

	// Static fixture for list of all user accounts
	$.fixture(
		"GET /pdf_list", function() {
			var response = {
				"doc_info":{
					"checkedout":false,
					"created_at":"2012-03-21T13:19:34+08:00",
					"doc_id":"220120121012010018",
					"doc_source":null,
					"doc_type":null,
					"edc_date":"2012-03-21",
					"folder_id":3,
					"id":13,
					"inquired":false,
					"label":null,
					"modified":null,
					"org":null,
					"org_applied":null,
					"pages":5,
					"phase":null,
					"serial_number":null,
					"updated_at":"2012-07-02T13:14:16+08:00",
					"access_info":null
				},
				"directory":"/docimages_mod",
				"label":"220120121012010018",
				"special_doc_info":"",
				"image_info":{
					"T_blog":[
					{
						"FN":"pic000000.jpg",
						"TCode":"0",
						"T":"\u5355\u636e\u9996\u9875",
						"V":"220120121012010018",
						"BT":""
					},
					{"FN":"pic000001.jpg",
					"TCode":"6",
					"T":"\u51fa\u53e3\u62a5\u5173\u5355",
					"V":"",
					"BT":""
					},
					{"FN":"pic000002.jpg",
					"TCode":"6",
					"T":"\u51fa\u53e3\u62a5\u5173\u5355",
					"V":"",
					"BT":""
					},
					{"FN":"pic000003.jpg",
					"TCode":"6",
					"T":"\u51fa\u53e3\u62a5\u5173\u5355",
					"V":"",
					"BT":""
					},
					{"FN":"pic000004.jpg",
					"TCode":"6",
					"T":"\u51fa\u53e3\u62a5\u5173\u5355",
					"V":"",
					"BT":""
					},
					{"FN":"pic000005.jpg",
					"TCode":"2",
					"T":"\u53d1\u7968",
					"V":"",
					"BT":""}
					]}
				}
				return response;
			});

			// Intercept user deletion
			$.fixture(
				"DELETE /pdf/{id}", function() {
					var response = {
						"status": "ok"
					}
					return response;
				}
			);

			// Intercept user updates
			$.fixture(
				"PUT /pdf/{id}", function() {
					var response = {
						"status": 200
					}
					return response;
				}
			);

			// Intercept user creation
			$.fixture(
				"POST /pdf_create", function() {
					var response = {
						"status": 200,
						"user": {
							"created_at":"2012-03-28T20:39:42Z",
							"doc_type":0,
							"email":"q@1.com",
							"fullname":"Query TestUser 1",
							"id":4,
							"orgs":"",
							"updated_at":"2012-03-28T20:39:42Z",
							"username":"query1"
						}
					}
					return response;
				}
			);

		});
