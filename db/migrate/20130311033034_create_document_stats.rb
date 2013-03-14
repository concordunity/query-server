class CreateDocumentStats < ActiveRecord::Migration
  def change
    create_table :document_stats do |t|
      t.integer :year
      t.integer :month
      t.string :org
      t.string :doc_type
      t.integer :docs
      t.integer :pages
      t.integer :queries
      t.decimal :percent_q, :precision => 6, :scale => 4
      t.date :created_date

      t.timestamps
    end
	add_index :document_stats, :org
    add_index :document_stats, :year
    add_index :document_stats, :month
 end
end
