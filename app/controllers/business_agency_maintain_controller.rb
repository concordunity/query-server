# -*- coding: utf-8 -*-
class BusinessAgencyMaintainController < ApplicationController

  respond_to :html, :json
  def index

	@bam = BusinessAgencyMaintain.order("name")
	render json: filter_proc(@bam)
  end

  def get_select
	@bam = BusinessAgencyMaintain.order("name")
	render json: @bam
  end

  def create
	@bam = BusinessAgencyMaintain.new(params[:agency])
	@bam.org = current_user.subjection_org
		if @bam.save
			render json: {:message => 'ok'}, :status => 200		
		else
			render json: {:message => 'failure'}, :status => 500		
		end
  end

  def update_data
	@bam = BusinessAgencyMaintain.find(params[:agency][:id])

	if @bam.update_attributes(params[:agency])
		render json: {:message => 'ok'}, :status => 200		
	else
		render json: {:message => 'failure'}, :status => 500		
	end
  end

  def destroy
	@bam = BusinessAgencyMaintain.find(params[:id])
	@bam.destroy

	respond_to do |format|
		format.json { head :no_content }
	end
  end

  def filter_proc(source) 
	#字段数量
 	  column_count = params[:iColumns]
#
#排序的下标
	  iSortCol_0 = params[:iSortCol_0]	  
#排序的方式
	  sSortDir_0 = params[:sSortDir_0]	  
#搜索内容
	  sSearch = params[:sSearch]
#排序的字段
	  mDataPro = params["mDataProp_" + iSortCol_0]
	  logger.info "we are searching for #{sSearch}, then we may sort columns by #{mDataPro} #{sSortDir_0}"
	  condition_arr = [] 
	  if sSearch.blank?
		condition_arr << "true"
	  else
		condition_arr = [] 
        (0 ... column_count.to_i - 1).each do |cc|
				conditions_arr << "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
		end
	  end
      logger.info "================" 
      logger.info condition_arr 
      logger.info "=======1=#{mDataPro} #{sSortDir_0}"	

	  orders = "#{mDataPro} #{sSortDir_0}"
      logger.info "=======0=#{orders}"	

      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
	  condition = {:orders =>orders,:where=>condition_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }

      logger.info "=======1=#{condition[:orders]}"	
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )


	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result}
  end

end
