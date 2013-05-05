class CreateHighRisks < ActiveRecord::Migration
  def change
    create_table :high_risks do |t|
      t.date :hr_date
      t.string :business_point
      t.string :subjection_org
      t.string :number_customs
      t.string :org
      t.integer :commodity_number
      t.string :product_number
      t.decimal :unit_price, :precision => 30, :scale => 15
      t.decimal :spatial_index_impact, :precision => 30, :scale => 15
      t.decimal :actual_reference_price, :precision => 30, :scale => 15
      t.boolean :exists_in_system
	  t.integer :table_type

      t.timestamps
    end
	add_index :high_risks, :hr_date
	add_index :high_risks, :org
	add_index :high_risks, :subjection_org
	add_index :high_risks, :table_type
  end
end
