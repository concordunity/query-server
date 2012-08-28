# -*- coding: utf-8 -*-

class SettingsController < ApplicationController
  
  respond_to :json

  def index
    result = {}
    Setting.all.each { |s|
      result[s.name] = s.value
    }

    respond_with(result)
  end

  def sys_setting
    ["maxn", "checkout_period", "max_queries_per_month"].each {|n|
      if !params[n].blank?
        s = Setting.find_by_name(n)
        if s.nil?
          s = Setting.new
          s.name = n
        end
        s.value = params[n]
        s.save
      end
    }

    render json: {:status => 200}
  end
end
