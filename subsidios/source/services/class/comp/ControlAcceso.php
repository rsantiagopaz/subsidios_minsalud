<?php

class class_ControlAcceso
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		//session_unset();
		//session_destroy();
		session_start();
		
		$_SESSION["subsidios_LAST_ACTIVITY"] = (int) $_SERVER["REQUEST_TIME"];
		$_SESSION["cookie_lifetime"] = (int) ini_get("session.cookie_lifetime");
		$_SESSION["gc_maxlifetime"] = (int) ini_get("session.gc_maxlifetime");

		
		
		$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
		$this->mysqli->query("SET NAMES 'utf8'");
	}
	
	
  public function method_leer_version($params, $error) {
  	
  	$aux = new stdClass;
  	$aux->id_version = 2;
	
	return $aux;
  }


  public function method_login($params, $error) {
  	$p = $params[0];

	/*  	
	$resultado = new stdClass;

	$resultado->ok = "¡¡Bienvenido ".$_SESSION['usuario_nombre']." (".$SYSusuario.")!!\n\n";
	$resultado->ok.="Puede comenzar a trabajar. Recuerde CERRAR SESION cuando termine o si desea cambiar de usuario.\n\n";
	$resultado->ok.="¡NUNCA DEJE EL NAVEGADOR ABIERTO Y SE RETIRE!";
	$resultado->_sistema_id = $SYSsistema_id;
	$resultado->_usuario = $_SESSION['usuario'];
	$resultado->_usuario_id = $_SESSION['usuario_id'];
	$resultado->_usuario_nombre = $_SESSION['usuario_nombre'];
	$resultado->_usuario_estado = $_SESSION['usuario_estado'];
	$resultado->_sesion_id = $_SESSION['SYSsesion_id'];
	$resultado->_autorizado = true;
	$resultado->_usuario_organismo_id = $_SESSION['usuario_organismo_id'];
	$resultado->_usuario_nivel_id = $_SESSION['usuario_nivel_id'];
	$resultado->_usuario_organismo = $_SESSION['usuario_organismo'];
	$resultado->_usuario_organismo_area_id = $_SESSION['usuario_organismo_area_id'];
	$resultado->_usuario_organismo_area = $_SESSION['usuario_organismo_area'];
	$resultado->_usuario_sistemas_perfiles = $_SESSION['sistemas_perfiles_usuario'];
	$resultado->_usuario_organismo_area_mesa_entradas = ((empty($_SESSION['usuario_organismo_area_mesa_entrada'])) ? "0" : $_SESSION['usuario_organismo_area_mesa_entrada']);

	return $resultado;
	*/

	
	$_SESSION['login'] = $p->model;
  }
  
  
  public function method_traer_areas($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT";
	$sql.= "  sistemas_perfiles_usuarios_oas.id_sist_perfil_usuario_oas AS model";
	$sql.= ", CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label";
	$sql.= ", organismo_area_id";
	$sql.= ", oas_usuarios.id_oas_usuario";
	$sql.= ", _usuarios.SYSusuario";
	$sql.= " FROM";
	$sql.= "  sistemas_perfiles_usuarios_oas
        INNER JOIN _sistemas_perfiles ON sistemas_perfiles_usuarios_oas.perfil_id = _sistemas_perfiles.perfil_id AND _sistemas_perfiles.perfil_id = '" . "ssm001" . "'
        INNER JOIN _sistemas_usuarios ON sistemas_perfiles_usuarios_oas.id_sistema_usuario = _sistemas_usuarios.id_sistema_usuario
        INNER JOIN oas_usuarios ON sistemas_perfiles_usuarios_oas.id_oas_usuario = oas_usuarios.id_oas_usuario
        INNER JOIN _usuarios ON _sistemas_usuarios.SYSusuario = _usuarios.SYSusuario AND oas_usuarios.SYSusuario = _usuarios.SYSusuario AND _usuarios.SYSusuario = '" . $p->usuario . "' AND _usuarios.SYSpassword = '" . md5($p->password) . "'
        INNER JOIN _organismos_areas_servicios ON oas_usuarios.id_organismo_area_servicio = _organismos_areas_servicios.id_organismo_area_servicio
        INNER JOIN _organismos_areas ON _organismos_areas_servicios.id_organismo_area = _organismos_areas.organismo_area_id
        INNER JOIN _servicios ON _organismos_areas_servicios.id_servicio = _servicios.id_servicio";
	
	$sql.= " ORDER BY label";
	
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$perfiles = new stdClass;
		
		//$sql = "SELECT perfil_id FROM sistemas_perfiles_usuarios_oas INNER JOIN _sistemas_usuarios USING(id_sistema_usuario) WHERE _sistemas_usuarios.SYSusuario='" . $row->SYSusuario . "' AND _sistemas_usuarios.sistema_id='ssm'";
		
		$sql = "SELECT";
		$sql.= "  perfil_id";
		$sql.= " FROM sistemas_perfiles_usuarios_oas INNER JOIN _sistemas_usuarios USING(id_sistema_usuario)";
		$sql.= " WHERE _sistemas_usuarios.SYSusuario='" . $row->SYSusuario . "' AND _sistemas_usuarios.sistema_id='ssm'";
		$rsPerfil = $this->mysqli->query($sql);
		while ($rowPerfil = $rsPerfil->fetch_object()) {
			$perfiles->{$rowPerfil->perfil_id} = true;
		}
		
		$row->perfiles = $perfiles;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
}

?>