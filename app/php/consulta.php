<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
 
require_once("php7_mysql_shim.php");

require '../../vendor/autoload.php';
$app = new \Slim\App;

$app->get('/hello', function(){
	return 'Hello World!';
});

$app->get('/dataServidor', function(){
	$result = array( 'data' => date("Y-m-d"), 'hora' => date("H:i:s")); 
	echo json_encode($result);
});

$app->post('/listar', 'listar');


function listar($request, $response){
	$param = json_decode($request->getBody());
	$cnpjImob = trim(json_encode($param->cnpjImob, JSON_UNESCAPED_UNICODE), '"');
	
	$conexao = mysql_connect("mysql.segurosja.com.br", "segurosja", "m1181s2081_") or die ("problema na conexão");
	mysql_set_charset('utf8',$conexao);

	$rows = array();

	$sq = "SELECT *, (SELECT fantasia FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as fantasia, 
			(SELECT razao FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as razao, 
			(SELECT razao FROM corretores WHERE corretores.codigo=fianca.corretor) as corretora,
			(SELECT nome FROM usuarios WHERE usuarios.codigo=fianca.usuario_analise) as usuario_atendente
			from fianca where CGC_imob='$cnpjImob' order by data_transm desc, hora_transm desc";
	
	$consulta = mysql_db_query("segurosja", $sql) or die (mysql_error());

	while($campo = mysql_fetch_assoc($consulta)){
      $rows[] = $campo;
    }

	echo json_encode($rows);
}


$app->run();

?>
