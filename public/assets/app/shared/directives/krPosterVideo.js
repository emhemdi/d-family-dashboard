
    angular.module('karizma.shared')
    .directive('krPosterVideo',['$timeout', function($timeout) {
        return {
            restrict: 'E',
            template: '<img src="{{src}}" style="width:100%;height:100%"/><button type="button" ng-click="refresh()">refresh</button>',
            link: function(scope, element, attr) {
              var videoId= attr.videoId;  
             var scale = 0.25;
            
            
        scope.refresh=function(){
        var video = $("#"+videoId).get(0);  
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas.getContext('2d')
              .drawImage(video, 0, 0, canvas.width, canvas.height);
 
       
        console.log(canvas.toDataURL());
        scope.src=canvas.toDataURL();
        }
              
            }
        };
    }]);