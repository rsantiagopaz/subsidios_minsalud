qx.Class.define("subsidios.comp.pagePlot",
{
	extend : qx.ui.tabview.Page,
	construct : function (paramet)
	{
	this.base(arguments);

	this.setLabel(paramet.pageLabel);
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		//cgb.setValue(false);
	});
	

	

	var plot, plot2;
	
	if (paramet.grafico == "torta") {
		var options = function($jqplot){
			$jqplot.sprintf.thousandsSeparator = '.';
			$jqplot.sprintf.decimalMark = ',';
			
			return {
			    title: paramet.title,
			    seriesDefaults:{renderer: $jqplot.PieRenderer, rendererOptions: {showDataLabels: true, dataLabelThreshold: 1, dataLabelFormatString: '%.1f%%'}},
			    legend: {show: true}
			}
		};
		var plugins = ['pieRenderer'];
		
		//plot = new qxjqplot.Plot(paramet.resultado.dataSeries, options, plugins);

	} else {
		var options = function($jqplot){
			$jqplot.sprintf.thousandsSeparator = '.';
			$jqplot.sprintf.decimalMark = ',';
			
			return {
			    //title: paramet.title,
			    title: "Importe",
			    seriesDefaults:{renderer: $jqplot.BarRenderer, pointLabels: {show: true}},
				series: paramet.resultado.series,
			    legend: {show: true},
				axes:{
					xaxis:{
						renderer: $jqplot.CategoryAxisRenderer,
						ticks: [""]
					},
					yaxis: {
						tickOptions: {
							formatString: "%'.2f"
						}
					}
				}
			}
		};
		
		var plugins = ['barRenderer', 'categoryAxisRenderer', 'pointLabels'];
		
		//plot = new qxjqplot.Plot(paramet.resultado.dataSeries_total, options, plugins);
		

		var options = function($jqplot){
			$jqplot.sprintf.thousandsSeparator = '.';
			$jqplot.sprintf.decimalMark = ',';
			
			return {
			    //title: paramet.title,
			    title: "Cantidad",
			    seriesDefaults:{renderer: $jqplot.BarRenderer, pointLabels: {show: true}},
				series: paramet.resultado.series,
			    legend: {show: false},
				axes:{
					xaxis:{
						renderer: $jqplot.CategoryAxisRenderer,
						ticks: [""]
					},
					yaxis: {
						tickOptions: {
							formatString: "%'d"
						}
					}
				}
			}
		};
		
		//plot2 = new qxjqplot.Plot(paramet.resultado.dataSeries_cantidad, options, plugins);
	}
	
	
	var formatDate = new qx.util.format.DateFormat("d/M/y");
	var aux = [];
	
	if (paramet.variable.efector) aux.push("Efector: " + paramet.variable.efector.descrip);
	if (paramet.variable.medico) aux.push("Médico: " + paramet.variable.medico.descrip);
	if (paramet.variable.prestador) aux.push("Prestador: " + paramet.variable.prestador.descrip);
	if (paramet.variable.prestacion) aux.push("Prestación: " + paramet.variable.prestacion.descrip);
	if (paramet.variable.paciente) aux.push("Paciente: " + paramet.variable.paciente.descrip);
	if (paramet.variable.resultado) aux.push("Resultado: " + paramet.variable.resultado.descrip);
	if (paramet.variable.anses_negativa) aux.push("Cert.neg.ANSES: " + paramet.variable.anses_negativa.descrip);
	
	if (paramet.fecha.desde && paramet.fecha.hasta) {
		aux.push("Período desde: " + formatDate.format(paramet.fecha.desde) + " hasta " + formatDate.format(paramet.fecha.hasta));
	} else if (paramet.fecha.desde) {
		aux.push("Período desde: " + formatDate.format(paramet.fecha.desde));
	} else if (paramet.fecha.hasta) {
		aux.push("Período hasta: " + formatDate.format(paramet.fecha.hasta));
	}

	aux = aux.join(", ");
	if (aux) aux = "Variable:<br/>" + aux;
	
	var label = new qx.ui.basic.Label(aux);
	label.setRich(true);
	label.setWrap(true);
	label.setTextAlign("center");
	this.add(label, {left: 0, top: 0, right: 0});
	this.add(plot, {left: 0, top: 50, right: "50%", bottom: 0});
	this.add(plot2, {left: "50%", top: 50, right: 0, bottom: 0});

		
	},
	members : 
	{

	}
});