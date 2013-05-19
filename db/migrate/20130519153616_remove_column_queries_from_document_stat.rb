class RemoveColumnQueriesFromDocumentStat < ActiveRecord::Migration
  def up
    remove_column :document_stats, :queries
      end

  def down
    add_column :document_stats, :queries, :string
  end
end
