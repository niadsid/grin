// Issue list:
//   when changing values that don't impact the tree or sorting it would be nice to not reload
//	 When you start editing and then hit Esc it creates an empty entry - need to have it delete this entry
//	 need to be able to save the row without going to the next row
//   for heading 2 kill the sort direction controls
//   it would be nice to not have to reload from database when changing between view levels in the tree


var addressesTab,subnetsTab;
var topologyTree;
var addressesGridDP,subnetsGridDP,topologyTreeDP;
var onSubnetUpdate,onTreeUpdate;
var onAddressRowSelect,onSubnetRowSelect,onTopologyTreeSelect;
var main_layout;
var addressesGrid, subnetsGrid;
var addressesToolbar,subnetsToolbar,treeToolbar;
var node_id,new_node_id;

function doOnLoad() {
	node_id = 'root 0';
	
	dhtmlx.image_path='./javascripts/imgs/';

	main_layout = new dhtmlXLayoutObject(document.body, '2U');

	var a = main_layout.cells('a');
	a.setText('Topology');
	a.setWidth('290');
	treeToolbar = a.attachToolbar();
	treeToolbar.setIconsPath('../javascripts/imgs/');
	
	treeToolbar.addButton("add", 1, "Add","","");
	treeToolbar.addButton("delete", 2, "Delete","","");
	treeToolbar.disableItem("add");
	treeToolbar.disableItem("delete");
	treeToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			addNode();
		else
			deleteNode();
	});
	
	topologyTree = a.attachTree();
	topologyTree.setIconsPath('./javascripts/imgs/');
	topologyTree.enableItemEditor(0);
	topologyTree.loadXML('./addresses/tree.xml',function() {
		topologyTree.selectItem('root 0',1,0);
	});
	topologyTree.attachEvent("onClearAll",treeToolbar.disableItem("delete"));
	attachTopologyTreeOnSelect(node_id);
	topologyTree.attachEvent("onDblClick", function(node_id) {
		if (node_id.split(" ")[0] == 'root') {
			// Error event handler		
		}
		else if (node_id.split(" ")[0] == 'network' || node_id.split(" ")[0] == 'site') {
			topologyTree.enableItemEditor(1);
			topologyTree.editItem(node_id);
			topologyTree.enableItemEditor(0);
		}
		else {
			// Error event handler	
		}
	});
	
	topologyTreeDP = new dataProcessor("../addresses/dbaction_tree.xml");
	onTreeUpdate = topologyTreeDP.attachEvent("onAfterUpdate", function() {
		topologyTree.deleteChildItems(0);
		topologyTree.loadXML('./addresses/tree.xml',function() {
			// topologyTree.openAllItems(0);
			topologyTree.selectItem(node_id);
			topologyTree.enableItemEditor(0);
		});
	});
	topologyTreeDP.init(topologyTree);

	
	var b = main_layout.cells('b');
	var contentTabbar = b.attachTabbar();
	contentTabbar.addTab('subnetsTab','Subnets','90');
	subnetsTab = contentTabbar.cells('subnetsTab');
	contentTabbar.setTabActive('subnetsTab');
	subnetsToolbar = subnetsTab.attachToolbar();
	subnetsToolbar.setIconsPath('./javascripts/imgs/');
	subnetsToolbar.addButton("add", 1, "Add Subnet","","");
	subnetsToolbar.addButton("delete", 2, "Delete Subnet","","");
	subnetsToolbar.addButton("export_to_excel", 3, "Export to Excel","","");
	subnetsToolbar.addButton("export_to_text", 4, "Export to Text","","");
	subnetsToolbar.disableItem("add");
	subnetsToolbar.disableItem("delete");
	subnetsToolbar.disableItem("export_to_excel");
	subnetsToolbar.disableItem("export_to_text");
	subnetsToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			addSubnet();
		else if (id == "delete")
			deleteSubnet();
	});

	subnetsGrid = subnetsTab.attachGrid();
	showSubnetsGrid(node_id);
	


	contentTabbar.addTab('addressesTab','Addresses','110');
	addressesTab = contentTabbar.cells('addressesTab');
	addressesToolbar = addressesTab.attachToolbar();
	addressesToolbar.setIconsPath('./javascripts/imgs/');
	addressesToolbar.addButton("add", 1, "Add Address","","");
	addressesToolbar.addButton("delete", 2, "Delete Address","","");
	addressesToolbar.addButton("export_to_excel", 3, "Export to Excel","","");
	addressesToolbar.addButton("export_to_text", 4, "Export to Text","","");
	addressesToolbar.disableItem("add");
	addressesToolbar.disableItem("delete");
	addressesToolbar.disableItem("export_to_excel");
	addressesToolbar.disableItem("export_to_text");
	addressesToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			addAddress();
		else if (id == "delete")
			deleteAddress();
	});

	addressesGrid = addressesTab.attachGrid();
	showAddressesGrid('root 0');

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

function addNode() {
	
	node_id = topologyTree.getSelectedItemId();
	
	if (node_id.split(" ")[0] == 'root') {
		new_node_id = 'network ' + '1' + Math.floor(Math.random()*999999999);
		// alert('network '+network);				
	}
	else if (node_id.split(" ")[0] == 'network') {
		new_node_id = 'site ' + '1' + Math.floor(Math.random()*999999999);
		// alert('network '+network);
	}
	else if (node_id.split(" ")[0] == 'site') {
		// alert('subnet '+subnet);
		new_node_id = 'subnet ' + '1' + Math.floor(Math.random()*999999999);
	}
	else {
		// error handler
	}
	
	topologyTree.enableItemEditor(1);
	topologyTreeDP.detachEvent(onTreeUpdate);
	topologyTree.detachEvent(onTopologyTreeSelect);
	
	window.setTimeout( function() {
		topologyTree.insertNewChild(node_id,new_node_id,'',0,0,0,0,'SELECT');
		fixImage(new_node_id);
	},1);

	window.setTimeout( function() {
		topologyTree.editItem(new_node_id);
	},1);

	window.setTimeout( function() {
		attachTopologyTreeOnSelect(node_id);
		onTreeUpdate = topologyTreeDP.attachEvent("onAfterUpdate", function() {
			topologyTree.deleteChildItems(0);
			topologyTree.loadXML('./addresses/tree.xml',function() {
				// topologyTree.openAllItems(0);
				topologyTree.selectItem(node_id);
				topologyTree.enableItemEditor(0);
			});
		});
	},1000);
}

function deleteNode() {
	node_id = topologyTree.getSelectedItemId();
	
	topologyTree.deleteItem(node_id,true);
	treeToolbar.disableItem("add");
	treeToolbar.disableItem("delete");
	addressesToolbar.disableItem("add");
	addressesToolbar.disableItem("delete");
	subnetsToolbar.disableItem("add");
	subnetsToolbar.disableItem("delete");
}

function attachTopologyTreeOnSelect(node_id) {
	onTopologyTreeSelect = topologyTree.attachEvent("onSelect", function(node_id) {
		addressesGrid = addressesTab.attachGrid();
		showAddressesGrid(node_id);
		subnetsGrid = subnetsTab.attachGrid();
		showSubnetsGrid(node_id);

		if (node_id.split(" ")[0] == 'root') {
			addressesToolbar.disableItem("add");
			subnetsToolbar.disableItem("add");
			addressesToolbar.disableItem("delete");
			subnetsToolbar.disableItem("delete");
			treeToolbar.enableItem("add");
			treeToolbar.disableItem("delete");			
		}
		else if (node_id.split(" ")[0] == 'network') {
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
		else if (node_id.split(" ")[0] == 'site') {
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
		else if (node_id.split(" ")[0] == 'subnet') {
			addressesToolbar.enableItem("add");
			addressesToolbar.disableItem("delete");
			subnetsToolbar.disableItem("add");
			treeToolbar.disableItem("add");
			treeToolbar.disableItem("delete");
		}
	});
}

//
//	addressesGrid
//

function exploreAddressesNode(node_id) {
	topologyTree.openItem(node_id);
	showAddressesGrid(node_id);
	alert('hey');
}
function showAddressesGrid(node_id) {

	if (node_id.split(" ")[0] == 'root') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description","Site","Network"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed,ro,ro");
		
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
		addressesGrid.load('./addresses/view_all.xml', function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.selectRow(0,1,0,1);
		});
		
		addressesGridDP = new dataProcessor("../addresses/dbaction_all.xml");
	}
	else if (node_id.split(" ")[0] == 'network') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description","Site"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed,ro");
		
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
		addressesGrid.load('./addresses/view_by_network.xml?id='+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.selectRow(0,1,0,1);
		});
		
		addressesGridDP = new dataProcessor("../addresses/dbaction_network.xml?id="+node_id);
	}
	else if (node_id.split(" ")[0] == 'site') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Subnet","Associated URLs","Description"]);
		addressesGrid.setColTypes("ed,ed,ed,ro,ed,ed");
		
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
		addressesGrid.load('./addresses/view_by_site.xml?id='+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.selectRow(0,1,0,1);
		});
		
		addressesGridDP = new dataProcessor("../addresses/dbaction_site.xml?id="+node_id);
	}
	else if (node_id.split(" ")[0] == 'subnet') {
		addressesGrid.setIconsPath('./javascripts/imgs/');
		
		addressesGrid.setHeader(["Address","Mask","System","Associated URLs","Description"]);
		addressesGrid.setColTypes("ed,ed,ed,ed,ed");
		// addressesGrid.enableEditTabOnly(1);
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
		addressesGrid.load('./addresses/view_by_subnet.xml?id='+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.selectRow(0,1,0,1);
		});
		
		addressesGridDP = new dataProcessor("../addresses/dbaction_subnet.xml?id="+node_id);
	}
	
	// addressesGridDP.attachEvent("onAfterUpdate", function() {
		// window.setTimeout( function() {
			// addressesGrid.clearSelection();
		// },1);
	// });
	
	// Select cell's content upon editing
	addressesGrid.attachEvent("onEditCell",function(stage,rowId,columnIndex){
   		if(stage==1&&this.editor.obj){
      		this.editor.obj.select();
		}
   		return true
	});
	
	addressesGridDP.setUpdateMode("row");
	addressesGridDP.init(addressesGrid);
	onAddressRowSelect = addressesGrid.attachEvent("onRowSelect", function() {
		addressesToolbar.enableItem("delete");
	});
}

function addressClearFilter() {
	addressesGrid.filterBy(0,"");
	addressesGrid._f_rowsBuffer = null;
}

function addAddress() {
	var newID = addressesGrid.uid();
	
	addressClearFilter();
	
	addressesGrid.addRow(newID,",,,,",0);
	addressesGrid.selectCell(addressesGrid.getRowIndex(newID),0,false,true,true);
	addressesGrid.clearSelection();  // focus jumps out of the control after the first cell without this
	window.setTimeout( function() {  // this wait is needed for the cell to actuall go into edit mode
		addressesGrid.selectRow(0);
		addressesGrid.editCell();
	},1);
}

function deleteAddress() {
	addressesGridDP.setUpdateMode("cell"); // update mode "cell" will allow immediate deletion
	addressClearFilter();
	window.setTimeout( function() {  // VERIFY NEED
		addressesGrid.deleteSelectedRows();
	},1000);
	
	window.setTimeout( function() {	// VERIFY NEED
		addressesGridDP.setUpdateMode("row"); // turn update mode back to "row" for normal behavior
	},1000);
	
	addressesToolbar.disableItem("delete");
}

//
//	subnetsGrid
//

function showSubnetsGrid(node_id) {

	if (node_id.split(" ")[0] == 'root') {
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
		subnetsGrid.load('./subnets/view_all.xml', 'xml');
		
		subnetsGridDP = new dataProcessor("../subnets/dbaction_all.xml");
	}
	else if (node_id.split(" ")[0] == 'network') {
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
		subnetsGrid.load('./subnets/view_by_network.xml?id='+node_id, 'xml');
		
		subnetsGridDP = new dataProcessor("../subnets/dbaction_network.xml?id="+node_id);
	}
	else if (node_id.split(" ")[0] == 'site') {
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
		subnetsGrid.load('./subnets/view_by_site.xml?id='+node_id, function() {
			subnetsGrid.enableStableSorting(true);
			subnetsGrid.sortRows(1,"str","asc");
		});
		
		subnetsGridDP = new dataProcessor("../subnets/dbaction_site.xml?id="+node_id);
		
		// subnetsGrid.enableEditTabOnly(1);
		// subnetsGrid.enableAlterCss("even","uneven");

		// subnetsGrid.attachEvent("onClearAll",subnetsToolbar.disableItem("delete"));
		
		// /* addressesGrid.attachEvent("onRowDblClicked",function(id){
		 // addressesTree.selectItem(id,true);
		 // showFileContent(id);
		 // }) */
	}
	else if (node_id.split(" ")[0] == 'subnet') {
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
		
		subnetsGrid.load('./subnets/view_by_subnet.xml?id='+node_id, function() {
			subnetsGrid.enableStableSorting(true);
			subnetsGrid.sortRows(1,"str","asc");
			subnetsGrid.selectRow(0,1,0,1);
		});
		
		subnetsGridDP = new dataProcessor("../subnets/dbaction_subnet.xml?id="+node_id);
	}

	onSubnetUpdate = subnetsGridDP.attachEvent("onAfterUpdate", function() {
		topologyTree.deleteChildItems(0);
		topologyTree.loadXML('./addresses/tree.xml',function() {
			// topologyTree.openAllItems(0);
			topologyTree.selectItem(node_id);
		});
	});
	
	// Select cell's content upon editing
	subnetsGrid.attachEvent("onEditCell",function(stage,rowId,columnIndex){
   		if(stage==1&&this.editor.obj){
      		this.editor.obj.select();
		}
   		return true
	});
	
	subnetsGridDP.setUpdateMode("row");
	subnetsGridDP.init(subnetsGrid);
	onSubnetRowSelect = subnetsGrid.attachEvent("onRowSelect", function() {
		if (addressesGrid.getRowsNum() == 0) subnetsToolbar.enableItem("delete");
	});
}

function subnetClearFilter() {
	subnetsGrid.filterBy(0,"");
	subnetsGrid._f_rowsBuffer = null;
}


	var newID = addressesGrid.uid();
	
	addressClearFilter();
	
	addressesGrid.addRow(newID,",,,,",0);
	addressesGrid.selectCell(addressesGrid.getRowIndex(newID),0,false,true,true);
	addressesGrid.clearSelection();  // focus jumps out of the control after the first cell without this
	window.setTimeout( function() {  // this wait is needed for the cell to actuall go into edit mode
		addressesGrid.selectRow(0);
		addressesGrid.editCell();
	},1);

function addSubnet() {
	var newID = subnetsGrid.uid();
	
	subnetsGridDP.detachEvent(onSubnetUpdate);
	
	subnetClearFilter();
	subnetsGrid.addRow(newID,",,,,",0);
	subnetsGrid.selectCell(subnetsGrid.getRowIndex(newID),0,false,true,true);
	subnetsGrid.clearSelection();
	window.setTimeout( function() {
		subnetsGrid.selectRow(subnetsGrid.getRowIndex(newID))
		subnetsGrid.editCell();
	},1);

	window.setTimeout( function() {
		onSubnetUpdate = subnetsGridDP.attachEvent("onAfterUpdate", function() {
			topologyTree.deleteChildItems(0);
			topologyTree.loadXML('./addresses/tree.xml',function() {
				// topologyTree.openAllItems(0);
				topologyTree.selectItem(node_id);
			});
		});
	},1000);
}

function deleteSubnet() {
	subnetsGridDP.setUpdateMode("cell"); // update mode "cell" will allow immediate deletion
	subnetClearFilter();
	
	window.setTimeout( function() {  // VERIFY NEED
		subnetsGrid.deleteSelectedRows();
	},1000);				
	
	window.setTimeout( function() {	// VERIFY NEED
		subnetsGridDP.setUpdateMode("row"); // turn update mode back to "row" for normal behavior
	},1000);
	
	subnetsToolbar.disableItem("delete");
}