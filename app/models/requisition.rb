class Requisition < ActiveRecord::Base
	has_many :requisition_details
end
