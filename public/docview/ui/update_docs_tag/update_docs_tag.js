steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/models',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(
    'docview/ui/details',
    'docview/ui/dmstable'
).then(function($) {
    $.Controller('Docview.Ui.update_docs_tag', {}, {
        init : function() {
           this.element.html(this.view('init'));
            var table_options = {
                aaData: [],

                col_def_path : "//docview/ui/update_docs_tag/views/",
                aoColumns: [
                    {"mDataProp":"doc_id", mLabel : '单证号'},
                    {"mDataProp":"folder_id", mLabel : '册号'},
                    {"mDataProp":"page", mLabel : '问题页'},
                    {"mDataProp":"info", mLabel : '描述'},
                    {"mDataProp":"commenter", mLabel : '反馈者'}

                ],
                file_name: ""
            };
            this.element.find('.docs_list').docview_ui_dmstable({table_options : table_options});
            this.tableController = this.element.find('.docs_list').controller();


            var state = new $.Observe({
                search: { filters: [], ids: [] },
                access: { manage_docs: { print: true, testify: true } },
                searchMode: 'show_doc',
		returnHistory: "return-show-docs"
            });
            $('#detail-show-docs').docview_ui_details({ clientState: state });
            this.detailController = $('#detail-show-docs').controller();
        },
	"#update_docs_tag-test a.show-docs click" : function(el,ev){
	   $("#detail-show-docs").show();
	   $("#update_docs_tag-test").hide();
	   var data_index = $(el).attr("data-index");
           this.detailController.queryDoc(data_index);
	},
	list_docs : function(data) {
	       this.tableController.setModelData(data);
	},
        show : function() {
	     Docview.Models.Doc.findAll({asy:true},this.proxy("list_docs"),this.proxy("failure"));
        },
        failure: function(jqXHR, textStatus, errorThrown) {
          var handled = true;
          var t = 'error';
          var h = '错误提示：';
          var message = '登录超时或失效，需要用户认证，请重新登录系统。';
          switch(jqXHR.status) {
          case 401:
              break;
          case 404:
              type = 'info';
              message = '系统中没有相关信息';
              break;
          case 500:
              message = '系统内部错误';
              break;
          case 403:
              type = 'info';
              message = '失败，权限不足。';
              break;
          case 400:
              message = '系统内部错误： 服务请求有误。';
              break;
          case 422:
              message = '用户名已存在，请选用新的名称。';
              break;
          default:
              message = '系统内部错误: 代码' + jqXHR.status;
              handled = true;
          }
          if (handled) {

/*
              this.options.clientState.attr('alert', {
                  type: t,
                  heading: h,
                  message : message
              });
*/
          }
          return handled;
        }
});
});

