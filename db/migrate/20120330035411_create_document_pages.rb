class CreateDocumentPages < ActiveRecord::Migration
  def change
    create_table :document_pages do |t|
      t.string :doc_id
      t.string :paget
      t.string :org
      t.integer :doc_type
      t.integer :year

      t.timestamps
    end

    add_index(:document_pages, [:doc_id, :paget], :unique => true)
  end
end
