class AddressesController < ApplicationController
  # GET /addresses/tree.xml
  def tree
    @networks = Network.all
  end

  # GET /addresses/view_all.xml
  def view_all
    @addresses = Address.all  
  end

  # GET /addresses/view_by_network.xml
  def view_by_network
    network_id    = params[:id].split[0]

    @addresses = Address.where(:subnet_id => Subnet.where(:site_id => Site.where(:network_id => network_id)))
  end

  # GET /addresses/view_by_site.xml
  def view_by_site
    site_id       = params[:id].split[1]

    @addresses = Address.where(:subnet_id => Subnet.where(:site_id => site_id))
  end

  # GET /addresses/view_by_subnet.xml
  def view_by_subnet
    subnet_id     = params[:id].split[2]
    
    @addresses = Address.where(:subnet_id => subnet_id)
  end

  # GET /addresses/dbaction_all.xml
  def dbaction_all # supporting code for dhtmlx db/grid
    #called for all db actions
    network_address = params["c3"]
    mask_length     = params["c4"]
    system          = params["c5"]
    description     = params["c6"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
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
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_network.xml
  def dbaction_network # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_id       = params[:id].split[2]
    network_address = params["c2"]
    mask_length     = params["c3"]
    system          = params["c4"]
    description     = params["c5"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
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
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_site.xml
  def dbaction_site # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_id       = params[:id].split[2]
    network_address = params["c1"]
    mask_length     = params["c2"]
    system          = params["c3"]
    description     = params["c4"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
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
            address.description     = description
            address.save!
            
            @tid = @id
    end 
  end

  # GET /addresses/dbaction_subnet.xml
  def dbaction_subnet # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_id       = params[:id].split[2]
    network_address = params["c0"]
    mask_length     = params["c1"]
    system          = params["c2"]
    description     = params["c3"]
    
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            address = Address.new
            address.subnet_id       = subnet_id
            address.network_address = network_address
            address.mask_length     = mask_length
            address.system          = system
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
