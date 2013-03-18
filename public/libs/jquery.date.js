
(function(){
    var D= new Date('2011-06-02T09:34:29+02:00');
    if(!D || +D!== 1307000069000){
        Date.fromISO= function(s){
            var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
            if(p[1]){
                day= p[1].split(/\D/);
                for(var i= 0, L= day.length; i<L; i++){
                    day[i]= parseInt(day[i], 10) || 0;
                };
                day[1]-= 1;
                day= new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) return NaN;
                if(p[5]){
                    tz= (parseInt(p[5], 10)*60);
                    if(p[6]) tz+= parseInt(p[6], 10);
                    if(p[4]== '+') tz*= -1;
                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else{
        Date.fromISO= function(s){
            return new Date(s);
        }
    }
})();

(function($) {

	$.date = function(date) {
		if (date == null) {
			return {format: function(){
				return "";
			}};
		}
		date = date || new Date();
		//date string
		if((typeof date) == 'string' ){
			date = Date.fromISO(date);
		}
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
		};	
	};
})(jQuery);



(function($){
	/**
		My Date Picker
	*/
	$.fn.my_datepicker = function(options){
		this.datepicker();
		this.val($.date(new Date).format('yyyy-MM-dd'));
	};
})(jQuery);
