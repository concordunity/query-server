steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    'docview/bootstrap/bootstrap.css'
).then(
    './views/upload.css'
).then(
    'docview/ui/dialog'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Upload', {}, {
	init : function() {
	   this.dialog_id = "#show_dialog";
	   this.dialog_user = this.options.clientState.attr("user").fullname; 
	   $('#dialog').docview_ui_dialog({dialog_id: this.dialog_id});
	   this.dialogController = $('#dialog').controller();
	   this.element.html(this.view('init'));
	   this.element.hide();
        },
        '{$.route} category change': function(el, ev, attr, how, newVal, oldVal)  {
            if (newVal !== "search") {
                this.element.hide();
                this.mainTabOn = false;
            } else if ($.route.attr('subcategory') == 'upload_file') {
                this.mainTabOn = true;
                this.element.show();
            }
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal) {
            if (this.mainTabOn || $.route.attr('category') == 'search') {
                if (how === "add" || how === "set") {
                    if (newVal === "upload_file") {
                        this.element.show();
                    } else {
                        this.element.hide();
                    }
                }
            }
        },
/*
//action="/upload_file"
	"form[name='upfile_form'] submit" : function(el,ev){
	    ev.preventDefault();
	    var upload_file = $("#upload_file");
	},
*/
        show : function() {
        },
	".upload_file change" : function(el,ev){
	    this.checkFileSize(el);
	},
	checkFileSize : function(fileObj){
	//"#upload_file change" : function(fileObj,ev){
	    fileForm = new Object();
  	    if(fileObj.value != "") {
    	      var form = document.forms['upfile_form'];

    	      //把form的原始数据缓存起来
    	      fileForm.f = form;
    	      fileForm.a = form.getAttribute("action");  //form.action 为一个静态的对象，所以这里要使用getAttribute方法取值
    	      fileForm.t = form.target;

    	      //请求服务器端
    	      form.target = "check_file_frame";
    	      form.action = "/upload_file";
    	      //form.submit(); 其实上面的action已经会执行submit操作，这步可有可无
  	    }
  	    return false;
	},
/*
	getUploadInfo : function(filename,result){
	    
	    if (filename == "") {
		result.message.status = false;
		result.message.push("上传了空文件，无效");
	    } else {
	        var reg = /\.xls$/gi;
	        if (filename.match(reg)) {
		} else {
		    result.status = false;
		    result.message.push("文件格式不匹配，请重新上传");	
		}
	    }
	    return result;
	},
*/
	"form[name='upfile_form'] submit" : function(el,ev){
		//ev.preventDefault();
		var hasOK = false,error;
		$([ $("#upload_file_0").val(),
			$("#upload_file_1").val(), 
			$("#upload_file_2").val(), 
			$("#upload_file_3").val(), 
			$("#upload_file_4").val(), 
			$("#upload_file_5").val(), 
			$("#upload_file_6").val()]
		).each(function(i,file){
			//file name sign.
			if(!!file){
				//Microsoft(R) Office Excel File Format
				if(/.xls$/i.test(file)){
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
		});
		//上传文件不符合要求,存在错误 , 动作取消
		if(!hasOK){
			this.showMessage(error);
			return false;
		} 
	
		var that = this;
		that.dialogController.openDialog(this.dialog_id,'正在上传文件到系统,请您耐心等待。');

		(function(){
			var callee = arguments.callee;
			Docview.Models.User.getDialog({full_name: that.dialog_user},function(data){
				//console.log(data,arguments.callee);
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

					log('system',{ current_action:'search.upload_file',descirbe:'文件上传成功' });
				}
			},{});	
	
		})();
		/*
		if (upload_file == "" && upload_file_1 == "" && upload_file_2 == "") {
			this.showMessage("上传失败:请选择要上传的文件");
			return false;
		}
/*
		var val_file_1 = true;
		if (upload_file != "" && upload_file == "text1.xls") {
			val_file_1 = false;
		}
		var val_file_2 = true;
		if (upload_file_1 != "" && upload_file_1 == "text2.xls") {
			val_file_2 = false;	
		}
		var val_file_3 = true;
		if (upload_file_2 != "" && upload_file_2 == "text3.xls") {
			val_file_3 = false;	
		}
		
		if (val_file_1 && val_file_2 && val_file_3) {
			this.showMessage("上传失败:文件命名不规范，请选择要上传的文件");
                        return false;
		}
*/
/*/
		var result = {status:true, message: []};

		result = this.getUploadInfo(upload_file,result);
		result = this.getUploadInfo(upload_file_1,result);
		result = this.getUploadInfo(upload_file_2,result);
		if (result.status == false) {
			this.showMessage("上传失败");
			return false;
		}else{
/*
			this.showMessage("上传成功");
			return true;
*/
/*
		}
*/
	},
	getDialogStatus : function() {
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

