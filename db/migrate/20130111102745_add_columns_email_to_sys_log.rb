class AddColumnsEmailToSysLog < ActiveRecord::Migration
  def change
    add_column :sys_logs, :email, :string

  end
end
