class AddColumnToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :doc_source, :integer
    add_column :documents, :phase, :integer
  end
end
