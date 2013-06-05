class CreateGroupOrgs < ActiveRecord::Migration
  def change
    create_table :group_orgs do |t|
      t.string :group_id
      t.string :subjection_org
      t.string :name

      t.timestamps
    end
  end
end
