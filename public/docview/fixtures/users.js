steal("jquery/dom/fixture", function() {

	// Static fixture for list of all user accounts
	$.fixture(
		"GET /accounts", function() {
			var response = {
				"users": [
				{
					"username":"3403298410932751",
					"fullname":"Weidong Shao",
					"id":3,
					"email":"weidongshao@gmail.com",
					"orgs":"1023,4151,4854",
					"doc_type":""
				},
				{
					"username":"309481230975",
					"fullname":"Testing Person",
					"id":5,
					"email":"haha@gmail.com",
					"orgs":"1023",
					"doc_type":""
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
				"DELETE /accounts/{id}", function() {
					var response = {
						"status": "ok"
					}
					return response;
				}
			);

			// Intercept user updates
			$.fixture(
				"PUT /accounts/{id}", function() {
					var response = {
						"status": 200
					}
					return response;
				}
			);

			// Intercept user creation
			$.fixture(
				"POST /accounts", function() {
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

			// Intercept user access list request
			$.fixture(
				"GET /accounts/get_links", function() {
					var response = {
						"error": "Success",
						"web_links": [
						{
							"action": "query",
							"controller": "Document",
							"name": "aQueryDocByBarcode"
						},
						{
							"action": "multi_query",
							"controller": "Document",
							"name": "aQueryDocsByBarcodes"
						},
						{
							"action": "search_docs",
							"controller": "Document",
							"name": "aQueryDocsByConditions"
						},
						{
							"action": "list",
							"controller": "query_history",
							"name": "aManageQueries"
						},
						{
							"action": "report",
							"controller": "report",
							"name": "aPerformanceStatis"
						},
						{
							"action": "stats",
							"controller": "report",
							"name": "aUsabilityStatis"
						},
						{
							"action": "inquire",
							"controller": "Document",
							"name": "aOperateInvolved"
						},
						{
							"action": "checkout",
							"controller": "Document",
							"name": "aOperateLended"
						},
						{
							"action": "testify",
							"controller": "Document",
							"name": "aOperateTestified"
						},
						{
							"action": "manage_user",
							"controller": "auth",
							"name": "aManageUsers"
						},
						{
							"action": "manage_role",
							"controller": "auth",
							"name": "aManageRoles"
						},
						{
							"action": "dh_report",
							"controller": "DocumentHistory",
							"name": "aOperateHistory"
						},
						{
							"action": "print",
							"controller": "Document",
							"name": "aOperatePrint"
						}
						],
						"not_authorized": []
					}
					return response;
				}
			);

			// Intercept user login
			$.fixture(
				"POST /users/login", function() {
					var response = {
						"created_at":"2012-03-19T09:35:11Z",
						"current_sign_in_at":"2012-03-28T01:39:28Z",
						"current_sign_in_ip":"10.0.2.2",
						"email":"weidongshao@gmail.com",
						"fullname":"\u90b5\u536b\u4e1c",
						"id":3,
						"last_sign_in_at":"2012-03-28T01:36:47Z",
						"last_sign_in_ip":"10.0.2.2"
					}
					return response;
				}
			);

			// Intercept user logout
			$.fixture(
				"GET /users/logout", function() {
					var response = {}
					return response;
				}
			);

		});
