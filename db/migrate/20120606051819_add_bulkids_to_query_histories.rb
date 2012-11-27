class AddBulkidsToQueryHistories < ActiveRecord::Migration
  def change
    add_column(:query_histories, :bulkids, :text)
    add_index(:query_histories, :doc_id)
  end
end
