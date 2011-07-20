xml.instruct! :xml, :version=>"1.0"

xml.tag!("rows") do
	sorted_subnets = @subnets.sort_by { |i| i.subnet_identifier.downcase }
	sorted_subnets.each do |subnet|
        xml.tag!("row",{ "id" => subnet.id }) do
            xml.tag!("cell", subnet.subnet_identifier)
			xml.tag!("cell", subnet.mask_length)
			xml.tag!("cell", subnet.display_name)
			xml.tag!("cell", subnet.subnet_name)
			xml.tag!("cell", subnet.default_router)
            xml.tag!("cell", subnet.description)
			xml.tag!("cell", subnet.site.site_name)
			xml.tag!("cell", subnet.site.network.network_name)
        end
    end
end
