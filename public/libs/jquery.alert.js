(function($){
	/**
	Alert
	*/
	$.alertMessage = function(context,options){
		options = $.extend({
			type:'info',
			title:'',
			msg:'',
			time:3000,
			scroll:'',
			scroll_time:100
		},options);
		$('#alerts').hide();
		context.options.clientState.attr('alert',{
			'type':options.type,
			'heading':options.title,
			'message':options.msg
		});
		$("#alerts .close").hide();	
		$("html,body").animate({ scrollTop:0 },options.scroll_time,function(){
			setTimeout(function(){
				$('#alerts').hide('fast',function(){
					//$(this).html('').show();	
					if($.scrollTo && options.scroll){
						$.scrollTo($(options.scroll)[0],options.scroll_time);
					}
					});
			},options.time);
		});
		$('#alerts').show('slow');
		return context;
	};
})(jQuery);

