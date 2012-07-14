class AddIndexToRole < ActiveRecord::Migration
  def change

    remove_index(:roles, :name)

    add_index(:roles, :name, :unique => true)
  end
end
