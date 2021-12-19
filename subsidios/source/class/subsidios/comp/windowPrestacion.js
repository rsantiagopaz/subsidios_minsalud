qx.Class.define("subsidios.comp.windowPrestacion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData, id_prestacion_tipo)
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
	form.add(txtDescrip, "Descripción", null, "denominacion");
	
	var txtValor = new qx.ui.form.Spinner(0, 0, 1000000);
	txtValor.setNumberFormat(application.numberformatMontoEn);
	txtValor.getChildControl("upbutton").setVisibility("excluded");
	txtValor.getChildControl("downbutton").setVisibility("excluded");
	txtValor.setSingleStep(0);
	txtValor.setPageStep(0);
	//txtValor.setRequired(true);
	//txtValor.setMinWidth(400);
	form.add(txtValor, "Valor", null, "valor");
	
	var slbSubtipo = new qx.ui.form.SelectBox();
	slbSubtipo.setRequired(true);
	
	var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarSubtipo", {texto: ""});
	} catch (ex) {
		//alert("Sync exception: " + ex);
	}
	for (var x in resultado) slbSubtipo.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	
	form.add(slbSubtipo, "Subtipo", null, "id_prestacion_subtipo");
	
	var slbTipo_cronograma = new qx.ui.form.SelectBox();
	slbTipo_cronograma.add(new qx.ui.form.ListItem("Semanal", null, "SE"));
	slbTipo_cronograma.add(new qx.ui.form.ListItem("Mensual", null, "ME"));
	slbTipo_cronograma.add(new qx.ui.form.ListItem("Ranking", null, "RK"));
	slbTipo_cronograma.add(new qx.ui.form.ListItem("Sin cronograma", null, "SC"));
	form.add(slbTipo_cronograma, "Cronograma", null, "cronograma_tipo");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nueva prestación");
		
		aux = qx.data.marshal.Json.createModel({id_prestacion: "0", id_prestacion_tipo: id_prestacion_tipo, id_prestacion_subtipo: null, codigo: "", denominacion: "", valor: 0, cronograma_tipo: "SE"}, true);
	} else {
		this.setCaption("Modificar prestación");
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Parametros");
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