# -*- coding: utf-8 -*-

class SettingsController < ApplicationController
  
  respond_to :json


  def set_dialog
	dialog_path = Rails.root.join("public","docview","export_data",current_user.username)
	system("touch #{dialog_path}")
	render json: {status: 200} 
  end

  def get_dialog
	dialog_path = File.join(Rails.root,"public","docview","export_data",current_user.username)
	dialog_path_end = File.join(Rails.root,"public","docview","export_data",current_user.username + ".end")
	result = ""
	dialog_tag = false
	if  File.exists?(dialog_path_end)
		File.open(dialog_path,"r") do |f|
	    	result << f.read
		end

		system("chmod 775 #{dialog_path} && rm #{dialog_path}")
		system("chmod 775 #{dialog_path_end} && rm #{dialog_path_end}")
		dialog_tag = true 
	end
	render json: {status: 200,message: dialog_tag, result: result} 
  end

  def index
    result = {}
    Setting.all.each { |s|
      result[s.name] = s.value
    }

    respond_with(result)
  end

  def sys_setting
    ["maxn", "checkout_period", "max_queries_per_month", "timeout_value"].each {|n|
      if !params[n].blank?
        s = Setting.find_by_name(n)
        if s.nil?
          s = Setting.new
          s.name = n
        end
        s.value = params[n]
        s.save
      end
    }

    render json: {:status => 200}
  end
end
