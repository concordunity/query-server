class AddColumnRoleStatusAndUsernameAndRolenameToQueryAndDocumentHistory < ActiveRecord::Migration
  def change
    add_column :query_histories, :user_name, :string

    add_column :query_histories, :role_name, :string

    add_column :query_histories, :status, :boolean

    add_column :document_histories, :user_name, :string

    add_column :document_histories, :role_name, :string

    add_column :document_histories, :status, :boolean

  end
end
