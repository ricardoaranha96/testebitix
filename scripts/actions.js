function number_format(number){
    let formated_number =  number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');    
    let pos = formated_number.lastIndexOf('.');
    formated_number = formated_number.substring(0,pos) + ',' + formated_number.substring(pos+1)
    return formated_number;
}

$(document).ready(function(){
    var limpa_plano = function(){
        $('#registro-plano').val(null);
        $('#codigo-plano').val(null);
        $('#nome-plano').val(null);        
    }

    var limpa_precos = function(){
        $('[data-toggle="dependent-price-total"]').html('R$ ' + number_format(0));        
        $('#table-dependents').find('tbody').find('tr').find('[data-toggle="dependent-price"]').html(null);
        $('#form-plano').attr('data-price-loaded','n');
    }

    $('#registro-plano').on('change', function(){
        let registro_plano = $(this).val();
        $.ajax({
            url: 'lib/validaRegistroPlano', 
            type: 'POST',
            data: {'registro_plano':registro_plano}, 
            dataType: 'json'           
        })
        .done(function(result){
            if(result){                        
                if(result.success){
                    $('#form-plano').attr('data-plano-valido','y');                        
                    $('#codigo-plano').val(result.data.codigo);
                    $('#nome-plano').val(result.data.nome);
                }else{
                    alert(result.message);
                    console.warn(result.message);
                    $('#form-plano').attr('data-plano-valido','n');
                    limpa_plano();                        
                }
            }else{
                alert('Erro ao buscar plantão!');
                console.error(result);
                $('#form-plano').attr('data-plano-valido','n');
                limpa_plano();                    
            }
        })
        .fail(function(result){
            alert('Erro ao buscar plantão!');
            console.error(result);
            $('#form-plano').attr('data-plano-valido','n');
            limpa_plano(); 
        })
        .always(function(result){
            limpa_precos();
        });        
    });

    var refresh_count_dependents = function(count){
        let count_dependents = count;
        if(!count){
            $('#table-dependents').find('input').val(null);
            count_dependents = 1;
        }        
        $('#form-plano').attr('data-count-dependents', count_dependents);        
    }

    $('#add-dependents').on('click',function(){
        let count_dependents = parseInt($('#form-plano').attr('data-count-dependents')) + 1;            
        let new_dependent = $('#table-dependents').find('tbody').find('tr').first().clone();
        $(new_dependent).find('input').val(null);
        $(new_dependent).find('th').html(count_dependents);
        $(new_dependent).appendTo($('#table-dependents').find('tbody'));
        refresh_count_dependents(count_dependents);
        limpa_precos();        
    });

    var refresh_dependent_count_row = function(){
        let i = 1;
        $('#table-dependents').find('tbody').find('tr').each(function(){
            $(this).find('th').html(i);
            i++;
        });
    }

    $('#clear-dependents').on('click', function(){
        $('#table-dependents').find('tbody').find('tr').not(':first').remove();        
        refresh_count_dependents(0);
        refresh_dependent_count_row();
        limpa_precos();
    });

    $('#table-dependents').on('click', '[data-toggle="remove-dependent"]', function(){        
        if(parseInt($('#form-plano').attr('data-count-dependents')) > 1){
            $(this).closest('tr').remove();            
        }

        let count_dependents = parseInt($('#form-plano').attr('data-count-dependents')) - 1;
        refresh_count_dependents(count_dependents);
        refresh_dependent_count_row();
        limpa_precos();
    });

    $('#table-dependents').on('change', '[data-toggle="dependent-age"]', function(){ 
        limpa_precos();
    });
    

    $('#load-price').on('click', function(){
        if($('#form-plano').attr('data-plano-valido') != 'y'){
            alert('É necessário inserir um registro de plano válido!');
            console.warn('É necessário inserir um registro de plano válido!');
            return false;
        }

        if(!$('#form-plano')[0].checkValidity()){
            alert('É necessário preencher todas as informações!');
            console.warn('É necessário preencher todas as informações!');
            return false;
        }
        
        $.ajax({
            type: "POST",
            url: "lib/getPrecoPlano",
            data: $("#form-plano").serialize(),                
            dataType: "json"
        })
        .done(function(result){
            if(result){                        
                if(result.success){
                    $('[data-toggle="dependent-price-total"]').html('R$ ' + number_format(result.data.total));
                    let i = 0;
                    $('#table-dependents').find('tbody').find('tr').each(function(){
                        $(this).find('[data-toggle="dependent-price"]').html('R$ ' + number_format(result.data.price_dependents[i]));
                        i++;
                    });
                    $('#form-plano').attr('data-price-loaded','y');
                }else{
                    alert(result.message);
                    console.warn(result.message);
                    limpa_precos();
                }
            }else{
                alert('Erro ao carregar o preço do plano!');
                console.error(result);
                limpa_precos();
            }
        })
        .fail(function(result){
            alert('Erro ao carregar o preço do plano!');
            console.error(result);
            limpa_precos();
        });      
    });

    $('#form-plano').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "lib/getPrecoPlano",
            data: $("#form-plano").serialize(),                
            dataType: "json",
            success: function(result){
                if(result){                        
                    if(result.success){
                        alert('O dados foram enviados com sucesso!');
                        location.reload();
                    }else{
                        alert(result.message);
                        console.warn(result.message);                        
                    }
                }else{
                    alert('Erro ao enviar os dados!');
                    console.error(result);                    
                }
            },
            error: function(result){
                alert('Erro ao enviar os dados!');
                console.error(result);                
            }
        });
    });    
});