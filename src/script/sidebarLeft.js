
var sidebarDirectives = {};
angular.forEach(
        'left right'.split(' '),
        function(name) {
            var directiveName = _('sidebar-' + name).camelize();
            sidebarDirectives[directiveName] = ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {
                    var createBtn = function(tmpl, scope) {
                        return $compile(angular.element(tmpl))(scope);
                    };
                    var initScopeBtn = function(elementParent, btn, options) {
                        elementParent.before(btn);
                        var scopeBtn = btn.scope();
                        scopeBtn.$watch('openned', function(n) {
                            if (n) {
                                elementParent.addClass('open');
                            } else {
                                elementParent.removeClass('open');
                            }
                        });
                        scopeBtn.initBtn(name,options);
                    };
                    return {
                        restrict: 'A',
                        link: function($scope, $element, $attrs) {
                            var options = $scope.$eval($attrs[directiveName]);
                            var ctrl = $element.controller('sidebar');
                            //Pas de controleur pour l'instant
                            var button = $element.find('[sidebar-btn]');
                            if (_.size(button) !== 1) {
                                //Créer le bouton
                                $http.get('template/sidebarButton.html', {cache: $templateCache}).then(function(result) {
                                    button = createBtn(result.data, $scope);
                                    initScopeBtn($element, button ,options);
                                });
                            } else {
                                //Déja créer le déplacer et faire la correspondance
                                initScopeBtn($element, button);
                            }
                            $element.addClass('sidebar-'+name);
                        }
                    };
                }];
        }
);
angular.module('lme-sidebar').directive(sidebarDirectives);
angular.module('lme-sidebar').run(['$templateCache', function($templateCache) {
        'use strict';

        $templateCache.put('template/sidebarButton.html',
                '<div sidebar-btn class="btn">{{openned}} TEST</div>'
                );
    }]);

