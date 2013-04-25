# -*- coding: utf-8 -*-
class DictionaryInfoController < ApplicationController

  def import_dictionary
      #将文件上传到服务上
    upload_file = params[:upload_file]
    result = {}
    result[:message]  = []
    filepath = ""
    tmp_path = File.join("/","tmp",Time.now.to_i.to_s)
    begin
    unless request.get?
      if upload_file.nil?
        result[:status] = false
        result[:message]  << "请选择一个文件"
      elsif File.extname(upload_file.original_filename) != ".xls"
        result[:status] = false
        result[:message]  << "上传的文件格式不正确，请重新上传"
      else
        system("mkdir #{tmp_path}")
        filepath = File.join(tmp_path,upload_file.original_filename)
        upload_file_to_server(filepath,upload_file)
        result[:status] = true
        result[:message] << '上传成功'
      end
    end
    rescue => e
        logger.info e
        result[:status] = false
        result[:message] << '上传失败'
    end
      #解析文件，保存到数据库
    logger.info('==========1=')
    begin
    if result[:status] == true
	logger.info('------2')
	logger.info filepath
	sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
#	    logger.info row
	    if index != 0 && (!row[0].nil? || !row[2].nil?)
	    dis = DictionaryInfo.where(:dic_type => row[0], :dic_num => row[2]).first
	    if dis.nil?
			DictionaryInfo.create(:dic_type => row[0], :dic_name => row[1], :dic_num => row[2])
	    else
			dis.dic_name = row[1]
			dis.save	
	    end
	    end
	end
	result[:message] << "更新成功"	
    end
    rescue => e
        logger.info e
        result[:status] = false
	result[:message] << "更新失败"	
    end
    flash[:notice] = result[:message].join(",")

    redirect_to "/admin/dictionary"	
  end

  def upload_org
    #将文件上传到服务上
    upload_file = params[:upload_file]
    result = {}
    result[:message]  = []
    filepath = ""
    tmp_path = File.join("/","tmp",Time.now.to_i.to_s)
    begin
    unless request.get?
      if upload_file.nil?
        result[:status] = false
        result[:message]  << "请选择一个文件"
      elsif File.extname(upload_file.original_filename) != ".xls"
        result[:status] = false
        result[:message]  << "上传的文件格式不正确，请重新上传"
      else
        system("mkdir #{tmp_path}")
        filepath = File.join(tmp_path,upload_file.original_filename)
        upload_file_to_server(filepath,upload_file)
        result[:status] = true
        result[:message] << '上传成功'
      end
    end
    rescue => e
        logger.info e
        result[:status] = false
        result[:message] << '上传失败'
    end
      #解析文件，保存到数据库
    logger.info('==========1=')
    begin
    if result[:status] == true
	logger.info('------2')
	logger.info filepath
	sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
#	    logger.info row
		    dis = OrgForDoc.where(:org_number=> row[0], :org=> row[2]).first
			if dis.nil?
				OrgForDoc.create(:org_number=> row[0], :org_name => row[1], :org => row[2])
			else
				dis.org_name = row[1]
				dis.save	
			end
	end
	result[:message] << "更新成功"	
    end
    rescue => e
        logger.info e
        result[:status] = false
	result[:message] << "更新失败"	
    end
    flash[:notice] = result[:message].join(",")

    redirect_to "/admin/org_for_doc"	

  end


  def get_dictionary
	dic_type = params[:dic_type]
	if dic_type.nil?
	    #dis = DictionaryInfo.all
		dis = DictionaryInfo.reorder("convert(dic_name using gb2312) asc")
	else
		dis = DictionaryInfo.where(:dic_type => dic_type).reorder("convert(dic_name using gb2312) asc")
	    #dis = DictionaryInfo.where(:dic_type => dic_type)
	end
	render json: dis, status: 200
  end
  def update_dictionary
	 dis = DictionaryInfo.group("dic_type").collect(&:dic_type)	  
	 result = ActiveSupport::OrderedHash.new 
	 dis.each do |dic_type| 
	    di_arr = []
	    di_json = []
	    DictionaryInfo.where(:dic_type => dic_type).reorder("convert(dic_name using gb2312) asc").each do |di|
		# org_json = {'1':'a','2':'b'}
		# org_arr =  [{},{},{}]
		#
		#

		di_arr << "{'dic_num' : '#{di.dic_num}', 'dic_name' : '#{di.dic_name}', 'dic_type' : '#{di.dic_type}'}" 
		#di_arr << ActiveSupport::JSON.encode(di) 
		di_json << "'" + di.dic_num.to_s + "' : '" + di.dic_name + "'"
	
	    end
	    tmp_arr = "#{dic_type}ArrayDictionary = [" + di_arr.join(",") + "]"
	    tmp_json  = "#{dic_type}JsonDictionary = {" + di_json.join(",") + "}"

	    result[dic_type+"ArrayDictionary"] = di_arr 
	    result[dic_type+"JsonDictionary"] = tmp_json 

	    write_to_js(dic_type+"_arr.js", tmp_arr)
	    write_to_js(dic_type+"_json.js",tmp_json)
	 end
	 logger.info(result)
  end

private

  def write_to_js(filename, str)
	filepath = File.join(Rails.root.to_s,"public","libs",filename)
	File.open(filepath, "w+") do |f|
            f.write(str)
            #f.write("js_org=" + result["org"])
      	end
  end

  def upload_file_to_server(filepath,file)
      if !file.original_filename.empty?
        File.open(filepath, "wb") do |f|
          f.write(file.read)
        end
      end
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
end
