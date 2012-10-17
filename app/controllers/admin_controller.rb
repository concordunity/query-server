class AdminController < ApplicationController
  
  def index

  end

  def update_system
      render :layout => "admin"
  end

  def update_password
  end

  def change_password
    current_user.password=params[:password]
    current_user.save
    
    render :action => "update_password"
  end

end
