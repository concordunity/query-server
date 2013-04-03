class AddColumnIrFullnameToInterchangeReceipt < ActiveRecord::Migration
  def change
    add_column :interchange_receipts, :ir_fullname, :string

  end
end
