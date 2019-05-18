<?php
include './functions.php';
if($_SERVER['REQUEST_METHOD'] == 'POST'){   
    $validation = validaDados($_POST);
    if(!$validation['success']){
        echo json_encode($validation);
        exit();
    }

    $plano = getPlano($_POST['registro_plano']);
    $count_dependents = count($_POST['dependents']['name']);
    $preco_plano = getPrecoPlano($plano['codigo'], $count_dependents);

    if(!isset($preco_plano)){
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao encontrar o preço do plano!'
        ]);
        exit();
    }

    $data = [];
    $total = 0;
    foreach($_POST['dependents']['age'] as $key => $age){
        if($age >= 0 && $age <= 17){
            $price = $preco_plano['faixa1'];            
        }else
            if($age >= 18 && $age <= 40){
                $price = $preco_plano['faixa2'];
            }else{
                $price = $preco_plano['faixa3'];
            }

        $data['price_dependents'][$key] = $price;
        $total = $total + $price;
    }

    $data['total'] = $total;

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);

}else{
    header("HTTP/1.0 405 Method Not Allowed"); 
    exit();
}