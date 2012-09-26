steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.upload_user', {}, {
        init : function() {
	  new LabelChinese().initLabelSettings();
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
		console.log(upload_file);
		if (upload_file == "") { 
			this.showMessage("上传失败:请选择要上传的文件");
			return false;
		}
		var result = {status:true, message: []};

		result = this.getUploadInfo(upload_file,result);
		if (result.status == false) {
			this.showMessage("上传失败");
			return false;
		}else{
			this.showMessage("上传成功");
			return true;
		}
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

