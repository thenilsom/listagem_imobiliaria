var diretiva = angular.module('diretiva', []);

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
                placement: 'top'
            });
        }
    }
});