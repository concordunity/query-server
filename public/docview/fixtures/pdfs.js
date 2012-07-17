steal("jquery/dom/fixture", function() {

	// Static fixture for list of all user accounts
	$.fixture(
		"GET /pdf_list", function() {
			var response = {
				"users": [
				{
					"username":"3403298410932751",
					"fullname":"Weidong Shao",
					"id":3,
					"email":"weidongshao@gmail.com",
					"orgs":"1023,4151,4854",
					"doc_type":"不限"
				},
				{
					"username":"309481230975",
					"fullname":"Testing Person",
					"id":5,
					"email":"haha@gmail.com",
					"orgs":"1023",
					"doc_type":"不限"
				}
				],
				"roles": [
				[{
					"display_name":"Admin1",
					"id":2,
					"name":"Admin1"
					}],
					[
					{
						"display_name":"Mod1",
						"id":3,
						"name":"Mod1"
					},
					{
						"display_name":"Mod2",
						"id":4,
						"name":"Mod2"
					}
					]
					]
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
