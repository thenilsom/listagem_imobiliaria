var diretiva = angular.module('diretiva', []);

/** Configuração do módulo de diretivas da aplicação. */
diretiva.config([ '$httpProvider', function($httpProvider) {

	/**
	 * Implementação de 'interceptor' para obter a quantidades total de
	 * requisições ocorridas nas iterações ocorridas na aplicação.
	 * 
	 * 
	 * Importante - O loader da aplicação não está usando a implementação de
	 * modal do bootstrap para evitar o bug de escroll, mas o estilo está sendo
	 * adotado e invocado com o Jquery.
	 */
	$httpProvider.interceptors.push(function($q, $rootScope) {
		var count = 0;

		return {
			request : function(config) {
				if (count <= 0) {
					$('.loader').show();
				}
				++count;
				return config;
			},
			requestError : function(request) {
				if (!(--count)) {
					$('.loader').hide();
				}
				return $q.reject(request);
			},
			response : function(response) {
				if ((--count) === 0) {
					$('.loader').hide();
				}
				return response;
			},
			responseError : function(response) {
				if (!(--count)) {
					$('.loader').hide();
				}
				return $q.reject(response);
			}
		};
	});

} ]);

/**
 * Realiza o carregamento dos templates das directivas.
 */
diretiva
		.run([
				'$templateCache',
				function($templateCache) {

					/** Template referente Modal Loader. */
					$templateCache
							.put(
									'modalLoader.html',
									'<div class="loader modal" tabindex="-1">'
											+ '<div class="modal-backdrop  in" style="min-height: 100%;"></div>'
											+ '<div class="modal-dialog"> <div class="modal-content">'
											+ '<div class="modal-header" style="text-align: center"><h5 class="modal-title">Aguarde...</h5></div>'
											+ '<div class="modal-body" ><div class="row row-mg-1 row-center text-center" ><img src="./assets/img/ajax-loader.gif"></div>'
											+ '</div></div></div></div>');

					$('body').append($templateCache.get('modalLoader.html'));
				} ]);

/*Converte para maiusculo*/
diretiva.directive('upper', function($parse) {

	function link(scope, element, attrs, ngModelCtrl) {
			$(element).on('blur', function(){
				ngModelCtrl.$modelValue = $(element).val().toUpperCase();
				$parse(attrs.ngModel).assign(scope,ngModelCtrl.$modelValue);
				ngModelCtrl.$commitViewValue();
				ngModelCtrl.$render();
			})
		}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Exibi um asterisco vermelho na label do input*/
diretiva.directive('requerido', function($parse) {

	function link(scope, element, attrs, ngModelCtrl) {
		var label = $("label[for='"+element.attr('id')+"']");
		$(label).prepend('<span style="color:red">*</span>');

		/*ao ganhar o foco remove a classe errorAtribute*/
		$(element).on('focus', function(){
			$(element).removeClass('errorAttribute');
		})

		/*ao perder o foco se o valor for vazio adiciona a classe errorAtribute*/
		$(element).on('blur', function(){
			if(!$(element).val())
				$(element).addClass('errorAttribute');
		});
		
	}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Diretiva mascara
Se o acesso for via mobile a diretiva não é ativada
*/
diretiva.directive('mascara', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).mask(attrs.mascara, {placeholder: ""});
			$(el).attr('type', 'text');
      		el.on('keyup', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val());
			});
      	});

	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Diretiva mascara para telefone
Se o acesso for via mobile a diretiva não é ativada
*/
diretiva.directive('mascaraTelefone', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).attr('type', 'text');
			$(el).mask("(99) 9999-9999?9").change(function (event) {  
	            var target, phone, element;  
	            target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
	            phone = target.value.replace(/\D/g, '');
	            element = $(target);  
	            element.unmask();  
	            if(phone.length > 10) {  
	                element.mask("(99) 99999-999?9");  
	            } else {  
	                element.mask("(99) 9999-9999?9");  
	            }  
	        });

	        el.on('focusout', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val().replace(/[^0-9]/g, '').length >= 10 ? el.val() : undefined);
			});
      	});
	        
	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Mascara Monetária*/
diretiva.directive('mascaraMonetaria', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).maskMoney({
				 prefix: "",
         		 decimal: ",",
         		 thousands: "."
			});
			$(el).attr('type', 'text');
      		el.on('keyup', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val());
			});
      	});

	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/**
 * Implementação de 'mascaras', para formatar os Campos como Numerico
 * 
 * Adicione data-mascara-numero ao imput, 
 * 
 * PAra aceitar "0" a Esquerda use data-mascara-numero="0".
 */
diretiva.directive('mascaraNumero', function($parse) {

	var NUMBER_REGEXP = /^([\d\-\ \.\ \/]+)$/;

	function link(scope, el, attrs, ngModelCtrl) {
		var lastValidViewValue;
		var zeroEsquerda = $parse(attrs.mascaraNumero)(scope) == '0' ? true	: false;

		
		function atualizaValor() {
			var modelValue = String(ngModelCtrl.$modelValue);

			if (!zeroEsquerda) {
				modelValue = String(parseFloat(modelValue));
				if(modelValue === '0'){
					modelValue = '';
				}
			}
			if(isNaN(modelValue)){
				modelValue = '';
			}
			changeViewValue(modelValue);

			// Save the rounded view value
			lastValidViewValue = ngModelCtrl.$viewValue;
		
			return modelValue;
		}

		function changeViewValue(value) {

			ngModelCtrl.$viewValue = value;
			ngModelCtrl.$commitViewValue();
			ngModelCtrl.$render();
		}

		ngModelCtrl.$parsers.push(function(value) {
			if (ngModelCtrl.$isEmpty(value)) {
				lastValidViewValue = value;
				return null;
			}
			
			value = String(value);

			if (NUMBER_REGEXP.test(value)) {
				lastValidViewValue = value;
				if (!zeroEsquerda) {
					value = String(parseFloat(value));
				}
				return value;
			} else {
				changeViewValue(lastValidViewValue);
				return lastValidViewValue;
			}
		});
		
		ngModelCtrl.$formatters.push(function(valor) {
			if(valor){
				return atualizaValor(String(valor));
			}
		});
		
		// Auto-format precision on blur
		el.bind('blur', function() {
			atualizaValor();
			ngModelCtrl.$commitViewValue();
		});
	}

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/**
 * Implementação de 'directive', para Abrir o Calendário.
 * 
 * O input que estiver com "datepicker", abre o calendário ao ser clicado.
 */
diretiva.directive('datepicker', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ctrl) {

			$(function() {

				$(element).datepicker({
					format : 'dd/mm/yyyy',
					language: 'pt-BR',
					autoclose : true,
					startDate : '01/01/1900',
					endDate : '31/12/2999',
					todayHighlight : true,
					clearBtn : true
				});
			});

			$(element).on('change', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(element.val());
			});
      	});

		}
	}
});

/**
 * Implementação de 'directive', para controlar o Foco.
 * 
 * O componente que estiver com "data-focus", recebe o Foco.
 */
diretiva.directive('focus', function($timeout) {
	return {

		restrinct : 'A',

		link : function(scope, element) {
			$timeout(function() {
				element[0].focus();
			});
		}
	};
});

/**
 * Implementação de 'directive', para não permitir acentuação nos inputs
 */
diretiva.directive('semAcento', function() {
	return {

		restrinct : 'A',

		link : function(scope, element) {
			$(element).keypress(function(e,args){
				if (document.all){var evt=event.keyCode;} // caso seja IE
				else{var evt = e.charCode;}	// do contrário deve ser Mozilla
				var valid_chars = '0123456789abcdefghijlmnopqrstuvxzwykABCDEFGHIJLMNOPQRSTUVXZWYK-_ '+args;	// criando a lista de teclas permitidas
				var chr= String.fromCharCode(evt);	// pegando a tecla digitada
				if (valid_chars.indexOf(chr)>-1 ){return true;}	// se a tecla estiver na lista de permissão permite-a
				// para permitir teclas como <BACKSPACE> adicionamos uma permissão para 
				// códigos de tecla menores que 09 por exemplo (geralmente uso menores que 20)
				if (valid_chars.indexOf(chr)>-1 || evt < 9){return true;}	// se a tecla estiver na lista de permissão permite-a
				return false;	// do contrário nega
			});
		}
	};
});

/**
 * Seta o tabindex passado por parametro no elemento e adiciona o manipulador de
 * evento keydow para controlar a tabulação com enter entre os elementos do
 * formulario.
 */
diretiva.directive(
		'ngTabindex',
		function() {
			return {
				restrinct : 'A',
				link : function(scope, element, attrs) {
					$(element).attr('tabindex', attrs.ngTabindex);
					$(element).keydown(
							function(event) {
								var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
								if (keyCode == 13) {
								var field = document.getElementById($(this).attr('id'));
								event.preventDefault();
								var isFocado = false;
								$($("form[name = '" + field.form.name +"']").prop('elements')).each(function(){
									
									if($(this).is(':enabled')){//verifica se o elemento esta habilitado
										var indexField = parseInt($(this).attr('tabindex'));
										var condicao = indexField > field.tabIndex;
										if(condicao){
											if(!isFocado){
												$(this).focus();
												$(this).select();
												isFocado = true;
											}
											
										}
									}
									
									
								});
									
						}

				});
				}
			}
		});

/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
diretiva.directive('ngThumb', ['$window', function($window) {
     var helper = {
         support: !!($window.FileReader && $window.CanvasRenderingContext2D),
         isFile: function(item) {
             return angular.isObject(item) && item instanceof $window.File;
         },
         isImage: function(file) {
             var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
             return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
         }
     };

     return {
         restrict: 'A',
         template: '<canvas/>',
         link: function(scope, element, attributes) {
             if (!helper.support) return;

             var params = scope.$eval(attributes.ngThumb);

             if (!helper.isFile(params.file)) return;
             if (!helper.isImage(params.file)) return;

             var canvas = element.find('canvas');
             var reader = new FileReader();

             reader.onload = onLoadFile;
             reader.readAsDataURL(params.file);

             function onLoadFile(event) {
                 var img = new Image();
                 img.onload = onLoadImage;
                 img.src = event.target.result;
             }

             function onLoadImage() {
                 var width = params.width || this.width / this.height * params.height;
                 var height = params.height || this.height / this.width * params.width;
                 canvas.attr({ width: width, height: height });
                 canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
             }
         }
     };
 }]);

/**
 * Implementação de diretiva para chamar um tooltip
 */
diretiva.directive('tooltip', function () {
    return {
        restrinct: 'A',
        link: function (scope, element, attrs) {
            $(element).tooltip({
                trigger: 'hover',
                html: true,
                title: attrs.tooltip,
                placement: attrs.posicao
            });
        }
    }
});

/**
 * Implementação de 'mascaras', para Criação de Mascaras para CPF/CNPJ
 * 
 * Adicione data-mascara-cpfcnpj ao imput.
 * Faz a Conversão Automatica De Mascara De acordo com o Digitado
 *  
 */
diretiva.directive('mascaraCpfcnpj', function($filter) {

	function link(scope, el, attrs, ngModelCtrl) {
		var tokens = { '9' : { mascara: /(\d)$/ , caracter: /[^\d]/g } };

		var cpf ='999.999.999-99',
		cnpj    ='99.999.999\/9999-99',
		mascara = cpf;
		
		function atualizaValor(valor){
			
			valor = aplicaMascara(valor , mascara);
			ngModelCtrl.$viewValue = valor;
			ngModelCtrl.$render();
			
			return valor;
			
		}

		ngModelCtrl.$parsers.push(function(valor) {
			if(valor){
				valor = atualizaValor(valor);
				return clear(valor,0);
			}
		});
		
		ngModelCtrl.$formatters.push(function(valor) {
			if(valor){
				return atualizaValor(String(valor));
			}
		});
		

		function clear(valor , ind){
			
			return valor.replace(/[^\d]/g,'');
						
		}
		
		function aplicaMascara(valor, mascara) {

            valor = clear(valor, 0);
			if(valor.length > 11){
				mascara = cnpj;
			}
			
			var formatted = '';
			var valuePos = 0;
			var tamanho = mascara.length < valor.length ? mascara.length : valor.length;
			
			
			function temTokens(pattern, pos, inc) {
				var pc = pattern.charAt(pos);
				var token = tokens[pc];
				if (pc === '') return false;
				return token ? true : temTokens(pattern, pos + inc, inc);
			}
			
			function continua() {
				if (temTokens(mascara, i, 1)) {
					return true;
				}
				return i < mascara.length && i >= 0;
			}

			
	
			for (var i = 0; continua() ; i++ ) {
				var pc = mascara.charAt(i);
				var vc = String(valor).charAt(valuePos);
				var token = tokens[pc];
				
				if(token){
					if (token.mascara.test(vc)) {
						formatted += vc;
						valuePos++;
					}
					if(vc === '') break;
				}else{
					formatted += pc;
				}
				
			}
	
			return formatted;
	
		}
		
		// Auto-format on blur
		el.bind('blur', function() {
			var valor = ngModelCtrl.$viewValue;
			if(valor){
				if(valor.length < mascara.length){
					valor = "";
					ngModelCtrl.$modelValue = valor;
				}
				atualizaValor(valor);
				ngModelCtrl.$commitViewValue();
			}
		});
	
	}

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
	
});