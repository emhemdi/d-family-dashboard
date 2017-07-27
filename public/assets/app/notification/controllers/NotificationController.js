angular.module('karizma.notification')
    .controller('NotificationController', ['$scope', '$http', '$timeout',
        function ($scope, $http, $timeout) {
            $scope.send = function () {
                $scope.ui.block();
                var query = new Parse.Query(Parse.Installation);
                Parse.Push.send({
                    where: query,
                    data: {
                        alert: $scope.message,
                        sound: 'default'
                    }
                }, {
                    useMasterKey: true,
                    success: function () {
                        $timeout(function () {
                            $scope.ui.unblock();
                            $scope.message = null;
                            $scope.success = true;
                        });
                    },
                    error: function (error) {
                        $timeout(function () {
                            $scope.ui.unblock();
                            $scope.error = error.message;
                        });
                    }
                });
            };
        }
    ]);