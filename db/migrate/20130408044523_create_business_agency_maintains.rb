class CreateBusinessAgencyMaintains < ActiveRecord::Migration
  def change
    create_table :business_agency_maintains do |t|
      t.string :org
      t.string :org_name 
      t.string :name

      t.timestamps
    end
  end
end
