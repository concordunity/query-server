class CreateWebLinks < ActiveRecord::Migration
  def change
    create_table :web_links do |t|
      t.string :name
      t.text :description
      t.string :menu1
      t.string :menu2
      t.string :controller
      t.string :action

      t.timestamps
    end
    add_index :web_links, :name, :unique => true
  end
end
