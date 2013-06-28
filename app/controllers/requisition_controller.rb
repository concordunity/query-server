# -*- coding: utf-8 -*-
class RequisitionController < ApplicationController

  respond_to  :json

  def requisitions
	result = send(params[:type])
    logger.info "*******" 
=begin
    logger.info request.env
    logger.info request.env["HTTP_X_FORWARDED_FOR"] 
	logger.info request.headers["X-Real-IP"]
	logger.info request.ip
    logger.info current_user.current_sign_in_ip
=end
    logger.info request.remote_ip
    logger.info current_user.current_sign_in_ip
    logger.info current_user.last_sign_in_ip
    logger.info current_user.client_ip
    #render :json => result, :status => 200
    #render :json => {:result => result}, :status => 200
#	logger.info result
    respond_with(result)
  end

  #统计
  def lending_statistics_list
	date_arr = params[:start_date].to_date.to_datetime .. params[:end_date].to_date.next.to_datetime
	org_condition = params[:org] == "" ? ["true"] : {:org =>params[:org]}
	@r = Requisition.where(:created_at => date_arr).where(org_condition).group("org").count
	result = []	
	@r.collect do |org, count|
		record = ActiveSupport::OrderedHash.new	
		r  = Requisition.joins(:requisition_details).where(:requisitions => {:org => org,:created_at => date_arr})
		rd_count = r.count
		rd  = r.where(:requisition_details => {:is_check => true})
		rd_count_false = rd.count	
		record[:org] = org
		record[:count] = count
		record[:rd_count] = rd_count
		record[:rd_count_false] = rd_count_false
		result << record
	end
	p "==========" 
	p result
#	rrs = {:requisitions => result}
	rrs =  result
    render :json => rrs , :status => 200
  end

  #统计
  def lending_statistics_list_old


	where_condition = {}
	sql_condition = ["'status' is not null AND status <> 20"] 
	org_condition = params[:org].to_s == "2200" ? [""] : {:org =>params[:org]}
	date_arr = params[:start_date].to_date.to_datetime .. params[:end_date].to_date.next.to_datetime
	username =  params[:username]
	case params[:type]
	when "application"
		sql_condition << "apply_staff like binary('%#{username}%')" unless username.blank? 
		#where_condition[:apply_staff] = username unless username.blank? 
		where_condition[:created_at] = date_arr 
	when "approval"
		sql_condition << "approving_officer like binary('%#{username}%')" unless username.blank? 
		#where_condition[:approving_officer] = username unless username.blank? 
		where_condition[:approval_time] = date_arr 
	when "register"
		sql_condition << "registration_staff like binary('%#{username}%')" unless username.blank? 
		#where_condition[:registration_staff] = username unless username.blank? 
		where_condition[:check_in_time] = date_arr 
	when "write_off"
		sql_condition << "write_off_staff like binary('%#{username}%')" unless username.blank? 
		#where_condition[:write_off_staff] = username unless username.blank? 
		where_condition[:write_off_time] = date_arr 
	end
	@requisitions = Requisition.where(org_condition).where(where_condition).where(sql_condition.join(" AND ")).order("created_at desc")
    requisition_details = get_details(@requisitions) 
	result = {:requisitions => @requisitions, :requisition_details => requisition_details}

		
    render :json => result, :status => 200
    #respond_with(result)
  end
  def filter_org
	doc_id = params[:doc_id]
	a = OrgForDoc.where(["(org_number = ? OR org_number = ?)", doc_id, doc_id[0,2]])
	a = a.where(:org => current_user.orgs.split(",")) if current_user.orgs != "2200"
	render json: a
  end

  def filter_info(params)
	logger.info "===   filter_docs ===="
    result = {:status => false,:message => ""}
    doc_id = params[:doc_id] || params[:single_card_number]
    logger.info doc_id 
    org = params[:org]
	ofd = OrgForDoc.where(["(org_number = ? OR org_number = ?)", doc_id[9,3], doc_id[9,2]])
    logger.info "===  0 ===="
	ofd = ofd.where(:org => current_user.orgs.split(",")) if current_user.orgs != "2200"
    @document = Document.find_by_doc_id(doc_id)
    logger.info "===  1 ===="
	rd = RequisitionDetail.where(["status not in(20,31,32,33) AND status is not null"]).where(:single_card_number => doc_id)

    logger.info "===  2 ===="
    if @document.blank? && rd.blank? && !ofd.blank?
		logger.info "===  系统无此单证 ===="
        result[:status] = 200 
        result[:message] = "此单证：" + doc_id + ",可以正常添加。"
    else
		logger.info "===  系统存在此单证 ===="
		if !@document.blank?
			result[:message] = "此单证：" + doc_id + "，不能添加，系统中已经电子化了。"
			result[:status] = 201 
		elsif !rd.blank?
			result[:message] = "此单证：" + doc_id + "，不能添加，系统中已经申请过了。"
			result[:status] = 202 
		#	result[:status] = 200 
		#	result[:message] = "此单证：" + doc_id + ",可以正常添加。"
		elsif ofd.blank? 
			result[:message] = "此单证：" + doc_id + "，不能添加，没有查阅权限。"
			result[:status] = 203 
		else
			result[:message] = "此单证：" + doc_id + "，不能添加，请重新填写或者移除。"
			result[:status] = 204 
		end
    end
	logger.info result[:message] 
	return result
  end

  def filter_requisition(params)
	result = filter_info(params)
	tag = true if result[:status] == 200
	return tag
  end

  def filter_docs
    logger.info "===   filter_docs ===="
    result = filter_info(params) 
    render json: result
  end

  def create_requisition
#	{"tel"=>"15101151137", "department_name"=>"研发", "requisition_details"=>{"0"=>{"single_card_number"=>"222520121250004811", "modify_accompanying_documents"=>"aa", "where_page"=>"1", "lent_reasons"=>"不知道"}, "1"=>{"single_card_number"=>"222520121250004812", "modify_accompanying_documents"=>"bb", "where_page"=>"2", "lent_reasons"=>"有问题呗"}}}
	logger.info "=== first ====" 
	status = 200
	tag = true
	Requisition.transaction do
		begin
			tel = params[:tel]
			department_name = params[:department_name]
			org = params[:org]
			
				@requisition = Requisition.create do |r|
					r.tel = tel 
					r.department_name = department_name 
					r.org = params[:subjection_org] || current_user.subjection_org
					r.apply_staff = current_user.username
					r.apply_staff_fullname = current_user.fullname
					r.application_originally = params[:application_originally]
					r.approving_officer = params[:approving_officer]
					#diname = DictionaryInfo.find_by_dic_type_and_dic_num("org",current_user.subjection_org).dic_name
					#r.serial_number = diname + Time.now.strftime("%Y%m%d")+ format("%05d",rand(10000))
					rs = Requisition.where(:org => current_user.subjection_org).where(["year(created_at) = ?",DateTime.now.year]).count
					r.serial_number = current_user.subjection_org + Time.now.strftime("%Y")+ format("%05d",rs+1)
					r.status = params[:approving_officer].blank? ? 21 : 10 
					r.storage_sites = (params[:type] == "application_nanhui") ? "2223" : r.org #current_user.subjection_org
				end
				logger.info "=== second ====" 
				tag = create_requisition_details(params,@requisition)	
				if tag == false
					status = 500
					raise ActiveRecord::Rollback
				end
		rescue => e
			logger.info "===error====" 
			logger.info e
			tag = false 
			status = 500
			raise ActiveRecord::Rollback
		end
	end
	logger.info "=== last ====" 
	render json: {:message => "ok",:status => status, :requisition => @requisition}, :status => 200
  end

  def print_one
	model = Requisition.find params[:id]
	di = DictionaryInfo.find_by_dic_type_and_dic_num("scene_lent_paper_document ",model.status)
	orgs = DictionaryInfo.find_by_dic_type_and_dic_num("org",model.org)
	requisition_details = model.requisition_details
	spread_sheet_row = []
	spread_sheet_row << ["申请人员",model.apply_staff,"申请日期",model.created_at.to_s(:db)] 
	spread_sheet_row << ["电话号码",model.tel,"关区及科室名称",orgs.dic_name + " " + model.department_name] 
	spread_sheet_row << ["状态",di.dic_name ,"终结说明",model.termination_instructions] 
	spread_sheet_row << ["抽单信息","","",""]
	spread_sheet_row << ["单证号码","随附文档","所在页码","借出原因"] 
	requisition_details.each do |rd|
		spread_sheet_row << [rd.single_card_number,rd.modify_accompanying_documents,rd.where_page,rd.lent_reasons]
	end	
	spread_sheet_row << ["审核人员",model.approving_officer,"审核时间",model.approval_time.nil? ? "" :  model.approval_time.to_s(:db)]
	spread_sheet_row << ["登记人员",model.registration_staff,"登记时间",model.check_in_time.nil? ? "" : model.check_in_time.to_s(:db)]
	spread_sheet_row << ["核销人员",model.write_off_staff,"核销时间",model.write_off_time.nil? ? "" : model.write_off_time.to_s(:db)] 

    excel_name = "application"
    #export_data = JSON.parse(params[:tableData])

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]

    count = -1
    spread_sheet_row.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)
    #send_file file_name
    file_name = file_name.sub(File.join(Rails.root,"public"),'')
    render :text => file_name
  end

  def print
	rd = Requisition.find params[:id]
	rdd = rd.requisition_details
	column_names = Requisition.column_names

	dic_info = {}
	
	DictionaryInfo.where("dic_type = 'org' or dic_type = 'scene_lent_paper_document'").collect { |o| dic_info[o.dic_num] = o.dic_name  } 
	filepath = File.join(Rails.root,"doc","requisition-new.xls")	
    Spreadsheet.client_encoding = "UTF-8"
	book = Spreadsheet.open filepath
	sheet = book.worksheet 0

	offset = 0
	counter = 0
	format = (sheet.row(4).formats[0]) || (Spreadsheet::Format.new :color => :blue,:weight => :bold,:size => 22)
	sheet.each_with_index do |row,i|
		row.each_with_index do |column,j|
			cell = row[j].to_s.strip
			if column_names.include? cell
				row[j] = rd[cell]
				#dic info
				if ['org', 'status', 'storage_sites' ].include? cell
					row[j] = dic_info[rd[cell].to_i]
				end
				#to date
				if [ 'created_at', 'approval_time','two_approver_time', 'check_in_time','write_off_time' ].include? cell
					row[j] = rd[cell].strftime("%Y-%m-%d") if !rd[cell].nil?
				end
			end
			if cell == "##START##"
				offset = counter
			end
		end
		counter = counter + 1
	end

	rdd.each_with_index do |detail,i|
	sheet.insert_row((i +  offset) , [ i + 1, detail["single_card_number"] ,detail["rationale_single_number"], detail["is_check"].to_s == "false"  ? '正常':'异常' ])
	4.times {|time| sheet.row(i+offset).set_format(time,format) }
	end

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    new_path = File.join(new_path,"现场单证借阅申请单.xls")
	book.write(new_path)	

    file_name = new_path.sub(File.join(Rails.root,"public"),'')

	render :text => file_name
  end

  def print_old
	rd = Requisition.find params[:id]
	rdd = rd.requisition_details
	filepath = File.join(Rails.root,"doc","requisition.xls")	
    book,sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
		row.each_with_index do |column,j|
			case row[j]
			when "[A1]"
				#单位名称
				department_name = rd.department_name.nil? ? "" : rd.department_name
				if rd.org.nil? 
					org = ""
				else
					di = DictionaryInfo.find_by_dic_type_and_dic_num("org",rd.org)
					org = di.dic_name 
				end 
				row[j] = org.to_s + department_name
			when "[A2]"
				#经办关员
				if rd.apply_staff.nil?
					row[j] = "" 
				else
					row[j] = rd.apply_staff + "(" + rd.apply_staff_fullname + ")" 
				end
			when "[A3]"
				#日期
				row[j] = rd.created_at.nil? ? "" : rd.created_at.strftime('%Y-%m-%d')
			when "[A4]"
				#联系电话
				row[j] = rd.tel.nil? ? "" : rd.tel
			when "[B1]"
				#报关单号1
				row[j] = rdd[0].nil? ? "" : rdd[0].single_card_number
			when "[B2]"
				#报关单号2
				row[j] = rdd[1].nil? ? "" : rdd[1].single_card_number
			when "[B3]"
				#报关单号3
				row[j] = rdd[2].nil? ? "" : rdd[2].single_card_number
			when "[C1]"
				#随附单证名称1
				row[j] = (!rdd[0].nil? && !rdd[0].modify_accompanying_documents.nil?) ? rdd[0].modify_accompanying_documents : ""
			when "[C2]"
				#随附单证名称2
				row[j] = (!rdd[1].nil? && !rdd[1].modify_accompanying_documents.nil?) ? rdd[1].modify_accompanying_documents : ""

			when "[C3]"
				#随附单证名称3
				row[j] = (!rdd[2].nil? && !rdd[2].modify_accompanying_documents.nil?) ? rdd[2].modify_accompanying_documents : ""

			when "[D1]"
				#所在页1
				row[j] = (!rdd[0].nil? && !rdd[0].where_page.nil?) ? rdd[0].where_page : ""

			when "[D2]"
				#所在页2
				row[j] = (!rdd[1].nil? && !rdd[1].where_page.nil?) ? rdd[1].where_page : ""

			when "[D3]"
				#所在页3
				row[j] = (!rdd[2].nil? && !rdd[2].where_page.nil?) ? rdd[2].where_page : ""

			when "[E1]"
				#借出原因1
				row[j] = (!rdd[0].nil? && !rdd[0].lent_reasons.nil?) ? rdd[0].lent_reasons : ""

			when "[E2]"
				#借出原因2
				row[j] = (!rdd[1].nil? && !rdd[1].lent_reasons.nil?) ? rdd[1].lent_reasons : ""

			when "[E3]"
				#借出原因3
				row[j] = (!rdd[2].nil? && !rdd[2].lent_reasons.nil?) ? rdd[2].lent_reasons : ""

			when "[F1]"
				#审批科长
				if rd.approving_officer.nil?
					row[j] = "" 
				else
					row[j] = rd.approving_officer + "(" + rd.approving_officer_fullname + ")" 
				end

			when "[F2]"
				#审批日期
				row[j] = rd.approval_time.nil? ? "" : rd.approval_time.strftime('%Y-%m-%d')

			when "[I1]"
				#现场单位审批意见
				if ![1,11,21].include?(rd.status) 	
					row[j] = " 同意调阅纸质单证" 
				elsif [1,21].include?(rd.status)
					row[j] = ""
				else
					row[j] = (rd.termination_instructions.nil? ? "" : rd.termination_instructions)
					#row[j] = rd.termination_instructions.nil? ? "" : rd.termination_instructions
				end

			when "[J1]"
				#核销时间
				row[j] = rd.write_off_time.nil? ? "" : rd.write_off_time.strftime('%Y-%m-%d')

			when "[H1]"
				#档案库经办人
				if rd.registration_staff.nil?
					row[j] = "" 
				else
					row[j] = rd.registration_staff + "(" + rd.registration_staff_fullname + ")" 
				end

			when "[H2]"
				#实际抽单日期
				row[j] = rd.check_in_time.nil? ? "" : rd.check_in_time.strftime('%Y-%m-%d')
			end	

		end	
	end

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    new_path = File.join(new_path,"现场单证借阅申请单.xls")
	book.write(new_path)	

    file_name = new_path.sub(File.join(Rails.root,"public"),'')
    render :text => file_name
  end

  def update_requisition

  end

  def create_requisition_details(params,requisition)
	result = true 
	RequisitionDetail.transaction do
	logger.info "===  three ====" 
		params[:requisition_details].collect do |index,requisition_details|
			logger.info requisition_details 
			single_card_number = requisition_details[:single_card_number]
			if filter_requisition(requisition_details)
				modify_accompanying_documents = requisition_details[:modify_accompanying_documents]
				where_page = requisition_details[:where_page]
				lent_reasons = requisition_details[:lent_reasons]
				rationale_single_number =  requisition_details[:rationale_single_number]	
				logger.info "===  four ====" 
				unless rationale_single_number
					result = false 
					raise
				end
				RequisitionDetail.create do |rd|
					rd.single_card_number = single_card_number
					rd.rationale_single_number = rationale_single_number 
					rd.modify_accompanying_documents = modify_accompanying_documents
					rd.where_page = where_page
					rd.lent_reasons = lent_reasons
					rd.is_check = false 
					rd.requisition_id = requisition.id
				end 
			else
				result = false 
				raise
			end
		end 
	end
	return result
  end


  def change_status
    requisition =  Requisition.where({ :id => params[:id] }).first

    case params[:from_action]
		when "requisition_history"
			if [10,21].include?(params[:status].to_i)
			#撤销审批，重新指定一级审批
				requisition.approving_officer = params[:approving_officer]
				requisition.approval_time = "" 
			elsif [11,22].include?(params[:status].to_i)
			#撤销一级审批，重新指定二级审批
				requisition.two_approvers = params[:two_approvers] 
				requisition.two_approver_time = "" 
			elsif params[:status].to_i == 20
			#删除
				requisition.status = 20 
			end
        when "approval"
			requisition.approving_officer_fullname = current_user.fullname
			requisition.approval_time = Time.now
			requisition.two_approvers = params[:two_approvers] 
		when "approval_guan"
			requisition.two_approvers_fullname = current_user.fullname
			requisition.two_approver_time = Time.now
        when "register"
            requisition.registration_staff = current_user.username
            requisition.registration_staff_fullname = current_user.fullname
            requisition.check_in_time = Time.now
			RequisitionDetail.where(:id => params[:ids].keys).each do |rd|
				rd.is_check = params[:ids][rd.id.to_s] == "true" 
				rd.save
			end
        when "write_off"
            requisition.write_off_staff = current_user.username
            requisition.write_off_staff_fullname = current_user.fullname
            requisition.write_off_time = Time.now
        when "application"
			 requisition.approving_officer = params[:approving_officer] 
		when "application_nanhui"
			 requisition.approving_officer = params[:approving_officer] 
		else
			logger.info "Unkonw from action: #{params[:from_action]}"
		end

    requisition.status = params[:status]
    requisition.requisition_details.each do |rd|
	if [20,31,32,33,34].include?(params[:status].to_i)
		rd.is_check = true 
        end
	rd.status = requisition.status
	rd.save
    end
    if params[:reject_text]
        requisition.termination_instructions = params[:reject_text]
    end

    requisition.save
    render json: {:message => "ok"}, :status => 200
  end
  private
  #申请
  def application
	
	@requisitions = Requisition.where({:apply_staff => current_user.username}).where(["'status' is not null"])
    requisition_details = get_details(@requisitions) 
	return {:requisitions => @requisitions, :requisition_details => requisition_details}
  end

  def application_nanhui
	
	@requisitions = Requisition.where({:apply_staff => current_user.username}).where(["'status' is not null"])
    requisition_details = get_details(@requisitions) 
	return {:requisitions => @requisitions, :requisition_details => requisition_details}
  end

 #审批
  def approval
	#get_requisition([10,11])
	approval_page
  end

  def approval_guan
	#get_requisition([10,11])
	approval_guan_page
  end

  #登记
  def register
	#get_requisition(12)
	register_page
  end

  #核销
  def write_off
	#get_requisition(13)
	write_off_page
  end

  #借阅历史
  def requisition_history
	get_requisition_page
  end

  #审批:大表单
  def approval_page
	get_requisition_page(10)
  end

  def approval_guan_page
	get_requisition_page(11)
  end
  #登记:大表单
  def register_page
	get_requisition_page(12)
  end

  #核销:大表单
  def write_off_page
	get_requisition_page(13)
  end

  #借阅历史:大表单
  def requisition_history_page
	get_requisition_page
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
		#字典表：借阅状态
        dis_slpd = DictionaryInfo.where(["dic_type='scene_lent_paper_document' AND dic_name like binary(?) ","%#{sSearch}%"])
		#检索详单信息表
		dis_ids = RequisitionDetail.where(["single_card_number like (?)","%#{sSearch}%"])
		#生气检索条件
		condition_dic = dis_org.collect(&:dic_num)
		condition_slpd = dis_slpd.collect(&:dic_num)
	    condition_rd = dis_ids.collect(&:requisition_id)
        (0 ... column_count.to_i - 1).each do |cc|
	        #logger.info "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
			case params["mDataProp_" + cc.to_s]
			when "subjection_org"
				conditions_arr << "#{ params["mDataProp_" + cc.to_s]} in (#{condition_dic.join(",")})" unless dis_org.blank?  
			when "requisition_details"
				conditions_arr << "id in (#{condition_rd.join(",")})" unless dis_ids.blank?
			when "status"
				conditions_arr << "#{ params["mDataProp_" + cc.to_s]} in (#{condition_slpd.join(",")})" unless dis_slpd.blank?
			when "found_num"

			else
				conditions_arr << "#{ params["mDataProp_" + cc.to_s]} like binary('%#{sSearch}%')"
			end
		end
	  end
      logger.info "================" 
      logger.info conditions_arr 
      logger.info "=======1=#{mDataPro} #{sSortDir_0}"	
	  orders = "#{mDataPro} #{sSortDir_0}" if mDataPro != "requisition_details"	

      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
      logger.info "=======0=#{orders}"	

	  condition = {:orders =>orders,:where=>conditions_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }

      logger.info "=======1=#{condition[:orders]}"	
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )

	  requisition_details = get_details(result) 
	  aaData = {:requisitions => result, :requisition_details => requisition_details}

	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: aaData}
  end



  def get_requisition_page(type=nil)
	orgs = current_user.subjection_org
	condition = [] 
	if orgs == "2200"
		condition_org = ["'org' is not null"]	
	else
		condition_org = {:org => orgs}	
	end
	if type.nil?
		condition_org =  ["'org' is not null"]	
		condition_status = ["('status' is not null AND status <> 20)"]
		condition = ["apply_staff = ? or approving_officer_fullname = ? or two_approvers_fullname = ? or registration_staff_fullname = ? or write_off_staff_fullname = ?",
					current_user.username,current_user.fullname,current_user.fullname,current_user.fullname,current_user.fullname]
		#condition = ["apply_staff = ? or approving_officer = ? or two_approvers = ? or registration_staff = ? or write_off_staff = ?",
#					current_user.username,current_user.username,current_user.username,current_user.username,current_user.username ]
	else
		condition_status = {:status => type}
		condition_org = ["'org' is not null"] if type == 13	
		if type == 10
			condition = ["('status' is not null AND status <> 20) AND (approving_officer = ?)",current_user.username]
		elsif type == 11
			condition_org = ["true"]	
			condition = ["('status' is not null AND status <> 20) AND (two_approvers = ?)",current_user.username]
		elsif type == 12
			go = GroupOrg.find_by_subjection_org(current_user.subjection_org)
			gos = GroupOrg.where(:group_id => go.group_id) if go
			#subjection_condition = ["(org in (#{gos.collect(&:subjection_org).join(",")}) or storage_sites in (#{gos.collect(&:subjection_org).join(",")}))"] if gos	
			#condition_org = subjection_condition.nil? ? (["org = " + current_user.subjection_org + " or storage_sites = "+current_user.subjection_org]) : subjection_condition 
			subjection_condition = ["storage_sites in (#{gos.collect(&:subjection_org).join(",")})"] if gos	
			condition_org = subjection_condition.nil? ? (["storage_sites = "+current_user.subjection_org]) : subjection_condition 

			condition = ["('status' is not null AND status <> 20)"]
			#condition = ["('status' is not null AND status <> 20) AND (storage_sites = ?)",current_user.subjection_org]
		else 
			condition = ["('status' is not null AND status <> 20)"]
		end
	end
	
	@requisitions = Requisition.where(condition).where(condition_status).where(condition_org).order("created_at desc")

	#return {:requisitions => @requisitions, :requisition_details => requisition_details}
	return filter_proc(@requisitions) 
  end
  
  def get_requisition(type=nil)
	orgs = current_user.subjection_org
	condition = [] 
	if orgs == "2200"
		condition_org = ["'org' is not null"]	
	else
		condition_org = {:org => orgs}	
	end
	if type.nil?
		condition_status = ["('status' is not null AND status <> 20)"]
		condition = ["apply_staff = ? or approving_officer = ? or two_approvers = ? or registration_staff = ? or write_off_staff = ?",
					current_user.username,current_user.username,current_user.username,current_user.username,current_user.username ]
	else
		condition_status = {:status => type}
		if type.include?(10)
			condition = ["('status' is not null AND status <> 20) AND (approving_officer = ? or two_approvers = ?)",current_user.username, current_user.username]
		else 
			condition = ["('status' is not null AND status <> 20)"]
		end
	end
	
	@requisitions = Requisition.where(condition).where(condition_status).where(condition_org).order("created_at desc")
    requisition_details = get_details(@requisitions) 
	return {:requisitions => @requisitions, :requisition_details => requisition_details}
  end

   def get_details(requisitions)
    requisition_details = []
    requisitions.each do |u|
		requisition_details.append(u.requisition_details(force_load=true))
    end
	return requisition_details 
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
