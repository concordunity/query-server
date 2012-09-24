# -*- coding: utf-8 -*-
class WebLink < ActiveRecord::Base
	WebLink.create(:name=>"aStatsExport",:description=>"出口删改单",:menu1=>"stats",:menu2=>"stats_export",:controller=>"Document",:action=>"stats_export")
end


