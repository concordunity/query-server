class AddColumnToQueryHistoryAndDocumentHistory < ActiveRecord::Migration
  def change
	add_column :query_histories, :role_id, :integer
	add_column :query_histories, :action , :string
	add_column :query_histories, :describe, :string
	add_column :document_histories, :role_id, :integer
	add_column :document_histories, :describe, :string
	add_column :document_histories, :doc_type, :string

  end
end
