# -*- coding: utf-8 -*-
class SearchConditionController < ApplicationController

  def search_condition
    if params[:search_condition] == "normal_import_price_less_record"
	result = NormalImportPriceLessRecord.all
    elsif params[:search_condition] == "zero_find_check_info"
	result = ZeroFindCheckInfo.order("operating_name").group("operating_name")
    elsif params[:search_condition] == "import_most_time_org_doc_info"
	result = ImportMostTimeOrgDocInfo.all
    else

    end
    @result = get_record(result,20)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @result }
    end
  end

  def get_son_table 
	@operatings = ZeroFindCheckInfo.where(:operating_name =>params[:operating_name]).order("operating_name")
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
