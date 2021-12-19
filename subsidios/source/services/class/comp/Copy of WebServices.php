<?php

session_start();

set_time_limit(0);

class class_WebServices
{
	
	
  public function method_getPracticas($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
	
	//webService
	$url = 'http://app.iosep.gov.ar/WsHospitales/api/Practicas?DNI=' . $p->dni;

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
	$datos = json_decode($result);

	curl_close($curl);

	//$datos = simplexml_load_string($result);
	
	$resultado->datos = $datos;
	$resultado->texto = chr(13);
	
	if ($datos->error == true) {
		$resultado->texto.= $datos->mensaje;
	} else {
		$resultado->texto.= "Nombre afiliado: " . $datos->NombreAfiliado . chr(13);
		$resultado->texto.= "Af.numero: " . $datos->A_Numero . chr(13);
		
		if (! is_null($datos->Practicas) && count($datos->Practicas) > 0) {
			$resultado->texto.= chr(13);
			$resultado->texto.= "Practicas: (" . count($datos->Practicas) . ")" . chr(13);
			$resultado->texto.= "----------------------------------------------------------------------------------------------------------------------------" . chr(13);
		
			foreach ($datos->Practicas as $practica) {
				$resultado->texto.= "    " . "Tipo practica: " . $practica->TipoPractica . chr(13);
				$resultado->texto.= "    " . "Prescriptor: " . $practica->Prescriptor . chr(13);
				$resultado->texto.= "    " . "Numero: " . $practica->Numero . chr(13);
				$resultado->texto.= "    " . "Fecha emision: " . $practica->FechaEmision . chr(13);
				$resultado->texto.= "    " . "Observaciones: " . $practica->Observaciones . chr(13);
				
				if (! is_null($practica->PracticaDetalle) && count($practica->PracticaDetalle) > 0) {
					$resultado->texto.= "    " . "Detalle: (" . count($practica->PracticaDetalle) . ")" . chr(13);
					
					foreach ($practica->PracticaDetalle as $detalle) {
						$resultado->texto.= "    " . "    " . "Código: " . $detalle->Codigo . chr(13);
						$resultado->texto.= "    " . "    " . "Practica: " . $detalle->Practica . chr(13);
						$resultado->texto.= "    " . "    " . "Cantidad: " . $detalle->Cantidad . chr(13);
						$resultado->texto.= chr(13);
					}
				}
				
				$resultado->texto.= "----------------------------------------------------------------------------------------------------------------------------" . chr(13);
			}
		}
	}
	
	return $resultado;
  }
  
  
  public function method_getInternaciones($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
	
	//webService
	$url = 'http://app.iosep.gov.ar/WsHospitales/api/Internados?DNI=' . $p->dni;

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
	$datos = json_decode($result);

	curl_close($curl);

	//$datos = simplexml_load_string($result);
	
	$resultado->datos = $datos;
	$resultado->texto = chr(13);
	
	if ($datos->error == true) {
		$resultado->texto.= $datos->mensaje;
	} else {
		$resultado->texto.= "Nombre afiliado: " . $datos->NombreAfiliado . chr(13);
		$resultado->texto.= "Af.numero: " . $datos->A_Numero . chr(13);
		
		if (! is_null($datos->DetallesInternaciones) && count($datos->DetallesInternaciones) > 0) {
			$resultado->texto.= chr(13);
			$resultado->texto.= "Internaciones: (" . count($datos->DetallesInternaciones) . ")" . chr(13);
			$resultado->texto.= "======================================================================================" . chr(13);
		
			foreach ($datos->DetallesInternaciones as $internacion) {
				$resultado->texto.= "    " . "Clínica: " . $internacion->Clinica . chr(13);
				$resultado->texto.= "    " . "Estado internacion: " . $internacion->EstadoInternacion . chr(13);
				$resultado->texto.= "    " . "Fecha internacion: " . $internacion->FechaHoraInternacion . chr(13);
				$resultado->texto.= "    " . "Fecha alta: " . $internacion->FechaHoraAlta . chr(13);
				$resultado->texto.= "    " . "Tipo alta: " . $internacion->TipoAlta . chr(13);
				$resultado->texto.= "    " . "Diagnóstico: " . $internacion->Diagnostico . chr(13);
				
				if (! is_null($internacion->Practicas) && count($internacion->Practicas) > 0) {
					$resultado->texto.= chr(13);
					$resultado->texto.= "    " . "Practicas: (" . count($internacion->Practicas) . ")" . chr(13);
					$resultado->texto.= "    " . "------------------------------------------------------------" . chr(13);
				
					foreach ($internacion->Practicas as $practica) {
						$resultado->texto.= "    " . "    " . "Tipo practica: " . $practica->TipoPractica . chr(13);
						$resultado->texto.= "    " . "    " . "Prescriptor: " . $practica->Prescriptor . chr(13);
						$resultado->texto.= "    " . "    " . "Numero: " . $practica->Numero . chr(13);
						$resultado->texto.= "    " . "    " . "Fecha emision: " . $practica->FechaEmision . chr(13);
						$resultado->texto.= "    " . "    " . "Observaciones: " . $practica->Observaciones . chr(13);
						
						if (! is_null($practica->PracticaDetalle) && count($practica->PracticaDetalle) > 0) {
							$resultado->texto.= "    " . "    " . "Detalle: (" . count($practica->PracticaDetalle) . ")" . chr(13);
							
							foreach ($practica->PracticaDetalle as $detalle) {
								$resultado->texto.= "    " . "    " . "    " . "Código: " . $detalle->Codigo . chr(13);
								$resultado->texto.= "    " . "    " . "    " . "Practica: " . $detalle->Practica . chr(13);
								$resultado->texto.= "    " . "    " . "    " . "Cantidad: " . $detalle->Cantidad . chr(13);
								$resultado->texto.= chr(13);
							}
						}
						
						$resultado->texto.= "    " . "------------------------------------------------------------" . chr(13);
					}
				}
				
				$resultado->texto.= "======================================================================================" . chr(13);
			}
		}
	}
	
	return $resultado;
  }
  
  
  
  public function method_getPuco1($params, $error) {
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
			$resultado->texto.= "Cobertura social: " . $datos->coberturaSocial . chr(13);
			$resultado->texto.= "Denominación: " . $datos->denominacion . chr(13);
			$resultado->texto.= "Nro.doc.: " . $datos->nrodoc . chr(13);
			$resultado->texto.= "R.N.O.S.: " . $datos->rnos . chr(13);
			$resultado->texto.= "Tipo doc.: " . $datos->tipodoc . chr(13);
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

