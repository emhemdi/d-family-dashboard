angular.module('karizma.configuration', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/configuration', {
                templateUrl: '/template/configuration/index',
                controller: 'ConfigurationController',
                resolve: {
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                        query.include('aboutAppContent,whoAreWe,teamHistory');
                        return query.first();
                    }
                }
            });
    }]);