class CreateOrgInfos < ActiveRecord::Migration
  def change
    create_table :org_infos do |t|
      t.string :org
      t.string :subjection_org
      t.integer :dictionary_info_id

      t.timestamps
    end

	add_index :org_infos, :dictionary_info_id
	add_index :org_infos, :subjection_org, :unique => true
  end
end
