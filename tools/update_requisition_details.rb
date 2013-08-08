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

  def update_status
      rs = Requisition.where(:status => 14)
      rs.each do |rr|
	tag = false
	rr.requisition_details.each do |re|
	  if re.is_check == 1
	      tag = true 
	  end
        end
	if tag == true && rr.status != 1
	    rr.status = 1
	    rr.save	
	end
      end
  end

end
UpdateRequisitionDetail.new.update_status
