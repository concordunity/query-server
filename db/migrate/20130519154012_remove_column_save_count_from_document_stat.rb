class RemoveColumnSaveCountFromDocumentStat < ActiveRecord::Migration
  def up
    remove_column :document_stats, :save_count
      end

  def down
    add_column :document_stats, :save_count, :string
  end
end
