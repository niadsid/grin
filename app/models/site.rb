class Site < ActiveRecord::Base
  attr_accessible :site_name, :network_id
  
  belongs_to :network
  has_many :subnets
  
    
  # Produces a formatted list of a site's subnets
  def member_subnets
    member_subnets = Array.new
    self.subnets.each do |i|
      member_subnets.push(i.subnet_name + " (" + i.subnet_identifier + "/" + i.mask_length + ")")
    end
    member_subnets.join("<br>")
  end
end
