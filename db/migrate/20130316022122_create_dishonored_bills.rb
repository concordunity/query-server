class CreateDishonoredBills < ActiveRecord::Migration
  def change
    create_table :dishonored_bills do |t|
      t.string :org, :null => false
      t.integer :db_status, :null => false, :default => 0
      t.datetime :db_date,:null => false
      t.string :reason
      t.string :explain

      t.timestamps
    end

	add_index :dishonored_bills, :org
	add_index :dishonored_bills, :db_status
	add_index :dishonored_bills, :db_date

  end
end
