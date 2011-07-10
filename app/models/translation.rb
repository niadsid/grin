class Translation < ActiveRecord::Base
  attr_accessible :address_id, :source_port, :destination_address, :destination_port
  
  belongs_to :address
end
