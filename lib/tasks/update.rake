# -*- coding: utf-8 -*-
namespace :update do

  desc "update for document_page"
  task :update_folder_id_for_page => :environment do
	count = 0
        Document.order("doc_id desc").each_with_index do |doc,index|
            DocumentPage.where(:doc_id => doc.doc_id.to_s).each_with_index do |item,j|
	      count += 1
	      p " 第#{ count }条记录 == 册号：#{doc.folder_id} ==="
              item.folder_id = doc.folder_id
              item.save
	    end
        end
  end
              
  desc "update for document_history"
  task :update_org_for_history => :environment do
        DocumentHistory.order("doc_id desc ").each_with_index do |item,index|
            @doc = Document.find_by_doc_id(item.doc_id.to_s)
            #@doc = Document.where(:doc_id =>item.doc_id.to_s).first
            if @doc
	      p "第#{index}条记录 == 关区号：#{@doc.org} ==="
              item.org = @doc.org
              item.save
            end
        end
  end
end
