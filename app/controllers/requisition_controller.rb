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

  end

  def update_requisition

  end

  def create_requisition_details

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
