class CreateTemporaryImports < ActiveRecord::Migration
  def change
    create_table :temporary_imports do |t|
      t.string :declarations_number
      t.string :mode_transport
      t.datetime :release_time
      t.datetime :accept_declaration_time
      t.float :overall_operating_hours_hours
      t.string :declaration_customs_code
      t.string :declaration_customs
      t.boolean :exists_in_system, :default => false
      t.string :org_applied

      t.timestamps
    end
    add_index :temporary_imports, :declarations_number, :unique => true
  end
end
