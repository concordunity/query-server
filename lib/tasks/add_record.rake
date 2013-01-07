
# -*- coding: utf-8 -*-
namespace :add_record do

  desc "add record timeout for setting"
  task :add_timeout_for_setting=> :environment do
	@sets = Setting.where(:name => "timeout_value").first
	if @sets.nil?
	    Setting.create(:name => "timeout_value", :value => 18000)
	end
  end

end
