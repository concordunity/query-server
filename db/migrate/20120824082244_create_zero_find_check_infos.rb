class CreateZeroFindCheckInfos < ActiveRecord::Migration
  def change
    create_table :zero_find_check_infos do |t|
      t.string :business_units_number
      t.string :operating_name
      t.integer :number_import_export_declarations
      t.integer :number_import_export_inspection
      t.float :import_export_inspection_rate
      t.string :declarations_number
      t.string :import_export
      t.string :examination_handling_results
      t.string :declaration_customs
      t.datetime :date_value

      t.timestamps
    end
  end
end
