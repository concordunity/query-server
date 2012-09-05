# -*- coding: utf-8 -*-
require 'rubygems'
require "spreadsheet"
require 'active_record'
require 'activerecord-import'

class UploadFileController < ApplicationController

  def import_excel
	result = {}
	result[:message] = []
	zfci = zero_find_check_info(params[:upload_file])
	niplr = normal_import_price_less_record(params[:upload_file_1])
	imtodi = import_most_time_org_doc_info(params[:upload_file_2])
	result[:message] << zfci[:message]
	result[:message] << niplr[:message]
	result[:message] << imtodi[:message]
	render :nothing => true 
	#render json: {:status => 200,:message => result}
  end

  def zero_find_check_info(upload_file_name)
        result = {}
        resutl_format_data = return_format_data(upload_file_name)
        if resutl_format_data[:status] == true
	  tmp_arr = []
	  doc_ids = Document.all.collect(&:doc_id)
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
	  ZeroFindCheckInfo.import tmp_arr
          result[:message] = "import success for zero_find_check_info"
        else
          result[:message] = "import failure for zero_find_check_info"
        end

        return result	
  end

  def normal_import_price_less_record(upload_file_name)
        result = {}
        resutl_format_data = return_format_data(upload_file_name)
        if resutl_format_data[:status] == true
	  tmp_arr = []
	  doc_ids = Document.all.collect(&:doc_id)
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
	  NormalImportPriceLessRecord.import tmp_arr
          result[:message] = "import success for normal_import_price_less_record"
        else
          result[:message] = "import failure for normal_import_price_less_record"
        end

        return result
  end

  def import_most_time_org_doc_info(upload_file_name)
	result = {}
	resutl_format_data = return_format_data(upload_file_name)
	if resutl_format_data[:status] == true
	  tmp_arr = []
	  test_arr = []
	  doc_ids = Document.all.collect(&:doc_id)
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
	  logger.info(test_arr)
	  ImportMostTimeOrgDocInfo.import tmp_arr
	  result[:message] = "import success for import_most_time_org_doc_info"
	else
	  result[:message] = "import failure for import_most_time_org_doc_info"
	end

	return result
  end

  def return_format_data(upload_file_name)
	result_info = {}
        upload_result = upload(upload_file_name)
        if upload_result[:status] == true
          file_url = File.join(Rails.root,"public","docview","export_data",upload_file_name.original_filename)
	begin
          result = format_data(file_url)
	  result_info[:message]="return_format_data for success"
	  result_info[:status] = true
	  result_info[:data] = result
	rescue
          result_info[:message]="return_format_data for error"
          result_info[:status] = false
          result_info[:data] = []
	end
        else
          result_info[:message]="upload file for error"
          result_info[:status] = false
          result_info[:data] = []
        end
	return result_info
  end

  #upload file to server(上传文件)
  def upload(upload_file)
    result = {}
    unless request.get?
      unless upload_file
        result[:message]  = "请选择一个文件"
        result[:status] = false
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
      filepath = "#{Rails.root.to_s}/public/docview/export_data/#{filename}"
        if Dir.entries("#{Rails.root.to_s}/public/docview/export_data/").include?(filename)
          #system("rm -f #{Rails.root.to_s}/public/docview/export_data/#{filename}")
        end
      File.open(filepath, "wb") do |f|
        f.write(file.read)
      end
      return filepath
     end
  end

end
