(function($){
    /*
        
    */
    $.fn.popinput = function(options){
        options = $.extend({
            callback:function(){},
            ok:'OK',
            cancel:'Cancel'
        },options);
        var btn_list = {};
        this.each(function(key,el){
            var uuid = +new Date;
            if(!$(el).data('callback')){

                $(el).data('callback',options.callback);
                $(el).popover({
                    template:'<div id="popover_'+ uuid +'" class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-ext"><input type="text" class="popover-edit" /><a class="btn btn-danger popover-ok">'+options.ok+'</a><a class="btn popover-cancel">'+options.cancel+'</a></div></div>'
                });
                btn_list[uuid] = el;
            }
        });

        var holder = function(el,cancel){
            var popover = $(el).closest('.popover');
            var btn = $(btn_list[popover.attr('id').replace('popover_','')]);
            var text = popover.find('.popover-edit').val();
            if(!btn)return;
            if(!cancel){
                var callback = btn.data('callback');
                callback && callback(text);
            }
            btn.click();
        };

        $('.popover-cancel').live('click',function(){
            holder(this,true);
        });
        $('.popover-ok').live('click',function(){
            holder(this);
        });
    };
})(jQuery);
