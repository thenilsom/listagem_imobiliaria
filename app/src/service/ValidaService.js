angular.module('app')
.factory('validaService', ['serviceUtil', function(util){

		var service = {};

		service.validarCamposObrigatorios = function(formName, errors){
			$("form[name = '"+formName+"'] [requerido]").each(function(){
				if($(this).val() == undefined || $(this).val().trim().length == 0 || $(this).val().startsWith('?')){
					var label = $("label[for='"+$(this).attr('id')+"']").text().replace('*', '');
					var descErro = label + " obrigatório.";
					
					if(!errors.includes(descErro))
						errors.push(descErro);
				}
			});
		}

	service.validarCpf = function(cpf){
		 // Remove caracteres inválidos do valor
	    cpf = !util.isNull(cpf) ? cpf.replace(/[^0-9]/g, '') : '';
	    
		if(util.isNullOrEmpty(cpf)) return true;
		// Garante que o valor é uma string
	    cpf = cpf.toString();
	    
	    var numeros, digitos, soma, i, resultado, digitos_iguais;
	    digitos_iguais = 1;
	    if (cpf.length < 11)
	          return false;
	    for (i = 0; i < cpf.length - 1; i++)
	          if (cpf.charAt(i) != cpf.charAt(i + 1))
	                {
	                digitos_iguais = 0;
	                break;
	                }
	    if (!digitos_iguais)
	          {
	          numeros = cpf.substring(0,9);
	          digitos = cpf.substring(9);
	          soma = 0;
	          for (i = 10; i > 1; i--)
	                soma += numeros.charAt(10 - i) * i;
	          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	          if (resultado != digitos.charAt(0))
	                return false;
	          numeros = cpf.substring(0,10);
	          soma = 0;
	          for (i = 11; i > 1; i--)
	                soma += numeros.charAt(11 - i) * i;
	          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	          if (resultado != digitos.charAt(1))
	                return false;
	          return true;
	          }
	    else
	        return false;
  }

  service.validarCNPJ = function(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}
	
	
	service.validarEmail = function(email){
		 var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	   
		if(email === undefined || email.trim().length === 0) {
				return true;
		} else {
			if(!emailRegex.test(email)){
				return false;
			}
			return true;
		}		
	}

	//validação de caracteres especiais
	service.validarCaracteresEspeciais = function(texto){
		var regex = '[^a-z A-Z]+';
  		if(texto.match(regex)) {
       //encontrou então não passa na validação
		return false;
 		 }
  		else {
       //não encontrou caracteres especiais
		return true;
		  }
		}

		
	return service;
}]);
