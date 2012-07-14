
use dms_development;

INSERT INTO web_links (name, description, controller, action) VALUES ('aCreateGroup','查阅历史','doc_group','create_group');


INSERT INTO web_links (name, description, controller, action) VALUES ('aStatsByUser','绩效统计','report','by_user');

INSERT INTO web_links (name, description, controller, action) VALUES ('aStatsByDoc','使用统计','report','by_doc');


INSERT INTO web_links (name, description, controller, action) VALUES ('aStatsAdvanced','添加/撤销涉案标志','report','advanced');

COMMIT;

