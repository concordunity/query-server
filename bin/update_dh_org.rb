# -*- coding: utf-8 -*-
class DocumentHistories  < ActiveRecord::Base

	DocumentHistories.all.each do |item|
	    @doc = Document.where(:doc_id =>item.doc_id).first
	    if @doc
	      item.org = @doc.org
	      item.save
	    end
	end
  end

class DocumentPage< ActiveRecord::Base
    DocumentPage.all.each do |item|
            @doc = Document.where(:doc_id => item.doc_id).first
            if @doc
              item.folder_id = @doc.folder_id
              item.save
            end
        end
  end

