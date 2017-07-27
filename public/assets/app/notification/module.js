angular.module('karizma.notification', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/notifications', {
                templateUrl: '/template/notification/index',
                controller: 'NotificationController'
            });
    }]);