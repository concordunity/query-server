class AddColumnNewColumnToHighRisk < ActiveRecord::Migration
  def change
    add_column :high_risks, :business_units_encoding, :string

    add_column :high_risks, :name_business_units, :string

    add_column :high_risks, :product_name, :string

  end
end
