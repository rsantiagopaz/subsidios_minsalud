qx.Class.define("subsidios.comp.windowWebService",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (dni, sexo)
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
	
	sexo = sexo ? sexo : 1;
	
	
	var layout = new qx.ui.layout.Grid(5, 5);
	for (x = 0; x < 10; x++) {
		layout.setColumnAlign(x, "left", "middle");
	}
	var container = new qx.ui.container.Composite(layout);
	this.add(container, {left: 0, top: 0});
	
	container.add(new qx.ui.basic.Label("D.N.I.:"), {row: 0, column: 0});
	
	var txtDni = new qx.ui.form.TextField(dni);
	txtDni.setLiveUpdate(true);
	txtDni.addListener("changeValue", function(e){
		btnConsultar.setEnabled(this.getValue().trim() ? true : false);
	});
	txtDni.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
		btnConsultar.setEnabled(this.getValue() ? true : false);
	});
	container.add(txtDni, {row: 1, column: 0});
	
	container.add(new qx.ui.basic.Label("Sexo:"), {row: 0, column: 1});
	
	var slbSexo = new qx.ui.form.SelectBox();
	//slbSexo.setMinWidth(300);
	slbSexo.add(new qx.ui.form.ListItem("Femenino", null, 1));
	slbSexo.add(new qx.ui.form.ListItem("Masculino", null, 2));
	slbSexo.add(new qx.ui.form.ListItem("Indeterminado", null, 3));
	container.add(slbSexo, {row: 1, column: 1});
	slbSexo.setModelSelection([sexo]);
	
	container.add(new qx.ui.basic.Label("Servicio:"), {row: 0, column: 2});
	
	var slbWebService = new qx.ui.form.SelectBox();
	slbWebService.setMinWidth(250);
	slbWebService.add(new qx.ui.form.ListItem("PUCO - Padrón Único Consolidado Operativo", null, "puco"));
	slbWebService.add(new qx.ui.form.ListItem("Prácticas (IOSEP)", null, "practicas"));
	slbWebService.add(new qx.ui.form.ListItem("Internaciones (IOSEP)", null, "internaciones"));
	slbWebService.addListener("changeSelection", function(e){
		txtDatos.setValue("");
	});
	container.add(slbWebService, {row: 1, column: 2});
	
	var btnConsultar = new qx.ui.form.Button("Consultar...");
	btnConsultar.setEnabled(dni ? true : false);
	btnConsultar.addListener("execute", function(e){
		loading.show();
		
		txtDatos.setValue("");
		
		txtDni.setEnabled(false);
		slbSexo.setEnabled(false);
		slbWebService.setEnabled(false);
		btnConsultar.setEnabled(false);
		
		var p = {};
		p.dni = txtDni.getValue();
		p.sexo = slbSexo.getModelSelection().getItem(0);
		
		var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.WebServices");
		rpc.setTimeout(1000 * 60);
		rpc.mostrar = false;
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			loading.hide();
			
			txtDni.setEnabled(true);
			slbSexo.setEnabled(true);
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
	container.add(btnConsultar, {row: 1, column: 3});
	
	this.add(new qx.ui.basic.Label("Datos recibidos:"), {left: 0, top: 55});
	
	var txtDatos = new qx.ui.form.TextArea("");
	txtDatos.setMinHeight(300);
	txtDatos.setReadOnly(true);
	txtDatos.setDecorator("main");
	txtDatos.setBackgroundColor("#ffffc0");
	this.add(txtDatos, {left: 0, top: 75, right: 0, bottom: 0});
	
	



	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});