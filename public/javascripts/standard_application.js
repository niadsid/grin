// Issue list:
//	 
//   still using a dummy call to dbaction_tree_null to capture tree change events see if can change this to using div onchange
//	 program structure needs to be cleaned up into mvc
//	 When you start editing and then hit Esc it creates an empty entry - need to have it delete this entry
//   for heading 2, kill the sort direction controls
//	 when editing tree nodes the initial edit box does a resize that shouldn't need to happen
//	 implement custom icons
//
//	Model:
//		interaction with the web store
//		interaction with the server database
//	View: 
//		interaction with the web store
//		Sencha touch-controls
//		DHTMLX-controls
//	Controller:
//		non model-specific code
//		non view-specific code
//		typical controller actions: new, edit, delete
//
//	Conventions: "index" refers to a relative array or grid position, "id" refers to a uid

var addressesTab,subnetsTab;
var topologyTree;

var networksArray = [];
var sitesArray = [];
var subnetsArray = [];
var addressesArray = [];
var treeArray = [];
var addressesGridDP,subnetsGridDP,topologyTreeDP;
var onSubnetUpdate,onTreeUpdate,onSelectStateChanged;
var onAddressRowSelect,onSubnetRowSelect,onTopologyTreeSelect;
var main_layout;
var addressesGrid, subnetsGrid;
var addressesToolbar,subnetsToolbar,treeToolbar;
var node_id,new_node_id;


//
//
//	MODEL
//
//


var Networks = {
	
	create: function() { // creates a blank record for editing in the tree
		var network_id = Networks.add('');
		Networks.add_to_array(network_id, '');
		
		return network_id;
	},
	
	add: function(name) {
		var network = {
			id: "network:" + uuid(),
			network_name: name
		};
		window.localStorage.setItem(network.id, JSON.stringify(network));
		
		return network.id
	},
	
	add_to_array: function(id, name) {
		function network() {
			this.id = id;
			this.network_name = name;
		};
		networksArray[networksArray.length] = new network();
	},

	delete_network: function(id) {
		// remove the array from the local web store
		window.localStorage.removeItem(id);
		// and then delete it from our working array
		networksArray.splice(Networks.find_by_id(id), 1);
	},

	// write_to_store: function(id, name) {
		// var network = {
			// id: id,
			// network_name: name
		// };
		// window.localStorage.setItem(network.id, JSON.stringify(network));
// 		
		// return network.id
	// },
	
	update_array: function(id, name) {
		var index = Networks.find_by_id(id);
		
		networksArray[index].network_name = name;

		return index;
	},

	update_store: function(network) {
		window.localStorage.setItem(network.id, JSON.stringify(network));
	},
	
	load_from_store: function() {
		function network() {
			this.id = '';
			this.network_name = '';
		};
		var records = [];
		var i,key;
		var records_index = 0;
	
		if (window.localStorage.length) { // verify localstorage is not empty
			for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				key = window.localStorage.key(i); // get the each key in succession
				if (/^network:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					records[records_index] = new network();
				 	records[records_index] = (JSON.parse(window.localStorage.getItem(key)));
				 	records_index++;
				}
			}
		}
		return records.sort(function(a,b) {
			var x = a[0];
    		var y = b[0];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},
		
	find_by_id: function(id) {
		for (i = 0; i < networksArray.length; i++) {
			if (networksArray[i].id == id) {
				break;
			}
		}
		return i;
	},
	
	find_by_name: function(name) {
		var i = networksArray.length;
		matching_id = '';
		// var i = 0; while (i < arr.length) { i++; }

		while (i--) {
			if (name == networksArray[i].network_name) {
				matching_id = networksArray[i].id;
				i = 0;
			}
		}
		return matching_id;
	}
	
	// find_by_name: function(name) {
		// var network = {
			// id: '',
			// network_name: ''
		// };
		// var matching_id = '';
		// var i,key;
// 
		// if (window.localStorage.length) { // verify localstorage is not empty
			// for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				// key = window.localStorage.key(i); // get the each key in succession
				// // Make sure we have a valid network object
				// if (/^network:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					// network = (JSON.parse(window.localStorage.getItem(key)));
					// if (name == network.network_name) {
						// matching_id = network.id; // if we have a match, return it and stop looking
						// break;
					// }
				// }
			// }
		// }
		// return matching_id;
	// }
};

var Sites = {
	
	create: function(network_id) { // creates a blank record for editing in the tree
		var site_id = Sites.add('', network_id);
		Sites.add_to_array(site_id, network_id, '');
		
		return site_id;
	},
	
	add: function(name, network_id) {
		var site = {
			id: "site:" + uuid(),
			network_id: network_id,
			site_name: name
		};
		window.localStorage.setItem(site.id, JSON.stringify(site));
		
		return site.id
	},
	
	add_to_array: function(id, parent_id, name) {
		function site() {
			this.id = id;
			this.network_id = parent_id;
			this.site_name = name;
		};
		sitesArray[sitesArray.length] = new site();
	},

	delete_site: function(id) {
		// remove the array from the local web store
		window.localStorage.removeItem(id);
		// and then delete it from our working array
		sitesArray.splice(Sites.find_by_id(id), 1);
	},
	
	// write_to_store: function(id, parent_id, name) {
		// var site = {
			// id: id,
			// network_id: parent_id,
			// site_name: name
		// };
		// window.localStorage.setItem(site.id, JSON.stringify(site));
// 		
		// return site.id
	// },
	
	update_array: function(id, name) {
		var index = Sites.find_by_id(id);
		
		sitesArray[index].site_name = name;

		return index;
	},

	update_store: function(site) {
		window.localStorage.setItem(site.id, JSON.stringify(site));
	},	

	load_from_store: function() {
		function site() {
			this.id = '';
			this.site_name = '';
			this.network_id ='';
		};
		var records = [];
		var i,key;
		var records_index = 0;
	
		if (window.localStorage.length - 1) { // if there are sites, there must be at least 2 records
			for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				key = window.localStorage.key(i); // get the each key in succession
				if (/^site:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					records[records_index] = new site();
				 	records[records_index] = (JSON.parse(window.localStorage.getItem(key)));
				 	records_index++;
				}
			}
		}
		return records.sort(function(a,b) {
			var x = a[0];
    		var y = b[0];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},

	find_by_id: function(id) {
		for (i = 0; i < sitesArray.length; i++) {
			if (sitesArray[i].id == id) {
				break;
			}
		}
		return i;
	},

	find_by_name: function(name, network_id) {
		var i = sitesArray.length;
		matching_id = '';
		// var i = 0; while (i < arr.length) { i++; }

		while (i--) {
			if ((name == sitesArray[i].site_name)&&(network_id == sitesArray[i].network_id)) {
				matching_id = sitesArray[i].id;
				i = 0;
			}
		}
		return matching_id;
	}

	// find_by_name: function(name, network_id) {
		// var site = {
			// id: 0,
			// site_name: ''
		// };
		// var matching_id = 0;
		// var i,key;
// 
		// if (window.localStorage.length - 1) { // if there are sites, there must be at least 2 records
			// for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				// key = window.localStorage.key(i); // get the each key in succession
				// // Make sure we have a valid site object
				// if (/^site:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					// site = (JSON.parse(window.localStorage.getItem(key)));
					// if ((name == site.site_name)&&(network_id == site.network_id)) {
						// matching_id = site.id; // if we have a match, return it and stop looking
						// break;
					// }
				// }
			// }
		// }
		// return matching_id;
	// }
};

var Subnets = {

	create: function(site_id) { // creates a blank record for editing in the grid
		var subnet_id = Subnets.add(site_id, '', '', '', '', '', '');
		Subnets.add_to_array(subnet_id, site_id, '', '', '', '', '', '');
		
		return subnet_id;
	},

	add: function(site_id, subnet_display_name, subnet_identifier, subnet_mask_length, subnet_name, subnet_default_router, subnet_description) {
		var subnet = {
			id: "subnet:" + uuid(),
			site_id: site_id,
			subnet_display_name: subnet_display_name,
			subnet_identifier: subnet_identifier,
			subnet_mask_length: subnet_mask_length,
			subnet_name: subnet_name,
			subnet_default_router: subnet_default_router,
			subnet_description: subnet_description
		};
		window.localStorage.setItem(subnet.id, JSON.stringify(subnet));
		
		return subnet.id
	},
	
	add_to_array: function(id, site_id, subnet_display_name, subnet_identifier, subnet_mask_length, subnet_name, subnet_default_router, subnet_description) {
		function subnet() {
			this.id = id;
			this.site_id = site_id;
			this.subnet_display_name = subnet_display_name;
			this.subnet_identifier = subnet_identifier;
			this.subnet_mask_length = subnet_mask_length;
			this.subnet_name = subnet_name;
			this.subnet_default_router = subnet_default_router;
			this.subnet_description = subnet_description;
		};
		subnetsArray[subnetsArray.length] = new subnet();
	},

	add_to_grid: function() {
		subnetsGrid.filterBy(0,"");
		subnetsGrid._f_rowsBuffer = null;
		
		node_id = topologyTree.getSelectedItemId();
		
		var id = Subnets.create(node_id);

		subnetsGrid.addRow(id,",,,,,",0);
		subnetsGrid.selectRow(0);
		subnetsGrid.selectCell(subnetsGrid.getRowIndex(id),0,false,true,true);
		subnetsGrid.clearSelection();
		window.setTimeout( function() {
			subnetsGrid.selectRow(0);
			subnetsGrid.editCell();
			Subnets.schedule_refresh();
		},1);	
	},
	
	schedule_refresh: function() {
		onSelectStateChanged = subnetsGrid.attachEvent("onSelectStateChanged", function(id) {
			Tree.refresh(node_id);
			 subnetsGrid.detachEvent(onSelectStateChanged);
		});
	},
		

	update_store: function(subnet) {
		window.localStorage.setItem(subnet.id, JSON.stringify(subnet));
	},
	
	update_array: function(update_values) {
		var subnet = {
			id: 					update_values[0],
			subnet_identifier:		update_values[1],
			subnet_mask_length:		update_values[2],
			subnet_display_name:	update_values[3],
            subnet_name:			update_values[4],
            subnet_default_router:	update_values[5],
            subnet_description:		update_values[6]
		};
		var index = Subnets.find_by_id(subnet.id)
		
		subnetsArray[index].subnet_identifier		= subnet.subnet_identifier;
		subnetsArray[index].subnet_mask_length		= subnet.subnet_mask_length;
		subnetsArray[index].subnet_display_name		= subnet.subnet_display_name;
		subnetsArray[index].subnet_name				= subnet.subnet_name;
		subnetsArray[index].subnet_default_router	= subnet.subnet_default_router;
		subnetsArray[index].subnet_description		= subnet.subnet_description;

		return index;
	},
	
	friendly_descriptor: function(index) {
    	var friendly_descriptor = subnetsArray[index].subnet_display_name + ' (' + subnetsArray[index].subnet_identifier + '/' + subnetsArray[index].subnet_mask_length + ')';
    	
    	return friendly_descriptor    	
  	},

	load_from_store: function() {
		function subnet() {
			this.id = '';
			this.site_id = '';
			this.subnet_display_name = '';
			this.subnet_identifier = '';
			this.subnet_mask_length = '';
			this.subnet_name = '';
			this.subnet_default_router = '';
			this.subnet_description = '';
		};
		var records = [];
		var i,key;
		var records_index = 0;
	
		if (window.localStorage.length - 2) { // if there are subnets, there must be at least 3 records
			for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				key = window.localStorage.key(i); // get the each key in succession
				if (/^subnet:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					records[records_index] = new subnet();
				 	records[records_index] = (JSON.parse(window.localStorage.getItem(key)));
				 	records_index++;
				}
			}
		}
		return records.sort(function(a,b) {
			var x = a[0];
    		var y = b[0];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},
	
	find_by_id: function(id) {
		for (i = 0; i < subnetsArray.length; i++) {
			if (subnetsArray[i].id == id) {
				break;
			}
		}
		return i;
	},
	
	find_by_subnet_identifier: function(subnet_identifier, site_id) {
		var i = subnetsArray.length;
		matching_id = '';
		// var i = 0; while (i < arr.length) { i++; }

		while (i--) {
			if ((subnet_identifier == subnetsArray[i].subnet_identifier)&&(site_id == subnetsArray[i].site_id)) {
				matching_id = subnetsArray[i].id;
				i = 0;
			}
		}
		return matching_id;
	},
	
	// find_by_subnet_display_name: function(subnet_display_name, site_id) {
		// var subnet = {
			// id: 0,
			// subnet_display_name: ''
		// };
		// var matching_id = 0;
		// var i,key;
// 
		// if (window.localStorage.length - 2) { // if there are subnets, there must be at least 3 records
			// for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				// key = window.localStorage.key(i); // get the each key in succession
				// // Make sure we have a vlaid subnet record
				// if (/^subnet:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					// subnet = (JSON.parse(window.localStorage.getItem(key)));
					// if ((subnet_display_name == subnet.subnet_display_name)&&(site_id == subnet.site_id)) {
						// matching_id = subnet.id; // if we have a match, return it and stop looking
						// break;
					// }
				// }
			// }
		// }
		// return matching_id;
	// },
	
	build_grid: function(node_id) {
		var records = [];
		var i,key;
		var node_index = 0;

		if (node_id == 'root:0') {
			for (i = 0; i < subnetsArray.length; i++) {
				records[node_index] = new Array();
				records[node_index][0] = subnetsArray[i].id;
				records[node_index][1] = subnetsArray[i].subnet_identifier;
				records[node_index][2] = subnetsArray[i].subnet_mask_length;
				records[node_index][3] = subnetsArray[i].subnet_display_name;
				records[node_index][4] = subnetsArray[i].subnet_name;
				records[node_index][5] = subnetsArray[i].subnet_default_router;
				records[node_index][6] = subnetsArray[i].subnet_description;
				records[node_index][7] = sitesArray[Sites.find_by_id(subnetsArray[i].site_id)].site_name;
				records[node_index][8] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[i].site_id)].network_id)].network_name;
				node_index++;
			}
		} else if (node_id.split(":")[0] == 'network') {
			for (i = 0; i < subnetsArray.length; i++) {
				if (networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[i].site_id)].network_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = subnetsArray[i].id;
					records[node_index][1] = subnetsArray[i].subnet_identifier;
					records[node_index][2] = subnetsArray[i].subnet_mask_length;
					records[node_index][3] = subnetsArray[i].subnet_display_name;
					records[node_index][4] = subnetsArray[i].subnet_name;
					records[node_index][5] = subnetsArray[i].subnet_default_router;
					records[node_index][6] = subnetsArray[i].subnet_description;
					records[node_index][7] = sitesArray[Sites.find_by_id(subnetsArray[i].site_id)].site_name;
					node_index++;				
				}
			}
		} else if (node_id.split(":")[0] == 'site') {
			for (i = 0; i < subnetsArray.length; i++) {
				if (sitesArray[Sites.find_by_id(subnetsArray[i].site_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = subnetsArray[i].id;
					records[node_index][1] = subnetsArray[i].subnet_identifier;
					records[node_index][2] = subnetsArray[i].subnet_mask_length;
					records[node_index][3] = subnetsArray[i].subnet_display_name;
					records[node_index][4] = subnetsArray[i].subnet_name;
					records[node_index][5] = subnetsArray[i].subnet_default_router;
					records[node_index][6] = subnetsArray[i].subnet_description;
					node_index++;				
				}
			}
		} else if (node_id.split(":")[0] == 'subnet') {
			for (i = 0; i < subnetsArray.length; i++) {
				if (subnetsArray[i].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = subnetsArray[i].id;
					records[node_index][1] = subnetsArray[i].subnet_identifier;
					records[node_index][2] = subnetsArray[i].subnet_mask_length;
					records[node_index][3] = subnetsArray[i].subnet_display_name;
					records[node_index][4] = subnetsArray[i].subnet_name;
					records[node_index][5] = subnetsArray[i].subnet_default_router;
					records[node_index][6] = subnetsArray[i].subnet_description;
					node_index++;				
				}
			}
		}
		records.sort(function(a,b) {
			var x = a[0];
    		var y = b[0];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
		
		for (i = 0; i < records.length; i++) {
			subnetsGrid.addRow(records[i][0], records[i].slice(1));
		}
	},

	delete_subnet: function () {
		subnetsGrid.filterBy(0,"");
		subnetsGrid._f_rowsBuffer = null;
		
		var id 		= subnetsGrid.getSelectedRowId();
		var index 	= Subnets.find_by_id(id);
		var site_id = subnetsArray[index].site_id;
		
		node_id = topologyTree.getSelectedItemId();
		
		window.localStorage.removeItem(id);
		subnetsArray.splice(index, 1);
		subnetsGrid.deleteSelectedRows();
		
		subnetsToolbar.disableItem("delete");
		
		if (node_id == id) {
			Tree.refresh(site_id);
		} else {
			Tree.refresh(node_id);
		};
	}
};

var Addresses = {
	
	// create - generates uids the array record, then calls the storage update routine, returns the new address id
	//
	//
	// add - creates a new store record and generates a new id in the process - called by importcsv
	// add_to_grid - called when a new grid entry is initiated
	// update_store - accepts a complete address record and writes it to the store
	// update_array - accepts an address record with everything but subnet_id and updates the corresponding array
	// load_from_store -  populates the addresses array from the local store, called on initialization and after csv import
	// find_by_id - returns the array index when given an addresses unique id
	// find_by_network_address - returns unique id if a network address exists (checks address and subnet id), called by importcsv
	// build_grid - returns a view of all addresses based on what tree node is selected
	// delete_address - called by the delete button, deletes from array, local storage, and the grid

	// create: function(subnet_id) {
// 		
		// function address() {
			// this.id = "address:" + uuid();
			// this.subnet_id = subnet_id;
			// this.network_address = '';
			// this.mask_length = '';
            // this.system = '';
            // this.url = '';
            // this.description = '';
		// };
		// var i = addressesArray.length;
// 		
		// addressesArray[i] = new address();
		// Addresses.add(addressesArray[i]);
// 		
		// return addressesArray[i].id;
	// },

	create: function(subnet_id) { // creates a blank record for editing in the grid
		var address_id = Addresses.add(subnet_id, '', '', '', '', '');
		Addresses.add_to_array(address_id, subnet_id, '', '', '', '', '');
		
		return address_id;
	},

	add: function(subnet_id, network_address, mask_length, system, url, description) {
		var address = {
			id: "address:" + uuid(),
			subnet_id: subnet_id,
			network_address: network_address,
			mask_length: mask_length,
            system: system,
            url: url,
            description: description
		};
		window.localStorage.setItem(address.id, JSON.stringify(address));
		
		return address.id
	},
	
	add_to_array: function(id, subnet_id, network_address, mask_length, system, url, description) {
		function address() {
			this.id = id;
			this.subnet_id = subnet_id;
			this.network_address = network_address;
			this.mask_length = mask_length;
			this.system = system;
			this.url = url;
			this.description = description;
		};
		addressesArray[addressesArray.length] = new address();
	},

	add_to_grid: function() {
		addressesGrid.filterBy(0,"");
		addressesGrid._f_rowsBuffer = null;
		
		node_id = topologyTree.getSelectedItemId();
		
		var id = Addresses.create(node_id);

		addressesGrid.addRow(id,",,,,",0);
		addressesGrid.selectRow(0);
		addressesGrid.selectCell(addressesGrid.getRowIndex(id),0,false,true,true);
		addressesGrid.clearSelection();  // focus jumps out of the control after the first cell without this
		window.setTimeout( function() {  // this wait is needed for the cell to actuall go into edit mode
			addressesGrid.selectRow(0);
			addressesGrid.editCell();
		},1);
	},

	update_store: function(address) {
		window.localStorage.setItem(address.id, JSON.stringify(address));
	},
	
	update_array: function(update_values) {
		var address = {
			id: 				update_values[0],
			network_address:	update_values[1],
			mask_length:		update_values[2],
            system:				update_values[3],
            url:				update_values[4],
            description:		update_values[5]
		};
		var array_id = Addresses.find_by_id(address.id)
		
		addressesArray[array_id].network_address	= address.network_address;
		addressesArray[array_id].mask_length		= address.mask_length;
		addressesArray[array_id].system				= address.system;
		addressesArray[array_id].url				= address.url;
		addressesArray[array_id].description		= address.description;

		return array_id;
	},
	
	load_from_store: function() {
		function address() {
			this.id = '';
			this.subnet_id = '';
			this.network_address = '';
			this.mask_length = '';
            this.system = '';
            this.url = '';
            this.description = '';
		};
		var records = [];
		var i,key;
		var records_index = 0;

		if (window.localStorage.length - 1) { // verify localstorage is not empty
			for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				key = window.localStorage.key(i); // get the each key in succession
				if (/^address:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					records[records_index] = new address();
				 	records[records_index] = (JSON.parse(window.localStorage.getItem(key)));
				 	records_index++;
				}
			}
		}
		return records.sort(function(a,b) {
			var x = a[0];
    		var y = b[0];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},
	
	find_by_id: function(id) {
		for (i = 0; i < addressesArray.length; i++) {
			if (addressesArray[i].id == id) {
				break;
			}
		}
		return i;
	},

	find_by_network_address: function(network_address, subnet_id) {
		var i = subnetsArray.length;
		matching_id = '';
		// var i = 0; while (i < arr.length) { i++; }

		while (i--) {
			if ((network_address == addressesArray[i].network_address)&&(subnet_id == addressesArray[i].subnet_id)) {
				matching_id = subnetsArray[i].id;
				i = 0;
			}
		}
		return matching_id;
	},

	// find_by_network_address: function(network_address, subnet_id) {
		// var address = {
			// id: '',
			// network_address: '',
			// subnet_id: ''
		// };
		// var matching_id = 0;
		// var i,key;
// 
		// if (window.localStorage.length - 1) { // verify localstorage is not empty
			// for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
				// key = window.localStorage.key(i); // get the each key in succession
			 	// // Make sure this a valid address record
				// if (/^address:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
					// address = (JSON.parse(window.localStorage.getItem(key)));
					// if ((network_address == address.network_address)&&(subnet_id == address.subnet_id)) {
						// matching_id = address.id; // if we have a match, return it and stop looking
						// break;
					// }
				// }
			// }
		// }
		// return matching_id;
	// },
	
	build_csv: function(node_id) {
		var records = [];
		var i,key;
		var node_index = 0;

		records[node_index] = new Array("Network Name", "Site Name", "Subnet Identifier", "Subnet Mask Length", "Subnet name", "Subnet Default Router", "Subnet Description", "Network Address", "Mask Length", "System", "URL", "Description");
		node_index++;

		if (node_id == 'root:0') {
			for (i = 0; i < addressesArray.length; i++) {
				records[node_index] = new Array();
				records[node_index][0] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].network_name;
				records[node_index][1] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
				records[node_index][2] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_display_name;
				records[node_index][3] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_identifier;
				records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_mask_length;
				records[node_index][5] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
				records[node_index][6] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_default_router;
				records[node_index][7] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_description;
				records[node_index][8] = addressesArray[i].network_address;
				records[node_index][9] = addressesArray[i].mask_length;
				records[node_index][10] = addressesArray[i].system;
				records[node_index][11] = addressesArray[i].url;
				records[node_index][12] = addressesArray[i].description;
				node_index++;
			}
		} else if (node_id.split(":")[0] == 'network') {
			for (i = 0; i < addressesArray.length; i++) {
				if (networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].network_name;
					records[node_index][1] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
					records[node_index][2] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_display_name;
					records[node_index][3] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_identifier;
					records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_mask_length;
					records[node_index][5] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
					records[node_index][6] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_default_router;
					records[node_index][7] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_description;
					records[node_index][8] = addressesArray[i].network_address;
					records[node_index][9] = addressesArray[i].mask_length;
					records[node_index][10] = addressesArray[i].system;
					records[node_index][11] = addressesArray[i].url;
					records[node_index][12] = addressesArray[i].description;
					node_index++;
				}
			}
		} else if (node_id.split(":")[0] == 'site') {
			for (i = 0; i < addressesArray.length; i++) {
				if (sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].network_name;
					records[node_index][1] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
					records[node_index][2] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_display_name;
					records[node_index][3] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_identifier;
					records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_mask_length;
					records[node_index][5] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
					records[node_index][6] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_default_router;
					records[node_index][7] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_description;
					records[node_index][8] = addressesArray[i].network_address;
					records[node_index][9] = addressesArray[i].mask_length;
					records[node_index][10] = addressesArray[i].system;
					records[node_index][11] = addressesArray[i].url;
					records[node_index][12] = addressesArray[i].description;
					node_index++;				
				}
			}
		} else if (node_id.split(":")[0] == 'subnet') {
			for (i = 0; i < addressesArray.length; i++) {
				if (subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].network_name;
					records[node_index][1] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
					records[node_index][2] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_display_name;
					records[node_index][3] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_identifier;
					records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_mask_length;
					records[node_index][5] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
					records[node_index][6] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_default_router;
					records[node_index][7] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_description;
					records[node_index][8] = addressesArray[i].network_address;
					records[node_index][9] = addressesArray[i].mask_length;
					records[node_index][10] = addressesArray[i].system;
					records[node_index][11] = addressesArray[i].url;
					records[node_index][12] = addressesArray[i].description;
					node_index++;				
				}
			}
		}
		return records
	},
	
	build_txt: function(node_id) {
		var records = [];
		var key;
		var index = 0;
		var sortedNetworks = networksArray;
		var sortedSites = sitesArray;
		var sortedSubnets = subnetsArray;
		var sortedAddresses = addressesArray;

		for (var i = 0; i < sortedNetworks.length; i++) {
			records[index] = '#########';
			index++;
			records[index] = '#########  ' + sortedNetworks[i].network_name;
			index++;
			records[index] = '#########';
			index++;
			for (var j = 0; j < sortedSites.length; j++) {
				if (sortedSites[j].network_id == sortedNetworks[i].id) {
					records[index] = '######';
					index++;
					records[index] = '######  ' + sortedSites[j].site_name;
					index++;
					records[index] = '######';
					index++;
					for (var k = 0; k < sortedSubnets.length; k++) {
						if (sortedSubnets[k].site_id == sortedSites[j].id) {
							records[index] = '###';
							index++;
							records[index] = '###  ' + sortedSubnets[k].subnet_display_name + ' ('+ sortedSubnets[k].subnet_name + ')';
							index++;
							records[index] = '###  ' + sortedSubnets[k].subnet_identifier + '/'+sortedSubnets[k].mask_length + ' (Default Router: '+ sortedSubnets[k].subnet_name + ')';
							index++;
							records[index] = '###  ' + sortedSubnets[k].subnet_description;
							index++;
							records[index] = '###';
							index++;
							for (var l = 0; l < sortedAddresses.length; l++) {
								var a = sortedAddresses[l].subnet_id;
								var b = sortedSubnets[k].id;
								
								if (sortedAddresses[l].subnet_id == sortedSubnets[k].id) {
									records[index] = sortedAddresses[l].network_address + ' \t' + sortedAddresses[l].system + '\t# ' + sortedAddresses[l].description;
									index++;
									if (sortedAddresses.url !== '') {
										records[index] = sortedAddresses[l].network_address + ' \t' + sortedAddresses[l].url + '\t# (' + sortedAddresses[l].system + ')';
										index++;							
									}
								}
							};
							records[index] = ''
							index++;
							records[index] = ''
							index++;
						};
					}
				};
			}
		}
		return records
	},

	build_grid: function(node_id) {
		var records = [];
		var i,key;
		var node_index = 0;

		if (node_id == 'root:0') {
			for (i = 0; i < addressesArray.length; i++) {
				records[node_index] = new Array();
				records[node_index][0] = addressesArray[i].id;
				records[node_index][1] = addressesArray[i].network_address;
				records[node_index][2] = addressesArray[i].mask_length;
				records[node_index][3] = addressesArray[i].system;
				records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
				records[node_index][5] = addressesArray[i].url;
				records[node_index][6] = addressesArray[i].description;
				records[node_index][7] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
				records[node_index][8] = networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].network_name;
				node_index++;
			}
		} else if (node_id.split(":")[0] == 'network') {
			for (i = 0; i < addressesArray.length; i++) {
				if (networksArray[Networks.find_by_id(sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].network_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = addressesArray[i].id;
					records[node_index][1] = addressesArray[i].network_address;
					records[node_index][2] = addressesArray[i].mask_length;
					records[node_index][3] = addressesArray[i].system;
					records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
					records[node_index][5] = addressesArray[i].url;
					records[node_index][6] = addressesArray[i].description;
					records[node_index][7] = sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].site_name;
					node_index++;
				}
			}
		} else if (node_id.split(":")[0] == 'site') {
			for (i = 0; i < addressesArray.length; i++) {
				if (sitesArray[Sites.find_by_id(subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].site_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = addressesArray[i].id;
					records[node_index][1] = addressesArray[i].network_address;
					records[node_index][2] = addressesArray[i].mask_length;
					records[node_index][3] = addressesArray[i].system;
					records[node_index][4] = subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].subnet_name;
					records[node_index][5] = addressesArray[i].url;
					records[node_index][6] = addressesArray[i].description;
					node_index++;				
				}
			}
		} else if (node_id.split(":")[0] == 'subnet') {
			for (i = 0; i < addressesArray.length; i++) {
				if (subnetsArray[Subnets.find_by_id(addressesArray[i].subnet_id)].id == node_id) {
					records[node_index] = new Array();
					records[node_index][0] = addressesArray[i].id;
					records[node_index][1] = addressesArray[i].network_address;
					records[node_index][2] = addressesArray[i].mask_length;
					records[node_index][3] = addressesArray[i].system;
					records[node_index][4] = addressesArray[i].url;
					records[node_index][5] = addressesArray[i].description;
					node_index++;				
				}
			}
		}
		records.sort(function(a,b) {
			var x = a[1];
    		var y = b[1];
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
		
		for (i = 0; i < records.length; i++) {
			addressesGrid.addRow(records[i][0], records[i].slice(1));
		}
	},
	
	delete_address: function () {
	
		addressesGrid.filterBy(0,"");
		addressesGrid._f_rowsBuffer = null;
		
		var id = addressesGrid.getSelectedRowId();
		
		window.localStorage.removeItem(id);
		addressesArray.splice(Addresses.find_by_id(id), 1);
		addressesGrid.deleteSelectedRows();
		
		if (addressesGrid.getRowsNum() == 0) {
			subnetsToolbar.enableItem("delete");
			addressesToolbar.disableItem("delete");
		} else {
			addressesGrid.selectRow(0);
			addressesToolbar.enableItem("delete");
		};
	}
};


var Tree = {

	refresh: function(id) {
		topologyTree.deleteChildItems(0);
		
		topologyTree.loadJSArray(Tree.deploy(),function() {
			topologyTree.openItem(id);
			topologyTree.enableItemEditor(0);
			topologyTree.selectItem(id);
		});
	},

	deploy: function() {
		var tree = [];
		var i;
		var node_index = 0;
		var network = networksArray;
		var site = sitesArray;
		var subnet = subnetsArray;
		
		tree[node_index] = new Array('root:0', 0, 'Network Topology');
		
		node_index++;
	
		for (i = 0; i < network.length; i++) {
			tree[node_index] = new Array(network[i].id, 'root:0', network[i].network_name);
			node_index++;
		}
		for (i = 0; i < site.length; i++) {
			tree[node_index] = new Array(site[i].id, site[i].network_id, site[i].site_name);
			node_index++;
		}
		for (i = 0; i < subnet.length; i++) {
			tree[node_index] = new Array(subnet[i].id, subnet[i].site_id, Subnets.friendly_descriptor(i));
			node_index++;
		}
		return tree.sort(function(a,b) {
			var x = a[2].toLowerCase();
    		var y = b[2].toLowerCase();
    		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},

	build: function() {
		topologyTree.setIconsPath('./javascripts/imgs/');
		topologyTree.enableItemEditor(0);

		topologyTree.loadJSArray(Tree.deploy(),function() {
			topologyTree.openItem('root:0');
		});

		topologyTree.attachEvent("onClearAll",treeToolbar.disableItem("delete"));
		Tree.addOnSelect(node_id);
		topologyTree.attachEvent("onDblClick", function(node_id) {
			if (node_id.split(":")[0] == 'network' || node_id.split(":")[0] == 'site') {
				topologyTree.enableItemEditor(1);
				topologyTree.editItem(node_id);
				topologyTree.enableItemEditor(0);
			}
		});
		
		// topologyTreeDP = new dataProcessor("../addresses/dbaction_tree_null.xml");
		
		Tree.addOnEdit();

		// onTreeUpdate = topologyTreeDP.attachEvent("onAfterUpdate", function() {
			// node_id = topologyTree.getSelectedItemId();
			// var parent_id = topologyTree.getParentId(node_id);
			// var text = topologyTree.getItemText(node_id);
// 	
			// if (node_id.split(":")[0] == 'network') {
				// var index = Networks.update_array(node_id, text);
				// Networks.update_store(networksArray[index]);
			// } else if (node_id.split(":")[0] == 'site') {
				// var index = Sites.update_array(node_id, text);
				// Sites.update_store(sitesArray[index]);
			// };
		// });
		// topologyTreeDP.init(topologyTree);
	},
	
	add_node: function() {
		node_id = topologyTree.getSelectedItemId();
		
		if ((node_id.split(":")[0] == 'root')||(node_id.split(":")[0] == 'network')) {
			if (node_id.split(":")[0] == 'root') {
				new_node_id = Networks.create();			
			} else if (node_id.split(":")[0] == 'network') {
				new_node_id = Sites.create(node_id);
			};
			// else if (node_id.split(":")[0] == 'site') {
				// new_node_id = 'subnet:' + uuid();
			// }
			
			topologyTree.enableItemEditor(1);
			// topologyTreeDP.detachEvent(onTreeUpdate);
			// topologyTree.detachEvent(onTreeUpdate);
			topologyTree.detachEvent(onTopologyTreeSelect);
			
			window.setTimeout( function() {
				
				topologyTree.insertNewChild(node_id,new_node_id,'',0,0,0,0,'SELECT');
				fixImage(new_node_id);
			},1);
		
			window.setTimeout( function() {
				topologyTree.editItem(new_node_id);
			},1);
		
			window.setTimeout( function() {
				Tree.addOnSelect(node_id);
				
				Tree.addOnEdit();
			},1000);
		};
			
			// onTreeUpdate = topologyTreeDP.attachEvent("onAfterUpdate", function() {
// 				
				// node_id = topologyTree.getSelectedItemId();
				// var parent_id = topologyTree.getParentId(node_id);
				// var text = topologyTree.getItemText(node_id);
// 		
				// if (node_id.split(":")[0] == 'network') {
					// var index = Networks.update_array(node_id, text);
					// Networks.update_store(networksArray[index]);
				// } else if (node_id.split(":")[0] == 'site') {
					// var index = Sites.update_array(node_id, text);
					// Sites.update_store(sitesArray[index]);
				// };
				// Tree.refresh(node_id);
			// });
	},
	
	delete_node: function() {
		node_id = topologyTree.getSelectedItemId();
		var parent_id = topologyTree.getParentId(node_id);
		
		topologyTree.deleteItem(node_id,true);
		
		if (node_id.split(":")[0] == "network") {
			Networks.delete_network(node_id);
		} else if (node_id.split(":")[0] == "site") {
			Sites.delete_site(node_id);	
		};
		treeToolbar.disableItem("add");
		treeToolbar.disableItem("delete");
		addressesToolbar.disableItem("add");
		addressesToolbar.disableItem("delete");
		subnetsToolbar.disableItem("add");
		subnetsToolbar.disableItem("delete");
		
		Tree.refresh(parent_id);
	},
	
	addOnEdit: function() {
		onTreeUpdate = topologyTree.attachEvent('onEdit', function(state,id,tree,value) {
			if (state=='0') {
				if ((id.split(":")[0] == 'network')||(id.split(":")[0] == 'site')) {
					return true;
				} else {
					return false;
				};
			} else if (state == '1') {
				return true;
			} else if (state == '2') {
				return true;
			} else if (state == '3') {
				node_id = topologyTree.getSelectedItemId();
				// var parent_id = topologyTree.getParentId(node_id);
				var text = topologyTree.getItemText(node_id);
				
				
				if (node_id.split(":")[0] == 'network') {
					var index = Networks.update_array(node_id, text);
					Networks.update_store(networksArray[index]);
				} else if (node_id.split(":")[0] == 'site') {
					var index = Sites.update_array(node_id, text);
					Sites.update_store(sitesArray[index]);
				};
				
				Tree.refresh(node_id);
				
				return false;
			};
		});
	},
	
	addOnSelect: function(id) {
		onTopologyTreeSelect = topologyTree.attachEvent("onSelect", function(node_id) {
			addressesGrid = addressesTab.attachGrid();
			showAddressesGrid(node_id);
			subnetsGrid = subnetsTab.attachGrid();
			showSubnetsGrid(node_id);
	
			if (node_id.split(":")[0] == 'root') {
				addressesToolbar.disableItem("add");
				subnetsToolbar.disableItem("add");
				addressesToolbar.disableItem("delete");
				subnetsToolbar.disableItem("delete");
				treeToolbar.enableItem("add");
				treeToolbar.disableItem("delete");			
			}
			else if (node_id.split(":")[0] == 'network') {
				addressesToolbar.disableItem("add");
				subnetsToolbar.disableItem("add");
				addressesToolbar.disableItem("delete");
				subnetsToolbar.disableItem("delete");
				treeToolbar.enableItem("add");
				if (topologyTree.hasChildren(node_id) == 0) {
					treeToolbar.enableItem("delete");	
				}
				else treeToolbar.disableItem("delete");
			}
			else if (node_id.split(":")[0] == 'site') {
				addressesToolbar.disableItem("add");
				subnetsToolbar.enableItem("add");
				addressesToolbar.disableItem("delete");
				subnetsToolbar.disableItem("delete");
				treeToolbar.disableItem("add");
				if (topologyTree.hasChildren(node_id) == 0) {
					treeToolbar.enableItem("delete");	
				}
				else treeToolbar.disableItem("delete");
			}
			else if (node_id.split(":")[0] == 'subnet') {
				addressesToolbar.enableItem("add");
				addressesToolbar.disableItem("delete");
				subnetsToolbar.disableItem("add");
				treeToolbar.disableItem("add");
				treeToolbar.disableItem("delete");
			}
		});
	}
	
};


//
//
//	CONTROLLER
//
//

function doOnLoad() {
	node_id = 'root:0';
	
	// networksArray = Networks.load_from_store();
	// sitesArray = Sites.load_from_store();
	// subnetsArray = Subnets.load_from_store();
	// addressesArray = Addresses.load_from_store();
	loadStore();
	
	dhtmlx.image_path='./javascripts/imgs/';

	main_layout = new dhtmlXLayoutObject(document.body, '2U');

	var a = main_layout.cells('a');
	a.setText('Topology');
	a.setWidth('290');
	treeToolbar = a.attachToolbar();
	treeToolbar.setIconsPath('../javascripts/imgs/');
	
	treeToolbar.addButton("add", 1, "Add","","");
	treeToolbar.addButton("delete", 2, "Delete","","");
	treeToolbar.addButton("clear", 3, "Clear Database","","");
	treeToolbar.disableItem("add");
	treeToolbar.disableItem("delete");
	treeToolbar.enableItem("clear");
	treeToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			Tree.add_node();
		else if (id == "delete")
			Tree.delete_node();
		else if (id == "clear")
			clearDatabase();
	});
	
	topologyTree = a.attachTree();
	
	Tree.build();

	var b = main_layout.cells('b');
	var contentTabbar = b.attachTabbar();
	contentTabbar.addTab('subnetsTab','Subnets','90');
	subnetsTab = contentTabbar.cells('subnetsTab');
	contentTabbar.setTabActive('subnetsTab');
	subnetsToolbar = subnetsTab.attachToolbar();
	subnetsToolbar.setIconsPath('./javascripts/imgs/');
	subnetsToolbar.addButton("add", 1, "Add Subnet","","");
	subnetsToolbar.addButton("delete", 2, "Delete Subnet","","");
	subnetsToolbar.disableItem("add");
	subnetsToolbar.disableItem("delete");
	subnetsToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			Subnets.add_to_grid();
		else if (id == "delete")
			Subnets.delete_subnet();
	});

	subnetsGrid = subnetsTab.attachGrid();
	showSubnetsGrid(node_id);

	contentTabbar.addTab('addressesTab','Addresses','110');
	addressesTab = contentTabbar.cells('addressesTab');
	addressesToolbar = addressesTab.attachToolbar();
	addressesToolbar.setIconsPath('./javascripts/imgs/');
	addressesToolbar.addButton("add", 1, "Add Address","","");
	addressesToolbar.addButton("delete", 2, "Delete Address","","");
	addressesToolbar.addSeparator("separator1",3);
	addressesToolbar.addButton("export_to_csv", 4, "Export to CSV","","");
	addressesToolbar.addButton("export_to_text", 5, "Export to Text","","");
	addressesToolbar.addSeparator("separator2",6);
	// http://www.quirksmode.org/dom/inputfile.html
	addressesToolbar.addButton("import_csv", 7, '<div class = "fileinputs"><input class="file" type="file" onChange="importCSV(this.files)" /><div class="fakefile">Import New Data</div></div>',"","");
	addressesToolbar.disableItem("add");
	addressesToolbar.disableItem("delete");
	addressesToolbar.enableItem("export_to_csv");
	addressesToolbar.enableItem("export_to_text");
	addressesToolbar.enableItem("import_csv");
	
	addressesToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			Addresses.add_to_grid();
		else if (id == "delete")
			Addresses.delete_address();
		else if (id == "export_to_csv")
			exportToCSV();
		else if (id == "export_to_text")
			exportToText();
	});

	addressesGrid = addressesTab.attachGrid();
	showAddressesGrid('root:0');

	topologyTree.selectItem(node_id,1,0);
}

function loadStore() {
	// 8.55s (1.12s 4.56s 826ms)
	// 10.07s (1.03 4.72 961)
	function network() {
		this.id = '';
		this.network_name = '';
	};
	function site() {
		this.id = '';
		this.site_name = '';
		this.network_id ='';
	};
	function subnet() {
		this.id = '';
		this.site_id = '';
		this.subnet_display_name = '';
		this.subnet_identifier = '';
		this.subnet_mask_length = '';
		this.subnet_name = '';
		this.subnet_default_router = '';
		this.subnet_description = '';
	};
	function address() {
		this.id = '';
		this.subnet_id = '';
		this.network_address = '';
		this.mask_length = '';
        this.system = '';
        this.url = '';
        this.description = '';
	};
	
	var address_records		= [];
	var subnet_records 		= [];
	var site_records		= [];
	var network_records		= [];
	var address_index		= 0;
	var subnet_index		= 0;
	var site_index			= 0;
	var network_index		= 0;
			
	var i,key;
	var records_index = 0;

	if (window.localStorage.length) { // verify localstorage is not empty
		for (i = 0; i < window.localStorage.length; i++) { // iterate through the storage records
			key = window.localStorage.key(i); // get the each key in succession
			
			if (/^address:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
				address_records[address_index] = new address();
			 	address_records[address_index] = (JSON.parse(window.localStorage.getItem(key)));
			 	address_index++;
			} else if (/^subnet:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
				subnet_records[subnet_index] = new subnet();
			 	subnet_records[subnet_index] = (JSON.parse(window.localStorage.getItem(key)));
			 	subnet_index++;
			} else if (/^site:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
				site_records[site_index] = new site();
			 	site_records[site_index] = (JSON.parse(window.localStorage.getItem(key)));
			 	site_index++;
			} else if (/^network:(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(key)) {
				network_records[network_index] = new network();
			 	network_records[network_index] = (JSON.parse(window.localStorage.getItem(key)));
			 	network_index++;
			}; 
		}
	}
	addressesArray = address_records.sort(function(a,b) {
		var x = a[0];
		var y = b[0];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	subnetsArray = subnet_records.sort(function(a,b) {
		var x = a[0];
		var y = b[0];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	sitesArray = site_records.sort(function(a,b) {
		var x = a[0];
		var y = b[0];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	networksArray = network_records.sort(function(a,b) {
		var x = a[0];
		var y = b[0];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});	
}

function fixImage(id) {
    switch (topologyTree.getLevel(id)) {
    case 1:
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    case 2:
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    case 3:
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    default:
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    }
}

function clearDatabase() {
	// location.href = "./addresses/clear_database";
	clear: localStorage.clear();
	networksArray.clear();
	sitesArray.clear();
	subnetsArray.clear();
	addressesArray.clear();
	
	Tree.refresh('root:0');
	return false;
}

function exportToCSV() {
	node_id = topologyTree.getSelectedItemId();
	// location.href = "./addresses/export_csv?id="+node_id;
	
	var array = Addresses.build_csv(node_id);
	var str = '';

	for (var i = 0; i < array.length; i++) {
	    var line = '';
	    for (var index = 0; index < array[i].length; index++) {
	        if (line != '') {
	        	line += ',';
	        };
			line += array[i][index];
		};
	 
	        str += line + '\r\n';
	};

	 
	// window.open("data:text/csv;base64," + data, "csvWindow");
	// window.open("data:text/csv;base64," + data, "csvWindow");
	location.href = "data:text/csv;base64," + Base64.encode(str);
}

function exportToText() {
	node_id = topologyTree.getSelectedItemId();
	// location.href = "./addresses/export_csv?id="+node_id;
	
	var array = Addresses.build_txt(node_id);
	var str = '';

	for (var i = 0; i < array.length; i++) {
        // str += array[i] + '<br>';
        str += array[i] + '\r\n';
	};
	location.href = "data:text/csv;base64," + Base64.encode(str);
	// window.open("data:text/csv;base64," + Base64.encode(str), "csvWindow");
	// output_window = window.open('','IP Addresses','width=600,height=400');
	// output_window.document.write(str);
	
}

function importCSV(uploadFiles) {
	// before any optimization: 21.29s 2:15pm
	// check network items against array instead of local storage: 20.99s (349; 10; 222) 2:27pm
	// check site items against array instead of local storage: 15.69s (295; 8; 232) 2:39pm
	// check subnet items against array instead of local storage: 4.47s (486; 22; 331) 3:18pm 
	// check address items against array instead of local storage: 4.11s (467 22 357) 3:39pm

	if(uploadFiles) {

		var fr = new FileReader();
		fr.onload = function(e) {
			
			var csvText = e.target.result; // from: http://www.cparker15.com/utilities/csv-to-json/
			var jsonText = "";
			var line = [];
			var row = [];
			
			if (csvText != "") { // Verify we have data
				row = csvText.split(/[\r\n]|\n/g);
				
				// Every other line will be empty - get rid of these empty lines
				for (var i = 0; i < row.length; i++) {
					if (row[i].replace(/^[\s]*|[\s]*$/g, '') == "")
					{
						row.splice(i, 1);
						i--;
					}
				}
				
				if (row.length > 1) { // Verify we have a header row
					
					var network_id, network_name;
					var site_name, site_id;

					// translate to json row by row
					for (var row_index = 1; row_index < row.length; row_index++) {
						
						// split the line into its components
						line = row[row_index].split(',');
						
						// remove extra spaces and quotation marks left over from the csv 
						for (i = 0; i < line.length; i++) {
							line[i] = line[i].replace(/^[\s\"]*|[\s\"]*$/g, "");
						};
						
						network_name			= line[0];
						site_name 				= line[1];
						subnet_display_name 	= line[2];
						subnet_identifier		= line[3];
						subnet_mask_length		= line[4];
						subnet_name				= line[5];
						subnet_default_router	= line[6];
						subnet_description		= line[7];
						network_address			= line[8];
						mask_length				= line[9];
						system					= line[10];
						url			 			= line[11];
						description				= line[12];

						// check if the network exists
						network_id = Networks.find_by_name(network_name);
						if (!network_id) {							
							network_id = Networks.add(network_name);
							Networks.add_to_array(network_id, network_name);
							site_id = ''; // we must create a new site for a new network
						} else {
							site_id = Sites.find_by_name(site_name, network_id);
						};
						
						// if site_id is still 0, we will need to create a new site 
						if (!site_id) {					
							site_id = Sites.add(site_name, network_id);
							Sites.add_to_array(site_id, network_id, site_name);
							subnet_id = ''; // a new site means this is a new subnet too
						} else {
							subnet_id = Subnets.find_by_subnet_identifier(subnet_identifier, site_id);
						};


						if (!subnet_id) {  // for a new subnet we are safe to create a new address
							subnet_id = Subnets.add(site_id, subnet_display_name, subnet_identifier, subnet_mask_length, subnet_name, subnet_default_router, subnet_description);
							Subnets.add_to_array(subnet_id, site_id, subnet_display_name, subnet_identifier, subnet_mask_length, subnet_name, subnet_default_router, subnet_description);
							address_id = Addresses.add(subnet_id, network_address, mask_length, system, url, description);
							Addresses.add_to_array(address_id, subnet_id, network_address, mask_length, system, url, description);
						// only create the address record if it doesn't already exist
						} else if (!Addresses.find_by_network_address(network_address, subnet_id)) { 
							address_id = Addresses.add(subnet_id, network_address, mask_length, system, url, description);
							Addresses.add_to_array(address_id, subnet_id, network_address, mask_length, system, url, description);
						}
						
					}
				}
			}
			node_id = 'root:0';
			
			Tree.refresh(node_id);
		};
		fr.readAsText(uploadFiles[0]);
	}
}
//
//
//	VIEW
//
//

//
//	addressesGrid
//

function showAddressesGrid(node_id) {

	if (node_id.split(":")[0] == 'root') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description","Site","Network"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed,ro,ro");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		addressesGrid.setColumnMinWidth('*,*,*,*,*,*,*,*');
		addressesGrid.setColAlign('right,center,center,center,left,left,center,center');
		addressesGrid.setColVAlign('top,top,top,top,top,top,top,top');
		addressesGrid.enableResizing('true,true,true,true,true,true,true,true');
		addressesGrid.enableTooltips('true,true,true,true,true,true,true,true');
		addressesGrid.setColSorting('str,str,str,str,str,str,str,str');
		addressesGrid.setInitWidths("100,80,100,120,150,150,100,100");
		addressesGrid.enableValidation(true, true);
		addressesGrid.setColValidators('ValidIPv4,ValidInteger,,,,,,');
		// addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
		addressesGrid.init();
		Addresses.build_grid(node_id);
		addressesGrid.enableStableSorting(true);
		addressesGrid.selectRow(0,1,0,1);
		
		addressesGridDP = new dataProcessor("../addresses/dbaction_grid_null.xml");
	}
	else if (node_id.split(":")[0] == 'network') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description","Site"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed,ro");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		addressesGrid.setColumnMinWidth('*,*,*,*,*,*,*');
		addressesGrid.setColAlign('right,center,center,center,left,left,center');
		addressesGrid.setColVAlign('top,top,top,top,top,top,top');
		addressesGrid.enableResizing('true,true,true,true,true,true,true');
		addressesGrid.enableTooltips('true,true,true,true,true,true,true');
		addressesGrid.setColSorting('str,str,str,str,str,str,str');
		addressesGrid.setInitWidths("100,80,100,120,150,150,100");
		addressesGrid.enableValidation(true, true);
		addressesGrid.setColValidators('ValidIPv4,ValidInteger,,,,,');
		// addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
		addressesGrid.init();
		Addresses.build_grid(node_id);
		addressesGrid.enableStableSorting(true);
		addressesGrid.selectRow(0,1,0,1);
	}
	else if (node_id.split(":")[0] == 'site') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		addressesGrid.setColumnMinWidth('*,*,*,*,*,*');
		addressesGrid.setColAlign('right,center,center,center,left,left');
		addressesGrid.setColVAlign('top,top,top,top,top,top');
		addressesGrid.enableResizing('true,true,true,true,true,true');
		addressesGrid.enableTooltips('true,true,true,true,true,true');
		addressesGrid.setColSorting('str,str,str,str,str,str');
		addressesGrid.setInitWidths("100,80,100,120,150,150");
		addressesGrid.enableValidation(true, true);
		addressesGrid.setColValidators('ValidIPv4,ValidInteger,,,,');
		// addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
		addressesGrid.init();
		Addresses.build_grid(node_id);
		addressesGrid.enableStableSorting(true);
		addressesGrid.selectRow(0,1,0,1);
	}
	else if (node_id.split(":")[0] == 'subnet') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Associated URLs","Description"]);
		addressesGrid.setColTypes("ed,ed,ed,ed,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter"]);
		addressesGrid.setColumnMinWidth('*,*,*,*,*');
		addressesGrid.setColAlign('right,center,center,left,left');
		addressesGrid.setColVAlign('top,top,top,top,top');
		addressesGrid.enableResizing('true,true,true,true,true');
		addressesGrid.enableTooltips('true,true,true,true,true');
		addressesGrid.setColSorting('str,str,str,str,str');
		addressesGrid.setInitWidths("100,80,100,150,150");
		addressesGrid.enableValidation(true, true);
		addressesGrid.setColValidators('ValidIPv4,ValidInteger,,,');
		// addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
		addressesGrid.init();
		Addresses.build_grid(node_id);
		addressesGrid.enableStableSorting(true);
		addressesGrid.selectRow(0,1,0,1);
	}
	
	// Select cell's content upon editing
	addressesGrid.attachEvent("onEditCell",function(stage,rId,cInd,nValue,oValue){
   		if(stage==1&&this.editor.obj){
      		this.editor.obj.select();
		}
		if(stage==2){
			if (nValue !== oValue) {
	      		var update_values = new Array();
	      		var i = 0;
	      		
	      		node_id = topologyTree.getSelectedItemId();
	      		
	      		update_values[i] = rId;
	      		i++;
	      		
	      		if (node_id.split(":")[0] == 'subnet') {
	      			for (var c = 0; c < 5; c++) {
	      				update_values[i] = addressesGrid.cells(rId,c).getValue();
	      				i++;
	      			}
	      		} else {
					for (var c = 0; c < 6; c++) {
	      				if (c !== 3) {
	      					update_values[i] = addressesGrid.cells(rId,c).getValue();
	      					i++;
	      				};
	      			}
	      		}
	      		var array_id = Addresses.update_array(update_values);
	      		Addresses.update_store(addressesArray[array_id]);
			}
		}
   		return true
	});

	onAddressRowSelect = addressesGrid.attachEvent("onRowSelect", function() {
		addressesToolbar.enableItem("delete");
	});
}

//
//	subnetsGrid
//

function showSubnetsGrid(node_id) {

	if (node_id.split(":")[0] == 'root') {
		subnetsGrid.setIconsPath('./javascripts/imgs/');
		
		subnetsGrid.setHeader(["Subnet","Mask","Display Name","Subnet Name","Gateway","Description","Site","Network"]);
		subnetsGrid.setColTypes("ed,ed,ed,ed,ed,ed,ro,ro");
		
		subnetsGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		subnetsGrid.setColAlign('right,left,center,center,center,left,center,center');
		subnetsGrid.enableTooltips('false,false,false,false,true,false,false,false');
		subnetsGrid.setColSorting('str,str,str,str,str,str,str,str');
		subnetsGrid.setInitWidths("100,80,120,100,100,150,100,100");
		subnetsGrid.enableValidation(true, false);
		subnetsGrid.setColValidators('ValidIPv4,ValidInteger,,,ValidIPv4,,,');
		// subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
		subnetsGrid.init();
		Subnets.build_grid(node_id);
		subnetsGrid.enableStableSorting(true);
		subnetsGrid.selectRow(0,1,0,1);
	}
	else if (node_id.split(":")[0] == 'network') {
		subnetsGrid.setIconsPath('./javascripts/imgs/');
		
		subnetsGrid.setHeader(["Subnet","Mask","Display Name","Subnet Name","Gateway","Description","Site"]);
		subnetsGrid.setColTypes("ed,ed,ed,ed,ed,ed,ro");
		
		subnetsGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		subnetsGrid.setColAlign('right,left,center,center,center,left,center');
		subnetsGrid.enableTooltips('false,false,false,false,true,false,false');
		subnetsGrid.setColSorting('str,str,str,str,str,str,str');
		subnetsGrid.setInitWidths("100,80,120,100,100,150,100");
		subnetsGrid.enableValidation(true, false);
		subnetsGrid.setColValidators('ValidIPv4,ValidInteger,,,ValidIPv4,,');
		// subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
		subnetsGrid.init();
		Subnets.build_grid(node_id);
		subnetsGrid.enableStableSorting(true);
		subnetsGrid.selectRow(0,1,0,1);
	}
	else if (node_id.split(":")[0] == 'site') {
		subnetsGrid.setIconsPath('./javascripts/imgs/');
		
		subnetsGrid.setHeader(["Subnet","Mask","Display Name","Subnet Name","Gateway","Description"]);
		subnetsGrid.setColTypes("ed,ed,ed,ed,ed,ed");
		
		subnetsGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		subnetsGrid.setColAlign('right,left,center,center,center,left');
		subnetsGrid.enableTooltips('false,false,false,false,true,false');
		subnetsGrid.setColSorting('str,str,str,str,str,str');
		subnetsGrid.setInitWidths("100,80,120,100,100,150");
		subnetsGrid.enableValidation(true, false);
		subnetsGrid.setColValidators('ValidIPv4,ValidInteger,,,ValidIPv4,');
		// subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
		subnetsGrid.init();
		Subnets.build_grid(node_id);
		subnetsGrid.enableStableSorting(true);
		subnetsGrid.selectRow(0,1,0,1);
	}
	else if (node_id.split(":")[0] == 'subnet') {
		subnetsGrid.setIconsPath('./javascripts/imgs/');
		
		subnetsGrid.setHeader(["Subnet","Mask","Display Name","Subnet Name","Gateway","Description"]);
		subnetsGrid.setColTypes("ed,ed,ed,ed,ed,ed");
		
		subnetsGrid.attachHeader(["#text_filter","#select_filter","#text_filter","#text_filter","#text_filter","#text_filter"]);
		subnetsGrid.setColAlign('right,left,center,center,center,left');
		subnetsGrid.enableTooltips('false,false,false,true,false');
		subnetsGrid.setColSorting('str,str,str,str,str,str');
		subnetsGrid.setInitWidths("100,80,120,100,100,150");
		subnetsGrid.enableValidation(true, false);
		subnetsGrid.setColValidators('ValidIPv4,ValidInteger,,,ValidIPv4,');
		// subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
		
		subnetsGrid.init();
		Subnets.build_grid(node_id);
		subnetsGrid.enableStableSorting(true);
		subnetsGrid.selectRow(0,1,0,1);
	}
	
	subnetsGrid.attachEvent("onEditCell",function(stage,rId,cInd,nValue,oValue){
   		if(stage==1&&this.editor.obj){
      		this.editor.obj.select();
		}
		if(stage==2){
			if (nValue !== oValue) {
	      		var update_values = new Array();
	      		var i = 0;
	      		
	      		node_id = topologyTree.getSelectedItemId();
	      		
	      		update_values[i] = rId;
	      		i++;

      			for (var c = 0; c < 6; c++) {
      				update_values[i] = subnetsGrid.cells(rId,c).getValue();
      				i++;
      			}
	      		var array_id = Subnets.update_array(update_values);
	      		Subnets.update_store(subnetsArray[array_id]);
			}
		}
   		return true
	});

	onSubnetRowSelect = subnetsGrid.attachEvent("onRowSelect", function() {
		if (addressesGrid.getRowsNum() == 0) subnetsToolbar.enableItem("delete");
	});
}