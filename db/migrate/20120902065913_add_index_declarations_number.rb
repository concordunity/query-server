class AddIndexDeclarationsNumber < ActiveRecord::Migration
  def up
    add_index :zero_find_check_infos, :declarations_number, :unique => true
    add_index :normal_import_price_less_records, :declarations_number, :unique => true
    add_index :import_most_time_org_doc_infos, :declarations_number, :unique => true
  end

  def down
  end
end
