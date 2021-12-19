/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "subsidios"
 *
 * @asset(subsidios/*)
 */
qx.Class.define("subsidios.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */


      
      
      
      // Document is the application root
	var doc = this.getRoot();
	
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	

	
	var id_version = 2;
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.ControlAcceso");
	try {
		var resultado = rpc.callSync("leer_version");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	if (id_version == resultado.id_version) {
		qx.event.Timer.once(function(){
			var win = new subsidios.comp.windowLogin();
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
		
				this.login = data;
				
				qx.event.Timer.once(function(){
					this.initApp();
				}, this, 20);
			}, this);
			
			doc.add(win);
			win.center();
			win.open();
		}, this, 20);
		
	} else {
		alert("Presione F5 para actualizar aplicación. Si el problema persiste comunicarse con servicio técnico.");
		
		location.reload(true);
	}
	
	
	
	
	
    },
    
	initApp : function ()
	{
		
      // Document is the application root
	var doc = this.getRoot();
	
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	
	
	

	
	var pageMain = {};

	var loading = this.loading = new componente.comp.ui.ramon.image.Loading("subsidios/loading66.gif");
	
	subsidios.comp.rpc.Rpc.LOADING = loading;
	
	
	var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(true);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
	numberformatEntero.setGroupingUsed(false);
	numberformatEntero.setMaximumFractionDigits(0);
	numberformatEntero.setMinimumFractionDigits(0);
	
	

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var win = new subsidios.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuEdicion = new qx.ui.menu.Menu();
	
	
	
	var btnPanelDeEstudiosEnProceso = new qx.ui.menu.Button("Panel de Subsidios en Proceso...");
	btnPanelDeEstudiosEnProceso.addListener("execute", function(){
		if (pageMain["pagePanelDeEstudiosEnProceso"] == null) {
			pageMain["pagePanelDeEstudiosEnProceso"] = new subsidios.comp.pagePanelDeEstudiosEnProceso();
			pageMain["pagePanelDeEstudiosEnProceso"].addListenerOnce("close", function(e){
				pageMain["pagePanelDeEstudiosEnProceso"] = null;
			});
			tabviewMain.add(pageMain["pagePanelDeEstudiosEnProceso"]);
		}
		tabviewMain.setSelection([pageMain["pagePanelDeEstudiosEnProceso"]]);
	});
	mnuEdicion.add(btnPanelDeEstudiosEnProceso);

	

	

	
	
	
	var mnuVer = new qx.ui.menu.Menu();
	
	var btnEstadisticas = new qx.ui.menu.Button("Estadísticas...");
	btnEstadisticas.addListener("execute", function(){
		if (pageMain["pageParametros"] == null) {
			pageMain["pageParametros"] = new subsidios.comp.pageParametros();
			pageMain["pageParametros"].addListenerOnce("close", function(e){
				pageMain["pageParametros"] = null;
			});
			tabviewMain.add(pageMain["pageParametros"]);
		}
		tabviewMain.setSelection([pageMain["pageParametros"]]);
	});
	//mnuVer.add(btnEstadisticas);
	
	
	var btnWebServices = new qx.ui.menu.Button("Web services...");
	btnWebServices.addListener("execute", function(){
		var win = new subsidios.comp.windowWebService("");
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuVer.add(btnWebServices);
	
	

	

	

	var mnuSesion = new qx.ui.menu.Menu();
	
	var btnContrasena = new qx.ui.menu.Button("Cambiar contraseña");
	btnContrasena.addListener("execute", function(e){
		var win = new subsidios.comp.windowContrasena();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuSesion.add(btnContrasena);
	mnuSesion.addSeparator();

	var btnCerrar = new qx.ui.menu.Button("Cerrar");
	btnCerrar.addListener("execute", function(e){
		//var rpc = new qx.io.remote.Rpc("services/", "comp.turnos.login");
		//var result = rpc.callSync("Logout");
		location.reload(true);
	});
	mnuSesion.add(btnCerrar);
	
	  
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton("Edición");
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
	var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');

	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnEdicion.setMenu(mnuEdicion);
	mnubtnVer.setMenu(mnuVer);
	mnubtnSesion.setMenu(mnuSesion);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.add(mnubtnSesion);
	toolbarMain.addSpacer();
	
	
	
	doc.add(toolbarMain, {left: 5, top: 0, right: "50%"});
	
	doc.add(new qx.ui.basic.Label("Usuario: " + this.login.usuario), {left: "51%", top: 5});
	doc.add(new qx.ui.basic.Label("Org/Area: " + this.login.label), {left: "51%", top: 25});
	
	
	//doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	//doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//var pageGeneral = this.pageGeneral = new vehiculos.comp.pageGeneral();
	//tabviewMain.add(pageGeneral);
	//tabviewMain.setSelection([pageGeneral]);
	
	
	//var page = new sical3.comp.pageCatEspTit();
	//tabviewMain.add(page);
	//tabviewMain.setSelection([page]);
	
	
	btnPanelDeEstudiosEnProceso.execute();
	
	}
  }
});
