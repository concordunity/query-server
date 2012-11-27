class CreateDocGroupEntries < ActiveRecord::Migration
  def change
    create_table :doc_group_entries do |t|
      t.string :doc_id
      t.references :doc_group

      t.timestamps
    end
    add_index :doc_group_entries, :doc_group_id
  end
end
