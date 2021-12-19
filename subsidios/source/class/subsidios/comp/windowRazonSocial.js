qx.Class.define("subsidios.comp.windowRazonSocial",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData, organismo_area_id)
	{
	this.base(arguments);
	
	this.set({
		//width: 500,
		height: 400,
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
	form.add(txtDescrip, "Descripción", null, "nombre");
	
	var txtCuit = new qx.ui.form.TextField("");
	txtCuit.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtCuit, "CUIT", null, "cuit");
	
	var txtDomicilio = new qx.ui.form.TextField("");
	txtDomicilio.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDomicilio, "Domicilio", null, "domicilio");
	
	var txtTelefono = new qx.ui.form.TextField("");
	txtTelefono.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtTelefono, "Teléfono", null, "telefonos");
	
	var txtContacto = new qx.ui.form.TextField("");
	txtContacto.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtContacto, "Contacto", null, "contacto");
	
	var txtObserva = new qx.ui.form.TextArea("");
	txtObserva.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtObserva, "Observaciones", null, "observaciones");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nueva razón social");
		
		aux = qx.data.marshal.Json.createModel({id_prestador: null, nombre: "", cuit: "", domicilio: "", telefonos: "", contacto: "", observaciones: "", estado: "H"}, true);
	} else {
		this.setCaption("Modificar razón social");
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			p.model.id_prestador_fantasia = organismo_area_id;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				this.fireDataEvent("aceptado", data.result);
				
				btnCancelar.execute();
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				if (data.message == "descrip_duplicado") {
					txtDescrip.focus();
					txtDescrip.setInvalidMessage("Ya existe un prestador con igual descripción");
					txtDescrip.setValid(false);
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_razon_social", p);
			
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