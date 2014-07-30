/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('lme-sidebar').directive('sidebarBtn', ['$log',function($log) {
    return {
        restrict: 'A',
        scope: true,
        link: function($scope, $element, $attrs) {
            $scope.openned = $element.hasClass('open');
            $element.on('click', function() {
                $scope.$apply(function(){
                    $scope.openned = !$scope.openned;
                })
            });
            $scope.$watch('openned', function(n) {
                if (n) {
                    $element.addClass('open');
                } else {
                    $element.removeClass('open');
                }
            });
            $scope.initBtn = function(position,options){
                $element.addClass('sidebar-btn-'+position);
                try {
                    if(options.open === true){
                        $scope.openned = true;  
                    }
                } catch(e){
                    //TODO voir si options obligatoire
                }
                
            };
            $element.addClass('sidebar-btn');
            
            
        }
    };
}]);

