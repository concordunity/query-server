class ChangeColumnApplicationOriginallyToRequisition < ActiveRecord::Migration
  def up
	change_column :requisitions, :application_originally, :string
  end

  def down
	change_column :requisitions, :application_originally, :integer
  end
end
