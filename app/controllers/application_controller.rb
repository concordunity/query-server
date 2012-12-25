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
        #@setting = Setting.where({:name=>"timeout"}).first
        #return @setting.value.to_i || 1800
	return 1800
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
