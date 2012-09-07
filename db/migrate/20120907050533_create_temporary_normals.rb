class CreateTemporaryNormals < ActiveRecord::Migration
  def change
    create_table :temporary_normals do |t|
      t.datetime :date_value
      t.string :declarations_number
      t.string :product_code
      t.integer :product_number
      t.integer :dollar_value
      t.integer :first_legal_quantity
      t.float :price
      t.float :actual_price_cap
      t.float :actual_price_floor
      t.float :national_average_price
      t.boolean :exists_in_system, :default => false
      t.string :org_applied

      t.timestamps
    end
    add_index :temporary_normals, :declarations_number, :unique => true
  end
end
