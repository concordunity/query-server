class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.string :doc_id
      t.integer :pages
      t.references :folder
      t.string :doc_type
      t.string :org
      t.string :org_applied
      t.boolean :modified
      t.boolean :checkedout, :default => false
      t.boolean :inquired, :default => false
      t.string :label
      t.string :serial_number
      t.date :edc_date

      t.timestamps
    end
    add_index :documents, :doc_id, :unique => true
    add_index :documents, :folder_id
  end
end
