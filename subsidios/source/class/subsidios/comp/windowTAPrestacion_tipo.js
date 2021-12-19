qx.Class.define("subsidios.comp.windowTAPrestacion_tipo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		width: 500,
		height: 200,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtDescrip.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	var form = new qx.ui.form.Form();
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descrip");
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nuevo TyA tipo prestacion");
		
		aux = qx.data.marshal.Json.createModel({id_ta_tipo_prestacion: "0", descrip: ""}, true);
	} else {
		this.setCaption("Modificar TyA tipo prestacion");
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.TA_Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado", data.result);
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message != "sesion_terminada") {
					if (data.message == "duplicado") {
						txtDescrip.focus();
						txtDescrip.setInvalidMessage("Ya existe un tipo prestacion con la misma descripción");
						txtDescrip.setValid(false);
					} else {
						alert(qx.lang.Json.stringify(data, null, 2));
					}
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_prestacion_tipo", p);
			
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