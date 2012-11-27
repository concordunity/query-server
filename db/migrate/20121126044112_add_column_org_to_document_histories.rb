class AddColumnOrgToDocumentHistories < ActiveRecord::Migration
  def change
    add_column :document_histories, :org, :string

  end
end
