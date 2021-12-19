qx.Class.define("subsidios.comp.windowParametro",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
		this.set({
			caption: "Parametros",
			width: 800,
			height: 600,
			showMinimize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		tbl1.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	var numberformatMontoEs2 = new qx.util.format.NumberFormat("es").set({groupingUsed: true});
	
	
	
	
	

	
	
	
	var gbx1 = new qx.ui.groupbox.GroupBox("Traslado y Alojamiento - Establecimiento");
	gbx1.setLayout(new qx.ui.layout.Grow());
	this.add(gbx1, {left: 0, top: 0, right: "51.5%", bottom: "51.5%"});
	
	var tableModel1 = new qx.ui.table.model.Simple();
	tableModel1.setColumns(["Descripción"], ["descrip"]);
	tableModel1.setEditable(true);
	tableModel1.setColumnSortable(0, false);

	var tbl1 = new componente.comp.ui.ramon.table.tableParametro(tableModel1, "ta_establecimiento");
	
	gbx1.add(tbl1);
	
	
	
	
	
	tbl1.setTabIndex(4);
	
	
	},
	members : 
	{

	}
});