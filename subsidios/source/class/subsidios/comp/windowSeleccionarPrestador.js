qx.Class.define("subsidios.comp.windowSeleccionarPrestador",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (prestador_tipo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Seleccionar prestador",
		width: 500,
		height: 200,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		slbPrestador.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	var form = new qx.ui.form.Form();
	
	
	var slbPrestador = new qx.ui.form.SelectBox();
	slbPrestador.setRequired(true);
	slbPrestador.setWidth(400);
	form.add(slbPrestador, "Prestador", null, "prestador");
	
	var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Parametros");
	rpc.addListener("completed", function(e){
		var data = e.getData();
		
		for (var x in data.result) {
			slbPrestador.add(new qx.ui.form.ListItem(data.result[x].label, null, data.result[x].model));
		}
	});
	rpc.callAsyncListeners(true, "autocompletarPrestador", {texto: "", prestador_tipo: prestador_tipo});
	
	
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado", slbPrestador.getModelSelection().getItem(0));
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});