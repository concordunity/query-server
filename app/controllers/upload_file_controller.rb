# -*- coding: utf-8 -*-
require 'rubygems'
require "spreadsheet"
require 'active_record'
require 'activerecord-import'

class UploadFileController < ApplicationController

  def system_upload 
    upload_file_name = params[:upload_user]
    params[:url_time_path] = Time.now.to_i.to_s
    upload_result = upload(upload_file_name)
    success_count = 0
    result_info = Hash.new
	dih = Hash.new
	DictionaryInfo.where(:dic_type => 'org').collect {|di| 
		if di.dic_num.to_i == 2200
			dih['所有关区'] = di.dic_num 
		else
			dih[di.dic_name] = di.dic_num
		end
	}
	logger.info dih	

    dialog_path = File.join(Rails.root,"public","docview","export_data",current_user.username)
    dialog_path_end = File.join(Rails.root,"public","docview","export_data",current_user.username+".end")
	logger.info "===========准备进行相关验证========"
	system("touch #{dialog_path}")

    if upload_result[:status] == true
      file_url = File.join(Rails.root,"public","docview","export_data",params[:url_time_path],upload_file_name.original_filename)
	  User.transaction do 
      begin
        result = format_system_data(file_url)

        result.each_with_index do |row,index|
          @user = User.find_by_username(row[0])
			
		  org_ids = [] 
		  row[3].split(/[,| ]/).each do |org|
			logger.info "===========" 
			logger.info org
			logger.info dih[org] 
			org_ids << dih[org]
		  end
          if @user
            @user.fullname = row[1]
            @user.role_ids = row[2]
            @user.orgs = org_ids.join(",") 
            @user.doc_type = row[4]
            @user.password = 123456
            @user.save
          else
            @user = User.new
            @user.username = row[0] 
            @user.fullname = row[1] 
            @user.role_ids = row[2]
            @user.orgs = org_ids.join(",") 
            @user.doc_type = row[4] 
            @user.password = 123456
            if @user.email.blank?
              if !@user.username.index('@customs.gov.cn').nil?
                @user.email = @user.username
              else
                @user.email = @user.username + '+no-reply@customs.gov.cn'
              end
            end
            @user.save	
          end
          success_count += 1
        end
        result_info[:message]="更新成功"
      rescue => e
        logger.info e
        result_info[:message]="更新失败"
		raise ActiveRecord::Rollback, ex	
      end
	  end
    else
      result_info[:message]="更新失败"
    end
    write_to_file(dialog_path,result_info[:message])
	system("touch #{dialog_path_end}")
    render :nothing => true 
  end

  def import_excel
	logger.info "===========进入import_excel方法体内====="
    result = {}
    result[:message] = []
	logger.info "=====1"
    params[:url_time_path] = Time.now.to_i.to_s
	logger.info "=====2"
    params[:doc_ids] = Document.all.collect(&:doc_id)
	logger.info "=====3"
    status = {1 => "上传失败,请选择一个文件上传。", 2 => "导入失败,请查检上传文档格式是否正确", 3 => "导入成功",
	      'z' => "月查获率为0的重点查验企业", 'n' => '一般贸易进口价格偏低报关单记录文档', 'i' => "进口通关时间超长报关单文档"}
    message = [] 
	logger.info "=====4"
    dialog_path = File.join(Rails.root,"public","docview","export_data",current_user.username)
    dialog_path_end = File.join(Rails.root,"public","docview","export_data",current_user.username+".end")
	logger.info "===========准备进行相关验证========"
	system("touch #{dialog_path}")
    begin
        if params[:upload_file].nil? && params[:upload_file_1].nil? && params[:upload_file_2].nil?
	    	message << (status[1]) 
			logger.info "===========请选择一个文件进行上传========"
		else
		
			logger.info "===========生成标记文件========"
        	#write_to_file(dialog_path,status[3])
			logger.info "===========开始进行各个文件的上传流程========"
			zfci = zero_find_check_info(params[:upload_file])
			niplr = normal_import_price_less_record(params[:upload_file_1])
			imtodi = import_most_time_org_doc_info(params[:upload_file_2])
			result[:message] << zfci[:message]
			result[:message] << niplr[:message]
			result[:message] << imtodi[:message]
	
			logger.info "=========针对各个结果进行验证=========="
			if !params[:upload_file].nil? 
	        	if zfci[:status] == true
					message << (status['z'] + status[3]) 
				else 
					message << (status['z'] + status[2]) 
				end
			end
	    	if !params[:upload_file_1].nil? 
				if niplr[:status] == true
					message << (status['n'] + status[3]) 
				else
		    		message << (status['n'] + status[2]) 
				end
			end
			if !params[:upload_file_2].nil? 
				logger.info "=========进出口显示结果=========="
				logger.info imtodi 
				if imtodi[:status] == true
					message << (status['i'] + status[3]) 
				else
					message << (status['i'] + status[2]) 
				end
			end
		end
    rescue => e
		message << (status[2]) 
    end
    write_to_file(dialog_path,message.join(" "))
	system("touch #{dialog_path_end}")
    logger.info message.join(" ")
    render :nothing => true 
    #render json: {:status => 200,:message => result}
  end

  def zero_find_check_info(upload_file_name)
    result = {}
    resutl_format_data = return_format_data(upload_file_name)
    if resutl_format_data[:status] == true
      tmp_arr = []
      doc_ids = params[:doc_ids] 

      begin 
      ZeroFindCheckInfo.transaction do
        resutl_format_data[:data].each do |row|
          ZeroFindCheckInfo.new do |zfci|
            zfci.business_units_number = row[0]
            zfci.operating_name = row[1]
            zfci.number_import_export_declarations = row[2]
            zfci.number_import_export_inspection = row[3]
            zfci.import_export_inspection_rate = row[4]
            zfci.declarations_number = row[5]
            zfci.import_export = row[6]
            zfci.examination_handling_results = row[7]
            zfci.declaration_customs = row[8]
            zfci.date_value = row[9]
            zfci.org_applied=row[5][0,4]
            zfci.exists_in_system = false
            if doc_ids.include?(zfci.declarations_number.to_s)
              zfci.exists_in_system = true
            end
            #zfci.save
            tmp_arr << zfci
          end
        end
        #TemporaryZero.import tmp_arr
		#Thread.new do 
        	ZeroFindCheckInfo.delete_all
			ZeroFindCheckInfo.import tmp_arr
		#end
        #TemporaryZero.destroy_all
		result[:status] = true 
        result[:message] = "成功导入‘查获率为0的重点查验企业’表"
      end
      rescue => e
        logger.info e
	result[:status] = false
        result[:message] = "'查获率为0的重点查验企业'表，导入失败，请检查下文档格式"
      end
    else
      result[:status] = false
      result[:message] = "'查获率为0的重点查验企业'表，导入失败，请检查下文档格式"
    end

    return result	
  end

  def normal_import_price_less_record(upload_file_name)
    result = {}
    resutl_format_data = return_format_data(upload_file_name)
    if resutl_format_data[:status] == true
      tmp_arr = []
      doc_ids = params[:doc_ids] 
      begin
	NormalImportPriceLessRecord.transaction do
        resutl_format_data[:data].each do |row|
          NormalImportPriceLessRecord.new do |niplr|

            niplr.date_value = row[0]
            niplr.declarations_number = row[1]
            niplr.product_code = row[2]
            niplr.product_number = row[3]
            niplr.dollar_value = row[4]
            niplr.first_legal_quantity = row[5]
            niplr.price = row[6]
            niplr.actual_price_cap = row[7]
            niplr.actual_price_floor = row[8]
            niplr.national_average_price = row[9]

            niplr.org_applied=row[1][0,4]
            niplr.exists_in_system = false
            if doc_ids.include?(niplr.declarations_number.to_s)
              niplr.exists_in_system = true
            end

            #niplr.save
            tmp_arr << niplr
          end
        end
        #TemporaryNormal.import tmp_arr
        #NormalImportPriceLessRecord.destroy_all
		#Thread.new do 
        	NormalImportPriceLessRecord.delete_all
			NormalImportPriceLessRecord.import tmp_arr
		#end
        #TemporaryNormal.destroy_all
		result[:status] = true 
		result[:message] = "成功导入'一般贸易进口价格偏低报关单记录文档'表"
      end
      rescue => e
        logger.info e
	result[:status] = false
	result[:message] = "'一般贸易进口价格偏低报关单记录文档'表，导入失败，请检查下文档格式"
      end
    else
      result[:message] = "'一般贸易进口价格偏低报关单记录文档'表，导入失败，请检查下文档格式"
    end

    return result
  end

  def import_most_time_org_doc_info(upload_file_name)
    result = {}
    resutl_format_data = return_format_data(upload_file_name)
    if resutl_format_data[:status] == true
      tmp_arr = []
      test_arr = []
      doc_ids = params[:doc_ids] 
      begin
          ImportMostTimeOrgDocInfo.transaction do
	      resutl_format_data[:data].each do |row|
	          ImportMostTimeOrgDocInfo.new do |imtodi|		
	              imtodi.declarations_number = row[0]
		      imtodi.mode_transport = row[1]
		      test_arr << row[2]
		      imtodi.release_time = (row[2]).strftime("%Y-%m-%d %H:%M:%S")
		      imtodi.accept_declaration_time = (row[3]).strftime("%Y-%m-%d %H:%M:%S")
		      imtodi.overall_operating_hours_hours = row[4]
		      imtodi.declaration_customs_code = row[5]
		      imtodi.declaration_customs = row[6]
		      imtodi.org_applied=row[0][0,4]
		      imtodi.exists_in_system = false
		      if doc_ids.include?(imtodi.declarations_number.to_s)
		          imtodi.exists_in_system = true
		      end
		      #imtodi.save
		      tmp_arr << imtodi
                  end
	      end
	      #TemporaryImport.import tmp_arr
		  #Thread.new do 
	      	  ImportMostTimeOrgDocInfo.delete_all
			  ImportMostTimeOrgDocInfo.import tmp_arr
		  #end
	      #TemporaryImport.destroy_all
		  result[:status] = true 
		  result[:message] = "成功导入'进口通关时间超长报关单文档'表"
         end
      rescue => e
	logger.info e
	result[:status] = false
	result[:message] = "'进口通关时间超长报关单文档'表，导入失败，请检查下文档格式"
      end
    else
      result[:status] = false
      result[:message] = "'进口通关时间超长报关单文档'表，导入失败，请检查下文档格式"
    end
    return result
  end

  def return_format_data(upload_file_name)
    result_info = {}
    upload_result = upload(upload_file_name)
    if upload_result[:status] == true
      file_url = File.join(Rails.root,"public","docview","export_data",params[:url_time_path],upload_file_name.original_filename)
      begin
        result = format_data(file_url)
        result_info[:message]="数据整合成功"
        result_info[:status] = true
        result_info[:data] = result
      rescue
        result_info[:message]="数据整合失败"
        result_info[:status] = false
        result_info[:data] = []
      end
    else
      result_info[:message]="上传文件失败"
      result_info[:status] = false
      result_info[:data] = []
    end
    return result_info
  end

  #upload file to server(上传文件)
  def upload(upload_file)
    result = {}
    unless request.get?
      if upload_file.nil?
        result[:message]  = "请选择一个文件"
        result[:status] = false
	  #elsif upload_file == 'xls'
      elsif File.extname(upload_file.original_filename).upcase != ".XLS"
        result[:status] = false 
        result[:message]  << "上传的文件格式不正确，请重新上传"
      else
        filepath = upload_file_to_server(upload_file)
        result[:message] = '上传成功'
        result[:status] = true
      end
    end
    return result
  end


  # open excel and return sheet(打开excel文件，返回sheet) 
  def open_excel url
    filepath = url
    Spreadsheet.client_encoding = "UTF-8"
    begin
      book = Spreadsheet.open filepath
      sheet = book.worksheet 0
      return sheet
    rescue
      return nil
    end
  end

  def format_row(row)
    result = []
    row.each_with_index do |column|
      result << (column.class == Float ? column.to_i : column ).to_s.gsub(/^[\s|\t]+|[\s|\t]+$/,'')
    end
    return result
  end
  def format_system_data(file_url)

    result = []
        sheet = self.open_excel(File.join(file_url))
	sheet.each_with_index { |row,index|
	    if index != 0 && !row[0].nil?
		row = format_row(row)
	        role = Role.find_by_name(row[2])
		row[2] = (role.nil? ? [32] : [role.id])
  		if row[3] == '' || row[3].nil?
			row[3] = '2200'
		else
			row[3] = row[3].gsub(/[\,|，]/,",")
		end
=begin
		row[3] = ((row[3] == "" || row[3].nil?) ? '2200' : row[3] #row[3].gsub(/[\,|\，]/,","))
=end
		if row[4] == "不限"
			row[4] = 0 
		end
		if row[4] == "进口"
	        	row[4] = 2 
		end
		if row[4] == "出口"
	        	row[4] = 1 
		end
	    result << row
      	    end 
	}	
    return result    
  end
  #import data into excel for formatting data (打开excel文件，然后生成对应格式的数据源)
  def format_data(file_url)
    result = [] 
    sheet = self.open_excel File.join(file_url)
    sheet.each_with_index { |row,index|
      if index != 0 && !row[0].nil?
        row.set_format 2,Spreadsheet::Format.new(:number_format => "YYYY-MM-DD HH:MM:SS") if row[2].class == Date
        row.set_format 3,Spreadsheet::Format.new(:number_format => "YYYY-MM-DD HH:MM:SS") if row[3].class == Date
        result << row 
      end
      } unless sheet.blank?
      return result
    end

    def upload_file_to_server(file)
      if !file.original_filename.empty?
        filename = file.original_filename
	tmp_file_path = Rails.root.join("public","docview","export_data",params[:url_time_path])
	system("mkdir #{tmp_file_path}")
        filepath = File.join(tmp_file_path,filename)

        File.open(filepath, "wb") do |f|
          f.write(file.read)
        end
        return filepath
      end
    end

    def write_to_file(filepath,content)
      File.open(filepath, "wb") do |f|
        f.write(content)
      end
    end
  end
