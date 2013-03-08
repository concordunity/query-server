class AddIndexTsToMonitoringData < ActiveRecord::Migration
  def change
    add_index :monitoring_data, :ts

  end
end
