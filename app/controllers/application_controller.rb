class ApplicationController < ActionController::Base
  before_filter :check_user!, :except => [:welcome, :api_get_status, :api_query, :isUserLocked, :get_util, :login_admin]
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
#记录系统总日志
  def sys_log(params)
	logger.info "==========" 
	logger.info current_user.to_json
 	role_id = current_user.roles[0].id	
	user_id = current_user.id
	p_action = params[:current_action]
	p_describe = params[:describe]
	
	SysLog.create do |sl|
		sl.user_id = user_id
		sl.role_id = role_id 
		sl.action = t(p_action)
		#sl.action = p_action
		sl.describe = p_describe
		sl.user_name = current_user.display_name
		sl.role_name = current_user.roles[0].name
	end
  end
  
  def query_history_log(params)
 	role_id = current_user.roles[0].id	
	ids = Document.where(:doc_id => params[:doc_ids]).collect(&:doc_id)

	QueryHistory.create do |qh|
	    qh.user_id = current_user.id
	    qh.action = t(params[:current_action])
	    qh.describe = params[:describe]
	    qh.role_id = role_id
	    qh.org = params[:org]
	    qh.doc_type = params[:doc_type]
	    qh.doc_id = params[:doc_id]
	    qh.bulkids = ids.join(" ")
	    qh.ip = current_user.current_sign_in_ip
	    qh.email = current_user.display_name
	    qh.print = false
	end
  end

  def document_history_log(params)
 	role_id = current_user.roles[0].id	
	DocumentHistory.create do |dh|
	    dh.user_id = current_user.id
	    dh.action = t(params[:current_action])
	    dh.describe = params[:describe]
	    dh.role_id = role_id
	    dh.org = params[:org]
	    dh.doc_type = params[:doc_type]
	    dh.doc_id = params[:doc_id]
	    dh.ip = current_user.current_sign_in_ip
	    dh.email = current_user.display_name

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
      return true;
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
