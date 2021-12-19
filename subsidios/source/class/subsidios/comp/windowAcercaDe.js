qx.Class.define("subsidios.comp.windowAcercaDe",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		caption: "Acerca de...",
		width: 500,
		height: 200,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});

	var layout = new qx.ui.layout.HBox(0, "center");
	layout.setAlignY("middle");
	this.setLayout(layout);
	
	var layout = new qx.ui.layout.VBox(0, "middle");
	layout.setAlignX("center");
	
	var composite = new qx.ui.container.Composite(layout)
	this.add(composite, {flex: 1});
	
	composite.add(new qx.ui.basic.Label("Sistema de Subsidios"), {flex: 1});
	composite.add(new qx.ui.basic.Label("-"), {flex: 1});
	composite.add(new qx.ui.basic.Label("Desarrollado por: Dirección de Informática, Ministerio de Salud"), {flex: 1});
	composite.add(new qx.ui.basic.Label("Versión 1.0 - Año 2021"), {flex: 1});
	composite.add(new qx.ui.basic.Label("-"), {flex: 1});
	composite.add(new qx.ui.basic.Label("Programadores:"), {flex: 1});
	composite.add(new qx.ui.basic.Label("Pablo Lopez - padalopez@gmail.com"), {flex: 1});
	composite.add(new qx.ui.basic.Label("Ramón S. Paz - rsantiagopaz@gmail.com"), {flex: 1});

	}
});