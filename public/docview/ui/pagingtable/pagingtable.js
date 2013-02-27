steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/datatables/jquery.dataTables.js',
    './views/init.ejs'
).then(
    'docview/datatables/bootstrap-pagination.js'
).then(function($) {
    $.Controller('Docview.Ui.Pagingtable', {}, {
        init : function() {
			var that = this;
            this.options = $.extend({
				aoColumns:[]
			},this.options);
			//colums options [{ id:'ID', text:'Text', width:'10px'  }]
			$.each(this.options.columns,function(key,value){
				//make aoColumns ..	
				that.options.aoColumns.push({
					mDataProp:value.id,
					mLabel:value.text
				});
			});
			//console.log(this.options);
			if(this.options.form){
				this.bindform(this.options.form);
			}	
			//preload data ...
			if(this.options.url && this.options.data){
				this.reload( this.options );
			}
        },
		columnsRender:function(columns){
			var tmpl = $("<div>");
			$.each(columns,function(key,value){
				var th = $("<th>");
				th.text( value.text || value.id || "Untitle"+ key );
				(value.width && th.attr('width', value.width ))
				tmpl.append(th);
			});	
			return tmpl.html();
		},
		reload: function(options){
			var that = this;
			//mix options
			options = $.extend(this.options , options);
			//init default layoyt
            this.element.html(this.view('init'));
			//find columns template
            var tableElement = this.element.find('thead tr:eq(0)');

			//render columns ..
            var render = this.columnsRender(options.columns);
            //add to header
			tableElement.append(render);
			console.log( options );
			//preload data ... 
			this.dataTable = this.element.find('table').dataTable({
				bJQueryUI: true,
				bProcessing: true,
				bServerSide: true,
				"sAjaxSource" : options.url,
				"sServerMethod": options.type,
				"sDom": "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
				"sPaginationType" : "bootstrap",
				"bSort": true, 
		//		"oSearch": {doc_id : "20121250004811"},
				"aoColumns": options.aoColumns,	
				"oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                },
				"fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
					oSettings.jqXHR = $.ajax( {
						"dataType": 'json',
						"type": options.type,
						"url": sSource,
						"error" : that.proxy("displayError"),
						"data": aoData,
						"success": fnCallback
					}); 
				},
				"fnServerParams": function ( aoData ) {
					//aoData.sendParams = aod;
					$.each(options.data,function(key,value) {
						aoData.push({ 'name': key,'value': value  });
					});}  
				});
		},
		bindform:function(form){
			var that = this;
			var $form  = $(form);
			$form.submit(function(ev){
				ev.preventDefault();
				if($.fn.serializeJson){
					var data = $form.serializeJson();
					that.reload({ 'data':data });
				}else{
					var args = $form.serialize();
					var url = that.options.url + "?" + args;
					that.reload( { 'url': url , 'data': {} } );	
				}
			});
		},
		displayError : function(data){
			console.log(data.status);
		}
});
});

