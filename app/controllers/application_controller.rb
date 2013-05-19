class ApplicationController < ActionController::Base
  before_filter :check_user!, :except => [:welcome, :api_get_status, :api_query, :isUserLocked, :get_util, :login_admin, :sys_log, :system_log]
  #protect_from_forgery

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  rescue_from ActionController::RoutingError, :with => :record_not_found
  rescue_from ActiveRecord::RecordNotUnique, :with => :dupkey


  rescue_from CanCan::AccessDenied do |exception|

     respond_to do |format|
      format.html { redirect_to root_url, :alert => exception.message }
      format.json {
        render json: { :status => :error, 
          :message => "You are not authorized (#{exception.action})" },
        :status => 403  }
     end
  end
  def get_pages(params,records)
	if  params[:goto_page].to_i > records.length || params[:goto_page].to_i < 1 || params[:goto_page].blank?
		current_page = 1
	else
		current_page = params[:goto_page].to_i 
	end
	start_page = (current_page - 1)*100
	end_page = (current_page)*100
	count_records =  records.length
	if records.length % 100 == 0
		count_pages =  records.length / 100
	else
		count_pages =  records.length / 100 + 1
	end
	pageinfo = {:current_page => current_page, :count_records => count_records, :count_pages => count_pages }
	return {:page_info => pageinfo, :records => records[start_page,end_page]}
  end
#记录系统总日志
  def sys_log(params)
	p_action = params[:current_action]
	p_describe = params[:describe]
	if current_user
	    logger.info "====ok======" 
	    logger.info current_user.to_json
	    role_id = current_user.roles[0].id	
	    user_id = current_user.id
	
	    SysLog.create do |sl|
		sl.user_id = user_id
		sl.role_id = role_id 
		sl.action = t(p_action)
		#sl.action = p_action
		sl.describe = p_describe
		sl.user_name = current_user.display_name
		sl.email = current_user.display_name
		sl.role_name = current_user.roles[0].name
	    end
	else
	    logger.info "====error======" 
	    logger.info params 
	#    logger.info request.to_json
	    logger.info request.remote_ip
	    @user = User.find_by_username(params[:login_user])	
	    user_id = @user.id
	    role_id = @user.roles[0].id
	    user_name = @user.username + "(" + @user.fullname + ")"
	    role_name = Role.find(role_id).name
	    if @user
		
	        SysLog.create do |sl|
	  	    sl.user_id = user_id
		    sl.role_id = role_id 
		    sl.action = t(p_action)
		    sl.describe = p_describe
		    sl.user_name = user_name 
		    sl.email = user_name 
		    sl.role_name = role_name
	    end
	    end
	end
  end
  
  def query_history_log(params)
 	role_id = current_user.roles[0].id	
	ids = Document.where(:doc_id => params[:doc_ids]).collect(&:doc_id)
	doc = Document.find_by_doc_id(params[:doc_id])

	QueryHistory.create do |qh|
	    qh.user_id = current_user.id
	    qh.action = t(params[:current_action])
	    qh.describe = params[:describe]
	    qh.role_id = role_id
	    qh.org = doc.org 
	    qh.doc_type = doc.doc_type
	    qh.doc_id = doc.doc_id
	    qh.bulkids = ids.join(" ") unless ids.nil?
	    qh.ip = current_user.current_sign_in_ip
	    qh.email = current_user.display_name
	    qh.print = false
		qh.status = params[:status] || true
		qh.user_name = current_user.display_name
		qh.role_name = current_user.roles[0].name
		qh.doc_flag = doc.doc_flag
	end unless doc.nil?

	if params[:filters]
		doctype_log(params)	
	end
  end

  def document_history_log(params)
 	role_id = current_user.roles[0].id	
	doc = Document.find_by_doc_id(params[:doc_id])

	DocumentHistory.create do |dh|
	    dh.user_id = current_user.id
	    dh.action = t(params[:current_action])
	    dh.describe = params[:describe]
	    dh.role_id = role_id
	    dh.org = doc.org 
	    dh.doc_type = doc.doc_type 
	    dh.doc_id = doc.doc_id 
	    dh.ip = current_user.current_sign_in_ip
	    dh.email = current_user.display_name
		dh.status = params[:status] || true
		dh.user_name = current_user.display_name
		dh.role_name = current_user.roles[0].name
	end unless doc.nil?
	if params[:filters]
		doctype_log(params)	
	end
  end
  def doctype_log(params)
 	role_id = current_user.roles[0].id	
	doc = Document.find_by_doc_id(params[:doc_id])

	params[:filters].each do |f|
		QueryDoctypeLog.create do |dh|
	    	dh.user_id = current_user.id
			dh.action = t(params[:current_action])
			dh.describe = params[:describe]
			dh.role_id = role_id
			dh.org = doc.org 
			dh.doc_type = doc.doc_type 
			dh.doc_id = doc.doc_id 
			dh.ip = current_user.current_sign_in_ip
			dh.email = current_user.display_name
			dh.status = params[:status] || true
			dh.filters = f
			dh.user_name = current_user.display_name
			dh.role_name = current_user.roles[0].name
		end
	end
  end

  # exception.action, exception.subject                                             
  private

  def session_expiry
    if session[:expiry_time].blank?
      update_activity_time
    elsif (Time.now - session[:expiry_time]) < getTimeOut
      update_activity_time
    else
      reset_session
      #flash[:notice] = "连接超时，请重新登录！"
      redirect_to '/docview/docview.html'
    end
  end

  def update_activity_time
    session[:expiry_time] = Time.now
  end

  def getTimeOut
        @setting = Setting.where({:name=>"timeout_value"}).first
	return (@setting.nil?) ? 1800 : @setting.value.to_i
	#return 1800
  end


  def load_layout
    if user_signed_in? && current_user.username == "admin"
      return true;
    else
	redirect_to "/"
    end
  end

  def check_user!
    session_expiry
    if authenticate_user!
      return true
    end

    unless user_signed_in?
      redirect_to "/"
    end

    if params[:user] and params[:user][:username]
      user = User.find_by_username(params[:user][:username])
      if user and user.failed_attempts == 3 and user.locked_at.nil?
        user.locked_at = Time.now
        user.save
      end
    end
    return false
  end


  def dupkey
    render json: { :status => :error, :message => "Duplicate index in database." }, :status => 422
  end

  def record_not_found
    render json: { :status => :error,
      :message => "Record not in the system" }, :status => 404
  end

end
