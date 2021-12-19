qx.Class.define("subsidios.comp.windowWebService",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (dni)
	{
	this.base(arguments);
	
	this.set({
		caption: "Consultar Web services",
		width: 800,
		//height: 240,
		showMinimize: false,
		//showMaximize: false,
		//allowMaximize: false,
		resizable: false
	});

	
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		loading = new componente.comp.ui.ramon.image.Loading("subsidios/loading66.gif", this);
		
		txtDni.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var loading;
	var aux;
	

	
	this.add(new qx.ui.basic.Label("D.N.I.:"), {left: 0, top: 5});
	
	var txtDni = new qx.ui.form.TextField(dni);
	txtDni.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	this.add(txtDni, {left: 40, top: 2});
	
	var slbWebService = new qx.ui.form.SelectBox();
	slbWebService.setMinWidth(300);
	slbWebService.add(new qx.ui.form.ListItem("PUCO - Padrón Único Consolidado Operativo", null, "puco"));
	slbWebService.add(new qx.ui.form.ListItem("Prácticas (IOSEP)", null, "practicas"));
	slbWebService.add(new qx.ui.form.ListItem("Internaciones (IOSEP)", null, "internaciones"));
	slbWebService.addListener("changeSelection", function(e){
		txtDatos.setValue("");
	});
	this.add(slbWebService, {left: 140, top: 0});
	
	var btnConsultar = new qx.ui.form.Button("Consultar...");
	btnConsultar.addListener("execute", function(e){
		loading.show();
		
		txtDatos.setValue("");
		
		txtDni.setEnabled(false);
		slbWebService.setEnabled(false);
		btnConsultar.setEnabled(false);
		
		var p = {};
		p.dni = txtDni.getValue();
		
		var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.WebServices");
		rpc.setTimeout(1000 * 60);
		rpc.mostrar = false;
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			loading.hide();
			
			txtDni.setEnabled(true);
			slbWebService.setEnabled(true);
			btnConsultar.setEnabled(true);
			
			txtDatos.setValue(data.result.texto);
			//txtDatos.setValue(qx.lang.Json.stringify(data.result, null, 2));

		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			loading.hide();
			
			txtDni.setEnabled(true);
			slbWebService.setEnabled(true);
			btnConsultar.setEnabled(true);
			
			txtDatos.setValue("\nError. Intente de nuevo.\n\n" + data.message);
		}, this);
		
		if (slbWebService.getSelection()[0].getModel()=="puco") rpc.callAsyncListeners(true, "getPuco1", p);
		if (slbWebService.getSelection()[0].getModel()=="practicas") rpc.callAsyncListeners(true, "getPracticas", p);
		if (slbWebService.getSelection()[0].getModel()=="internaciones") rpc.callAsyncListeners(true, "getInternaciones", p);
	});
	this.add(btnConsultar, {left: 450, top: 0});
	
	this.add(new qx.ui.basic.Label("Datos recibidos:"), {left: 0, top: 40});
	
	var txtDatos = new qx.ui.form.TextArea("");
	txtDatos.setMinHeight(300);
	txtDatos.setReadOnly(true);
	txtDatos.setDecorator("main");
	txtDatos.setBackgroundColor("#ffffc0");
	this.add(txtDatos, {left: 0, top: 60, right: 0, bottom: 0});
	
	



	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});