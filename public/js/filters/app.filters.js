(function() {
    'use strict';

    var app = angular.module('TicTacApp');

    // filter for unique values in 1D array
    app.filter('UniqueArray', UniqueArrayFilter);
    function UniqueArrayFilter() {
        return function(arr) {
            return arr.filter(function(item, pos) {
                return arr.indexOf(item) == pos;
            });
        };
    };

})();