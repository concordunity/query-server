class ChangeColumnSingleCardNumberToRequisitionDetails < ActiveRecord::Migration
  def up
    remove_index :requisition_details, :single_card_number
    add_index :requisition_details, :single_card_number
  end

  def down
    add_index :requisition_details, :single_card_number, :unique => true
  end
end
