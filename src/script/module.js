/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
_.mixin(_.str.exports());
angular.module('lme-sidebar',[]);



angular.module('lme-sidebar').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/sidebarLeft.html',
    '<div>'+
    '<div class="sidebar-left-button" ng-click="toggleOpen()" ng-class="{\'open\':openned}">Button</div>'+
    '<div ng-transclude class="sidebar-left" ng-class="{\'open\':openned}"></div>'+
    '</div>'
  );

$templateCache.put('template/sidebarRight.html',
    '<div>'+
    '<div class="sidebar-right-button" ng-click="toggleOpen()" ng-class="{\'open\':openned}">Button</div>'+
    '<div ng-transclude class="sidebar-right" ng-class="{\'open\':openned}"></div>'+
    '</div>'
  );
    
$templateCache.put('template/sidebarContent.html',
    '<div class="sidebar-content">'+
    '<div ng-transclude class="sidebar-center" ng-class="{\'open\':openned}"></div>'+
    '</div>'
  );
$templateCache.put('template/sidebar.html',
    '<div class="sidebar-content">'+
    '<div ng-transclude class="sidebar-center" ng-class="{\'open\':openned}"></div>'+
    '</div>'
  );
$templateCache.put('template/sidebarLeftContent.html',
    '<div class="sidebar-left-content"></div>'
  );
$templateCache.put('template/sidebarRightContent.html',
    '<div class="sidebar-right-content"></div>'
  );
$templateCache.put('template/sidebarButton.html',
    '<div sidebar-btn class="btn" ng-click="toggleOpen()">{{openned}}</div>'
  );
}]);