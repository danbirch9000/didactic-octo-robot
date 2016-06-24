(function () {
    'use strict';

    angular
           .module('internationalPortal.showcase')
           .directive('jsonTree', jsonTree);

    function jsonTree() {
        return {
            restrict: 'E',
            scope: {
                jsonTreeData: '='
            },
            link: function (scope, element, attrs) {

                scope.dataType = null;
                scope.dataTypeChildren = 0;

                if (check.array(scope.jsonTreeData)) {
                    scope.dataType = "array";
                }
                if (check.object(scope.jsonTreeData)) {
                    scope.dataType = "object";
                }
                if (check.string(scope.jsonTreeData)) {
                    scope.dataType = "string";
                }
                if (check.number(scope.jsonTreeData)) {
                    scope.dataType = "number";
                }
                if (scope.dataType == null) {
                    scope.dataType = "object";
                }

                scope.hasChildren = function (val) {
                    if(check.array(val)){
                        return true;
                    }else{
                        return false;
                    }
                }

                scope.isHeader = function (val) {
                    if (check.array(val) || check.object(val)) {
                        return true;
                    } else {
                        return false;
                    }
                }

            },
            templateUrl: "content/app/showcase/jsonTree.directive.view.html"
        };
    }
})();

