class AddFolderIdToDocumentPages < ActiveRecord::Migration
  def change
    add_column :document_pages, :folder_id, :integer
    add_index :document_pages,:folder_id
  end
end
