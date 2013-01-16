#encoding=utf-8
class AdminController < ApplicationController

  before_filter :load_layout , :except => [:system_log]

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
      begin 
	  if url == "system"
	    logger.info "system ======start"
	    logger.info username 
	    logger.info rolename 
	    logger.info daterange.length 
		result = SysLog.where(username).where(rolename).where(daterange).all	
	    logger.info "system ======end"
	  elsif url == "query" 
		result = QueryHistory.where(username).where(rolename).where(daterange).where(doc_id).where(org)	
	  elsif url == "document"
		result = DocumentHistory.where(username).where(rolename).where(daterange).where(doc_id).where(org)	
	  elsif url == "doctype"
		result = QueryDoctypeLog.where(username).where(rolename).where(daterange).where(doc_id).where(org)	
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

  def dictionary
      
  end

  def show_docs
    #@docs = Document.all
    logger.info current_user.to_json 

	@docs = DocComment.all
    logger.info params[:asy]
    if params[:asy] == "true"
      logger.info "======"
      render :json => @docs
    end
  end

  def upload_package_system
    result = upload(params[:upload_file])
    flash[:notice] = result[:message].join(",") 
    redirect_to "/admin/update_system" 
  end

  def log_index 

  end

  def download_log
     log_path = File.join(Rails.root,"log","#{Rails.env}.log")
     #flash[:notice] = "下载成功"
     send_file log_path
  end

  def clear_log
    cmd = "rake log:clear"
    system(cmd)
    flash[:notice] = "删除成功"
    render :log_index
  end

  def index

  end
  def update_system
      render :layout => "admin"
  end

  def update_password
  end

  def change_password
    current_user.password=params[:password]
    if current_user.save
        flash[:notice] = "密码更新成功"
	redirect_to "/"
    else
        flash[:notice] = "密码更新失败"
        render :action => "update_password"
    end
  end

###
# 格式：A.tar ----patch_A.tar----项目源代码
#          |
#           ------sh_A.tar-----./script/更新脚本
# 说明：通过上传更新包完成自动更新。将上传的文件存在临时目录，然后解压它们到指定目录。最后执行更新脚本。
# 作者：周振
###
  def upload(upload_file)
    result = {}
    result[:message]  = [] 
    filepath = "" 
    tmp_path = File.join("/","tmp",Time.now.to_i.to_s) 
    begin
    unless request.get?
      if upload_file.nil?
        result[:status] = false 
        result[:message]  << "请选择一个文件"
      elsif File.extname(upload_file.original_filename) != ".tar"
        result[:status] = false 
        result[:message]  << "上传的文件格式不正确，请重新上传"
      else
	#filepath = File.join(Rails.root.to_s,"public","docview","export_data",Time.now.to_i.to_s,upload_file.original_filename)
	system("mkdir #{tmp_path}")
	filepath = File.join(tmp_path,upload_file.original_filename)
        upload_file_to_server(filepath,upload_file)
        result[:status] = true 
        result[:message] << '上传成功'
      end
    end
    rescue => e
	logger.info e
        result[:status] = false 
        result[:message] << '上传失败'
    end
    begin
	if result[:status] == true
	    tar_name = File.basename(upload_file.original_filename,".tar")
	    patch_name = upload_file.original_filename
	    
	    #cmd = "chmod 775 #{filepath} && cp #{filepath} ~/src/ && tar xvf #{filepath} -C #{tmp_path} && cd #{tmp_path} && chmod 775 patch_#{patch_name}  && chmod 775 sh_#{patch_name}  && tar xvf patch_#{patch_name} -C #{Rails.root.to_s} && tar xvf sh_#{patch_name}  && sh ./script/sh_#{tar_name}.sh && rm -rf #{tmp_path}"	
	    #logger.info cmd
	    #system(cmd)
	    logger.info("sh #{File.join(Rails.root.to_s,"bin","update_system.sh")} #{filepath} #{tmp_path} #{Rails.root.to_s}")
	    system("sh #{File.join(Rails.root.to_s,"bin","update_system.sh")} #{filepath} #{tmp_path} #{Rails.root.to_s}")
        result[:message] << '更新成功'
	end
    rescue => e
	logger.info e
        result[:message] << '更新失败'
    end
    return result
  end

  private

     def upload_file_to_server(filepath,file)
      if !file.original_filename.empty?
        File.open(filepath, "wb") do |f|
          f.write(file.read)
        end
      end
    end 


end
