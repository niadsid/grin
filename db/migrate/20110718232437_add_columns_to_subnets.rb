class AddColumnsToSubnets < ActiveRecord::Migration
  def self.up
    add_column :subnets, :display_name, :string
  end

  def self.down
    remove_column :subnets, :display_name
  end
end
