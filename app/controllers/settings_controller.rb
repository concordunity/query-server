# -*- coding: utf-8 -*-

class SettingsController < ApplicationController
  
  respond_to :json

  def find_log
	  logger.info params
	  logger.info params[:url]
	  url = params[:url]
	  username = params[:username] == "" ? ["true"] : ["user_name like ?","%" + params[:username] + "%"]
	  rolename = params[:rolename].blank? ? ["true"] : ["role_name like ?","%" + params[:rolename] + "%"]
	  org = params[:org].blank? ? ["true"] : {:org => params[:org]}
	  doc_id = params[:doc_id].blank? ? ["true"] : {:doc_id => params[:doc_id]}
      daterange = {:created_at => params[:from_date].to_date .. (params[:to_date].to_date + 1.day)} if (!params[:from_date].blank? && !params[:to_date].blank?)
	  result = []
	  r = Role.find_by_name('admin')
	  no_admin = ["role_id <> ?", r.id] 
      begin 
	  if url == "system"
	    logger.info "system ======start"
	    logger.info username 
	    logger.info rolename 
	    logger.info daterange.length 
		result = SysLog.where(no_admin).where(username).where(rolename).where(daterange).all#.paginate(:per_page => 10, :page => params[:page])	
	    logger.info "system ======end"
	  elsif url == "query" 
		result = QueryHistory.where(no_admin).where(username).where(rolename).where(daterange).where(doc_id).where(org)	
	  elsif url == "document"
		result = DocumentHistory.where(no_admin).where(username).where(rolename).where(daterange).where(doc_id).where(org)	
	  elsif url == "doctype"
		result = QueryDoctypeLog.where(no_admin).where(username).where(rolename).where(daterange).where(doc_id).where(org)	
	  end
      rescue => e
	    logger.info "error======"
		logger.info e
	  end
      render :json => {:results => result, :url => url}, :status => 200
  end

  #接收格式：｛:action => '', :describe => ""｝
  def system_log
	sys_log(params)	
	render :nothing => true 
  end

  def query_log
	sys_log(params)	
	query_history_log(params)
	render :nothing => true 
  end

  def document_log
	sys_log(params)	
	document_history_log(params)
	render :nothing => true 
  end


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
