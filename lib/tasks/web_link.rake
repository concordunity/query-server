# -*- coding: utf-8 -*-
namespace :web_link do

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
end
