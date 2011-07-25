class AddressesController < ApplicationController
  require 'csv'

  def clear_database
    Address.delete_all
    Subnet.delete_all
    Site.delete_all
    Network.delete_all
    
    redirect_to :back
  end 
  
  def import_csv 

    CSV.foreach("/home/dev/Dropbox/Run/Development/Grin/"+params[:filename], :headers => true) do |row|

      if !Network.first(:conditions => { :network_name => row[0] }).nil?
        network_id = Network.first(:conditions => { :network_name => row[0] }).id
      else
        network_id = 0
      end

      if network_id.zero?
#       This network doesn't exist: create it
        network = Network.new
        network.network_name  = row[0]
        network.tree_id       = "network 1" + Random.rand(999999999).to_s
        network.save!
        
        network_id = network.id
        site_id = 0
      else
        if !Site.first(:conditions => { :site_name => row[1], :network_id => network_id }).nil?
          site_id = Site.first(:conditions => { :site_name => row[1], :network_id => network_id }).id
        else
          site_id=0
        end
      end

      if site_id.zero?
#       create new site
        site                  = Site.new
        site.network_id       = network_id
        site.site_name        = row[1]
        site.tree_id          = "site 1" + Random.rand(999999999).to_s
        site.save!
  
        site_id = site.id
        subnet_id = 0
      else
        if !Subnet.first(:conditions => { :subnet_name => row[2], :site_id => site_id }).nil?
          subnet_id = Subnet.first(:conditions => { :subnet_name => row[2], :site_id => site_id }).id
        else
          subnet_id = 0
        end
      end

      if subnet_id.zero?
#       create new subnet
        subnet = Subnet.new
        subnet.site_id            = site_id
        subnet.display_name       = row[2]
        subnet.subnet_identifier  = row[3]
        subnet.mask_length        = row[4]
        subnet.subnet_name        = row[5]
        subnet.default_router     = row[6]
        subnet.description        = row[7]
        subnet.tree_id            = "subnet 1" + Random.rand(999999999).to_s
        subnet.save!
        
        subnet_id = subnet.id
      end

      if Address.first(:conditions => { :network_address => row[8], :subnet_id => subnet_id }).nil?
        address=Address.new
        address.subnet_id       = subnet_id
        address.network_address = row[8]
        address.mask_length     = row[9]
        address.address_type    = row[10]
        address.system          = row[11]
        address.interface       = row[12]
        address.url             = row[13]
        address.description     = row[14]
        address.save!
      end
    end
    flash.now[:message]="CSV Import Successful, new records added to data base"
  end

  def export_csv
    tree_id       = params[:id]
    
    if (tree_id.split[0] == 'root')
      @addresses = Address.all
      filename = "#{Time.now.strftime("%Y%m%d")} Grin database backup.csv"
    elsif (tree_id.split[0] == 'network')
      network_id = Network.first(:conditions => { :tree_id => tree_id }).id
      @addresses = Address.where(:subnet_id => Subnet.where(:site_id => Site.where(:network_id => network_id)))
      filename = "#{Time.now.strftime("%Y%m%d")} " + Network.find(network_id).network_name + ".csv"
    elsif (tree_id.split[0] == 'site')
      site_id       = Site.first(:conditions => { :tree_id => params[:id] }).id
      @addresses = Address.where(:subnet_id => Subnet.where(:site_id => site_id))
      filename = "#{Time.now.strftime("%Y%m%d")} " + Site.find(site_id).site_name + ".csv"
    elsif (tree_id.split[0] == 'subnet')
      subnet_id     = Subnet.first(:conditions => { :tree_id => params[:id] }).id
      @addresses = Address.where(:subnet_id => subnet_id)
      filename = "#{Time.now.strftime("%Y%m%d")} " + Subnet.find(subnet_id).display_name + ".csv"
    end

    csv_string = CSV.generate do |csv|
      csv << ["Network Name",
              "Site Name",
              "Subnet Display Name",
              "Subnet Identifier",
              "Subnet Mask Length",
              "Subnet Name",
              "Subnet Default Router",
              "Subnet Description",
              "Network Address",
              "Mask Length",
              "Address Type",
              "System",
              "Interface",
              "url",
              "Description"]
      @addresses.each do |address|  
        csv <<  [address.subnet.site.network.network_name,
            address.subnet.site.site_name,
            address.subnet.display_name,
            address.subnet.subnet_identifier,
            address.subnet.mask_length,
            address.subnet.subnet_name,
            address.subnet.default_router,
            address.subnet.description,
            address.network_address,
            address.mask_length,
            address.address_type,
            address.system,
            address.interface,
            address.url,
            address.description]
      end
    end

    send_data csv_string, :type => "text/plain",
        :filename => filename,
        :disposition => 'attachment'
    redirect_to root path
  end
  
  
  # GET /addresses/tree.xml
  def tree
    @networks = Network.all
  end

  # GET /addresses/dbaction_tree.xml
  def dbaction_tree
    # Paramaters supplied by dhtmlx tree dataProcessor
    # when a node changes. 
    #   tr_id - node id;
    #   tr_order - node sequense on the level;
    #   tr_pid - parent id;
    #   tr_text - node text(label);
    #   Userdata blocks - are passed with their names.
    #     !nativeeditor_status - values can be as follows:
    #     “inserted” - item is inserted;
    #     “deleted” - item is deleted;
    #     “updated” or item doesn't exist - item is updated.
 
    node_name     = params["tr_text"]
    tree_id       = params["tr_id"]
    
    @mode         = params["!nativeeditor_status"]
    @id           = params["tr_id"]
    @parent_id    = params["tr_pid"]

    case @mode
      when "inserted"
        # if we are creating a new network (tr_pid == "root"), insert the network 
        # otherwise we must be creating a site, so insert a site
        if (tree_id.split[0] == 'network')
          network = Network.new
          network.network_name  = node_name
          network.tree_id       = tree_id
          network.save!
    
          @tid = @id # This could also be used to set @tid to the new item's .id
        elsif (tree_id.split[0] == 'site')
          site                  = Site.new
          site.network_id       = Network.first(:conditions => { :tree_id => @parent_id }).id
          site.site_name        = node_name
          site.tree_id          = tree_id
          site.save!
    
          @tid = @id # This could also be used to set @tid to the new item's .id
        else
          # Error handler here
        end
    when "deleted"
      if (tree_id.split[0] == 'network')
          # network=Network.find(@id)
          network=Network.first(:conditions => { :tree_id => @id })
          network.destroy
        
          @tid = @id
      elsif (tree_id.split[0] == 'site')
          # site=Site.find(@id)
          site=Site.first(:conditions => { :tree_id => @id })
          site.destroy
          
          @tid = @id
      elsif (tree_id.split[0] == 'subnet')
          # subnet=Subnet.find(@id)
          subnet=Subnet.first(:conditions => { :tree_id => @id })
          subnet.destroy
        
          @tid = @id
      end
    when "updated"
        if (tree_id.split[0] == 'network')
          # network=Network.find(@id)
          network=Network.first(:conditions => { :tree_id => @id })
          network.network_name  = node_name
          network.tree_id       = tree_id
          network.save!
    
          @tid = @id
        elsif (tree_id.split[0] == 'site')
          # site = Site.find(@id)
          site=Site.first(:conditions => { :tree_id => @id })
          site.network_id       = Network.first(:conditions => { :tree_id => @parent_id }).id
          site.site_name        = node_name
          site.tree_id          = tree_id
          site.save!
    
          @tid = @id   
        else
          # Error handler here
        end
      end
  end

  # GET /addresses/view_all.xml
  def view_all
    @addresses = Address.all  
  end

  # GET /addresses/view_by_network.xml
  def view_by_network
    network_id = Network.first(:conditions => { :tree_id => params[:id] }).id

    @addresses = Address.where(:subnet_id => Subnet.where(:site_id => Site.where(:network_id => network_id)))
  end

  # GET /addresses/view_by_site.xml
  def view_by_site
    site_id       = Site.first(:conditions => { :tree_id => params[:id] }).id

    @addresses = Address.where(:subnet_id => Subnet.where(:site_id => site_id))
  end

  # GET /addresses/view_by_subnet.xml
  def view_by_subnet
    subnet_id     = Subnet.first(:conditions => { :tree_id => params[:id] }).id
    
    @addresses = Address.where(:subnet_id => subnet_id)
  end

  # GET /addresses/dbaction_all.xml
  def dbaction_all # supporting code for dhtmlx db/grid
    #called for all db actions
    network_address = params["c0"]
    mask_length     = params["c1"]
    system          = params["c2"]
    url             = params["c4"]
    description     = params["c5"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = address.id
        when "deleted"
            address=Address.find(@id)
            address.destroy
            
            @tid = @id
        when "updated"
            address=Address.find(@id)
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_network.xml
  def dbaction_network # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_id       = params[:id].split[2]
    network_address = params["c0"]
    mask_length     = params["c1"]
    system          = params["c2"]
    url             = params["c4"]
    description     = params["c5"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = address.id
        when "deleted"
            address=Address.find(@id)
            address.destroy
            
            @tid = @id
        when "updated"
            address=Address.find(@id)
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_site.xml
  def dbaction_site # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_id       = params[:id].split[2]
    network_address = params["c0"]
    mask_length     = params["c1"]
    system          = params["c2"]
    url             = params["c4"]
    description     = params["c5"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = address.id
        when "deleted"
            address=Address.find(@id)
            address.destroy
            
            @tid = @id
        when "updated"
            address=Address.find(@id)
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_subnet.xml
  def dbaction_subnet # supporting code for dhtmlx db/grid
    
    # right now this is only called when the Add Address button is clicked
    subnet_id       = Subnet.first(:conditions => { :tree_id => params[:id] }).id
    network_address = params["c0"]
    mask_length     = params["c1"]
    system          = params["c2"]
    url             = params["c3"]
    description     = params["c4"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.subnet_id       = subnet_id
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = address.id
        when "deleted"
            address=Address.find(@id)
            address.destroy
            
            @tid = @id
        when "updated"
            address=Address.find(@id)
            address.subnet_id       = subnet_id
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
            address.url             = url
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses
  # GET /addresses.xml
  def index
    @addresses = Address.all

    #render :json => Address.all.map{|a| {:system => a.system, :network_address => a.network_address} }
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @addresses }
      format.json { render :json => @addresses.map{|a| {:system_names => a.system_names.join(" and "),
                                                        :system_interfaces => a.system_interfaces.join(" and "),
                                                        :network_address => a.network_address,
                                                        :subnet_display_name => a.subnet.display_name,
                                                        :location_name => a.location_name } } }
    end
  end

  # GET /addresses/1
  # GET /addresses/1.xml
  def show
    @address = Address.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @address }
    end
  end

  # GET /addresses/new
  # GET /addresses/new.xml
  def new
    @address = Address.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @address }
    end
  end

  # GET /addresses/1/edit
  def edit
    @address = Address.find(params[:id])
  end

  # POST /addresses
  # POST /addresses.xml
  def create
    @address = Address.new(params[:address])

    respond_to do |format|
      if @address.save
        format.html { redirect_to(@address, :notice => 'Address was successfully created.') }
        format.xml  { render :xml => @address, :status => :created, :location => @address }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /addresses/1
  # PUT /addresses/1.xml
  def update
    @address = Address.find(params[:id])

    respond_to do |format|
      if @address.update_attributes(params[:address])
        format.html { redirect_to(@address, :notice => 'Address was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /addresses/1
  # DELETE /addresses/1.xml
  def destroy
    @address = Address.find(params[:id])
    @address.destroy

    respond_to do |format|
      format.html { redirect_to(addresses_url) }
      format.xml  { head :ok }
    end
  end
end