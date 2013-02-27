class AddColumnTypeNameToRequisitions < ActiveRecord::Migration
  def change
	add_column :requisitions, :apply_staff_fullname, :string
	add_column :requisitions, :approving_officer_fullname, :string
	add_column :requisitions, :registration_staff_fullname, :string
	add_column :requisitions, :write_off_staff_fullname, :string
  end
end
