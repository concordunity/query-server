class ImportMostTimeOrgDocInfosController < ApplicationController
  # GET /import_most_time_org_doc_infos
  # GET /import_most_time_org_doc_infos.json
  def index
    @import_most_time_org_doc_infos = ImportMostTimeOrgDocInfo.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @import_most_time_org_doc_infos }
    end
  end

  # GET /import_most_time_org_doc_infos/1
  # GET /import_most_time_org_doc_infos/1.json
  def show
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @import_most_time_org_doc_info }
    end
  end

  # GET /import_most_time_org_doc_infos/new
  # GET /import_most_time_org_doc_infos/new.json
  def new
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @import_most_time_org_doc_info }
    end
  end

  # GET /import_most_time_org_doc_infos/1/edit
  def edit
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.find(params[:id])
  end

  # POST /import_most_time_org_doc_infos
  # POST /import_most_time_org_doc_infos.json
  def create
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.new(params[:import_most_time_org_doc_info])

    respond_to do |format|
      if @import_most_time_org_doc_info.save
        format.html { redirect_to @import_most_time_org_doc_info, notice: 'Import most time org doc info was successfully created.' }
        format.json { render json: @import_most_time_org_doc_info, status: :created, location: @import_most_time_org_doc_info }
      else
        format.html { render action: "new" }
        format.json { render json: @import_most_time_org_doc_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /import_most_time_org_doc_infos/1
  # PUT /import_most_time_org_doc_infos/1.json
  def update
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.find(params[:id])

    respond_to do |format|
      if @import_most_time_org_doc_info.update_attributes(params[:import_most_time_org_doc_info])
        format.html { redirect_to @import_most_time_org_doc_info, notice: 'Import most time org doc info was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @import_most_time_org_doc_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /import_most_time_org_doc_infos/1
  # DELETE /import_most_time_org_doc_infos/1.json
  def destroy
    @import_most_time_org_doc_info = ImportMostTimeOrgDocInfo.find(params[:id])
    @import_most_time_org_doc_info.destroy

    respond_to do |format|
      format.html { redirect_to import_most_time_org_doc_infos_url }
      format.json { head :no_content }
    end
  end
end
