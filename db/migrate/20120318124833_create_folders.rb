class CreateFolders < ActiveRecord::Migration
  def change
    create_table :folders do |t|
      t.string :folder_id
      t.string :doc_type
      t.string :org
      t.string :box
      t.string :serial_number
      t.date :edc_date

      t.timestamps
    end
    add_index :folders, :folder_id, :unique => true
  end
end
