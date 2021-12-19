qx.Class.define("subsidios.comp.windowGdeGedo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		caption: "GDE/GEDO",
		width: 300,
		height: 150,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtGde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();

	
	var form = new qx.ui.form.Form();

	
	var txtGde = new qx.ui.form.TextField("");
	txtGde.setRequired(true);
	txtGde.setMinWidth(180);
	txtGde.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtGde, "Exp.GDE", null, "gde");
	
	var txtGedo = new qx.ui.form.TextField("");
	txtGedo.setRequired(true);
	//txtDescrip.setMinWidth(400);
	txtGedo.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtGedo, "Nro.GEDO", null, "gedo");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var aux = qx.data.marshal.Json.createModel({gde: rowData.gde, gedo: rowData.gedo}, true);
	controllerForm.setModel(aux);
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_solicitud = rowData.id_solicitud;
			p.gde = txtGde.getValue();
			p.gedo = txtGedo.getValue();
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
			
				this.fireDataEvent("aceptado");
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "escribir_gde_gedo", p);

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