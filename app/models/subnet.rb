class Subnet < ActiveRecord::Base
  attr_accessible :subnet_name, :subnet_identifier, :mask_length, :default_router, :description, :site_id
  
  belongs_to :site
  has_many :addresses

  def friendly_descriptor
    self.display_name + ' (' + self.subnet_identifier + '/' + self.mask_length + ')'
  end
  
  def location_name
    self.site.network.network_name + " - " + self.site.site_name
  end
  
  def subnet_identifier_with_mask
    self.subnet_identifier + '/' + self.mask_length
  end
end
