class AddPhaseToSpecialDocuments < ActiveRecord::Migration
  def change
    add_column :special_documents, :phase, :integer

  end
end
