class CreateDocGroups < ActiveRecord::Migration
  def change
    create_table :doc_groups do |t|
      t.string :name
      t.references :user

      t.timestamps
    end
    add_index :doc_groups, :name, :unique => true
    add_index :doc_groups, :user_id
  end
end
