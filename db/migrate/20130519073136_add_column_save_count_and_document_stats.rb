class AddColumnSaveCountAndDocumentStats < ActiveRecord::Migration
  def up
	add_column :document_stats, :save_count, :integer, :default => 0
  end

  def down
	remove_column :document_stats, :save_count
  end
end
