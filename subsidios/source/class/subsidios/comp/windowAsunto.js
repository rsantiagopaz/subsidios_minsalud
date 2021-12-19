qx.Class.define("subsidios.comp.windowAsunto",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Vincular asunto",
		width: 250,
		height: 150,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtObserva.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var form = new qx.ui.form.Form();
	
	
	var txtObserva = new qx.ui.form.TextField("");
	txtObserva.setRequired(true);
	//txtObserva.setMinWidth(350);
	txtObserva.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtObserva, "Asunto", null, "documentacion_id");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.documentacion_id = txtObserva.getValue();
			p.organismo_area_id = application.login.organismo_area_id;
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Prefacturacion");
			rpc.addListener("completed", function(e){
				var resultado = e.getData().result;
				
				if (resultado) {
					btnCancelar.execute();
					
					this.fireDataEvent("aceptado", txtObserva.getValue());
				} else {
					txtObserva.setInvalidMessage("Asunto inválido");
					txtObserva.setValid(false);
					txtObserva.setToolTip(sharedErrorTooltip);
					txtObserva.focus();
					
					sharedErrorTooltip.setLabel("Asunto inválido");
					sharedErrorTooltip.placeToWidget(txtObserva);
					sharedErrorTooltip.show();
				}
				
			}, this);
			rpc.callAsyncListeners(true, "validar_asunto", p);

		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "15%", bottom: 0});
	this.add(btnCancelar, {right: "15%", bottom: 0});
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});