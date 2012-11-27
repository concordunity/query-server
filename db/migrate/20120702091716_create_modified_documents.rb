class CreateModifiedDocuments < ActiveRecord::Migration
  def change
    create_table :modified_documents do |t|
      t.string :doc_id
      t.integer :pages
      t.references :folder
      t.integer :phase
      t.string :doc_type
      t.string :org
      t.string :org_applied
      t.string :label
      t.string :serial_number
      t.date :edc_date
      t.integer :mtype

      t.timestamps
    end
    add_index :modified_documents, :folder_id
  end
end
