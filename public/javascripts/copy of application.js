var main_layout;
var addressesTree;
var addressesGrid;
var addressesToolbar;
var myTabbar;

function doOnLoad() {

	dhtmlx.image_path='../javascripts/imgs/';

	main_layout = new dhtmlXLayoutObject(document.body, '2U');

	// Layout cell a
	var a = main_layout.cells('a');
	var treeToolbar = a.attachToolbar();
	treeToolbar.setIconsPath('./codebase/imgs/');
	
	var tree_2 = a.attachTree();
	tree_2.setIconsPath('./codebase/imgs/');
	tree_2.loadXML('./data/tree.xml');
	
	// Layout cell b
	var b = main_layout.cells('b');
	var toolbar_4 = b.attachToolbar();
	toolbar_4.setIconsPath('./codebase/imgs/');
	
	var grid_1 = b.attachGrid();
	grid_1.setIconsPath('./codebase/imgs/');
	grid_1.enableMultiline(true);
	
	grid_1.setHeader(["Column 1","Column 2"]);
	grid_1.setColTypes("ro,ro");
	
	grid_1.setColSorting('str,str');
	grid_1.init();
	grid_1.load('./data/grid.xml', 'xml');
	
	
	myTabbar.cells("tab1").attachLayout("3L");

	main_layout.cells("a").setWidth(250);
	main_layout.cells("a").setText("Addresses");
	main_layout.cells("b").hideHeader();
	main_layout.cells("c").setText("Address Details");


	myTabbar = new dhtmlXTabBar(document.body, "top");
	myTabbar.setImagePath("../javascripts/imgs/");
	myTabbar.addTab("tab1", "IP Addresses", "140px");
	myTabbar.setTabActive("tab1");


	addressesTree = main_layout.cells("a").attachTree("0");
	addressesTree.setImagePath("../javascripts/imgs/");
	addressesTree.enableDragAndDrop('1', true);
	addressesTree.enableItemEditor(1);
	addressesTree.loadXML("../addresses/tree.xml");
	addressesTree.attachEvent("onSelect",exploreAddressesNode);
	addressesToolbar = main_layout.cells("b").attachToolbar();
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
	addressesGrid = main_layout.cells("b").attachGrid();
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

dhtmlx.image_path='./codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '2U');

	var a = main_layout.cells('a');
	a.setText('Topology');
	a.setWidth('300');
	var treeToolbar = a.attachToolbar();
	treeToolbar.setIconsPath('../javascripts/imgs/');
	
	treeToolbar.loadXMLString('<toolbar><item type="button" text="Add Network" /><item type="button" text="Add Site" /><item type="button" text="Add Subnet" /><item type="button" text="Delete" /></toolbar>', function(){});
	var topologyTree = a.attachTree();
	topologyTree.setIconsPath('./codebase/imgs/');
	topologyTree.enableItemEditor(1);
	topologyTree.loadXML('./data/tree.xml');
	


	var b = main_layout.cells('b');
	var contentTabbar = b.attachTabbar();
	contentTabbar.addTab('addressesTab','Addresses','110');
	var addressesTab = contentTabbar.cells('addressesTab');
	contentTabbar.setTabActive('addressesTab');
	var addressesToolbar = addressesTab.attachToolbar();
	addressesToolbar.setIconsPath('./codebase/imgs/');
	
	addressesToolbar.loadXMLString('<toolbar><item type="button" id="1" enabled="false" text="New Address" /><item type="button" id="2" enabled="false" text="Delete Address" /><item type="button" id="3" enabled="false" text="Export to Excel" /><item type="button" id="4" enabled="false" text="Export as Text" /></toolbar>', function(){});
	var addressesGrid = addressesTab.attachGrid();
	addressesGrid.setIconsPath('./javascripts/imgs/');
	
	addressesGrid.setHeader(["Network","Site","Subnet","Address","Mask","System","Description"]);
	addressesGrid.setColTypes("ro,txt,txt,ro,txt,txt,txt");
	
	addressesGrid.attachHeader(["#text_filter","#text_filter","#text_filter","#text_filter","#select_filter","#text_filter","#text_filter"]);
	addressesGrid.setColumnMinWidth('*,*,*,*,*,*,*');
	addressesGrid.setColAlign('center,center,center,right,center,center,left');
	addressesGrid.setColVAlign('middle,middle,middle,middle,middle,middle,middle');
	addressesGrid.enableResizing('true,true,true,true,true,true,true');
	addressesGrid.enableTooltips('false,false,true,true,true,true,true');
	addressesGrid.setColSorting('str,str,str,str,str,str,str');
	addressesGrid.setInitWidths("100,100,100,100,50,100,*");
	addressesGrid.enableValidation(true, true);
addressesGrid.setColValidators(',,,ValidIPv4,ValidInteger,,');
	addressesGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='0' || cInd == '1' || cInd == '2') return false; else return true;});
	addressesGrid.init();
	addressesGrid.load('./data/grid.xml', 'xml');
	


	contentTabbar.addTab('subnetsTab','Subnets','90');
	var subnetsTab = contentTabbar.cells('subnetsTab');
	var subnetsToolbar = subnetsTab.attachToolbar();
	subnetsToolbar.setIconsPath('./codebase/imgs/');
	
	subnetsToolbar.loadXMLString('<toolbar><item type="button" id="1" enabled="false" text="New Subnet" /><item type="button" id="2" enabled="false" text="Delete Subnet" /><item type="button" id="3" enabled="false" text="Export to Excel" /><item type="button" id="4" enabled="false" text="Export to Text" /></toolbar>', function(){});
	var subnetsGrid = subnetsTab.attachGrid();
	subnetsGrid.setIconsPath('./codebase/imgs/');
	
	subnetsGrid.setHeader(["Network","Site","Subnet Name","Subnet","Mask","Default Router","Description"]);
	subnetsGrid.setColTypes("txt,txt,txt,txt,txt,txt,txt");
	
	subnetsGrid.attachHeader(["#text_filter","#text_filter","#text_filter","#text_filter","#select_filter","#text_filter",""]);
	subnetsGrid.setColAlign('center,center,center,left,left,center,left');
	subnetsGrid.enableTooltips('false,false,false,true,false,false,false');
	subnetsGrid.setColSorting('str,str,str,str,str,str,str');
	subnetsGrid.setInitWidths("100,100,100,100,50,100,*");
	subnetsGrid.enableValidation(true, false);
subnetsGrid.setColValidators(',,,ValidIPv4,ValidInteger,,');
	subnetsGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){if(cInd=='1') return false; else return true;});
	subnetsGrid.init();
	subnetsGrid.load('./data/grid.xml', 'xml');
