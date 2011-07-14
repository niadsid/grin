class AddressesController < ApplicationController
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
    network_id    = Network.first(:conditions => { :tree_id => params[:id] }).id

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

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @addresses }
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
