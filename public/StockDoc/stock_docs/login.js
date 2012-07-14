$(document).ready(function() {
	//request data for centering
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#dLogin").height();
	var popupWidth = $("#dLogin").width();
	//centering
	$("#dLogin").css({
		"position" : "absolute",
		"top" : windowHeight / 2 - popupHeight / 2,
		"left" : windowWidth / 2 - popupWidth / 2
	});
})
function reset() {
	$("#user").val('');
	$("#password").val('');
}

function login() {
	var userName = $("#user").val();
	var password = $("#password").val();
	var postMsg = {};
	var user = {};
	user.username = userName;
	user.password = password;
	postMsg.user = user;
	postMsg.commit = 'Sign in';
	$.ajax({
		url : "/users/login",
		type : "POST",
		dataType : "json",
		data : $.toJSON(postMsg),
		// data : postMsg,
		contentType : "application/json; charset=\"utf-8\"",
		success : function(data, textStatus, jqXHR) {
			if(textStatus) {
				var numStatus = jqXHR.status;
				if(numStatus >= 200 && numStatus < 300) {
                                        //console.log(data)
					sessionStorage.setItem('user', userName);
					sessionStorage.setItem('userDisplay', data.fullname + '(' + userName+')');
					window.location = "stock_docs.html#!&menu=queryDocs&nav=bySingleBarcode";
				}
			} else {
				alert("您输入的用户名或者密码不正确。");
			}
		},
		error : function(data) {
			alert("您输入的用户名或者密码不正确。");
		}
	});
}
