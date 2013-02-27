class CreateOrgForDocs < ActiveRecord::Migration
  def change
    create_table :org_for_docs do |t|
      t.string :org_number, :null=> false
      t.string :org_name
      t.string :org

      t.timestamps
    end
  end
end
