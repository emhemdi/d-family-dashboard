angular.module('karizma.configuration')
    .controller('ConfigurationController', ['$scope', '$http', '$route', 'Configuration',
        function ($scope, $http, $route, Configuration) {
            $scope.config = $route.current.locals.config || new Configuration();

            

            
            $scope.save = function () {
                $scope.ui.block();
               
                    $scope.config.save(null, {
                        useMasterKey: true
                    }).then(function () {
                        $scope.ui.unblock();
                    }, function() {
                        $scope.ui.unblock();                        
                    });
                
            };
        }
    ]);