class AddTreeIdToNetworks < ActiveRecord::Migration
  def self.up
    add_column :networks, :tree_id, :string
  end

  def self.down
    remove_column :networks, :tree_id
  end
end
