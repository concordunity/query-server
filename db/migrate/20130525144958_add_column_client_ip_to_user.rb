class AddColumnClientIpToUser < ActiveRecord::Migration
  def change
    add_column :users, :client_ip, :string

  end
end
