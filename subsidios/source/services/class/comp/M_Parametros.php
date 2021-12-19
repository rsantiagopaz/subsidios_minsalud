<?php
session_start();

require("Base.php");

class class_M_Parametros extends class_Base
{
  
  
  public function method_alta_modifica_vademecum($params, $error) {
  	$p = $params[0];
  	
  	$id_m_vademecum = $p->model->id_m_vademecum;
  	
	$sql = "SELECT id_m_vademecum FROM m_vademecum WHERE codigo_heredado LIKE '" . $p->model->codigo_heredado . "' AND id_m_vademecum<>" . $id_m_vademecum;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_m_vademecum, "codigo_duplicado");
		return $error;
	}
	
	$sql = "SELECT id_m_vademecum FROM m_vademecum WHERE descripcion LIKE '" . $p->model->descripcion . "' AND id_m_vademecum<>" . $id_m_vademecum;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_m_vademecum, "descrip_duplicado");
		return $error;
	}

		
	$set = $this->prepararCampos($p->model, "m_vademecum");
		
	if ($id_m_vademecum == "0") {
		$sql = "INSERT m_vademecum SET " . $set;
		$this->mysqli->query($sql);
		
		$id_m_vademecum = $this->mysqli->insert_id;
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	} else {
		$sql = "UPDATE m_vademecum SET " . $set . " WHERE id_m_vademecum=" . $id_m_vademecum;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	}
	
	return $id_m_vademecum;
  }
	
	
  public function method_alta_modifica_tipo_producto($params, $error) {
  	$p = $params[0];
  	
  	$id_m_tipo_producto = $p->model->id_m_tipo_producto;
  	
	$sql = "SELECT id_m_tipo_producto FROM m_tipo_producto WHERE descripcion LIKE '" . $p->model->descripcion . "' AND id_m_tipo_producto<>" . $id_m_tipo_producto;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_m_tipo_producto, "duplicado");
		return $error;
	} else {
		$set = $this->prepararCampos($p->model, "m_tipo_producto");
			
		if ($id_m_tipo_producto == "0") {
			$sql = "INSERT m_tipo_producto SET " . $set;
			$this->mysqli->query($sql);
			
			$id_m_tipo_producto = $this->mysqli->insert_id;
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		} else {
			$sql = "UPDATE m_tipo_producto SET " . $set . " WHERE id_m_tipo_producto=" . $id_m_tipo_producto;
			$this->mysqli->query($sql);
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		}
		
		return $id_m_tipo_producto;
	}
  }
  
  
  public function method_leer_tipo_producto($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM m_tipo_producto ORDER BY descripcion";

	return $this->toJson($sql);
  }

  
  
  public function method_autocompletarVademecum($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->precio = "float";
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT m_vademecum.*, id_m_vademecum AS model, descripcion AS label FROM m_vademecum WHERE codigo_heredado LIKE'%". $p->texto . "%'";
  	} else {
  		$sql = "SELECT m_vademecum.*, id_m_vademecum AS model, descripcion AS label FROM m_vademecum WHERE descripcion LIKE'%". $p->texto . "%'";
  		if (! is_null($p->phpParametros)) $sql.= " AND id_m_tipo_producto=" . $p->phpParametros->id_m_tipo_producto;  		
  	}
  	
  	$sql.= " ORDER BY label";


	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarTipoProducto($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_m_tipo_producto AS model, descripcion AS label FROM m_tipo_producto WHERE descripcion LIKE'%". $p->texto . "%' ORDER BY label";

	return $this->toJson($sql);
  }
 
  
  
  public function generateRandomString($length = 10) {
	return substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }
}

?>