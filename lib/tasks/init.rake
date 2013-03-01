# -*- coding: utf-8 -*-
namespace :init do

  desc " 日志分析"
  task :request_log_analyzer => :environment do
	log = File.join(Rails.root,"log","development.log")
	html = File.join(Rails.root,"public","development.html")

  	system("request-log-analyzer #{log} --format rails3  --output HTML --file  #{html}")
  end

  desc "update_web_link_for_menu"
  task :update_web_link_for_menu => :environment do
=begin
WebLink.order("name").each_with_index {|item,index| str<< "wl_#{index} = WebLink.find_by_name_and_action('#{item.name}','#{item.action}')#    #{item.description}&";str<< "unless wl_#{index}.nil?&    wl_#{index}.menu1 = ''&";str<< "    wl_#{index}.menu2 = ''&";str<< "    wl_#{index}.save&end&"}
=end
          wl_0 = WebLink.find_by_name_and_action('aCreateGroup','create_group')#    单证组管理 ok-stats
          unless wl_0.nil?
              wl_0.menu1 = 'docs'
              wl_0.menu2 = 'docs_group'
              wl_0.save
          end
          wl_1 = WebLink.find_by_name_and_action('aManageDictionary','table_columns')#    字典表管理
          unless wl_1.nil?
              wl_1.menu1 = 'system'
              wl_1.menu2 = 'system_dictionary'
              wl_1.save
          end
          wl_2 = WebLink.find_by_name_and_action('aManageLogs','manage_log')#    日志管理
          unless wl_2.nil?
              wl_2.menu1 = 'system'
              wl_2.menu2 = 'system_log'
              wl_2.save
          end
          wl_3 = WebLink.find_by_name_and_action('aManageQueries','stats_query')#    查阅历史 ok-stats
          unless wl_3.nil?
              wl_3.menu1 = 'stats'
              wl_3.menu2 = 'stats_query'
              wl_3.save
          end
          wl_4 = WebLink.find_by_name_and_action('aManageRoles','manage_role')#    权限管理 ok-system
          unless wl_4.nil?
              wl_4.menu1 = 'system'
              wl_4.menu2 = 'system_role'
              wl_4.save
          end
          wl_5 = WebLink.find_by_name_and_action('aManageUsers','manage_user')#    用户管理 ok-system
          unless wl_5.nil?
              wl_5.menu1 = 'system'
              wl_5.menu2 = 'system_user'
              wl_5.save
          end
          wl_6 = WebLink.find_by_name_and_action('aOperateHistory','dh_report')#    操作历史 ok-docs
          unless wl_6.nil?
              wl_6.menu1 = 'docs'
              wl_6.menu2 = 'docs_operate'
              wl_6.save
          end
          wl_7 = WebLink.find_by_name_and_action('aOperateInvolved','inquire')#    添加/撤销涉案标志 ok-docs
          unless wl_7.nil?
              wl_7.menu1 = 'docs'
              wl_7.menu2 = 'docs_inquire'
              wl_7.save
          end
          wl_8 = WebLink.find_by_name_and_action('aOperateLended','checkout')#    电子档案借阅/归还 ok-docs
          unless wl_8.nil?
              wl_8.menu1 = 'docs'
              wl_8.menu2 = 'docs_checkout'
              wl_8.save
          end
          wl_9 = WebLink.find_by_name_and_action('aOperatePrint','print')#    打印 ok-docs
          unless wl_9.nil?
              wl_9.menu1 = 'docs'
              wl_9.menu2 = 'docs_print'
              wl_9.save
          end
          wl_10 = WebLink.find_by_name_and_action('aOperateTestified','testify')#    出证 ok-docs
          unless wl_10.nil?
              wl_10.menu1 = 'docs'
              wl_10.menu2 = 'docs_testify'
              wl_10.save
          end
          wl_11 = WebLink.find_by_name_and_action('aPerformanceStatis','stats_stats')#    绩效统计 ok-stats
          unless wl_11.nil?
              wl_11.menu1 = 'stats'
              wl_11.menu2 = 'stats_stats'
              wl_11.save
          end
          wl_12 = WebLink.find_by_name_and_action('aQueryBySource','by_doc_source')#    单证暂存 ok-search
          unless wl_12.nil?
              wl_12.menu1 = 'search'
              wl_12.menu2 = 'search_source'
              wl_12.save
          end
          wl_13 = WebLink.find_by_name_and_action('aQueryDocByBarcode','query')#    单票查阅 ok-search
          unless wl_13.nil?
              wl_13.menu1 = 'search'
              wl_13.menu2 = 'search_single'
              wl_13.save
          end
          wl_14 = WebLink.find_by_name_and_action('aQueryDocsByBarcodes','multi_query')#    批量查阅 ok-search
          unless wl_14.nil?
              wl_14.menu1 = 'search'
              wl_14.menu2 = 'search_multi'
              wl_14.save
          end
          wl_15 = WebLink.find_by_name_and_action('aQueryDocsByConditions','search_docs')#   随机抽样查阅  ok-search
          unless wl_15.nil?
              wl_15.menu1 = 'search'
              wl_15.menu2 = 'search_docs'
              wl_15.save
          end
          wl_16 = WebLink.find_by_name_and_action('aSearchCondition','search_condition')#    高风险报关单查询 ok-search
          unless wl_16.nil?
              wl_16.menu1 = 'search'
              wl_16.menu2 = 'search_hight'
              wl_16.save
          end
          wl_17 = WebLink.find_by_name_and_action('aStatsAdvanced','advanced')#   随机抽样查阅 
          unless wl_17.nil?
              wl_17.menu1 = 'search'
              wl_17.menu2 = 'search_advanced'
              wl_17.save
          end
          wl_18 = WebLink.find_by_name_and_action('aStatsByDoc','by_doc')#    使用统计
          unless wl_18.nil?
              wl_18.menu1 = ''
              wl_18.menu2 = ''
              wl_18.save
          end
          wl_19 = WebLink.find_by_name_and_action('aStatsByUser','by_user')#    绩效统计
          unless wl_19.nil?
              wl_19.menu1 = ''
              wl_19.menu2 = ''
              wl_19.save
          end
          wl_20 = WebLink.find_by_name_and_action('aSysSetting','sys-setting')#    系统参数设置 ok-system
          unless wl_20.nil?
              wl_20.menu1 = 'system'
              wl_20.menu2 = 'system_setting'
              wl_20.save
          end
          wl_21 = WebLink.find_by_name_and_action('aSystemConfig','system_config')#    系统配置
          unless wl_21.nil?
              wl_21.menu1 = ''
              wl_21.menu2 = ''
              wl_21.save
          end
          wl_22 = WebLink.find_by_name_and_action('aUploadFile','import_excel')#    上传文件 ok-search
          unless wl_22.nil?
              wl_22.menu1 = 'search'
              wl_22.menu2 = 'search_upload'
              wl_22.save
          end
          wl_23 = WebLink.find_by_name_and_action('aUsabilityStatis','stats_usage')#    涉案/借出单证清单 ok-stats
          unless wl_23.nil?
              wl_23.menu1 = 'stats'
              wl_23.menu2 = 'stats_usage'
              wl_23.save
          end
          


  end

  desc "update_web_link"
  task :update_web_link => :environment do
      if WebLink.where(:name => "aSysSetting").length == 0
	WebLink.create(:name => "aSysSetting",:description => "系统参数设置",:controller => "Setting",:action => "sys-setting")
      else
	a = WebLink.where(:name => "aSysSetting").first
	a.description = "系统参数设置" 
	a.controller = "Setting"
	a.action = "sys-setting"
	a.save
      end
      if WebLink.where(:name => "aUploadFile").length == 0
	WebLink.create(:name => "aUploadFile",:description => "上传文件",:controller => "upload_file",:action => "import_excel")
      else
	a = WebLink.where(:name => "aUploadFile").first
        a.description = "上传文件" 
        a.controller = "upload_file"
        a.action = "import_excel"
        a.save
      end
      if WebLink.where(:name => "aSearchCondition").length == 0
	WebLink.create(:name => "aSearchCondition",:description => "高风险报关单查询",:controller => "search_condition",:action => "search_condition")
      else
	a = WebLink.where(:name => "aSearchCondition").first
        a.description = "高风险报关单查询"
        a.controller = "search_condition"
        a.action = "search_condition"
        a.save
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

