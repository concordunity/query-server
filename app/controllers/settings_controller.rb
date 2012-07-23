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
    ["maxn", "checkout_period"].each {|n|
      if !params[n].blank?
        s = Setting.find_by_name[n]
        if s
          s.value = params[n]
          s.save
        end
      end
    }

    render json: {:status => 200}
  end
end
