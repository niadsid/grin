class CreateSubnets < ActiveRecord::Migration
  def self.up
    create_table :subnets do |t|
      t.string :subnet_name
      t.string :subnet_identifier
      t.string :mask_length
      t.string :default_router
      t.string :description
      t.integer :site_id

      t.timestamps
    end
  end

  def self.down
    drop_table :subnets
  end
end
