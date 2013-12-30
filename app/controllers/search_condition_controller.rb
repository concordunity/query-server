# -*- coding: utf-8 -*-
class SearchConditionController < ApplicationController

  def search_condition
    table_type =  params[:search_condition].to_i
    logger.info "-------------"
    logger.info table_type 
    if  table_type < 3
      conditons = params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["org_applied = ?",params[:org_applied]]
      if table_type == 0 #"zero_find_check_info"
        result = ZeroFindCheckInfo.where(:exists_in_system => true).order("operating_name").group("operating_name").where(conditons)
      elsif table_type == 1 #"normal_import_price_less_record"
        result = NormalImportPriceLessRecord.where(:exists_in_system => true).where(conditons)
      elsif table_type == 2 #"import_most_time_org_doc_info"
        result = ImportMostTimeOrgDocInfo.where(:exists_in_system => true).where(conditons).order("release_time desc")
      end
    else
      conditions = params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["subjection_org = ?",params[:org_applied]]
      result = HighRisk.where(:table_type =>  params[:search_condition].to_i,:exists_in_system => true).where(conditions)
      #render json: filter_proc(result) 
    end
		data = filter_proc(result) 
		logger.info "======="
		logger.info data  
		if table_type == 0 
			data[:iTotalRecords] = data[:iTotalRecords].values.inject(0) {|result,item| result + item} 
			data[:iTotalDisplayRecords] = data[:iTotalDisplayRecords].values.inject(0) {|result,item| result + item} 
    end
    render json: data 
  end

  def get_son_table 
    son_condition =  params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["org_applied = ?", params[:org_applied]]
    @operatings = ZeroFindCheckInfo.where({:operating_name =>params[:operating_name], :exists_in_system => true }).order("operating_name").where(son_condition)
	  render json: filter_proc(@operatings) 
  end

  def get_pages_info(data,count_num=nil,start_index_num=nil)
    total = data.length
    count = count_num.nil? ? 500 : (count_num.to_i-start_index_num.to_i+1)
    start_index = start_index_num.nil? ? 0 : (start_index_num.to_i - 1)
    datas = data.slice(start_index,count)
    return {:total => total, :count => count, :start_index => start_index + 1, :data => datas}
  end

  def get_record(result,num)
	result_arr = []
	rec_num = result.length
	if rec_num <= num
	    result_arr = result
	else
	    arr = []
	    (1 .. num).each {|i| 
		tmp_num = rand(i)
		arr << result[tmp_num]
		result -= [result[tmp_num]]
	    }
	    result_arr = arr
	end
	return result_arr
  end  

  def filter_proc(source,all=nil) 
    #字段数量
    column_count = params[:iColumns]
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
      (0 ... column_count.to_i - 1).each do |cc|
        condition_arr << "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
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
    if  source.blank?
      result = []
      source = []
    else
      result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] ) 
    end
    return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result}
  end
end
