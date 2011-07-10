class CreateTranslations < ActiveRecord::Migration
  def self.up
    create_table :translations do |t|
      t.integer :address_id
      t.integer :source_port
      t.string :destination_address
      t.integer :destination_port

      t.timestamps
    end
  end

  def self.down
    drop_table :translations
  end
end
