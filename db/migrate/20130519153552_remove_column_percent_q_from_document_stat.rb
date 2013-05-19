class RemoveColumnPercentQFromDocumentStat < ActiveRecord::Migration
  def up
    remove_column :document_stats, :percent_q
      end

  def down
    add_column :document_stats, :percent_q, :string
  end
end
