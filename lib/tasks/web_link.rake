# -*- coding: utf-8 -*-
namespace :web_link do

  desc "update_for_web_link"
  task :update_for_web_link => :environment do
      if WebLink.where(:name => "aQueryDocByBarcodeAlert").length == 0
	WebLink.create(:name => "aQueryDocByBarcodeAlert",:description => "修改单证查阅",:controller => "documents",:action => "edit_pagetype")
      else
	a = WebLink.where(:name => "aQueryDocByBarcodeAlert").first
        a.description = "修改单证查阅" 
        a.controller = "Document"
        a.action = "edit_pagetype"
        a.save
      end
  end
end
