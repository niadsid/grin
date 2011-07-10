class Network < ActiveRecord::Base
  attr_accessible :network_name
  
  has_many :sites
  
  # Produces a formatted list of a network's sites
  def member_sites
    member_sites = Array.new
    self.sites.each do |i|
      member_sites.push(i.site_name)
    end
    member_sites.join("<br>")
  end
end
