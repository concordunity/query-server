steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Upload', {}, {
        init : function() {
           this.element.html(this.view('init'));
	   //this.fileForm = new Object();
        },
        show : function() {
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
	}
});
});

