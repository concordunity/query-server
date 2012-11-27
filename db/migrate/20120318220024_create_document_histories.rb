class CreateDocumentHistories < ActiveRecord::Migration
  def change
    create_table :document_histories do |t|
      t.string :doc_id
      t.string :action
      t.string :username
      t.string :ip
      t.integer :user_id

      t.timestamps
    end
  end
end
