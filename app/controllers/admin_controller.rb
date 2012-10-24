#encoding=utf-8
class AdminController < ApplicationController

  def system
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

  #upload file to server(上传文件)
  def upload(upload_file)
    result = {}
    result[:message]  = [] 
    filepath = "" 
    begin
    unless request.get?
      if upload_file.nil?
        result[:status] = false 
        result[:message]  << "请选择一个文件"
      elsif File.extname(upload_file.original_filename) != ".tar"
        result[:status] = false 
        result[:message]  << "上传的文件格式不正确，请重新上传"
      else
	filepath = File.join(Rails.root.to_s,"public","docview","export_data",Time.now.to_i.to_s,upload_file.original_filename)
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
	    cmd = "cd #{Rails.root.to_s} && tar xvf #{filepath} && sh ./bin/#{File.basename(file.original_filename,".tar")}.sh"	
	    system(cmd)
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
