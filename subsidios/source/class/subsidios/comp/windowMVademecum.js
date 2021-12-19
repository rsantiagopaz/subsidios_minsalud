qx.Class.define("subsidios.comp.windowMVademecum",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData, id_m_tipo_producto)
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
	txtCodigo.setMaxWidth(100);
	//txtCodigo.setMinWidth(400);
	txtCodigo.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtCodigo, "Código", null, "codigo_heredado");
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descripcion");
	
	
	var txtPrecio = new qx.ui.form.Spinner(0, 0, 100000);
	txtPrecio.setNumberFormat(application.numberformatMontoEn);
	txtPrecio.setMaxWidth(100);
	txtPrecio.getChildControl("upbutton").setVisibility("excluded");
	txtPrecio.getChildControl("downbutton").setVisibility("excluded");
	txtPrecio.setSingleStep(0);
	txtPrecio.setPageStep(0);
	form.add(txtPrecio, "Precio", null, "precio");
	

	var txtPresentacion = new qx.ui.form.TextField("");
	txtPresentacion.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtPresentacion, "Presentación", null, "presentacion");
	
	
	var txtForma_farmaceutica = new qx.ui.form.TextField("");
	txtForma_farmaceutica.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtForma_farmaceutica, "Forma farmac.", null, "forma_farmaceutica");

	
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nuevo medicamento");
		
		aux = qx.data.marshal.Json.createModel({id_m_vademecum: "0", id_m_tipo_producto: id_m_tipo_producto, codigo_heredado: "", descripcion: "", precio: 0, presentacion: "", forma_farmaceutica: ""}, true);
	} else {
		this.setCaption("Modificar medicamento");
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.M_Parametros");
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
					txtCodigo.setInvalidMessage("Ya existe un medicamento con el mismo código");
					txtCodigo.setValid(false);
				}
				
				if (data.message == "descrip_duplicado") {
					txtDescrip.focus();
					txtDescrip.setInvalidMessage("Ya existe un medicamento con la misma descripción");
					txtDescrip.setValid(false);
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_vademecum", p);
			
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