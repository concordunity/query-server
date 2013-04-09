# -*- coding: utf-8 -*-
class AccountsController < ApplicationController 

  respond_to  :json
  
  def index 
    r = Role.find_by_name('admin')
    @users = User.where(["id not in (?)", r.users.collect(&:id)]).order(:updated_at)
=begin
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
=end

    if params[:iColumns]
		render json:  filter_proc(@users, params)
	else
	    roles = []
		@users.each do |u|
			roles.append(u.roles(force_load=true))
		end
		respond_with(:users => @users, :roles => roles)
	end
  end

  def user_select
    #r = Role.find_by_name('admin')
	#@users = User.where(["subjection_org = ? AND id not in (?)", current_user.subjection_org ,r.users.collect(&:id)])
		kz_user = User.includes(:roles).where(["subjection_org = ? and roles.name like ?",current_user.subjection_org,"%科长%"])
		gld_user = User.includes(:roles).where(["subjection_org = ? and roles.name like ?",current_user.subjection_org,"%关领导%"])
	respond_with(:kz_users => kz_user, :gld_users => gld_user)
  end
 
  def filter_proc(source,params) 
 	  column_count = params[:iColumns]
	  iSortCol_0 = params[:iSortCol_0]	  
	  sSortDir_0 = params[:sSortDir_0]	  
	  sSearch = params[:sSearch]
	  mDataPro = params["mDataProp_" + iSortCol_0]
	  logger.info "we are searching for #{sSearch}, then we may sort columns by #{mDataPro} #{sSortDir_0}"
	  condition_arr = [] 
	  if sSearch.blank?
		condition_arr << "true"
	  else
        
        dis_org = DictionaryInfo.where(["dic_type='org' AND dic_name like ? ","%#{sSearch}%"])
        dis_jck = DictionaryInfo.where(["dic_type='jck' AND dic_name like ? ","%#{sSearch}%"])
		user_ids = [] 
		Role.where(["name like ?","%#{sSearch}%"]).each {|r|
			 user_ids += r.users.collect(&:id)
		}
		condition_dic = dis_org.collect(&:dic_num) if dis_org 
		condition_jck = dis_jck.collect(&:dic_num) if dis_jck


		if condition_dic || condition_jck
			logger.info "-------"
			logger.info condition_jck 
			logger.info condition_dic 
			
		end
		condition_user = user_ids.uniq if user_ids
		condition_arr = ["username like '%#{sSearch}%' "]
		condition_arr << ["fullname like '%#{sSearch}%' "]
		condition_arr << ["id in (#{condition_user.join(",")}) "] if !condition_user.blank?
		condition_arr << ["subjection_org in (#{condition_dic.join(",")}) "] if !condition_dic.blank?
		if condition_dic
			condition_dic.each do |cd|
				condition_arr << ["orgs like '%#{condition_dic.join(",")}%' "] 
			end
		end
		condition_arr << ["doc_type in (#{condition_jck.join(",")}) "] if !condition_jck.blank?
	  end
      logger.info "================" 
      logger.info condition_arr 
      logger.info "=======1=#{mDataPro} #{sSortDir_0}"	
	  orders = "#{mDataPro} #{sSortDir_0}" if mDataPro != "roles"	
      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
      logger.info "=======0=#{orders}"	
	  condition = {:orders =>orders,:where=>condition_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }
      logger.info "=======1=#{condition[:orders]}"	
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )

	  roles = []
      result.each do |u|
		  roles.append(u.roles(force_load=true))
	  end
	  aaData = {:users => result, :roles => roles}
	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: aaData}
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
          :last_ip 		=> current_user.last_sign_in_ip,
          :last_time 	=> current_user.last_sign_in_at,
          :fullname 	=> current_user.fullname,
          :email 		=> current_user.email,
		  :orgs			=> current_user.orgs,
		  :roles		=> current_user.roles,
		  :subjection_org => current_user.subjection_org
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
      @user.subjection_org = params[:user][:subjection_org]
      @user.email = params[:user][:email]
      @user.doc_type = params[:user][:doc_type]
    else
      @user.username = username
      @user.fullname = params[:fullname]
      @user.password = params[:password]
      @user.orgs = params[:orgs]
      @user.subjection_org = params[:user][:subjection_org]
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
