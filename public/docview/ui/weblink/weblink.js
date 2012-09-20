steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs',
    './views/row_data.ejs',
    './views/new_web_link.ejs'
).then(
    'docview/ui/dmstable'
).then(
    'docview/bootstrap/bootstrap.min.js'
).then(function($) {
    $.Controller('Docview.Ui.Weblink', {}, {
        init : function() {
	   new LabelChinese().initLabelSettings();
           this.element.html(this.view('init'));
	   this.createHtml();
        }, 
	createHtml : function() {
                var table_options = {
                    aaData: [],

                    col_def_path : "//docview/ui/weblink/views/",
                    aoColumns: [
                    {
                        "mDataProp":"name",
			"sWidth": "15%",
                        mLabel : '菜单值'
                    },
                    {
                        "mDataProp":"description",
			"sWidth": "15%",
                        mLabel : '菜单名称'
                    },
                    {
                        "mDataProp":"menu1",
			"sWidth": "10%",
                        mLabel : '一级菜单名称'
                    },
                    {
                        "mDataProp":"menu2",
			"sWidth": "10%",
                        mLabel : '二级菜单名称'
                    },
                    {
                        "mDataProp":"controller",
			"sWidth": "10%",
                        mLabel : 'controller'
                    },
                    {
                        "mDataProp":"action",
			"sWidth": "10%",
                        mLabel : 'action'
                    },
                    {
                        "mDataProp":null,
			"sWidth": "30%",
                        mLabel : '操作'
                    }
                    ],
		    //col_width: ["10%","10%","10%","10%","10%","10%","40%"],
                    file_name: "web_link_info"
                };
	    this.element.find('.web-link-list').docview_ui_dmstable({ table_options : table_options });
	    this.tableController = this.element.find('.web-link-list').controller();
	},
	reload : function() {
	    this.setData();
	},
	clearData : function() {
	    this.listWebLink([]);
	},
	setData: function() { 
	    Docview.Models.WebLink.findAll({}, this.proxy('listWebLink'), this.proxy('failure')); 
	},
        listWebLink : function(web_links) { 
	    this.tableController.setModelData(web_links);
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
                        message = '角色名已存在，请选用新的名称。';
                        break;
                    default:
                        message = '系统内部错误: 代码' + jqXHR.status;
                        handled = true;
		}
                if (handled) {
                    this.options.clientState.attr('alert', {
                        type: t,
                        heading: h,
                        message : message
                    });
                }
                return handled;                                
	},
            // Creating a web-link 
	'#new-web-link-btn click': function() {
             //$('#alerts div.alert').alert('close');
	     // Load up the creation form
	     $('#new-web-link').html(this.view('new_web_link'));// {roles: [this.roles]}));
        },
	'.cancel-create click': function() {
	     $('#new-web-link').collapse('hide');
	},
	'#new-web-link-form submit' : function(el,ev) {
	    ev.preventDefault();
	    //$('#alerts div.alert').alert('close'); 
	    var jsonObject = new Object();
	    jsonObject.name = el.find('input[name="name"]').val();
	    jsonObject.description = el.find('input[name="description"]').val(); 
	    jsonObject.menu1 = el.find('input[name="menu1"]').val();
	    jsonObject.menu2 = el.find('input[name="menu2"]').val();
	    jsonObject.controller = el.find('input[name="controller"]').val();
	    jsonObject.action = el.find('input[name="action"]').val();

	    error = false;
	    if (!error) {
	        var web_link = new Docview.Models.WebLink(jsonObject);
		// Lock the save and cancel buttons
		el.find('.btn-primary').button('loading');
		el.find('.cancel-create').button('loading');
		web_link.save(this.proxy('addRowData'), this.proxy('failure'));
	    }
	},
	addRowData : function(web_link, response) {
                if (web_link.id) {
                    // Copy over the user id since we don't have that
                    this.options.clientState.attr('alert', {
                        type: 'info',
                        heading: '提示信息',
                        message : '成功创建新菜单' + web_link.description
                    });
                    var newRow = $(this.view('row_data', web_link)).css('display', 'none');
                    this.element.find('tbody').prepend(newRow);
                    newRow.fadeIn('slow');
                } else {
                    // Throw an alert
                    this.options.clientState.attr('alert', {
                        type: "error",
                        heading: "Error!",
                        message: "There was an error while trying to create this web_link."
                    });
                }
                $('#new-web-link').collapse('hide');
                $('#new-web-link-form .btn-primary').button('reset');
		$('#new-web-link-form .cancel-create').button('reset');
	},
	'.delete-web-link click': function(el, ev) {
                $('#alerts div.alert').alert('close');
                ev.preventDefault();

                el.button('loading');
                this.lastEl = el;
                if (confirm($.i18n._('msg.confirm.delete_web_link'))) {
                    var webLink = this.tableController.getRowModelDataFor(el);
                    Docview.Models.WebLink.destroy(webLink.model.id,
                        this.proxy('webLinkDestroyed'),
                        this.proxy('webLinkDestroyFailed'));
                        this.reload();
                }
                else {
                    el.button('reset');
                }
	},
	webLinkDestroyed: function(data) {
                this.lastEl.closest('.web_link').remove();
	},
	webLinkDestroyFailed : function(jqXHR, textStatus, errorThrown) {
                var t = 'error';
                var h = '错误提示：';
                var message = '需要用户认证，请重新登录系统。';

                this.lastEl.button('reset');
                switch(jqXHR.status) {
                    case 401:
                        break;
                    case 404:
                        type = 'info';
                        message = '系统中没有相关角色';
                        break;
                    case 500:
                        message = '系统内部错误';
                        break;
                    case 403:
                        type = 'info';
                        message = '失败，权限不足。';
                        break;
                    case 400:
                        type = 'error';
                        message = '角色不能被删除，系统有相应的用户。';
                        break;
                    default:
                        break;
                }
                this.options.clientState.attr('alert', {
                    type: t,
                    heading: h,
                    message : message
                });

                $('#new-web-link-form .btn-primary').button('reset');
                $('#new-web-link-form .cancel-create').button('reset');
                if (this.lastEl) {
                    this.lastEl.button('reset');
                }
        },
	'.edit-web-link-form submit': function(el, ev) {
                ev.preventDefault();
                $('#alerts div.alert').alert('close');
                // Clear any previous error messages in the form
                this.removeFormErrors(el);
                //    var jsonObject = new Object();

		var jsonObject = new Object();
		jsonObject.name = el.find('input[name="name"]').val();
		jsonObject.description = el.find('input[name="description"]').val(); 
		jsonObject.menu1 = el.find('input[name="menu1"]').val();
		jsonObject.menu2 = el.find('input[name="menu2"]').val();
		jsonObject.controller = el.find('input[name="controller"]').val();
		jsonObject.action = el.find('input[name="action"]').val();

                var web_link = el.closest('tr').prev().model();

		web_link.attr("name",jsonObject.name);
		web_link.attr("description",jsonObject.description);
		web_link.attr("menu1",jsonObject.menu1);
		web_link.attr("menu2",jsonObject.menu2);
		web_link.attr("controller",jsonObject.controller);
		web_link.attr("action",jsonObject.action);

                Docview.Models.WebLink.update(web_link.id,{web_links: jsonObject },
                this.proxy('updateRowData'),
                    this.proxy('failure')
                    );

                el.find('.btn-primary').button('loading');
                el.find('.cancel-edit').button('loading');
            // Save
            //user.save(this.proxy('updateUserRow'));
        },
        '.edit-web-link click': function(el, ev) {
                ev.preventDefault();
                var webLinkInfo = this.tableController.getRowModelDataFor(el);
                webLinkRow = webLinkInfo.tr;
                webLinkRow.model(webLinkInfo.model);
                webLinkRow.hide();

                webLinkRow.after(this.view('edit_web_link',
                {
                    cntl : this,
                    web_link: webLinkInfo.model
                }));
		
		$('input[name="name"]').val(webLinkInfo.model.name);
		$('input[name="description"]').val(webLinkInfo.model.description);
		$('input[name="menu1"]').val(webLinkInfo.model.menu1);
		$('input[name="menu2"]').val(webLinkInfo.model.menu2);
		$('input[name="controller"]').val(webLinkInfo.model.controller);
		$('input[name="action"]').val(webLinkInfo.model.action);
        },
        '.cancel-edit click': function(el, ev) {
                ev.preventDefault();
                var editRow = el.closest('tr');
                editRow.prev().show();
                editRow.remove();
        },
	updateRowData: function(web_link) {
                this.options.clientState.attr('alert', {
                    type: 'info',
                    heading: '提示信息',
                    message : '成功更新菜单 ' + web_link.name
                });
                this.reload();
        },
        show : function() {
        }
});
});

