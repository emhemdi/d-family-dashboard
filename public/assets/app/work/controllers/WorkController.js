angular.module('karizma.work')

    .controller('WorkController', ['$scope', '$http','$timeout','$q','ValidationService', 'Work','Comment', 'Language', 'pictureSizeFilter',
        function ($scope, $http,$timeout,$q,ValidationService, Work,Comment, Language, pictureSizeFilter) {

            
          

            $scope.filters = {
                page: 1,
                pageSize: 12,
            };

            $scope.imagesQueue = [];
            var validationRules = {
               
                'title': {
                    arabicName: 'العنوان',
                    required: true,
                    multiLang: true
                },
                'video': {
                    arabicName: 'الفيديو',
                    required: true,
                    isImage: true,
                    queueKey: 'videoQueue',
                    isArray: true
                },
                'images': {
                    arabicName: 'الصور',
                    required: true,
                    isImage: true,
                    queueKey: 'imagesQueue',
                    isArray: true
                }
            };
             var countQuery = new Work.Query();
            countQuery.count().then(function (count) {
                $scope.$broadcast('total-updated', {
                    total: count,
                    pageSize: $scope.filters.pageSize
                });
            });

            var refresh = function () {
                var query = new Work.Query();
                $scope.ui && $scope.ui.block();
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .include('title,content')
                    .descending('createdAt')
                    .search($scope.filters.search, ['title'], true)
                    .find()
                    .then(function (works) {
                        $scope.works = works;
                        $scope.ui.unblock();
                    });
            };

            $scope.selectItem = function (item,comment) {
                if(comment){
                    var query = new Comment.Query();
                    query.descending('createdAt')
                     .include('user')
                    .paged(1,99999999999999)
                    .find()
                    .then(function (comments) {
                        $scope.comments = comments;
                        
                    });

                }
                if (!item) {
                    item = new Work();
                    item.title = new Language();
                    item.content = new Language();
                }

                $scope.imagesQueue.length = 0;
                $scope.videoQueue.length = 0;

                if (item.thumbnail) {
                    $scope.imagesQueue = [{
                            name: 'bg-',
                            url: item.thumbnail,
                            state: 'uploaded'
                        }];
                    

                    $scope.imageUploader.refreshQueue($scope.imagesQueue);
                }
                if (item.video) {
                    $scope.videoQueue = [{
                            name: 'bg-',
                            url: item.video,
                            state: 'uploaded'
                        }];
                    

                    $scope.videoUploader.refreshQueue($scope.videoQueue);
                }

                $scope.selectedItem = item;
            };

            $scope.fileUploaded = function (fileInfo, object) {
                
                $scope.selectedItem.thumbnail=fileInfo.url;
            };
             $scope.fileRemoved = function (fileInfo, index) {
                $scope.selectedItem.thumbnail = null;
            };
            $scope.videoUploaded = function (fileInfo, object) {
                $scope.selectedItem.video = fileInfo.url;
            };

            $scope.videoRemoved = function (fileInfo, index) {
                $scope.selectedItem.video = null;
                
            };
            function uploadfiles() {
                var promises = [];
                promises.push($scope.imageUploader.upload());
                promises.push($scope.videoUploader.upload());
                return $q.all(promises);
            }

            

            $scope.cancel = function () {
                $scope.selectedItem.revert();
            };

           

            $scope.save = function () {
                 $scope.errors = [];
                if (!ValidationService.validate($scope, $scope.selectedItem, validationRules, $scope.errors)) {
                    return;
                }
                $scope.modalUI.block();
                uploadfiles().then(function () {
                    $scope.selectedItem.save(null, {
                        useMasterKey: true
                    }).then(function () {
                        $scope.modalUI.unblock();
                        $scope.workModal.hide();
                        refresh();
                    },function(errors){
                         $scope.modalUI.unblock();
                        $scope.workModal.hide();
                         swal({
                                    title: "حدث خطأ!",
                                    text: "حدث خطأ أثناء حفظ البيانات",
                                    type: "error",
                                    confirmButtonClass: "red",
                                    confirmButtonText: "أغلق"
                                });
                    });
                },function(errors){
                     $scope.modalUI.unblock();
                        $scope.workModal.hide();
                        swal({
                                    title: "حدث خطأ!",
                                    text: "حدث خطأ أثناء حفظ البيانات",
                                    type: "error",
                                    confirmButtonClass: "red",
                                    confirmButtonText: "أغلق"
                                });
                });
            };
             $scope.delete = function (item) {
               
                swal({
                            title: "هل أنت متأكد؟",
                            
                            showCancelButton: true,
                            confirmButtonClass: "red",
                            confirmButtonText: "نعم، احذف",
                            cancelButtonText: "إلغاء",
                            closeOnConfirm: false
                        },
                        function () {
                            item.destroy({
                                useMasterKey: true
                            }).then(function (res) {
                                

                                 $timeout(function () {

                                $scope.works = _.filter($scope.works, function (o) {
                                    return o.id != item.id;
                                });
                               
                            });
                                
                                swal({
                                    title: "تم الحذف!",
                                    text: "تم حذف البيانات نهائيا",
                                    
                                   timer: 2000,
                                    showConfirmButton: false
                                });

                               

                            }, function (res) {
                                swal({
                                    title: "حدث خطأ!",
                                    text: "حدث خطأ أثناء حذف البيانات",
                                    type: "error",
                                   timer: 2000,
                                    showConfirmButton: false
                                });
                            });
                        });
            };

            $scope.$watch('filters', refresh, true);
        }
    ]);