# -*- coding: utf-8 -*-
#require "spreadsheet"
class MonitoringDataController < ApplicationController
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!

  include ActionView::Helpers::NumberHelper


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

    excel_name = params[:tableFile]
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
        if item_arr[column].match(format_egx("span")).nil?
          tmp_row << item_arr[column]
        else
          tmp_row << item_arr[column].match(format_egx("span"))[1]
        end
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

  def format_egx(str)
    return /\<#{str}.*?\>(.*?)\<\/#{str}\>/i
  end

  def get_json
    results = query_data(params[:host], params[:varname], params[:from_ts], params[:to_ts])
    render json: results
  end

  def get_util
    if params[:type] == 'mem'
      get_mem_util
    elsif params[:type] == 'df'
      get_disk_util
    else
      render json: []
    end
  end
  
  def get_mem_util
    free_info = query_data(params[:host], 'proc.meminfo.memfree', params[:from_ts], params[:to_ts])
    total_info = query_data(params[:host], 'proc.meminfo.memtotal', params[:from_ts], params[:to_ts])

    results = {}
    free_info.each { |k, v|
      if total_info.has_key?(k)
        total_v = total_info[k]
        total_v_map = Hash[total_v]
        results[k] = v.collect { |point|
          ts = point[0]
          if (total_v_map.has_key?(ts))
            [ts, format("%.2f", 100 - (point[1] * 100.0 / total_v_map[ts])).to_f]
          end
        }.keep_if { |v| v }
      end
    }

    render json: results
  end

  # we will use MB as the unit.
  def get_disk_util
    used_info = query_data(params[:host], 'df.1kblocks.used', params[:from_ts], params[:to_ts])
    total_info = query_data(params[:host], 'df.1kblocks.total', params[:from_ts], params[:to_ts])

    used_info.delete_if { |k, v|
      k.index("fstype=tmpfs")
    }
    total_info.delete_if { |k, v|
      k.index("fstype=tmpfs")
    }
    
    results = {}
    used_info.each { |k, v|
      matcher = /mount=([\/\w]+) /.match(k)
      if matcher
        path = matcher[1]

        if total_info.has_key?(k)
          total_v = total_info[k]
          total_v_map = Hash[total_v]
          results[path] = v.collect { |point|
            ts = point[0]
            if (total_v_map.has_key?(ts))
              [ts, format("%.2f", point[1] * 100.0 / total_v_map[ts]).to_f]
            end
          }.keep_if { |v| v }
        end
      end
    }

    render json: results
  end

  def exportToPNG
    type = case params[:type]
    when "image/png"
      ext = ".png"
      '-m image/png'
    when "image/jpeg"
      ext = ".jpg"
      '-m image/jpeg'
    when "application/pdf"
      ext = ".pdf"
      '-m application/pdf'
    when "image/svg+xml"
      ext = ".svg"
      ''
    end

    width = params[:width]

    radm = Time.now.to_i.to_s + rand(1000000).to_s
    radm_path = Rails.root + "jar/radm/#{radm}.svg"
    image_path = Rails.root + "jar/images/#{radm}"
    File.open(radm_path, "w") do |file|
      file.puts params[:svg]
    end

    if ext == ".svg"
      file = radm_path
    else
      cmd = "/usr/bin/convert  #{radm_path} #{image_path}#{ext}"
      system(cmd) if type && type != ""
      file = File.join(Rails.root, "jar", "images", "#{radm}#{ext}")
    end
    send_file file
  end

  private
  # input: host, varname, from_ts, to_ts
  # output: map: key: label, value: [ [ts, val], [ts, val], ...] (ordered)
  def query_data(host, varname, from_ts, to_ts)
    #hash_value = ActiveSupport.HashOrder

    data_by_label = {}
    data = MonitoringData.where({ :host => host,:varname => varname,:ts => (from_ts..to_ts) }).order(:ts).all
    data.each { |d|
      if data_by_label.has_key?(d.labels)
        data_by_label[d.labels].push([d.ts * 1000, d.value])
      else
        data_by_label[d.labels] = [[d.ts * 1000, d.value]]
      end
    }

    return data_by_label
  end
end
