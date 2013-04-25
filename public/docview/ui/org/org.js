steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Org', {}, {
        init : function() {
			var that = this;
			var options = $.extend({
				name:'org_select',
				default_text:'不限',
				default_value:'',
				org_list:false,
				include:[  ],
				out:[  ],
				select:0
			},this.options);

			options.out.push(2200);
			
			if(options.org_list){
				this.element.html(that.view('init',options));
				this.val(options.select);
			}else{
				options.org_list = [];
				if(options.default_text != null && options.default_value != null){
					options.org_list.push( {name:options.default_text, value:options.default_value } );	
				}
				$.get('/dictionary_info/get_dictionary',{ dic_type:'org' },function(data){
					for(var i=0;i<data.length;i++){
						var obj = data[i];
						if(($.inArray(obj.dic_num,options.out) == -1) && (options.include.length == 0 || $.inArray(obj.dic_num + '',options.include) != -1 )){
							options.org_list.push({ name: obj.dic_name, value: obj.dic_num });	
						}
					}
					that.element.html(that.view('init',options));
					that.val(options.select);
				});
			}
			if(this.element.find('select > option').size() <= 1){
				this.element.find('select').attr('disabeled','disabled');	
			}
        },
		val:function(value){
			if(arguments.length > 0){	
				return this.element.find('select').val(value);
			}
			return this.element.find('select').val();
		}

});
});

