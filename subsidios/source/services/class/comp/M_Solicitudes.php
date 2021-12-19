<?php

session_start();

require("Base.php");

class class_M_Solicitudes extends class_Base
{


  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$estado = array();
	$estado["EH"] = "Emitida Hospital";
	$estado["AS"] = "Autorizada Ser.Soc.Min.";
	$estado["DS"] = "Denegada Ser.Soc.Min.";
	$estado["AA"] = "Autorizada Aud.Med.Min.";
	$estado["DA"] = "Denegada Aud.Med.Min.";
	$estado["EF"] = "Entregada Farmacia";
	$estado["DF"] = "Denegada Farmacia";
	
	
	$resultado = array();
	
	$sql = "SELECT DISTINCTROW";
	$sql.= " m_solicitudes.*, _personas.persona_nombre, _personas.persona_dni";
	$sql.= " FROM m_solicitudes INNER JOIN _personas USING(persona_id) INNER JOIN m_solicitudes_items USING(id_m_solicitud) INNER JOIN m_vademecum USING(id_m_vademecum)";
	$sql.= " WHERE TRUE";
	
	if (! is_null($p->desde) && ! is_null($p->hasta)) {
		$sql.= " AND (fecha_emite BETWEEN '" . substr($p->desde, 0, 10) . "' AND '" . substr($p->hasta, 0, 10) . "')";
	} else if (! is_null($p->desde)) {
		$sql.= " AND fecha_emite >= '" . substr($p->desde, 0, 10) . "'";
	} else if (! is_null($p->hasta)) {
		$sql.= " AND fecha_emite <= '" . substr($p->hasta, 0, 10) . "'";
	}
	
	if (! is_null($p->persona_id)) $sql.= " AND m_solicitudes.persona_id='" . $p->persona_id . "'";
	if (! empty($p->id_m_tipo_producto)) $sql.= " AND m_vademecum.id_m_tipo_producto='" . $p->id_m_tipo_producto . "'";
	if (! is_null($p->id_m_vademecum)) $sql.= " AND m_solicitudes_items.id_m_vademecum='" . $p->id_m_vademecum . "'";
	if (! is_null($p->id_usuario_medico)) $sql.= " AND m_solicitudes.id_usuario_medico='" . $p->id_usuario_medico . "'";
	if (! empty($p->estado)) $sql.= " AND m_solicitudes.estado='" . $p->estado . "'";
	
	$sql.= " ORDER BY fecha_emite DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->estado_descrip = $estado[$row->estado];
		
		if ($row->estado=="EH") {
			$row->estado_condicion = 1;
		} else if ($row->estado=="AA") {
			$row->estado_condicion = 2;
		} else if ($row->estado=="DA") {
			$row->estado_condicion = 3;
		} else {
			$row->estado_condicion = 0;
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
		
		$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->id_usuario_medico;
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->medico_descrip = $rowAux->medico_descrip;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
	
	$opciones = new stdClass;
	$opciones->functionAux = function (&$row, $col) {
		$estado = array();
		$estado["PE"] = "Pendiente entrega";
		$estado["DA"] = "Denegada Aud.Med.Min.";
		$estado["EI"] = "Entregado incompleto";
		$estado["EC"] = "Entregado completo";
		
		 
		$row->precio = (float) $row->precio;
		$row->cantidad_entregada = (float) $row->cantidad_entregada;
		$row->dosis_diaria = (float) $row->dosis_diaria;
		$row->duracion_tratamiento = (float) $row->duracion_tratamiento;
		
		$row->cantidad_pedida = $row->dosis_diaria * $row->duracion_tratamiento;
		
		$row->estado_descrip = $estado[$row->estado];
		
		if ($row->m_solicitudes_estado=="EH") {
			$row->estado_condicion = 1;
		} else if ($row->estado=="PE") {
			$row->estado_condicion = 2;
		} else if ($row->estado=="DA") {
			$row->estado_condicion = 3;
		} else if ($row->estado=="EI") {
			$row->estado_condicion = 4;
		} else {
			$row->estado_condicion = 0;
		}
  	};
	
	
	$sql = "SELECT";
	$sql.= "  m_solicitudes_items.*";
	$sql.= ", m_solicitudes.estado AS m_solicitudes_estado";
	$sql.= ", m_vademecum.*";
	$sql.= ", m_tipo_producto.descripcion AS tipo_producto_descripcion";
	$sql.= ", m_unidades.descripcion AS unidades_descripcion";
	$sql.= " FROM m_solicitudes INNER JOIN m_solicitudes_items USING(id_m_solicitud) INNER JOIN m_vademecum USING(id_m_vademecum) INNER JOIN m_tipo_producto USING(id_m_tipo_producto) INNER JOIN m_unidades USING(id_m_unidad)";
	$sql.= " WHERE m_solicitudes.id_m_solicitud=" . $p->id_m_solicitud;
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_escribir_solicitud($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "m_solicitudes");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "UPDATE m_solicitudes SET " . $set . " WHERE id_m_solicitud=" . $p->id_m_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_escribir_prestacion($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "m_solicitudes_items");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "UPDATE m_solicitudes_items SET " . $set . " WHERE id_m_solicitud_item=" . $p->id_m_solicitud_item;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
}































?>