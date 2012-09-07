
function LabelChinese() {
    this.i18n_set = false;
}

LabelChinese.prototype.initLabelSettings = function() {
    if (this.i18n_set) {
	return;
    }

    this.i18n_set = true;
    var i18n_dict = {
	'search_by_id' : '按单证查询',
	'menu_search' : '单证查阅',
	'menu_report' : '查阅管理',
	'menu_operation' : '单证操作',
	'menu_accounts' : '系统管理',
	'menu_logout' : '退出',
	'menu_profile' : '设置',
	'subnav.single_document' : '单票查阅',
	'subnav.upload_file' : '文件上传',
	'subnav.search_condition' : '高风险报关单查询',
	'subnav.multi_document' : '批量查阅',
	'subnav.advanced_search' : '随机抽样查阅',
	'subnav.by_doc_source' : '单证暂存',
	'subnav.personal_history' : '个人查阅历史',
	'subnav.manage_users' : '用户管理',
	'subnav.manage_roles' : '权限管理',
	'subnav.add_remove_inquiry' : '添加/解除涉案标记',
	'subnav.checkout' : '电子档案借出/归还',
	'subnav.print_doc' : '打印',
	'subnav.testify' : '出证',
	'label.role.name' : '角色名',
	'label.role.auths' : '权限设置',
        'label.role.action' : '操作',
	'label.doc_group.name' : '单证组名',
	'label.doc_ids' : '单证号',
        'label.user.username' : '用户名',
        'label.user.fullname' : '全名',
        'label.user.password' : '密码（至少6位字符）',
        'label.user.password.edit' : '密码（至少6位字符，此项为空则保留原密码）',
        'label.user.pass_confirm' : '密码确认',
        'label.user.role' : '角色',
        'label.user.organization' : '关区 (多个关区号以逗号分隔）',
        'label.user.doc_type' : '进出口种类',
        'label.user.action' : '操作',
	'label.editing_user' : '编辑用户：',
	'label.editing_role' : '编辑角色：',
        'msg.welcome' : '欢迎！',
        'msg.error' : '错误提示：',
	'msg.incorrect_login' : '用户名或密码错误',
        'msg.multi_doc_help_text' : '单证号以空格、逗号或回车键分隔。',
        'msg.create_user_error' : '创建用户有错误',
        'msg.create_role_error' : '创建角色有错误',
	'msg.confirm.delete_user' : '你确定要删除用户吗？用户一旦被删除，相关数据不能恢复',
	'msg.confirm.delete_role' : '你确定要删除角色吗？一旦被删除，相关数据不能恢复',
	'msg.confirm.delete_dg' : '你确定要删除单证组吗？一旦被删除，相关数据不能恢复',
        'btn.login' : '登录',
        'btn.create' : '创建',
	'btn.cancel' : '取消',
        'btn.new_user' : '创建新用户', 
        'btn.new_role' : '创建新角色', 
        'btn.new_doc_group' : '创建新单证组', 
        'btn.delete' : '删除', 
        'btn.save' : '保存', 
        'btn.edit' : '编辑',
        'btn.upload_file' : '上传文件',
	'btn.search' : '查询',
        'btn.filter' : '单证种类',
	'btn.print' : '打印',
	'btn.testify' : '出证',
	'btn.add_inquiry' : '添加涉案标记',
	'btn.remove_inquiry' : '解除涉案标记',
	'btn.checkout' : '借出',
	'btn.return' : '归还'
    };
    $.i18n.setDictionary(i18n_dict);
}
