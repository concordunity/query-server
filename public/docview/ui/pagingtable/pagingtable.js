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
			//defaults
            this.options = $.extend({
				aoColumns:[],
				page_dom:"<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
				language_url:"/docview/media/language/ch_ZN.txt",
				preload:true,
				disable_ejs:false,
				tmpl_path:'views/col_',
				data:{},
				type:'GET',
				dataType:'json',
				error:function(err){
					console.log('has a error',err);
				},
				success:function(data){
				
				}
			},this.options);
			this.ejs_files = {};
			console.log("BEGIN TEST EJS TEMPLETE URL")	
			//colums options [{ id:'ID', text:'Text', width:'10px'  }]
			$.each(this.options.columns,function(key,value){
				//make aoColumns ..	
				that.options.aoColumns.push({
					mDataProp	: value.id,
					mLabel		: value.text,
					sClass		: value.style,
					fnRender	: that.columnsRender(key, value)
				});
				//disable ejs 
				if(!that.options.disable_ejs){
					(function(ejs_names){
						var i=0;
						(function(){
							var callee = arguments.callee;
							//if ejs_name is unavalivble go to next .
							(!ejs_names[i]) && ((++i) < ejs_names.length) && callee();
							var ejs = (i == 0) ? ejs_names[i] : that.options.tmpl_path + ejs_names[i] + '.ejs';
							$.ajax({
								url: ejs,
								error:function(){
									((++i) < ejs_names.length) && callee();
								},
								success:function(){
									that.ejs_files[key] = ejs;
								}
							});
						})();
					})([ value.tmpl, (key + 1) ,value.id ]);
				}//ejs test end
			});
			//console.log(this.options);
			if(this.options.form){
				this.bindform(this.options.form);
			}	
			//preload data ...
			if(this.options.preload && this.options.url){
				this.reload( this.options );
			}
        },
		thRender: function(columns){
			var tmpl = $("<div>");
			$.each(columns,function(key,value){
				var th = $("<th>");
				th.text( value.text || value.id || "Untitle" + key );
				(value.width && th.attr('width', value.width ));
				tmpl.append(th);
			});	
			return tmpl.html();
		},
		columnsRender:function(key,val){
			var that = this;
			return function(context, value){
				var data = context.aData;
				var ejs = that.ejs_files[key];
				return (ejs && $.View( ejs,data )) || value;
			}
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
            var render = this.thRender(options.columns);
            //add to header
			tableElement.append(render);
			//console.log( options );
			//preload data ... 
			this.dataTable = this.element.find('table').dataTable({
				bJQueryUI: false,
				bProcessing: true,
				bServerSide: true,
				"sAjaxSource" : options.url,
				"sServerMethod": options.type,
				"sDom": options.page_dom, 
				"sPaginationType" : "bootstrap",
				"bSort": true, 
		//		"oSearch": {doc_id : "20121250004811"},
				"aoColumns": options.aoColumns,	
				"oLanguage" : {
                    "sUrl" : options.language_url 
                },
				"fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
					oSettings.jqXHR = $.ajax( {
						"dataType": options.dataType,
						"type": options.type,
						"url": sSource,
						"data": aoData,
						"error" : that.options.error,
						"success": function(data){
							var model = that.options.success.apply(that,arguments);
							if(model)  data.aaData = model;
							that.modelData = data.aaData;
							fnCallback.call(this,data);
						} 
					}); 
				},
				"fnServerParams": function ( aoData ) {
					//aoData.sendParams = aod;
					$.each(options.data,function(key,value) {
						aoData.push({ 'name': key,'value': value  });
					});}  
				});
		},
		clear:function(){
			this.dataTable.fnClearTable();
		},
		setData:function(data){
			//this.modelData = data;
			//this.clear();
			console.log(data);
			this.dataTable.fnAddData(data);
		},
		getRowFrom:function(el){
			var rowElement = $(el).closest('tr');
			var pos = this.dataTable.fnGetPosition(rowElement[0]);
			var data = this.modelData[pos] || this.dataTable.fnGetData(rowElement[0]);
			
			return { 'element': rowElement, 'model': data }; 
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

        saveToExcel : function(options) {
            var th_list = [];
            var title_list = [];
			options = $.extend({type: "single"},options);
            $.each(this.options.aoColumns, function(index, v) {
                if(v.mDataProp != null){
                    th_list.push(v.mLabel);
                    title_list.push(v.mDataProp);
                }
            });
				
            $.ajax({
                url: '/generateExcel',
                data : {
                    tableFile: this.options.file_name,
                    tableData: JSON.stringify(this.dataTable.fnGetData()),
					type: options.type,
                    tableTitle: title_list,
                    tableHeader: th_list
                },
                type : 'post',
                datatype : "json",
                success : function(data) {
                    window.location.href=data;
                },
                error : function(error, textStatus, jqXHR) {
                }
            });
		}
});
});

