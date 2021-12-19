qx.Class.define("subsidios.comp.windowTAPrestacion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData, id_ta_tipo_prestacion)
	{
	this.base(arguments);
	
	this.set({
		//width: 500,
		height: 240,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtCodigo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	var form = new qx.ui.form.Form();
	
	
	var txtCodigo = new qx.ui.form.TextField("");
	txtCodigo.setRequired(true);
	//txtCodigo.setMinWidth(400);
	txtCodigo.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtCodigo, "Código", null, "codigo");
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descrip");
	

	var slbSubtipo = new qx.ui.form.SelectBox();
	slbSubtipo.setRequired(true);
	slbSubtipo.add(new qx.ui.form.ListItem("Traslado", null, "T"));
	slbSubtipo.add(new qx.ui.form.ListItem("Derivación", null, "D"));
	slbSubtipo.add(new qx.ui.form.ListItem("Alojamiento", null, "A"));
	form.add(slbSubtipo, "Subtipo", null, "subtipo");
	
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nueva TyA prestación");
		
		aux = qx.data.marshal.Json.createModel({id_ta_prestacion: "0", id_ta_tipo_prestacion: id_ta_tipo_prestacion, subtipo: "T", codigo: "", descrip: ""}, true);
	} else {
		this.setCaption("Modificar TyA prestación");
		
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
				
				this.fireDataEvent("aceptado", data.result);
				
				btnCancelar.execute();
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				if (data.message == "codigo_duplicado") {
					txtCodigo.focus();
					txtCodigo.setInvalidMessage("Ya existe una prestación con el mismo código");
					txtCodigo.setValid(false);
				}
				
				if (data.message == "descrip_duplicado") {
					txtDescrip.focus();
					txtDescrip.setInvalidMessage("Ya existe una prestación con la misma descripción");
					txtDescrip.setValid(false);
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_prestacion", p);
			
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