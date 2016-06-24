(function () {
    'use strict';

    angular
        .module('internationalPortal.core')
        .filter('titleCase', function () {
            return function (input) {
                //console.log(input);
                //input = input || '';
                if (typeof input == "string") {
                    var result = input.replace(/([A-Z])/g, " $1");
                    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                    return finalResult;
                } else {
                    return input;
                }

            };
        })
})();
