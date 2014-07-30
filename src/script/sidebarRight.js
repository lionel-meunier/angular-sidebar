/**
 * Directive Left
 */
angular.module('lme-sidebar').directive('sidebarR',function(){
    return {
        restrict: 'A',
        scope : true,
        require: '?sidebar',
        link : function($scope, $element, $attrs, ctrl){
             try {
                console.log('sidebarR',ctrl.name);
            } catch (e){
                console.log('sidebarR',e);
            }
            //ctrl.addLeft($scope,$element);
            
        }
    };
});

