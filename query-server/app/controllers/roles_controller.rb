class RolesController < ApplicationController

  respond_to :json

  def index
    @roles = Role.where("name!='admin'").order(:updated_at).reverse

    @roles.each { |r|
      r.hack_display_name
    }

    respond_with(@roles)
  end

  def show
    role = Role.find(params[:id])
    if role.name == 'admin'
      respond_with(WebLink.all)
    else
      respond_with(role.web_links)
    end
  end


  # POST
  def update_role
    @role = Role.find(params[:id])
    web_links = params[:rolePermissions]
    wl_objs = WebLink.where(:name => web_links)
    @role.web_links = wl_objs
    @role.save
    @role.hack_display_name

    respond_with(@role)
  end

  def update
    @role = Role.find(params[:id])
    web_links = params[:rolePermissions]
    wl_objs = WebLink.where(:name => web_links)
    @role.web_links = wl_objs
    @role.save
    @role.hack_display_name

    respond_with(@role)
    #respond_to do |format|
      # format.json { head :no_content }
    #end
  end

  def create
    @role = Role.new()
    @role.name = params[:roleName]
    @role.display_name = params[:roleName]
    #print " this is a test ......", @role.name
    web_links = params[:rolePermissions]
    #logger.debug " this is a test ...... #{web_links.class}"
    #logger.debug "+++++++++++++++++++++Got params: #{web_links.inspect}"
 
    wl_objs = WebLink.where(:name => web_links)
    if !wl_objs.empty?
      @role.web_links = wl_objs
      if @role.save
        @role.hack_display_name
        respond_with(@role)
      end
    else

      respond_with(@role) do |format|
        format.html { render action: "new" }
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    
    @role = Role.find(params[:id])

    if !@role.user_ids.empty?
      render json: { :message => t('role.role_in_use') }, :status => 400
      return
    end

    @role.destroy

    respond_to do |format|
      format.html { redirect_to role_url }
      format.json { head :no_content }
    end
  end
end
