/* 
 * Partie incluant la directive sidebar dépandant des autres
 */

angular.module('lme-sidebar').directive('sidebar', ['$http','$templateCache','$compile',function($http,$templateCache,$compile) {
    return {
        name : 'sidebar',
        scope: true,
        restrict: 'A',
        controller: function($scope,$element) {
            var currentOpenned, scopeLeft = [], scopeRight = [],button , btnTemplate;
            this.addLeft = function(scope, element) { // this refers to the controller
                scopeLeft.push(scope);
                var buttonClone = button.clone();
                buttonClone.append(text);
                $element.prepend(buttonClone);
                //Il faut le compiler si il est pas présent
                $compile(buttonClone)(scope); 
            };
            this.addRight = function(scope, element) { // this refers to the controller
                scopeRight.push(scope);
            };
            this.cstrBtn = function(){
                _.each(scopeLeft,function(scope,ite){
                    
                });
            };
            $http.get('template/sidebarButton.html',{cache: $templateCache}).then(function(result){
                button = angular.element(result.data);
            });
            
        },
        compile: function compile(tElement, tAttrs) {
            
            console.log('Compile');
            //Ajout de la classe conteneur
            tElement.addClass('sidebar-content');
            //Detection des attributs sidebar-left et right
            var sidebarL = tElement.find('[sidebar-l]');
            if(_.size(sidebarL) > 0) {
                $http.get('template/sidebarLeftContent.html',{cache: $templateCache}).then(function(result){
                    var contentLeft = angular.element(result.data);
                    contentLeft.append(sidebarL);
                    tElement.prepend(contentLeft);
                });
            }
            var sidebarR = tElement.find('[sidebar-r]');
            if(_.size(sidebarR) > 0) {
                $http.get('template/sidebarRightContent.html',{cache: $templateCache}).then(function(result){
                    var contentRight = angular.element(result.data);
                    contentRight.append(sidebarR);
                    tElement.prepend(contentRight);
                });
            }
            
            return function(scope, element, attrs, ctrl) {
                
            };
        }
    };
}]);
