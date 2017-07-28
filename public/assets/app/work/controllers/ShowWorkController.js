angular
    .module('karizma.work')
    .controller('ShowWorkController', [
        '$scope',
        '$http',
        '$timeout',
        '$route',
        '$q',
        'ValidationService',
        'Work',
        'Comment',
        'Language',
        'pictureSizeFilter',
        function ($scope, $http, $timeout, $route, $q, ValidationService, Work, Comment, Language, pictureSizeFilter) {

            $scope.work = $route.current.locals.work;

            $scope.selectItem = function (item, comment) {
                if (comment) {
                    var query = new Comment.Query();
                    query
                        .descending('createdAt')
                        .include('user')
                        .paged(1, 99999999999999)
                        .find()
                        .then(function (comments) {
                            $scope.comments = comments;

                        });

                }

            };

        }
    ]);