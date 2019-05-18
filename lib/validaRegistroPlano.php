<?php
include './functions.php';
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(!empty($_POST['registro_plano'])){        
        $plano = getPlano($_POST['registro_plano']);        
        if(isset($plano)){
            echo json_encode([
                'success' => true,
                'data' => [
                    'nome' => $plano['nome'],
                    'codigo' => $plano['codigo']
                ]
            ]);
        }else{
            echo json_encode([
                'success' => false,
                'message' => 'Plano não encontrado!'
            ]);
        }        
    }else{
        echo json_encode([
            'success' => false,
            'message' => 'O registro do plano deve ser informado!'
        ]);
    }
}else{
    header("HTTP/1.0 405 Method Not Allowed"); 
    exit();
}