class Test::SessionsController < Devise::SessionsController

  prepend_before_filter :require_no_authentication, :only => [:create ]
  #include Devise::Controllers::InternalHelpers

  respond_to :json
  def new
    logger.info "I have new into system"
#	destroy
    super
  end
  
  def create
    logger.info "I have login into system"
    resource = warden.authenticate!(auth_options)

    print resource.inspect

    return invalid_login_attempt unless resource
    sign_in(resource_name, resource)
	#current_user.client_ip = 
	logger.info request.env["HTTP_X_FORWARDED_FOR"]

	u = User.find_by_username(resource.username)
	u.current_sign_in_ip= request.env["HTTP_X_FORWARDED_FOR"] || request.remote_ip 
	u.client_ip = request.env["HTTP_X_FORWARDED_FOR"]  || request.remote_ip 
	u.save
    current_user = resource
	u.last_sign_in_ip= request.env["HTTP_X_FORWARDED_FOR"] || request.remote_ip 
	u.save
    links = current_user.web_links
    no_links = WebLink.all - links

    render :json=> {:success=>true, :id=>resource.id, :email=>resource.email,  :web_links => links,
      :not_authorized => no_links}
    return
  end


    #current_user = nil
    #resource = warden.authenticate!(auth_options)
    #sign_in(resource_name, resource)
    #current_user ||= warden.authenticate(:scope => :user)
    #respond_to do |format|
    #  format.html { super }
    #  format.json {

  #links = current_user.web_links
   #     no_links = WebLink.all - links
   #     render :status => 200, :json => { :error => "Success",
   #       "web_links" => links,
   #       "not_authorized" => no_links }
   #   }
   # end
  #end

  def destroy
    logger.info "========logger.info==========I have sign_out system"
    p "======= p =========== I have sign_out system"
    sign_out(resource_name)   
    super
	reset_session
    current_user = nil
  end
  protected

  def ensure_params_exist
    return unless params[:user].blank?
    render :json=>{:success=>false, :message=>"missing user_login parameter"}, :status=>422
  end

  def invalid_login_attempt
    warden.custom_failure!
    render :json=> {:success=>false, :message=>"Error with your login or password"}, :status=>401
  end
end
