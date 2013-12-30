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
						sort: [ [0,"asc"] ],
						search:{},
						col_offset:0,
						page_dom:"<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
						language_url:"/docview/media/language/ch_ZN.txt",
						preload:true,
						loading:true,
						server_side:true,
						disable_ejs:false,
						tmpl_path:'views/col_',
						tmpl_name:false,
						panel_dom: '',
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
					//this just be like cool ~ 
					//console.log("BEGIN TEST EJS TEMPLETE URL")	
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
						(function(arr){
							var i= 0, ejs_names = [];
							for(var j=0;j<arr.length;j++){
								if(arr[j] !== undefined && arr[j] !== null){
									ejs_names.push( (j == 0 ? '':that.options.tmpl_path) +  arr[j] + '.ejs' );
								}
							}
						(function(){
							var callee = arguments.callee;
							//if ejs_name is unavalivble go to next .
							//(!ejs_names[i]) && ((++i) < ejs_names.length) && callee();
							var ejs = ejs_names[i];
							//test ejs file exist ?
							$.ajax({
								url: ejs,
								error:function(){
									//no ! , this file is not exist !
									((++i) < ejs_names.length) && callee();
								},
								success:function(){
									// Yeah! , this file is ok !
									that.ejs_files[key] = ejs;
								}
							});
						})();
						//avalivble name .
						// value.tmpl > that.options.tmpl_name > ...
					})([value.tmpl,that.options.tmpl_name ? value.id : key+1,!that.options.tmpl_name ? value.id:key+1 ]);
				}//ejs test end
			});
			if(this.options.form){
				this.bindform(this.options.form);
			}	
			//preload data ...
			if(this.options.preload && this.options.url){
				this.reload( this.options );
			}
		},
		/**
			* render TH element to table .
			* this function will be test text and id
			* if text and id not provide will be 'Untitle 1' and more .	
			*/
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
		/** 
			* render columns by ejs or value .
			*	by default ejs is not required .
			* this function will auto generate value to show .
			*/
		columnsRender:function(key,val){
			var that = this;
			return function(context, value){
				var data = context.aData;
				var ejs = that.ejs_files[key];
				return (ejs && $.View( ejs,data )) || value;
			}
		},
		/**
			* reload data
			*
		*/
		reload: function(options){
			var that = this;
			//mix options
			options = $.extend(this.options , options);
			//init default layoyt
			this.element.html(this.view('init',this.options));
			//custom your html .
			this.element.find('.panel_dom').append($(this.options.panel_dom));
			console.log(this.options.panel_dom);
			//find columns template
			var tableElement = this.element.find('thead tr:eq(0)');
			//render columns ..
			var render = this.thRender(options.columns);
			//add to header
			tableElement.append(render);
			//preload data ... 
			this.dataTable = this.element.find('table').dataTable({
				bJQueryUI: false,
				bProcessing: options.loading,
				bServerSide: options.server_side,
				"sAjaxSource" : options.url,
				"sServerMethod": options.type,
				"sDom": options.page_dom, 
				"sPaginationType" : "bootstrap",
				"bSort": true, 
				"aaSorting": options.sort,
				"oSearch": options.search,
				"aoColumns": options.aoColumns,	
				//"aLengthMenu": [10, 25, 50, 100,500,1000],
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
							//from server side data . You can hack this function in here .  
							var model = that.options.success.apply(that,arguments);
							if(model)  data.aaData = model; // overlay data result for you . 
							//save origin data . #1
							that.modelData = data.aaData;
							//send to DataTable .
							fnCallback.call(this,data);
						} 
					}); 
				},
				"fnServerParams": function ( aoData ) {
					//aoData.sendParams = aod;
					//send your custom data to server side . if u like :P .
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
			this.dataTable.fnAddData(data);
		},
		/**
		* only for javascriptMVC framework .
		* javascriptMVC is strage model to TR element .
		* so , if u want get model from TR , this function can be used .
		*/
		getRowFrom:function(el){
			var rowElement = $(el).closest('tr');
			//pos is model id .
			var pos = this.dataTable.fnGetPosition(rowElement[0]);
			//access backup modelData , learn more information see #1 .
			var data = this.modelData[pos] || this.dataTable.fnGetData(rowElement[0]);
			//return element and model .
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

