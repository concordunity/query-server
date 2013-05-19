class AddColumnPagesSavedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :pages_saved, :integer, :default => 0

  end
end
