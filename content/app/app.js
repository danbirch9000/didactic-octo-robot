(function () {
    'use strict';
    //var type = require('type-detect');
    var internationalPortal = angular.module('internationalPortal', [

        'internationalPortal.core',
        // application
        'internationalPortal.showcase'
    ])
        .config(function ($routeProvider, $httpProvider) {
            $routeProvider.
            when('/', {
                templateUrl: '/views/login.html'
            }).
            when('/dashboard', {
                templateUrl: '/views/dashboard.html'
            }).
            when('/vehicle-data', {
                templateUrl: '/views/vehicle-data.html',
                controller: 'vehicleDataCtrl',
                controllerAs: 'vm'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });


        })

    /*
    .run(['$http', function ($http) {
        $http.defaults.headers.common['Authorization'] = 'Basic user:password';
    }]);
    */

})();



