# -*- coding: utf-8 -*-
class EirBusinessProcessController < ApplicationController
  respond_to  :json

  def business_process
	  result = send(params[:type])
      logger.info "eir_business_process========="
  	  #render json: result
	  #respond_with(result)
      respond_with(result,:location => "nil")
  end

  def interchange_receipt_list
      idr = params[:list][:ir_date].to_datetime .. (params[:list][:ir_date].to_datetime + 1)
      ir = InterchangeReceipt.where(:org => 2225, :ir_date => idr)
      respond_with({:business_process => ir},:location => "nil")
  end

  def delete_interchange_receipt
      @ir = InterchangeReceipt.find(params[:id])
      @ir.destroy

    respond_to do |format|
      format.json { head :no_content }
    end

  end

  private
  #生成交接单
  def create_interchange_receipt
    status = 200
    if !params[:interchange_receipt].nil?
        @ir = InterchangeReceipt.new(params[:interchange_receipt])
        @ir.ir_username = current_user.username
        if @ir.doc_start <= @ir.doc_end
            dse = @ir.doc_start .. @ir.doc_end
            is_ir = InterchangeReceipt.where(:doc_start => dse, :doc_end => dse)
            @ir.org = '2225'
            @ir.ir_date = DateTime.now.to_s
            if is_ir.length == 0
                @ir.save
            else
                status = 400
            end
            logger.info '========4====='
        else
            status = 400
        end
    end
    return {:interchange_receipt => @ir,:status => status}		
  end
  #接收交接单
  def search_interchange_receipt


  end

  #生成退单表单
  def create_dishonored_bill
	DishonoredBill.create(:org => params[:org], :reason => params[:reason], :explain => params[:explain],:db_date => Time.now)
  end
  def delete_dishonored_bill
  	DishonoredBill.delete_all(:id => params[:id])
  end
  #查询退单表单
  def search_dishonored_bill
	org = { :org => params[:org] }
	if org[:org].blank?
		org = "true"
	end
	#date = params[:date].to_date
  	DishonoredBill.where(org).order("created_at desc")#.where(:created_at => date .. (date + 1.day))	
  end

  #统计查询
  def statistical_inquiry

  end

  #更改状态
  def change_status

  end

  #打印
  def print

  end

  #创建excel
  def new_excel(name)
    Spreadsheet.client_encoding = "UTF-8"
    book = Spreadsheet::Workbook.new
    bold_heading = Spreadsheet::Format.new(:weight => :bold, :align => :merge)
    return [book,new_sheet(book,name),bold_heading]
  end

  # open excel and return sheet(打开excel文件，返回sheet)
  def open_excel url
    filepath = url
    Spreadsheet.client_encoding = "UTF-8"
    begin
      book = Spreadsheet.open filepath
      sheet = book.worksheet 0
      return [book,sheet]
    rescue
      return nil
    end
  end
end
