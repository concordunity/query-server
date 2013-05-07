class AddColumnCountNumberToZeroFindCheckInfos < ActiveRecord::Migration
  def change
    add_column :zero_find_check_infos, :count_number, :integer

  end
end
