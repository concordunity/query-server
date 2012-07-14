class AddEmailToQueryHistories < ActiveRecord::Migration
  def change
    add_column :query_histories, :email, :string

  end
end
