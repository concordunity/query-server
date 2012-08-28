class CreateImportMostTimeOrgDocInfos < ActiveRecord::Migration
  def change
    create_table :import_most_time_org_doc_infos do |t|
      t.string :declarations_number
      t.string :mode_transport
      t.datetime :release_time
      t.datetime :accept_declaration_time
      t.float :overall_operating_hours_hours
      t.string :declaration_customs_code
      t.string :declaration_customs

      t.timestamps
    end
  end
end
