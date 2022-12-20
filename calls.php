
<?php
header('Access-Control-Allow-Origin: *');

$GLOBALS['servername'] = "produtos_sys.mysql.dbaas.com.br";
$GLOBALS['username'] = "produtos_sys"; // root
$GLOBALS['password'] = "P9Bu4whM8oEt";
$GLOBALS['dbname'] = "produtos_sys";

function VerificarScript(){
    $retorno = "[]";
    // Create connection
    $conn = new mysqli($GLOBALS['servername'], $GLOBALS['username'], $GLOBALS['password'], $GLOBALS['dbname']);
    $conn->set_charset("utf8");
    // Check connection
    if ($conn->connect_error) {
        die("Conexão falhou: " . $conn->connect_error);
    }
    
    $result = $conn->query("SELECT dados FROM pmesp_exportar WHERE id = 2");
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $retorno = $row["dados"];
        }
    }
    $conn->close();
    return $retorno;
}
echo VerificarScript();
?>