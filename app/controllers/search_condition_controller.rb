# -*- coding: utf-8 -*-
class SearchConditionController < ApplicationController

  def search_condition
    #record_num = 20
    conditons = params[:org_applied].nil? || params[:org_applied] == "" ? ["true"] : ["org_applied = ?",params[:org_applied]]
    if params[:search_condition] == "normal_import_price_less_record"
      result = NormalImportPriceLessRecord.where(:exists_in_system => true).where(conditons)
      #result = NormalImportPriceLessRecord.find_by_sql("select * from (select * from normal_import_price_less_records where exists_in_system=true order by rand() limit #{record_num}) as fiplr")
    elsif params[:search_condition] == "zero_find_check_info"
	result = ZeroFindCheckInfo.where(:exists_in_system => true).order("operating_name").group("operating_name").where(conditons)
     #result = ZeroFindCheckInfo.find_by_sql("select * from (select * from (SELECT `zero_find_check_infos`.* FROM `zero_find_check_infos` where exists_in_system=true GROUP BY operating_name ORDER BY operating_name) as a where exists_in_system=true order by rand() limit #{record_num}) as s order by s.operating_name")
    elsif params[:search_condition] == "import_most_time_org_doc_info"
    	result = ImportMostTimeOrgDocInfo.where(:exists_in_system => true).where(conditons)
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
  end

  def get_son_table 
    @operatings = ZeroFindCheckInfo.where({:operating_name =>params[:operating_name],:org_applied => params[:org_applied], :exists_in_system => true }).order("operating_name")
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
end
