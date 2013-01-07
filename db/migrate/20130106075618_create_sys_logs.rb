class CreateSysLogs < ActiveRecord::Migration
  def change
    create_table :sys_logs do |t|
      t.integer :user_id
      t.integer :role_id
      t.string :action
      t.string :describe

      t.timestamps
    end
  end
end
