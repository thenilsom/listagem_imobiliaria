<?php
require_once 'Database.php';
const USERS_TABLE = "fianca";
class Fianca {
    private $pdo;

    function __construct() 
    {
        $dbInstance = Database::getInstance();
        $this->pdo = $dbInstance->getConnection(); 
    }

    public function getFianca()
    {   $session = Session::getInstance();
        $sql = "SELECT *, (SELECT fantasia FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as fantasia, 
            (SELECT razao FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as razao, 
            (SELECT razao FROM corretores WHERE corretores.codigo=fianca.corretor) as corretora,
            (SELECT nome FROM usuarios WHERE usuarios.codigo=fianca.usuario_analise) as usuario_atendente
            from fianca where CGC_imob='$session->cnpj_imob' order by data_transm desc, hora_transm desc";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }
}