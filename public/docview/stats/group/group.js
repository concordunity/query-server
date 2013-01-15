steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate',
    'docview/models',
    'docview/ui/multi',
    'docview/bootstrap/bootstrap.css'
)
// View templates
.then(
    './views/init.ejs',
    './views/doc_group_table.ejs',
    './views/doc_group_row.ejs',
    './views/new_doc_group.ejs'
)
.then(function($) {
    /*
    * Form for grouping documents together
    */
    $.Controller('Docview.Stats.Group',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        init: function() {
            this.element.html(this.view('init', {}));

            // Hide box until route conditions are met
            this.element.hide();
	    this.lastEl = undefined;
        },
        '{$.route} subcategory change': function(el, ev, attr, how, newVal, oldVal)  {

            if (newVal === "create_group" &&
		$.route.attr('category') === "stats") {
		this.reload();
                this.element.show();
            }
            else if (newVal !== undefined) {
                this.element.hide();
            }
        },
	reload: function() {
	    Docview.Models.DocGroup.findAll(this.proxy('listGroups'), this.proxy('failure'));
	},

	listGroups: function(data) {
	    this.doc_groups = data;
	    this.element.find('.doc-group-list').html(this.view('doc_group_table', data));
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
	      message = '系统内部错误, 代码 500';
	      break;
	  case 403:
	      type = 'info';
	      message = '失败，权限不足。';
	      break;
          case 400:
	      message = '系统内部错误： 服务请求有误。';
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
	'.edit-dg click' : function(el, ev) {
	    var dgRow = el.closest('tr');
	    dgRow.hide();
	    dgRow.after(this.view('edit_dg',
				  {cntl : this, dg: dgRow.model()}));
	    this.element.find('.ed_dg_multi_holder').docview_ui_multi({clientState: this.options.clientState});
	    var ctrl = this.element.find('.ed_dg_multi_holder').controller();
	    var doc_ids_str = (typeof dgRow.model().doc_ids) === 'string' ? dgRow.model().doc_ids : dgRow.model().doc_ids.join(' ');
	    ctrl.setUIValue(doc_ids_str);
	},
        '.cancel-edit click': function(el, ev) {
            var editRow = el.closest('tr');
            editRow.prev().show();
            editRow.remove();
        },
        '#new-doc-group-btn click': function() {
            // Load up the creation form
            $('#new-doc-group').html(this.view('new_doc_group'));
	    $('#new-doc-group').find('div.create_group').docview_docgroup_newdg({clientState: this.options.clientState,
										 create_group_ok: this.proxy('newGroupOk')});
        },
	'.delete-dg click' : function(el, ev) {
	    el.button('loading');
	    this.lastEl = el;
	    if (confirm($.i18n._('msg.confirm.delete_dg'))) { 
		el.closest('.doc_group').model().destroy();
		//Docview.Models.DocGroup.destroy(el.closest('.doc_group').model().id,
		//			    this.proxy('roleDestroyed'),
		//			    this.proxy('roleDestroyFailed'));

                //el.closest('.role').model().destroy();

            }
            else {
                el.button('reset');
            }
	},
	'{Docview.Models.DocGroup} destroyed': function(User, ev, user) {
	    user.elements(this.element).remove();
		log('system',{ current_action:'stats.create_group',describe:'单证组删除成功' });
	},
	'tr.edit-group td div form submit' : function(el, ev) {
	    ev.preventDefault();


	    var ctrl = this.element.find('div.ed_dg_multi_holder').controller();
	    if (ctrl.validateInput(el)) {
		var dg = el.closest('tr').prev().model();
		dg.attr('doc_ids', ctrl.getIds());
		dg.save(this.proxy('updateGroupRow'));
	    }
	},
	updateGroupRow : function(data) {
	    // var dg = new Docview.Models.DocGroup(data.doc_group);
	    var oldRow = data.elements(this.elements);
	    oldRow.next().remove();
	    var newRow = $(this.view('doc_group_row', data)).css('display', 'none');
	    oldRow.replaceWith(newRow);
	    newRow.fadeIn('slow');
		log('system',{ current_action:'stats.create_group',describe:'单证组更新成功' });
	},
	newGroupOk: function(dg, response) {

	    var newRow = $(this.view('doc_group_row',
				     new Docview.Models.DocGroup(dg.doc_group))).css(
					 'display', 'none');
            this.element.find('tbody').prepend(newRow);
            newRow.fadeIn('slow');
	    $('#new-doc-group').collapse('hide');
		log('system',{ current_action:'stats.create_group',describe:'单证组添加成功' });
	}
    });
});
