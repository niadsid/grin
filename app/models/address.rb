class Address < ActiveRecord::Base
  attr_accessible :network_address, :mask_length, :description, :address_type, :subnet_id, :sytem, :interface 
  
  belongs_to :subnet
  has_many :translations

  def friendly_descriptor
    self.network_address + "/" + self.mask_length.to_s + " (" + self.interface + self.system + ")"
  end
 
  def location_name
    self.subnet.site.network.network_name + " - " + self.subnet.site.site_name
  end
 
  def system_names
    system_names = Array.new
    not_system_names = ["vrrp", "hsrp", "glbp", "cluster", "and", "ip", "&amp;", "vlan", "svi"]
    
    # Rules to figure out which bits of text are system names
    self.system.split.each do |i|
      # First make sure this is not the name of an interface
      if i[/^[vV][rR][rR][pP]$|^[hH][sS][rR][pP]$|^[gG][lL][bB][pP]$|^[a-zA-Z0-9\-]+?\/[a-zA-Z0-9\-\/\/.]+?$|^[eE][tT]?[hH]?[0-9]+?$|^[lL][oO]?[0-9]+?$|^[vV][lL][aA][nN][0-9]+?$|^[sSbB][vV][iI][0-9]+?$/]
        candidate = ""
      elsif i.include? "."
        candidate = i[/^([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\./].to_s.chop
      elsif (i.include? "," or i.include? ":" or i.include? ";")
        candidate = i[/^([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])[\,:;]/].to_s.chop
      elsif !not_system_names.include?(i.downcase)
        candidate = i[/^[a-zA-Z0-9]?[a-zA-Z0-9\-_]+?[a-zA-Z0-9]+?$/].to_s
      else
        candidate = ""
      end
      if !candidate.empty?
          system_names.push(candidate)
      end
    end    
    return system_names
  end

  def system_interfaces
    
    system_interfaces = Array.new
    
    # Rules to figure out which bits of text are system interface names
    self.system.split.each do |i|
      # This long regex contains frequently used interface patterns  
      candidate = i[/^[vV][rR][rR][pP]$|^[hH][sS][rR][pP]$|^[gG][lL][bB][pP]$|^[a-zA-Z0-9\-]+?\/[a-zA-Z0-9\-\/\/.]+?$|^[eE][tT]?[hH]?[0-9]+?$|^[lL][oO]?[0-9]+?$|^[vV][lL][aA][nN][0-9]+?$|^[sSbB][vV][iI][0-9]+?$/].to_s
      if !candidate.empty?
        system_interfaces.push(candidate)
      end
    end    
    return system_interfaces
  end

end
