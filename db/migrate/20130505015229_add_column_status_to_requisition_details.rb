class AddColumnStatusToRequisitionDetails < ActiveRecord::Migration
  def change
    add_column :requisition_details, :status, :integer, :default => 0, :null => false

  end
end
