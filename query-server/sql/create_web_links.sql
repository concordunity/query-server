
use dms_development;

DELETE FROM web_links;

INSERT INTO web_links (name, description, controller, action) VALUES ('aQueryDocByBarcode','按报关单号单票查阅','Document','query');

INSERT INTO web_links (name, description, controller, action) VALUES ('aQueryDocsByBarcodes','按报关单号批量查阅','Document','multi_query');

INSERT INTO web_links (name, description, controller, action) VALUES ('aQueryDocsByConditions','特定条件组合查阅','Document','search_docs');


INSERT INTO web_links (name, description, controller, action) VALUES ('aManageQueries','查阅历史','query_history','list');


INSERT INTO web_links (name, description, controller, action) VALUES ('aPerformanceStatis','绩效统计','report','report');

INSERT INTO web_links (name, description, controller, action) VALUES ('aUsabilityStatis','使用统计','report','stats');


INSERT INTO web_links (name, description, controller, action) VALUES ('aOperateInvolved','添加/撤销涉案标志','Document','inquire');

INSERT INTO web_links (name, description, controller, action) VALUES ('aOperateLended','电子档案借阅/归还','Document','checkout');

INSERT INTO web_links (name, description, controller, action) VALUES ('aOperateTestified','出证处理','Document','testify');

INSERT INTO web_links (name, description, controller, action) VALUES ('aOperatePrint','打印','Document','print');

INSERT INTO web_links (name, description, controller, action) VALUES ('aOperateHistory','单证操作历史','DocumentHistory','dh_report');



INSERT INTO web_links (name, description, controller, action) VALUES ('aManageUsers','用户管理','auth','manage_user');

INSERT INTO web_links (name, description, controller, action) VALUES ('aManageRoles','角色权限管理','auth','manage_role');
COMMIT;

