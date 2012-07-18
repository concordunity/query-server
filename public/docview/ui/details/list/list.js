steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models'
    ).then(
    'libs/development-bundle/ui/jquery-ui-1.8.19.custom.js'
    ).then(
    'libs/iviewer/jquery.mousewheel.min.js'
    ).then (
    './views/viewer.ejs',
    './views/image.ejs',
    'libs/iviewer/jquery.iviewer.css',
    'libs/iviewer/jquery.iviewer.js'
    ).then(
    'docview/bootstrap/bootstrap.css'
    ).then(
    './views/init.ejs',
    './views/list.ejs',
    './views/column.ejs',
    './views/show_pdf.ejs'
    ).then(function($) {
    $.Controller('Docview.Ui.Details.List', {}, {
        init : function() {
            this.element.html(this.view('init'));
            $(".show_pdf").hide();
        },
        list : function(data_list){
            this.element.find("#list-content").html(this.view("list",data_list));
        },
        ".one_pdf click" : function(el,ev){
            //alert(el.attr("src"));
            var data = {
                id : el.attr("data-img"),
                jpg : el.attr("src")
            }
            $("#print_pdf").hide();
            $(".thumbnails").hide();
            $(".show_pdf").show();
			
            this.element.find('.show_pdf').html(this.view("show_pdf",data));

            this.element.find('div.image-viewer').iviewer({
                zoom: "fit",
                zoom_delta : 1.1,
                zoom_max : 100,
                zoom_min : 25
            });
            this.element.find('div.image-viewer').iviewer('loadImage', el.attr("src"));
        },
        addJpg : function(data){
		var result = [];
		$.each(data,function(index,value){
                    result.push({jpg:value,id:index});
                });
		return result;
	} ,
        "#setList click" : function(el,ev){
            
            var controller = $("#list-test").controller();
            var text_value = controller.addJpg($("#listContent").attr("value").split(","))
            controller.list(text_value);
        },
        "#print_page click" : function(el,ev){
            var page_arr = [];
            $.each($(".select_checkbox_print"),function(index,value){
                //alert(value);
                if(value.checked==true){
                    value.checked = false;
                    page_arr.push(value.value);
                }
            });
            alert(page_arr);
        },
        "#setHide click" : function(el,ev){
            $(".select_checkbox_print").hide();
        },
        "#setShow click" : function(){
            $(".select_checkbox_print").show();
        },
        ".return_main click" : function(el,ev){
            $(".thumbnails").show();
            $(".show_pdf").hide();
            $("#print_pdf").show();
        }
    });
});

