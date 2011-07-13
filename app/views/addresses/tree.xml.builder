xml.instruct! :xml, :version=>"1.0"

xml.tree("id" => "0") do
	xml.item("text" => "All IP Addresses", "open"=> "1", "id" => "root 0", "im0" => "folderClosed.gif", "im1" => "folderOpen.gif", "im2" => "folderClosed.gif", "tooltip" => "one") do
		sorted_networks = @networks.sort_by { |i| i.network_name.downcase }
		sorted_networks.each do |network|
			xml.item("text" => network.network_name, "open"=> "1", "id" => network.tree_id, "im0" => "folderClosed.gif", "im1" => "folderOpen.gif", "im2" => "folderClosed.gif", "tooltip" => network.network_name) do
				sorted_sites = network.sites.sort_by { |i| i.site_name.downcase }
				sorted_sites.each do |site|
					xml.item("text" => site.site_name, "id" => site.tree_id, "im0" => "folderClosed.gif", "im1" => "folderOpen.gif", "im2" => "folderClosed.gif", "tooltip" => site.site_name) do
						sorted_subnets = site.subnets.sort_by { |i| i.subnet_identifier.downcase }
						sorted_subnets.each do |subnet|
							xml.item("text" => subnet.friendly_descriptor, "id" => subnet.tree_id, "im0" => "folderClosed.gif", "im1" => "folderOpen.gif", "im2" => "folderClosed.gif", "tooltip" => subnet.subnet_name)
						end
					end
				end
			end
		end
	end
end