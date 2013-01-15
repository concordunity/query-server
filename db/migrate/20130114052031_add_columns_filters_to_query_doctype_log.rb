class AddColumnsFiltersToQueryDoctypeLog < ActiveRecord::Migration
  def change
    add_column :query_doctype_logs, :filters, :integer

  end
end
