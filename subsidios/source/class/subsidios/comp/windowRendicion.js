qx.Class.define("subsidios.comp.windowRendicion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_solicitud)
	{
	this.base(arguments);
	
	this.set({
		caption: "Agregar rendición",
		width: 500,
		height: 300,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		
		var fineUploaderOptions = {
		    // options
			button: lblDocumento.getContentElement().getDomElement(),
			autoUpload: true,
			multiple: false,
			request: {
				endpoint: 'services/php-traditional-server-master/endpoint.php'
			},
			validation: {
				//allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
				//acceptFiles: "image/png, image/jpeg",
				//acceptFiles: ".jpeg, .jpg, .gif, .png"
	        },
		    callbacks: {
		        onSubmit: function(id, name) {
		        	//application.popupCargando.mostrarModal();
		        	//imgComodato.setSource("./services/documentos/loading66.gif" + "?" + Math.random());
		        	//imgDocumento.setVisibility("visible");
		        	lblName.setValue("");
		        	btnAceptar.setEnabled(false);
		        	btnCancelar.setEnabled(false);
		        	setTimeout(imgDocumento.setVisibility("visible"));
		        },
		        
		        onError: function(id, name, errorReason, xhr) {
		        	//alert(qx.lang.Json.stringify({id: id, name: name, errorReason: errorReason, xhr: xhr}, null, 2));
		        	setTimeout(imgDocumento.setVisibility("hidden"));
		        	//imgDocumento.setVisibility("hidden");
					dialog.Dialog.error(errorReason);
					
		        	btnAceptar.setEnabled(true);
		        	btnCancelar.setEnabled(true);
		        },
		        
		        onComplete: function(id, name, responseJSON, xhr) {
		        	setTimeout(imgDocumento.setVisibility("hidden"));
		        	//imgDocumento.setVisibility("hidden");
		        	console.log([id, name, responseJSON, xhr]);
		        	if (responseJSON.success) {
		        		uuid = responseJSON.uuid;
		        		uploadName = responseJSON.uploadName;
		        		lblName.setValue(uploadName);
		        	}
		        	
		        	btnAceptar.setEnabled(true);
		        	btnCancelar.setEnabled(true);
		        }
		    }
		};
		
		fineUploader = new qq.FineUploaderBasic(fineUploaderOptions);
		
		//this.add(imgDocumento, {right: 0, top: 40});
		
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			txtDescrip.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var fineUploader;
	var uuid, uploadName;
	
	var form = new qx.ui.form.Form();
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	//txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descrip");
	
	
	var txtMonto = new qx.ui.form.Spinner(0, 0, 1000000);
	txtMonto.setNumberFormat(application.numberformatMontoEn);
	txtMonto.getChildControl("upbutton").setVisibility("excluded");
	txtMonto.getChildControl("downbutton").setVisibility("excluded");
	txtMonto.setSingleStep(0);
	txtMonto.setPageStep(0);
	txtMonto.setMaxWidth(80);
	//txtValor.setRequired(true);
	//txtValor.setMinWidth(400);
	form.add(txtMonto, "Monto", null, "monto_rendido");
	
	
	var txtObserva = new qx.ui.form.TextArea("");
	//txtObserva.setRequired(true);
	txtObserva.setMinWidth(350);
	txtObserva.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtObserva, "Observaciones", null, "observaciones");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	var aux = qx.data.marshal.Json.createModel({descrip: "", monto_rendido: 0, observaciones: ""}, true);
	controllerForm.setModel(aux);
	
	
	var lblDocumento = new qx.ui.basic.Label("Documento: ");
	lblDocumento.setPadding(5, 5, 5, 5);
	lblDocumento.setDecorator("main");
	this.add(lblDocumento, {left: 0, top: 140});
	
	var lblName = new qx.ui.basic.Label("");
	lblName.setPadding(5, 5, 5, 5);
	//lblName.setDecorator("main");
	this.add(lblName, {left: 85, top: 151});
	
	var imgDocumento = new qx.ui.basic.Image("./services/documentos/loading66.gif" + "?" + Math.random());
	imgDocumento.setVisibility("hidden");
	imgDocumento.setWidth(30);
	imgDocumento.setHeight(30);
	imgDocumento.setBackgroundColor("#FFFFFF");
	//imgDocumento.setDecorator("main");
	imgDocumento.setScale(true);

	this.add(imgDocumento, {left: 90, top: 150});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			p.id_solicitud = id_solicitud;
			p.uuid = uuid;
			p.uploadName = uploadName;
			console.log(p);
			
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
			rpc.callAsyncListeners(true, "agregar_rendicion", p);

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