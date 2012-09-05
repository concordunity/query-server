class ZeroFindCheckInfosController < ApplicationController
  # GET /zero_find_check_infos
  # GET /zero_find_check_infos.json
  def index
    @zero_find_check_infos = ZeroFindCheckInfo.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @zero_find_check_infos }
    end
  end

  # GET /zero_find_check_infos/1
  # GET /zero_find_check_infos/1.json
  def show
    @zero_find_check_info = ZeroFindCheckInfo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @zero_find_check_info }
    end
  end

  # GET /zero_find_check_infos/new
  # GET /zero_find_check_infos/new.json
  def new
    @zero_find_check_info = ZeroFindCheckInfo.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @zero_find_check_info }
    end
  end

  # GET /zero_find_check_infos/1/edit
  def edit
    @zero_find_check_info = ZeroFindCheckInfo.find(params[:id])
  end

  # POST /zero_find_check_infos
  # POST /zero_find_check_infos.json
  def create
    @zero_find_check_info = ZeroFindCheckInfo.new(params[:zero_find_check_info])

    respond_to do |format|
      if @zero_find_check_info.save
        format.html { redirect_to @zero_find_check_info, notice: 'Zero find check info was successfully created.' }
        format.json { render json: @zero_find_check_info, status: :created, location: @zero_find_check_info }
      else
        format.html { render action: "new" }
        format.json { render json: @zero_find_check_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /zero_find_check_infos/1
  # PUT /zero_find_check_infos/1.json
  def update
    @zero_find_check_info = ZeroFindCheckInfo.find(params[:id])

    respond_to do |format|
      if @zero_find_check_info.update_attributes(params[:zero_find_check_info])
        format.html { redirect_to @zero_find_check_info, notice: 'Zero find check info was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @zero_find_check_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zero_find_check_infos/1
  # DELETE /zero_find_check_infos/1.json
  def destroy
    @zero_find_check_info = ZeroFindCheckInfo.find(params[:id])
    @zero_find_check_info.destroy

    respond_to do |format|
      format.html { redirect_to zero_find_check_infos_url }
      format.json { head :no_content }
    end
  end
end
