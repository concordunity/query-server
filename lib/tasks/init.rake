# -*- coding: utf-8 -*-
namespace :init do

  desc "update_web_link"
  task :update_web_link => :environment do
      if true
	WebLink.create(:name => "aUploadFile",:description => "上传文件",:controller => "upload_file",:action => "import_excel")
	WebLink.create(:name => "aSearchCondition",:description => "按特定条件查询",:controller => "search_condition",:action => "search_condition")
      else
	WebLink.where(:name => "aUploadFile").first.destroy
	WebLink.where(:name => "aSearchCondition").first.destroy
      end
  end

  desc " 创建数据库视图"
  task :view_report_day_info_from_sale_info => :environment do
    #ActiveRecord::Base.connection.execute "DROP VIEW view_sale_info"

    ActiveRecord::Base.connection.execute(sql)
  end

  desc " 创建数据库存储过程"
  task :create_procedure => :environment do
    ActiveRecord::Base.connection.execute "DROP PROCEDURE IF EXISTS test_1"
    sql = <<-SQL
    CREATE PROCEDURE test_1(OUT param1 INT)
    BEGIN

    DECLARE tmp int ;
    select id into param1 from daily_tradings order by id desc limit 1;
    set tmp = 1;
    END
    SQL
    
    ActiveRecord::Base.connection.execute(sql)
    ActiveRecord::Base.connection.execute("call test_1(@temp);")
    ActiveRecord::Base.connection.execute("#{@temp} = select @temp;")
  end

end

