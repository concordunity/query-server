class AddColumnRandWeightToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :rand_weight, :float, :null => false
    add_index :documents, :rand_weight, :default=> 0

  end
end
