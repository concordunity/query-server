class CreateRequisitions < ActiveRecord::Migration
  def change
    create_table :requisitions do |t|
      t.string :apply_staff, :null => false
      t.datetime :date_application
      t.string :department_name
      t.integer :tel
      t.string :approving_officer
      t.datetime :approval_time
      t.string :registration_staff
      t.datetime :check_in_timei
      t.string :write_off_staff
      t.datetime :write_off_time
      t.string :termination_instructions
      t.integer :status, :default => 1
      t.integer :org

      t.timestamps
    end
	
    add_index :requisitions, :org
    add_index :requisitions, :apply_staff
  end
end
