class AddColumnDocsSavedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :docs_saved, :integer, :default => 0

  end
end
