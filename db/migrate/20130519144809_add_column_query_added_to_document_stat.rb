class AddColumnQueryAddedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :query_added, :integer, :default => 0

  end
end
