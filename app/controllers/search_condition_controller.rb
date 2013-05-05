# -*- coding: utf-8 -*-
class SearchConditionController < ApplicationController

  def search_condition
    #record_num = 20
	logger.info "-------------"
	logger.info  params[:search_condition].to_i
	if  params[:search_condition].to_i < 3
    conditons = params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["org_applied = ?",params[:org_applied]]
    if params[:search_condition] == "normal_import_price_less_record"
      result = NormalImportPriceLessRecord.where(:exists_in_system => true).where(conditons)
      #result = NormalImportPriceLessRecord.find_by_sql("select * from (select * from normal_import_price_less_records where exists_in_system=true order by rand() limit #{record_num}) as fiplr")
    elsif params[:search_condition] == "zero_find_check_info"
	result = ZeroFindCheckInfo.where(:exists_in_system => true).order("operating_name").group("operating_name").where(conditons)
     #result = ZeroFindCheckInfo.find_by_sql("select * from (select * from (SELECT `zero_find_check_infos`.* FROM `zero_find_check_infos` where exists_in_system=true GROUP BY operating_name ORDER BY operating_name) as a where exists_in_system=true order by rand() limit #{record_num}) as s order by s.operating_name")
    elsif params[:search_condition] == "import_most_time_org_doc_info"
    	result = ImportMostTimeOrgDocInfo.where(:exists_in_system => true).where(conditons).order("release_time desc")
      #result = ImportMostTimeOrgDocInfo.find_by_sql("select * from (select * from import_most_time_org_doc_infos where exists_in_system=true order by rand() limit #{record_num}) as imtodi")

    end
    count = params[:count] unless params[:count].nil?
    start_index = params[:start_index] unless params[:start_index].nil?
    @result = result.nil? ? [] : get_pages_info(result.all,count,start_index)
    #@result = get_record(result,20)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @result }
    end
	else
        conditions = params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["subjection_org = ?",params[:org_applied]]
		result = HighRisk.where(:table_type =>  params[:search_condition].to_i).where(conditions)
		render json: filter_proc(result) 
	end
  end

  def get_son_table 
    son_condition =  params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["org_applied = ?", params[:org_applied]]
    @operatings = ZeroFindCheckInfo.where({:operating_name =>params[:operating_name], :exists_in_system => true }).order("operating_name").where(son_condition)
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @operatings }
      end
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
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )
	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result}
  end

end
