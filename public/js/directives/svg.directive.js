var myApp = angular.module('TicTacApp');

myApp.directive('svgkeys', ['$compile', function($compile) {
    return {
        restrict: 'A',
        templateUrl: 'img/gameboard.svg',
        link: function(scope, element, attrs) {
            var keys = element[0].querySelectorAll('rect');
            angular.forEach(keys, function(path, key) {
                var myKey = angular.element(path);
                myKey.attr("mykey", "");
                // $compile(myKey)(scope);
            });
        }
    }
}]);

myApp.directive('mykey', ['$compile', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.elementId = element.attr("id");
            scope.regionClick = function () {
                console.log(scope.dummyData[scope.elementId].value);
            };
            element.attr("ng-click", "regionClick()");
            $compile(element)(scope);
        }
    }
}]);