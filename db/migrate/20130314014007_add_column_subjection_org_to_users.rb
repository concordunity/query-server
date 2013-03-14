class AddColumnSubjectionOrgToUsers < ActiveRecord::Migration
  def change
    add_column :users, :subjection_org, :string,:null => false, :default => ""
    add_index :users,  :subjection_org
  end
end
