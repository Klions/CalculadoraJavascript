<?php
$GLOBALS['build'] = "20221005";
$GLOBALS['download'] = "cb.exe";
$GLOBALS['mensagem'] = "";

function VerificarScript(){
    $download = $GLOBALS['download'];
    $build = $GLOBALS['build'];
    $mensagem = $GLOBALS['mensagem'];
    return json_encode(array("download" => $download,"build" => $build, "mensagem" => $mensagem));
}
echo VerificarScript();
?>