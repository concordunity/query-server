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
	InterchangeReceipt.transaction do 
	dt_s = DateTime.now
	dt_e = DateTime.now + 1
	dta = (dt_s.to_date ..dt_e.to_date)
	@irs = InterchangeReceipt.where(:org => current_user.subjection_org,:ir_username => current_user.username, :ir_status => 1, :created_at => dta)
	if @irs.blank? 
	params[:datas].collect { |key,interchange_receipt|

    if !interchange_receipt.nil?
		is_irs = InterchangeReceipt.where(:org => current_user.subjection_org, :created_at => dta, :doc_type => interchange_receipt[:doc_type].to_i)	
		if is_irs.blank?
		logger.info "======#{interchange_receipt}"
        @ir = InterchangeReceipt.new(interchange_receipt)
        @ir.ir_username = current_user.username
        @ir.ir_fullname = current_user.fullname
		@ir.org = current_user.subjection_org 
		@ir.ir_status = 0
		@ir.ir_date = DateTime.now.to_s

		if @ir.doc_type.to_i > 6
#			@ir.number_copies =  @ir.package 
			@ir.save
		else

        if @ir.doc_start.to_i <= @ir.doc_end.to_i && @ir.doc_start.to_i > 0
			ir_some = InterchangeReceipt.where(["year(created_at) = ? and org = ? and ( (doc_start < ? and doc_end < ? ) or (doc_start > ?  and doc_end > ?)) and doc_type < 7", 
												DateTime.now.year,@ir.org, @ir.doc_start.to_i,@ir.doc_start.to_i, @ir.doc_end.to_i,@ir.doc_end.to_i])
			
			ir_all = InterchangeReceipt.where(:org => @ir.org).where(["year(created_at) = ? and doc_type < 7",DateTime.now.year])
			count = ir_all.count - ir_some.count

			number_copies = @ir.doc_end.to_i - @ir.doc_start.to_i + 1
            if count == 0 
				@ir.number_copies = number_copies
				@ir.save
            else
                status = 400
            end
        else
            status = 401
        end
		end
		else
            status = 407
		end
		if status != 200
			raise ActiveRecord::Rollback
		end
    end
	} 
	else
		status = 406
	end
	if params[:datas].nil?
		status = 403
	end
    end
    return {:status => status}		
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
	if  params[:date].nil?
		date = {} 
	else
		pdate = params[:date].to_date
		date = {:created_at => pdate .. (pdate + 1.day)}
    end

  	DishonoredBill.where(org).order("created_at desc").where(date)
  end

  #统计查询
  def statistical_inquiry
	#InterchangeReceipt.joins(:dishonored_bills).where(:dishonored_bills => { :org => params[:org] } , :interchange_receipts => { :org => params[:org]  }  )
	bd = params[:begin_date]
	ed = params[:end_date]
	if params[:query_type] == "interchange_receipt"
		data = InterchangeReceipt.find_by_sql("select org,doc_type,sum(number_copies),sum(package) from interchange_receipts where (created_at between #{params[:begin_date]} and #{params[:end_date]} ) and #{ [2200,""].include?(params[:org]) ? "true" : params[:org]} group by org,doc_type")
	else
		data = DishonoredBill.where("select *,count(*) as num from dishonored_bills where (created_at between #{params[:begin_date]} and #{params[:end_date]} ) and #{ [2200,""].include?(params[:org]) ? "true" : params[:org]} group by org")
	end

	result = filter_proc(data)
	return {:result => result,:message => "ok"}
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
    #return {:text => export_excel	}
    return {:text => print_excel	}
  end

  def print_excel

  	ir_date = params[:ir_date] || DateTime.now.strftime("%Y-%m-%d")
	ir_org = params[:ir_org] || current_user.subjection_org
	ir_username = params[:ir_username] || current_user.username
	idr = ir_date.to_datetime .. (ir_date.to_datetime + 1)
	ir_result = {:sum_copies => 0, :sum_package => 0, :data => []} 
   	excel_name = "交接单"
	file_name_arr = []
	count = 0
	tar_arr = []
	ir_result[:org]  = DictionaryInfo.where(:dic_type => "org", :dic_num => ir_org).first.dic_name 
	ir_result[:ir_date]  = InterchangeReceipt.where(:ir_date => idr, :org => ir_org, :ir_username => ir_username, :ir_status => 1).order("created_at desc").first.ir_date.strftime("%Y-%m-%d")
	9.times {|i|
		ir = InterchangeReceipt.where(:ir_date => idr, :org => ir_org, :ir_username => ir_username,:doc_type => (i + 1)).first
		ir_result[:data] << ir 
		unless ir.blank?
			ir_result[:sum_copies]  += ir.number_copies 
			ir_result[:sum_package]  += ir.package 
		end
	}
	logger.info "===============" 
	logger.info  ir_result
	#book,sheet = get_sheet(filepath, result.length)
	record_index = 1 
		filepath = File.join(Rails.root,"doc","business_process.xls")	
		book,sheet = open_excel(filepath)
		sheet.each_with_index do |row,index|
			row.each_with_index do |column,j|
				case column
				when "[A1]"
					#海关名称
					row[j] = ir_result[:org] 
				when "[J1]"
					#日期
					row[j] = ir_result[:ir_date] 
				when "[K1]"
					row[j] = ir_result[:sum_copies] 
				when "[L1]"
					row[j] = ir_result[:sum_package] 
				else
					#序号 单证种类 起始归档号 终止归档号 报关单份数 档案袋包数
					rdata = ir_result[:data][record_index-1]
					if column == "[D#{record_index}]"
						logger.info "====D" 
						logger.info rdata
						row[j] =  rdata.blank? ? "" :  rdata.doc_start
					elsif column == "[E#{record_index}]"
						row[j] =  rdata.blank? ? "" :  rdata.doc_end
					elsif column == "[F#{record_index}]"
						row[j] =  rdata.blank? ? "" :  rdata.number_copies
					elsif column == "[G#{record_index}]"
						row[j] =  rdata.blank? ? "" :  rdata.package
						record_index += 1
					end
				end
			end
		end
		new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
		Dir.mkdir(new_path) unless Dir.exists?(new_path)
		new_path = File.join(new_path, "#{excel_name}.xls")
		file_name = new_path.sub(File.join(Rails.root,"public"),'')
		book.write(new_path)	
		logger.info " ====  最终呈现结果  ======"
		return file_name
  end

  def print_excel_test
	logger.info "=====print excel ====="
  	ir_date = params[:ir_date] || DateTime.now.strftime("%Y-%m-%d")
	ir_org = params[:ir_org] || current_user.subjection_org
	ir_username = params[:ir_username] || current_user.username
   	excel_name = "交接单"
	file_name_arr = []
	filepath = File.join(Rails.root,"doc","business_process.xls")	
    book,sheet = open_excel(filepath)
	idr = ir_date.to_datetime .. (ir_date.to_datetime + 1)
	result = []
	count = 0 
	sum_copies = 0
	sum_package = 0 
	irs_result = {:sum_copies => 0, :sum_package => 0, :data => []} 

    @irs = InterchangeReceipt.where(:ir_date => idr, :org => ir_org, :ir_username => ir_username).each_with_index do |ir,index|
		irs_result[:data] << ir 
		irs_result[:sum_copies]  += ir.number_copies 
		irs_result[:sum_package]  += ir.package 
		if index != 0 && (index + 1) % 15 == 0
			result << irs_result  
			irs_result = {:sum_copies => 0, :sum_package => 0, :data => []} 
			count += 1
		else
			result[count] = irs_result  
		end
	end
	result.each_with_index do |interchange_receipt,irIndex|
		logger.info "--------第#{irIndex}张表----" 
		tmp_index = 1 
		sheet.each_with_index do |row,index|
			logger.info "第#{index}行,已经查到#{tmp_index}条记录" 
			tmp_arr = ["B","C","D","E","F","G"].collect {|i| "[#{i}#{tmp_index}]"}
			row.each_with_index do |column,j|
			    
				logger.info "---当前列为第#{j}列,内容是: #{column}----" 
				#logger.info "OK" if tmp_arr.include?(column)
				case "'" + row[j].to_s + "'"
				when "[A1]"
				#海关名称
				logger.info "#----海关名称----#{tmp_index}----" 
				row[j] = interchange_receipt[:data][0].org
				when "[B" +tmp_index.to_s + "]"
#序号
				tmp_index += 1
				logger.info "#----序号----#{tmp_index}----" 
				row[j] = tmp_index 
				when "[C" + tmp_index.to_s + "]"
#单证种类
				logger.info "#----单证种类----#{tmp_index}----" 
				row[j] = interchange_receipt[:data][tmp_index].doc_type
				when "[D" + tmp_index.to_s + "]"
#起始归档号
				logger.info "#-----起始归档号---#{irIndex}----" 
				row[j] = interchange_receipt[:data][tmp_index].doc_start
				when "[E" + tmp_index.to_s + "]"
				#终止归档号
				logger.info "#-----终止归档号---#{irIndex}----" 
				row[j] = interchange_receipt[:data][tmp_index].doc_end
				when "[F" +tmp_index.to_s + "]"
#报关单份数
				row[j] = interchange_receipt[:data][tmp_index].number_copies
				when "[G" + tmp_index.to_s + "]"
#档案袋包数
				row[j] = interchange_receipt[:data][tmp_index].package
				when "[J1]"
#日期
				row[j] = Time.now.to_s
				else
					logger.info "==#{column}===#{row[j] == column}===========" 
					logger.info column.to_s.length
				end
			end
		end
		new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
		Dir.mkdir(new_path) unless Dir.exists?(new_path)
		new_path = File.join(new_path, "#{excel_name}_#{irIndex}.xls")
		book.write(new_path)	

		file_name_arr << new_path.sub(File.join(Rails.root,"public"),'')
    end
	logger.info "=================" 
	logger.info file_name_arr
    return file_name_arr[0]
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
  def open_excel(url,index=nil)
    filepath = url
    Spreadsheet.client_encoding = "UTF-8"
    begin
      book = Spreadsheet.open filepath
      sheet = book.worksheet index || 0
      return [book,sheet]
    rescue
      return nil
    end
  end

  def get_sheet(url,count)
	filepath = url
    Spreadsheet.client_encoding = "UTF-8"
    begin
      book = Spreadsheet.open filepath
	  sheet = []
	  (0 .. count).each do |i| 
		book.add_worksheet(book.worksheet 0) 
		sheet <<  book.worksheet(i || 0) 
	  end if count > 0
      return [book,sheet]
    rescue
      return nil
    end

  end

  def filter_proc(source) 
	#字段数量
 	  column_count = params[:iColumns]
#
#排序的下标
	  iSortCol_0 = params[:iSortCol_0]	  
#排序的方式
	  sSortDir_0 = params[:sSortDir_0]	  
#搜索内容
	  sSearch = params[:sSearch]
#排序的字段
	  mDataPro = params["mDataProp_" + iSortCol_0 || 0]
	  logger.info "we are searching for #{sSearch}, then we may sort columns by #{mDataPro} #{sSortDir_0}"
	  conditions_arr = [] 
	  if sSearch.blank?
		conditions_arr << "true"
	  else
		#字典表：关区 
        dis_org = DictionaryInfo.where(["dic_type='org' AND dic_name like binary(?) ","%#{sSearch}%"])
		#字典表：单证种类
        dis_slpd = DictionaryInfo.where(["dic_type='business_process' AND dic_name like binary(?) ","%#{sSearch}%"])
	    #检索详单信息表
		dis_ids = RequisitionDetail.where(["single_card_number like (?)","%#{sSearch}%"])
		#生气检索条件
		condition_dic = dis_org.collect(&:dic_num)
		condition_slpd = dis_slpd.collect(&:dic_num)
	    condition_rd = dis_ids.collect(&:requisition_id)
        (0 ... column_count.to_i - 1).each do |cc|
	        #logger.info "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
			if params[:query_type] == "interchange_receipt"
				case params["mDataProp_" + cc.to_s]
				when "org"
					conditions_arr << "#{ params["mDataProp_" + cc.to_s]} in (#{condition_dic.join(",")})" unless dis_org.blank?  
				when "doc_type"
					conditions_arr << "#{ params["mDataProp_" + cc.to_s]} in (#{condition_slpd.join(",")})" unless dis_slpd.blank?  
				else
					conditions_arr << "#{ params["mDataProp_" + cc.to_s]} like binary('%#{sSearch}%')"
				end
			else
				case params["mDataProp_" + cc.to_s]
				when "org"
					conditions_arr << "#{ params["mDataProp_" + cc.to_s]} in (#{condition_dic.join(",")})" unless dis_org.blank?  
				end

			end
		end
	  end
      logger.info "================" 
      logger.info conditions_arr 
      logger.info "=======1=#{mDataPro} #{sSortDir_0}"	
	  if params[:query_type] == "interchange_receipt"
		orders = "#{mDataPro} #{sSortDir_0}" if mDataPro != "package" || mDataPro != "folder"	
	  else
		orders = "#{mDataPro} #{sSortDir_0}"  if mDataPro != "package" || mDataPro != "folder" || mDataPro != "doc_type"	
	  end
      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
      logger.info "=======0=#{orders}"	

	  condition = {:orders =>orders,:where=>conditions_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }

      logger.info "=======1=#{condition[:orders]}"	
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )

	  aaData = {:bussiness_process=> result}

	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: aaData}
  end



end
