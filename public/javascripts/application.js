var addressesLayout;
var addressesTree;
var addressesGrid;
var addressesToolbar;
var myTabbar;

function doOnLoad() {

	myTabbar = new dhtmlXTabBar(document.body, "top");
	myTabbar.setImagePath("../javascripts/imgs/");
	myTabbar.addTab("tab1", "IP Addresses", "140px");
	myTabbar.setTabActive("tab1");

	addressesLayout = myTabbar.cells("tab1").attachLayout("3L");

	addressesLayout.cells("a").setWidth(250);
	addressesLayout.cells("a").setText("Addresses");
	addressesLayout.cells("b").hideHeader();
	addressesLayout.cells("c").setText("Address Details");

	addressesTree = addressesLayout.cells("a").attachTree("0");
	addressesTree.setImagePath("../javascripts/imgs/");
	addressesTree.enableDragAndDrop('1', true);
	addressesTree.enableItemEditor(1);
	addressesTree.loadXML("../addresses/tree.xml");
	addressesTree.attachEvent("onSelect",exploreAddressesNode);
	addressesToolbar = addressesLayout.cells("b").attachToolbar();
	addressesToolbar.setIconsPath("../javascripts/imgs/");
	addressesToolbar.addButton("add", 1, "Add Address","","");
	addressesToolbar.addButton("delete", 2, "Delete Address","","");
	addressesToolbar.addButton("export", 3, "Export","","");
	addressesToolbar.disableItem("add");
	addressesToolbar.disableItem("delete");
	addressesToolbar.disableItem("export");
	addressesToolbar.attachEvent("onClick", function(id) {
		if (id == "add")
			addAddress();
		else if (id == "delete")
			deleteAddress();
	});
}

//
//	addressesGrid
//

function exploreAddressesNode(node_id) {
	addressesTree.openItem(node_id);
	showAddressesGrid(node_id);
}
function showAddressesGrid(node_id) {
	addressesGrid = addressesLayout.cells("b").attachGrid();
	addressesGrid.setImagePath("../javascripts/imgs/");

	if (node_id == "All IP Addresses" || node_id == "0") {
		addressesToolbar.disableItem("add");
		addressesToolbar.disableItem("delete");
		addressesGrid.setHeader("Network, Site, Subnet, IP Address, Mask, System, Description");
		addressesGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#select_filter,#text_filter,#text_filter");
		addressesGrid.setSizes();
		addressesGrid.setColSorting("str,str,str,str,int,str,str");
		addressesGrid.setColTypes("ro,ro,ro,ed,ed,ro,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.setInitWidths("100,100,100,100,50,150,*");
		addressesGrid.setColAlign("center,center,center,right,center,left,left");
		addressesGrid.enableAlterCss("even","uneven");
		addressesGrid.load("../addresses/view_all.xml", function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(3,"str","asc");
			addressesGrid.sortRows(2,"str","asc");
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.sortRows(0,"str","asc");
		});
		/* addressesGrid.attachEvent("onRowDblClicked",function(id){
		 addressesTree.selectItem(id,true);
		 showFileContent(id);
		 }) */
		addressesGrid.attachEvent("onRowSelect", function() {
			addressesToolbar.enableItem("delete")
		});
		addressesGrid.attachEvent("onClearAll",addressesToolbar.disableItem("delete"));

		addressesGrid.init();

		addressesDP = new dataProcessor("../addresses/dbaction_all.xml");
		addressesDP.init(addressesGrid);
	} else if (node_id.split(" ")[2]) {
		addressesToolbar.enableItem("add");
		addressesToolbar.disableItem("delete");
		addressesGrid.setHeader("IP Address, Mask, System, Description");
		addressesGrid.attachHeader("#text_filter,#select_filter,#text_filter,#text_filter");
		addressesGrid.setSizes();
		addressesGrid.setColSorting("str,int,str,str");
		addressesGrid.setColTypes("ed,ed,ro,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.setInitWidths("100,50,100,*");
		addressesGrid.setColAlign("right,left,left,left");
		// addressesGrid.enableAlterCss("even_row","odd_row");
		addressesGrid.load("../addresses/view_by_subnet.xml?id="+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(0,"str","asc");
		});
		/* addressesGrid.attachEvent("onRowDblClicked",function(id){
		 addressesTree.selectItem(id,true);
		 showFileContent(id);
		 }) */
		addressesGrid.attachEvent("onRowSelect", function() {
			addressesToolbar.enableItem("delete")
		});
		addressesGrid.attachEvent("onClearAll",addressesToolbar.disableItem("delete"));

		addressesGrid.init();

		addressesDP = new dataProcessor("../addresses/dbaction_subnet.xml?id="+node_id);
		addressesDP.init(addressesGrid);
	} else if (node_id.split(" ")[1]) {
		addressesToolbar.disableItem("add");
		addressesToolbar.disableItem("delete");
		addressesGrid.setHeader("Subnet, IP Address, Mask, System, Description");
		addressesGrid.attachHeader("#text_filter,#text_filter,#select_filter,#text_filter,#text_filter");
		addressesGrid.setSizes();
		addressesGrid.setColSorting("str,str,int,str,str");
		addressesGrid.setColTypes("ro,ed,ed,ro,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.setInitWidths("100,100,50,100,*");
		addressesGrid.setColAlign("center,right,left,left,left");
		// addressesGrid.enableAlterCss("even_row","odd_row");
		addressesGrid.load("../addresses/view_by_site.xml?id="+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.sortRows(0,"str","asc");
		});
		/* addressesGrid.attachEvent("onRowDblClicked",function(id){
		 addressesTree.selectItem(id,true);
		 showFileContent(id);
		 }) */
		addressesGrid.attachEvent("onRowSelect", function() {
			addressesToolbar.enableItem("delete")
		});
		addressesGrid.attachEvent("onClearAll",addressesToolbar.disableItem("delete"));

		addressesGrid.init();

		addressesDP = new dataProcessor("../addresses/dbaction_site.xml?id="+node_id);
		addressesDP.init(addressesGrid);
	} else {
		addressesToolbar.disableItem("add");
		addressesToolbar.disableItem("delete");
		addressesGrid.setHeader("Site, Subnet, IP Address, Mask, System, Description");
		addressesGrid.attachHeader("#text_filter,#text_filter,#text_filter,#select_filter,#text_filter,#text_filter");
		addressesGrid.setSizes();
		addressesGrid.setColSorting("str,str,str,int,str,str");
		addressesGrid.setColTypes("ro,ro,ed,ed,ro,ed");
		addressesGrid.enableEditTabOnly(1);
		addressesGrid.setInitWidths("100,100,100,50,100,*");
		addressesGrid.setColAlign("center,center,right,left,left,left");
		// addressesGrid.enableAlterCss("even_row","odd_row");
		addressesGrid.load("../addresses/view_by_network.xml?id="+node_id, function() {
			addressesGrid.enableStableSorting(true);
			addressesGrid.sortRows(2,"str","asc");
			addressesGrid.sortRows(1,"str","asc");
			addressesGrid.sortRows(0,"str","asc");
		});
		/* addressesGrid.attachEvent("onRowDblClicked",function(id){
		 addressesTree.selectItem(id,true);
		 showFileContent(id);
		 }) */
		addressesGrid.attachEvent("onRowSelect", function() {
			addressesToolbar.enableItem("delete")
		});
		addressesGrid.attachEvent("onClearAll",addressesToolbar.disableItem("delete"));

		addressesGrid.init();

		addressesDP = new dataProcessor("../addresses/dbaction_network.xml?id="+node_id);
		addressesDP.init(addressesGrid);
	}
}

function addressClearFilter() {
	addressesGrid.filterBy(0,"");
	addressesGrid._f_rowsBuffer = null;
}

function addAddress() {
	addressClearFilter();
	addressesGrid.addRow(addressesGrid.uid(),['','','',''],0);
	addressesGrid.selectCell(0,0,false,true,true);
	window.setTimeout( function() {
		addressesGrid.editCell();
	},1);
}

function deleteAddress() {
	addressClearFilter();
	addressesGrid.deleteSelectedRows();
}