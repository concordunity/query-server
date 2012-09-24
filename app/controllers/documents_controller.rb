# -*- coding: utf-8 -*-

require 'net/http'
require 'uri'

class DocumentsController < ApplicationController
  skip_before_filter :api_query
  load_and_authorize_resource
  skip_authorize_resource :only => :api_query

  # GET /documents
  # GET /documents.json

  respond_to :html, :json
  def index
    @documents = Document.reorder('rand()').limit(50)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @documents }
    end
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
      end
    }

    qh = QueryHistory.create(:user_id=> current_user.id,
                             :doc_id => nil,
                             :bulkids => ids.join(" "),
                             :ip => current_user.current_sign_in_ip,
                             :email => current_user.display_name,
                             :print => false)
    qh.save
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

    docids = DocumentPage.select('distinct(doc_id)').where(:paget => filter).reorder('rand()').limit(limitN).all

    docid_str = docids.collect { |d| d.doc_id }

    @documents = Document.where(:doc_id => docid_str).where('pages < 50')
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

    doc_type = get_doc_type 
    if doc_type == 'NONE'
      render json: []
      return
    end

    @documents = Document.order(:doc_id).where('pages < 50')
    if (!params[:isMod].blank? || !params[:isTax].blank?)
      a = search_special_docs(doc_type)
      if a.empty?
        render json: []
        return
      end

      doc_ids = a.collect { |x| x.doc_id }
      @documents = @documents.where(:doc_id => doc_ids)
    end

    if !doc_type.blank?
      @documents = @documents.where(:doc_type => doc_type)
    end 

    if !params[:org].blank?
      @documents = @documents.where(:org => params[:org])
    end

    if !params[:org_applied].blank?
      @documents = @documents.where(:org_applied => params[:org_applied])
    end

    if !params[:edcStartDate].blank? && !params[:edcEndDate].blank?
      start_date = params[:edcStartDate]
      end_date = params[:edcEndDate]

      # @documents = @documents.where(:edc_date => start_date.to_date..end_date.to_date)
      @documents = @documents.where(:edc_date => start_date.to_date .. end_date.to_date.next)
    end

    if params[:docInquired] == '1'
      @documents = @documents.where(:inquired => true)
    end

    if params[:checkedout] == '1'
      @documents = @documents.where(:checkedout => true)
    end

    limitN=200

    u=Setting.find_by_name('maxn')
    if u
      limitN = u.value.to_i;
    end


    if !params[:total].blank?
      limitN = params[:total].to_i
    end

    @documents = @documents.reorder('rand()').limit(limitN) #,  :order => "rand()")

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
    special_doc_info = ""

    @document = Document.find_by_doc_id(doc_id)
    if @document

      # check user's privileges
      if !current_user.can_view?(@document)
        render json: { :status => :error, :message => t('doc.not_authorized') }, :status => 403 
        return
      end
      # Now check for user's org
      if @document.inquired &&  !(can? :inquired, Document)
        render json: { :status => :error, :message => t('doc.not_authorized') }, :status => 403 
        return
      end



      script_name = "#{ENV['HOME']}/bin/new_decrypt.sh #{doc_id}"

      res = %x[ #{script_name} ]

      if res.match(/System busy/)
        render json: { :status => :error, :message => 'The sysmte is busy. Try it later' }, :status => 400 
        return
      end

      if res.match(/The requested document is not found/)
        render json: { :status => :error, :message => 'The document does not exist' }, :status => 400 
        return
      end

      response = JSON.parse(res)

      s_doc = ModifiedDocument.find_by_doc_id(doc_id)
      if !s_doc.nil?
        special_doc_info = s_doc
      end

      # Create query_history record.
      #response = { :name => 'test', 'info' => 'good' }
      qh = QueryHistory.create(:user_id=> current_user.id,
                               :doc_id => @document.doc_id,
                               :org => @document.org,
                               :doc_type => @document.doc_type,
                               :ip => current_user.current_sign_in_ip,
                               :email => current_user.display_name,
                               :print => false)
    else
      raise ActiveRecord::RecordNotFound
    end

    #  TODO(weidong): error processing.
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: { :doc_info => @document,
          :directory => "/docimages",
          :label => doc_id,
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
    @documents.each { |d| 
      d.inquired = (params[:caction] == 'add')
      dh.push(add_history(d, caction))
      d.save
    }

    respond_to do |format|
      format.html { redirect_to document_url }
      format.json { render json: { :dh_info => dh } }
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
    @documents.each { |d| 
      d.checkedout = (params[:caction] == 'checkout')
      dh.push(add_history(d, caction))
      d.save
    }

    respond_to do |format|
      format.html { redirect_to document_url }
      format.json { render json: { :dh_info => dh } }
    end 


  end

  # POST /documents
  # POST /documents.json
  def create
    @document = Document.new(params[:document])
    @document.inquired = false
    @document.checkedout = false

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

    @document.doc_source = src 
    # Set phase
    if @document.phase.nil?
      @document.phase = 0
    end

    respond_to do |format|
      if @document.save
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
    script_name = "#{ENV['HOME']}/bin/print_doc_with_watermark.sh #{doc_id} #{dir} \"#{pages}\""

    pdf_file = %x[ #{script_name} ]

    if pdf_file == 'NONE'
      raise ActiveRecord::RecordNotFound
    end

    logger.info("pdf_file is " + pdf_file)
    send_file(pdf_file, :filename => File.basename(pdf_file), :type => "application/pdf")
  end


  def testify
    doc_id = params[:doc_id]
    @document = Document.find_by_doc_id(doc_id)

    if @document.nil?
      raise ActiveRecord::RecordNotFound
    end

    add_history(@document, 'testify')
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

    ids = Source.select(:id).where('code like "ESH%"').collect { |s| s.id}

    # check the source first.
    source = params[:source]
    if source == '0'
      @documents = Document.where(:doc_source => ids)
    else
      @documents = Document.where(:doc_source => source)
    end

    if !doc_type.blank?
      @documents = @documents.where(:doc_type => doc_type)
    end 

    if !params[:from_date].blank? && !params[:to_date].blank?
      start_date = params[:from_date]
      end_date = params[:to_date]

      if start_date != end_date
        # @documents = @documents.where(:edc_date => start_date.to_date..end_date.to_date)
        @documents = @documents.where(:edc_date => start_date.to_date..end_date.to_date)
      end
    end

    render json: { :results => @documents }, :status => 200
  end

  def stats_export
    if params[:org_applied].blank?
      @documents = Document.where(:phase => 1).order("edc_date desc")
    else
      @documents = Document.where({:org_applied => params[:org_applied], :phase => 1}).order("edc_date desc")
    end
    render json: { :results => @documents }, :status => 200
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
      @documents = @documents.keep_if {
        |d| current_user.can_view?(d) && (!d.inquired || (can? :inquire, Document))
      }
    else
      @documents = @documents.keep_if {
        |d| current_user.can_view?(d)
      }
    end
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
    dh = DocumentHistory.create(:action =>  t('doc.' + action),
                                :user_id=> current_user.id,
                                :doc_id => d.doc_id,
                                :ip => current_user.current_sign_in_ip,
                                :email => current_user.display_name)
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
end
