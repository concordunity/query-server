# -*- coding: utf-8 -*-
require 'set'

class DocumentHistoriesController < ApplicationController
  include ActionView::Helpers::NumberHelper

  # GET /document_histories
  # GET /document_histories.json
  def index
    @document_histories = DocumentHistory.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @document_histories }
    end
  end

  # GET /document_histories/1
  # GET /document_histories/1.json
  def show
    @document_history = DocumentHistory.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @document_history }
    end
  end

  # GET /document_histories/new
  # GET /document_histories/new.json
  def new
    @document_history = DocumentHistory.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @document_history }
    end
  end

  # GET /document_histories/1/edit
  def edit
    @document_history = DocumentHistory.find(params[:id])
  end

  def query
    @document_histories = DocumentHistory.where(:doc_id => params[:doc_id])
    render :json => @document_histories, :status => 200
  end

  def dh_special
    timeout = 0
    u=Setting.find_by_name('checkout_period')
    if u
      timeout = Time.now - u.value.to_i.day
    end

    inquired_docs = Document.where('inquired=true OR checkedout=true')
    expired = {}
    if timeout
      inquired_docs.each { |d|
        if d.checkedout 
          if d.updated_at < timeout
            expired[d.doc_id] = d.updated_at
          end
        end
      }
    end
    render :json => { :docs => inquired_docs, :timedout => expired }, :status => 200
  end

  def show_all
    u = User.find_by_username('admin')
    #@query_histories = DocumentHistory.where("user_id != #{u.id}").order(:created_at).reverse_order.limit(500).all
    @query_histories = DocumentHistory.order(:created_at).reverse_order.limit(500).all
    # @query_histories = QueryHistory.order(:created_at).reverse_order
    #respond_with(@query_histories)
    render json: @query_histories
  end

  def search
    if params.nil? || blank_request?
      return show_all
    end

    search_conditions = search_by_column
    #if search_conditions.blank?
    # search_conditions = "true"
    #end
    #doc_id_condition = "doc_id in (#{doc_ids.join(",")})"

    #doc_id_condition = "true"
    doc_id = params[:doc_id]
    gid = params[:gid]

    if doc_id.blank? and !gid.blank?
      dg = DocGroup.find_by_id(params[:gid])
      doc_ids = !dg.nil? ? dg.doc_group_entries.collect { |t| t.doc_id } : []
      # doc_id_condition = doc_ids.blank? ? "false" : "doc_id in (#{doc_ids.join(",")})"
      if doc_ids.blank?
        raise ActiveRecord::RecordNotFound
      else
        search_conditions[:doc_id]=doc_ids
      end
    end 

    if !params[:org].blank?
        search_conditions[:org] = params[:org]	
    end
    if !doc_id.blank?
      #doc_id_condition = "doc_id='#{params[:doc_id]}'"
      search_conditions[:doc_id] = params[:doc_id]
    end
    search_conditions[:user_id] = current_user.id 
    sql_conditions = (search_conditions.length == 0) ? ["true"] : search_conditions
    logger.info sql_conditions
    @query_histories = DocumentHistory.where(sql_conditions).order("created_at desc").limit(500).all
    #logger.info  @query_histories.length
    #logger.info "======"
    #respond_with(@query_histories)
    render json: @query_histories
  end

  def search_by_column
    #result_arr = []	
    #logger.info "search_by_column"
    #result_arr << params[:gid].blank? ? "true" : "gid = #{params[:gid]}"
    #result_arr << params[:doc_id].blank? ? "true" : "doc_id = #{params[:doc_id]}"
    result_hash = {}

    username = params[:username]
    if !username.blank?
      user = User.find_by_username(username)
      if user.nil?
        raise ActiveRecord::RecordNotFound
      end
      #result_arr << "user_id = #{user.id}"
      result_hash[:user_id]=user.id
    end

    if (!params[:from_date].blank? && !params[:to_date].blank?)
      #q_string = "(created_at between '"+params[:from_date] + "' AND '" + params[:to_date] + "')"
      #logger.info "query string" + q_string
      #result_arr << q_string 
      result_hash[:created_at] = params[:from_date].to_date .. params[:to_date].to_date.next
    end

    #result_arr.join(" and ")
    return result_hash
  end

  def get_search_org(params)
      orgs = current_user.orgs 
      result = ['true']
      cat = params[:groupby]

      if orgs == "2200"
	result = ['true']
      else
	  result = ['org in (?)',orgs.split(",")]
          if cat == '5'
	      org_names = OrgInfo.where(["subjection_org in (?)",orgs.split(",")]).collect(&:org)
	      subjection_orgs = OrgInfo.where(["org in (?)",org_names.uniq]).collect(&:subjection_org)
	      result = ['org in (?)',subjection_orgs]
	  end
      end
      return result
  end

  ########start zhouzhen create for serach condition#########
  #前端Ａjax请求的Ａction，将条件发送过来：
  #{"from_date"=>"2012-06-24", "to_date"=>"2012-07-24", "groupby"=>"3",
  #   "condition_value"=>{"frm_org"=>"2225", "frm_docType"=>"CK", "frm_years"=>"3"}}

  def dh_report

    cat = params[:groupby]
    search_org_condition,where_clause,where_clause_edc,no_admin,no_admin,query_stats,query_stats_by,org_condition,docType_condition,condition = product_params(params)
    docs,pages,query,docs_added,pages_added,query_added,docs_saved,pages_saved,query_saved = get_ds_data(where_clause_edc,docType_condition)
    #符合条件的增量的查阅量和存量的查阅量
    select_query_total,save_query_total = query_added,query_saved 
    p cat
    if cat == '0'
      docs_total, pages_total = docs_added,pages_added 
      doc_count,doc_edc_page = docs_saved,pages_saved

      #符合条件的补充单证的总档案数和页数
      modified_docs_total, modified_pages_total = get_mds_data(search_org_condition,where_clause,docType_condition) 
      #符合条件的借阅单证的总档案数和页数
      rds_docs_total, rds_pages_total = get_rds_data(where_clause,docType_condition)

	    #sum modefy document pages
    	# pages_total +=  modified_pages_total 

      logger.info "===#{docs_added}===" 
      logger.info "===test===" 
      logger.info "====#{select_query_total  } ==="
      logger.info " ==== #{save_query_total} ====" 
      query_p = number_to_percentage(docs_total == 0 ? 0 : ((select_query_total || 0) * 100 / (1.0 * docs_total)),:precision => 2) 
      doc_edc_stats = number_to_percentage(doc_count == 0 ? 0 : ((save_query_total || 0) * 100 / (1.0 * doc_count)),:precision => 2)
      if docType_condition.class == Array
        docs_total -= modified_docs_total
        tmp_doc_type = 'true'
      end
    elsif cat == '1'
      function_params = [where_clause,["true"],docType_condition,condition,where_clause_edc,search_org_condition]
      query_stats_by = search_condition_org_new(function_params)
    elsif cat == '2'
      queries = QueryHistory.where(no_admin).where(search_org_condition).where("doc_id IS NOT NULL").where(docType_condition)
      function_params = [queries,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition]
      query_stats_by = search_condition_user(function_params)
    #elsif cat == '3'
    #  query_stats_by = search_condition_role(function_params)
    elsif cat == '4'
      function_params = [select_query_total,where_clause,["true"],docType_condition,condition,where_clause_edc,search_org_condition]
      query_stats_by = search_condition_month2(function_params)
    elsif cat == '5'
      function_params = [select_query_total,where_clause,["true"],docType_condition,condition,where_clause_edc,search_org_condition]
      query_stats_by = search_condition_orginfo_new(function_params)
    end

    if cat == '0'
      results = { 
        :groupby => cat,
        :doc_type => tmp_doc_type,
        :query_stats => query_stats_by,
        :docs_total => docs_total,# - modified_docs_total, 
        #:pages_total => pages_total, 
        :pages_total => pages_total,#+modified_pages_total, 
        :query_total => select_query_total, 
        :query_p => number_to_percentage(docs_total == 0 ? 0 : (select_query_total * 100 / (1.0 * docs_total)),:precision => 2),
        :doc_count => doc_count, 
        :doc_edc_page => doc_edc_page, 
        :doc_edc_query => save_query_total, 
        :doc_edc_stats => number_to_percentage(doc_count == 0 ? 0 : (save_query_total * 100 / (1.0 * doc_count)),:precision => 2),
        :rds_docs_total => rds_docs_total, 
        :rds_pages_total => rds_pages_total,
        :modified_docs_total => modified_docs_total, 
        :modified_pages_total => modified_pages_total
      }
    else 
      results = { :groupby => cat, :query_stats => query_stats_by }
    end
    logger.info results
    render json: results
  end

  def get_ds_data(where_clause_edc,docType_condition)
      #document_org = DocumentStat.where(where_clause_edc).where(docType_condition)
      document_org = DocumentStat.select("sum(docs) as docs,sum(pages) as pages,sum(query) as query,sum(docs_saved) as docs_saved,sum(pages_saved) as pages_saved,sum(query_saved) as query_saved,sum(docs_added) as docs_added,sum(pages_added) as pages_added,sum(query_added) as query_added").where(where_clause_edc).where(docType_condition).first
      		
      docs = pages = query = docs_saved  = pages_saved = query_saved = docs_added = pages_added = query_added = 0
      unless document_org.blank?
        docs = document_org.docs || 0
        pages = document_org.pages || 0
        query = document_org.query || 0
        docs_saved = document_org.docs_saved || 0
        pages_saved = document_org.pages_saved || 0
        query_saved = document_org.query_saved || 0
        docs_added = document_org.docs_added || 0
        pages_added = document_org.pages_added || 0
        query_added = document_org.query_added || 0
      end
=begin
      docs = document_org.sum("docs")
      pages = document_org.sum("pages")
      query = document_org.sum("query")
      
      docs_saved = document_org.sum("docs_saved")
      pages_saved = document_org.sum("pages_saved")
      query_saved = document_org.sum("query_saved")

      docs_added = document_org.sum("docs_added")
      pages_added = document_org.sum("pages_added")
      query_added = document_org.sum("query_added")
=end
      p '===========', docs,pages,query,docs_added,pages_added,query_added,docs_saved,pages_saved,query_saved
      return docs,pages,query,docs_added,pages_added,query_added,docs_saved,pages_saved,query_saved
  end

  def get_query_data(queries,where_clause)
    #符合条件的总查阅记录
	  search_queries = queries.where(where_clause).where(docType_condition)
    #符合条件的总增量的查阅量
    select_query_total = search_queries.where(:doc_flag => 0).count 
    #符合条件的总存量的查阅量
    save_query_total = search_queries.where(:doc_flag => 1).count 

    return select_query_total,save_query_total
  end

  #获取存量的总档案数和总页数
  def get_save_data
    doc_count = 0
    doc_edc = documents.where(:doc_flag => 1)    #符合条件的存量记录
    doc_edc_page = doc_edc.sum("pages") #符合条件的存量的总页数
    doc_count = doc_edc.count  #符合条件的存量总档案数
    return doc_count,doc_edc_page
  end

  #获取增量的总档案数和总页数
  def get_add_data(documents)
    docs_records = documents.where(:doc_flag => 0)  #符合条件的增量总记录
    docs_total = docs_records.count  #符合条件的增量总档案量
    pages_total = docs_records.sum("pages")  #符合条件的增量总页数
    return docs_total,pages_total
  end
  
  #获取补充单证的总档案数和总页数
  def get_mds_data(search_org_condition,where_clause,docType_condition)
    # this is info about total pages and count for modified_document 
    #modified_documents =  ModifiedDocument.where(search_org_condition).where(where_clause).where(docType_condition)
    modified_documents =  ModifiedDocument.select("sum(pages) as pages,count(*) as docs").where(search_org_condition).where(where_clause).where(docType_condition).first
    modified_docs_total =  modified_documents.docs || 0  
    modified_pages_total =  modified_documents.pages || 0
    #modified_docs_total =  modified_documents.length
    #modified_pages_total =  modified_documents.sum("pages")
    return modified_docs_total,modified_pages_total
  end

  #获取借阅单证的总档案数和总页数
  def get_rds_data(where_clause,docType_condition)
    if where_clause.blank?
      rds = RequisitionDetail.where(:status => 1)
    else
      rds = RequisitionDetail.where(["status = 1 and updated_at >= :start_time and updated_at < :end_time",where_clause[1]])
    end
    rds_doc_ids = rds.collect {|item| item.single_card_number}
    rds_docs_total,rds_pages_total = Document.where( where_clause ).where(docType_condition).where(:doc_id => rds_doc_ids).count,Document.where( where_clause ).where(docType_condition).where(:doc_id => rds_doc_ids).sum("pages")

    return rds_docs_total,rds_pages_total
  end

  #整理组装参数
  def product_params(params)
    cat = params[:groupby]
    search_org_condition = get_search_org(params) 
    where_clause = {}
    where_clause_edc = {}
    no_admin = ["user_id not in (?)",[1,2,5]]
    if !params[:from_date].blank? && !params[:to_date].blank?
      where_clause = [
        "created_at >= :start_time and created_at < :end_time",
        {:start_time => params[:from_date].to_date, :end_time => params[:to_date].to_date.next}
        ]
      where_clause_edc = [
        "created_date >= :start_time and created_date < :end_time",
        {:start_time => params[:from_date].to_date, :end_time => params[:to_date].to_date.next}
      ]
    end

    condition = {:doc_type => get_doc_type(params),:org => params[:condition_value][:org]||"", :org_info => params[:condition_value][:org_info]||""}
    query_stats = {}
    query_stats_by = {}
    org_condition = ["true"] 
    cat = params[:groupby]
    if cat == '2' &&  !params[:condition_value][:check_org].nil?
      logger.info "----------------"
      check_org = params[:condition_value][:check_org]
      logger.info check_org 
      if  check_org == "1" 
        org_condition = ((condition[:org].nil? || condition[:org] == "") ? ["true"] : {:org => condition[:org]})
      elsif check_org == "0" 
        org_condition = {:org => condition[:org_info].split(",")} 
      end
	    logger.info org_condition 
    end
    docType_condition = ((condition[:doc_type].nil? || condition[:doc_type] == "") ? ["true"] : {:doc_type => condition[:doc_type]})


    return [search_org_condition,where_clause,where_clause_edc,no_admin,no_admin,query_stats,query_stats_by,org_condition,docType_condition,condition] 
  end



  def dh_report_old#_condition

    search_org_condition = get_search_org 
    where_clause = {}
    where_clause_edc = {}
	no_admin = ["user_id not in (?)",[1,2,5]]
    if !params[:from_date].blank? && !params[:to_date].blank?
      where_clause = { :created_at => params[:from_date].to_date .. params[:to_date].to_date.next }
      where_clause_edc = { :created_date => params[:from_date].to_date .. params[:to_date].to_date}
    end
    condition = {:doc_type => get_doc_type,:org => params[:condition_value][:org]||"", :org_info => params[:condition_value][:org_info]||""}
    query_stats = {}
    query_stats_by = {}
    org_condition = ["true"] 
    cat = params[:groupby]
    if cat == '2' &&  !params[:condition_value][:check_org].nil?
	logger.info "----------------"
	check_org = params[:condition_value][:check_org]
	logger.info check_org 

	if  check_org == "1" 
		org_condition = ((condition[:org].nil? || condition[:org] == "") ? ["true"] : {:org => condition[:org]})
	elsif check_org == "0" 
		org_condition = {:org => condition[:org_info].split(",")} 
	end

	logger.info org_condition 
    end
    docType_condition = ((condition[:doc_type].nil? || condition[:doc_type] == "") ? ["true"] : {:doc_type => condition[:doc_type]})
#符合条件的总档案记录
	documents = Document.where(org_condition).where( where_clause ).where(search_org_condition).where(docType_condition)
    # first check the time range.
    doc_count = 0
#符合条件的存量记录
	doc_edc = documents.where(:doc_flag => 1).order("doc_flag")
#符合条件的存量的总页数
	doc_edc_page = doc_edc.sum("pages")
#符合条件的存量总档案数
	doc_count = doc_edc.count



#符合条件的增量总记录
	docs_records = documents.where(:doc_flag => 0).order("doc_flag")
#符合条件的增量总档案量
    docs_total = docs_records.count
#符合条件的增量总页数
    pages_total = docs_records.sum("pages")

  # this is info about total pages and count for modified_document 
	modified_documents =  ModifiedDocument.where(search_org_condition).where(where_clause).where(docType_condition)
	modified_docs_total =  modified_documents.length
	modified_pages_total =  modified_documents.sum("pages")
  
  
  # this is info for requisition_details
	rds = RequisitionDetail.where(:status => 1)
	rds = rds.where(:updated_at => where_clause[:created_at]) unless  where_clause[:created_at].blank?
	rds_doc_ids = rds.collect {|item| item.single_card_number}
  rds_docs = documents.where(:doc_id => rds_doc_ids)
	rds_docs_total = rds_docs.length
  rds_pages_total = rds_docs.sum("pages")

	#sum modefy document pages
	pages_total +=  modified_pages_total 


#总查阅记录
    queries = QueryHistory.where(no_admin).where(search_org_condition).where("doc_id IS NOT NULL").where(docType_condition)
#总查阅量
    query_total = queries.count 
#符合条件的总查阅记录
	search_queries = queries.where(where_clause).where(docType_condition)
#符合条件的总增量的查阅量
    select_query_total = search_queries.where(:doc_flag => 0).count 
logger.info '-----------'
logger.info select_query_total 

#符合条件的总存量的查阅量
	save_query_total = search_queries.where(:doc_flag => 1).count 


#符合条件的总档案数量
	document_count = documents.count
#总档案页数
	document_page_count = pages_total+doc_edc_page


# docs_total => 符合条件的增量总档案量
# pages_total => 符合条件的增量总页数
# query_total => 符合条件的增量总查阅量
# query_p => 符合条件的增量查阅率 

#doc_count =>  符合条件的存量总档案数
#doc_edc_page =>  符合条件的存量的总页数
#doc_edc_query => 符合条件的总存量的查阅量
#doc_edc_stats => 符合条件的存量查阅率

    results = { :docs_total => docs_total, :pages_total => pages_total, :query_total => select_query_total, :query_p => number_to_percentage(docs_total == 0 ? 0 : (select_query_total * 100 / (1.0 * docs_total)),:precision => 2) ,:doc_count => doc_count, :doc_edc_page => doc_edc_page, :doc_edc_query => save_query_total, :doc_edc_stats => number_to_percentage(doc_count == 0 ? 0 : (save_query_total * 100 / (1.0 * doc_count)),:precision => 2),:rds_docs_total => rds_docs_total, :rds_pages_total => rds_pages_total, :modified_docs_total => modified_docs_total, :modified_pages_total => modified_pages_total}

      cat = params[:groupby]
      results[:groupby] = cat
      function_params = [queries,document_count,document_page_count,select_query_total,where_clause,["true"],docType_condition,condition,where_clause_edc,search_org_condition]
      #function_params = [queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition]

      if cat == '0'
				if false
					
				end	
      elsif cat == '1'
        query_stats_by = search_condition_org_new(function_params)
      elsif cat == '2'
	    function_params[5] = org_condition
        query_stats_by = search_condition_user(function_params)
      #elsif cat == '3'
      #  query_stats_by = search_condition_role(function_params)
      elsif cat == '4'
        query_stats_by = search_condition_month2(function_params)
      elsif cat == '5'
        query_stats_by = search_condition_orginfo_new(function_params)
      end
      results[:query_stats] = query_stats_by
      logger.info '==========================================' 
      logger.info results
      render json: results, status: 200
    end

    #业务点部分
#新方法逻辑通顺,需要进行测试确认
    def search_condition_org_new(function_params)
      #queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      query_stats_by = {}
      document_org = DocumentStat.where(where_clause_edc).where(docType_condition).where(search_org_condition).where("org <> 'TSP_A'").order("org").group("org")
      #document_org = DocumentStat.select("sum(docs_added) as docs_added, sum(pages_added) as pages_added, sum(query_added) as query_added,sum(query) as query_total").where(where_clause_edc).where(docType_condition).where(search_org_condition).order("org").group("org")
      
=begin
      docs_stats = pages_stats = query_stats = query_total = 0  
      document_org.each do |item|
	unless item.nil?
            docs_stats += item.docs_added || 0
	    pages_stats += item.pages_added || 0
	    query_stats += item.query_added || 0
	    query_total += item.query_total || 0
	end
      end
=end
      docs_stats = document_org.sum("docs_added")
      pages_stats = document_org.sum("pages_added")
      query_stats = document_org.sum("query_added")
	
      query_total = 0  
      query_total = query_stats.values.sum
      #document_org.each {|x| query_total += (x.query_added || 0) unless x.nil?} 
      if search_org_condition.length == 2
          search_org_condition[0] = "dic_num in (?)"	
      end

      DictionaryInfo.where(:dic_type => "org").where(["dic_num not in (2200)"]).where(search_org_condition).each do |do_row|
      	  k = do_row.dic_num.to_s
          num_docs = 0
          num_pages = 0
          num_queries = 0
          num_docs = docs_stats[k] if docs_stats.has_key?(k)	
          num_pages = pages_stats[k] if pages_stats.has_key?(k)
          num_queries = query_stats[k] if query_stats.has_key?(k)
          query_stats_by[k] = { 
              :num_docs => num_docs, 
              :num_pages => num_pages, 
              :num_queries => num_queries,
              :percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
              :percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
          }

      end
      return query_stats_by
    end

    #关区部分
#新方法逻辑通顺,需要进行测试确认
    def search_condition_orginfo_new(function_params)
      #queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      query_stats_by = {}
      document_org = DocumentStat.where(where_clause_edc).where(docType_condition).where(search_org_condition).where("org <> 'TSP_A'").order("org").group("org")
      docs_stats = document_org.sum("docs_added")
      pages_stats = document_org.sum("pages_added")
      query_stats = document_org.sum("query_added")

      if search_org_condition.length == 2
	search_org_condition[0] = "subjection_org in (?)"	
      end
      OrgInfo.where(search_org_condition).order("org").group("org").each do |org|
	ois = OrgInfo.where(:org => org.org)
	sois = ois.collect(&:subjection_org)
	num_docs = 0
	num_pages = 0
	num_queries = 0
	sois.each do |k|
	    num_docs += docs_stats[k] if docs_stats.has_key?(k)	
	    num_pages += pages_stats[k] if pages_stats.has_key?(k)
            num_queries += query_stats[k] if query_stats.has_key?(k)
	end
	query_stats_by[org.org] = { :num_docs => num_docs, :num_pages => num_pages, :num_queries => num_queries,
				:percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
				:percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
		}

      end
      return query_stats_by
    end

    #用户部分
    def search_condition_user(function_params)
      #queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      queries,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
      query_stats_by = {}

      #document_org = DocumentStat.where(where_clause_edc).where(docType_condition).where(search_org_condition).order("org").group("org")

      docs_total = Document.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).where(search_org_condition).order("org").count
      query_total= queries.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).where(search_org_condition).order("org").count

      query_stats = queries.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).where(search_org_condition).order("user_id").group("user_id").count
      umap = {}
      #unames = User.all.each { |u| umap[u.id] = u.username }
      logger.info '-----1------' 
      logger.info org_condition 
      org_value = org_condition.class == Array ? org_condition : {:subjection_org => org_condition.values} 

      logger.info org_value

      unames = User.where(org_value).all.each { |u| 
        logger.info search_org_condition
        logger.info !u.orgs.nil? 
	if search_org_condition.class == Array && search_org_condition.length == 1 && search_org_condition[0] == "true"
	  umap[u.id] = [u.username,u.fullname] 
        elsif search_org_condition.length == 2 && !u.orgs.nil? && (u.orgs.split(",") & search_org_condition[1]).length > 0
	  umap[u.id] = [u.username,u.fullname] 
	end
      }

      doc_total_tmp = docs_total == 0 ? 0 : (100.0 / docs_total)
      query_total_tmp = query_total == 0 ? 0 : (100.0 / query_total)

      logger.info '-----2------' 
      logger.info umap 
      query_stats.each { |k,v|
        if umap.has_key?(k)
          query_stats_by[umap[k][1]] = {
	    :username => umap[k][0],
            :num_queries => v,
            :percentage_q =>  number_to_percentage( v * doc_total_tmp,:precision => 2), 
            :percentage_qq => number_to_percentage( v * query_total_tmp,:precision => 2),
          }
        end
      }
      return query_stats_by
    end

       #月份部分
      def search_condition_month2(function_params)
        #queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
        query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc,search_org_condition = function_params
        query_stats_by = {}
        months = [Time.now.end_of_month]
        6.times do
          t = (months.last - 32.days).end_of_month
          if (t.strftime("%Y/%m") == '2012/03')
            months << (t - 1.month)
            break;
          end
          months << t
        end

		logger.info "### BEGIN LOAD DATA FROM DOCUMENT STATS ###"
		
		(0..(months.length - 2)).each { |i|
			key = months[i].strftime("%Y/%m")
			where_clause = { :created_date => (months[i + 1] + 1).to_date .. (months[i] ).to_date }
			logger.info "### CREATED  DATE:#{where_clause} ###"
			logger.info "### ORG CONDITION:#{org_condition}#{docType_condition} ###"
			#document_stats = DocumentStat.select("org,sum(docs) as docs,sum(pages) as pages,sum(queries) as queries").where(where_clause).where(org_condition).where(docType_condition).group(:org)
			document_stats = DocumentStat.select("org,sum(docs_added) as docs,sum(pages_added) as pages,sum(query_added) as queries").where(where_clause).where(org_condition).where(docType_condition).where(search_org_condition).where("org <> 'TSP_A'").group(:org)
	
          	query_stats_by[key] = document_stats.collect { |obj|
			
			docs = obj[:docs].to_i * 1.00 		
			single_queries = obj[:queries].to_f
			percent_q = docs == 0 ? 0 : (single_queries / docs)  
			percent_qq= query_total == 0 ? 0 : (single_queries / query_total) 

            { :org			=> obj[:org],
              :num_docs 	=> obj[:docs],
              :num_pages 	=> obj[:pages],
              :num_queries	=> obj[:queries].to_i,
			  :percentage_q => number_to_percentage(percent_q * 100 ,:precision => 2),
			  :percentage_qq=> number_to_percentage(percent_qq* 100 ,:precision => 2)
			  #:percentage_qq=> percent_qq.to_s + " %"
            }
          }
        }
		logger.info "### END OF LOAD DATA FROM DOCUMENT STATS ###"
        return query_stats_by
      end

      def get_doc_type(params)
        doc_type = params[:condition_value][:doc_type]

        years = params[:condition_value][:years]
        if years.blank? && doc_type.blank?
          return ""
        end

        dt = ['JK3Y', 'JK5Y', 'JK11', 'CK3Y', 'CK5Y']

        dt = dt.select{ |v| v=~/#{doc_type}/}

        dt = dt.select{ |v| v=~/#{years}/}

        if dt.empty?
          return ""
        end

        return dt
      end
      ########end#########

        # POST /document_histories
        # POST /document_histories.json
        def create
          @document_history = DocumentHistory.new(params[:document_history])

          respond_to do |format|
            if @document_history.save
              format.html { redirect_to @document_history, notice: 'Document history was successfully created' }
              format.json { render json: @document_history, status: :created, location: @document_history }
            else
              format.html { render action: "new" }
              format.json { render json: @document_history.errors, status: :unprocessable_entity }
            end
          end
        end

        # PUT /document_histories/1
        # PUT /document_histories/1.json
        def update
          @document_history = DocumentHistory.find(params[:id])

          respond_to do |format|
            if @document_history.update_attributes(params[:document_history])
              format.html { redirect_to @document_history, notice: 'Document history was successfully updated.' }
              format.json { head :no_content }
            else
              format.html { render action: "edit" }
              format.json { render json: @document_history.errors, status: :unprocessable_entity }
            end
          end
        end

        # DELETE /document_histories/1
        # DELETE /document_histories/1.json
        def destroy
          @document_history = DocumentHistory.find(params[:id])
          @document_history.destroy

          respond_to do |format|
            format.html { redirect_to document_histories_url }
            format.json { head :no_content }
          end
        end


        private
        def blank_request?
          params[:gid].blank? && params[:doc_id].blank? && params[:username].blank? && params[:from_date].blank? && params[:to_date].blank?
        end

      end

