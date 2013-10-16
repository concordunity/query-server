
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
		options = $.extend({
			offset_month:0
		},options);
		this.datepicker();
		var date = new Date;
		if(options.offset_month){
			date.setMonth( date.getMonth() + options.offset_month );	
		}
		this.val($.date(date).format('yyyy-MM-dd'));
	};
})(jQuery);

(function(){

    var utc_to_gmt = function(UTC){
        //console.log("-------utc_to_gmt----",UTC);
	var date_string = format_utc_time(UTC);
	//console.log('-----format_utc_time----',date_string);
	var date = addDate(date_string,-8);	
	var date = UTC2GMTString(date.toString());
        return date;	
    };
    var addDate = function(dd,hadd){  
    	var a = new Date(dd); 
	a = a.valueOf();  
	a = a + hadd * 60 * 60 * 1000; 
	a = new Date(a); 
	return a;  
    };  
    var format_utc_time = function(UTC){
    //2013-07-31T22:48:43+08:00
    //2013-08-01T23:34:57+08:00
        //console.log('======utc====',UTC);
	var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}:\d{2})/;
	var match =  UTC.match(regex);
	var year = match[1];
	var month = match[2];
	var day = match[3];
	var time = match[4].split(":");
	var date_string = month + "/" + day + "/" + year + " " + time[0] + ":" + time[1] + ":" + time[2];
	return date_string; 

    };
    var UTC2GMTString = function(UTC){
	    //Thu, 1 Aug 2013 15:34:57 UTC
	//Thu Aug 1 15:34:57 UTC+0800 2013
        //console.log('======UTC2GMTString====',UTC);
	var regex = /\w+ (\w+) (\d+) (\d{2}:\d{2}:\d{2}) UTC\+\d{4} (\d{4})/;
	var match =  UTC.match(regex);
	var year = match[4];
	var month = match[1];
	var day = match[2];
	var time = match[3];
	//console.log("====year====",year);
	//console.log("====month====",month);
	//console.log("====day====",day);
	//console.log("====time====",time);

	var months = ["Jan" , "Feb", "Mar" ,"Apr", "May" ,"Jun", "Jul" ,"Aug","Sep","Oct","Nov","Dec"];
	return  year + "-" + ($.inArray(month,months) + 1 )+ "-" + day + " " + time;
    };

    window.UTCTOGMT = utc_to_gmt;
})();
