class CreateDocComments < ActiveRecord::Migration
  def change
    create_table :doc_comments do |t|
      t.string :doc_id
      t.integer :page
      t.integer :code
      t.integer :subcode
      t.string :commenter
      t.string :info

      t.timestamps
    end
    add_index :doc_comments, :doc_id
    add_index :doc_comments, :code

  end
end
