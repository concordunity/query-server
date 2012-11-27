class AddColumnToSearchSomeCondition < ActiveRecord::Migration
  def up 
    add_column :import_most_time_org_doc_infos,:org_applied,:string
    add_column :import_most_time_org_doc_infos,:exists_in_system,:boolean, :default => false


    add_column :normal_import_price_less_records,:org_applied,:string
    add_column :normal_import_price_less_records,:exists_in_system,:boolean, :default => false

    add_column :zero_find_check_infos,:org_applied,:string
    add_column :zero_find_check_infos,:exists_in_system,:boolean, :default => false
  end

  def down
    remove_column :import_most_time_org_doc_infos,:org_applied
    remove_column :import_most_time_org_doc_infos,:exists_in_system

    remove_column :normal_import_price_less_records,:org_applied
    remove_column :normal_import_price_less_records,:exists_in_system

    remove_column :zero_find_check_infos,:org_applied
    remove_column :zero_find_check_infos,:exists_in_system


  end
end
