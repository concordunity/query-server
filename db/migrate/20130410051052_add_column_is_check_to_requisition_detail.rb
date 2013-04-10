class AddColumnIsCheckToRequisitionDetail < ActiveRecord::Migration
  def change
    add_column :requisition_details, :is_check, :boolean ,:null => false , :default => true

  end
end
