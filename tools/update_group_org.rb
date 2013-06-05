class UpdateGroupOrg

  def update
	  result = OrgInfo.group("org").order("org") 
	  update_data(result) unless result.blank?
  end

  def update_data(data)
	  data.each_with_index do |r,index|
	  	  result = OrgInfo.where(:org => r.org)
		  result.each do |oi|
		    unless GroupOrg.find_by_subjection_org(oi.subjection_org)
			di = DictionaryInfo.find_by_dic_type_and_dic_num("org",oi.subjection_org)
	 	  	GroupOrg.create(:group_id => index,:subjection_org => oi.subjection_org, :name => di.dic_name)
		    end
		  end
	  end
  end
end
UpdateGroupOrg.new.update
