<?php
session_start();

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_prestador($params, $error) {
  	$p = $params[0];
  	
  	$fecha = date("Y-m-d");
  	
  	$organismo_area_id = $p->model->organismo_area_id;

	$sql = "SELECT organismo_area_id FROM _organismos_areas WHERE organismo_area_estado='3' AND organismo_area LIKE '" . $p->model->nombre . "' AND organismo_area_id <> '" . $p->model->organismo_area_id . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->organismo_area_id, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($p->model->organismo_area_id == "-1") {
		
		do {
			$organismo_area_id = $this->generateRandomString(5);
			
			$sql = "SELECT organismo_area_id FROM _organismos_areas WHERE organismo_area_id='" . $organismo_area_id . "'";
			$rs = $this->mysqli->query($sql);
			
		} while ($rs->num_rows > 0);
		
		$p->model->organismo_area_id = $organismo_area_id;
		
		
		 




		
		$sig_semanal = "NULL";
		
		if (false && $p->model->cronograma_semanal) {
			
			$sig_semanal = $this->calcular_turno_semanal($p->prestador_tipo);
			$sig_semanal = "'" . $sig_semanal->organismo_area_id . "'";
			
			
			$sql = "SELECT * FROM prestadores_fantasia WHERE sig_semanal=" . $sig_semanal;
			$rs = $this->mysqli->query($sql);
			if ($rs->num_rows > 0) {
				$row = $rs->fetch_object();
			
				$sql = "UPDATE prestadores_fantasia SET sig_semanal='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
				$this->mysqli->query($sql);
				
				$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
			}
		}
		
		
		
		
		
		$sig_mensual = "NULL";
		
		if (false && $p->model->cronograma_mensual) {
			
			$sig_mensual = $this->calcular_turno_mensual($p->prestador_tipo);
			$sig_mensual = "'" . $sig_mensual->organismo_area_id . "'";
			
			
			$sql = "SELECT * FROM prestadores_fantasia WHERE sig_mensual=" . $sig_mensual;
			$rs = $this->mysqli->query($sql);
			if ($rs->num_rows > 0) {
				$row = $rs->fetch_object();
			
				$sql = "UPDATE prestadores_fantasia SET sig_mensual='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
				$this->mysqli->query($sql);
				
				$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
			}
		}
		
		
		
	
		
		
		$sql = "INSERT _organismos_areas SET organismo_area='" . $p->model->nombre . "', organismo_area_id='" . $organismo_area_id . "', organismo_area_estado='3', organismo_area_tipo_id='E', organismo_id='PP', publico='N'";
		$this->mysqli->query($sql);
		
		$p->model->prestador_tipo = $p->prestador_tipo;
		$set = $this->prepararCampos($p->model, "prestadores_fantasia");
		
		$sql = "INSERT prestadores_fantasia SET " . $set . ", fecha_alta=NOW(), sig_semanal=" . $sig_semanal . ", sig_mensual=" . $sig_mensual;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);

	} else {
		
		$sql = "UPDATE _organismos_areas SET organismo_area='" . $p->model->nombre . "' WHERE organismo_area_id='" . $organismo_area_id . "'";
		$this->mysqli->query($sql);
		
		
		$set = $this->prepararCampos($p->model, "prestadores_fantasia");
		
		$sql = "INSERT prestadores_fantasia SET " . $set . ", fecha_alta=NOW() ON DUPLICATE KEY UPDATE " . $set;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		
	}
	
	$this->mysqli->query("COMMIT");
	
	return $organismo_area_id;
  }
  
  
  public function method_calcular_turno_semanal($params, $error) {
  	$p = $params[0];
  	
  	return $this->calcular_turno_semanal($p->prestador_tipo);
  }
  
  public function method_calcular_turno_mensual($params, $error) {
  	$p = $params[0];
  	
  	return $this->calcular_turno_mensual($p->prestador_tipo);
  }
  
  
  public function calcular_turno_semanal($prestador_tipo) {
  	
  	$fecha = date("Y-m-d");
  	
	$row = null;
	$sig_semanal = "NULL";
	$periodo_descrip = null;
		
	do {
		if ($prestador_tipo == 'acd') {
			$sql = "SELECT * FROM cronograma_semanal";
		} else if ($prestador_tipo == 'pl') {
			$sql = "SELECT * FROM plh_cronograma_semanal";
		}
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
		  	$sql = "SELECT organismo_area_id, fecha_alta";
		  	$sql.= " FROM prestadores_fantasia";
		  	$sql.= " WHERE cronograma_semanal AND prestador_tipo = '" . $prestador_tipo . "'";
		  	$sql.= " ORDER BY fecha_alta";
		  	
		  	$rs = $this->mysqli->query($sql);
		  	
		  	if ($rs->num_rows > 0) {
		  		$row = $rs->fetch_object();
		  		
				$datetime = new DateTime($row->fecha_alta);
				$datetime = $datetime->add(new DateInterval("P1W"));
				$fecha_hasta = $datetime->format("Y-m-d");
		 
		 		if ($prestador_tipo == 'acd') {
					$sql = "INSERT cronograma_semanal";
				} else if ($prestador_tipo == 'pl') {
					$sql = "INSERT plh_cronograma_semanal";
				}
				
				$sql.= " SET id_prestador_fantasia='" . $row->organismo_area_id . "', fecha_desde='" . $row->fecha_alta . "', fecha_hasta='" . $fecha_hasta . "'";
				
				$this->mysqli->query($sql);
				
				continue;
		  	}
		}
			
		for ($i = 1; $i <= $rs->num_rows; $i++) {
			$row = $rs->fetch_object();
			if ($fecha >= $row->fecha_desde && $fecha <= $row->fecha_hasta) {
				$sig_semanal = $row->id_prestador_fantasia;
				$periodo_descrip = $row->fecha_desde . " - " . $row->fecha_hasta;
				break;
			}
		}

		if (($sig_semanal == "NULL")) {
			$datetime = new DateTime($row->fecha_hasta);
			
			$datetime = $datetime->add(new DateInterval("P1D"));
			$fecha_desde = $datetime->format("Y-m-d");
			
			$datetime = new DateTime($row->fecha_hasta);
			
			$datetime = $datetime->add(new DateInterval("P1W"));
			$fecha_hasta = $datetime->format("Y-m-d");
			
			
			$id_prestador_fantasia = $row->id_prestador_fantasia;
			
			do {
				$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $id_prestador_fantasia . "'";
				$rsPD = $this->mysqli->query($sql);
				$rowPD = $rsPD->fetch_object();
				
				$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $rowPD->sig_semanal . "'";
				$rsSig = $this->mysqli->query($sql);
				$rowSig = $rsSig->fetch_object();
				
				if ($rowSig->fecha_alta >= $fecha_desde) {
					$id_prestador_fantasia = $rowPD->sig_semanal;
					$bandera = true;
				} else {
					$bandera = false;
				}
			
			} while ($bandera);
			
			
			if ($prestador_tipo == 'acd') {
				$sql = "INSERT cronograma_semanal SET id_prestador_fantasia='" . $rowPD->sig_semanal . "', fecha_desde='" . $fecha_desde . "', fecha_hasta='" . $fecha_hasta . "'";
			} else if ($prestador_tipo == 'pl') {
				$sql = "INSERT plh_cronograma_semanal SET id_prestador_fantasia='" . $rowPD->sig_semanal . "', fecha_desde='" . $fecha_desde . "', fecha_hasta='" . $fecha_hasta . "'";
			}
			
			$this->mysqli->query($sql);
		}
		
	} while ($sig_semanal == "NULL");
	
	
	$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $sig_semanal . "'";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$row->periodo_descrip = $periodo_descrip;
	
	return $row;
  }
  
  
  public function calcular_turno_mensual($prestador_tipo) {
 	
  	$fecha = date("Y-m-d");
  	
	$row = null;
	$sig_mensual = "NULL";
	$periodo_descrip = null;
	
	$meses = array();
	$meses[1] = "Enero";
	$meses[2] = "Febrero";
	$meses[3] = "Marzo";
	$meses[4] = "Abril";
	$meses[5] = "Mayo";
	$meses[6] = "Junio";
	$meses[7] = "Julio";
	$meses[8] = "Agosto";
	$meses[9] = "Septiembre";
	$meses[10] = "Octubre";
	$meses[11] = "Noviembre";
	$meses[12] = "Diciembre";
		
	do {
		if ($prestador_tipo == 'acd') {
			$sql = "SELECT * FROM cronograma_mensual";
		} else if ($prestador_tipo == 'pl') {
			$sql = "SELECT * FROM plh_cronograma_mensual";
		}
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
		  	$sql = "SELECT organismo_area_id, fecha_alta";
		  	$sql.= " FROM prestadores_fantasia";
		  	$sql.= " WHERE cronograma_mensual AND prestador_tipo = '" . $prestador_tipo . "'";
		  	$sql.= " ORDER BY fecha_alta";
		  	
		  	$rs = $this->mysqli->query($sql);
		  	
		  	if ($rs->num_rows > 0) {
		  		$row = $rs->fetch_object();
		  		
				$datetime = new DateTime($row->fecha_alta);
				$fecha = $datetime->format("Y-m-01");
		 
		 		if ($prestador_tipo == 'acd') {
					$sql = "INSERT cronograma_mensual";
				} else if ($prestador_tipo == 'pl') {
					$sql = "INSERT plh_cronograma_mensual";
				}
				
				$sql.= " SET id_prestador_fantasia='" . $row->organismo_area_id . "', fecha='" . $fecha . "'";
				
				$this->mysqli->query($sql);
				
				continue;
		  	}
		}
		
		for ($i = 1; $i <= $rs->num_rows; $i++) {
			$row = $rs->fetch_object();
			
			if (substr($fecha, 0, 4) == substr($row->fecha, 0, 4) && substr($fecha, 5, 2) == substr($row->fecha, 5, 2)) {
				$sig_mensual = $row->id_prestador_fantasia;
				$periodo_descrip = $meses[(int) substr($row->fecha, 5, 2)];
				break;
			}
		}

		if (($sig_mensual == "NULL")) {
			$datetime = new DateTime(substr($row->fecha, 0, 4) . "-" . substr($row->fecha, 5, 2) . "-" . "01");
			$datetime->add(new DateInterval("P1M"));
			$fecha_desde = $datetime->format("Y") . "-" . $datetime->format("m") . "-" . "01";
			
			
			$id_prestador_fantasia = $row->id_prestador_fantasia;
			
			do {
				$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $id_prestador_fantasia . "'";
				$rsPD = $this->mysqli->query($sql);
				$rowPD = $rsPD->fetch_object();
				
				$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $rowPD->sig_mensual . "'";
				$rsSig = $this->mysqli->query($sql);
				$rowSig = $rsSig->fetch_object();
				
				if ($rowSig->fecha_alta >= $fecha_desde) {
					$id_prestador_fantasia = $rowPD->sig_mensual;
					$bandera = true;
				} else {
					$bandera = false;
				}
			
			} while ($bandera);
			
			if ($prestador_tipo == 'acd') {
				$sql = "INSERT cronograma_mensual SET id_prestador_fantasia='" . $rowPD->sig_mensual . "', fecha='" . $fecha_desde . "'";
			} else if ($prestador_tipo == 'pl') {
				$sql = "INSERT plh_cronograma_mensual SET id_prestador_fantasia='" . $rowPD->sig_mensual . "', fecha='" . $fecha_desde . "'";
			}
			
			$this->mysqli->query($sql);
		}
		
	} while ($sig_mensual == "NULL");
	
	$sql = "SELECT * FROM prestadores_fantasia WHERE organismo_area_id='" . $sig_mensual . "'";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$row->periodo_descrip = $periodo_descrip;
	
	return $row;
  }
  
  
  
  public function method_alta_modifica_razon_social($params, $error) {
  	$p = $params[0];
  	
  	$id_prestador = $p->model->id_prestador;
	
	$sql = "SELECT id_prestador FROM prestadores WHERE nombre LIKE '" . $p->model->nombre . "' AND id_prestador <> '" . $id_prestador . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->organismo_area_id, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if (is_null($p->model->id_prestador)) {
		$set = $this->prepararCampos($p->model, "prestadores");
		
		$sql = "INSERT prestadores SET " . $set;
		$this->mysqli->query($sql);
		
		$id_prestador = $this->mysqli->insert_id;
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	} else {
		
		$set = $this->prepararCampos($p->model, "prestadores");
		
		$sql = "UPDATE prestadores SET " . $set . " WHERE id_prestador=" . $id_prestador;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id_prestador;
  }
	
	
  public function method_alta_modifica_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$id_prestacion = $p->model->id_prestacion;
  	
	$sql = "SELECT id_prestacion FROM prestaciones WHERE codigo LIKE '" . $p->model->codigo . "' AND id_prestacion<>" . $p->model->id_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion, "codigo_duplicado");
		return $error;
	}
	
	$sql = "SELECT id_prestacion FROM prestaciones WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_prestacion<>" . $p->model->id_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion, "descrip_duplicado");
		return $error;
	}

		
	$set = $this->prepararCampos($p->model, "prestaciones");
		
	if ($p->model->id_prestacion == "0") {
		$sql = "INSERT prestaciones SET " . $set;
		$this->mysqli->query($sql);
		
		$id_prestacion = $this->mysqli->insert_id;
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	} else {
		$sql = "UPDATE prestaciones SET " . $set . " WHERE id_prestacion=" . $p->model->id_prestacion;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	}
	
	return $id_prestacion;
  }
	
	
  public function method_alta_modifica_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$id_prestacion_tipo = $p->model->id_prestacion_tipo;
  	
	$sql = "SELECT id_prestacion_tipo FROM prestaciones_tipo WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_prestacion_tipo<>" . $p->model->id_prestacion_tipo;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion_tipo, "duplicado");
		return $error;
	} else {
		$set = $this->prepararCampos($p->model, "prestaciones_tipo");
			
		if ($p->model->id_prestacion_tipo == "0") {
			$sql = "INSERT prestaciones_tipo SET " . $set;
			$this->mysqli->query($sql);
			
			$id_prestacion_tipo = $this->mysqli->insert_id;
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		} else {
			$sql = "UPDATE prestaciones_tipo SET " . $set . " WHERE id_prestacion_tipo=" . $p->model->id_prestacion_tipo;
			$this->mysqli->query($sql);
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		}
		
		return $id_prestacion_tipo;
	}
  }

  
  
  public function method_leer_prestador_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	$sql = "SELECT";
  	$sql.= "  prestaciones.*";
  	$sql.= ", prestadores_prestaciones.id_prestador_prestacion";
  	$sql.= ", prestaciones_subtipo.denominacion AS subtipo_descrip";
  	$sql.= ", prestadores_prestaciones.estado";
  	$sql.= " FROM prestadores_prestaciones INNER JOIN prestaciones USING(id_prestacion) LEFT JOIN prestaciones_subtipo USING(id_prestacion_subtipo)";
  	$sql.= " WHERE id_prestador='" . $p->id_prestador . "'";
  	$sql.= " ORDER BY denominacion";
  	
  	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_agregar_prestador_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM prestadores_prestaciones WHERE id_prestador='" . $p->id_prestador . "' AND id_prestacion='" . $p->id_prestacion . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows == 0) {
	  	$sql = "INSERT prestadores_prestaciones SET";
	  	$sql.= "  id_prestador='" . $p->id_prestador . "'";
	  	$sql.= ", id_prestacion='" . $p->id_prestacion . "'";
	  	$sql.= ", estado='H'";
	  	
	  	$this->mysqli->query($sql);
	  	
	  	$insert_id = $this->mysqli->insert_id;
	  	
	  	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	  	
	} else {
		$row = $rs->fetch_object();
		
		$insert_id = $row->id_prestador_prestacion;
	}
  	
  	return $insert_id;
  }
  
  
  public function method_leer_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM prestaciones_tipo";

	return $this->toJson($sql);
  }
  
  
  public function method_escribir_estado($params, $error) {
	$p = $params[0];

	if (is_null($p->id_prestador_prestacion)) {
		$sql = "UPDATE prestadores_prestaciones INNER JOIN prestaciones USING(id_prestacion) SET prestadores_prestaciones.estado='" . $p->estado . "' WHERE prestadores_prestaciones.id_prestador=" . $p->id_prestador . " AND prestaciones.id_prestacion_subtipo=" . $p->id_prestacion_subtipo;
	} else {
		$sql = "UPDATE prestadores_prestaciones SET estado='" . $p->estado . "' WHERE id_prestador_prestacion=" . $p->id_prestador_prestacion;
	}

	$this->mysqli->query($sql);

	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
  }
  
  
  public function method_autocompletarPersona($params, $error) {
	$p = $params[0];

	if (is_numeric($p->texto)) {
		$sql = "SELECT persona_id AS model, CONCAT(persona_dni, ' - ', persona_nombre) AS label FROM _personas WHERE persona_dni LIKE '". $p->texto . "%' ORDER BY label";
	} else {
		$sql = "SELECT persona_id AS model, CONCAT(TRIM(persona_nombre), ' (', persona_dni, ')') AS label FROM _personas WHERE persona_nombre LIKE '%". $p->texto . "%' ORDER BY label";
	}

	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarPrestador($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();

  	
  	$sql = "SELECT organismo_area_id AS model, organismo_area AS label, organismo_area AS denominacion, prestadores_fantasia.*";
  	$sql.= " FROM _organismos_areas INNER JOIN prestadores_fantasia USING(organismo_area_id)";
  	$sql.= " WHERE organismo_area_estado='3' AND organismo_area LIKE '%". $p->texto . "%'";
  	if ($p->prestador_tipo) {
  		$sql.= " AND prestadores_fantasia.prestador_tipo = '" . $p->prestador_tipo . "'";
  	}
  	$sql.= " ORDER BY organismo_area";
  	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->semanal_descrip = "";
		$row->mensual_descrip = "";
		
		if (is_null($row->organismo_area_id)) {
			$row->organismo_area_id = $row->model;
			$row->domicilio = "";
			$row->telefonos = "";
			$row->contacto = "";
			$row->observaciones = "";
			$row->cronograma_semanal = 0;
			$row->cronograma_mensual = 0;
		}
		
		$row->cronograma_semanal = (bool) $row->cronograma_semanal;
		$row->cronograma_mensual = (bool) $row->cronograma_mensual;
		
		if (! empty($row->sig_semanal)) {
			$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->sig_semanal . "'";
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->semanal_descrip = $rowAux->organismo_area;
		}
		
		if (! empty($row->sig_mensual)) {
			$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->sig_mensual . "'";
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->mensual_descrip = $rowAux->organismo_area;
		}
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_autocompletarRS($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM prestadores WHERE id_prestador_fantasia='" . $p->organismo_area_id . "' AND nombre LIKE '%". $p->texto . "%' ORDER BY nombre";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarPrestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT prestaciones.*, prestaciones_subtipo.denominacion AS subtipo_descrip, id_prestacion AS model, CONCAT(prestaciones.codigo, ', ', prestaciones.denominacion, ' (', prestaciones_tipo.denominacion, ')') AS label FROM prestaciones INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) LEFT JOIN prestaciones_subtipo USING(id_prestacion_subtipo) WHERE prestaciones.codigo LIKE'%". $p->texto . "%'";
  	} else {
  		$sql = "SELECT prestaciones.*, prestaciones_subtipo.denominacion AS subtipo_descrip, id_prestacion AS model, CONCAT(prestaciones.denominacion, ', ', prestaciones.codigo, ' (', prestaciones_tipo.denominacion, ')') AS label FROM prestaciones INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) LEFT JOIN prestaciones_subtipo USING(id_prestacion_subtipo) WHERE prestaciones.denominacion LIKE'%". $p->texto . "%'";
  		if (! is_null($p->phpParametros)) $sql.= " AND id_prestacion_tipo=" . $p->phpParametros->id_prestacion_tipo;  		
  	}
  	
  	$sql.= " ORDER BY label";


	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarPersonal($params, $error) {
	$p = $params[0];

	$sql = "SELECT id_personal AS model, TRIM(apenom) AS label FROM _personal WHERE apenom LIKE '%". $p->texto . "%' ORDER BY label";
	
	$sql = "SELECT id_personal AS model, TRIM(apenom) AS label FROM _personal WHERE id_profesion = '1' AND apenom LIKE '%" . $p->texto . "%' ORDER BY label";

	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarEfector($params, $error) {
	$p = $params[0];

	$sql = "SELECT organismo_area_id AS id, TRIM(organismo_area) AS label FROM _organismos_areas WHERE organismo_area LIKE '%". $p->texto . "%' ORDER BY label";
	
	$sql = "(SELECT _organismos_areas.organismo_area_id AS model, CONCAT(_organismos_areas.organismo_area, ' (', _departamentos.departamento, ')') AS label FROM _organismos_areas INNER JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec WHERE _organismos_areas.organismo_area_tipo_id='E' AND _departamentos.provincia_id=21 AND _organismos_areas.organismo_area LIKE '%" . $p->texto . "%')";
	$sql.= " UNION DISTINCT";
	$sql.=" (SELECT _organismos_areas.organismo_area_id AS model, CONCAT(_organismos_areas.organismo_area, ' (', _organismos.organismo, ')') AS label FROM _organismos_areas INNER JOIN _organismos USING(organismo_id) WHERE _organismos_areas.organismo_area_tipo_id<>'E' AND (_organismos_areas.organismo_id='33' OR _organismos_areas.organismo_id='54') AND _organismos_areas.organismo_area LIKE '%" . $p->texto . "%')";
	$sql.= " ORDER BY label";
	$rs = $this->mysqli->query($sql);

	return $this->toJson($rs);
  }
  
  
  public function method_autocompletarSubtipo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_prestacion_subtipo AS model, denominacion AS label FROM prestaciones_subtipo WHERE denominacion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_escribir_contrasena($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM _usuarios WHERE SYSusuario='" . $p->model->usuario . "' AND SYSpassword=MD5('" . $p->model->password . "')";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
  		$sql = "UPDATE _usuarios SET SYSpassword=MD5('" . $p->model->passnueva . "') WHERE SYSusuario='" . $p->model->usuario . "'";
  		$this->mysqli->query($sql);
	} else {
		$error->SetError(0, "password");
		return $error;
	}
  }
  
  
  public function generateRandomString($length = 10) {
	return substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }
}

?>