class CreateSources < ActiveRecord::Migration
  def change
    create_table :sources do |t|
      t.string :code
      t.string :name

      t.timestamps
    end
    add_index :sources, :code, :unique => true
  end
end
