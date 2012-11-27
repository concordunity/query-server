(function($) {

	$.date = function(date) {
		date = date || new Date();
		var o = {
			y: date.getFullYear(),
			M: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			m: date.getMinutes(),
			s: date.getSeconds()
		};
		return {
			json: function() {
				return o;
			},
			format: function(fmt) {
				return fmt.replace(/y+|M+|d+|h+|m+|s+/g, function(v) {
					return("0" + o[v.charAt(0)]).slice(-v.length);
				});
			}
		}
	};
})(jQuery);