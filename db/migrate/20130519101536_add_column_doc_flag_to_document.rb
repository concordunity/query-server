class AddColumnDocFlagToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :doc_flag, :integer, :default => 0

  end
end
