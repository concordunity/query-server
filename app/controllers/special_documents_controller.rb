# -*- coding: utf-8 -*-

require 'net/http'
require 'uri'


class SpecialDocumentsController < ApplicationController
  load_and_authorize_resource
  
  # GET /special_documents
  # GET /special_documents.json
  def index
    @special_documents = SpecialDocument.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @special_documents }
    end
  end

  def query
    doc_id = params[:doc_id]

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

      @special_doc = SpecialDocument.find_by_doc_id(doc_id)
      if !@special_doc
        raise ActiveRecord::RecordNotFound
      end

      # Now, find the folder_name
      folder = Folder.find(@special_doc.folder_id)
      folder_id = folder.folder_id


      #uri = URI.parse("http://127.0.0.1:8090/" + params[:doc_id])
      #else
      #  uri = URI.parse("http://127.0.0.1:8090/" + params[:doc_id])
      h = Net::HTTP.start('127.0.0.1', 8090, { :read_timeout => 240 })
      #res = h.get("/#{folder_id}/#{doc_id}")
      res = h.get("/#{folder_id}/222520121250176875");
      if res.body.match(/The requested document is not found/)
        render json: { :status => :error, :message => 'Python 2 Error' }, :status => 400 
        return #raise ActiveRecord::RecordNotFound
      end

      response = JSON.parse(res.body)

      # Create query_history record.
      #response = { :name => 'test', 'info' => 'good' }
    else
      raise ActiveRecord::RecordNotFound
    end

    #  TODO(weidong): error processing.
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: { :doc_info => @special_doc,
          :directory => "/docimages_mod",
          :label => "删改单",
          :image_info => response } }
    end
  end


  # GET /special_documents/1
  # GET /special_documents/1.json
  def show
    @special_document = SpecialDocument.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @special_document }
    end
  end

  # GET /special_documents/new
  # GET /special_documents/new.json
  def new
    @special_document = SpecialDocument.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @special_document }
    end
  end

  # GET /special_documents/1/edit
  def edit
    @special_document = SpecialDocument.find(params[:id])
  end

  # POST /special_documents
  # POST /special_documents.json
  def create
    @special_document = SpecialDocument.new(params[:special_document])

    respond_to do |format|
      if @special_document.save
        format.html { redirect_to @special_document, notice: 'Special document was successfully created.' }
        format.json { render json: @special_document, status: :created, location: @special_document }
      else
        format.html { render action: "new" }
        format.json { render json: @special_document.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /special_documents/1
  # PUT /special_documents/1.json
  def update
    @special_document = SpecialDocument.find(params[:id])

    respond_to do |format|
      if @special_document.update_attributes(params[:special_document])
        format.html { redirect_to @special_document, notice: 'Special document was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @special_document.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /special_documents/1
  # DELETE /special_documents/1.json
  def destroy
    @special_document = SpecialDocument.find(params[:id])
    @special_document.destroy

    respond_to do |format|
      format.html { redirect_to special_documents_url }
      format.json { head :no_content }
    end
  end
end
