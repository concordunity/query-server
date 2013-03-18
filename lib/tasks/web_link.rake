# -*- coding: utf-8 -*-
namespace :web_link do

  desc "add 交接单 menu for web link"
  task :add_business_process_for_web_link => :environment do
      if WebLink.where(:name => "aBusinessProcessInterchangeReceiptCreate").length == 0
	  	  WebLink.create(:name => "aBusinessProcessInterchangeReceiptCreate",:description => "交接清单录入",:controller => "eir_business_process",:action => "create_interchange_receipt")
      else
	  	  a = WebLink.where(:name => "aBusinessProcessInterchangeReceiptCreate").first
		  a.description = "交接清单录入" 
		  a.controller = "eir_business_process" 
		  a.action = "create_interchange_receipt" 
		  a.save
      end

      if WebLink.where(:name => "aBusinessProcessInterchangeReceiptSearch").length == 0
	  	  WebLink.create(:name => "aBusinessProcessInterchangeReceiptSearch",:description => "交接清单接收",:controller => "eir_business_process",:action => "search_interchange_receipt")
      else
	  	  a = WebLink.where(:name => "aBusinessProcessInterchangeReceiptSearch").first
		  a.description = "交接清单接收" 
		  a.controller = "eir_business_process" 
		  a.action = "search_interchange_receipt" 
		  a.save
      end
      if WebLink.where(:name => "aBusinessProcessDishonoredBillCreate").length == 0
	  	  WebLink.create(:name => "aBusinessProcessDishonoredBillCreate",:description => "退单录入",:controller => "eir_business_process",:action => "create_dishonored_bill")
      else
	  	  a = WebLink.where(:name => "aBusinessProcessDishonoredBillCreate").first
		  a.description = "退单录入" 
		  a.controller = "eir_business_process" 
		  a.action = "create_dishonored_bill" 
		  a.save
      end
      if WebLink.where(:name => "aBusinessProcessDishonoredBillSearch").length == 0
	  	  WebLink.create(:name => "aBusinessProcessDishonoredBillSearch",:description => "退单查询",:controller => "eir_business_process",:action => "search_dishonored_bill")
      else
	  	  a = WebLink.where(:name => "aBusinessProcessDishonoredBillSearch").first
		  a.description = "退单查询" 
		  a.controller = "eir_business_process" 
		  a.action = "search_dishonored_bill" 
		  a.save
      end
      if WebLink.where(:name => "aBusinessProcessStatisticalInquiry").length == 0
	  	  WebLink.create(:name => "aBusinessProcessStatisticalInquiry",:description => "交接单统计查询",:controller => "eir_business_process",:action => "statistical_inquiry")
      else
	  	  a = WebLink.where(:name => "aBusinessProcessStatisticalInquiry").first
		  a.description = "交接单统计查询" 
		  a.controller = "eir_business_process" 
		  a.action = "statistical_inquiry" 
		  a.save
      end

  end



  desc "add log menu for web link"
  task :add_log_for_web_link => :environment do
      if WebLink.where(:name => "aSystemLog").length == 0
	WebLink.create(:name => "aSystemLog",:description => "日志管理",:controller => "admin",:action => "log_list")
      else
	a = WebLink.where(:name => "aSystemLog").first
        a.description = "日志管理" 
        a.controller = "admin"
        a.action = "log_list"
        a.save
      end
  end

  desc "update_for_web_link"
  task :update_for_web_link => :environment do
      if WebLink.where(:name => "aQueryDocByBarcodeAlert").length == 0
	WebLink.create(:name => "aQueryDocByBarcodeAlert",:description => "修改单证标签",:controller => "documents",:action => "edit_pagetype")
      else
	a = WebLink.where(:name => "aQueryDocByBarcodeAlert").first
        a.description = "修改单证标签" 
        a.controller = "Document"
        a.action = "edit_pagetype"
        a.save
      end

      if WebLink.where(:name => "aQueryDocsPrint").length == 0 
        WebLink.create(:name => "aQueryDocsPrint",:description => "批量打印",:controller => "documents",:action => "all_print")	
      else
        a = WebLink.where(:name => "aQueryDocsPrint").first
        a.description = "批量打印"
        a.controller = "Document"
        a.action = "all_print"
        a.save
      end
  end
  
  desc "现在单证借阅审阅登记"
  task :add_five_menu_for_web_link => :environment do

  	  if WebLink.where(:name => "aRequisitionApplication").length == 0
	  	  WebLink.create(:name => "aRequisitionApplication",:description => "申请",:controller => "requisition",:action => "application_index")
      else
	      a = WebLink.where(:name => "aRequisitionApplication").first
		  a.description = "申请"
		  a.controller = "requisition" 
		  a.action = "application_index"
		  a.save
      end

  	  if WebLink.where(:name => "aRequisitionApproval").length == 0
	  	  WebLink.create(:name => "aRequisitionApproval",:description => "审批",:controller => "requisition",:action => "approval_index")
      else
	      a = WebLink.where(:name => "aRequisitionApproval").first
		  a.description = "审批"
		  a.controller = "requisition" 
		  a.action = "approval_index"
		  a.save
      end


  	  if WebLink.where(:name => "aRequisitionRegister").length == 0
	  	  WebLink.create(:name => "aRequisitionRegister",:description => "登记",:controller => "requisition",:action => "register_index")
      else
	      a = WebLink.where(:name => "aRequisitionRegister").first
		  a.description = "登记"
		  a.controller = "requisition" 
		  a.action = "register_index"
		  a.save
      end


  	  if WebLink.where(:name => "aRequisitionWriteOff").length == 0
	  	  WebLink.create(:name => "aRequisitionWriteOff",:description => "核销",:controller => "requisition",:action => "write_off_index")
      else
	      a = WebLink.where(:name => "aRequisitionWriteOff").first
		  a.description = "核销"
		  a.controller = "requisition" 
		  a.action = "write_off_index"
		  a.save
      end

  	  if WebLink.where(:name => "aRequisitionLendingStatistics").length == 0
	  	  WebLink.create(:name => "aRequisitionLendingStatistics",:description => "借出统计",:controller => "requisition",:action => "lending_statistics_index")
      else
	      a = WebLink.where(:name => "aRequisitionLendingStatistics").first
		  a.description = "借出统计"
		  a.controller = "requisition" 
		  a.action = "lending_statistics_index"
		  a.save
      end
  end

end
