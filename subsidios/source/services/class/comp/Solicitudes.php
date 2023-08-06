<?php

session_start();

require("Base.php");

class class_Solicitudes extends class_Base
{


  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$estado = array();
	$estado["E"] = "Emitida";
	$estado["A"] = "Aprobada";
	$estado["B"] = "Bloqueada";
	$estado["N"] = "";
	$estado["P"] = "R.Parcial";
	$estado["R"] = "Rendido";
	
	
	$resultado = array();
	
	$sql = "SELECT
				solicitudes.*,
				personas1.persona_nombre AS paciente_nombre,
				personas1.persona_dni AS paciente_dni,
				personas2.persona_nombre AS solicitante_nombre,
				personas2.persona_dni AS solicitante_dni
				FROM solicitudes
					LEFT JOIN _personas AS personas1 ON solicitudes.paciente_id = personas1.persona_id
					LEFT JOIN _personas AS personas2 ON solicitudes.solicitante_id = personas2.persona_id
				WHERE TRUE";
	
	if (! is_null($p->desde) && ! is_null($p->hasta)) {
		$sql.= " AND (fecha_emite BETWEEN '" . substr($p->desde, 0, 10) . "' AND '" . substr($p->hasta, 0, 10) . "')";
	} else if (! is_null($p->desde)) {
		$sql.= " AND fecha_emite >= '" . substr($p->desde, 0, 10) . "'";
	} else if (! is_null($p->hasta)) {
		$sql.= " AND fecha_emite <= '" . substr($p->hasta, 0, 10) . "'";
	}
	
	//if (! empty($p->id_prestador_fantasia)) $sql.= " AND id_prestador_fantasia='" . $p->id_prestador_fantasia . "'";
	if (! is_null($p->id_efector_publico)) $sql.= " AND id_efector_publico='" . $p->id_efector_publico . "'";
	if (! is_null($p->paciente_id)) $sql.= " AND paciente_id='" . $p->paciente_id . "'";
	if (! is_null($p->solicitante_id)) $sql.= " AND solicitante_id='" . $p->solicitante_id . "'";
	if (! is_null($p->id_usuario_medico)) $sql.= " AND id_usuario_medico='" . $p->id_usuario_medico . "'";
	if (! empty($p->estado)) $sql.= " AND estado='" . $p->estado . "'";
	
	$sql.= " ORDER BY fecha_emite DESC, id_solicitud DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		if ($row->paciente_nombre && $row->paciente_dni) {
			$row->paciente_descrip = $row->paciente_nombre . ' (' . $row->paciente_dni . ')';
		}
		if ($row->solicitante_nombre && $row->solicitante_dni) {
			$row->solicitante_descrip = $row->solicitante_nombre . ' (' . $row->solicitante_dni . ')';
		}
		
		$row->estado_descrip = $estado[$row->estado];
		$row->estado_rendicion_descrip = $estado[$row->estado_rendicion];
		
		if ($row->estado=="E") {
			$row->estado_condicion = 1;
		} else if ($row->estado=="A") {
			$row->estado_condicion = 2;
		} else if ($row->estado=="B") {
			$row->estado_condicion = 3;
		} else {
			$row->estado_condicion = 0;
		}
		
		if ($row->estado_rendicion=="N") {
			$row->estado_rendicion_condicion = 3;
		} else if ($row->estado_rendicion=="P") {
			$row->estado_rendicion_condicion = 1;
		} else if ($row->estado_rendicion=="R") {
			$row->estado_rendicion_condicion = 2;
		} else {
			$row->estado_rendicion_condicion = 0;
		}
		

		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_efector_publico . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->efector_publico = $rowAux->organismo_area;

		/*		
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_prestador_fantasia . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->prestador = $rowAux->organismo_area;
		*/
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
	
	$sql = "SELECT";
	$sql.= "  solicitudes_prestaciones.*";
	$sql.= ", prestaciones.*";
	$sql.= ", prestaciones_tipo.denominacion AS prestacion_tipo";
	$sql.= ", prestaciones_resultados.denominacion AS prestacion_resultado";
	$sql.= " FROM solicitudes_prestaciones INNER JOIN prestaciones USING(id_prestacion) INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) LEFT JOIN prestaciones_resultados USING(id_prestacion_resultado)";
	$sql.= " WHERE solicitudes_prestaciones.id_solicitud=" . $p->id_solicitud;
	
	$resultado->prestacion = $this->toJson($sql, $opciones);
	
	
	
	$sql = "SELECT id_usuario_medico, informacion_clinica, observaciones, observaciones_bloqueo, observaciones_aprueba, anses_negativa FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$row->anses_negativa = ($row->anses_negativa == "S") ? "Si" : "No";
	
	$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->id_usuario_medico;
	$rsAux = $this->mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();
	$row->medico_descrip = $rowAux->medico_descrip;
	
	$resultado->solicitud = $row;
	
	
	return $resultado;
  }
  
  
  public function method_leer_rendiciones($params, $error) {
	$p = $params[0];
	
	$movilidad = array();
	$movilidad["1"] = "Avión";
	$movilidad["2"] = "A.Sanitario";
	$movilidad["3"] = "A.Linea";
	$movilidad["4"] = "Terrestre";
	
	$ambulancia = array();
	$ambulancia["1"] = "Médico";
	$ambulancia["2"] = "Paramédico";
	$ambulancia["3"] = "con Oxígeno";
	$ambulancia["4"] = "con Acompañante";
	
	$instancia = array();
	$instancia["1"] = "1ª vez";
	$instancia["2"] = "Ulteriores";
	$instancia["3"] = "Renovación";
	
	$destino = array();
	$destino["1"] = "Sgo.del Estero";
	$destino["2"] = "Córdoba";
	$destino["3"] = "Tucumán";
	$destino["4"] = "Otros";
	
	$transferencia = array();
	$transferencia["1"] = "Si";
	$transferencia["2"] = "No";
	$transferencia["3"] = "Casa de Santiago";
	$transferencia["4"] = "Otras";
	$transferencia["5"] = "Especificar";
	
	
	
	$resultado = new stdClass;
	
  	$opciones = new stdClass;
  	$opciones->monto_rendido = "float";
	
	$sql = "SELECT";
	$sql.= "  *";
	$sql.= " FROM rendiciones";
	$sql.= " WHERE rendiciones.id_solicitud=" . $p->id_solicitud;
	
	$resultado->rendiciones = $this->toJson($sql, $opciones);
	
	
	
	$sql = "SELECT * FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$row->insumos = array();
	if ($row->tipo == "M") {
		$sql = "SELECT sss_insumos.denominacion AS descrip, sss_insumos.codigo, sss_solicitudes_insumos.cantidad, id_prestacion_tipo FROM sss_solicitudes_insumos INNER JOIN sss_insumos USING(id_prestacion) WHERE id_solicitud=" . $row->id_solicitud;
		$rsInsumo = $this->mysqli->query($sql);
		while ($rowInsumo = $rsInsumo->fetch_object()) {
			$rowInsumo->cantidad = (float) $rowInsumo->cantidad;
			$rowInsumo->tipo_descrip = $rowInsumo->id_prestacion_tipo == 1 ? "Insumos" : "Prótesis";
			$row->insumos[] = $rowInsumo;
		}
	}
	
	$row->anses_negativa = ($row->anses_negativa == "S") ? "Si" : "No";
	
	$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->id_usuario_medico;
	$rsAux = $this->mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();
	$row->medico_descrip = $rowAux->medico_descrip;
	
	$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->deriv_id_med_derivante;
	$rsAux = $this->mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();
	$row->medico_deriv_descrip = $rowAux->medico_descrip;
	
	$row->movilidad_descrip = $movilidad[$row->dev_movilidad];
	$row->ambulancia_descrip = $ambulancia[$row->dev_ambulancia];
	$row->instancia_descrip = $instancia[$row->dev_instancia];
	$row->destino_descrip = $destino[$row->dev_destino];
	$row->transferencia_descrip = $transferencia[$row->dev_transferencia];
	
	$row->turno_confirmar_descrip = $row->dev_turno_confirmar == "1" ? "Si" : "No";
	
	$row->prac_presupuesto_descrip = $row->prac_presupuesto == "1" ? "Si" : "No";
	
	
	$resultado->solicitud = $row;
	
	
	return $resultado;
  }
  
  
  public function method_escribir_solicitud($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "solicitudes");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "UPDATE solicitudes SET " . $set . " WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_agregar_rendicion($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "solicitudes");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "INSERT rendiciones SET id_solicitud=" . $p->id_solicitud . ", descrip='" . $p->model->descrip . "', monto_rendido='" . $p->model->monto_rendido . "', observaciones='" . $p->model->observaciones . "', documento='" . $p->uploadName . "', fecha=NOW()";
	$this->mysqli->query($sql);
	$insert_id = $this->mysqli->insert_id;
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	if ($p->uuid && $p->uploadName) {
		$folder_upload = "php-traditional-server-master/files/" . $p->uuid;
		$upload = $folder_upload . "/" . $p->uploadName;
		$folder_documento = "documentos/rendiciones/" . $insert_id;
		$documento = $folder_documento . "/" . $p->uploadName;
  		if (is_dir($folder_documento)) rmdir($folder_documento);
  		mkdir($folder_documento);
  		copy("documentos/index.html", $folder_documento . "/index.html");
		rename($upload, $documento);
		rmdir($folder_upload);
	}
	
	
	$sql = "SELECT * FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud;
	$rsSolicitud = $this->mysqli->query($sql);
	$rowSolicitud = $rsSolicitud->fetch_object();
	
	$monto_rendido = (float) $rowSolicitud->monto_rendido + $p->model->monto_rendido;
	$bandera = $monto_rendido >= (float) $rowSolicitud->monto_total;
	$estado_rendicion = $bandera ? 'R' : 'P';
	
	$sql = "UPDATE solicitudes SET monto_rendido = '" . $monto_rendido . "', estado_rendicion='" . $estado_rendicion . "' WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_escribir_gde_gedo($params, $error) {
	$p = $params[0];
	
	$this->mysqli->query("START TRANSACTION");
	
	$sql = "UPDATE solicitudes SET gde = '" . $p->gde . "', gedo='" . $p->gedo . "' WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_bloquear_solicitud($params, $error) {
	$p = $params[0];
	
	$this->mysqli->query("START TRANSACTION");
		
	$sql = "UPDATE solicitudes SET observaciones_bloqueo='" . $p->observaciones_bloqueo . "', estado_pre_bloqueo='" . $p->estado . "', fecha_bloqueo=NOW(), id_usuario_bloqueo='" . $_SESSION['login']->id_oas_usuario . "', estado='B' WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_desbloquear_solicitud($params, $error) {
	$p = $params[0];
	
	$this->mysqli->query("START TRANSACTION");
	
	$sql = "UPDATE solicitudes SET observaciones_bloqueo='', estado=estado_pre_bloqueo WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_aprobar_solicitud($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT id_solicitud FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud . " AND estado='" . $p->estado . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		
		$this->mysqli->query("START TRANSACTION");
		
		$sql = "UPDATE solicitudes SET observaciones_aprueba='" . $p->observaciones_aprueba . "',  	fecha_aprueba=NOW(), id_usuario_aprueba='" . $_SESSION['login']->id_oas_usuario . "', estado='A' WHERE id_solicitud=" . $p->id_solicitud;
		$this->mysqli->query($sql);
	
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		
		$this->mysqli->query("COMMIT");
	}
  }
  
  
  public function method_eliminar_solicitud($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT id_solicitud FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud . " AND estado='" . $p->estado . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		
		$this->mysqli->query("START TRANSACTION");

		$sql = "DELETE FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud;
		$this->mysqli->query($sql);

		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);

		$this->mysqli->query("COMMIT");
	}
  }
}

?>