class CreateInterchangeReceipts < ActiveRecord::Migration
  def change
    create_table :interchange_receipts do |t|
      t.string :org, :null => false
      t.datetime :ir_date, :null => false
      t.string :ir_username, :null => false
      t.string :serial_number
      t.string :doc_type
      t.string :doc_start
      t.string :doc_end
      t.integer :number_copies
      t.integer :package
      t.datetime :accept_date
      t.integer :ir_status

      t.timestamps
    end

	add_index :interchange_receipts, :org
	add_index :interchange_receipts, :ir_date
	add_index :interchange_receipts, :ir_username

  end
end
