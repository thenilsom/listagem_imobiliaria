(function() {
    angular
        .module("adminManagerMain")
        .controller("FiancaController", ["fiancaService", "$window", "$routeParams", FiancaController]);

    function FiancaController(fiancaService, $window, $routeParams) {
        var vm = this;
        fiancaService.getFianca().then(function(response) {
            checkAuthAccess(response);
            vm.fiancas = response;
        });
        
        /* Helper function to clear search query input string */
        vm.clearSearch = function() {
            vm.searchText = "";
        }

        /* Check for authenticity of user - logged not logged in */
        var checkAuthAccess = function(response) {
            if(response.error) {
                toastr.options = {
                            "preventDuplicates": true,
                            "preventOpenDuplicates": true,
                            "newestOnTop": false
                        };
                toastr.error(response.error, "Critical Error");
                var redirectPath = 
                        $window.location.origin
                        + $window.location.pathname.substring(0, $window.location.pathname.lastIndexOf("/"))
                        + "/index.html";
                toastr.info("Voce sera redirecionado em 5 segundos.", "INFORMACAO", { onHidden: function() { $window.location.href = redirectPath; }});
                return ;
            }
        }

    }
}());