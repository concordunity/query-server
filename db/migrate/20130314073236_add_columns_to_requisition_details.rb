class AddColumnsToRequisitionDetails < ActiveRecord::Migration
  def change
	add_column :requisition_details, :rationale_single_number, :string
  end
end
