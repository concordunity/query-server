# -*- coding: utf-8 -*-
#require 'active_support/secure_random'

class QueriesController < ApplicationController
  skip_before_filter [:api_query, :get_status]

  def api_query
    ret = QueryStatus.new()
    doc_id = params[:docid]
    ret.doc_id = doc_id

    # Let's generate some randome string
    u = User.find_by_username(params[:username])

    if u.nil?
       ret.status = 1
       ret.message = '用户没有在系统授权，无法查阅'
       return finish_request(ret)
    end

    d = Document.find_by_doc_id(doc_id)
    if d.nil?
       ret.status = 2
       ret.message = '查无此单证: ' + doc_id
       return finish_request(ret)
    end

    if !u.can_view?(d)
      ret.status = 3
      ret.message = '用户无权查阅此单证: ' + doc_id
      return finish_request(ret)
    end

    # check for inquiries
    if d.inquired && !u.can_inquire?
      ret.status = 3
      ret.message = '此单证暂时不能查阅，缉私局等扣留'
      ofinish_request(ret)
      return
    end
    qh = QueryHistory.create(:user_id=> u.id,
							   :action => "API查阅",
							   :describe => "通过API进行了单证查阅",
                               :doc_id => doc_id,
                               :org => d.org,
                               :doc_type => d.doc_type,
							   :role_id => u.roles[0].id,
							   :bulkids => "",
                               :ip => request.remote_ip,
                               :email => params[:username] + ' from ' + params[:source],
							   :user_name => u.display_name,
							   :role_name => u.roles[0].name,
							   :doc_flag => d.doc_flag, 
                               :print => false)
    ret.pages = d.pages
    ret.status = 0
    ret.message = ''
    finish_request(ret)

  end

  def api_get_status
    ret = Rails.cache.read(params[:hash])
    Rails.cache.delete(params[:hash])
    if ret.nil?
      respond_to do |format|
        format.json { render json: { :error => "System Internal Error" }, :status => 400 }
      end
      return
    end

    status = 200
    message = ret.message
    case ret.status
      when 1
        status = 401
      when 2
        status = 404
      when 3
        status = 403
      else
        pages = ret.pages
    end

    respond_to do |format|
      format.json { render json: { :doc_id => ret.doc_id, :pages => ret.pages, :message => message, :status => status }, :status => 200 }
    end
  end


   private


  def finish_request(ret)
    random_string = SecureRandom.hex(10)
    Rails.cache.write(random_string, ret)
    redirect_to "/docview/ui/details/single_doc.html#" + random_string 
  end

  

end
