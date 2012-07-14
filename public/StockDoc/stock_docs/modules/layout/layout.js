steal(
	'jquery/controller',
	'jquery/view/ejs', 
	'jquery/dom/form_params', 
	'jquery/controller/view', 
	'jquery/dom/route', 
	'stock_docs/modules/content/queryDocs',
	'stock_docs/modules/content/operateDocs',
	'stock_docs/modules/content/manageQueries',
	'stock_docs/modules/content/manageAccounts',
	'stock_docs/modules/content/mainteProfile',
	'libs/bootstrap/assets/css/bootstrap.min.css',
	'libs/bootstrap/assets/css/bootstrap-responsive.min.css',
	'libs/theme/css/common.css', 
	'libs/theme/css/layout.css', 
	'libs/theme/css/style.css', 
	'libs/theme/css/menu.css', 
	'libs/css3menu/assets/style.css')
.then('./views/init.ejs', 
 	function($) {

	/**
	 * @class StockDocuments.DocViewer.List
	 * @parent index
	 * @inherits jQuery.Controller
	 * Creates DocViewer
	 */
	$.Controller('StockDocs.Layout', {
		defaults : {
			menu_val : ''
		}
	},
	/** @Prototype */
	{
		init : function() {
			this.element.html($.View('//stock_docs/modules/layout/views/init'));
			StockDocs.Models.Login.getLinks({}, this.callback('takeAuth'));
		},
		takeAuth : function(data) {
			var not_authorized = data.not_authorized;
			sessionStorage.setItem('docTestified', 'true');
			sessionStorage.setItem('docPrint', 'true');
			$.each(not_authorized, function(index, item) {
			  	$('#' + item.name).addClass('nav_hide');
			  	if (item.name == 'aOperateTestified') {
			  		sessionStorage.setItem('docTestified', 'false');
			  	}
			  	if (item.name == 'aOperatePrint') {
			  		sessionStorage.setItem('docPrint', 'false');
			  	}
			});

			var $nav_lv1 = $('a.nav-lv1');
			$nav_lv1.each(function() {
				if ($(this).closest('li').find('a.nav-lv2:not(.nav_hide)').length == 0) {
					$(this).hide();
				}
			})
		},
		'a#aLogout click' : function(el, ev) {
			if(confirm("您确定要退出登录吗？")) {
				StockDocs.Models.Login.logout({}, this.callback('toLoginPage'));
			}
		},
		toLoginPage : function() {
			sessionStorage.clear();
			window.location = "login.html";
		},
		'a.nav-lv1 click' : function(el, ev) {
			ev.preventDefault();
			return false;
		},
		'a.nav-lv1 hover' : function(el, ev) {
			ev.preventDefault();
			
			el.closest('li').find('ul:hidden').css('display', '');

			var menuVal = el.attr('href').substring(1);
			
			this.options.menu_val = menuVal;
		},
		'a.nav-lv2 click' : function(el, ev) {
			ev.preventDefault();
			
			el.closest('ul').css('display', 'none');
			var menuVal = $.route.attr('menu');
			var navVal = el.attr('href').substring(1);
			
			$.route.attrs({'menu' : this.options.menu_val, 'nav' : navVal}, true);
		},
		'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
			if (attr == 'menu') {
				var menuVal = $.route.attr('menu');
				// var navViewInitPath = '//stock_docs/modules/layout/views/nav/' + newVal;
				// $('#ulNav').html($.View(navViewInitPath));
				
				switch (newVal) {
					case 'queryDocs' :
						$('#dMainSpace').stock_docs_content_query_docs();
						break;
					case 'manageQueries' :
						$('#dMainSpace').stock_docs_content_manage_queries();
						break;
					case 'operateDocs' :
						$('#dMainSpace').stock_docs_content_operate_docs();
						break;
					case 'manageAccounts' :
						$('#dMainSpace').stock_docs_content_manage_accounts();
						break;
					case 'mainteProfile' :
						// alert('非常抱歉，我们目前还不支持个人设置功能。');
						// return;
						$('#dMainSpace').stock_docs_content_mainte_profile();
						break;
		
				}
			} else if (attr == 'nav') {
				$('#dMsgBox').html('');
				$('.dialog').remove();
			}
		},
		logoutSuccess : function () {

		},
		logoutError : function () {
				$('#dMsgBox').stock_docs_message_box({
					"messageType" : "error"	,
					"message" : "退出登录失败。"
				}).trigger('loadMessageBox');
		}
	})
});
