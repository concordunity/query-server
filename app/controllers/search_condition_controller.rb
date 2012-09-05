# -*- coding: utf-8 -*-
class SearchConditionController < ApplicationController

  def search_condition
    record_num = 20
    if params[:search_condition] == "normal_import_price_less_record"
      #result = NormalImportPriceLessRecord.all
      result = NormalImportPriceLessRecord.find_by_sql("select * from (select * from normal_import_price_less_records where exists_in_system=true order by rand() limit #{record_num}) as fiplr")
    elsif params[:search_condition] == "zero_find_check_info"
	#result = ZeroFindCheckInfo.order("operating_name").group("operating_name")
     result = ZeroFindCheckInfo.find_by_sql("select * from (select * from (SELECT `zero_find_check_infos`.* FROM `zero_find_check_infos` where exists_in_system=true GROUP BY operating_name ORDER BY operating_name) as a where exists_in_system=true order by rand() limit #{record_num}) as s order by s.operating_name")
    elsif params[:search_condition] == "import_most_time_org_doc_info"
    	#result = ImportMostTimeOrgDocInfo.all
      result = ImportMostTimeOrgDocInfo.find_by_sql("select * from (select * from import_most_time_org_doc_infos where exists_in_system=true order by rand() limit #{record_num}) as imtodi")
    else

    end
    @result = result
    #@result = get_record(result,20)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @result }
    end
  end

  def get_son_table 
    @operatings = ZeroFindCheckInfo.where({:operating_name =>params[:operating_name], :exists_in_system => true }).order("operating_name")
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @operatings }
      end
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
