class AddColumnStorageSitesToRequisition < ActiveRecord::Migration
  def change
    add_column :requisitions, :storage_sites, :string

  end
end
