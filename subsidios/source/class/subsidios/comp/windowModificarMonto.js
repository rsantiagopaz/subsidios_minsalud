qx.Class.define("subsidios.comp.windowModificarMonto",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_solicitud, monto_total)
	{
	this.base(arguments);
	
	this.set({
		caption: "Modificar monto total",
		width: 300,
		height: 120,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			btnAceptar.focus();
			txtMonto.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var uuid, uploadName;
	
	var form = new qx.ui.form.Form();
	
	
	var txtMonto = new qx.ui.form.Spinner(0, monto_total, 1000000000);
	txtMonto.setNumberFormat(application.numberformatMontoEn);
	txtMonto.getChildControl("upbutton").setVisibility("excluded");
	txtMonto.getChildControl("downbutton").setVisibility("excluded");
	txtMonto.setSingleStep(0);
	txtMonto.setPageStep(0);
	txtMonto.setWidth(120);
	//txtValor.setRequired(true);
	//txtValor.setMinWidth(400);
	
	form.add(txtMonto, "Monto", function(value) {
		if (!txtMonto.getValue()) throw new qx.core.ValidationError("Validation Error", "Debe ingresar monto");
	}, "monto_total");
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	var aux = qx.data.marshal.Json.createModel({descrip: "", monto_rendido: 0, observaciones: ""}, true);
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.monto_total = txtMonto.getValue();
			p.id_solicitud = id_solicitud;
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
			
				this.fireDataEvent("aceptado");
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);

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