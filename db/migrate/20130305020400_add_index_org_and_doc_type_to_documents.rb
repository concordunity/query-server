class AddIndexOrgAndDocTypeToDocuments < ActiveRecord::Migration
  def change
    add_index :documents, :org
    add_index :documents, :doc_type
  end
end
