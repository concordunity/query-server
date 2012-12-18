
(function($){
	/**
	 * [PrintHelper description]
	 * @param {[type]} id [description]
	 */
	$.PrintHelper = function(id){
		return $.PrintHelper.prototype.init(id);
	};
	/**
	 * [paused description]
	 * @type {Boolean}
	 */
	var paused = false;
	/**
	 * [prototype description]
	 * @type {Object}
	 */
	$.PrintHelper.prototype = {
		/**
		 * [init description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		init:function(id){
			try{
				if(id){
					this.helper = document.getElementById(id);
				}else{
					this.helper = document.getElementById("PrintHelper");
					try{
						this.helper.GetPrintJobs();
					}catch(e){
						this.helper = new ActiveXObject("ThinkAway.PrintHelper");
						this.helper.GetPrintJobs();
					}
				}
			}catch(e){
				throw new Error(e);
			}
			//
			return this;
		},
		/**
		 * [doPrint description]
		 * @return {[type]} [description]
		 */
		doPrint:function(){
			var i = this.index,
				that = this,
				api = that.helper,
				callback = that.callback;

			if(i >= this.files.length){
				i = this.files.length;
				callback(3,null,i,this.files.length);
				return;
			};

			var file = this.files[i];
			var fileName = api.DownloadFile(file);
			var startJobs = api.GetPrintJobs();
			api.PrintFile(fileName);
			(function(){
				if(startJobs !== api.GetPrintJobs()){
					callback && callback(1,file,i,that.files.length);
					(function(){
						if(api.GetPrintJobs()){
							setTimeout(arguments.callee,1000);
						}else{
							that.callback && that.callback(2,file,i,that.files.length);
							that.index++;
							(function(){
								if(paused){
									setTimeout(arguments.callee,100);
								}else{
									that.doPrint();
								}
							})();
						}
					})();
				}else{
					setTimeout(arguments.callee,1000);
				}
			})();
		},
		/**
		 * [print description]
		 * @param  {[type]}   files    [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		print:function(files,callback){
			if(typeof files === 'string'){
				files = files.split(';');
			}
			this.files = files;
			this.callback = callback || function(){};

			if(this.helper){
				this.index = 0;
				paused = false;
				this.doPrint();
			}else{
				throw new Error(this.helper);
			}
		},
		pause:function(){
			paused = true;
		},
		resume:function(){
			paused = false;
		},
		canPause:function(){
			return !paused;
		}
	};
	/**
	 * [print description]
	 * @param  {[type]}   files    [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	$.print = function(files,callback){
		var printHelper = new $.PrintHelper();
		printHelper.print(files,callback);
		return printHelper;
	};

	$(document).ready(function(){
		var html = '<object id="PrintHelper" '
			+'CLASSID="CLSID:0589C781-EF68-4E0B-BE9F-065A5B834080" '
		 	+'CODEBASE="./ThinkAway.Print.cab#version=1,0,0,0" >'
		 	+'</object>';
		$(document.body).append(html);
	});
})(jQuery);
