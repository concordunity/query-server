class AddColumnDocFlagToQueryHistory < ActiveRecord::Migration
  def change
    add_column :query_histories, :doc_flag, :integer, :default => 0

  end
end
