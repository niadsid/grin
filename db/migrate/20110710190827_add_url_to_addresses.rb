class AddUrlToAddresses < ActiveRecord::Migration
  def self.up
    add_column :addresses, :url, :string
  end

  def self.down
    remove_column :addresses, :url
  end
end
