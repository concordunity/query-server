class AddColumnQuerySavedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :query_saved, :integer, :default => 0

  end
end
