angular.module('karizma.work', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/works', {
                templateUrl: '/template/work/index',
                controller: 'WorkController'
                
            }) .when('/works/:id', {
                templateUrl: '/template/work/show',
                controller: 'ShowWorkController',
                resolve: {
                    work: function ($route,Work) {
                        return Work.get($route.current.params.id, 'title', true);
                    }
                }
            });
    }]);