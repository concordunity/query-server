class AccountsController < ApplicationController 

  respond_to  :json
  
  def index 
    r = Role.find_by_name('admin')
    @users = User.order(:updated_at).reverse - r.users
    roles = []
    @users.each do |u|
       roles.append(u.roles(force_load=true))
    end

    #respond_to do |format|
    #  format.json { render :json => { :users => @users :only => [:email, :last_sign_in_at, :last_sign_in_ip,
    #                                                                     :current_sign_in_at, :current_sign_in_ip ]),
    #      :roles => roles }
    #  }
    #  format.html
    #end
    respond_with(:users => @users, 
                 :roles => roles)
  end

  def update
    @user = User.find(params[:id])

    if params[:user][:password].blank?
       params[:user].delete :password
    end
    respond_to do |format|
      if @user.update_attributes(params[:user])
        @user.role_ids = [params[:role].to_i]
        @user.locked_at = nil
        @user.failed_attempts = 0
        @user.save
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        #format.json { head :no_content }
	format.json { render :json => { :user =>  @user} }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def isUserLocked
    user = User.find_by_username(params[:username])
    if user and user.locked_at
      render json: { :locked => true }
      return
    end
    render json: { :locked => false }
  end


  def get_links
    respond_to do |format|
      format.html { super }
      format.json {

        links = current_user.web_links
        no_links = WebLink.all - links

        user_info = { :error => "Success",
          :last_ip => current_user.last_sign_in_ip,
          :last_time => current_user.last_sign_in_at,
          :fullname => current_user.fullname,
          :email => current_user.email
        }
        if current_user.admin?
          user_info["not_authorized"] = []
          user_info["web_links"] = WebLink.all
        else
          user_info["web_links"] = links
          user_info["not_authorized"] = no_links
        end

        render :status => 200, :json => user_info
      }
    end
  end

  def newuser
    self.create
  end

  def create
    @user = User.new()
    username = params[:username] 
    if username.blank?
      username = params[:user][:username]
      @user.username = username
      @user.fullname = params[:user][:fullname]
      @user.password = params[:user][:password]
      @user.orgs = params[:user][:orgs]
      @user.email = params[:user][:email]
      @user.doc_type = params[:user][:doc_type]
    else
      @user.username = username
      @user.fullname = params[:fullname]
      @user.password = params[:password]
      @user.orgs = params[:orgs]
      @user.email = params[:email]
      @user.doc_type = params[:doc_type]
    end

    @user.role_ids = [params[:role].to_i]

    if @user.email.blank?
      if !username.index('@customs.gov.cn').nil?
        @user.email = username
      else 
        @user.email = username + '+no-reply@customs.gov.cn'
      end
    end

    if @user.save
      render :status => 201, :json => { :status => 200, :user => @user }
    else
      #respond_with(@user) do |format|
      #  format.html { render action: "new" }
        #format.json { render json: { :status => 422,
      render json: { :status => 422,
            :email => @user.errors[:email].any?  ?  @user.errors[:email][0] : '' ,
            :password => @user.errors[:password].any? ?  @user.errors[:password][0] : '',
            :username => @user.errors[:username].any? ?  @user.errors[:username][0] : ''
          }, :status => 200 
      #end
    end
  end


  def change_password
    current_user.password=params[:password]
    if current_user.save
      render :status => 200, :json => { :user => current_user }
    else
      render json: current_user.errors[:password][0], status: :unprocessable_entity
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

end
