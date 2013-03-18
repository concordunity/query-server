class AddColumnsToRequisition < ActiveRecord::Migration
  def change
	add_column :requisitions, :serial_number, :string 
	add_column :requisitions, :two_approvers, :string 
	add_column :requisitions, :two_approver_time, :datetime
	add_column :requisitions, :application_originally, :integer

  end
end
