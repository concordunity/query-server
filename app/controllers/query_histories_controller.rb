class QueryHistoriesController < ApplicationController
  # GET /query_histories
  # GET /query_histories.json

  respond_to :json
  def index
    @query_histories = QueryHistory.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @query_histories }
    end
  end

  def search
    # gid, doc_id, time_range, doc_type, org, username

    # doc_id does not exist
    # username does not exist
    # gid does not exist

   # dg = DocGroup.find_by_id(params[:gid])
   # doc_ids = !dg.blank? ? dg.doc_group_entries.collect { |t| t.doc_id } : [params[:doc_id]] || [params[:doc_id]]
    if params.nil? || blank_request?
      return show_all
    end

    search_conditions = search_by_column || {}
    #doc_id_condition = "doc_id in (#{doc_ids.join(",")})"

    #doc_id_condition = "true"
    doc_id = params[:doc_id]
    gid = params[:gid]
    
    if doc_id.blank? and !gid.blank?
      dg = DocGroup.find_by_id(params[:gid])
      doc_ids = !dg.nil? ? dg.doc_group_entries.collect { |t| t.doc_id } : []
      #doc_id_condition = doc_ids.blank? ? "false" : "doc_id in (#{doc_ids.join(",")})"
      if doc_ids.blank?
         raise ActiveRecord::RecordNotFound
      else
        search_conditions[:doc_id] = doc_ids
      end
    end 
    
    if !doc_id.blank?
      #doc_id_condition = "doc_id='#{params[:doc_id]}'"
      search_conditions[:doc_id] = params[:doc_id]
    end
    
    sql_conditions = (search_conditions.length == 0) ? ["true"] : search_conditions
    
    @query_histories = QueryHistory.where("doc_id IS NOT NULL")
      .where(sql_conditions).order("created_at desc").limit(500).all

    #logger.info  @query_histories.length
    #logger.info "======"
    #respond_with(@query_histories)
    render json: @query_histories
  end

  def search_by_column    
    result_hash = {}
    result_hash[:doc_type] = params[:doc_type] unless params[:doc_type].blank? 
    result_hash[:org] = params[:org] unless params[:org].blank? 
    
    #result_arr = []	

    #result_arr << (params[:doc_type].blank? ? "true" : "doc_type = '#{params[:doc_type]}'")
    #result_arr << (params[:org].blank? ? "true" : "org = '#{params[:org]}'")

    username = params[:username]
    if !username.blank?
      user = User.find_by_username(username)
      if user.nil?
        raise ActiveRecord::RecordNotFound
      end
      #result_arr << "user_id = #{user.id}"
      result_hash[:user_id] = user.id
    end

    if (!params[:from_date].blank? && !params[:to_date].blank?)
      #q_string = "created_at between '" + params[:from_date] + "' AND '" + params[:to_date] + "'"
      #result_arr << q_string
      # result_hash[:created_at] = (Date.parse(params[:from_date]) .. Date.parse(params[:to_date]).collect {|item| item.to_s}
      result_hash[:created_at] = params[:from_date].to_date .. (params[:to_date].to_date + 1.day)
    end

    #result_arr.join(" and ")
    return result_hash 
  end

  def query_by_group
    dg = DocGroup.find(params[:gid])
    
    doc_ids = dg.doc_group_entries.collect { |t| t.doc_id }
    @query_histories = QueryHistory.where(:doc_id => doc_ids)

    respond_with(@query_histories)
  end

  def show_all
    u = User.find_by_username('admin')
    # @query_histories = QueryHistory.where("user_id != #{u.id}").order(:created_at).reverse_order.limit(500).all
    @query_histories = QueryHistory.order(:created_at).reverse_order.limit(500).all
    # @query_histories = QueryHistory.order(:created_at).reverse_order
    #respond_with(@query_histories)
    render json: @query_histories
  end

  def over_quota
    user_info = []
    u = Setting.find_by_name('max_queries_per_month')
    if u
      monthly_quota = u.value.to_i
      QueryHistory.where(:created_at => 2.month.ago .. Time.now).group(:user_id).count.each { |k,v|
        if v > monthly_quota
          user = User.find_by_id(k)
          if user
            user_info.push({ :username => user.username, :orgs => user.orgs, :queries => v })
          end
        end
      } 
    end
    render :json => user_info, :status => 200
  end

  # GET /query_histories/1
  # GET /query_histories/1.json
  def show
    @query_history = QueryHistory.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @query_history }
    end
  end

  # GET /query_histories/new
  # GET /query_histories/new.json
  def new
    @query_history = QueryHistory.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @query_history }
    end
  end

  # GET /query_histories/1/edit
  def edit
    @query_history = QueryHistory.find(params[:id])
  end


  def byuser

    conditions = { :user_id => current_user.id }
    
    t = params[:timerange]

    if t == "1"
      @query_histories = QueryHistory.order("created_at desc").where(conditions).limit(10)

      render json: @query_histories
      return
    end

    if t == "2"
      conditions[:created_at]  = 1.week.ago .. Time.now
    elsif t == "3"
      conditions[:created_at] = 1.month.ago .. Time.now
    elsif t == "4"
      conditions[:created_at] = 2.months.ago .. Time.now
    end
    @query_histories = QueryHistory.where(conditions).order(:created_at).reverse
    render json: @query_histories
  end

  def bydoc
    doc_id = params[:doc_id]
    @query_histories = QueryHistory.where(:doc_id => doc_id)

    respond_with(@query_histories)
  end

  # POST /query_histories
  # POST /query_histories.json
  def create
    @query_history = QueryHistory.new(params[:query_history])

    respond_to do |format|
      if @query_history.save
        format.html { redirect_to @query_history, notice: 'Query history was successfully created.' }
        format.json { render json: @query_history, status: :created, location: @query_history }
      else
        format.html { render action: "new" }
        format.json { render json: @query_history.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /query_histories/1
  # PUT /query_histories/1.json
  def update
    @query_history = QueryHistory.find(params[:id])

    respond_to do |format|
      if @query_history.update_attributes(params[:query_history])
        format.html { redirect_to @query_history, notice: 'Query history was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @query_history.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /query_histories/1
  # DELETE /query_histories/1.json
  def destroy
    @query_history = QueryHistory.find(params[:id])
    @query_history.destroy

    respond_to do |format|
      format.html { redirect_to query_histories_url }
      format.json { head :no_content }
    end
  end


 private
   def blank_request?
     params[:gid].blank? && params[:doc_id].blank? && params[:doc_type].blank? && params[:org].blank? && params[:username].blank? && params[:from_date].blank? && params[:to_date].blank?
   end
end
