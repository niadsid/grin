var treeToolbar;
var topologyTree;
var main_layout;
var addressesTree;
var addressesGrid;
var addressesToolbar;
var myTabbar;
var root,network,site,subnet;
var node_id,new_node_id;

function doOnLoad() {
	dhtmlx.image_path='./javascripts/imgs/';



	var main_layout = new dhtmlXLayoutObject(document.body, '2U');

	var a = main_layout.cells('a');
	a.setText('Topology');
	a.setWidth('270');
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
		topologyTree.openAllItems(0);
	});
	topologyTree.attachEvent("onClearAll",treeToolbar.disableItem("delete"));
	topologyTree.attachEvent("onSelect", function(node_id) {		
		if (node_id.split(" ")[0] == 'root') {
			treeToolbar.enableItem("add");
			treeToolbar.disableItem("delete");
			// alert('network '+network);				
		}
		else if (node_id.split(" ")[0] == 'network') {
			treeToolbar.enableItem("add");
			if (topologyTree.hasChildren(node_id) == 0) {
				treeToolbar.enableItem("delete");	
			}
			else treeToolbar.disableItem("delete");
		}
		else if (node_id.split(" ")[0] == 'site') {
			treeToolbar.disableItem("add");
			if (topologyTree.hasChildren(node_id) == 0) {
				treeToolbar.enableItem("delete");	
			}
			else treeToolbar.disableItem("delete");
		}
		else {
			treeToolbar.disableItem("add");
			treeToolbar.disableItem("delete");
		}
	});
	topologyTree.attachEvent("onDblClick", function(node_id) {
		if (node_id.split(" ")[0] == 'root') {
			// Error event handler		
		}
		else if (node_id.split(" ")[0] == 'network') {
			topologyTree.enableItemEditor(1);

			window.setTimeout( function() {
				topologyTree.editItem(node_id);
			},1);
			topologyTree.deleteChildItems(0);
			topologyTree.loadXML('./addresses/tree.xml',function() {
				topologyTree.openAllItems(0);
				topologyTree.selectItem(new_node_id)
			});
			// window.setTimeout( function(node_id) {
				// topologyTree.editItem();
			//},1);
			topologyTree.enableItemEditor(0);
		}
		else if (node_id.split(" ")[0] == 'site') {

		}
		else {

		}
	});
	// topologyTree.attachEvent("onDblClick", function(node_id) {
		// if (node_id.split(" ")[0] == 'root') {
			// // Error event handler		
		// }
		// else if (node_id.split(" ")[0] == 'network') {
			// topologyTree.enableItemEditor(1);
			// topologyTree.editItem(node_id);
			// // window.setTimeout( function(node_id) {
				// // topologyTree.editItem();
			// //},1);
			// topologyTree.enableItemEditor(0);
		// }
		// else if (node_id.split(" ")[0] == 'site') {
// 
		// }
		// else {
// 
		// }
	// });
	// topologyTree.attachEvent("onEdit", function(state,id,tree,value){
		// switch (state) {
			// case 0:
			// break
			// case 1:
			// break
			// case 2:
			// break
			// case 3: alert('hi '+state+' '+id+' '+value);
				// window.setTimeout(xmlhttprequest,1);
				// // topologyTree.loadXML('./addresses/tree.xml',function() {
					// // topologyTree.selectItem(node_id);	
			// break
			// default:
		// }
	// });
	topologyTreeDP = new dataProcessor("../addresses/dbaction_tree.xml");
	// topologyTreeDP.attachEvent("onAfterUpdate", function() {
    	// // doLog("Item was " + cType + "ed. Item id is " + newId);
		// // });
	// });
	// topologyTreeDP.attachEvent("onFullSync", function() {
    	// // doLog("Item was " + cType + "ed. Item id is " + newId);
    	// topologyTree.deleteChildItems(0);
		// topologyTree.loadXML('./addresses/tree.xml',function() {
			// topologyTree.openAllItems(0);
			// topologyTree.selectItem(node_id);
		// });
	// });
	topologyTreeDP.init(topologyTree);
	



	var b = main_layout.cells('b');
	var contentTabbar = b.attachTabbar();
	contentTabbar.addTab('addressesTab','Addresses','110');
	var addressesTab = contentTabbar.cells('addressesTab');
	contentTabbar.setTabActive('addressesTab');
	var addressesToolbar = addressesTab.attachToolbar();
	addressesToolbar.setIconsPath('./javascripts/imgs/');
	addressesToolbar.addButton("add", 1, "Add Address","","");
	addressesToolbar.addButton("delete", 2, "Delete Address","","");
	addressesToolbar.addButton("export_to_excel", 3, "Export to Excel","","");
	addressesToolbar.addButton("export_to_text", 4, "Export to Text","","");
	addressesToolbar.disableItem("add");
	addressesToolbar.disableItem("delete");
	addressesToolbar.disableItem("export_to_excel");
	addressesToolbar.disableItem("export_to_text");
	
	var addressesGrid = addressesTab.attachGrid();
	addressesGrid.setIconsPath('./javascripts/imgs/');
	addressesGrid.enableMultiline(true);
	
	addressesGrid.setHeader(["Network","Site","Subnet","Address","Mask","System","Associated URLs","Description"]);
	addressesGrid.setColTypes("ro,ro,ro,ed,ed,ed,txt,txt");
	
	addressesGrid.attachHeader(["#text_filter","#text_filter","#text_filter","#text_filter","#select_filter","#text_filter","#text_filter","#text_filter"]);
	addressesGrid.setColumnMinWidth('*,*,*,*,*,*,*,*');
	addressesGrid.setColAlign('center,center,center,right,center,center,left,left');
	addressesGrid.setColVAlign('top,top,top,top,top,top,top,top');
	addressesGrid.enableResizing('true,true,true,true,true,true,true,true');
	addressesGrid.enableTooltips('false,false,false,true,true,true,true,true');
	addressesGrid.setColSorting('str,str,str,str,str,str,str,str');
	addressesGrid.setInitWidths("100,100,100,100,60,100,150,*");
	addressesGrid.enableValidation(true, true);
	addressesGrid.setColValidators(',,,ValidIPv4,ValidInteger,,,');
	addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
	addressesGrid.init();
	addressesGrid.load('./addresses/view_all.xml', 'xml');
	

	contentTabbar.addTab('subnetsTab','Subnets','90');
	var subnetsTab = contentTabbar.cells('subnetsTab');
	var subnetsToolbar = subnetsTab.attachToolbar();
	subnetsToolbar.setIconsPath('./javascripts/imgs/');
	subnetsToolbar.addButton("add", 1, "Add Address","","");
	subnetsToolbar.addButton("delete", 2, "Delete Address","","");
	subnetsToolbar.addButton("export_to_excel", 3, "Export to Excel","","");
	subnetsToolbar.addButton("export_to_text", 4, "Export to Text","","");
	subnetsToolbar.disableItem("add");
	subnetsToolbar.disableItem("delete");
	subnetsToolbar.disableItem("export_to_excel");
	subnetsToolbar.disableItem("export_to_text");

	var subnetsGrid = subnetsTab.attachGrid();
	subnetsGrid.setIconsPath('./javascripts/imgs/');
	
	subnetsGrid.setHeader(["Network","Site","Subnet Name","Subnet","Mask","Default Router","Description"]);
	subnetsGrid.setColTypes("ro,ro,ro,ed,ed,ed,txt");
	
	subnetsGrid.attachHeader(["#text_filter","#text_filter","#text_filter","#text_filter","#select_filter","#text_filter",""]);
	subnetsGrid.setColAlign('center,center,center,right,left,center,left');
	subnetsGrid.enableTooltips('false,false,false,true,false,false,false');
	subnetsGrid.setColSorting('str,str,str,str,str,str,str');
	subnetsGrid.setInitWidths("100,100,100,100,60,120,*");
	subnetsGrid.enableValidation(true, false);
	subnetsGrid.setColValidators(',,,ValidIPv4,ValidInteger,,');
	subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
	subnetsGrid.init();
	subnetsGrid.load('./subnets/view_all.xml', 'xml');
}

function fixImage(id) {
    switch (topologyTree.getLevel(id)) {
    case 1:
        ;
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    case 2:
        ;
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    case 3:
        ;
        topologyTree.setItemImage2(id, 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif');
        break;
    default:
        ;
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
	}
	else {
		// error handler
	}
	// alert("node_id is: "+node_id);
	// alert("network is: "+network);
	topologyTree.enableItemEditor(1);
	
	topologyTree.insertNewItem(node_id,new_node_id,"node: "+new_node_id,0,0,0,0,'SELECT');
	fixImage(new_node_id);
	
	// topologyTree.insertNewNext(node_id,d.valueOf(),"New Node",0,0,0,0,'SELECT'); fixImage(d.valueOf());
	// topologyTree.insertNewNext(3, 4, "hello there");
	
	// window.setTimeout( function() {
		// topologyTree.editItem();
	// },1);
	topologyTree.deleteChildItems(0);
	topologyTree.loadXML('./addresses/tree.xml',function() {
		topologyTree.openAllItems(0);
		topologyTree.selectItem(new_node_id);
		topologyTree.enableItemEditor(0);
	});
	
}

function deleteNode() {
	var node_id = topologyTree.getSelectedItemId();
	// alert(node_id);
	
	topologyTree.deleteItem(node_id,true);
	treeToolbar.disableItem("add");
	treeToolbar.disableItem("delete");
}