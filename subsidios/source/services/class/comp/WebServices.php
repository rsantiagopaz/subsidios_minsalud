<?php

session_start();

set_time_limit(0);

class class_WebServices
{
	private $ne = [
		'IdAutorizacion',	
		'IdInternado',
		'idtramiteprincipal',
		'idtramitetarjetareimpresa',
		'idciudadano',
		'codigoError',
	];
	
	private $t = [
		'NombreAfiliado' => 'Nombre afiliado',	
		'A_Numero' => 'Af.numero',
		
		'Practicas' => 'Practicas',
		'TipoPractica' => 'Tipo practica',
		'Prescriptor' => 'Prescriptor',
		'Numero' => 'Numero',
		'FechaEmision' => 'Fecha emision',
		'Observaciones' => 'Observaciones',
		'PracticaDetalle' => 'Detalle',
		'Codigo' => 'Codigo',
		'Practica' => 'Practica',
		'Cantidad' => 'Cantidad',
		
		'DetallesInternaciones' => 'Internaciones',
		'Clinica' => 'Clinica',
		'EstadoInternacion' => 'Estado internacion',
		'FechaHoraInternacion' => 'Fecha internacion',
		'FechaHoraAlta' => 'Fecha alta',
		'TipoAlta' => 'Tipo alta',
		'Diagnostico' => 'Diagnostico',
		
		'apellido' => 'Apellido',
		'nombres' => 'Nombres',
		'fechaNacimiento' => 'Fecha nacimiento',
		'cuil' => 'CUIL',
		'calle' => 'Calle',
		'numero' => 'Numero',
		'piso' => 'Piso',
		'departamento' => 'Departamento',
		'cpostal' => 'Cod.postal',
		'barrio' => 'Barrio',
		'monoblock' => 'Monoblock',
		'ciudad' => 'Ciudad',
		'municipio' => 'Municipio',
		'provincia' => 'Provincia',
		'pais' => 'Pais',
		
		'ejemplar' => 'Ejemplar',
		'vencimiento' => 'Vencimiento',
		'fechaConsulta' => 'Fecha consulta',
		'descripcionError' => 'Descripcion consulta',
		'numeroDocumento' => 'Numero documento',
		'sexo' => 'Sexo',
		'mensaf' => 'Mensaje fallecimiento',
		'origenf' => 'Origen fallecimiento',
		'fechaf' => 'Fecha fallecimiento',
		
		'data' => 'Coberturas',
		'rnos' => 'Codigo RNOS',
		'cobertura' => 'Cobertura',
		'servicio' => 'Servicio',
	];
	
	
  public function method_getPracticas($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
	
	//webService
	$url = 'https://app.iosep.gob.ar/WsHospitales/api/Practicas?DNI=' . $p->dni;

	$curl = curl_init();
	/*******************************************OPCIONES*************************/
	//curl_setopt($curl, CURLOPT_POST, 1);
	//curl_setopt($curl, CURLOPT_POSTFIELDS, $data); //si requiere autenticación
	curl_setopt($curl, CURLOPT_URL, $url);
	/*
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
	  'APIKEY: 666',
	  'Content-Type: application/json',
	));
	*/
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

	/*******************************************EJECUCION************************/
	$result = curl_exec($curl);
	if (curl_errno($curl)) {
		$resultado->texto = curl_error($curl);
		return $resultado;
	}
	$datos = json_decode($result);

	curl_close($curl);

	//$datos = simplexml_load_string($result);
	
	$resultado->datos = $datos;
	if ($datos->error == true) {
		$resultado->texto.= chr(13) . $datos->mensaje;
	} else {
		$render = implode(chr(13), $this->render($datos, 0));
		$resultado->texto = chr(13) . $render;		
	}
	
	return $resultado;
  }
  
  private function render($datos, $level) {
  	$texto = [];
  	foreach ($datos as $key => $value) {
  		if (!in_array($key, $this->ne) && !is_null($value)) {
  			$t = ($this->t[$key] ? $this->t[$key] : $key) . ': ';
			if (is_array($value)) {
	  			$texto[] = str_repeat(' ', $level * 7) . $t . '(' . count($value) . ')';
	  			foreach ($value as $item) {
	  				$render = $this->render($item, $level + 1);
	  				$texto = array_merge($texto, $render);
	  				$texto[] = '';
	  			}
	  		} else {
	  			$texto[] = str_repeat(' ', $level * 7) . htmlentities($t) . htmlentities($value);
	  		}
  		}
  	}
  	return $texto; 
  }
  
  
  public function method_getInternaciones($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
	
	//webService
	$url = 'https://app.iosep.gob.ar/WsHospitales/api/Internados?DNI=' . $p->dni;

	$curl = curl_init();
	/*******************************************OPCIONES*************************/
	//curl_setopt($curl, CURLOPT_POST, 1);
	//curl_setopt($curl, CURLOPT_POSTFIELDS, $data); //si requiere autenticación
	curl_setopt($curl, CURLOPT_URL, $url);
	/*
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
	  'APIKEY: 666',
	  'Content-Type: application/json',
	));
	*/
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

	/*******************************************EJECUCION************************/
	$result = curl_exec($curl);
	if (curl_errno($curl)) {
		$resultado->texto = curl_error($curl);
		return $resultado;
	}
	$datos = json_decode($result);

	curl_close($curl);

	//$datos = simplexml_load_string($result);
	
	$resultado->datos = $datos;
	if ($datos->error == true) {
		$resultado->texto.= chr(13) . $datos->mensaje;
	} else {
		$render = implode(chr(13), $this->render($datos, 0));
		$resultado->texto = chr(13) . $render;		
	}
	
	return $resultado;
  }
  
  public function method_getPuco1($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
	
	//webService
	$url = 'http://mpi.msalsgo.gob.ar/renaper.php?token=y8M$0lLk1Dv6*qFzO@J7bGs4RmP2nThXwE9VcU3oNt!eA%BxW5rS&dni=' . $p->dni . '&sexo=' . $p->sexo;
	
	//$url = 'https://mpi.msalsgo.gob.ar/coberturas.php?token=y8M$0lLk1Dv6*qFzO@J7bGs4RmP2nThXwE9VcU3oNt!eA%BxW5rS&dni='.$p->dni.'&sexo=' . $p->sexo;

	$curl = curl_init();
	/*******************************************OPCIONES*************************/
	//curl_setopt($curl, CURLOPT_POST, 1);
	//curl_setopt($curl, CURLOPT_POSTFIELDS, $data); //si requiere autenticación
	curl_setopt($curl, CURLOPT_URL, $url);
	/*
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
	  'APIKEY: 666',
	  'Content-Type: application/json',
	));
	*/
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

	/*******************************************EJECUCION************************/
	$result = curl_exec($curl);
	if (curl_errno($curl)) {
		$resultado->texto = curl_error($curl);
		return $resultado;
	}
	$datos = json_decode($result);
	
	if ($datos->successful && $datos->statusCode == 200) {
		$resultado->texto = json_encode($datos);
		$resultado->datos = $datos->data[0];
		
		$url = 'http://mpi.msalsgo.gob.ar/coberturas.php?token=y8M$0lLk1Dv6*qFzO@J7bGs4RmP2nThXwE9VcU3oNt!eA%BxW5rS&dni='.$p->dni.'&sexo=' . $p->sexo;
		curl_setopt($curl, CURLOPT_URL, $url);
		
		$result = curl_exec($curl);
		$datos = json_decode($result);
		if ($datos->successful && $datos->statusCode == 200) {
			$resultado->datos->data = $datos->data;
			
			$render = implode(chr(13), $this->render($resultado->datos, 0));
			$resultado->texto = chr(13) . $render;
		} else {
			$resultado->texto = chr(13) . implode(chr(13), $datos->data);
		}
	} else {
		$resultado->texto = chr(13) . ($datos->message ? $datos->message : json_encode($datos));
	}
	
	return $resultado;
  }
  
  
  
  public function method_getPuco1original($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	//SETEAR:
	//====================================================
	$usuario = "jmgranda"; $clave = "muyes3a2";
		
	/*********************************************************************************
		version 1.1
		
		DEVUELVE:
		====================================================
		$datos (objeto)
	
		Errores:
		$datos->resultado		errorDNI (Falta pasar DNI)
		$datos->resultado		errorSISA (Falla la conexion con SISA)
		$datos->resultado		errorOS (El DNI no posee cobertura social)
	
		Acierto:
		$datos->resultado		OK
	
		$datos->tipodoc			Tipo de documento del ciudadano, por ej: DNI
		$datos->nrodoc			Número de documento del ciudadano
		$datos->coberturaSocial	Nombre de la cobertura
		$datos->denominacion	Nombre del asegurado
		$datos->rnos			Código del Registro Nacional de Obras Sociales
	
	
		MODO DE USO
		====================================================
		- se debe pasar DNI
		
		$datos = puco($_REQUEST[dni]);
	
		if($datos->resultado == "OK"){
			echo $datos->coberturaSocial;
		}
		
	*********************************************************************************/
	
	
		//webService
		$url = 'https://sisa.msal.gov.ar/sisa/services/rest/puco/' . $p->dni;
	
		//autenticacion
		$data_array =  array(
			  "usuario"      => $usuario,
			  "clave"        => $clave
		);
		$data = json_encode($data_array);
	
	
		$curl = curl_init();
		/*******************************************OPCIONES*************************/
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false); //desactivando control de certificado
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data); //si requiere autenticación
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		  'APIKEY: 666',
		  'Content-Type: application/json',
		));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	
		/*******************************************EJECUCION************************/
		$result = curl_exec($curl);
		$curl_error = curl_error($curl);
		
		curl_close($curl);
		
		if(! $result){
			if(! $p->dni){
				$error->SetError(0, "Debe ingresar DNI");
				return $error;
			}
			else{
				$error->SetError(0, $curl_error);
				return $error;
			}
	
		}
		
		
		
		$datos = simplexml_load_string($result);
		
		$resultado->datos = $datos;
		$resultado->texto = chr(13);
		
		if ($datos === false) {
			$error->SetError(0, $curl_error);
			return $error;
		} else if ($datos->resultado == "OK") {
			$resultado->texto.= "Cobertura social: " . $datos->puco->coberturaSocial . chr(13);
			$resultado->texto.= "Denominación: " . $datos->puco->denominacion . chr(13);
			$resultado->texto.= "Nro.doc.: " . $datos->puco->nrodoc . chr(13);
			//$resultado->texto.= "R.N.O.S.: " . $datos->puco->rnos . chr(13);
			$resultado->texto.= "Tipo doc.: " . $datos->puco->tipodoc . chr(13);
		} else {
			$resultado->texto.= $datos->resultado;
		}
		
		return $resultado;
  }
	
	
  public function method_getPuco2($params, $error) {
  	$p = $params[0];
  	
  	require("Conexion.php");
  	
	$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
	$mysqli->query("SET NAMES 'utf8'");
  	
  	$bandera = 0;
  	$puco = null;
  	
  	$sql = "SELECT * FROM _personas_puco WHERE persona_id=" . $p->persona_id;
	$rs = $mysqli->query($sql);
	if ($rs->num_rows == 0) {
		$bandera = 1;
	} else {
		$puco = $rs->fetch_object();
		
		$fecha = new DateTime($puco->fecha);
		$fecha = $fecha->add(new DateInterval("P6M"));
		$fecha = $fecha->format("Y-m-d");
		
		$hoy = date("Y-m-d");
		
		if ($fecha < $hoy) $bandera = 2;
	}
	
	if ($bandera > 0) {
		$aux = $this->puco($p->persona_dni);
		
		if ($aux->resultado == "OK") {
			$puco = $aux;
			
			if ($bandera == 1) {
	  			$sql = "INSERT _personas_puco SET persona_id=" . $p->persona_id . ", fecha=NOW(), tipodoc='" . $puco->tipodoc . "', nrodoc='" . $puco->nrodoc . "', coberturaSocial='" . $puco->coberturaSocial . "', denominacion='" . $puco->denominacion . "', rnos='" . $puco->rnos . "'";
				$mysqli->query($sql);
			} else {
	  			$sql = "UPDATE _personas_puco SET fecha=NOW(), tipodoc='" . $puco->tipodoc . "', nrodoc='" . $puco->nrodoc . "', coberturaSocial='" . $puco->coberturaSocial . "', denominacion='" . $puco->denominacion . "', rnos='" . $puco->rnos . "' WHERE persona_id=" . $p->persona_id;
				$mysqli->query($sql);
			}
		}
	}
	
	return $puco;
  }
}



//$datos = puco();
//print_r($datos);
?>
