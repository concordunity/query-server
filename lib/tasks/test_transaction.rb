class A 
	a = "i don't know "
	Requisition.transaction do 
		begin
			p "=====1"
			Requisition.create(:apply_staff => "zhouzhen",:org => 2225)
			p "=====2"
			Requisition.create(:org => 2225)
			p "=====3"
			a = "yes ,success"
		rescue => ex
			p ex
			a = "no, failure"
			p "====error"
			raise ActiveRecord::Rollback, ex.message	
		end
	
	end
	p a

end
