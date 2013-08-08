# -*- coding: utf-8 -*-

require 'net/http'
require 'uri'

class DocumentsController < ApplicationController
  skip_before_filter :api_query, :query_doc_internal
  load_and_authorize_resource
  skip_authorize_resource :only => :api_query

  # GET /documents
  # GET /documents.json

  respond_to :html, :json
  
  def index_paging
	documents = Document.where({ :org => params[:org]  })
	render json: filter_proc( documents ,params )
  end
  
  def filter_proc(source,params) 
 	  column_count = params[:iColumns]
	  iSortCol_0 = params[:iSortCol_0]	  
	  sSortDir_0 = params[:sSortDir_0]	  
	  sSearch = params[:sSearch]
	  mDataPro = params["mDataProp_" + iSortCol_0]
	  logger.info "we are searching for #{sSearch}, then we may sort columns by #{mDataPro} #{sSortDir_0}"
	  conditions_arr = [] 
	  if sSearch.blank?
		conditions_arr << "true"
	  else
	    (0 ... column_count.to_i - 1).each do |cc|
		    #logger.info "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
		    conditions_arr << "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
		 end
	  end
	  orders = "#{mDataPro} #{sSortDir_0}"	
      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
	  condition = {:orders =>orders,:where=>conditions_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }
	  result = source.where(condition[:where]).order(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )
	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result }
  end


  def index

    @documents = Document.reorder('rand()').limit(50)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @documents }
    end
  end

  def filter_docs
	result = {:status => false,:message => ""}
	doc_id = params[:doc_id]
	org = params[:org]
    @document = Document.find_by_doc_id_and_org(doc_id,org)
	if @document.blank?
		result[:status] = true 
		result[:message] = "In system ,No found doc_id" + doc_id
	else
		result[:message] = "In system, Found doc_id" + doc_id
	end
    render json: result
  end

  #批量打印选项的打印功能
  def all_print_doc
    ignore_auth = false
    result = []
    result_error = []
    res_message = {}
    params[:doc_ids].each do |doc_id|
    @document = Document.find_by_doc_id(doc_id)
    if @document
      # check user's privileges
      if !ignore_auth
        if !current_user.can_view?(@document)
          res_message = { :status => 403, :message => t('doc.not_authorized') }
        end
        # Now check for user's org
        if @document.inquired &&  !(can? :inquired, Document)
          res_message = { :status => 403.1, :message => t('doc.not_authorized') }
        end
        if @document.checkedout &&  !(can? :checkedout, Document)
          res_message = { :status => 403.1, :message => t('doc.not_authorized') }
        end
      end

      if res_message == {}
          script_name = "#{ENV['HOME']}/bin/new_decrypt.sh #{doc_id}"
	  res = %x[ #{script_name} ]
	  if res.match(/No password/)
		res_message = { :status => 407, :message => 'No password' }
	  end
=begin
	  if res.match(/System busy/)
                res_message = { :status => 401, :message => 'The sysmte is busy. Try it later' }
          end
=end
          if res.match(/The requested document is not found/)
        	res_message = { :status => 400, :message => 'The document does not exist' }
          end
      end
      
      @folder = Folder.find(@document.folder_id)
      if res_message == {}
	result << "/docimages/" + doc_id + "/wm_" + doc_id + ".pdf"
	mds = ModifiedDocument.where(:doc_id => doc_id)
	unless mds.nil?
	  mds.each do |special_doc|

          # Now, find the folder_name
          folder = Folder.find(special_doc.folder_id)
          folder_id = folder.folder_id

          script_name = "#{ENV['HOME']}/bin/new_decrypt.sh #{folder_id} #{doc_id}"
          logger.info script_name
          res = %x[ #{script_name} ]

=begin
          if res.match(/System busy/)
             res_message = { :status => 400, :message => 'The sysmte is busy. Try it later' }
          end
=end
          if res.match(/The requested document is not found/)
              res_message = { :status => 400, :message => 'The document does not exist' }
          end
	  if res_message == {}
	      result << "/docimages_mod/" + folder_id + "_" + doc_id + "/wm_" + doc_id + ".pdf"
	  else
	      result_error << "册号为" + folder_id  + "单证" + doc_id  	
	  end
	  end
	end
      else
	#报错的单证
        result_error << "册号为" + @folder.folder_id  + "单证" + doc_id  	
      end
    end
    end unless params[:doc_ids].nil?
    logger.info "=============4"
    logger.info res_message
    logger.info "============" 
    logger.info result
    logger.info result_error
    render json: { :path=> result, :no_path => result_error}, :status => 200
  end
  #批量打印选项的查询功能
  def all_print
    doc_ids = params[:doc_ids]
    @documents = Document.where(:doc_id => doc_ids)

    ids = @documents.map { |x| x.doc_id }
    not_found_ids = doc_ids.reject{|x| ids.include? x}


    @documents.each { |d|
      if !current_user.can_view?(d)
        d.access_info = "denied"
      else
        d.access_info = "";
        if d.inquired && !current_user.can_inquire?
          d.access_info = "inquired"
        end
        if d.checkedout && !current_user.can_checkedout?
          d.access_info = "denied"
        end
      end
    }

    render json: { :results => @documents, :not_found => not_found_ids, :search_model => 'all_print'}, :status => 200
  end 

  def multi_query
    doc_ids = params[:doc_ids]
    @documents = Document.where(:doc_id => doc_ids)

    ids = @documents.map { |x| x.doc_id }
    not_found_ids = doc_ids.reject{|x| ids.include? x}

    @documents.each { |d|
      if !current_user.can_view?(d)
        d.access_info = "denied"
      else
        d.access_info = "";
        if d.inquired && !current_user.can_inquire?
          d.access_info = "inquired"
        end
		if d.checkedout && !current_user.can_checkedout?
          d.access_info = "denied"
        end
     end
    }
=begin
    qh = QueryHistory.create(:user_id=> current_user.id,
                             :doc_id => nil,
                             :bulkids => ids.join(" "),
                             :ip => current_user.current_sign_in_ip,
                             :email => current_user.display_name,
                             :print => false)
    qh.save
=end
    render json: { :results => @documents, :not_found => not_found_ids }, :status => 200
  end

#  def multi_query
#
#    find_documents_by_ids(true)
#
#    respond_to do |format|
#      format.html # index.html.erb                                    
#      format.json { render json: { :results => @documents }, :status => 200 }
#    end

    #respond_with(@documents)
#  end

  def do_filter_search
    filter=params[:filters]
    limitN=100
    if !params[:total].blank?
      limitN = params[:total].to_i
    end

	org_condition = {}
    if !params[:org].blank?
	  org_condition[:org] = params[:org] 
    end


    docids = DocumentPage.select('distinct(doc_id)').where(:paget => filter).reorder('rand()').limit(limitN).all
    docid_str = docids.collect { |d| d.doc_id }

    @documents = Document.where(:doc_id => docid_str).where('pages < 50').where(org_condition)
   render json: { :results => @documents }, :status => 200
  end

  def search_special_docs(doc_type)
    a = ModifiedDocument.select(:doc_id)
    if !doc_type.blank?
      a = a.where(:doc_type => doc_type)
    end

    if params[:isMod].blank?
      a = a.where(:mtype => 1)
    end
    if params[:isTax].blank?
      a = a.where(:mtype => 0)
    end

    return a
  end

  def search_docs
    if !params[:filters].blank? && !params[:filters].empty?
      self.do_filter_search
      return
    end

    doc_type = get_doc_type_search 
    if doc_type == 'NONE'
      render json: []
      return
    end
	where_condition = {} 
	sql_condition = []
	sql_condition = ['pages < 50']

    #@documents = Document.order(:doc_id).where('pages < 50')
    if (!params[:isMod].blank? || !params[:isTax].blank?)
      a = search_special_docs(doc_type)
      if a.empty?
        render json: []
        return
      end

      doc_ids = a.collect { |x| x.doc_id }
	  
	  where_condition[:doc_id] = doc_ids 
      #@documents = @documents.where(:doc_id => doc_ids)
    end

    if !doc_type.blank?
	  where_condition[:doc_type] = doc_type 
      #@documents = @documents.where(:doc_type => doc_type)
    end 

    if !params[:org].blank?
	  where_condition[:org] = params[:org] 
      #@documents = @documents.where(:org => params[:org])
    end

    if !params[:org_applied].blank?
	  where_condition[:org_applied] = params[:org_applied] 
      #@documents = @documents.where(:org_applied => params[:org_applied])
    end

    if !params[:edcStartDate].blank? && !params[:edcEndDate].blank?
      start_date = params[:edcStartDate]
      end_date = params[:edcEndDate]

	  where_condition[:edc_date] = start_date.to_date .. end_date.to_date.next 
      #@documents = @documents.where(:edc_date => start_date.to_date .. end_date.to_date.next)
    end

    if params[:docInquired] == '1'
	  where_condition[:inquired] = true 
      #@documents = @documents.where(:inquired => true)
    end

    if params[:checkedout] == '1'
	  where_condition[:checkedout] = true
      #@documents = @documents.where(:checkedout => true)
    end

    limitN=200
=begin
    u=Setting.find_by_name('maxn')
    if u
      limitN = u.value.to_i;
    end
=end

    if !params[:total].blank?
      limitN = params[:total].to_i
    end

	sql_condition << "rand_weight < #{rand()}"
	@documents = Document.where(where_condition).where(sql_condition.join(" AND ")).reorder("rand_weight desc").limit(limitN)

=begin	
	count = Document.where(where_condition).where(sql_condition).count
	limit = 2000 
	offset = count - limit  
	if offset < limit 
		@documents =  Document.where(where_condition).where(sql_condition).sample(limitN)
    else
		@documents =  Document.where(where_condition).where(sql_condition).limit(limit).offset(rand(offset)).sample(limitN)
    end 
=end
	logger.info "============"
#	logger.info @documents 
    respond_to do |format|
      format.html # index.html.erb                                                                                              
      format.json { render json: { :results => @documents },
        :status => 200 }    
    end
  end

  def print_doc
    @print_doc_url = params[:doc_id]

    if !params[:mod].blank?
      @print_doc_url = @print_doc_url + "&mod=1"
    end
    
    t = params[:doc_type]

    if (t == 'print')
      render "print_doc"
    else
      render "court_doc"
    end
  end

  def api_query
    doc_id = params[:doc_id]
    query_doc_internal(true)
  end

  def junk
    @document = Document.find_by_doc_id(doc_id)

    if @document
      #uri = URI.parse("http://127.0.0.1:8090/" + params[:doc_id])
      #else
      #  uri = URI.parse("http://127.0.0.1:8090/" + params[:doc_id])
      
      h = Net::HTTP.start('127.0.0.1', 8090, { :read_timeout => 240 })
      res = h.get("/#{doc_id}")


      if res.body.match(/The requested document is not found/)
        raise ActiveRecord::RecordNotFound
      end
      response = JSON.parse(res.body)
    else
      raise ActiveRecord::RecordNotFound
    end

    #  TODO(weidong): error processing.
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: { :doc_info => @document,
          :image_info => response } }
    end
  end

  def query
    doc_id = params[:doc_id]
    query_doc_internal(false)
  end

  def query_doc_internal(ignore_auth)
    doc_id = params[:doc_id]
    special_doc_info = ""

    @document = Document.find_by_doc_id(doc_id)
    if @document

      # check user's privileges
      if !ignore_auth
        if !current_user.can_view?(@document)
          render json: { :status => :error, :message => t('doc.not_authorized') }, :status => 403 
          return
        end
        # Now check for user's org
        if @document.inquired &&  !(can? :inquired, Document)
          render json: { :status => :error, :message => t('doc.not_authorized') }, :status => 403.1 
          return
        end
		if @document.checkedout &&  !(can? :checkedout, Document)
          render json: { :status => :error, :message => t('doc.not_authorized') }, :status => 403.1 
          return
        end
     end



      script_name = "#{ENV['HOME']}/bin/new_decrypt.sh #{doc_id}"

		logger.info "====1=======" 
		logger.info script_name 
      res = %x[ #{script_name} ]

      if res.match(/No password/)
        render json: { :status => :error, :message => 'No password' }, :status => 407 
        return
      end

      if res.match(/System busy/)
        render json: { :status => :error, :message => 'The sysmte is busy. Try it later' }, :status => 401 
        return
      end

      if res.match(/The requested document is not found/)
        render json: { :status => :error, :message => 'The document does not exist' }, :status => 400 
        return
      end

		logger.info "====2=======" 
		logger.info res
      response = JSON.parse(res)
      s_doc = ModifiedDocument.find_by_doc_id(doc_id)
      if !s_doc.nil?
        special_doc_info = s_doc
      end

      if !ignore_auth
        # Create query_history record.
        #response = { :name => 'test', 'info' => 'good' }
=begin
        qh = QueryHistory.create(:user_id=> current_user.id,
                                 :doc_id => @document.doc_id,
                                 :org => @document.org,
                                 :doc_type => @document.doc_type,
                                 :ip => current_user.current_sign_in_ip,
                                 :email => current_user.display_name,
                                 :print => false)
=end
      end

      @folder = Folder.find(@document.folder_id) unless @document.folder_id.nil?
    else
      raise ActiveRecord::RecordNotFound
    end

    # Needs to find out all comments.
    comments = DocComment.where({:doc_id => doc_id, :code => 1, :state => 0})
    comments = comments.where(:folder_id => @folder.folder_id) unless @folder.nil?
    #  TODO(weidong): error processing.
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: { :doc_info => @document,
          :directory => "/docimages",
          :label => doc_id,
	  :folder_id => (@folder.nil? ? "" : @folder.folder_id),
          :comments => comments,
          :special_doc_info => special_doc_info,
          :image_info => response } }
    end
  end

  # GET /documents/1
  # GET /documents/1.json
  def show
    @document = Qdoc.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @document }
    end
  end

  # GET /documents/new
  # GET /documents/new.json
  def new
    @document = Document.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @document }
    end
  end

  # GET /documents/1/edit
  def edit
    @document = Document.find(params[:id])
  end


  

  def inquire
    # check that the documents are in valid state.

    if (!check_document_state)
      return
    end

    find_documents_by_ids(false)

    if @documents.empty?
      raise ActiveRecord::RecordNotFound
    end

    if params[:caction] == 'add'
      caction = 'add inquiry'
    else
      caction = 'remove inquiry'
    end

    dh = []
	docs = []
    @documents.each { |d| 
      d.inquired = (params[:caction] == 'add')
      #dh.push(add_history(d, caction))
      d.save
	  docs.push(d)
    }

    respond_to do |format|
      format.html { redirect_to document_url }
      format.json { render json: { :dh_info => dh, :docs => docs} }
    end 

  end

  def checkout

    if (!check_document_state)
      return
    end


    find_documents_by_ids(false)
    if @documents.empty?
      raise ActiveRecord::RecordNotFound
    end

    if params[:caction] == 'checkout'
      caction = 'document checkout'
    else
      caction = 'document return'
    end
    
    dh = []
	docs = []
    @documents.each { |d| 
      d.checkedout = (params[:caction] == 'checkout')
      #dh.push(add_history(d, caction))
      d.save
	  docs.push(d)
    }

    respond_to do |format|
      format.html { redirect_to document_url }
      format.json { render json: { :dh_info => dh, :docs => docs} }
    end 


  end

  # POST /documents
  # POST /documents.json
  def create
    @document = Document.new(params[:document])
    @document_old = Document.find_by_doc_id(@document.doc_id)
    unless @document_old.nil?
	@document.id = @document_old.id
    end
    @document.inquired = false
    @document.checkedout = false
    @document.rand_weight = rand()

    ds = params[:source]
    src = 0

    if !ds.blank?
      source = Source.find_by_code(ds)
      if !source.nil?
        src = source.id
      end
    end

    if @document.doc_type == 'JC5Y'
      @document.doc_type = 'JK5Y'
    end

    if @document.doc_type == 'JC3Y'
      @document.doc_type = 'JK3Y'
    end

    
    if @document.doc_type == 'CC5Y' 
      @document.doc_type = 'CK5Y'
    end

    if @document.doc_type == 'CC3Y'
      @document.doc_type = 'CK3Y'
    end

    @document.doc_source = src 
    # Set phase
    if @document.phase.nil?
      @document.phase = 0
    end
	
    respond_to do |format|
      if @document.save
		  a = Document.find_by_sql("select * from documents where id=#{@document.id} and datediff(created_at,edc_date) >=60")
		  if a.length > 0 
			@document.doc_flag = 1
			@document.save
		  end
		  dsn = @document.serial_number
		  if !dsn.nil? && dsn[0,1].upcase == "B"  
		      begin
		      rd = RequisitionDetail.find_by_single_card_number_and_is_check(@document.doc_id,0)  
		      if rd
		          rd.status = 1
			  rd.save
			  re = Requisition.where(["id = ? and status < 30 and status not in (20,1)" ,rd.requisition_id]).first
			  stats_arr = re.requisition_details.where(:is_check => 0).collect(&:status).uniq
			  if stats_arr.length == 1 && stats_arr[0] == 1
				re.status = 1
				re.save
			  end
		      end
		      rescue => e
		          logger.info "found error for updating requisition table"
			  logger.info e 
		      end
		  end
		
        format.html { redirect_to @document, notice: 'Document was successfully created.' }
        format.json { render json: @document, status: :created, location: @document }
      else
        format.html { render action: "new" }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /documents/1
  # PUT /documents/1.json
  def update
    @document = Document.find(params[:id])

    respond_to do |format|
      if @document.update_attributes(params[:document])
        format.html { redirect_to @document, notice: 'Document was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /documents/1
  # DELETE /documents/1.json
  def destroy
    @document = Document.find(params[:id])
    @document.destroy

    respond_to do |format|
      format.html { redirect_to documents_url }
      format.json { head :no_content }
    end
  end

  def print_old
    dir = params[:tmp_folder]
    doc_id = params[:doc_id]
    @document = Document.find_by_doc_id(doc_id)
    if @document.nil?
      raise ActiveRecord::RecordNotFound
    end

    add_history(@document, 'print')
    if dir
      filepath = "#{Rails.root}/files/#{dir}/wm_#{doc_id}.pdf" 
      send_file(filepath, :filename => "wm_#{doc_id}.pdf", :type => "application/pdf")
    else
      if (params[:mod].blank?)
        filepath = "#{Rails.root}/files/#{doc_id}/wm_#{doc_id}.pdf" 
      else
        filepath = "#{Rails.root}/public/docimages_mod/#{doc_id}/wm_#{doc_id}.pdf" 
      end
      send_file(filepath, :filename => "wm_#{doc_id}.pdf", :type => "application/pdf")
    end
  end

  def print
	logger.info("===============1")
    doc_id = params[:doc_id]
    folder_id = params[:folder_id] || 0
    @document = Document.find_by_doc_id(doc_id)

	logger.info("===============2")
    if @document.nil?
      raise ActiveRecord::RecordNotFound
    end

	logger.info("===============3")
    #    add_history(@document, 'testify')
    dir='docimages'
    if !params[:mod].blank?
      dir='docimages_mod'
    end
    pages = ""
    if !params[:pages].blank?
      page_selections = params[:pages].split(',')
      pages=page_selections.join(' ')
    end

	logger.info("===============4")
    script_name = "#{ENV['HOME']}/bin/print_doc_with_watermark.sh #{doc_id} #{folder_id} #{dir} \"#{pages}\""
	logger.info("==============doc/print?doc=")
	logger.info(script_name)
    pdf_file = %x[ #{script_name} ]

    if pdf_file == 'NONE'
      raise ActiveRecord::RecordNotFound
    end

    #logger.info("pdf_file is " + pdf_file)
    send_file(pdf_file, :filename => File.basename(pdf_file), :type => "application/pdf")
  end


  def testify
    doc_id = params[:doc_id]
    @document = Document.find_by_doc_id(doc_id)

    if @document.nil?
      raise ActiveRecord::RecordNotFound
    end

#    add_history(@document, 'testify')
    dir='docimages'
    if !params[:mod].blank?
      dir='docimages_mod'
    end
    pages = ""
    if !params[:pages].blank?
      page_selections = params[:pages].split(',')
      pages=page_selections.join(' ')
    end
    script_name = "#{ENV['HOME']}/bin/new_print_doc.sh #{doc_id} #{dir} \"#{pages}\""

    pdf_file = %x[ #{script_name} ]

    if pdf_file == 'NONE'
      raise ActiveRecord::RecordNotFound
    end

    send_file(pdf_file, :filename => File.basename(pdf_file), :type => "application/pdf")
  end

  def list_doc_sources
    ds = Source.where('code like "ESH%"')
    render json: ds, :status => 200
  end

  def by_doc_source
    doc_type = get_doc_type
    if doc_type == 'NONE'
      render json: []
      return
    end

    ids = Source.where('code like "ESH%"').order("code").collect(&:id)

    # check the source first.
    source = params[:source]
    if source == '0'
      @documents = Document.where(:doc_source => ids).order("doc_source")
    else
      @documents = Document.where(:doc_source => source).order("doc_source")
    end

    if !doc_type.blank?
      @documents = @documents.where(:doc_type => doc_type).order("doc_type")
    end 

    if !params[:from_date].blank? && !params[:to_date].blank?
      start_date = params[:from_date]
      end_date = params[:to_date]

      if start_date != end_date
        # @documents = @documents.where(:edc_date => start_date.to_date..end_date.to_date)
        @documents = @documents.where(:edc_date => start_date.to_date..end_date.to_date).order("edc_date")
      end
    end
	render json:  filter_proc(@documents , params)
	
	#render json: { :results => @documents , :totals => @documents.length}, :status => 200
    #render json: { :results => @documents[0,1000] , :totals => @documents.length}, :status => 200
  end

  def stats_export
    if params[:org_applied].blank?
      @documents = Document.where(:phase => 1).order("edc_date desc")
    else
      @documents = Document.where({:org => params[:org_applied], :phase => 1}).order("edc_date desc")
    end
    render json: filter_proc_page(@documents), :status => 200
  end

  private
  # If the boolean flag is true, then also checks to make sure the user is able
  # to inquire.
  def find_documents_by_ids(check_for_inquired)
    doc_ids = params[:doc_ids]
    if doc_ids.kind_of?(Array)
      @documents = Document.where(:doc_id => doc_ids)
    else
      arr = doc_ids.split(%r{['\s+,']})
      arr.reject!{|item| item.empty? }

      if arr.nil? || arr.empty?
        @documents = []
      else
        @documents = Document.where(:doc_id => arr)
      end
    end

    if @documents.empty?
      raise ActiveRecord::RecordNotFound
    end

    if (check_for_inquired)
      @documents = @documents.keep_if { |d| 
		current_user.can_view?(d) && (!d.inquired || (can? :inquire, Document) && (!d.checkedout || (can? :checkedout ,Document)))
      }
    else
      @documents = @documents.keep_if {
        |d| current_user.can_view?(d)
      }
    end
  end
  # return true if the user is authorized
  # For advanced search. 
  def get_doc_type_search
    doc_type = params[:docType]
	if doc_type.blank?
		dt = ""
	else
    dt = ['JK3Y', 'JK5Y', 'JK11', 'CK3Y', 'CK5Y']
      
    dt = dt.select{ |v| v=~/#{doc_type}/} 
   
    if dt.empty? 
      return "NONE"
    end
	end
    return dt
  end



  # return true if the user is authorized
  # For advanced search. 
  def get_doc_type
    doc_type = params[:docType]

    years = params[:years]
    if years.blank? && doc_type.blank?
       return ""
    end

    dt = ['JK3Y', 'JK5Y', 'JK11', 'CK3Y', 'CK5Y']
      
    dt = dt.select{ |v| v=~/#{doc_type}/} 
   
    dt = dt.select{ |v| v=~/#{years}/}

    if dt.empty?
      return "NONE"
    end

    return dt
  end

  def add_history(d, action)
    tmp_time = Time.now
    dh = DocumentHistory.where(:action =>  t('doc.' + action),
                                :user_id=> current_user.id,
                                :org => d.org,
                                :doc_id => d.doc_id,
                                :ip => current_user.current_sign_in_ip,
                                :email => current_user.display_name,
								:created_at => ((tmp_time-10).to_s .. (tmp_time).to_s)).first;

    if dh.nil? || dh.blank?
        dh = DocumentHistory.create(:action =>  t('doc.' + action),
                                :user_id=> current_user.id,
								:org => d.org,
                                :doc_id => d.doc_id,
                                :ip => current_user.current_sign_in_ip,
                                :email => current_user.display_name)
    end 
    return dh
  end

  # for inquire.
  def check_document_state
    
    doc_ids = params[:doc_ids]
    @documents = Document.where(:doc_id => doc_ids)

    ids = @documents.map { |x| x.doc_id }
    not_found_ids = doc_ids.reject{|x| ids.include? x}

    if (!not_found_ids.empty?)
      render json: { :status => 400, :message => '以下单证不存在：' + not_found_ids.join(", ") }
      return false
    end

    # Now check the valid current state.
    caction = params[:caction]


    if caction && caction == 'add'
      b = @documents.select { |x|
        x.inquired == true
      }

      if (!b.empty?)
        bids = b.collect { |d| d.doc_id }
        render json: { :status => 400, :message => '以下单证已经有涉案标记：' + bids.join(", ") }
        return false
      end
    end
    if caction && caction == 'remove'
      b = @documents.select { |x|
        x.inquired == false
      }

      if (!b.empty?)
        bids = b.collect { |d| d.doc_id }
        render json: { :status => 400, :message => '以下单证没有涉案标记：' + bids.join(", ") }
        return false
      end
    end


    if caction && caction == 'checkout'
      b = @documents.select { |x|
        x.checkedout == true
      }

      if (!b.empty?)
        bids = b.collect { |d| d.doc_id }
        render json: { :status => 400, :message => '以下单证已经被借出：' + bids.join(", ") }
        return false
      end
    end

    if caction && caction == 'checkin'
      b = @documents.select { |x|
        x.checkedout == false
      }

      if (!b.empty?)
        bids = b.collect { |d| d.doc_id }
        render json: { :status => 400, :message => '以下单证没有借出标记：' + bids.join(", ") }
        return false
      end
    end



    return true
  end

  def filter_proc_page(source) 
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

      current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
      logger.info "=======0=#{orders}"	

	  condition = {:orders =>orders,:where=>condition_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }

      logger.info "=======1=#{condition[:orders]}"	
	  result = source.where(condition[:where]).reorder(condition[:orders]).paginate(:page => condition[:page], :per_page => condition[:per_page] )

	  return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result}
  end


end
