class AddColumnMenuOneAndMenuTwoToWebLink < ActiveRecord::Migration
  def change
    add_column :web_links, :menu_one, :integer, :default => 0

    add_column :web_links, :menu_two, :integer, :default => 0

  end
end
