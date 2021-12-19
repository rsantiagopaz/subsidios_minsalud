<?php
session_start();

require("Conexion.php");

set_time_limit(0);


$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");

switch ($_REQUEST['rutina'])
{
	
case "estadisticas_listado" : {
	
	$p = $_SESSION['estadisticas_listado'];
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Estadisticas</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="6"><big><b>Sistema de Auditoría Médica (Ministerio)</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio de Salud</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>ESTADISTICAS LISTADO</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><?php echo $p->pageLabel; ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<?php
	
	$aux = array();
	
	if (isset($p->variable->efector)) $aux[] = "Efector: " . $p->variable->efector->descrip;
	if (isset($p->variable->medico)) $aux[] = "Médico: " . $p->variable->medico->descrip;
	if (isset($p->variable->prestador)) $aux[] = "Prestador: " . $p->variable->prestador->descrip;
	if (isset($p->variable->prestacion)) $aux[] = "Prestación: " . $p->variable->prestacion->descrip;
	if (isset($p->variable->paciente)) $aux[] = "Paciente: " . $p->variable->paciente->descrip;
	if (isset($p->variable->resultado)) $aux[] = "Resultado: " . $p->variable->resultado->descrip;
	if (isset($p->variable->anses_negativa)) $aux[] = "Cert.neg.ANSES: " . $p->variable->anses_negativa->descrip;
	
	if (! is_null($p->fecha->desde) && ! is_null($p->fecha->hasta)) {
		$aux[] = "Período desde: " . substr($p->fecha->desde, 0, 10) . " hasta " . substr($p->fecha->hasta, 0, 10);
	} else if (! is_null($p->fecha->desde)) {
		$aux[] = "Período desde: " . substr($p->fecha->desde, 0, 10);
	} else if (! is_null($p->fecha->hasta)) {
		$aux[] = "Período hasta: " . substr($p->fecha->hasta, 0, 10);
	}

	if (count($aux) > 0) $aux = "Variable:<br/>" . implode(", ", $aux); else $aux = "";
	
	?>

	<tr><td colspan="10"><big><?php echo $aux; ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr>
	<td colSpan="10">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	<thead>
	<tr><th>Descripción</th><th>Importe</th><th>Cantidad</th></tr>
	</thead>
	<tbody>

	<?php

	$length = count($p->resultado->series);	

	for ($i = 0; $i <= $length - 1; $i++) {
		?>
		<tr><td><?php echo $p->resultado->series[$i]->label; ?></td><td align="right"><?php echo number_format($p->resultado->dataSeries_total[$i][0], 2, ",", "."); ?></td><td align="right"><?php echo number_format($p->resultado->dataSeries_cantidad[$i][0], 0, ",", "."); ?></td></tr>
		<?php
	}
	

	?>
	
	</tbody>
	</table>
	</td>
	</tr>
	

	</table>
	</body>
	</html>
	<?php
	
break;
}

}

?>