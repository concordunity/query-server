# -*- coding: utf-8 -*-
#require "spreadsheet"
class OperateDataController < ApplicationController
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!
  include ActionView::Helpers::NumberHelper


  def export_search

    title = [
      "月份","关区","档案总数(指定时间段内)","总页数","查阅量","查阅量占比"
    ]
    result = [title]
    tableData = JSON.parse(params[:tableData])
    p tableData["query_stats"]
    tableData["query_stats"].collect { |key,value|
      #{"org"=>"2225", "num_docs"=>30, "num_pages"=>219, "num_queries"=>16, "percentage_qq"=>"1.517%"},
      value.each { |row|
        #p row,'============'
        tmp_result = []
        tmp_result << key
        tmp_result << row["org"] || ""
        tmp_result << row["num_docs"].to_s
        tmp_result << row["num_pages"].to_s
        tmp_result << row["num_queries"].to_s
        tmp_result << row["percentage_qq"].to_s
        #p tmp_result.join(",")
        result << tmp_result
      }

    }

    excel_name = "search_result"
    export_data = JSON.parse(params[:tableData])

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]

    count = -1
    result.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)
    #send_file file_name
    file_name = file_name.sub(File.join(Rails.root,"public"),'')
    render :text => file_name

  end

  def test_user
    @users=User.all
    render :json => @users.to_json
  end 

  def export_data
    render :text => export_excel	
    #	send_file export_excel
  end

  ##################################################
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

  #生成excel
  def export_excel
    title = params[:tableHeader]
    titleColumn = params[:tableTitle]
    if  params[:tableFile].nil? ||  params[:tableFile] == ""
   	 excel_name = "excel"
    else
	 excel_name = params[:tableFile]
    end
    export_data = JSON.parse(params[:tableData])

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]
    sing_sheet = []
    sing_sheet << title
    export_data.each_with_index do |item_arr,index|
      tmp_row = []      
      titleColumn.each do |column|
        tmp_row << filter_html_tags(item_arr[column.strip])
      end unless item_arr.nil?
      sing_sheet << tmp_row
    end unless export_data.nil?

    count = -1
    sing_sheet.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)

    file_name = file_name.sub(File.join(Rails.root,"public"),'')
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



end
