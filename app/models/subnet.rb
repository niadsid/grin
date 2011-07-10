class Subnet < ActiveRecord::Base
  attr_accessible :subnet_name, :subnet_identifier, :mask_length, :default_router, :description, :site_id
  
  belongs_to :site
  has_many :addresses

  def friendly_descriptor
    self.subnet_name + ' (' + self.subnet_identifier + '/' + self.mask_length + ')'
  end
end
