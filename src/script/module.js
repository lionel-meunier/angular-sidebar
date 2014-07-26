/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sidebarLeftTemplate = ''+
    '<div>'+
    '<div class="sidebar-left-button" ng-click="toggleOpen()" ng-class="{\'open\':openned}">Button</div>'+
    '<div ng-transclude class="sidebar-left" ng-class="{\'open\':openned}"></div>'+
    '</div>';

var sidebarRightTemplate = ''+
    '<div>'+
    '<div class="sidebar-right-button" ng-click="toggleOpen()" ng-class="{\'open\':openned}">Button</div>'+
    '<div ng-transclude class="sidebar-right" ng-class="{\'open\':openned}"></div>'+
    '</div>';
var sidebarContentTemplate = ''+
    '<div class="sidebar-content">'+
    '<div ng-transclude class="sidebar-center" ng-class="{\'open\':openned}"></div>'+
    '</div>';
angular.module('lme-sidebar',[]);

/**
 * Directive Content
 */
angular.module('lme-sidebar').directive('sidebarContent',function(){
    return {
        template : sidebarContentTemplate,
        replace : true,
        transclude : true,
        scope : true,
        controller : function($scope) {
            var currentOpenned,scopeLeft,scopeRight,elLeft,elRight;
            this.addLeft = function(scope,element) { // this refers to the controller
                scopeLeft = scope;
                elLeft = element;
            };
            this.addRight = function(scope,element) { // this refers to the controller
                scopeRight = scope;
                elRight = element;
            };
            this.setCurrent = function(current){
                if(current === 'left'){
                    scopeRight.openned = false;
                }
                if(current === 'right'){
                    scopeLeft.openned = false;
                }
            };
        }
    };
});

/**
 * Directive Left
 */
angular.module('lme-sidebar').directive('sidebarLeft',function(){
    return {
        template : sidebarLeftTemplate,
        replace : true,
        transclude : true,
        scope : true,
        require: '^sidebarContent',
        link : function($scope, $element, $attrs, ctrl){
            $scope.openned = false;
            $scope.toggleOpen = function(){
                $scope.openned = !$scope.openned; 
                if($scope.openned === true){
                   ctrl.setCurrent('left');
                }
            };
            ctrl.addLeft($scope,$element);
        }
    };
});
/**
 * Directive Right
 */
angular.module('lme-sidebar').directive('sidebarRight',function(){
    return {
        template : sidebarRightTemplate,
        replace : true,
        transclude : true,
        scope : true,
        require: '^sidebarContent',
        link : function($scope, $element, $attrs, ctrl){
            $scope.openned = false;
            $scope.toggleOpen = function(){
                $scope.openned = !$scope.openned; 
                if($scope.openned === true){
                    ctrl.setCurrent('right');
                }
            };
            ctrl.addRight($scope,$element);
        }
    };
});


