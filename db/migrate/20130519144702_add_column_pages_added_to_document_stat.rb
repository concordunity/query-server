class AddColumnPagesAddedToDocumentStat < ActiveRecord::Migration
  def change
    add_column :document_stats, :pages_added, :integer,:default =>0

  end
end
