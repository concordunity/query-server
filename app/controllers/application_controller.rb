class ApplicationController < ActionController::Base
  before_filter :authenticate_user!, :except => [:welcome, :api_get_status, :api_query]
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

  def dupkey
    render json: { :status => :error, :message => "Duplicate index in database." }, :status => 422
  end

  def record_not_found
    render json: { :status => :error,
      :message => "Record not in the system" }, :status => 404
  end

end
