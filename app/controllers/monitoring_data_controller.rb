# -*- coding: utf-8 -*-
#require "spreadsheet"
class MonitoringDataController < ApplicationController
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!

  include ActionView::Helpers::NumberHelper

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
