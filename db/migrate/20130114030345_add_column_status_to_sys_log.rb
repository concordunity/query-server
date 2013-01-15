class AddColumnStatusToSysLog < ActiveRecord::Migration
  def change
    add_column :sys_logs, :status, :boolean

  end
end
