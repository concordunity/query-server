/**
	Display Userfor jQuery
	//
	@example -> 

	display_user(username,fullname);
	
	@by zhou zhen<zhouzhen@concordunity.com>
	@create at 2013-05-10
*/
(function(win,$){
	var display = function(username,fullname){
		var result = "";
		if (fullname) {
			result += fullname;
		}
		if (username) {
			result += "(" + ((/^22\d{5}$/.test(username) ) ? username.substr(2,4) : username) + ")";
		}
		return result;
	} 
	
	$.display_user = display;
    win.display_user  = display;
})(window,jQuery)

