class AddColumnFolderIdToDocComments < ActiveRecord::Migration
  def change
    add_column :doc_comments, :folder_id, :string

  end
end
