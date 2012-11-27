class RolifyCreateRoles < ActiveRecord::Migration
  def change
    create_table(:roles) do |t|
      t.string :name
      t.string :display_name
      t.text :description
      t.references :resource, :polymorphic => true

      t.timestamps
    end

    create_table(:users_roles, :id => false) do |t|
      t.references :user
      t.references :role
    end

    create_table :roles_web_links, :id => false do |t|
      t.references :role
      t.references :web_link
    end

    add_index(:roles, :name)
    add_index(:roles, [ :name, :resource_type, :resource_id ])
    add_index(:users_roles, [ :user_id, :role_id ])
    add_index(:roles_web_links, [ :role_id, :web_link_id ])
  end
end
