<?php 	 header("Access-Control-Allow-Origin: *");
	 header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
	 header("Access-Control-Allow-Headers: Content-Type, Authorization");

    require_once '../../Classes/Fianca.php';
    
    $fianca = new Fianca();
    $fiancaData = $fianca->getVariaveisSessao();
    echo json_encode($fiancaData);