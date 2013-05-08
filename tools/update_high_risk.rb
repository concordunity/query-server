class UpdateHighRisk

  def update
      result = NormalImportPriceLessRecord.where(:exists_in_system => false)
	  update_data(result)
	  result = ZeroFindCheckInfo.where(:exists_in_system => false)
	  update_data(result)
	  result = ImportMostTimeOrgDocInfo.where(:exists_in_system => false)
	  update_data(result)
	  result = HighRisk.where(:exists_in_system => false)
	  update_data(result,"number_customs")
  end

  def update_data(data,type=nil)
	  data.each do |r|
		if type == "number_customs"
			doc_id = r.number_customs 
		else
			doc_id = r.declarations_number 
		end
		doc = Document.find_by_doc_id(doc_id)
		if doc
			r.exists_in_system = true
			r.save
		end
	  end
  end
end
UpdateHighRisk.new.update
