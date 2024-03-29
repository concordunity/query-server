class ApplicationController < ActionController::Base
  before_filter :check_user!, :except => [:welcome, :api_get_status, :api_query, :isUserLocked ]

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

  def check_user!
    if authenticate_user!
      return true;
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
