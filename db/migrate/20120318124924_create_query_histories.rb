class CreateQueryHistories < ActiveRecord::Migration
  def change
    create_table :query_histories do |t|
      t.references :user
      t.string :doc_id
      t.string :org
      t.string :doc_type
      t.string :ip
      t.string :username
      t.boolean :print

      t.timestamps
    end
    add_index :query_histories, :user_id
  end
end
