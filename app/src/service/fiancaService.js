(function() {
    angular
        .module("adminManagerMain")
        .factory('fiancaService', function($http, $routeParams) {
            var baseUrl = "api/admin/fianca/";

            var getFianca = function() {
                return $http({
                            method: 'GET',
                            url: baseUrl + 'getFianca.php'
                        }).then(successFn, errorFn);
            };
            var successFn = function(response) {
                return response.data;
            }
            var errorFn = function(error) {
                console.warn("Error in GET or POST",error);
                return error.data;
            }

            return {
                getFianca: getFianca
            };
        });
}());