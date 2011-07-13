class AddTreeIdToSites < ActiveRecord::Migration
  def self.up
    add_column :sites, :tree_id, :string
  end

  def self.down
    remove_column :sites, :tree_id
  end
end
