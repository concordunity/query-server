# -*- coding: utf-8 -*-
class RequisitionController < ApplicationController

  respond_to  :json

  def requisitions
	result = send(params[:type])

    #render :json => result, :status => 200
    #render :json => {:result => result}, :status => 200
    respond_with(result)
  end

  def create_requisition
#	{"tel"=>"15101151137", "department_name"=>"研发", "requisition_details"=>{"0"=>{"single_card_number"=>"222520121250004811", "modify_accompanying_documents"=>"aa", "where_page"=>"1", "lent_reasons"=>"不知道"}, "1"=>{"single_card_number"=>"222520121250004812", "modify_accompanying_documents"=>"bb", "where_page"=>"2", "lent_reasons"=>"有问题呗"}}}
	logger.info "=== first ====" 
		begin
			tel = params[:tel]
			department_name = params[:department_name]
			org = params[:org]

			requisition = Requisition.create do |r|
				r.tel = tel 
				r.department_name = department_name 
				r.org = org
				r.apply_staff = current_user.username
			end
			create_requisition_details(params,requisition)	
		rescue => e
			logger.info "===error====" 
			logger.info e
		end
	logger.info "=== last ====" 
	render json: {:message => "ok"}, :status => 200
  end

  def update_requisition

  end

  def create_requisition_details(params,requisition)
	RequisitionDetail.transaction do
		params[:requisition_details].collect do |index,requisition_details|
			logger.info requisition_details 
			single_card_number = requisition_details[:single_card_number]
			modify_accompanying_documents = requisition_details[:modify_accompanying_documents]
			where_page = requisition_details[:where_page]
			lent_reasons = requisition_details[:lent_reasons]

			RequisitionDetail.create do |rd|
				rd.single_card_number = single_card_number
				rd.modify_accompanying_documents = modify_accompanying_documents
				rd.where_page = where_page
				rd.lent_reasons = lent_reasons
				rd.requisition_id = requisition.id
			end
		end
	end
  end

  def filter_requisition

  end

  private
  #申请
  def application
	
	@requisitions = Requisition.where({:apply_staff => current_user.username, :status => 1})
    requisition_details = get_details(@requisitions) 
	return {:requisitions => @requisitions, :requisition_details => requisition_details}
 end

  #审批
  def approval
	get_requisition
  end

  #登记
  def register
	get_requisition
  end

  #核销
  def write_off
	get_requisition
  end

  #统计
  def lending_statistics

  end

  def get_requisition
	logger.info current_user.to_json
	orgs = current_user.orgs.split(",")
	if orgs.include?("2200")
		condition_org = ["org is not null"]	
	else
		condition_org = {:org => orgs}	
	end
	@requisitions = Requisition.where({:status => 1}).where(condition_org).order("created_at desc")
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
end
