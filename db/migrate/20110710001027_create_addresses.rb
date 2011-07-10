class CreateAddresses < ActiveRecord::Migration
  def self.up
    create_table :addresses do |t|
      t.string :network_address
      t.integer :mask_length
      t.string :description
      t.string :address_type
      t.integer :subnet_id
      t.string :interface
      t.string :system

      t.timestamps
    end
  end

  def self.down
    drop_table :addresses
  end
end
