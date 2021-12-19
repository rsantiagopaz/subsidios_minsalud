qx.Class.define("subsidios.comp.pageParametros",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Estadísticas');
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		//gpb1.setValue(false);
	});
	
	
	var application = qx.core.Init.getApplication();
	



	
	var gpb0 = new qx.ui.groupbox.GroupBox("Gráficos básicos");
	var gpb1 = new qx.ui.groupbox.GroupBox("Variable");
	
	var rbt00 = new qx.ui.form.RadioButton("Efector");
	var rbt01 = new qx.ui.form.RadioButton("Médico");
	var rbt02 = new qx.ui.form.RadioButton("Prestador");
	var rbt03 = new qx.ui.form.RadioButton("Prestación");
	var rbt04 = new qx.ui.form.RadioButton("Paciente");
	var rbt05 = new qx.ui.form.RadioButton("Resultado");
	var rbt06 = new qx.ui.form.RadioButton("Cert.ANSES");
	

	
	var chk10 = new qx.ui.form.CheckBox("Efector");
	var cbo10 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarEfector"});
	cbo10.setEnabled(false);
	cbo10.setWidth(400);
	var lst10 = cbo10.getChildControl("list");
	
	var chk11 = new qx.ui.form.CheckBox("Médico");
	var cbo11 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	cbo11.setEnabled(false);
	var lst11 = cbo11.getChildControl("list");
	
	var chk12 = new qx.ui.form.CheckBox("Prestador");
	var cbo12 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestador"});
	cbo12.setEnabled(false);
	var lst12 = cbo12.getChildControl("list");
	
	var chk13 = new qx.ui.form.CheckBox("Prestación");
	var cbo13 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestacion"});
	cbo13.setEnabled(false);
	var lst13 = cbo13.getChildControl("list");
	
	var chk14 = new qx.ui.form.CheckBox("Paciente");
	var cbo14 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	cbo14.setEnabled(false);
	var lst14 = cbo14.getChildControl("list");
	
	var chk15 = new qx.ui.form.CheckBox("Resultado");
	var cbo15 = new qx.ui.form.SelectBox();
	cbo15.setEnabled(false);
	
	var chk16 = new qx.ui.form.CheckBox("Cert.ANSES");
	var cbo16 = new qx.ui.form.SelectBox();
	cbo16.setEnabled(false);
	
	
	
	gpb0.setLayout(new qx.ui.layout.Grid(6, 15));
	gpb1.setLayout(new qx.ui.layout.Grid(6, 6));
	
	
	
	
	
	
	rbt00.setModel(0);
	rbt00.addListener("changeValue", function(e){
		if (rbt00.isValue()) {
			chk10.setValue(false);
			chk10.setEnabled(false);
		} else chk10.setEnabled(true);
	});
	
	rbt01.setModel(1);
	rbt01.addListener("changeValue", function(e){
		if (rbt01.isValue()) {
			chk11.setValue(false);
			chk11.setEnabled(false);
		} else chk11.setEnabled(true);
	});
	
	rbt02.setModel(2);
	rbt02.addListener("changeValue", function(e){
		if (rbt02.isValue()) {
			chk12.setValue(false);
			chk12.setEnabled(false);
		} else chk12.setEnabled(true);
	});
	
	rbt03.setModel(3);
	rbt03.addListener("changeValue", function(e){
		if (rbt03.isValue()) {
			chk13.setValue(false);
			chk13.setEnabled(false);
		} else chk13.setEnabled(true);
	});
	
	rbt04.setModel(4);
	rbt04.addListener("changeValue", function(e){
		if (rbt04.isValue()) {
			chk14.setValue(false);
			chk14.setEnabled(false);
		} else chk14.setEnabled(true);
	});
	
	rbt05.setModel(5);
	rbt05.addListener("changeValue", function(e){
		if (rbt05.isValue()) {
			chk15.setValue(false);
			chk15.setEnabled(false);
		} else chk15.setEnabled(true);
	});
	
	rbt06.setModel(6);
	rbt06.addListener("changeValue", function(e){
		if (rbt06.isValue()) {
			chk16.setValue(false);
			chk16.setEnabled(false);
		} else chk16.setEnabled(true);
	});

	
	


	
	
	chk10.setModel(0);
	chk10.addListener("changeValue", function(e){
		cbo10.setEnabled(chk10.isValue());
	});
	
	chk11.setModel(1);
	chk11.addListener("changeValue", function(e){
		cbo11.setEnabled(chk11.isValue());
	});
	
	chk12.setModel(2);
	chk12.addListener("changeValue", function(e){
		cbo12.setEnabled(chk12.isValue());
	});
	
	chk13.setModel(3);
	chk13.addListener("changeValue", function(e){
		cbo13.setEnabled(chk13.isValue());
	});
	
	
	chk14.setModel(4);
	chk14.addListener("changeValue", function(e){
		cbo14.setEnabled(chk14.isValue());
	});
	
	chk15.setModel(5);
	chk15.addListener("changeValue", function(e){
		cbo15.setEnabled(chk15.isValue());
	});
	
	chk16.setModel(6);
	chk16.addListener("changeValue", function(e){
		cbo16.setEnabled(chk16.isValue());
	});
	

	
	
	
	cbo15.add(new qx.ui.form.ListItem("NORMAL", null, "1"));
	cbo15.add(new qx.ui.form.ListItem("DUDOSO", null, "2"));
	cbo15.add(new qx.ui.form.ListItem("PATOLÓGICO", null, "3"));
	
	
	cbo16.add(new qx.ui.form.ListItem("NO", null, "N"));
	cbo16.add(new qx.ui.form.ListItem("SI", null, "S"));
	
	
	var mgr = new qx.ui.form.RadioGroup();
	mgr.add(rbt00, rbt01, rbt02, rbt03, rbt04, rbt05, rbt06);

	

	gpb0.add(rbt00, {row: 0, column: 0});
	gpb0.add(rbt01, {row: 1, column: 0});
	gpb0.add(rbt02, {row: 2, column: 0});
	gpb0.add(rbt03, {row: 3, column: 0});
	gpb0.add(rbt04, {row: 4, column: 0});
	gpb0.add(rbt05, {row: 5, column: 0});
	gpb0.add(rbt06, {row: 6, column: 0});

	
	var aux = new qx.ui.layout.HBox(6).set({alignY: "middle"});
	var compositeOtros = new qx.ui.container.Composite(aux);
	this.add(compositeOtros, {left: 0, top: 274, right: "55%"});
	
	var dtfDesde = new qx.ui.form.DateField();
	var dtfHasta = new qx.ui.form.DateField();
	
	compositeOtros.add(new qx.ui.basic.Label("Período desde", {flex: 1}));
	compositeOtros.add(dtfDesde, {flex: 1});
	compositeOtros.add(new qx.ui.basic.Label("hasta"), {flex: 1});
	compositeOtros.add(dtfHasta, {flex: 1});
	compositeOtros.add(new qx.ui.basic.Atom(), {flex: 2});

	gpb1.add(chk10, {row: 0, column: 0});
	gpb1.add(cbo10, {row: 0, column: 1});
	gpb1.add(chk11, {row: 1, column: 0});
	gpb1.add(cbo11, {row: 1, column: 1});
	gpb1.add(chk12, {row: 2, column: 0});
	gpb1.add(cbo12, {row: 2, column: 1});
	gpb1.add(chk13, {row: 3, column: 0});
	gpb1.add(cbo13, {row: 3, column: 1});
	gpb1.add(chk14, {row: 4, column: 0});
	gpb1.add(cbo14, {row: 4, column: 1});
	gpb1.add(chk15, {row: 5, column: 0});
	gpb1.add(cbo15, {row: 5, column: 1});
	gpb1.add(chk16, {row: 6, column: 0});
	gpb1.add(cbo16, {row: 6, column: 1});
	
	
	this.add(gpb0, {left: 0, top: 0});
	this.add(gpb1, {left: 250, top: 0});
	
	var rbtListado = new qx.ui.form.RadioButton("Listado");
	rbtListado.setModel("listado");
	//rbtListado.setEnabled(false);
	
	var rbtTorta = new qx.ui.form.RadioButton("Torta");
	rbtTorta.setEnabled(false);
	rbtTorta.setModel("torta");
	
	var rbtBarras = new qx.ui.form.RadioButton("Barras");
	//rbtBarras.setEnabled(false);
	rbtBarras.setModel("barras");
	rbtBarras.setValue(true);
	
	var mgr3 = new qx.ui.form.RadioGroup();
	mgr3.add(rbtListado, rbtTorta, rbtBarras);
	
	compositeOtros.add(rbtListado, {flex: 1});
	compositeOtros.add(rbtTorta, {flex: 1});
	compositeOtros.add(rbtBarras, {flex: 1});
	compositeOtros.add(new qx.ui.basic.Atom(), {flex: 2});
	
	var btnGenerar = new qx.ui.form.Button("Generar")
	btnGenerar.addListener("execute", function(e){
		var bandera = true;
		
		cbo10.setValid(true);
		cbo11.setValid(true);
		cbo12.setValid(true);
		cbo13.setValid(true);
		cbo14.setValid(true);
		
		if (chk14.getValue() && lst14.isSelectionEmpty()) {
			bandera = false;
			cbo14.setInvalidMessage("Debe seleccionar un paciente");
			cbo14.setValid(false);
			cbo14.focus();
		}
		
		if (chk13.getValue() && lst13.isSelectionEmpty()) {
			bandera = false;
			cbo13.setInvalidMessage("Debe seleccionar un prestación");
			cbo13.setValid(false);
			cbo13.focus();
		}
		
		if (chk12.getValue() && lst12.isSelectionEmpty()) {
			bandera = false;
			cbo12.setInvalidMessage("Debe seleccionar un prestador");
			cbo12.setValid(false);
			cbo12.focus();
		}
		
		if (chk11.getValue() && lst11.isSelectionEmpty()) {
			bandera = false;
			cbo11.setInvalidMessage("Debe seleccionar un médico");
			cbo11.setValid(false);
			cbo11.focus();
		}

		if (chk10.getValue() && lst10.isSelectionEmpty()) {
			bandera = false;
			cbo10.setInvalidMessage("Debe seleccionar un efector");
			cbo10.setValid(false);
			cbo10.focus();
		}
		

		if (bandera) {

			var p = {};
			p.basico = {opcion: mgr.getModelSelection().getItem(0)};
			p.grafico = mgr3.getModelSelection().getItem(0);
			
			
			
			p.title = mgr.getSelection()[0].getLabel();
			//p.title = p.title.toJSON().substr(0, 10);
			//p.title+= " - " + p.pageLabel;
			
			p.pageLabel = new Date;
			p.pageLabel = p.pageLabel.toJSON().substr(0, 10);
			p.pageLabel = p.title + " - " + p.pageLabel;
			
			
					
			//var opcionVariable = mgr2.getModelSelection().getItem(0);
			p.variable = {};
			var selection;
			if (chk10.isValue()) {
				p.variable.efector = {};
				selection = lst10.getSelection()[0];
				p.variable.efector.model = selection.getModel();
				p.variable.efector.descrip = selection.getLabel();
			}
			if (chk11.isValue()) {
				p.variable.medico = {};
				selection = lst11.getSelection()[0];
				p.variable.medico.model = selection.getModel();
				p.variable.medico.descrip = selection.getLabel();
			}
			if (chk12.isValue()) {
				p.variable.prestador = {};
				selection = lst12.getSelection()[0];
				p.variable.prestador.model = selection.getModel();
				p.variable.prestador.descrip = selection.getLabel();
			}
			if (chk13.isValue()) {
				p.variable.prestacion = {};
				selection = lst13.getSelection()[0];
				p.variable.prestacion.model = selection.getModel();
				p.variable.prestacion.descrip = selection.getLabel();
			}
			if (chk14.isValue()) {
				p.variable.paciente = {};
				selection = lst14.getSelection()[0];
				p.variable.paciente.model = selection.getModel();
				p.variable.paciente.descrip = selection.getLabel();
			}
			if (chk15.isValue()) {
				p.variable.resultado = {};
				selection = cbo15.getSelection()[0];
				p.variable.resultado.model = selection.getModel();
				p.variable.resultado.descrip = selection.getLabel();
			}
			if (chk16.isValue()) {
				p.variable.anses_negativa = {};
				selection = cbo16.getSelection()[0];
				if (selection.getModel() == "S") {
					p.variable.anses_negativa.model = "N";
					p.variable.anses_negativa.descrip = "NO";
				} else {
					p.variable.anses_negativa.model = "S";
					p.variable.anses_negativa.descrip = "SI";
				}
			}
			
			//p.title+= " x " + mgr2.getSelection()[0].getLabel() + ": " + p.variable.descrip.trim();
			//p.pageLabel+= " x " + mgr2.getSelection()[0].getLabel();

			p.fecha = {desde: dtfDesde.getValue(), hasta: dtfHasta.getValue()};
			//p.title+= " (período " + p.fecha.desde + " - " + p.fecha.hasta + ")";

			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new subsidios.comp.rpc.Rpc("services/", "comp.Estadisticas");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				p.resultado = data.result;
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				
				
				
				if ((p.grafico == "barras" && p.resultado.dataSeries_cantidad.length > 0)) {
					var pagePlot = new subsidios.comp.pagePlot(p);
					application.tabviewMain.add(pagePlot);
					application.tabviewMain.setSelection([pagePlot]);				
				} else if ((p.grafico == "listado" && p.resultado.dataSeries_cantidad.length > 0)) {
					//alert(qx.lang.Json.stringify(p, null, 2));
					window.open("services/class/comp/Impresion.php?rutina=estadisticas_listado");
				} else {
					dialog.Dialog.alert("No se encuentran datos para el criterio seleccionado.");
				}
				
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				
				if (data.message != "sesion_terminada") {
					alert(qx.lang.Json.stringify(data, null, 2));
				}
			});
			
			rpc.callAsyncListeners(true, "leer_datos", p);
		}
	});
	compositeOtros.add(btnGenerar);
	
	


		
	},
	members : 
	{

	}
});