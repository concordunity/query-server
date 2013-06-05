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


  ########start zhouzhen create for serach condition#########
  #前端Ａjax请求的Ａction，将条件发送过来：
  #{"from_date"=>"2012-06-24", "to_date"=>"2012-07-24", "groupby"=>"3",
  #   "condition_value"=>{"frm_org"=>"2225", "frm_docType"=>"CK", "frm_years"=>"3"}}
  def dh_report#_condition

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
	documents = Document.where(org_condition).where( where_clause )
    # first check the time range.
    doc_count = 0
#符合条件的存量记录
	doc_edc = documents.where(:doc_flag => 1)
#符合条件的存量的总页数
	doc_edc_page = doc_edc.sum("pages")
#符合条件的存量总档案数
	doc_count = doc_edc.count



#符合条件的增量总记录
	docs_records = documents.where(:doc_flag => 0)
#符合条件的增量总档案量
    docs_total = docs_records.count
#符合条件的增量总页数
    pages_total = docs_records.sum("pages")
	#sum modefy document pages
	pages_total +=  ModifiedDocument.where(where_clause).sum("pages");


#总查阅记录
    queries = QueryHistory.where(no_admin).where("doc_id IS NOT NULL")
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

    results = { :docs_total => docs_total, :pages_total => pages_total, :query_total => select_query_total, :query_p => number_to_percentage(docs_total == 0 ? 0 : (select_query_total * 100 / (1.0 * docs_total)),:precision => 2) ,:doc_count => doc_count, :doc_edc_page => doc_edc_page, :doc_edc_query => save_query_total, :doc_edc_stats => number_to_percentage(doc_count == 0 ? 0 : (save_query_total * 100 / (1.0 * doc_count)),:precision => 2)}

      cat = params[:groupby]
      results[:groupby] = cat
      function_params = [queries,document_count,document_page_count,select_query_total,where_clause,["true"],docType_condition,condition,where_clause_edc]
      #function_params = [queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition]

      if cat == '1'
        query_stats_by = search_condition_org_new(function_params)
      elsif cat == '2'
	    function_params[5] = org_condition
        query_stats_by = search_condition_user(function_params)
      elsif cat == '3'
        query_stats_by = search_condition_role(function_params)
      elsif cat == '4'
        query_stats_by = search_condition_month2(function_params)
      elsif cat == '5'
        query_stats_by = search_condition_orginfo_new(function_params)
      end
      results[:query_stats] = query_stats_by
      render json: results
    end
    #业务点部分
#新方法逻辑通顺,需要进行测试确认
    def search_condition_org_new(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}
      document_org = DocumentStat.where(where_clause_edc).where(docType_condition).order("org").group("org")
      docs_stats = document_org.sum("docs_added")
      pages_stats = document_org.sum("pages_added")
      query_stats = document_org.sum("query_added")
      logger.info "=======" 
      logger.info query_total
      logger.info query_stats["2201"] 
      DictionaryInfo.where(:dic_type => "org").where(["dic_num not in (2200)"]).each do |do_row|
      	    k = do_row.dic_num.to_s
	    num_docs = 0
	    num_pages = 0
	    num_queries = 0
	    num_docs = docs_stats[k] if docs_stats.has_key?(k)	
	    num_pages = pages_stats[k] if pages_stats.has_key?(k)
            num_queries = query_stats[k] if query_stats.has_key?(k)
	    query_stats_by[k] = { :num_docs => num_docs, :num_pages => num_pages, :num_queries => num_queries,
		    :percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
		    :percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
		}

      end
=begin
	document_org.each do |do_row|
	    k = do_row.org
	    num_docs = 0
	    num_pages = 0
	    num_queries = 0
	    num_docs = docs_stats[k] if docs_stats.has_key?(k)	
	    num_pages = pages_stats[k] if pages_stats.has_key?(k)
            num_queries = query_stats[k] if query_stats.has_key?(k)
	    query_stats_by[k] = { :num_docs => num_docs, :num_pages => num_pages, :num_queries => num_queries,
		    :percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
		    :percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
		}
        end
=end
	return query_stats_by
    end

    def search_condition_org(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}


      document_org = Document.where(:doc_flag => 0).where(where_clause).where(docType_condition).order("org").group("org")
      docs_stats = document_org.count
      docs_stats_T = Document.where(:doc_flag => 0).order("org").group("org").count
      pages_stats = document_org.sum("pages")

      query_stats = queries.where(where_clause).where(docType_condition).order("org").group("org").count

      docs_stats_T.each { |k,v|
        num_queries = 0
        num_docs = 0
        num_pages = 0
        
	num_queries = query_stats[k] if query_stats.has_key?(k)

        if docs_stats.has_key?(k)
          num_docs = docs_stats[k]
          num_pages = pages_stats[k]
        end

        query_stats_by[k] = { :num_docs => num_docs,
          :num_pages => num_pages,
          :num_queries => num_queries,
          :percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
          :percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
        }
      }
      return query_stats_by
    end
    #关区部分
#新方法逻辑通顺,需要进行测试确认
    def search_condition_orginfo_new(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}
      document_org = DocumentStat.where(where_clause_edc).where(docType_condition).order("org").group("org")
      docs_stats = document_org.sum("docs_added")
      pages_stats = document_org.sum("pages_added")
      query_stats = document_org.sum("query_added")

      OrgInfo.order("org").group("org").each do |org|
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
    def search_condition_orginfo(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}

      document_org = Document.where(:doc_flag => 0).where(where_clause).where(docType_condition).order("org").group("org")
#符合条件的档案总数
      docs_stats = document_org.count

#符合条件的各个关区档案总页数
      pages_stats = document_org.sum("pages")
#各个关区总的档案数
      docs_stats_T = Document.where(:doc_flag => 0).order("org").group("org").count

#各个关区总的查阅数
      query_stats = queries.where(:doc_flag => 0).where(where_clause).where(docType_condition).order("org").group("org").count

	  OrgInfo.order("org").group("org").each do |org|
		ois = OrgInfo.where(:org => org.org)
		sois = ois.collect(&:subjection_org)
		num_queries = 0
		num_docs = 0
		num_pages = 0
		sois.each do |k|
			num_queries += query_stats[k] if query_stats.has_key?(k)
			if docs_stats.has_key?(k)
				num_docs += docs_stats[k] 
				num_pages += pages_stats[k]
			end
		end
		logger.info "=================" 
		logger.info num_docs
		logger.info num_pages
		logger.info num_queries
		query_stats_by[org.org] = { :num_docs => num_docs,
				:num_pages => num_pages,
				:num_queries => num_queries,
				:percentage_q => num_docs == 0 ? 0 : number_to_percentage(num_queries * 100.0 / num_docs,:precision => 2),
				:percentage_qq => query_total == 0 ? 0 : number_to_percentage(num_queries * 100.0 / query_total,:precision => 2),
		}
	  end
      return query_stats_by
    end


    #用户部分
    def search_condition_user(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}

      docs_total = Document.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).order("org").count
      query_total= queries.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).order("org").count

      query_stats = queries.where(:doc_flag => 0).where(where_clause).where(org_condition).where(docType_condition).order("user_id").group("user_id").count
      umap = {}
      #unames = User.all.each { |u| umap[u.id] = u.username }
      org_value = org_condition.class == Array ? org_condition : {:subjection_org => org_condition.values} 
      unames = User.where(org_value).all.each { |u| umap[u.id] = [u.username,u.fullname] }

      doc_total_tmp = docs_total == 0 ? 0 : (100.0 / docs_total)
      query_total_tmp = query_total == 0 ? 0 : (100.0 / query_total)

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

    #用户角色部分
    def search_condition_role(function_params)
      queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
      query_stats_by = {}
      rmap = {}
      Role.all.each { |r|
        rmap[r.id] = r.name
      }

      sql = %{SELECT query_histories.role_id, count(query_histories.id)
        from query_histories, users_roles
        where doc_id is not null and
        #{condition[:org].nil? || condition[:org] == "" ? "true" : "org = "+condition[:org]} and
        #{condition[:doc_type].nil?  || condition[:doc_type] == "" ? "true" : "doc_type in (#{condition[:doc_type].collect{|item| "'"+item+"'"}.join(",")})"} and
        query_histories.user_id = users_roles.user_id
        group by role_id
	order by role_id 
	}
        sql_results = ActiveRecord::Base.connection.execute(sql)


	docs_total_tmp = docs_total == 0 ? 0 : (100.0 / docs_total)
	query_total_tmp = query_total == 0 ? 0 : (100.0 / query_total)

        sql_results.each { |k,v|
          if rmap.has_key?(k)
            query_stats_by[rmap[k]] = {
              :num_queries => v,
              :percentage_q => number_to_percentage( v * docs_total_tmp,:precision => 2),
              :percentage_qq => number_to_percentage( v * query_total_tmp,:precision => 2)
            }
          end
        }
        return query_stats_by
      end
      #月份部分
      def search_condition_month(function_params)
        queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
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

        (0..(months.length - 2)).each { |i|
	      logger.info "====#{i}===========" 
		  logger.info Time.now.to_s
          key = months[i].strftime("%Y/%m")
          where_clause = { :created_at => months[i+1] .. months[i] }

          query_stats_t = QueryHistory.where("doc_id IS NOT NULL").where(where_clause).where(org_condition).where(docType_condition).order("org").group(:org).count
          tmp_record = Document.where(where_clause).where(org_condition).where(docType_condition).order("org").group(:org)
          doc_stats_t = tmp_record.count
          page_stats_t = tmp_record.sum("pages")

          keys = Set.new
          keys.merge(query_stats_t.keys)
          keys.merge(doc_stats_t.keys)
          keys.merge(page_stats_t.keys)


          query_stats_by[key] = keys.collect { |k|
            { :org => k,
              :num_docs => doc_stats_t.has_key?(k) ? doc_stats_t[k] : '',
              :num_pages => page_stats_t.has_key?(k) ? page_stats_t[k] : '',
              :num_queries => query_stats_t.has_key?(k) ? query_stats_t[k] : '',
              :percentage_qq => query_stats_t.has_key?(k) ?  (query_total == 0 ? 0 : number_to_percentage(query_stats_t[k] * 100.0 / query_total,:precision => 2)) : ''
            }
          }
        }
        return query_stats_by
      end

      #月份部分
      def search_condition_month2(function_params)
		queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition,where_clause_edc = function_params
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
			document_stats = DocumentStat.select("org,sum(docs_added) as docs,sum(pages_added) as pages,sum(query_added) as queries").where(where_clause).where(org_condition).where(docType_condition).group(:org)
	
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

      def get_doc_type
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

      #临时将方法屏蔽
      def dh_report_backup

        docs_total = Document.count
        pages_total = Document.sum("pages")
        query_total = QueryHistory.where("doc_id IS NOT NULL").count


        results = { :docs_total => docs_total,
          :pages_total => pages_total,
          :query_total => query_total,
          :query_p => number_to_percentage(query_total * 100 / (1.0 * docs_total)) }

          # first check the time range.
          where_clause = {}
          queries = QueryHistory.where("doc_id IS NOT NULL")
          if !params[:from_date].blank? && !params[:to_date].blank?
            where_clause = { :created_at => params[:from_date].to_date .. params[:to_date].to_date.next }
          end

          query_stats = {}
          query_stats_by = {}

          cat = params[:groupby]

          results[:groupby] = cat

          if cat == '1'
            docs_stats = Document.where(where_clause).group("org").count
            docs_stats_T = Document.group("org").count
            pages_stats = Document.where(where_clause).group("org").sum("pages")
            query_stats = queries.where(where_clause).group("org").count

            docs_stats_T.each { |k,v|
              num_queries = 0
              num_docs = 0
              num_pages = 0


              if query_stats.has_key?(k)
                num_queries = query_stats[k]
              end

              if docs_stats.has_key?(k)
                num_docs = docs_stats[k]
                num_pages = pages_stats[k]
              end

              query_stats_by[k] = { :num_docs => num_docs,
                :num_pages => num_pages,
                :num_queries => num_queries,
                :percentage_q => number_to_percentage(num_queries * 100 / (1.0 * v)),
                :percentage_qq => number_to_percentage(num_queries * 100 / (1.0 * query_total)),
              }
            }

          elsif cat == '2'
            query_stats = queries.where(where_clause).group("user_id").count
            umap = {}
            unames = User.select([:id, :username]).each { |u| umap[u.id] = u.username }

            query_stats.each { |k,v|
              if umap.has_key?(k)
                query_stats_by[umap[k]] = {
                  :num_queries => v,
                  :percentage_q => number_to_percentage( v * 100 / (1.0 * docs_total)),
                  :percentage_qq => number_to_percentage( v * 100 / (1.0 * query_total)),
                }
              end
            }
          end

          if cat == '3'
            rmap = {}
            Role.select([:id, :name]).each { |r|
              rmap[r.id] = r.name
            }      

            sql = "SELECT role_id, count(query_histories.id) from query_histories, users_roles where doc_id is not null and query_histories.user_id = users_roles.user_id group by role_id"
            sql_results = ActiveRecord::Base.connection.execute(sql)
            sql_results.each { |k,v| 
              if rmap.has_key?(k)
                query_stats_by[rmap[k]] = {
                  :num_queries => v,
                  :percentage_q => number_to_percentage( v * 100 / (1.0 * docs_total)),
                  :percentage_qq => number_to_percentage( v * 100 / (1.0 * query_total)),
                }
              end
            } 
          end

          if cat == '4'
            months = [Time.now.end_of_month]
            6.times do
              t = (months.last - 32.days).end_of_month
              if (t.strftime("%Y/%m") == '2012/03')
                months << (t - 1.month)
                break;
              end
              months << t 
            end

            (0..(months.length - 2)).each { |i|
              key = months[i].strftime("%Y/%m")
              where_clause = { :created_at => months[i+1] .. months[i] }

              query_stats_t = QueryHistory.where("doc_id IS NOT NULL").where(where_clause).group(:org).count
              doc_stats_t = Document.where(where_clause).group(:org).count
              page_stats_t = Document.where(where_clause).group(:org).sum("pages")

              #qq_t = query_stats_t.collect { |k,v| 
              #  { :org => k,
              #    :qq => number_to_percentage(v * 100 / (1.0 * query_total))
              #  }
              #}

              keys = Set.new
              keys.merge(query_stats_t.keys)
              keys.merge(doc_stats_t.keys)
              keys.merge(page_stats_t.keys)


              query_stats_by[key] = keys.collect { |k| 
                { :org => k,
                  :num_docs => doc_stats_t.has_key?(k) ? doc_stats_t[k] : '',
                  :num_pages => page_stats_t.has_key?(k) ? page_stats_t[k] : '',
                  :num_queries => query_stats_t.has_key?(k) ? query_stats_t[k] : '',
                  :percentage_qq => query_stats_t.has_key?(k) ?  (number_to_percentage(query_stats_t[k] * 100 / (1.0 * query_total))) : ''
                }
              }
            }
          end

          results[:query_stats] = query_stats_by
          render json: results
        end



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
