class CreateNormalImportPriceLessRecords < ActiveRecord::Migration
  def change
    create_table :normal_import_price_less_records do |t|
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

      t.timestamps
    end
  end
end
