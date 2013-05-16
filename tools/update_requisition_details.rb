class UpdateRequisitionDetail

  def update
	  result = Requisition.all
	  update_data(result) unless result.blank?
  end

  def update_data(data)
	  data.each do |r|
		  r.requisition_details.each do |rs|
			rs.status = r.status 
			rs.save
		  end
	  end
  end
end
UpdateRequisitionDetail.new.update
