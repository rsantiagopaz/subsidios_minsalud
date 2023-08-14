qx.Class.define("subsidios.comp.pagePanelDeEstudiosEnProceso",
{
	extend : qx.ui.tabview.Page,
	construct : function (rowData)
	{
	this.base(arguments);

	this.setLabel('Panel de Subsidios en Proceso');
	if (rowData) this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		if (rowData) {
			var aux;
			
			aux = rowData.fecha_emite;
			aux = new Date(aux.getFullYear(), aux.getMonth(), aux.getDate());
			dtfHasta.setValue(aux);
			aux.setMonth(aux.getMonth() - 6);
			dtfDesde.setValue(aux);
			
			aux = rowData.persona_nombre + " (" + rowData.persona_dni + ")";
			
			this.setLabel("historial " + aux);
			
			aux = new qx.ui.form.ListItem(aux, null, rowData.persona_id);
			lstPaciente.add(aux);
			lstPaciente.setSelection([aux]);
			
			cboEPublico.setVisibility("excluded");
			//cboPrestador.setVisibility("excluded");
			cboPersonal.setVisibility("excluded");
			slbEstado.setVisibility("excluded");
			btnInicializar.setVisibility("excluded");
			btnFiltrar.setVisibility("excluded");
			
			dtfDesde.getChildControl("textfield").setReadOnly(true);
			dtfDesde.getChildControl("button").setEnabled(false);
			
			dtfHasta.getChildControl("textfield").setReadOnly(true);
			dtfHasta.getChildControl("button").setEnabled(false);
			
			cboPaciente.getChildControl("textfield").setReadOnly(true);
			cboPaciente.getChildControl("button").setEnabled(false);
			
			tblSolicitud.focus();
		} else {
			dtfDesde.focus();
		}
		
		btnFiltrar.execute();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var mapEstado = {
		"E" : "Emitida",
		"A" : "Aprobada",
		"B" : "Bloqueada",
		"N" : "No Rendida",
		"P" : "R.Parcial",
		"R" : "Rendida"
	};
	
	
	
	
	
	var functionActualizarSolicitud = function(id_solicitud) {
		
		tblSolicitud.setFocusedCell();
		tableModelRendicion.setDataAsMapArray([], true);
		
		//btnCambiarPrestador.setEnabled(false);
		btnModificarMonto.setEnabled(false);
		btnAutorizar.setEnabled(false);
		btnBloquear.setEnabled(false);
		btnEliminar.setEnabled(false);
		btnGdeGedo.setEnabled(false);
		btnWebServices.setEnabled(false);
		btnHistorial.setEnabled(false);
		menuSolicitud.memorizar([btnModificarMonto, btnAutorizar, btnBloquear, btnEliminar, btnGdeGedo, btnWebServices, btnHistorial]);
		
		btnAgregarRendicion.setEnabled(false);
		commandVerDocumento.setEnabled(false);
		menuRendicion.memorizar([btnAgregarRendicion, commandVerDocumento]);
		
		controllerFormInfoEntsal.resetModel();
		
		
		
		var timer = qx.util.TimerManager.getInstance();
		if (this.timerId != null) {
			timer.stop(this.timerId);
			this.timerId = null;
			
			if (this.rpc != null) {
				this.rpc.abort(this.opaqueCallRef);
				this.rpc = null;
			}
		}
		
		this.timerId = timer.start(function() {
			
			var p = {};
			p.desde = dtfDesde.getValue();
			p.hasta = dtfHasta.getValue();
			//p.id_prestador_fantasia = lstPrestador.getSelection()[0].getModel();
			if (! lstEPublico.isSelectionEmpty()) p.id_efector_publico = lstEPublico.getSelection()[0].getModel();
			if (! lstPaciente.isSelectionEmpty()) p.paciente_id = lstPaciente.getSelection()[0].getModel();
			if (! lstSolicitante.isSelectionEmpty()) p.solicitante_id = lstSolicitante.getSelection()[0].getModel();
			if (! lstPersonal.isSelectionEmpty()) p.id_usuario_medico = lstPersonal.getSelection()[0].getModel();
			p.estado = slbEstado.getSelection()[0].getModel();
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			this.rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				tableModelSolicitud.setDataAsMapArray(data.result, true);
				
				if (id_solicitud != null) {
					tblSolicitud.blur();
					tblSolicitud.buscar("id_solicitud", id_solicitud);
					tblSolicitud.focus();
				}
			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitud", p);
			
		}, null, this, null, 200);
	}
	
	
	
	
	
	var gbxFiltrar = new qx.ui.groupbox.GroupBox("Filtrar solicitudes");
	gbxFiltrar.setLayout(new qx.ui.layout.Grow());
	this.add(gbxFiltrar, {left: 0, top: 0, right: "78%"});
	
	
	var form = new qx.ui.form.Form();
	

	//gbxFiltrar.add(new qx.ui.basic.Label("Desde:"), {row: 0, column: 0});
	
	var dtfDesde = new qx.ui.form.DateField();
	dtfDesde.setMaxWidth(100);
	form.add(dtfDesde, "Desde", null, "fecha_desde", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 2}});
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Hasta:"), {row: 1, column: 0});
	
	var dtfHasta = new qx.ui.form.DateField();
	dtfHasta.setMaxWidth(100);
	form.add(dtfHasta, "Hasta", null, "fecha_hasta", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 2}});
	
	
	var aux = new Date;
	dtfHasta.setValue(aux);
	aux.setMonth(aux.getMonth() - 6);
	dtfDesde.setValue(aux);
	
	

	
	//gbxFiltrar.add(new qx.ui.basic.Label("Paciente:"), {row: 2, column: 0});
	
	var cboPaciente = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	//cboPrestador.setWidth(400);
	
	var lstPaciente = cboPaciente.getChildControl("list");
	lstPaciente.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboPaciente, "Paciente", null, "paciente_id", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	
	var cboSolicitante = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	//cboPrestador.setWidth(400);
	
	var lstSolicitante = cboSolicitante.getChildControl("list");
	lstSolicitante.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboSolicitante, "Solicitante", null, "solicitante_id", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 4}});
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Ef.público:"), {row: 3, column: 0});
	
	var cboEPublico = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarEfector"});

	var lstEPublico = cboEPublico.getChildControl("list");
	lstEPublico.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboEPublico, "Ef.público", null, "id_efector_publico", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 4}});
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Prestador:"), {row: 4, column: 0});
	
	/*
	var cboPrestador = new qx.ui.form.SelectBox();
	cboPrestador.add(new qx.ui.form.ListItem("-", null, ""));
	
	var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Parametros");
	rpc.addListener("completed", function(e){
		var data = e.getData();
		
		for (var x in data.result) {
			//listItem = new qx.ui.form.ListItem(data.result[x].nombre, null, data.result[x].organismo_area_id)
			cboPrestador.add(new qx.ui.form.ListItem(data.result[x].nombre, null, data.result[x].organismo_area_id));
		}
	});
	rpc.callAsyncListeners(true, "autocompletarPrestador", {texto: "", prestador_tipo: "acd"});
	
	
	//var cboPrestador = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestador"});
	//cboPrestador.setWidth(400);
	
	var lstPrestador = cboPrestador.getChildControl("list");

	form.add(cboPrestador, "Prestador", null, "id_prestador_fantasia", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 4}});
	*/
	
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Médico:"), {row: 5, column: 0});
	
	var cboPersonal = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	//cboPrestador.setWidth(400);
	
	var lstPersonal = cboPersonal.getChildControl("list");
	lstPersonal.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboPersonal, "Médico", null, "id_personal", null, {grupo: 1, item: {row: 5, column: 1, colSpan: 4}});
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Estado:"), {row: 6, column: 0});
	
	var slbEstado = new qx.ui.form.SelectBox();
	slbEstado.add(new qx.ui.form.ListItem("-", null, ""));
	slbEstado.add(new qx.ui.form.ListItem("Emitida", null, "E"));
	slbEstado.add(new qx.ui.form.ListItem("Aprobada", null, "A"));
	slbEstado.add(new qx.ui.form.ListItem("Bloqueada", null, "B"));
	slbEstado.add(new qx.ui.form.ListItem("R.Parcial", null, "P"));
	slbEstado.add(new qx.ui.form.ListItem("Rendida", null, "R"));
	
	form.add(slbEstado, "Estado", null, "estado", null, {grupo: 1, item: {row: 6, column: 1, colSpan: 2}});
	
	
	
	var btnInicializar = new qx.ui.form.Button("Inicializar");
	btnInicializar.addListener("execute", function(e){
		var aux = new Date;
		dtfHasta.setValue(aux);
		aux.setMonth(aux.getMonth() - 6);
		dtfDesde.setValue(aux);
		
		//cboPrestador.setSelection([cboPrestador.getChildren()[0]]);
		
		lstEPublico.removeAll();
		cboEPublico.setValue("");
		
		lstPaciente.removeAll();
		cboPaciente.setValue("");
		
		lstSolicitante.removeAll();
		cboSolicitante.setValue("");
		
		lstPersonal.removeAll();
		cboPersonal.setValue("");
		
		slbEstado.setSelection([slbEstado.getChildren()[0]]);
		
		dtfDesde.focus();
	})
	form.addButton(btnInicializar, {grupo: 1, item: {row: 7, column: 2}});
	

	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		functionActualizarSolicitud();
	})
	form.addButton(btnFiltrar, {grupo: 1, item: {row: 7, column: 3}});
	
	
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 8, 5, 1);
	var l = formView._getLayout();
	l.setColumnFlex(1, 1);
	l.setColumnFlex(2, 1);
	l.setColumnFlex(3, 1);
	l.setColumnFlex(4, 1);
	
	gbxFiltrar.add(formView);
	
	
	
	
	
	// Menu
	
	/*
	var btnCambiarPrestador = new qx.ui.menu.Button("Cambiar prestador...");
	btnCambiarPrestador.setEnabled(false);
	btnCambiarPrestador.addListener("execute", function(e){
		var win = new subsidios.comp.windowSeleccionarPrestador('acd');
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			rowDataSolicitud.id_prestador_fantasia = data;
			
			var p = rowDataSolicitud;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	*/
	
	var btnModificarMonto = new qx.ui.menu.Button("Modificar monto total...");
	btnModificarMonto.setEnabled(false);
	btnModificarMonto.addListener("execute", function(e){
		var win = new subsidios.comp.windowModificarMonto(rowDataSolicitud.id_solicitud, parseFloat(rowDataSolicitud.monto_total));
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
		});
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAutorizar = new qx.ui.menu.Button("Aprobar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		tblSolicitud.blur();
		
		var win = new subsidios.comp.windowObservar();
		win.setCaption("Aprobar solicitud");
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			tblSolicitud.setFocusedCell();
			
			var p = {};
			p.id_solicitud = rowDataSolicitud.id_solicitud;
			p.estado = rowDataSolicitud.estado;
			p.observaciones_aprueba = data;
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "aprobar_solicitud", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnBloquear = new qx.ui.menu.Button("Bloquear...");
	btnBloquear.setEnabled(false);
	btnBloquear.addListener("execute", function(e){
		tblSolicitud.blur();
		
		if (rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A") {
			
			var win = new subsidios.comp.windowObservar();
			win.setCaption("Bloquear solicitud");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				tblSolicitud.setFocusedCell();
				
				var p = {};
				p.id_solicitud = rowDataSolicitud.id_solicitud;
				p.estado = rowDataSolicitud.estado;
				p.observaciones_bloqueo = data;
				
				var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
				});
				rpc.callAsyncListeners(true, "bloquear_solicitud", p);
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			
			(new dialog.Confirm({
			        "message"   : "Desea desbloquear el item de solicitud seleccionado?",
			        "callback"  : function(e){
									if (e) {
										var p = {};
										p.id_solicitud = rowDataSolicitud.id_solicitud;
										
										tblSolicitud.setFocusedCell();
										
										var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
										rpc.addListener("completed", function(e){
											var data = e.getData();
											
											functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
										});
										rpc.callAsyncListeners(true, "desbloquear_solicitud", p);
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	
	
	var btnGdeGedo = new qx.ui.menu.Button("GDE/GEDO...");
	btnGdeGedo.setEnabled(false);
	btnGdeGedo.addListener("execute", function(e){
		var win = new subsidios.comp.windowGdeGedo(rowDataSolicitud);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		(new dialog.Confirm({
				"message"   : "Desea eliminar la solicitud seleccionada?",
				"callback"  : function(e){
								if (e) {
									tblSolicitud.blur();
									
									var p = {};
									p.id_solicitud = rowDataSolicitud.id_solicitud;
									p.estado = rowDataSolicitud.estado;
									
									var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
									});
									rpc.callAsyncListeners(true, "eliminar_solicitud", p);
								}
							},
				"context"   : this,
				"image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	
	var btnWebServices = new qx.ui.menu.Button("consultar Web services...");
	btnWebServices.addListener("execute", function(e){
		var sexos = {'F': 1, 'M': 2};
		var sexo = sexos[rowDataSolicitud.paciente_sexo] ? sexos[rowDataSolicitud.paciente_sexo] : 3;
		var win = new subsidios.comp.windowWebService(rowDataSolicitud.paciente_dni, sexo);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnHistorial = new qx.ui.menu.Button("consultar historial (6 meses)...");
	btnHistorial.addListener("execute", function(e){
		var aux = new subsidios.comp.pagePanelDeEstudiosEnProceso(rowDataSolicitud);
		application.tabviewMain.add(aux);
		application.tabviewMain.setSelection([aux]);
	});
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	//menuSolicitud.add(btnCambiarPrestador);
	if (application.login.perfiles['ssm004']) menuSolicitud.add(btnModificarMonto);
	if (application.login.perfiles['ssm002']) menuSolicitud.add(btnAutorizar);
	if (application.login.perfiles['ssm002']) menuSolicitud.add(btnBloquear);
	if (application.login.perfiles['ssm004']) menuSolicitud.add(btnGdeGedo);
	if (application.login.perfiles['ssm002']) menuSolicitud.add(btnEliminar);
	menuSolicitud.addSeparator();
	menuSolicitud.add(btnWebServices);
	//menuSolicitud.add(btnHistorial);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Id", "Paciente", "Solicitante", "Tipo", "Monto", "Fecha", "Efector público", "Estado", "Rendición", "estado_condicion", "estado_rendicion_condicion"], ["id_solicitud", "paciente_descrip", "solicitante_descrip", "tipo", "monto_total", "fecha_emite", "efector_publico", "estado_descrip", "estado_rendicion_descrip", "estado_condicion", "estado_rendicion_condicion"]);
	tableModelSolicitud.setColumnSortable(0, false);
	tableModelSolicitud.setColumnSortable(1, false);
	tableModelSolicitud.setColumnSortable(2, false);
	tableModelSolicitud.setColumnSortable(3, false);
	tableModelSolicitud.setColumnSortable(4, false);
	tableModelSolicitud.setColumnSortable(5, false);
	tableModelSolicitud.setColumnSortable(6, false);
	tableModelSolicitud.setColumnSortable(7, false);
	tableModelSolicitud.setColumnSortable(8, false);
	tableModelSolicitud.addListener("dataChanged", function(e){
		var rowCount = tableModelSolicitud.getRowCount();
		
		tblSolicitud.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSolicitud = new componente.comp.ui.ramon.table.Table(tableModelSolicitud, custom);
	tblSolicitud.setShowCellFocusIndicator(false);
	tblSolicitud.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	if (! rowData) tblSolicitud.setContextMenu(menuSolicitud);

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	tableColumnModelSolicitud.setColumnVisible(9, false);
	tableColumnModelSolicitud.setColumnVisible(10, false);
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	
	resizeBehaviorSolicitud.set(0, {width:"4%", minWidth:100});
	resizeBehaviorSolicitud.set(1, {width:"23%", minWidth:100});
	resizeBehaviorSolicitud.set(2, {width:"23%", minWidth:100});
	resizeBehaviorSolicitud.set(3, {width:"9%", minWidth:100});
	resizeBehaviorSolicitud.set(4, {width:"6%", minWidth:100});
	resizeBehaviorSolicitud.set(5, {width:"7%", minWidth:100});
	resizeBehaviorSolicitud.set(6, {width:"18%", minWidth:100});
	resizeBehaviorSolicitud.set(7, {width:"5%", minWidth:100});
	resizeBehaviorSolicitud.set(8, {width:"5%", minWidth:100});
	
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
	cellrendererReplace.setReplaceMap({
	  'M' : "Medic., Ins., Prót.",
	  'D' : "Derivación",
	  'P' : "Practicas fuera conv.",
	  'O' : "Otros"
	});
	cellrendererReplace.addReversedReplaceMap();
	tableColumnModelSolicitud.setDataCellRenderer(3, cellrendererReplace);

	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelSolicitud.setDataCellRenderer(4, cellrendererNumber);
	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(5, cellrendererDate);
	

	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 3, null, "#FF0000", null, null, "estado_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(7, cellrendererString);
	
	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_rendicion_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_rendicion_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(8, cellrendererString);
	
	
	
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (selectionModelSolicitud.isSelectionEmpty()) {

		} else {
			
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			tblRendicion.setFocusedCell();
			tableModelRendicion.setDataAsMapArray([], true);
			
			//controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataSolicitud));
			controllerFormInfoEntsal.resetModel();
			
			//btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			var modificarMontoEnabled = !(rowDataSolicitud.gde == "" && rowDataSolicitud.gedo == "") && rowDataSolicitud.estado != "B" && rowDataSolicitud.estado_rendicion != "R"
			btnModificarMonto.setEnabled(modificarMontoEnabled);
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear...")
			btnEliminar.setEnabled(rowDataSolicitud.estado == "L");
			btnGdeGedo.setEnabled(true);
			btnWebServices.setEnabled(true);
			btnHistorial.setEnabled(true);
			
			menuSolicitud.memorizar([btnModificarMonto, btnAutorizar, btnBloquear, btnEliminar, btnGdeGedo, btnWebServices, btnHistorial]);
			
			var banderaAgregarRendicion = rowDataSolicitud.estado == "A" && rowDataSolicitud.estado_rendicion != "R"; 
			btnAgregarRendicion.setEnabled(banderaAgregarRendicion);
			commandVerDocumento.setEnabled(false);
			menuRendicion.memorizar([btnAgregarRendicion, commandVerDocumento]);
			
			var timer = qx.util.TimerManager.getInstance();
			if (this.timerId != null) {
				timer.stop(this.timerId);
				this.timerId = null;
				
				if (this.rpc != null) {
					this.rpc.abort(this.opaqueCallRef);
					this.rpc = null;
				}
			}
			
			this.timerId = timer.start(function() {
				
				var p = {};
				p.id_solicitud = rowDataSolicitud.id_solicitud;
				
				this.rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Solicitudes");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
					
					controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(data.result.solicitud));
					tableModelOtros.setDataAsMapArray(data.result.solicitud.insumos);
			
					tableModelRendicion.setDataAsMapArray(data.result.rendiciones, true);
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_rendiciones", p);
				
			}, null, this, null, 200);
		}
	});

	this.add(tblSolicitud, {left: "23%", top: 0, right: 0, bottom: "50%"});
	

	
	
	var gbxOtros = new qx.ui.groupbox.GroupBox("Otros datos");
	gbxOtros.setLayout(new qx.ui.layout.Grow());
	this.add(gbxOtros, {left: 0, top: "53%", right: "60%", bottom: "16%"});
	
	var containerScroll = new qx.ui.container.Scroll();
	gbxOtros.add(containerScroll);
	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.bloqueo", null, "observaciones_bloqueo");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.aprob.", null, "observaciones_aprueba");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Observaciones", null, "observaciones");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Info.clínica", null, "informacion_clinica");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Nro.GDE", null, "gde");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Nro.GEDO", null, "gedo");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Médico", null, "medico_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Méd.deriv.", null, "medico_deriv_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Movilidad", null, "movilidad_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Ambulancia", null, "ambulancia_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Instancia", null, "instancia_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Destino", null, "destino_descrip");
	
	var aux = new qx.ui.form.DateField();
	aux.getChildControl("textfield").setReadOnly(true);
	aux.getChildControl("button").setVisibility("hidden");
	//aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Turno fecha", null, "dev_turno_fecha");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Turno confirmar", null, "turno_confirmar_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Transferencia", null, "transferencia_descrip");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Trans.esp.", null, "dev_transferencia_especificar");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Med.Receptor", null, "dev_medico_receptor");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Presupuesto", null, "prac_presupuesto_descrip");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Detalles", null, "prac_detalles");
	
	
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Orient.diagnóstica", null, "orientacion_diagnostica");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Servicio", null, "servicio");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Habitación cama", null, "habitacion_cama");
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Double(formInfoEntsal);
	
	
	containerScroll.add(formViewEntsal, {left: 0, top: 0});
	
	
	
	//Tabla
	
	var tableModelOtros = new qx.ui.table.model.Simple();
	tableModelOtros.setColumns(["Descripción", "Codigo", "Tipo", "Cantidad"], ["descrip", "codigo", "tipo_descrip", "cantidad"]);
	tableModelOtros.addListener("dataChanged", function(e){
		var rowCount = this.getRowCount();
		
		tblOtros.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblOtros = new componente.comp.ui.ramon.table.Table(tableModelOtros, custom);
	tblOtros.setShowCellFocusIndicator(false);
	tblOtros.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	//tblRendicion.setContextMenu(menuPrestacion);
	
	var tableColumnModelOtros = tblOtros.getTableColumnModel();
	
	var resizeBehaviorOtros = tableColumnModelOtros.getBehavior();

	//resizeBehaviorPrestacion.set(0, {width:"30%", minWidth:100});
	//resizeBehaviorPrestacion.set(1, {width:"70%", minWidth:100});
	//resizeBehaviorPrestacion.set(2, {width:"60%", minWidth:100});
	
	var selectionModelOtros = tblOtros.getSelectionModel();
	selectionModelOtros.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelOtros.addListener("changeSelection", function(e){

	});

	this.add(tblOtros, {left: 0, top: "85%", right: "60%", bottom: 0});
	
	
	
	
	
	
	
	// Menu
	
	var commandVerDocumento = new qx.ui.command.Command("Enter");
	commandVerDocumento.setEnabled(false);
	commandVerDocumento.addListener("execute", function(e){
		var rowDataRendicion = tableModelRendicion.getRowDataAsMap(tblRendicion.getFocusedRow());
		var url = "services/documentos/rendiciones/" + rowDataRendicion.id_rendicion + "/" + rowDataRendicion.documento;
		window.open(url, "_blank");
	});
	
	var btnAgregarRendicion = new qx.ui.menu.Button("Agregar...");
	btnAgregarRendicion.addListener("execute", function(e){
		var win = new subsidios.comp.windowRendicion(rowDataSolicitud.id_solicitud, rowDataSolicitud.monto_total, rowDataSolicitud.monto_rendido);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
		});
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnVerDocumento = new qx.ui.menu.Button("Ver documento...", null, commandVerDocumento);
	
	
	var menuRendicion = new componente.comp.ui.ramon.menu.Menu();
	
	if (application.login.perfiles['ssm003']) menuRendicion.add(btnAgregarRendicion);
	menuRendicion.add(btnVerDocumento);
	menuRendicion.memorizar();
	
	
	
	
	//Tabla
	
	var tableModelRendicion = new qx.ui.table.model.Simple();
	tableModelRendicion.setColumns(["Descripción", "Documento", "Monto", "Fecha"], ["descrip", "documento", "monto_rendido", "fecha"]);
	tableModelRendicion.addListener("dataChanged", function(e){
		var rowCount = tableModelRendicion.getRowCount();
		var data = tableModelRendicion.getDataAsMapArray();
		var total = 0;
		for (var x in data) {
			total = total + data[x].monto_rendido;
		}
		
		text = rowCount + ((rowCount == 1) ? " item" : " items");
		text = text + " - Total: " + application.numberformatMontoEs.format(total);
		
		tblRendicion.setAdditionalStatusBarText(text);
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblRendicion = new componente.comp.ui.ramon.table.Table(tableModelRendicion, custom);
	tblRendicion.setShowCellFocusIndicator(false);
	tblRendicion.toggleColumnVisibilityButtonVisible();
	tblRendicion.setContextMenu(menuRendicion);
	tblRendicion.addListener("cellDbltap", function(e){
		commandVerDocumento.execute();
	});
	//tbl.setRowHeight(45);
	//tblRendicion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblRendicion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();

	//resizeBehaviorPrestacion.set(0, {width:"30%", minWidth:100});
	//resizeBehaviorPrestacion.set(1, {width:"70%", minWidth:100});
	//resizeBehaviorPrestacion.set(2, {width:"60%", minWidth:100});
	
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelPrestacion.setDataCellRenderer(2, cellrendererNumber);
	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
	tableColumnModelPrestacion.setDataCellRenderer(3, cellrendererDate);

	
	
	var selectionModelPrestacion = tblRendicion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){
		if (!selectionModelPrestacion.isSelectionEmpty()) {
			
			var rowDataRendicion = tableModelRendicion.getRowDataAsMap(tblRendicion.getFocusedRow());
			console.log(rowDataRendicion);
			
			commandVerDocumento.setEnabled(!!rowDataRendicion.documento);
			menuRendicion.memorizar([commandVerDocumento]);
		}
	});

	var compositeRendicion = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(compositeRendicion, {left: "41%", top: "52%", right: 0, bottom: 0});
	
	compositeRendicion.add(new qx.ui.basic.Label("Rendición"), {left: 0, top: 0});
	compositeRendicion.add(tblRendicion, {left: 0, top: 20, right: 0, bottom: 0});
	
	
	
	tblSolicitud.setTabIndex(11);
	tblRendicion.setTabIndex(12);
	
	
		
	},
	members : 
	{

	}
});