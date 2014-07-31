/**
 * 
 * Sidebar left and right
 */
_.mixin(_.str.exports());
angular.module('lme-sidebar', []);

var names = 'left right'.split(' ');

angular.module('lme-sidebar').provider('sidebarOptions', function sidebarOptionsProvider() {
    var optionsDefault = {
        open: false,
        showOpen: true
    };
    var optionsDefaultMultiple = {
        left: {
            open: false,
            pinned: false,
            showOpen: true,
            items: []
        },
        right: {
            open: false,
            pinned: false,
            showOpen: true,
            items: []
        },
    };

    this.$get = [function() {
            function sidebarOptions() {
                
            }
            sidebarOptions.prototype.getOptionsDefault = function(){
                return optionsDefault;
            };
            sidebarOptions.prototype.getOptionsDefaultMultiple = function(){
                return optionsDefaultMultiple;
            };
            sidebarOptions.prototype.merge = function(dest,source){
                var self = this;
                _.each(source, function(value, name) {
                    if (angular.isUndefined(dest[name])) {
                        dest[name] = value;
                    } else if (angular.isObject(dest[name])) {
                        self.merge(dest[name], source[name]);
                    }
                });
            };
                    
            // let's assume that the UnicornLauncher constructor was also changed to
            // accept and use the useTinfoilShielding argument
            return new sidebarOptions();
        }];
    
    
});

var sidebarDirectives = {};


angular.forEach(
        names,
        function(name) {
            var directiveName = _('sidebar-' + name).camelize();
            sidebarDirectives[directiveName] = ['$compile', '$http', '$templateCache','sidebarOptions', function($compile, $http, $templateCache,sidebarOptions) {
                    return {
                        templateUrl: 'template/' + directiveName + '.html',
                        transclude: true,
                        replace: true,
                        controller: function($scope, $element, $attrs) {
                            $scope.$sidebar = $scope.$eval($attrs[directiveName]);

                            if (angular.isUndefined($scope.$sidebar)) {
                                $scope.$sidebar = _.clone(sidebarOptions.getOptionsDefault());
                            } else {
                                //Config default
                                sidebarOptions.merge($scope.$sidebar, sidebarOptions.getOptionsDefault());
                            }
                            //Sauver le contenaire du bouton
                            this.btnOpenContent = $element.find('.sidebar-btn-open');
                        },
                        restrict: 'A',
                        scope: true,
                        link: function($scope, $element, $attrs, ctrl) {
                            //Deplacer le contenaire du bouton
                            $element.before(ctrl.btnOpenContent);
                            var buttonOpen = $element.find('[sidebar-btn-open]');
                            if (_.size(buttonOpen) === 1) {
                                //surcharger le bouton
                                ctrl.btnOpenContent.html(buttonOpen);
                            }
                            //Detection d'u controleur
                            var ctrlSidebar = $element.controller('sidebar');
                            if (!angular.isUndefined(ctrlSidebar)) {
                                ctrlSidebar.add($scope, $element, ctrl, name);
                            }
                        }
                    };
                }];
        }
);
angular.module('lme-sidebar').directive(sidebarDirectives);

angular.module('lme-sidebar').run(['$templateCache', function($templateCache) {
        'use strict';
        var getNameOpposite = function(name) {
            if (name === 'left')
                return 'right';
            if (name === 'right')
                return 'left';
            return '';
        };
        angular.forEach(names,
                function(name) {
                    var directiveName = _('sidebar-' + name).camelize();
                    $templateCache.put('template/' + directiveName + '.html',
                            '<div class="sidebar-' + name + ' panel panel-default" ng-class="{\'open\':$sidebar.open}">' +
                            '<div class="sidebar-btn-open sidebar-btn-' + name + '" ng-show="$sidebar.showOpen" ng-click="$sidebar.open=!$sidebar.open" ng-class="{\'open\':$sidebar.open}">' +
                            '<div class="btn btn-default">' +
                            '<span class="fa" ng-class="{\'fa-angle-double-' + getNameOpposite(name) + '\':$sidebar.open,\'fa-angle-double-' + name + '\':!$sidebar.open}">' +
                            '</div>' +
                            '</div>' +
                            '<div class="panel-body">' +
                            '<div ng-transclude></div>' +
                            '</div>' +
                            '</div>'
                            );
                    $templateCache.put('template/sidebar' + _.str.capitalize(name) + 'Content.html',
                            '<div class="sidebar-' + name + '-content" ng-class="{\'open\':$sidebar.' + name + '.open,\'pinned\':$sidebar.' + name + '.pinned}">' +
                            '<div>' +
                            '</div>' +
                            '</div>'
                            );
                    $templateCache.put('template/sidebarBtn' + _.str.capitalize(name) + 'Content.html',
                            '<div class="sidebar-btn-content sidebar-btn-' + name + '-content" ng-show="$sidebar.' + name + '.showOpen" ng-click="open(\'' + name + '\')" ng-class="{\'open\':$sidebar.' + name + '.open}">' +
                            '</div>'
                            );
                });


    }]);

angular.module('lme-sidebar').directive('sidebar', ['$http', '$templateCache', '$compile','sidebarOptions', function($http, $templateCache, $compile, sidebarOptions) {
        return {
            name: 'sidebar',
            scope: true,
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                var self = this;
                $scope.$sidebar = $scope.$eval($attrs['sidebar']);
                if (angular.isUndefined($scope.$sidebar)) {
                    $scope.$sidebar = _.clone(sidebarOptions.getOptionsDefaultMultiple());
                } else {
                    //Config default
                    sidebarOptions.merge($scope.$sidebar, sidebarOptions.getOptionsDefaultMultiple());
                }
                this.add = function(scope, element, ctrl, direction) {
                    scope.$sidebar.showOpen = true;
                    //Initialisation de open
                    if (scope.$sidebar.open && $scope.$sidebar[direction].open) {
                        scope.$sidebar.open = false;
                    } else if (scope.$sidebar.open) {
                        $scope.$sidebar[direction].open = true;
                        $scope.$sidebar[direction].current = scope.$id;
                    }
                    var subSidebar = {
                        scope: scope, element: element, ctrl: ctrl,
                    };
                    $scope.$sidebar[direction].items.push(subSidebar);
                    self[direction + 'BtnContent'].append(ctrl.btnOpenContent);
                    self[direction + 'Content'].children().append(element);
                };
                $scope.getSubOpen = function(direction) {
                    return _.filter($scope.$sidebar[direction].items, function(el) {
                        return el.scope.$sidebar.open;
                    });
                };
                $scope.getCurrent = function(direction) {
                    return _.find($scope.$sidebar[direction].items, function(el) {
                        return el.scope.$id === $scope.$sidebar[direction].current;
                    });
                };
                $scope.open = function(direction) {

                    var subItemsOpen = $scope.getSubOpen(direction);
                    if (_.size(subItemsOpen) === 0) {
                        //Si pinned reactive le current
                        if ($scope.$sidebar[direction].pinned === true) {
                            var current = $scope.getCurrent(direction);
                            current.scope.$sidebar.open = true;
                            console.log(current);
                        } else {
                            $scope.$sidebar[direction].open = false;
                        }
                    } else if (_.size(subItemsOpen) === 1) {
                        //Save current
                        $scope.$sidebar[direction].current = _.first(subItemsOpen).scope.$id;
                        $scope.$sidebar[direction].open = true;
                    } else if (_.size(subItemsOpen) > 1) {
                        if ($scope.$sidebar[direction].current) {
                            var current = $scope.getCurrent(direction);
                            current.scope.$sidebar.open = false;
                            subItemsOpen = $scope.getSubOpen(direction);
                            $scope.$sidebar[direction].current = _.first(subItemsOpen).scope.$id;
                        }
                    }
                    //Pour l'inclusion du 
                };
            },
            link: function($scope, $element, $attrs, ctrl) {
                ctrl.leftContent = angular.element($templateCache.get("template/sidebarLeftContent.html"));
                ctrl.leftBtnContent = angular.element($templateCache.get("template/sidebarBtnLeftContent.html"));
                ctrl.rightContent = angular.element($templateCache.get("template/sidebarRightContent.html"));
                ctrl.rightBtnContent = angular.element($templateCache.get("template/sidebarBtnRightContent.html"));
                //Construire les conteneur left et right
                if (_.size($element.find('[sidebar-left]')) > 0) {
                    //Construire les conteneur left
                    $element.prepend($compile(ctrl.leftContent)($scope));
                    $element.prepend($compile(ctrl.leftBtnContent)($scope));
                }
                if (_.size($element.find('[sidebar-right]')) > 0) {
                    //Construire les conteneur left
                    $element.prepend($compile(ctrl.rightContent)($scope));
                    $element.prepend($compile(ctrl.rightBtnContent)($scope));
                }
                //Gestion pinned or open class
                angular.forEach(names, function(name) {
                    $scope.$watch('$sidebar.' + name + '.pinned', function(n) {
                        if (n) {
                            $element.addClass('pinned-' + name);
                        } else {
                            $element.removeClass('pinned-' + name);
                        }
                    });
                    $scope.$watch('$sidebar.' + name + '.open', function(n) {
                        if (n) {
                            $element.addClass('open-' + name);
                        } else {
                            $element.removeClass('open-' + name);
                        }
                    });
                });
                $element.addClass('sidebar-content');
            }
        };
    }]);
