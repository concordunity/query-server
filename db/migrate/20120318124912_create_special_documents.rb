class CreateSpecialDocuments < ActiveRecord::Migration
  def change
    create_table :special_documents do |t|
      t.string :doc_id
      t.integer :pages
      t.references :folder
      t.string :doc_type
      t.string :label
      t.string :serial_number
      t.date   :edc_date
      t.timestamps
    end
    add_index :special_documents, :folder_id
  end
end
