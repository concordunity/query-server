class OrgInfoController < ApplicationController
  def index
	ois = OrgInfo.order("org")
	render json: filter_proc(ois) 
  end

  def create
	@oi = OrgInfo.new(params[:org_info])
	di = DictionaryInfo.find_by_dic_type_and_dic_num("org",@oi.subjection_org)
	@oi.dictionary_info_id = di.id
	if @oi.save
		render json: "OK", status: 200
	else
		render json: "OK", status: 400
	end
  end

  def update
	@oi = OrgInfo.find(params[:id])
	if @oi.update_attributes(params[:org_info])
		render json: @oi, status: 200
	else
		render json: @oi, status: 400
	end
  end

  def destroy
	@oi = OrgInfo.find(params[:id])
	@oi.destroy
	render json: "OK", status: 200
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
