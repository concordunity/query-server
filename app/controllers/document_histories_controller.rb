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
    inquired_docs = Document.where('inquired=true OR checkedout =  true')
    render :json => inquired_docs, :status => 200
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
      doc_ids = !dg.nil? ? dg.doc_group_entries.collect { |t| "'" + t.doc_id + "'" } : []
      # doc_id_condition = doc_ids.blank? ? "false" : "doc_id in (#{doc_ids.join(",")})"
      if doc_ids.blank?
        raise ActiveRecord::RecordNotFound
      else
        search_conditions[:doc_id]=doc_ids
      end
    end 
    
    if !doc_id.blank?
      #doc_id_condition = "doc_id='#{params[:doc_id]}'"
      search_conditions[:doc_id] = params[:doc_id]
    end

    sql_conditions = (search_conditions.length == 0) ? ["true"] : search_conditions
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

    condition = {:doc_type => get_doc_type,:org => params[:condition_value][:org]||""}
    p condition
    query_stats = {}
    query_stats_by = {}

    cat = params[:groupby]
    results[:groupby] = cat
    org_condition = ((condition[:org].nil? || condition[:org] == "") ? ["true"] : {:org => condition[:org]})
    docType_condition = ((condition[:doc_type].nil? || condition[:doc_type] == "") ? ["true"] : {:doc_type => condition[:doc_type]})

    function_params = [queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition]

    if cat == '1'
      query_stats_by = search_condition_org(function_params)
    elsif cat == '2'
      query_stats_by = search_condition_user(function_params)
    elsif cat == '3'
      query_stats_by = search_condition_role(function_params)
    elsif cat == '4'
      query_stats_by = search_condition_month(function_params)
    end

    results[:query_stats] = query_stats_by
    render json: results
  end
  #申报关区部分
  def search_condition_org(function_params)
    queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition = function_params
    query_stats_by = {}
    
    
    document_org = Document.where(where_clause).where(org_condition).where(docType_condition).group("org")
    docs_stats = document_org.count
    docs_stats_T = Document.group("org").count
    pages_stats = document_org.sum("pages")

    query_stats = queries.where(where_clause).where(org_condition).where(docType_condition).group("org").count

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
    return query_stats_by
  end
  #用户部分
  def search_condition_user(function_params)
    queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition = function_params
    query_stats_by = {}

    
    query_stats = queries.where(where_clause).where(org_condition).where(docType_condition).group("user_id").count
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
    return query_stats_by
  end
  #用户角色部分
  def search_condition_role(function_params)
    queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition = function_params
    query_stats_by = {}
    rmap = {}
    Role.select([:id, :name]).each { |r|
      rmap[r.id] = r.name
    }

    sql = %{SELECT role_id, count(query_histories.id)
             from query_histories, users_roles
             where doc_id is not null and
                   #{condition[:org].nil? || condition[:org] == "" ? "true" : "org = "+condition[:org]} and
                   #{condition[:doc_type].nil?  || condition[:doc_type] == "" ? "true" : "doc_type in (#{condition[:doc_type].collect{|item| "'"+item+"'"}.join(",")})"} and
                   query_histories.user_id = users_roles.user_id
                   group by role_id}
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
    return query_stats_by
  end
  #月份部分
  def search_condition_month(function_params)
    queries,docs_total,pages_total,query_total,where_clause,org_condition,docType_condition,condition = function_params
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
      key = months[i].strftime("%Y/%m")
      where_clause = { :created_at => months[i+1] .. months[i] }

      query_stats_t = QueryHistory.where("doc_id IS NOT NULL").where(where_clause).where(org_condition).where(docType_condition).group(:org).count
      doc_stats_t = Document.where(where_clause).where(org_condition).where(docType_condition).group(:org).count
      page_stats_t = Document.where(where_clause).where(org_condition).where(docType_condition).group(:org).sum("pages")

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
