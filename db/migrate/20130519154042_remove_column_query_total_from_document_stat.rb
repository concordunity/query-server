class RemoveColumnQueryTotalFromDocumentStat < ActiveRecord::Migration
  def up
    remove_column :document_stats, :query_total
      end

  def down
    add_column :document_stats, :query_total, :string
  end
end
