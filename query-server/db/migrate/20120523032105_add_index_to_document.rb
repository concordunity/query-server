class AddIndexToDocument < ActiveRecord::Migration
  def change
    add_index :documents, :doc_source
    add_index :documents, :phase

  end
end
