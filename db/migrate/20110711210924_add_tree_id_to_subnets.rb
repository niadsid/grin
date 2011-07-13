class AddTreeIdToSubnets < ActiveRecord::Migration
  def self.up
    add_column :subnets, :tree_id, :string
  end

  def self.down
    remove_column :subnets, :tree_id
  end
end
