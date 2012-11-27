class CreateMonitoringData < ActiveRecord::Migration
  def change
    create_table :monitoring_data do |t|
      t.string :host
      t.string :varname
      t.integer :ts
      t.float :value
      t.string :labels

      t.timestamps
    end
    add_index :monitoring_data, :host
    add_index :monitoring_data, :varname
  end
end
