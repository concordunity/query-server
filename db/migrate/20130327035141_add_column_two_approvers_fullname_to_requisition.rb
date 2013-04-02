class AddColumnTwoApproversFullnameToRequisition < ActiveRecord::Migration
  def change
    add_column :requisitions, :two_approvers_fullname, :string

  end
end
