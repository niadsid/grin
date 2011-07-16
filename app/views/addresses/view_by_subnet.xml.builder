xml.instruct! :xml, :version=>"1.0"

xml.tag!("rows") do
    sorted_addresses = @addresses.sort_by { |i| i.network_address.downcase }
	sorted_addresses.each do |address|
        xml.tag!("row",{ "id" => address.id }) do
			xml.tag!("cell", address.network_address)
            xml.tag!("cell", address.mask_length)
			xml.tag!("cell", address.system)
			xml.tag!("cell", address.url)
            xml.tag!("cell", address.description)
        end
    end
end
