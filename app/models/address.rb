class Address < ActiveRecord::Base
  attr_accessible :network_address, :mask_length, :description, :address_type, :subnet_id, :sytem, :interface 
  
  belongs_to :subnet
  has_many :translations

  def friendly_descriptor
    self.network_address + "/" + self.mask_length.to_s + " (" + self.interface + self.system + ")"
  end
end
