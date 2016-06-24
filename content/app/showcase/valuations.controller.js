(function () {
    'use strict';

    angular
        .module('internationalPortal.showcase')
        .controller('valuationsCtrl', valuationsCtrl);

    valuationsCtrl.$inject = ['dataService'];

    function valuationsCtrl(dataService) {
        var vm = this;
        
        vm.test = "Valuations";

    }


})();