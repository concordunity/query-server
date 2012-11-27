use dms_development;


update web_links set description='按报关单号单票查阅' where name='aQueryDocByBarcode';
update web_links set description='按报关单号批量查阅' where name='aQueryDocsByBarcodes';
update web_links set description='特定条件组合查阅' where name='aQueryDocsByConditions';
update web_links set description='查阅历史' where name='aManageQueries';
update web_links set description='绩效统计' where name='aPerformanceStatis';
update web_links set description='使用统计' where name='aUsabilityStatis';
update web_links set description='添加/撤销涉案标志' where name='aOperateInvolved';
update web_links set description='电子档案借阅/归还' where name='aOperateLended';
update web_links set description='出证处理' where name='aOperateTestified';
update web_links set description='单证操作历史' where name='aOperatePrint';
update web_links set description='用户管理' where name='aManageUsers';
update web_links set description='角色权限管理' where name='aManageRoles';
update web_links set description='查阅历史' where name='aCreateGroup';
update web_links set description='绩效统计' where name='aStatsByUser';
update web_links set description='使用统计' where name='aStatsByDoc';
update web_links set description='添加/撤销涉案标志' where name='aStatsAdvanced';
commit;

