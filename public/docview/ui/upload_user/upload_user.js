steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    'docview/ui/dialog',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.upload_user', {}, {
        init : function() {
		  new LabelChinese().initLabelSettings();
		  this.dialog_id = "#show_dialog";
		  this.dialog_user = this.options.clientState.attr("user").fullname; 
		  $('#dialog').docview_ui_dialog({dialog_id: this.dialog_id});
		  this.dialogController = $('#dialog').controller();

          this.element.html(this.view('init'));
          this.element.hide();
        },

        show : function() {
          this.element.show();
        },
	".upload_file change" : function(el,ev){
	    this.checkFileSize(el);
	},
	checkFileSize : function(fileObj){
	    fileForm = new Object();
  	    if(fileObj.value != "") {
    	      var form = document.forms['upload_user_form'];

    	      //把form的原始数据缓存起来
    	      fileForm.f = form;
    	      fileForm.a = form.getAttribute("action");  //form.action 为一个静态的对象，所以这里要使用getAttribute方法取值
    	      fileForm.t = form.target;

    	      //请求服务器端
    	      form.target = "check_file_frame";
    	      form.action = "/upload_user";
    	      //form.submit(); 其实上面的action已经会执行submit操作，这步可有可无
  	    }
  	    return false;
	},
	getUploadInfo : function(filename,result){
	    
	    if (filename == "") {
		result.message.status = false;
		result.message.push("上传了空文件，无效");
	    } else {
	        var reg = /\.xls$/gi;
		console.log(filename);
	        if (filename.match(reg)) {

			} else {
		    	result.status = false;
				result.message.push("文件格式不匹配，请重新上传");	
			}
	    }
	    return result;
	},
	"form[name='upload_user_form'] submit" : function(el,ev){
		//ev.preventDefault();
		var upload_file = $("input.upload_file[name='upload_user']").val();
		var hasOK = false,error;
		if(!!upload_file){
			//Microsoft(R) Office Excel File Format
			if(/.xls$/i.test(upload_file)){
					//OK
				hasOK = true;
			}else{
				hasOK = false;
				//Error
				error = "文件格式错误,文件后缀名必须是 '.xls' 格式。"
				return false;
			}
		}else{
				error = "没有选择文件上传";
		}
		//上传文件不符合要求,存在错误 , 动作取消
		if(!hasOK){
			this.showMessage(error);
			return false;
		}
		var that = this; 
		that.dialogController.openDialog(this.dialog_id,'正在上传文件到系统,请您耐心等待。');
		(function(){	
			var callee = arguments.callee;
		 	Docview.Models.User.getDialog({},function(data){
				if(!!!data || data.message == false){	
					if(!!!data){	
						console.log('no data');//防止服务器异常
					}else{
						console.log('uploading');
					}
					setTimeout(callee,2000);			
				}else{	
					console.log('upload success');
					that.showMessage(data.result);
					that.dialogController.closeDialog(that.dialog_id);

					log('system',{ current_action:'manage_accounts.system_upload',descirbe:'文件上传成功' });
				}
			},{});	
		})();
	},
	getDialogStatus : function(){
		that = this;
	
	},
	showMessage : function(message) {
                this.options.clientState.attr('alert', {
                           type: "200",
                           heading: "提示：",
                           message : message
                });
        }


});
});

