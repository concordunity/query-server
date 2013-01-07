class AddColumnToSysLogs < ActiveRecord::Migration
  def change
    add_column :sys_logs, :user_name, :string

    add_column :sys_logs, :role_name, :string

  end
end
