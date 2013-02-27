class CreateRequisitionDetails < ActiveRecord::Migration
  def change
    create_table :requisition_details do |t|
      t.references :requisition, :null => false
      t.string :single_card_number, :null => false
      t.string :modify_accompanying_documents
      t.integer :where_page
      t.string :lent_reasons

      t.timestamps
    end
	
    add_index :requisition_details, :single_card_number, :unique => true
    add_index :requisition_details, :requisition_id
  end
end
