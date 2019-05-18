<?php
include './functions.php';
if($_SERVER['REQUEST_METHOD'] == 'POST'){    
    echo json_encode(validaDados($_POST));
    exit();    
}else{
    header("HTTP/1.0 405 Method Not Allowed"); 
    exit();
}