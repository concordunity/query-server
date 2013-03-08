class AddIndexDatatimeToDocuments < ActiveRecord::Migration
  def change
    add_index :documents, :created_at
    add_index :documents, :edc_date
  end
end
