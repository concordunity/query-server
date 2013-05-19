class AddColumnDocsAddedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :docs_added, :integer ,:default => 0

  end
end
