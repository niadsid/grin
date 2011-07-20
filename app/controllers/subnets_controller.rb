class SubnetsController < ApplicationController

  # GET /subnets/all_subnets.xml
  def view_all
    @subnets = Subnet.all
  end
 
  # GET /subnets/view_by_network.xml
  def view_by_network
    network_id  = Network.first(:conditions => { :tree_id => params[:id] }).id
    
    @subnets    = Subnet.where(:site_id => Site.where(:network_id => network_id))
  end
 
  # GET /subnets/view_by_site.xml
  def view_by_site
    site_id     = Site.first(:conditions => { :tree_id => params[:id] }).id
    
    @subnets    = Subnet.where(:site_id => site_id)
  end

  # GET /subnets/view_by_subnet.xml
  def view_by_subnet
    @subnets    = Subnet.where(:tree_id => params[:id])
  end

# GET /subnets/dbaction_all.xml
  def dbaction_all # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_identifier = params["c0"]
    mask_length       = params["c1"]
    display_name      = params["c2"]
    subnet_name       = params["c3"]
    default_router    = params["c4"]
    description       = params["c5"]
 
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            subnet = Subnet.new
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = subnet.id
        when "deleted"
            subnet=Subnet.find(@id)
            subnet.destroy
            
            @tid = @id
        when "updated"
            subnet=Subnet.find(@id)
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = @id
    end 
  end

  # GET /subnets/dbaction_network.xml
  def dbaction_network # supporting code for dhtmlx db/grid
    #called for all db actions
    site_id           = params[:id].split[1]
    subnet_identifier = params["c0"]
    mask_length       = params["c1"]
    display_name      = params["c2"]
    subnet_name       = params["c3"]
    default_router    = params["c4"]
    description       = params["c5"]
 
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            subnet = Subnet.new
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = subnet.id
        when "deleted"
            subnet=Subnet.find(@id)
            subnet.destroy
            
            @tid = @id
        when "updated"
            subnet=Subnet.find(@id)
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = @id
    end 
  end

  # GET /subnets/dbaction_site.xml
  def dbaction_site # supporting code for dhtmlx db/grid
    #called for all db actions
    site_id           = Site.first(:conditions => { :tree_id => params[:id] }).id
    subnet_identifier = params["c0"]
    mask_length       = params["c1"]
    display_name      = params["c2"]
    subnet_name       = params["c3"]
    default_router    = params["c4"]
    description       = params["c5"]
 
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "inserted"
            subnet = Subnet.new
            subnet.site_id            = site_id
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.tree_id            = "subnet 1" + Random.rand(999999999).to_s
            subnet.save!
            
            @tid = subnet.id
        when "deleted"
            subnet=Subnet.find(@id)
            subnet.destroy
            
            @tid = @id
        when "updated"
            subnet=Subnet.find(@id)
            subnet.site_id            = site_id
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = @id
    end 
  end
  
  # GET /subnets/dbaction_subnet.xml
  def dbaction_subnet # supporting code for dhtmlx db/grid
    #called for all db actions
    subnet_identifier = params["c0"]
    mask_length       = params["c1"]
    display_name      = params["c2"]
    subnet_name       = params["c3"]
    default_router    = params["c4"]
    description       = params["c5"]
 
    @mode = params["!nativeeditor_status"]
    
    @id = params["gr_id"]
    case @mode
        when "deleted"
            subnet=Subnet.find(@id)
            subnet.destroy
            
            @tid = @id
        when "updated"
            subnet=Subnet.find(@id)
            subnet.subnet_name        = subnet_name
            subnet.subnet_identifier  = subnet_identifier
            subnet.mask_length        = mask_length
            subnet.display_name       = display_name
            subnet.default_router     = default_router
            subnet.description        = description
            subnet.save!
            
            @tid = @id
    end 
  end

  # GET /subnets
  # GET /subnets.xml
  def index
    @subnets = Subnet.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @subnets }
      format.json { render :json => @subnets.map{|a| {:subnet_identifier_with_mask => a.subnet_identifier_with_mask,
                                                      :subnet_name => a.subnet_name,
                                                      :display_name => a.display_name,
                                                      :location_name => a.location_name } } }
    end
  end

  # GET /subnets/1
  # GET /subnets/1.xml
  def show
    @subnet = Subnet.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @subnet }
    end
  end

  # GET /subnets/new
  # GET /subnets/new.xml
  def new
    @subnet = Subnet.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @subnet }
    end
  end

  # GET /subnets/1/edit
  def edit
    @subnet = Subnet.find(params[:id])
  end

  # POST /subnets
  # POST /subnets.xml
  def create
    @subnet = Subnet.new(params[:subnet])

    respond_to do |format|
      if @subnet.save
        format.html { redirect_to(@subnet, :notice => 'Subnet was successfully created.') }
        format.xml  { render :xml => @subnet, :status => :created, :location => @subnet }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @subnet.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /subnets/1
  # PUT /subnets/1.xml
  def update
    @subnet = Subnet.find(params[:id])

    respond_to do |format|
      if @subnet.update_attributes(params[:subnet])
        format.html { redirect_to(@subnet, :notice => 'Subnet was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @subnet.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /subnets/1
  # DELETE /subnets/1.xml
  def destroy
    @subnet = Subnet.find(params[:id])
    @subnet.destroy

    respond_to do |format|
      format.html { redirect_to(subnets_url) }
      format.xml  { head :ok }
    end
  end
end
