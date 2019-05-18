<?php
function getPlanosList(){
    return json_decode(file_get_contents('../files/planos.json'), true);
}

function getPlano($registro_plano){
    $planos = getPlanosList();
    foreach($planos as $key => $plano){
        if($plano['registro'] == $registro_plano){                
            return $plano;                           
        }
    }
    return null;
}

function getPrecosPlanoList(){
    return json_decode(file_get_contents('../files/precos.json'), true);
}

function getPrecoPlano($codigo_plano, $count_dependents){
    $precos = getPrecosPlanoList();
    $preco_plano = null;
    $minimo_vidas = null;
    foreach($precos as $key => $preco){
        if($preco['codigo'] == $codigo_plano
           && (!isset($minimo_vidas) || $preco['minimo_vidas'] > $minimo_vidas )
           && $count_dependents >= $preco['minimo_vidas'] 
        ){
            $preco_plano = $preco;
        }
    }
    return $preco_plano;
}

function validaDados($form_data){
    if(empty($form_data['dependents'])){
        return [
            'success' => false,
            'message' => 'É obrigatório informar os beneficiários!'
        ];        
    }

    if(empty($form_data['registro_plano'])){
        return [
            'success' => false,
            'message' => 'É obrigatório informar o registro do plano!'
        ];          
    }

    $plano = getPlano($form_data['registro_plano']);
    
    if(!isset($plano)){            
        return [
            'success' => false,
            'message' => 'Plano não encontrado!'
        ];        
    }

    return [
        'success' => true
    ];
}