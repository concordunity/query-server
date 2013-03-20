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

	  ir_date = params[:list][:ir_date] || DateTime.now.strftime("%Y-%m-%d")
	  ir_org =  params[:list][:org] || current_user.subjection_org
	  idr = ir_date.to_datetime .. (ir_date.to_datetime + 1)

      ir = InterchangeReceipt.where(:org => ir_org, :ir_date => idr)
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
  def find_one 
      idr = DateTime.parse(params[:ir_date]).strftime("%Y-%m-%d").to_datetime .. DateTime.parse(params[:ir_date]).strftime("%Y-%m-%d").to_datetime + 1
      ir = InterchangeReceipt.where(:org => params[:org] || 2225, :ir_date => idr)
	  sum_copies = ir.sum("number_copies")
	  sum_package = ir.sum("package")
      return {:business_process => ir,:sum_json => {:number_copies => sum_copies, :package => sum_package}}
  end

  def create_ir
      idr = params[:ir_date].to_datetime .. (params[:ir_date].to_datetime + 1)
      ir = InterchangeReceipt.where(:org => current_user.subjection_org || 2225, :ir_date => idr).group("org").order("created_at desc")
      return {:business_process => ir}
  end

  def search_ir
      idr = params[:ir_date].to_datetime .. (params[:ir_date].to_datetime + 1)
      ir = InterchangeReceipt.where(:ir_date => idr).group("org").order("created_at desc")
      return {:business_process => ir}
  end

  #生成交接单
  def create_interchange_receipt
    status = 200
    if !params[:interchange_receipt].nil?
        @ir = InterchangeReceipt.new(params[:interchange_receipt])
        @ir.ir_username = current_user.username
        if @ir.doc_start <= @ir.doc_end
            dse = @ir.doc_start.to_i .. @ir.doc_end.to_i
            #is_ir = InterchangeReceipt.where(:org => current_user.subjection_org,:doc_start => dse, :doc_end => dse)
			#is_ir = InterchangeReceipt.where(["org = ? and  (doc_start > ? or  doc_end < ?)",@ir.org, @ir.doc_end,@ir.doc_start])
			is_ir = InterchangeReceipt.where(["org = ? and (
					   (? >= doc_start and ? <= doc_end) 
					or (? >= doc_start and ? <= doc_end)
					or (doc_start >= ? and doc_end <= ?)
					)",
					@ir.org, 
					@ir.doc_start,@ir.doc_start,
					@ir.doc_end,@ir.doc_end,
					@ir.doc_start,@ir.doc_end
					])
			logger.info is_ir.to_json
            @ir.org = @ir.org || 2225 
            @ir.ir_date = DateTime.now.to_s
			@ir.ir_status = 0
            if is_ir.length == 0
                @ir.save
            else
                status = 400
            end
            logger.info '========4====='
        else
            status = 401
        end
    end
    return {:interchange_receipt => @ir,:status => status}		
  end
  #接收交接单
  def search_interchange_receipt
      idr = params[:ir_date].to_datetime .. (params[:ir_date].to_datetime + 1)
      ir = InterchangeReceipt.where(:ir_date => idr).group("org").order("ir_date desc")
      respond_with({:business_process => ir},:location => "nil")
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
    InterchangeReceipt.where(:id => params[:ids]).each do |ir|
		ir.ir_status = 1
		ir.accept_date = DateTime.now
		ir.save
    end
	return {:message => "ok"}
  end

  #打印
  def print 
    return {:text => export_excel	}
  end

  #生成excel
  def export_excel
  	ir_date = params[:ir_date] || DateTime.now.strftime("%Y-%m-%d")
	ir_org = params[:ir_org] || current_user.subjection_org
    export_data = [] 
   	excel_name = "交接单"

	idr = ir_date.to_datetime .. (ir_date.to_datetime + 1)
	export_data << ["关区","创建时间","项目","开始理单号","结束理单号","份数","包数"]
	sum_copies = 0
	sum_package = 0 
    InterchangeReceipt.where(:ir_date => idr, :org => ir_org).each do |ir|
		sum_copies += ir.number_copies 
		sum_package += ir.package 
		export_data << [ir.org, ir.created_at, ir.doc_type, ir.doc_start, ir.doc_end, ir.number_copies, ir.package]
    end
	export_data << ["合计", "", "", "", "", sum_copies, sum_package]

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]
    count = -1
    export_data.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)

    file_name = file_name.sub(File.join(Rails.root,"public"),'')

    logger.info file_name
    return file_name
  end

  def filter_html_tags(str)
    if str.nil?
      return ""
    end
    str = str.gsub(/\n/, ' ');
    # filter out <span> tag
    str = str.gsub(/\<span.*?\>\s*(.*?)\s*\<\/span\>/i, '\1')
    return str.strip
  end

  #创建sheet
  def new_sheet(book,name)
    sheet = book.create_worksheet :name => name
    return sheet
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
