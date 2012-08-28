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
	    //console.log(upload_file);
	},
*/
        show : function() {
        },
	".upload_file click" : function(el,ev){
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
	"form[name='upfile_form'] submit" : function(el,ev){
		ev.preventDefault();
		var upload_file = $("#upload_file").val();
		var upload_file_1 = $("#upload_file_1").val();
		var upload_file_2 = $("#upload_file_2").val();
		if(upload_file == "" && upload_file_1 == "" && upload_file_2 == ""){
			alert(上传失败);
			return false;
		}else{
			alert(上传成功);
			return true;
		}
	}
});
});

