# -*- coding: utf-8 -*-
namespace :update_data do

  desc "update_data for document_page"
  task :update_folder_id_for_page => :environment do
    DocumentPage.all.each do |item|
            @doc = Document.where(:doc_id => item.doc_id).first
            if @doc
	      logger.info @doc.folder_id
              item.folder_id = @doc.folder_id
              item.save
            end
        end
  end
              
  desc "update_data for document_history"
  task :update_org_for_history => :environment do
        DocumentHistories.all.each do |item|
            @doc = Document.where(:doc_id =>item.doc_id).first
            if @doc
	      logger.info @doc.org
              item.org = @doc.org
              item.save
            end
        end
  end
end
