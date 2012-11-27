# -*- coding: utf-8 -*-
class DocumentHistories  < ActiveRecord::Base

	DocumentHistories.all.each do |item|
	    @doc = Document.find_by_doc_id(item.doc_id)
	    if @doc
	      item.org = @doc.org
	      item.save
	    end
	end
end

