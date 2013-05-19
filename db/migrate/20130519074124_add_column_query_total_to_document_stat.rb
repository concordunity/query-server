class AddColumnQueryTotalToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :query_total, :integer, :default => 0

  end
end
