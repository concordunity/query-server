class AddColumnQueryToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :query, :integer, :default => 0

  end
end
