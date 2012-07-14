# -*- coding: utf-8 -*-

{
"aQueryDocByBarcode"=>"单票查阅",
"aQueryDocsByBarcodes"=>"批量查阅",
"aQueryDocsByConditions"=>"随机抽样查阅",
"aQueryBySource"=>"单证暂存",
"aOperateInvolved"=>"添加/撤销涉案标志",
"aOperateLended"=>"电子档案借阅/归还",
"aOperateTestified"=>"出证",
"aOperatePrint"=>"打印",
"aOperateHistory"=>"操作历史",
"aManageQueries"=>"查阅历史",
"aCreateGroup"=>"单证组管理",
"aPerformanceStatis"=>"绩效统计",
"aUsabilityStatis"=>"涉案/借出单证清单",
"aManageUsers"=>"用户管理",
"aManageRoles"=>"权限管理"
}.each {|key,value| a=WebLink.find_by_name(key);a.description=value;a.save}
