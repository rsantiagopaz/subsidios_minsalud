<?php

session_start();

require("Base.php");

class class_Estadisticas extends class_Base
{
	
	
  public function method_leer_datos($params, $error) {
	$p = $params[0];
	
	$limit = 15;
	
	$resultado = new stdClass;
	$rows = null;
	
	
	$sql = "SELECT SUM(solicitudes_prestaciones.importe) AS total, COUNT(solicitudes.id_solicitud) AS cantidad";
	
	if ($p->basico->opcion == 0) $sql.= ", _organismos_areas.organismo_area_id AS id, _organismos_areas.organismo_area AS descrip";
	if ($p->basico->opcion == 1) $sql.= ", _personal.id_personal AS id, _personal.apenom AS descrip";
	if ($p->basico->opcion == 2) $sql.= ", prestadores_fantasia.organismo_area_id AS id, prestadores_fantasia.nombre AS descrip";
	if ($p->basico->opcion == 3) $sql.= ", prestaciones.id_prestacion AS id, prestaciones.denominacion AS descrip";
	if ($p->basico->opcion == 4) $sql.= ", _personas.persona_id AS id, _personas.persona_nombre AS descrip";
	if ($p->basico->opcion == 5) $sql.= ", prestaciones_resultados.id_prestacion_resultado AS id, prestaciones_resultados.denominacion AS descrip";
	if ($p->basico->opcion == 6) $sql.= ", solicitudes.id_solicitud AS id, solicitudes.anses_negativa AS descrip";
	
	$sql.= " FROM solicitudes";
	/*
	if ($p->basico->opcion == 0) $sql.= " INNER JOIN _organismos_areas ON solicitudes.id_efector_publico = _organismos_areas.organismo_area_id";
	if ($p->basico->opcion == 1) $sql.= " INNER JOIN _personal ON solicitudes.id_usuario_medico = _personal.id_personal";
	if ($p->basico->opcion == 2) $sql.= " INNER JOIN prestadores_fantasia ON solicitudes.id_prestador_fantasia = prestadores_fantasia.organismo_area_id";
	if ($p->basico->opcion == 4) $sql.= " INNER JOIN _personas ON solicitudes.persona_id = _personas.persona_id";
	*/
	
	$sql.= " INNER JOIN _organismos_areas ON solicitudes.id_efector_publico = _organismos_areas.organismo_area_id";
	$sql.= " INNER JOIN _personal ON solicitudes.id_usuario_medico = _personal.id_personal";
	$sql.= " INNER JOIN prestadores_fantasia ON solicitudes.id_prestador_fantasia = prestadores_fantasia.organismo_area_id";
	$sql.= " INNER JOIN _personas ON solicitudes.persona_id = _personas.persona_id";
	$sql.= " INNER JOIN solicitudes_prestaciones USING(id_solicitud)";
	$sql.= " INNER JOIN prestaciones USING(id_prestacion)";
	if ($p->basico->opcion == 5) $sql.= " LEFT JOIN prestaciones_resultados USING(id_prestacion_resultado)";
	
	$sql.= " WHERE TRUE";
	
	if (! is_null($p->fecha->desde) && ! is_null($p->fecha->hasta)) {
		$sql.= " AND (DATE(solicitudes.fecha_emite) BETWEEN '" . substr($p->fecha->desde, 0, 10) . "' AND '" . substr($p->fecha->hasta, 0, 10) . "')";
	} else if (! is_null($p->fecha->desde)) {
		$sql.= " AND DATE(solicitudes.fecha_emite) >= '" . substr($p->fecha->desde, 0, 10) . "'";
	} else if (! is_null($p->fecha->hasta)) {
		$sql.= " AND DATE(solicitudes.fecha_emite) <= '" . substr($p->fecha->hasta, 0, 10) . "'";
	}
	
	if (isset($p->variable->efector)) $sql.= " AND solicitudes.id_efector_publico='" . $p->variable->efector->model . "'";
	if (isset($p->variable->medico)) $sql.= " AND solicitudes.id_usuario_medico='" . $p->variable->medico->model . "'";
	if (isset($p->variable->prestador)) $sql.= " AND solicitudes.id_prestador_fantasia='" . $p->variable->prestador->model . "'";
	if (isset($p->variable->prestacion)) $sql.= " AND solicitudes_prestaciones.id_prestacion='" . $p->variable->prestacion->model . "'";
	if (isset($p->variable->paciente)) $sql.= " AND solicitudes.persona_id='" . $p->variable->paciente->model . "'";
	if (isset($p->variable->resultado)) $sql.= " AND solicitudes_prestaciones.id_prestacion_resultado='" . $p->variable->resultado->model . "'";
	if (isset($p->variable->anses_negativa)) $sql.= " AND solicitudes.anses_negativa='" . $p->variable->anses_negativa->model . "'";
	
	$sql.= " GROUP BY id";
	
	$sql.= " ORDER BY total DESC, cantidad";
	$sql.= " LIMIT " . $limit;
	
	
	
	//return $sql;
	//$rs = $this->mysqli->query($sql);
	//return "ahora esta bien";
	//return $this->mysqli->error;
	
	$rows = $this->toJson($sql);
	

	
	if ($p->grafico == "torta") {
		$dataSeries = array();
		foreach ($rows as $row) {
			$dataSeries[] = array($row->descrip, (int) $row->cantidad);
		}
		
		$resultado->dataSeries = array($dataSeries);

	} else {
		$dataSeries_total = array();
		$dataSeries_cantidad = array();
		$series = array();
		foreach ($rows as $row) {
			$dataSeries_total[] = array((float) $row->total);
			$dataSeries_cantidad[] = array((int) $row->cantidad);
			
			$aux = new stdClass;
			$aux->label = $row->descrip;
			$series[] = $aux;
		}
		
		$resultado->dataSeries_total = $dataSeries_total;
		$resultado->dataSeries_cantidad = $dataSeries_cantidad;
		$resultado->series = $series;
	}
	
	$p->resultado = $resultado;
	
	$_SESSION['estadisticas_listado'] = $p;
	
	return $resultado;
  }
}

?>