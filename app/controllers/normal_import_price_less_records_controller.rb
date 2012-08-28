class NormalImportPriceLessRecordsController < ApplicationController
  # GET /normal_import_price_less_records
  # GET /normal_import_price_less_records.json
  def index
    @normal_import_price_less_records = NormalImportPriceLessRecord.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @normal_import_price_less_records }
    end
  end

  # GET /normal_import_price_less_records/1
  # GET /normal_import_price_less_records/1.json
  def show
    @normal_import_price_less_record = NormalImportPriceLessRecord.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @normal_import_price_less_record }
    end
  end

  # GET /normal_import_price_less_records/new
  # GET /normal_import_price_less_records/new.json
  def new
    @normal_import_price_less_record = NormalImportPriceLessRecord.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @normal_import_price_less_record }
    end
  end

  # GET /normal_import_price_less_records/1/edit
  def edit
    @normal_import_price_less_record = NormalImportPriceLessRecord.find(params[:id])
  end

  # POST /normal_import_price_less_records
  # POST /normal_import_price_less_records.json
  def create
    @normal_import_price_less_record = NormalImportPriceLessRecord.new(params[:normal_import_price_less_record])

    respond_to do |format|
      if @normal_import_price_less_record.save
        format.html { redirect_to @normal_import_price_less_record, notice: 'Normal import price less record was successfully created.' }
        format.json { render json: @normal_import_price_less_record, status: :created, location: @normal_import_price_less_record }
      else
        format.html { render action: "new" }
        format.json { render json: @normal_import_price_less_record.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /normal_import_price_less_records/1
  # PUT /normal_import_price_less_records/1.json
  def update
    @normal_import_price_less_record = NormalImportPriceLessRecord.find(params[:id])

    respond_to do |format|
      if @normal_import_price_less_record.update_attributes(params[:normal_import_price_less_record])
        format.html { redirect_to @normal_import_price_less_record, notice: 'Normal import price less record was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @normal_import_price_less_record.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /normal_import_price_less_records/1
  # DELETE /normal_import_price_less_records/1.json
  def destroy
    @normal_import_price_less_record = NormalImportPriceLessRecord.find(params[:id])
    @normal_import_price_less_record.destroy

    respond_to do |format|
      format.html { redirect_to normal_import_price_less_records_url }
      format.json { head :no_content }
    end
  end
end
